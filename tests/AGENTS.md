# tests/ — tests that must not be co-located

Everywhere else in this repo, tests sit next to the code they test. This directory exists for the one exception: `tests/api/` holds the route-level tests for the Vercel serverless handlers in `api/`, because Vercel deploys EVERY `.js` file under `api/` as a serverless function. Co-locating them shipped the test files as broken endpoints (importing vitest outside a vitest run crashes at init), and `vercel dev` resolved the bare `/api/shared-assumptions` route to `index.test.js` — every local save failed with a bodyless 500 `FUNCTION_INVOCATION_FAILED`.

- `tests/api/` mirrors the `api/` directory structure; handler imports reach back via `../../../api/...`.
- `vi.mock` paths here must resolve to the same absolute modules the handlers import (`src/server/upstashRedisClient.js`) — keep the relative depth in sync if files move.
- Do not move these back into `api/`, and don't put new non-function files (helpers, fixtures) there either.
