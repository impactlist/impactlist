# Codebase Review — June 10, 2026

A full review of the codebase (app code in `src/`, the markdown→data pipeline in `scripts/` + `content/`, the Vercel API layer in `api/` + `src/server/`, and all tooling/config). Findings were verified against the actual code before being recorded here; line numbers are as of the review date and may drift, so symbol/function names are given alongside them.

The review was conducted against the project's own stated values (see `CLAUDE.md`): DRY/modularity first, simplicity over short-term fixes, **never fail silently**, pure JS + React + Tailwind + Vite only. "Negative cost per life" is a legitimate domain value throughout — nothing below should be "fixed" by constraining values to positive unless explicitly stated.

---

## Part 1: Issues already fixed (as of June 10, 2026)

These were the most urgent findings. They are recorded here so readers understand why they don't appear in the to-do list, and because the *patterns* they represent are worth knowing.

### Data correctness

- **A live $1M double-count.** `content/donations/mark_zuckerberg.md` opened with a byte-identical copy of a Larry Page donation (same date, recipient, amount, `credit: larry-page: 1.0`, same source) that also existed in `larry_page.md`. The pipeline concatenated all files with no duplicate detection, inflating both Page's total and the recipient's received total. **Fixed:** duplicate removed (donation count 557 → 556).
- **Two suspicious identical rows in `jaan_tallinn.md`** ($100k to CFAR, twice, same placeholder date/source). Verified against the SFF initiative-committee page: the source itself lists two identical Jacob Lagerros → CFAR grants, so both rows are real. **Fixed:** kept both, with `notes` fields documenting the verification (which also satisfies the new dedup check).
- **`eric_schmidt.md` had no closing `---` frontmatter delimiter** — the whole file was an unterminated YAML block that gray-matter happened to parse. **Fixed:** delimiter added; the pipeline's raw-text scanner now also tolerates EOF-terminated frontmatter, matching gray-matter.

### Pipeline hardening (`scripts/generate-data-from-markdown.js`)

Donation rows previously had almost no validation (truthiness checks only). Now enforced, with the source file named in every error:

- Dates must be written `YYYY-MM-DD` and be real calendar dates, validated **from the raw file text** — YAML silently rolls invalid dates over (`2021-02-30` → `2021-03-02`) and parses non-ISO formats in the build machine's local timezone, so parsed values can't be trusted.
- `amount` must be a positive finite number; `credit` is required, non-empty, each value in (0, 1], summing to 1 (±0.001). The legacy "no credit → donor from filename" fallback was removed. An empty `credit: {}` previously **silently dropped the donation entirely**.
- Unknown donation fields are rejected (allowed: `date`, `recipient`, `amount`, `credit`, `source`, `notes`), so a typo'd `sorce:` can no longer silently discard data.
- **Two-level duplicate detection:** exact duplicates (recipient/date/amount/credit/notes), and same-event duplicates (recipient/date/amount/notes with *different* credit — the "two research passes each credited their own donor" failure mode). Genuinely identical separate donations are disambiguated with distinct `notes`. `source` is deliberately not part of either identity: the same event cited from two sources is still the same event.
- A missing `donations:` array is a hard error (`donations: []` is the explicit placeholder — `multiple_donors.md` uses it). Previously this warned-and-skipped, and the warning fired on every build, normalizing warnings.
- `content/README.md` previously **claimed the script deduplicates donations across files (it never did)** and showed a joint-donation convention that invited double-recording. Rewritten: every donation event lives in exactly one file; the `credit` map determines attribution.
- 12 new subprocess tests cover every new failure mode plus the disambiguation escape hatches (pipeline suite: 17 tests).

### Tooling enforcement

- **`npm run lint` effectively never finished** (killed after 25 min): the ESLint ignore list was missing `.worktrees/**` (5 full repo copies ≈ 700 extra files), `coverage/**`, `playwright-report/**`, `test-results/**`, and the `src/data/generatedData.js` ignore was root-anchored so 1MB+ worktree copies of the generated file went through eslint-plugin-prettier. **Fixed:** lint now completes in ~2s.
- **Coverage thresholds were silently a no-op.** `vitest.config.js` nested them under a `global:` key — that's Jest's format; Vitest read it as a glob pattern matching zero files, so `test:coverage` could never fail. **Fixed:** flat `thresholds: { branches/functions/lines/statements: 50 }`, verified to enforce (current coverage ≈ 59/76/74).
- **There was no CI at all** — 400+ tests with no enforcement point beyond a bypassable pre-commit hook ( `AGENTS.md` falsely claimed "blocked in CI"). **Fixed:** `.github/workflows/ci.yml` runs generate-data → lint → coverage-gated tests → build on pushes to master and PRs. (Playwright e2e is *not* in CI yet — see to-do list.)

### Shared-assumptions API (`src/server/`, `api/shared-assumptions/`)

- **Stored snapshots were never value-validated.** Only the three top-level keys were checked to be objects; everything inside was arbitrary JSON. A crafted snapshot (`effects: {}`, string global parameters, unknown fields) was stored, served, and **crashed the entire app** (unmounted into the root ErrorBoundary) for anyone opening the share link — and the garbage was persisted into their saved-assumptions library, re-crashing on reload. `effects: "ab"` crashed the server itself (500 via `effects.splice`). **Fixed:**
  - Write path: `validateCreatePayload` now deep-validates against `serverDefaultAssumptions` — known IDs/parameters/effect fields only, finite numbers (negative allowed — domain), booleans for `disabled`, arrays for `effects`, duplicate `effectId`s rejected, `__proto__`/`constructor`/`prototype` keys rejected anywhere. Bad payloads are 400s before any Redis spend.
  - Read path: `getSharedSnapshot` re-validates stored assumptions before serving; failures return the (logged) `invalid_snapshot` 500 instead of reaching clients. Pre-existing poison snapshots (possible between feature launch ~Feb 2026 and this fix; snapshots have 365-day TTLs) now surface in function logs instead of crashing visitors.
  - The two API routes got their first tests (method gating, 400-before-storage, mocked happy path); server/API suite is 46 tests.

---

## Part 2: Open findings

Severity: **High** = real correctness/security/availability impact; **Medium** = maintainability or latent-bug risk worth scheduling; **Low** = worthwhile opportunistic cleanup.

> **Update (later on 2026-06-10):** to-do items 1–4 from Part 3 were implemented after this document was first written. Findings resolved by that work are marked **✅ fixed 2026-06-10** inline; numbering is unchanged.

### 2.1 Correctness bugs in app code

1. **[High — ✅ fixed 2026-06-10] Unreachable "pulse effect" implementation contradicts its own asserts** — `src/utils/effectsCalculation.js`. *Resolution: feature removed (owner's call) — both `windowLength === 0` branches deleted, `validateEffectWindow` simplified; the positive-window asserts remain as the contract. A true point-in-time effect can be approximated with a tiny window (e.g. 0.01 years) if ever needed.* `assertPositiveNumber(effect.windowLength, …)` threw on `windowLength === 0`, yet ~45 lines of carefully-commented "instantaneous pulse" handling sat unreachable below it.

2. **[High — ✅ fixed 2026-06-10] Calculator table columns silently sort garbage** — `src/components/calculator/RecipientTable.jsx` + `src/components/shared/SortableTable.jsx`. *Resolution: computed columns marked `sortable: false`; `SortableTable` now throws if asked to sort a column no row has data for; direct tests added (incl. the negative-cost comparator).* The lives/cost-per-life/category columns were sortable by default (`sortable !== false`), but the calculator's row objects don't carry those fields (values are computed in `render`), so clicking those headers compared `undefined` and quietly scrambled or no-op'd while the sort arrow displayed.

3. **[High — ✅ fixed 2026-06-10] `.defaultProps` on function components is dead under React 19** — 7 components: `AssumptionsDropdown`, `AssumptionsSelector`, `ConfirmActionModal`, `ShareAssumptionsModal`, `SaveAssumptionsModal`, `SharedImportDecisionModal`, `Header`. React 19 removed `defaultProps` for function components, so none of these defaults apply. Mostly redundant with destructure defaults, but `AssumptionsDropdown`'s destructuring has *no* defaults — any future caller omitting `onRename`/`onDelete` gets a runtime TypeError instead of the intended no-op. Move defaults into destructuring and delete the blocks.

4. **[High — ✅ fixed 2026-06-10] Unguarded `JSON.parse` of persisted storage can brick the calculator** — `src/pages/DonationCalculator.jsx` (localStorage ×2) and `src/contexts/AssumptionsContext.jsx` (sessionStorage). A corrupted value throws inside an effect → ErrorBoundary → "Refresh Page" can never fix it because the bad key persists. Fix that stays fail-loud: catch parse/normalize failures, clear the offending key, surface an explicit "saved values were corrupted and reset" notification.

5. **[High — ✅ fixed 2026-06-10] No 404 route** — `src/App.jsx` has no `path="*"`; unknown URLs render header + empty main + footer with no message (the silent failure the project forbids). Bad entity IDs (`/donor/xyz` etc.) throw users onto the developer error screen. Bad URLs are expected input: add a NotFound route and have detail pages render it for unknown IDs.

6. **[Medium] Stale saved/shared assumptions can silently change an effect's model type** — `src/utils/effectsCalculation.js` (`applyRecipientEffectToBase` grafts arbitrary override fields; `effectToCostPerLife` branches on `costPerQALY !== undefined`) + `mergeEffects` keeping unknown `effectId`s. A leftover `costPerQALY` override on a now-population-based effect silently switches calculation models. Fix at the client boundary: reject/strip unknown `effectId`s and fields in `normalizeUserAssumptions` (the server now does this for shared snapshots; local saved assumptions still need it).

7. **[Medium] Credited-amount logic is inconsistent (NaN hazard now latent)** — `src/utils/assumptionsDataHelpers.js` `calculateDonorStatsFromCombined` multiplies `donation.amount * donation.credit` unconditionally while `startupValidation.js` documents `credit` as optional and three sibling call sites default it to 1. The build now guarantees `credit` exists, so this is no longer reachable from real data — but the contract mismatch remains. Extract one `getCreditedAmount(donation)` helper, use it at all 4 sites, and align `startupValidation` with the now-required field.

8. **[Medium — ✅ fixed 2026-06-10] Swallowed exceptions violating fail-loud** — `src/utils/effectEditorUtils.js` `calculateEffectCostPerLife` has a bare `catch { return Infinity; }` (hides genuine programming errors, not just partial input); `src/components/shared/SampleDonationCalculator.jsx` `catch { setCostPerLife(Infinity); }` renders "N/A" on *any* error. *Resolution: the editor path now pre-screens expected mid-typing states (partial/unparseable input, zero/negative windows, zero costs) and computes with no catch; the sample calculator's try/catch was removed outright.*

9. **[Medium — ✅ fixed 2026-06-10] Broken-and-dead date sort** — `src/pages/RecipientDetail.jsx` sets `dateObj: donation.date` (an ISO *string*) then sorts with `b.dateObj - a.dateObj` → `NaN` comparator → no-op, while the comment claims "most recent first". `DonorDetail` does it correctly with `new Date()`. *Resolution: construction fixed (`new Date(donation.date)`). The pre-sorts were deliberately kept, not deleted — the chart-aggregation code consumes the list order even though the table re-sorts.*

10. **[Low] Assorted silent fallbacks** — `getEffectiveCostPerLifeFromCombined` returns `0` (= "infinitely effective" in this domain) for a null entity; `RecipientDetail`/`DonorDetail` use `getCategoryById(id) || { name: 'Other' }` in one place and throw nine lines later; `CategoryList` silently `return`s on a missing recipient where sibling pages throw; `categoryData.fraction || 1` turns an explicit `fraction: 0` into 1. Pick the throwing behavior consistently.

11. **[Low] In-place mutation of props/memoized arrays during render** — `RecipientValuesSection.jsx` sorts `filteredRecipients` in place; `SpecificDonationModal.jsx` sorts memoized `allCategories` in place inside JSX. Use `toSorted()` or copy-then-sort inside a memo.

### 2.2 Shared-assumptions backend — remaining hardening

The write/read validation is done (Part 1). Still open, roughly in priority order:

1. **[Medium — ✅ fixed 2026-06-10] Upstream Redis error bodies leak to clients.** `upstashRedisClient.js` embeds raw Upstash response bodies in `error.message`; `handleApiError` returns 5xx messages verbatim; `api/health.js` echoes them publicly; the client shows them in notifications. *Resolution: `handleApiError` and the health endpoint now log the detail and return generic ≥500 messages (error codes preserved for the client contract).*
2. **[Medium — ✅ fixed 2026-06-10] No caching or rate limiting on reads → free quota burn.** Snapshot GETs set no `Cache-Control` (snapshots are immutable — cache id-based ones hard, slug-based ones shorter) and have no rate limit; `GET /api/health?check=redis` costs 2 Redis commands per anonymous hit. *Resolution: id-resolved GETs cache for a year (`immutable`, CDN-weighted via `s-maxage`), slug-resolved for 5 minutes; reads limited to 300/hour/IP and redis health checks to 30/hour/IP via a generalized per-scope limiter; health responses are `no-store`.*
3. **[Medium — ✅ fixed 2026-06-10] The 120KB streaming body cap is dead in production.** Vercel pre-parses JSON bodies (`parseJsonBody` returns `req.body`), so the real prod limit is Vercel's ~4.5MB; a content type Vercel parses to a *string* (e.g. `text/plain`) attaches listeners to an already-consumed stream and likely hangs until the platform timeout. *Resolution: `parseJsonBody` requires `Content-Type: application/json` (415 otherwise, which also kills cross-origin `text/plain` "simple" POSTs), handles string/Buffer bodies, and enforces `MAX_BODY_BYTES` on every path — string/Buffer byte length and re-serialized size for platform-parsed objects.*
4. **[Medium — ✅ fixed 2026-06-10] The production monitoring plan can't work as written.** `docs/SharedAssumptionsProductionPlan.md` says to watch logs for `rate_limited`/`invalid_reference`, but `handleApiError` only logs ≥500 — 4xx (including 429 abuse signals) are never logged. *Resolution: 429s are now logged (`console.warn` with request context) at the `handleApiError` choke point.*
5. **[Low] Write-side storage abuse has no global backstop** — 10 saves/hr/IP × ~100KB × 365-day TTL, no global cap, no dedup of identical content; IP rotation fills storage. A global quota metric and content-hash dedup are cheap. Also: client IP comes from the *leftmost* `x-forwarded-for` entry — safe on Vercel, spoofable anywhere else; prefer rightmost-trusted parsing.
6. **[Low — partially fixed 2026-06-10] Smaller items:** snapshot `SET` without `NX` (id collision would overwrite; ~62 bits of entropy makes it negligible, but `NX` + one retry is nearly free); slug-rollback failure swallowed with bare `catch {}` (at minimum `console.error`); `validateReference` accepts any charset up to 80 chars (real refs are `[a-z0-9-]{3,40}` or 12-char ids); ~~no fetch timeout to Upstash~~ *(✅ done: 5s `AbortSignal.timeout`, hung upstreams → 503)*; 405s lack `Allow` headers; `schemaVersion`/`appDataVersion` are written but never read (use them for a migration story — relevant now that read-path validation can reject drifted snapshots — or drop them); `handleApiError`'s dual 2-arg/3-arg signature only exists for tests; `SLUG_REGEX` duplicated between client and server.
7. **[Medium] The server normalization module is a hand-copied near-duplicate of the client's** — `src/server/sharedAssumptionsNormalization.js` vs `normalizeUserAssumptions`/`pruneObject`/`areValuesEqual` in `src/utils/assumptionsAPIHelpers.js`, with behavioral drift already present (server deletes recipients lacking `categories`; client keeps them). Both are pure ES6 — extract one shared module.
8. **[Low] Client import path is still trusting** — `GlobalSharedAssumptionsImport.jsx` applies fetched assumptions via `setAllUserAssumptions` and persists to the library before any local sanity check. Server-side validation now protects this path, but a defensive catch (don't apply, don't persist, notify) would protect against all future server-side regressions too.

### 2.3 Data pipeline — remaining

1. **[High] Build-time vs runtime validation have diverged, with the strict one in the wrong place.** Category-fraction sums ≈ 1, `windowLength > 0`, `costPerQALY !== 0`, and NaN rejection are enforced only at app startup (`src/utils/startupValidation.js`, run in the browser) — bad content **passes `npm run build`, deploys, then crashes production at load**. Meanwhile `dataValidation.js` exports a dead `validateGlobalParameters` that `startupValidation` re-implements privately *minus* the `yearsPerLife` check. Fix: one shared validation module (pure ES6) imported by both the generator and the app; run the full strict set at generation time; delete the dead duplicate.
2. **[High] Latent: curated profiles that customize a recipient can't build.** `getRecipientDefaultEffect` in the generator returns the recipient's `{effectId, overrides, multipliers}` *wrapper*, but `normalizeCuratedRecipientEffects` checks raw effect field names against it → spurious "references unknown field" hard-fail for valid fields, and multipliers are compared against literal `1` instead of the recipient's default. Unexercised today (all three profiles touch only globalParameters/categories); the first profile to customize a recipient hits it.
3. **[Medium] Duplicate entity IDs silently overwrite** — two files with the same `id` in categories/donors/recipients/assumptions → last glob order wins (and glob order is filesystem-dependent). Throw on duplicates, naming both files; the curated-profiles loader already shows the pattern.
4. **[Medium] Non-deterministic output ordering** — glob results aren't sorted, so `*ById` insertion order and same-date donation tie order depend on directory traversal. Sort each glob result (one line per loader).
5. **[Medium] Unknown frontmatter keys silently ignored in donors/recipients/categories loaders** (donation *rows* are now strict). A recipient typo `effect:` instead of `effects:` silently discards the override and the site shows category defaults. The profiles loader rejects unknown keys — apply the same strictness everywhere.
6. **[Medium] Dev and tests can serve stale data; fresh clones break confusingly.** `npm run dev`/`npm test` never regenerate; a fresh clone dies on the missing gitignored `src/data/generatedData.js`. Add `predev`/`pretest` generate steps (generation takes ~1s). Also `vercel.json`'s `buildCommand` duplicates the package.json build script verbatim — point it at `npm run build`.
7. **[Medium] Profiles are validated against the pre-filter recipient set** but output ships the post-filter set (donation-less recipients removed) — a profile referencing a filtered recipient validates at build, dangles at runtime. Validate against the filtered set.
8. **[Low] Internal-notes exclusion is exact-match only** (`# Internal Notes`, level-1, case-sensitive) — `## Internal Notes` would ship editorial notes to the public site. After exclusion, hard-fail if `/internal notes/i` still matches a heading. Same spirit: unreplaced `{{PLACEHOLDER}}` tokens pass through silently — fail on leftover `{{[A-Z_]+}}`.
9. **[Low] Structure/cleanup:** the generator is a 1,100-line god script with four near-identical loaders (read → skip `_index` → validate id/name → extract content) — extract the shared loader; `validateDataIntegrity` uses `process.exit(1)` where everything else throws; entity links in content (`/recipient/…` etc.) have no build-time check (all 44 currently resolve); `content/README.md` still says `/causes/` for the `categories/` dir and doesn't document `assumptions/`; filename typo `sergey_brin_family_foundaiton.md` (id inside is correct); generated file is ~half dead weight (`allDonations`, `effectivenessCategories`, `donors`, `recipients` exports unused by `src/` — dropping them roughly halves the 1.9MB payload, but note the pipeline tests currently assert on `allDonations`, so update those too).

### 2.4 DRY hotspots (largest first)

1. **[High] The effect-editor trio.** ~200 lines of state/handler logic are line-for-line identical between `RecipientEffectEditor.jsx` and the inner `CategoryEffectSection` of `MultiCategoryRecipientEditor.jsx` (draft memos, init effect, `toggleEffectDisabled`, `updateEffectField` incl. the override/multiplier delete dance, cost-per-life calcs), and the per-effect card JSX is *triplicated* across those two plus `CategoryEffectEditor.jsx`. Extract a `useRecipientEffectsDraft(...)` hook + an `<EffectCard>` component; the editors become thin shells, and the logic finally gets one testable home.
2. **[High] Six modal shells, five duplicated + one divergent.** `ConfirmActionModal`, `SaveAssumptionsModal`, `ShareAssumptionsModal`, `AssumptionsDescriptionModal`, `SavedAssumptionsMigrationModal` all repeat the same AnimatePresence/scrim/panel structure; `SpecificDonationModal` hand-rolls a different one (no scrim-click close, no exit animation). **None has `role="dialog"`, `aria-modal`, focus trap, focus restore, or Escape handling** — keyboard users tab into the obscured page. One `<ModalShell>` (or native `<dialog>`) fixes the duplication and the accessibility gap in a single move.
3. **[High] DonorDetail/RecipientDetail share ~250 duplicated lines** — the 4-effect chart transition state machine (both copies carry `eslint-disable react-hooks/exhaustive-deps` and have already drifted) plus category aggregation that re-implements `calculateCategoryBreakdownForDonationFromCombined`. Both also contain a 100%-dead resize-listener block (ref never attached, state never read). Extract `useCategoryChartData` + `useChartViewTransition`; delete the dead blocks.
4. **[Medium] AssumptionsPage and AssumptionsSelector each maintain the full saved-assumptions library state machine** (fingerprinting, unsaved-changes detection, load-confirm flow, change-event subscription). Extract a `useAssumptionsLibrary()` hook.
5. **[Medium] Global-parameter validation rules exist in four diverging places** — `startupValidation.js` (misses `yearsPerLife`), dead `dataValidation.validateGlobalParameters`, `effectValidation.validateGlobalField`, `futureValueVisualization.js` — with real drift (`timeLimit ≥ 0` vs `> 0`). One rules table consumed by all four. (Overlaps with §2.3.1.)
6. **[Medium] Smaller clones:** `CurrencyInput`/`NumericInput` ~80% identical (merge or extract `useFormattedNumberInput`); `setRecipientFieldOverride`/`setRecipientFieldMultiplier` are ~80-line near-clones and prune logic is implemented 4 ways in `assumptionsAPIHelpers.js`; recipient-effect resolution (select-for-year → find override → apply) repeated at 4 sites; the colored Lives Saved / Cost-Per-Life table cell is re-written on three list pages **with inconsistent ∞-sentinel logic** (DonorList checks `totalLivesSaved === 0`, others check `costPerLife === 0`); comma-formatting re-implemented 4×; `getEffectType` defined twice plus three more inline type-sniffs; `EntityDonationTable`'s donor/recipient column sets are near-identical; `AssumptionsDropdown` duplicates its rename-controls and label blocks internally; the list-page scaffold repeats verbatim on three pages.

### 2.5 Dead code (~900+ lines, all verified by grep at review time)

- **Whole files:** `src/utils/formUtils.js`, `src/hooks/useEffectEditor.js`, `src/components/shared/IntegralBreakdown.jsx`, `FormSection.jsx`, `CustomValuesIndicator.jsx`.
- **~450 lines of unused exports across utils:** in `assumptionsFormValidation.js` (incl. a latent TypeError), `effectsVisualization.js` (`calculateIntegralBreakdown` — would NaN if ever called), `assumptionsDataHelpers.js` (six customization helpers kept alive only by their own tests; one has a falsy-zero bug), `dataValidation.js`, `donationDataHelpers.js` (incl. a `recipientHasEffectOverrides` that name-collides with the *live* one in `assumptionsEditorHelpers.js`), `effectFieldHelpers.js`, `assumptionsEditorHelpers.js`, `savedAssumptionsStore.js`, `effectEditorUtils.js`, `formatters.js`.
- **The homepage computes full per-recipient stats** (~300 recipients × donations × effects math) on every assumptions change purely to feed a never-read `useState` — `DonorList.jsx` (`setRecipientStats`).
- **`SortableTable`'s O(n²) "rank preservation" block** is provably a no-op (same object references) — delete.
- The dead resize-listener blocks in both detail pages (§2.4.3) and `MiniImpactList`'s never-set `isPlaceholder` branch.

When deleting: several dead exports are kept alive only by their test files — delete tests with code.

### 2.6 Performance

1. **[High] One 2.3MB JS bundle** (`dist/assets/index-*.js`, ~645KB gzipped): no route code-splitting (`App.jsx` imports all pages eagerly), and the 1.9MB generated dataset + recharts + KaTeX + framer-motion all land in the entry chunk. `React.lazy` per route is the cheap first move; consider `manualChunks` and serving the dataset as fetched JSON later.
2. **[Medium] Derived-state-via-`useEffect` on every data page** (DonorList, RecipientList, CategoryList, both Details, Calculator): synchronous data computed in effects + `setState` → double renders and artificial "Loading…" flashes. Replace with `useMemo`; the loading states delete outright.
3. **[Medium] The calculator recomputes the entire donor leaderboard on every keystroke** (`DonationCalculator.jsx` → `calculateDonorRank` → full `calculateDonorStatsFromCombined`). Memoize donor stats per `combinedAssumptions`; rank becomes a cheap scan.
4. **[Medium] `SortableTable` re-sorts unmemoized on every render** (and it re-renders a lot — its own measurement effects set state), with `key={row-${index}}` defeating reconciliation. Memoize the sort; use stable row keys.
5. **[Medium] `AssumptionsContext` value is recreated every provider render** (object + all 10 functions), turning downstream `useMemo`s into no-ops (`AssumptionsSelector` memoizes on a per-render function identity; `GlobalSharedAssumptionsImport` re-fingerprints every render; `AssumptionsPage` re-normalizes all user assumptions per render — a `JSON.parse(JSON.stringify(...))` of the full tree). Memoize the context value and expose a memoized normalized-for-sharing value.
6. **[Low] `createCombinedAssumptions(null)` re-runs `createDefaultAssumptions()`** — a JSON round-trip of the full ~1.9MB dataset — on every call (`CategoryDetail.jsx` per effect run). Expose the memoized default-combined object from the context or module scope.

### 2.7 Product/platform gaps

1. **[High] Zero SEO/share infrastructure on a site whose stated goal is reach:** no per-page `document.title` (every donor page is titled "Impact List"), no meta description, no OG/Twitter tags, no sitemap/robots (the server even reserves those slugs). A `useDocumentTitle` hook + static meta tags is an afternoon; proper OG for donor pages may want prerendering eventually.
2. **[Medium] Scroll restoration fights the Back button** — `ScrollToTop` scrolls on every pathname change including POP navigations. Guard with `useNavigationType() !== 'POP'`.
3. **[Medium] "Clear All" in the calculator deletes every donation with no confirmation** while `ConfirmActionModal` guards far less destructive actions elsewhere.
4. **[Medium] `vercel.json`:** the SPA rewrite excludes any URL containing a dot and lists dev-server paths that don't belong in prod config; no cache headers for hashed `/assets/*`; no security headers; `buildCommand` drift (see §2.3.6).
5. **[Medium] Accessibility beyond modals:** `eslint-plugin-jsx-a11y` is installed but **commented out** in `eslint.config.js` — re-enable it; `AssumptionsDropdown` declares `role="menu"` without arrow-key navigation; `SortableTable`'s sticky-header clone leaves `<th>`s with no accessible name (`aria-hidden` on their only content); the mobile hamburger lacks `aria-expanded` and outside-click/Escape dismissal (`useDismissibleMenu` already exists); numeric inputs use `inputMode="text"` instead of `decimal`.
6. **[Low] App shell:** ErrorBoundary fallback and the global-error screen are near-identical markup (extract one `ErrorScreen`); `unhandledrejection` is not handled (async failures bypass the loud-fail screen); `validateDataOnStartup` runs in App's `useEffect`, which is *after* child page effects — run it at module scope in `main.jsx`.

### 2.8 Test gaps

The suites that exist are good (behavioral, fast, no snapshot junk). The riskiest untested code:

- ~~**`SortableTable` — zero tests anywhere**~~ *(✅ fixed 2026-06-10: `SortableTable.test.jsx` covers the negative-cost comparator ordering, direction toggling, the loud missing-column failure, and `sortable: false` no-ops.)* It was previously mocked out in `DonorList.test.jsx` despite containing core domain logic; a comparator test would have caught §2.1.2.
- The three effect editors (no direct tests) — best fixed by extracting the shared hook (§2.4.1) and testing that.
- `effectValidation.js` — 385 lines, zero tests. `getRecipientEffectsChangeState` (the most fragile editor logic, ~90 lines of interleaved booleans) — untested.
- DonorDetail/RecipientDetail (chart state machine), DonationCalculator (rank logic, localStorage round-trip — would have caught §2.1.4), CategoryList/RecipientList/CategoryDetail.
- `CurrencyInput`'s cursor-preservation logic (its reason to exist) — only the `displayOnly` variant is tested.
- E2E never visits the donor list/detail flow — the core product surface — and runs chromium-only. Consider adding the donor flow and wiring e2e into CI (nightly or per-PR).
- One test is named "should debug unified approach with simple case" — leftover debug naming.

### 2.9 Dependencies, config, docs hygiene

1. **[High — ✅ fixed 2026-06-10] `package.json` is still the template's:** `name: "webtemplate"`, `version: 1.0.0`, `main: "index.js"` (doesn't exist), empty description/author, `license: "ISC"` **with no LICENSE file** while the README recruits contributors. *Resolution: renamed to `impactlist` with description/author, `private: true`, phantom `main` removed, ISC LICENSE file added (matching the existing declaration). `engines` was deliberately set to `>=22` rather than the suggested 24: it's a support floor, not a pin (CI pins 24), and the Vercel function runtime — unrecorded in the repo, possibly 22 — must satisfy it. Tighten to `>=24` if the Vercel dashboard confirms 24.*
2. **[High — ✅ fixed 2026-06-10] `vercel` (the full CLI, 19MB) is a production dependency** with no runtime import — it accounts for 36 of 38 `npm audit --omit=dev` advisories. *Resolution: moved to devDependencies; with the other dependency fixes the production audit is now 0 advisories.*
3. **[High — ✅ fixed 2026-06-10] `prop-types` is a phantom dependency** — imported in 55 source files but not declared; it resolves only transitively (recharts → react-smooth). *Resolution: declared `^15.8.1`.*
4. **[High — ✅ fixed 2026-06-10] `react-router-dom` 7.13.0 carries high-severity advisories** (open-redirect relevant to SPAs; the RCE one targets framework/SSR mode). *Resolution: bumped to `^7.15.0` (7.17.0 installed); the remaining lodash advisory (via recharts) was patched in place.*
5. **[Medium] `vitest.config.js` defines an `@ → ./src` alias that `vite.config.js` doesn't** — tests would pass where builds fail. Delete it (it's unused) or merge the two configs (vitest config can live inside vite.config under `test:`).
6. **[Low] Docs/config odds and ends:** four overlapping AI-instruction files (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.cursor/rules/…` — the cursor file still contains the template placeholder "# Your rule content"); ~4 completed plan docs in `docs/` to archive; README omits Playwright entirely and has a port inconsistency + garbled final sentence; `.claude/settings.local.json` isn't in the repo `.gitignore`; untracked `.env.local` defines `HARED_ASSUMPTIONS_REDIS_REST_URL` (missing the leading `S` — works only via the `KV_REST_API_URL` fallback); `tests/multi-effect.test.js` is a stray top-level dir (fold into `src/utils` tests); dev-dependency audit has 2 criticals (vitest UI advisory — dev-only exposure) mostly fixable via `npm audit fix`.

### 2.10 What's in good shape (don't rework)

For calibration: the effects math is careful (`expm1`/`log1p` stability, correct negative-cost handling through harmonic combination) and backed by an excellent 1,481-line property-style suite; startup referential-integrity validation exists; curated-profile loading is the strictness gold standard; `NotificationContext` is textbook (split contexts, memoized actions); URL-as-state on the assumptions page is done right; share-link ID generation is crypto-secure and bias-free with atomic slug claims; user markdown can't XSS (no `rehype-raw`, no `dangerouslySetInnerHTML`, KaTeX trust off); design-token usage (`impact-*`, CSS vars) is consistent; no secrets or build artifacts are tracked.

---

## Part 3: Recommended to-do list

Ordered by leverage; sizes are rough. Items needing a product decision are flagged.

| # | Item | Refs | Size |
|---|------|------|------|
| 1 | ✅ **Done 2026-06-10** — package.json surgery: real name/description, `private: true`, `engines`, LICENSE file, `vercel` → devDeps, declare `prop-types`, bump `react-router-dom` ≥7.15 | §2.9.1–4 | S |
| 2 | ✅ **Done 2026-06-10** — Quick correctness batch: calculator sort columns + loud comparator; delete `.defaultProps`; guard persisted `JSON.parse` (clear + notify); 404 route + NotFound for unknown entity IDs; fix RecipientDetail date sort; narrow the two bare catches | §2.1.2–5, 8–9 | M |
| 3 | ✅ **Done 2026-06-10** — Pulse effects: decided (remove) and removed | §2.1.1 | S–M |
| 4 | ✅ **Done 2026-06-10** — Server hardening batch: generic 5xx messages, `Cache-Control` on snapshot GETs, read/health rate limit, log 429s, reject non-JSON content types + handle string bodies (incl. full-path body-size cap), Upstash fetch timeout | §2.2.1–4 | M |
| 5 | `<ModalShell>` with dialog semantics/focus trap/Escape; migrate all six modals | §2.4.2 | M |
| 6 | Extract `useRecipientEffectsDraft` + `<EffectCard>`; collapse the effect-editor trio; add tests for the hook | §2.4.1, 2.8 | L |
| 7 | Extract `useCategoryChartData` + `useChartViewTransition` for the detail pages; delete dead resize blocks and the eslint-disables | §2.4.3, 2.5 | M |
| 8 | Dead-code sweep (~900 lines incl. DonorList's dead stats loop, SortableTable's no-op block, dead generated exports — update pipeline tests that assert on `allDonations`) | §2.5 | M |
| 9 | Unified validation module shared by generator/app/server: build-time fraction/window/NaN enforcement, one global-parameter rules table, dedupe server vs client normalization, fix the curated-profile recipient-override bug, validate profiles against filtered recipients | §2.3.1–2, 7; 2.4.5; 2.2.7 | L |
| 10 | Pipeline determinism & strictness: sort glob results, throw on duplicate entity IDs, reject unknown frontmatter keys in all loaders, internal-notes/placeholder guards, `predev`/`pretest` generate, `vercel.json` buildCommand | §2.3.3–6, 8 | M |
| 11 | Routing/SEO: `React.lazy` per route, per-page titles + meta description, POP-aware scroll restoration, OG tags (static first) | §2.6.1, 2.7.1–2 | M |
| 12 | Memoization pass: `useMemo` on data pages (delete fake loading states), memoize context value + normalized-for-sharing, calculator leaderboard, SortableTable sort + stable keys, shared default-combined assumptions | §2.6.2–6 | M |
| 13 | Reject unknown effectIds/fields in client `normalizeUserAssumptions` (stale-assumptions model flip) + defensive shared-import catch; extract `getCreditedAmount` | §2.1.6–7, 2.2.8 | S |
| 14 | Test backfill: ~~SortableTable comparator~~ (✅ done 2026-06-10), DonationCalculator persistence, e2e donor flow + e2e in CI (nightly), re-enable jsx-a11y lint | §2.8, 2.7.5 | M |
| 15 | Remaining a11y/UX: Clear-All confirmation, dropdown menu keyboard semantics, sticky-header accessible names, hamburger dismissal, `inputMode="decimal"`; SpecificDonationModal decomposition onto the design system | §2.7.3, 5; 2.4.6 | M–L |
| 16 | Docs/config hygiene: archive completed plan docs, fix content/README leftovers (`/causes/`, document `assumptions/`), README Playwright section, `.gitignore` settings.local.json, fix `.env.local` typo, consolidate AI-instruction files, fold `tests/` in, merge vite/vitest configs | §2.9.5–6, 2.3.9 | S–M |

Items 1–4 are done (2026-06-10). Of the remainder: items 5–7 touch the assumptions editor surface — coordinate with any in-flight feature work there. Item 9 is the deepest structural change and pays for items it overlaps with; do it before adding more content validation piecemeal.
