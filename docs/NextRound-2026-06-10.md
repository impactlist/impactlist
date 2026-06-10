# Next Round — Remaining Work Items (June 10, 2026)

All 16 numbered items from `CodebaseReview-2026-06-10.md` Part 3 are done. This document details what remains: the still-open Part 2 findings worth scheduling, two items that fell through the original numbering entirely (§2.7.4, §2.4.4), and gaps introduced or noticed during the fix rounds themselves. Section references (§x.y.z) point into the review document, which stays the source of truth for the original findings; this document is the actionable plan.

Sizes: **S** ≈ under an hour, **M** ≈ a focused session, **L** ≈ multiple sessions.

---

## Work items

### W1. ✅ Done 2026-06-10 — `vercel.json` hardening (§2.7.4) — S, config-only

**Never entered the original to-do numbering** — only its `buildCommand` clause got fixed (riding along with item 10). Three gaps remain in the current 9-line file:

1. **The SPA rewrite excludes any URL containing a dot.** The source regex ends with `.*\..*` in its negative lookahead, so a route like `/recipient/some.id` would bypass the SPA and 404. It also still lists dev-server paths (`@vite/`, `@react-refresh`, `src/`, `node_modules/`) that don't belong in production config. Fix: rewrite everything to `/index.html` except `api/` and `assets/` plus the handful of real static files (`favicon`, future `sitemap.xml`/`robots.txt`), instead of excluding all dotted URLs.
2. **No cache headers for hashed assets.** Everything under `/assets/*` is content-hashed by Vite and should be `Cache-Control: public, max-age=31536000, immutable`. `index.html` should be `no-cache` (or short max-age) so deploys propagate. This is also what makes W3's dataset chunk worthwhile — see below.
3. **No security headers.** Ship the safe set: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `frame-ancestors`/`X-Frame-Options`. **Deliberately skip CSP in this pass**: KaTeX, recharts, and framer-motion all rely on inline styles, and a half-right CSP that intermittently breaks rendering is worse than none. If CSP is wanted later, it's its own carefully-tested item.

**Verification:** build + full e2e (the rewrite change touches routing of every URL), plus header assertions (curl against `vercel dev` or a preview deploy). **Decision needed:** none beyond confirming the skip-CSP call.

### W2. ✅ Done 2026-06-10 — `sitemap.xml` + `robots.txt` (§2.7.1, the static half) — S–M

The reviewed gap called SEO absence out as materially hurting a reach-focused site. Titles, meta description, and static OG tags exist now; the cheap remaining statics are:

- **`sitemap.xml`, generated at build time.** The generator already knows every donor, recipient, and category ID (`scripts/generate-data-from-markdown.js` builds the filtered sets) — emit a sitemap of `/`, the list pages, and every entity detail URL as part of `npm run generate-data`, written to `public/`. Keep it out of git (generated), add to `.gitignore`, and exclude it from the SPA rewrite (see W1 — natural pairing).
- **`robots.txt`** — static file in `public/` pointing at the sitemap.

The dynamic half of §2.7.1 (per-page OG tags and an OG image, which require prerendering or an edge function) stays **parked** — it's an architecture decision, not a task (see Parked list).

**Verification:** pipeline test asserting the sitemap exists and contains a known entity URL; e2e unaffected.

### W3. ✅ Done 2026-06-10 — Get the dataset out of the entry chunk (§2.6.1 remainder) — M

The biggest remaining first-load lever. Lazy routes cut the entry chunk from 2.39MB to ~1.37MB, but `src/data/generatedData.js` (~1.05MB after the dead-export sweep) is still statically imported into the entry via `AssumptionsContext`.

**Recommended approach: a `manualChunks` split, not runtime-fetched JSON.** Putting the dataset in its own named chunk means (with W1's immutable cache headers) content edits stop invalidating the app-code chunk and code changes stop invalidating the data chunk — most repeat visits re-download neither. It's a build-config-only change with no architectural risk.

The "full" solution — fetching the data as JSON at runtime — is **parked**, deliberately: `generatedData` is imported at module scope throughout `src/utils/`, by `AssumptionsContext`'s module-level `createDefaultAssumptions()`, _and by the server modules_ (`src/server/sharedAssumptionsNormalization.js`), so a fetch-based client would need an async bootstrap gate plus a separate server import path. That's a real project with modest payoff over the chunk split.

**Verification:** build output inspection (chunk sizes + names), full e2e. **Decision needed:** confirm chunk-over-fetch (recommended above).

### W4. ✅ Done 2026-06-10 — Extract `useAssumptionsLibrary()` (§2.4.4) + `AssumptionsDropdown` internal dedup (from §2.4.6) — M

**The other item that never entered the original numbering.** `AssumptionsPage` and `AssumptionsSelector` each maintain the full saved-assumptions library state machine: fingerprinting the current assumptions, unsaved-changes detection, the load-confirm flow, and the `SAVED_ASSUMPTIONS_CHANGED_EVENT` subscription. The duplication is the classic drift hazard this codebase has been eliminating all round — and this is the largest remaining instance.

- Extract a `useAssumptionsLibrary()` hook owning entries, active id, fingerprint comparison, unsaved-changes state, and the load/confirm/replace flow; both components become consumers.
- While in the file: `AssumptionsDropdown` duplicates its rename-controls block (input + Save/Cancel) and label markup between the summary row and menu rows — extract the shared row pieces.

This is the best-protected refactor remaining: the 50+ `AssumptionsPage` integration tests, the selector suite, and the new dropdown keyboard tests sit directly on top of it.

**Verification:** those three suites plus the e2e assumptions flows. **Decision needed:** none.

### W5. ✅ Done 2026-06-10 — Verification-layer backfill (§2.8 remainder + one-liners) — M, purely additive

- **`src/utils/effectValidation.js` — 385 lines, still zero direct tests**, including `getRecipientEffectsChangeState` (called "the most fragile editor logic" in the review; item 6's hook tests exercise it only indirectly via `getEffectsToSave`).
- **Unit tests for the item-7 chart hooks** — `useCategoryChartData` (aggregation, fraction splits, the top-12/"Other Causes" cap, percentage formatting) and `useChartViewTransition` (idle rebuild, the FROM→TO transition, animation-flag timing). Item 6's hook got eight tests; these two got only indirect e2e coverage.
- **Rename the `"should debug unified approach with simple case"` test** in `effectsCalculation.test.js` to describe what it asserts.
- **`RecipientValuesSection.jsx` still `.sort()`s `filteredRecipients` in place during render** — same mutation class the last review round fixed in `SpecificDonationModal`; one-line `[...]` copy (or a memo).
- ~~Optional: run the e2e suite on firefox/webkit in the nightly only~~ _(✅ resolved 2026-06-10, differently: there is no nightly consumer for a solo project, so firefox/webkit are defined as Playwright projects but run ONLY via `npm run test:e2e:release` — the pre-release/publicity cross-browser pass. All routine entry points pin `--project=chromium`.)_

**Verification:** the new tests are the deliverable; full suite + lint. **Decision needed:** ~~whether cross-browser nightly is wanted~~ (resolved — see above).

### W6. ✅ Done 2026-06-11 — Small-clones sweep (rest of §2.4.6) — M

All mechanical DRY work guarded by existing suites; batched so one verification sweep amortizes across ~6 refactors:

- **The colored Lives Saved / Cost-Per-Life table cell**, re-written on three list pages **with inconsistent ∞-sentinel logic** — `DonorList` renders "∞" when `totalLivesSaved === 0`, while `RecipientList`/`CategoryList` key off `costPerLife === 0`. Extract one cell component. ⚠️ **This is the one item here with a behavior decision**: which sentinel condition is correct (they disagree exactly when cost is 0 with nonzero lives, or lives are 0 with nonzero cost).
- **`CurrencyInput`/`NumericInput`** ~80% identical — merge, or extract `useFormattedNumberInput` (cursor preservation, comma formatting, partial-input states). Keep the new `inputMode` prop semantics.
- **`assumptionsAPIHelpers.js`**: `setRecipientFieldOverride`/`setRecipientFieldMultiplier` are ~80-line near-clones, and prune logic is implemented four ways in the same file.
- **Recipient-effect resolution** (select-for-year → find override → apply) repeated at four sites.
- **Comma formatting** re-implemented 4× (partially reduced by item 15's modal migration); **`getEffectType`** defined twice plus inline type-sniffs; **`EntityDonationTable`**'s donor/recipient column sets near-identical; the **list-page scaffold** (BackButton + motion containers + PageHeader + table surface) repeats verbatim on three pages.

**Verification:** full suite + e2e; the `SortableTable`/list-page tests and the editor suites cover the touched surfaces. **Decision needed:** the ∞-sentinel rule.

---

## Parked (deliberately not in any chunk)

- **§2.2.5–6 — server write-side backstops and smaller items.** Global storage quota and content-hash dedup need a product decision on limits; `schemaVersion`/`appDataVersion` need a decision (migration story vs. delete); rightmost-trusted `x-forwarded-for` parsing matters only off-Vercel. Low urgency behind the existing 10-saves/hour limit.
- **Per-page OG + OG image (§2.7.1 dynamic half).** Requires prerendering, SSR, or an edge function — an architecture choice to make once, deliberately.
- **§2.3.9 — generator structure.** The four near-identical loaders and the 1,100-line script work fine behind their 28 subprocess tests; restructuring is style payoff only. The genuinely useful fragments (entity-link build checks, `content/README.md` `/causes/` fix, the `sergey_brin_family_foundaiton.md` filename typo) could ride along with any chunk.
- **Runtime-fetched dataset** (see W3) — only if the chunk split proves insufficient.
- **`engines` bump to `>=24`** — blocked on confirming the Vercel function runtime in the dashboard.
- **CSP** — see W1; its own carefully-tested item if wanted.

---

## Recommended chunking

Grouping principle: items that share a **verification surface** (one build/test/e2e sweep covers the chunk) and a **file surface** (no file touched by two chunks) go together, with at most one decision-bearing item per chunk.

| Chunk                      | Contents     | Size | Why together                                                                                                                                                                                                                                                                                                | Decisions needed up front                                      |
| -------------------------- | ------------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **A — delivery & reach**   | W1 + W2 + W3 | M    | All three are delivery of the same artifact: the rewrite fix and the sitemap exclusion touch the same `vercel.json` block; the dataset chunk split only pays off because of the cache headers; sitemap emission lives in the same build pipeline. One build + e2e + header-check sweep verifies everything. | Skip-CSP (recommended yes); chunk-over-fetch (recommended yes) |
| **C — verification layer** | W5           | M    | Purely additive, zero product risk; widens the safety net under chunks B and D.                                                                                                                                                                                                                             | Cross-browser nightly?                                         |
| **B — library hook**       | W4           | M    | Single component surface; the best-tested refactor target in the repo.                                                                                                                                                                                                                                      | none                                                           |
| **D — small-clones sweep** | W6           | M    | Mechanical refactors amortized under one full sweep.                                                                                                                                                                                                                                                        | ∞-sentinel rule                                                |

**Recommended order: A → C → B → D.** _Chunk A completed 2026-06-10: SPA rewrite no longer excludes dotted URLs (dev-server exclusions kept for `vercel dev`), immutable `Cache-Control` on `/assets/*` plus the safe security-header set (CSP deliberately skipped), generator emits `sitemap.xml`/`robots.txt` (356 URLs; origin from `SITE_ORIGIN` → `VERCEL_PROJECT_PRODUCTION_URL` → localhost; gitignored; pipeline-tested), and `manualChunks` isolates the dataset — entry chunk 1.37MB → 416KB with the data in an immutably-cached 968KB chunk._ _Chunk C completed 2026-06-10: 33 new unit tests (effectValidation, getRecipientEffectsChangeState, both chart hooks), the debug-named test renamed, the RecipientValuesSection in-place sort fixed — and the first `test:e2e:release` run passed 24/24 across chromium/firefox/webkit._ A is the only chunk users can feel and the only one needing up-front decisions; C makes everything after it safer; B and D are interchangeable. Each chunk is a single reviewable commit in the style of the prior rounds. _Chunk B completed 2026-06-10: `useAssumptionsLibrary()` owns the library state machine for both consumers (drift resolved on the page semantics: stale persisted ids are cleared, invalid entries notify, `markSavedAssumptionsLoaded` results are checked; the page-only switch notifications stay behind `notifyOnEntrySwitch`), and the dropdown's rename controls + label/pill blocks are single components._ _Chunk D completed 2026-06-11: `ImpactValueCell` unifies the six list-page lives/cost cells on the value-keyed ∞ rule (Option A — ∞ iff ±Infinity; invalid states stay loud: 0 shows as `$0` and NaN as `$NaN` instead of masquerading as no-effect); `ListPageShell` replaces the Causes/Recipients scaffolds; `EntityDonationTable`'s duplicated column sets collapse into shared definitions (its lives===0 ∞ guard kept — load-bearing for synthetic Unknown rows); `setRecipientFieldOverride/Multiplier` share one worker; `useFormattedNumberInput` carries the cursor/comma core of both inputs; `getEffectType` is single-sourced; CalculatorForm uses `formatNumberWithCommas` (also fixing trailing-decimal display while typing). Deliberately skipped: the recipient-effect-resolution wrapper (only three call sites remain post items 7/9/12, each with different semantics), and `FormField` — it shares only the formatter UTILITY calls with the inputs, not the stateful machinery `useFormattedNumberInput` extracted; it is a fully controlled component (no local state/refs/effects, percentage ×100 display transform, parent owns the draft string), and converting it onto the hook would be a redesign, not a dedup._
