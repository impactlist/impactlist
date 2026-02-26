# Shared Assumptions Production Completion Plan

## Objective
Ship the shared-assumptions feature fully in production so users can:

1. Save their current custom assumptions.
2. Receive a shareable URL.
3. Open another user's shared URL and import those assumptions safely.

This document focuses on the remaining deployment, validation, and rollout steps needed after implementation.

## Current Implementation Status

### Implemented in code
- Server API endpoints for create/read:
  - `POST /api/shared-assumptions`
  - `GET /api/shared-assumptions/:reference`
- Upstash Redis integration via server-only proxy layer.
- Slug + canonical ID model, TTL, validation, and rate limiting.
- Assumptions page flow for `?shared=<reference>`:
  - auto-import when no custom local assumptions
  - decision modal when local custom assumptions exist
  - `Save Mine First` / `Replace Mine` / `Keep Mine`
- URL cleanup behavior (remove `shared`, preserve other params).
- Unit/integration tests across API utilities, server modules, and shared import page flow.

### Not done until deployment steps are completed
- Environment variables set in deployment target(s).
- Preview/production routing verification for `/api/*`.
- End-to-end smoke test against real Upstash credentials.

## Pre-Flight Decision (Required)

### Redis environment isolation
Before starting rollout, decide whether preview and production share Redis.

Recommended:
- Use a separate Upstash Redis database for Preview.
- Use a separate Upstash Redis database for Production.

Reason:
- Preview testing creates long-lived snapshot data (365-day TTL).
- Sharing one database pollutes production data with test links/slugs.

If shared Redis is unavoidable:
- Reserve a preview slug prefix (example: `preview-`).
- Add a cleanup runbook for preview-created test slugs/snapshots.

## Phase 1: Environment and Secrets

### 1. Configure required environment variables
Set these in Vercel for each environment you use (`Preview`, `Production`):

- `SHARED_ASSUMPTIONS_REDIS_REST_URL`
- `SHARED_ASSUMPTIONS_REDIS_REST_TOKEN`

Isolation requirements:
- Preview should point to preview Redis credentials.
- Production should point to production Redis credentials.

### 2. Validate secrets are present at runtime
- Deploy preview.
- Verify `GET /api/health` returns `{ "ok": true }`.
- Verify `GET /api/health?check=redis` returns success for:
  - `checks.redisPing`
  - `checks.redisEval`
- Attempt one API create call and one read call in preview (via UI or curl).

Exit criteria:
- API handlers execute successfully in preview.
- Redis-backed create/read requests succeed.

## Phase 2: Routing and Platform Verification

### 1. Confirm Vercel routing behavior
Current config has SPA rewrite catch-all in `vercel.json`.

Verification step:
- Confirm `/api/health` and `/api/shared-assumptions/*` are handled by serverless functions, not rewritten to `index.html`.
- Confirm Vercel build logs detect and bundle the API functions under `api/shared-assumptions/*`.

If broken:
- Add explicit API passthrough rewrite before SPA fallback in `vercel.json`.

### 2. Verify Upstash command compatibility and key behavior
Rate limiting uses Redis `EVAL` (Lua script), and snapshots/slugs rely on TTL.

Verification step:
- Run one successful save in preview.
- Confirm save endpoint returns 201 (not 500).
- In Upstash dashboard, verify:
  - rate limit key exists: `assumptions:ratelimit:<ip-or-unknown>`
  - snapshot key exists with expected TTL (~365 days)
  - slug key exists with expected TTL (~365 days) when slug is provided

If broken:
- If `EVAL` fails, save requests will fail; treat this as a release blocker.
- If TTL is missing or wrong, treat as a release blocker before production rollout.

### 3. Validate Upstash plan limits and quota behavior
Before production release, check current Upstash plan limits from your Upstash dashboard/docs (commands/day, storage, rate constraints).

Verification step:
- Record current limits in the release notes/checklist.
- Document expected failure behavior when limits are exceeded (upstream rate/quota errors surfacing via API).

Exit criteria:
- `/api/*` reaches serverless endpoints in deployed preview.
- `EVAL` and TTL behavior are verified in real preview runtime.
- Upstash plan limits are known and accepted for expected traffic.

## Phase 3: End-to-End Feature Validation

### 1. Save & Share flow
- Open `/assumptions`.
- Change at least one value so custom assumptions exist.
- Click `Save & Share`.
- Save with and without custom slug.
- Verify URL is returned and copy works.
- Verify copy-to-clipboard on at least one mobile browser/device.

### 2. Shared import without local custom data
- Open shared URL in incognito:
  - `/assumptions?shared=<reference>`
- Verify assumptions auto-import.
- Verify success status.
- Verify `shared` param is removed afterward.

### 3. Shared import with existing custom data
- Open shared URL in normal browser with existing custom assumptions.
- Verify decision modal appears.
- Validate each branch:
  - `Keep Mine`: local data unchanged, `shared` removed.
  - `Replace Mine`: incoming data loaded, `shared` removed.
  - `Save Mine First`: save modal opens, save succeeds, then incoming data loads.
  - `Save Mine First` then `Cancel`: return to decision modal, no import performed, `shared` remains until user chooses an action.

### 4. Error handling
- Test missing/invalid reference:
  - expect friendly error
  - expect `shared` removed
  - expect other query params preserved (`tab`, `categoryId`, etc.)
- Test slug collision (duplicate custom slug):
  - expect 409-style user-facing message.

Exit criteria:
- All user-visible paths behave as designed in deployed preview.

## Phase 4: Production Rollout

### 1. Promote/deploy to production
- Deploy the validated commit(s) to production.
- Confirm env vars are set in production target.

### 2. Post-deploy smoke checks
- `GET /api/health`
- Save assumptions and generate link.
- Open generated link in a clean browser session.

### 3. Monitor for first 24-72 hours
- Watch function logs for:
  - `redis_not_configured`
  - `redis_request_failed`
  - `rate_limited`
  - `invalid_reference`
  - unexpected 500 errors

Where to monitor:
- Vercel Dashboard -> Project -> Functions -> Logs
- Upstash Dashboard metrics/logs for command volume, throttling/quota errors, and memory growth

Exit criteria:
- No critical errors and successful user flows in production.

## Operational Checklist

1. Vercel env vars configured (`Preview` + `Production`).
2. Preview deploy complete.
3. `/api/health` verified in preview.
4. End-to-end preview validation complete.
5. Production deploy complete.
6. Production smoke test complete.
7. Vercel Functions logs reviewed during first 24-72 hours.
8. Upstash metrics reviewed during first 24-72 hours.
9. Early monitoring window completed without critical issues.

## Rollback Plan

If production issues occur:

1. Roll back to previous known-good deployment in Vercel.
2. Keep feature disabled operationally by unsetting Redis env vars if needed.
3. Use logs to identify failure class.
4. Patch and re-run preview validation before re-promoting.

## Recommended Follow-Ups (Post-MVP)

1. Add basic analytics counters for share creates/imports.
2. Add optional moderation protections (blocked slug terms list expansion).
3. Add periodic cleanup/telemetry dashboards for usage and error rates.
4. Add Playwright E2E tests for the full shared-link flow.
5. Re-evaluate Upstash plan tier after initial real traffic and adjust before quota pressure.
