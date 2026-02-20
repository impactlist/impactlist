# Shared Assumptions (Upstash Redis) Implementation Plan

## Objective
Add a feature that lets users:

1. Save current custom assumptions.
2. Receive a shareable URL.
3. Open someone else's shared assumptions via URL.
4. Import those assumptions into local state with clear, safe UX.

This plan uses Upstash Redis and intentionally avoids user accounts for the MVP.

## Product Decisions (Locked for MVP)

### 1) Link format and semantics
- Use: `/assumptions?shared=<reference>`
- `shared` is a one-time import instruction, not permanent navigation state.
- After import handling completes (success, decline, invalid, or error), remove only `shared` from URL using `replace` navigation.
- Keep other query params (`tab`, `categoryId`, `recipientId`, `activeCategory`) intact.

### 2) Snapshot mutability
- Shared snapshots are immutable (write-once).
- No update/delete endpoint in MVP.
- If users want changes, they save a new snapshot and get a new link.

### 3) Human-readable references
- Support both:
  - Canonical random ID (always generated).
  - Optional custom slug (user-chosen string).
- `shared` may be either an ID or slug.
- Slugs are public aliases; they are not ownership/auth.

### 4) Local override behavior on open
- If local custom assumptions already exist: show modal with three options:
  - `Save Mine First` (open share modal for current local assumptions, then import incoming shared assumptions)
  - `Replace Mine` (import incoming shared assumptions now)
  - `Keep Mine` (ignore incoming shared assumptions)
- If no local custom assumptions: auto-import and show success toast.
- If user chooses `Keep Mine`: do not modify local assumptions.

### 5) Data payload
- Store the normalized `userAssumptions` override object (not full derived data).
- Re-normalize on both save and load using existing `normalizeUserAssumptions`.

## Non-Goals (MVP)
- Public directory/search/discoverability.
- Edit/delete ownership flows.
- User accounts and authentication.
- Moderation dashboard.

## Architecture Overview

### Frontend
- Existing React app remains primary UI.
- Import flow added to `AssumptionsPage`/context layer.
- Share action added to assumptions UI (global actions area).

### Backend
- Add server endpoints for create/read shared snapshots.
- Upstash Redis stores snapshot records and slug mappings.
- Redis credentials only on server.
- All Redis access must go through these server endpoints (thin proxy); do not call Upstash directly from browser code.

### Hosting notes
- Current `vercel.json` rewrites all routes to `/index.html`.
- In Phase 0, verify whether `/api/*` already bypasses SPA rewrites in this deployment setup.
- Only change `vercel.json` if verification shows `/api/*` is being swallowed by the SPA rewrite.

## Redis Data Model

### Keys
- Snapshot: `assumptions:snapshot:<id>`
- Slug alias: `assumptions:slug:<slug> -> <id>`

### Snapshot JSON
```json
{
  "schemaVersion": 1,
  "createdAt": "2026-02-13T22:00:00.000Z",
  "appDataVersion": "content-hash-or-build-id",
  "name": "optional display name",
  "slug": "optional-custom-slug",
  "assumptions": {
    "globalParameters": {},
    "categories": {},
    "recipients": {}
  }
}
```

### TTL
- Recommended default: 365 days.
- Store with expiry at write time.
- If TTL strategy changes later, keep key namespace stable.

### ID policy
- Generate high-entropy canonical IDs (recommended 12+ chars via `nanoid` or equivalent CSPRNG output).
- Do not use short IDs that raise collision risk as volume grows.

## API Contract

### 1) Create snapshot
- `POST /api/shared-assumptions`

Request:
```json
{
  "assumptions": { "...": "userAssumptions object" },
  "name": "optional name",
  "slug": "optional-custom-slug"
}
```

Response 201:
```json
{
  "id": "k9f2m7q1x4bp",
  "slug": "my-ai-risk-model",
  "reference": "my-ai-risk-model",
  "shareUrl": "https://impactlist.xyz/assumptions?shared=my-ai-risk-model"
}
```

Implementation requirements:
- Slug claims must be atomic (`SET assumptions:slug:<slug> <id> NX EX <ttl>`) to prevent race conditions.
- Snapshot+alias writes must be consistency-safe:
  - Preferred: single transaction/script for multi-key write.
  - Acceptable fallback: deterministic rollback on partial failure.
- `shareUrl` must be built from runtime origin (request host/proto) or controlled env fallback, not hardcoded.

Errors:
- `400` invalid payload/invalid slug/no effective assumptions.
- `409` slug already taken.
- `413` assumptions payload too large.
- `429` rate limit hit.
- `500` server/storage error.

### 2) Resolve/read snapshot
- `GET /api/shared-assumptions/:reference`
- Server resolution order:
  1. Check `assumptions:slug:<reference>` alias.
  2. If found, use mapped ID.
  3. Else treat as direct ID.
  4. Read `assumptions:snapshot:<id>`.

Response 200:
```json
{
  "id": "k9f2m7q1x4bp",
  "slug": "my-ai-risk-model",
  "name": "optional name",
  "createdAt": "2026-02-13T22:00:00.000Z",
  "assumptions": { "...": "userAssumptions object" }
}
```

Errors:
- `404` not found/expired.
- `410` optional explicit expired handling (if tracked).
- `500` server/storage error.

## Slug Policy

### Format
- Regex: `^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$`
- Length: 3-40 chars.
- Lowercase only; trim and normalize input.

### Reserved values
- Reserve route-like words and app pages:
  - `assumptions`, `calculator`, `categories`, `recipients`, `faq`, `api`, `admin`, etc.

### Collision handling
- First-write wins.
- Enforce first-write atomically with `SET NX`; never rely on `EXISTS` + `SET`.
- If taken: return `409`.
- Optional response metadata can include suggestions:
  - `<slug>-2`
  - `<slug>-2026`

## Validation and Security

### Input validation
- Accept only object payloads with expected top-level keys:
  - `globalParameters`, `categories`, `recipients`.
- Drop unknown keys.
- Normalize against defaults via `normalizeUserAssumptions`.
- Keep server validation/runtime code server-safe:
  - Use a shared pure validation module that does not import browser-only modules.
  - Avoid coupling API handlers to client-only code paths.
- Reject if normalized result is null/empty.

### Payload limits
- Max JSON body size on endpoint (example: 100 KB).
- Max stored assumptions length safeguard.

### Abuse controls
- IP-based rate limit on create endpoint (recommended baseline: 10 saves/hour per IP).
- Optional separate limit for read endpoint if needed.
- Basic slug moderation rules (deny obvious abusive terms).

### Ownership model (explicitly for MVP)
- No protected edits because snapshots are immutable.
- No account identity required.

## Frontend UX Flows

### A) Save and share
1. User clicks `Save & Share`.
2. Optional inputs:
   - Share name (optional).
   - Custom slug (optional).
3. Frontend sends current normalized `userAssumptions`.
4. On success:
   - Show share URL.
   - Copy-to-clipboard action.
   - Non-blocking success toast.
5. Handle errors inline (slug taken, invalid slug, network error).

### B) Open shared link (no local custom assumptions)
1. User lands on `/assumptions?shared=<reference>`.
2. App fetches snapshot.
3. If found, apply snapshot immediately.
4. Show toast: shared assumptions loaded.
5. Remove `shared` param with history replace.

### C) Open shared link (existing local custom assumptions)
1. User lands with `shared`.
2. App fetches snapshot.
3. Show confirm modal with three actions:
   - `Save Mine First`
   - `Replace Mine`
   - `Keep Mine`
4. If `Save Mine First`:
   - Open share modal prefilled from local assumptions.
   - After successful save, import fetched shared assumptions.
   - If user cancels save flow, return to decision modal and do not import.
5. If `Replace Mine`:
   - Apply snapshot.
   - Show success toast.
6. If `Keep Mine`:
   - No data change.
   - Optional info toast.
7. Remove `shared` param regardless of choice.

### D) Error states
- Not found/expired: toast + drop `shared`.
- Network/server failure: toast + drop `shared`.
- Malformed reference: toast + drop `shared`.

## Integration Points in Current Codebase

### Context (`src/contexts/AssumptionsContext.jsx`)
Add explicit APIs:
- `setAllUserAssumptions(nextUserAssumptions)`:
  - Normalize and set as full replacement.
  - Keep localStorage sync behavior unchanged.
- Optional helper:
  - `getNormalizedUserAssumptionsForSharing()`.

### Assumptions page (`src/pages/AssumptionsPage.jsx`)
Add shared import orchestration:
- Parse `shared` query param.
- Fetch snapshot once per unique `shared` value.
- Coordinate modal/toasts and apply decision.
- Include `Save Mine First` branch that launches share modal, then imports incoming snapshot.
- Remove only `shared` from URL with `replace`.

### Editor/actions UI (`src/components/AssumptionsEditor.jsx`, `src/components/assumptions/FormActions.jsx`)
Add share controls:
- New button: `Save & Share`.
- Modal or inline form for optional slug and optional name.
- Display generated link and copy action.

### Share modal component
Add a reusable share modal component (recommended path: `src/components/ShareAssumptionsModal.jsx`):
- Inputs: optional name, optional custom slug.
- Live slug preview and client-side format checks.
- States: idle, saving, success, error.
- Can be invoked from both:
  - Main `Save & Share` button.
  - `Save Mine First` branch during shared-import conflict resolution.

### API utilities
Add client-side helper module for HTTP calls:
- `createSharedAssumptionsSnapshot(payload)`
- `fetchSharedAssumptionsSnapshot(reference)`
- Optional helper in same module: `slugify(name)` for preview UX.

### Server API files
Add route handlers under whichever server function convention is used in deployment (example path names):
- `api/shared-assumptions/index.js` (POST)
- `api/shared-assumptions/[reference].js` (GET)

### Config
Verification-first:
- Add a simple API smoke endpoint/check in Phase 0 and test on preview deployment.
- If and only if API routes are intercepted by SPA rewrite, update `vercel.json` to keep explicit `/api/(.*)` passthrough ahead of SPA catch-all rewrite.

## Detailed Implementation Phases

### Phase 0: API foundation + config
1. Add Redis client wiring and env var validation.
2. Add POST/GET endpoints with schema validation.
3. Verify API routing behavior in deployment (smoke-check `/api/*` endpoint on preview).
4. Only if needed, add rewrite/config updates for API routes.
5. Implement atomic slug claim and consistency-safe snapshot/alias writes.
6. Add server-side unit tests for slug, payload validation, and write consistency.

Exit criteria:
- Can create and fetch snapshots via local/dev requests.
- Preview deployment confirms `/api/*` routes work correctly without leaking Redis credentials client-side.

### Phase 1: Context replacement API
1. Add `setAllUserAssumptions`.
2. Ensure it reuses `normalizeUserAssumptions`.
3. Add tests in `AssumptionsContext` test suite for replacement behavior and localStorage sync.

Exit criteria:
- Context can atomically replace full local custom assumptions safely.

### Phase 2: Shared import flow on assumptions page
1. Detect `shared` in query params.
2. Fetch snapshot and branch by local-custom state.
3. Implement three-choice modal (`Save Mine First`, `Replace Mine`, `Keep Mine`).
4. Remove `shared` param after handling.
5. Add integration tests for:
   - auto-load with empty local
   - prompt with existing local
   - save-mine-first then import path
   - keep mine path
   - invalid shared reference path
   - preserving non-shared params

Exit criteria:
- Link import behavior matches product decision exactly.

### Phase 3: Save/share UI flow
1. Add `Save & Share` entry point.
2. Add optional slug/name inputs and client validation.
3. Call POST endpoint and render share URL.
4. Add copy button and feedback states.
5. Add tests for success/failure states.

Exit criteria:
- Users can generate and copy working share links end-to-end.

### Phase 4: Hardening
1. Add stricter rate limiting and logging.
2. Add reserved slug list + test coverage.
3. Add payload-size and malformed-input tests.
4. Add monitoring hooks around endpoint failures.

Exit criteria:
- Feature is production-safe for abuse and failure modes.

## Testing Strategy

### Unit tests
- Slug normalization/validation.
- Alias resolution (slug -> id).
- Payload normalization and pruning behavior.

### Integration tests (frontend)
- Query param import workflow branches.
- URL cleanup behavior with preserved params.
- Modal decision behavior, including `Save Mine First` continuation/cancel behavior.
- Save/share form and error paths.

### End-to-end tests (optional initial pass)
- Create snapshot -> open share URL -> import -> verify calculator/assumptions values changed.

## Operational Considerations

### Environment variables (example names)
- `SHARED_ASSUMPTIONS_REDIS_REST_URL`
- `SHARED_ASSUMPTIONS_REDIS_REST_TOKEN`
- `PUBLIC_SITE_ORIGIN` (for returned absolute share URL)

### Observability
- Log structured fields:
  - endpoint
  - status code
  - reason category (`invalid_slug`, `not_found`, `rate_limited`, etc.)
- Track metrics:
  - snapshots created/day
  - slug collision rate
  - import success/failure rate

## Backward/Forward Compatibility
- Store `schemaVersion` in each snapshot.
- On read:
  - If unknown schema, fail safely with user-facing error.
  - If older schema and compatible, migrate in memory if needed.

## Open Questions (Resolve Before Build Starts)
1. Do we allow empty-name snapshots, or require at least one of `name`/`slug`?
2. Exact TTL policy: 365 days vs no expiry.
3. Should "Keep mine" still show the imported snapshot summary (name/date) anywhere?
4. Do we want an explicit "Clear my custom assumptions" action in the import modal as fallback?

## Verification Checklist
1. Configure `SHARED_ASSUMPTIONS_REDIS_REST_URL` and `SHARED_ASSUMPTIONS_REDIS_REST_TOKEN` locally and in production.
2. Create custom assumptions and save via `Save & Share`; verify share URL generation and copy.
3. Open share URL in a clean browser profile; verify auto-import and success message.
4. Open share URL with existing local assumptions; verify three-option modal appears.
5. Test `Save Mine First`; verify local assumptions are saved to a new link and incoming assumptions are then imported.
6. Test `Replace Mine`; verify immediate import.
7. Test `Keep Mine`; verify no data change.
8. Test slug collision; verify `409` handling and user-facing message.
9. Test invalid/expired reference; verify error handling and `shared` param removal.
10. Verify URL cleanup preserves other query params (`tab`, `categoryId`, `recipientId`, `activeCategory`).

## Initial Recommendation Summary
- Implement immutable snapshots with optional custom slugs.
- Keep `shared` as one-time import instruction and drop it from URL after handling.
- Use context-level full-replacement API for clean import semantics.
- Require atomic slug claiming and consistency-safe multi-key writes.
- Ship in phased steps with tests at each phase.
