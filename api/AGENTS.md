# api/ — Vercel serverless endpoints

Thin handlers; all real logic lives in `src/server/` (see the context file there for architecture). Files here map to routes by filename (`[reference].js` = path param).

- `shared-assumptions/index.js` — POST: parse body → `validateCreatePayload` → rate limit (`save`) → create snapshot → 201. Validation rejects before any Redis spend.
- `shared-assumptions/[reference].js` — GET: validate reference → rate limit (`read`) → fetch → `Cache-Control` → 200. Cache headers are deliberate: canonical-id responses get `public, max-age=3600, s-maxage=31536000, immutable` (snapshots never change); slug responses get only `max-age=60, s-maxage=300` because an expired slug can be re-claimed by someone else. Don't "unify" them.
- `health.js` — GET, `Cache-Control: no-store`. `?check=redis` runs PING+EVAL (costs Upstash commands, hence the `health` rate limit). Redis failures return 503 with the error code but a generic message — log the detail, never echo upstream bodies on a public endpoint.

## Gotchas

- In production Vercel pre-parses JSON bodies into `req.body` (object); locally/under tests the body may be a string, Buffer, or stream. `parseJsonBody` handles all four and enforces the size cap on each — don't bypass it.
- Tests mock `src/server/upstashRedisClient.js` and call the default-export handler with hand-built `req`/`res` objects (see `health.test.js` for the canonical mock-response shape). POST test requests need `headers: {'content-type': 'application/json'}` or they'll 415.
- The Node runtime version for these functions is a Vercel dashboard setting, not recorded in the repo; `engines` in package.json is `>=22` partly for that reason.
- `vercel.json` (repo root): the SPA rewrite deliberately does NOT exclude dotted URLs (entity ids may contain dots; real static files win via Vercel's filesystem-before-rewrites order) but keeps the `@vite/`/`src/`/`node_modules/` exclusions for `vercel dev`. `/assets/*` is immutable-cached (Vite content-hashes it — this is what makes the separate `generated-data` chunk pay off). Security headers ship the safe set; CSP is deliberately absent (KaTeX/recharts/framer inline styles) — treat adding it as its own carefully-tested item.
