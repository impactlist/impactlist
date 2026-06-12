# src/server/ — shared-assumptions backend (server-only)

Modules backing the `/api/shared-assumptions` endpoints (Vercel serverless). **Never import these from client code** — they read env secrets. The client talks to the API via `src/utils/shareAssumptions.js`.

## Architecture

- Storage: Upstash Redis over REST (`upstashRedisClient.js` POSTs command arrays to `${restUrl}/pipeline`; 5s `AbortSignal.timeout`, fetch failures → 503 `redis_unavailable`). Config/env in `sharedAssumptionsConfig.js`: `SHARED_ASSUMPTIONS_REDIS_REST_URL/TOKEN` with `KV_REST_API_URL/TOKEN` fallback.
- Keys: `assumptions:snapshot:<12-char id>`, `assumptions:slug:<slug>` (NX-claimed, rollback on write failure), `assumptions:ratelimit:<scope>:<ip>`. Everything has a 365-day TTL.
- IDs: 12 chars of `[0-9a-z]` from `crypto.randomBytes` with rejection sampling (unbiased). Slugs are user-chosen, `SLUG_REGEX`-validated, reserved-list-checked.
- Rate limits (`RATE_LIMITS` in config, enforced by `enforceRateLimit(scope, ip)` via an atomic Lua INCR+EXPIRE): `save` 10/h, `read` 300/h, `health` 30/h per IP.
- Validation (`sharedAssumptionsValidation.js`): `validateCreatePayload` deep-validates snapshot values against `serverDefaultAssumptions` — known IDs/fields only, finite numbers (negative is legal — domain rule), boolean `disabled`, array effects, no `__proto__`/`constructor`/`prototype` keys. Size cap BEFORE shape (the `assumptions_too_large` contract depends on that order). `validateStoredAssumptions` re-validates on READ too, so pre-validation or schema-drifted snapshots return a logged `invalid_snapshot` 500 instead of crashing importers.
- The deep shape validation and diff-pruning normalization live in the SHARED module `src/utils/assumptionsNormalization.js` — the same code the client runs on library loads and imports. The server files here (`sharedAssumptionsValidation.js`, `sharedAssumptionsNormalization.js`) are thin wrappers injecting `SharedAssumptionsError(400, 'invalid_assumptions')` as the error type. Schema-rule changes go in the shared module (its messages are canonical lowercase, asserted by both client and server test suites); only server-specific concerns (size cap, slug/name/description rules) live here.
- Errors: `SharedAssumptionsError {status, code, message}`; `handleApiError` returns `{error: code, message}`, sends GENERIC messages for ≥500 (details go to logs only — never echo upstream Redis bodies), and `console.warn`s 429s as the abuse signal the monitoring plan watches.
- HTTP helpers (`sharedAssumptionsHttp.js`): `parseJsonBody` requires `Content-Type: application/json` (415 otherwise) and enforces the 120KB cap on ALL body paths — streamed, string, Buffer, and platform-pre-parsed object (Vercel parses JSON before handlers run, so the stream path is effectively dev-only).

## Testing

Every module has a co-located test; Redis is mocked via `vi.mock('./upstashRedisClient.js')` with per-call `mockResolvedValueOnce` sequences (rate-limit EVAL is always the first call on guarded paths). Route-level tests live in `tests/api/` — NOT next to the handlers, because Vercel deploys every `.js` file under `api/` as a serverless function (see the `api/` context file).
