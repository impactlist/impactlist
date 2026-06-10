# src/utils/ — calculation core and assumptions plumbing

The math that produces every number on the site lives here. Treat `effectsCalculation.js` as the most important file in the repo.

## Key files

- `effectsCalculation.js` — effect → cost-per-life math. QALY effects (`costPerQALY`) and population effects (`costPerMicroprobability` + `populationFractionAffected` + `qalyImprovementPerYear`), both with `startTime`/`windowLength` windows, discounting, historical-vs-future population splitting, and population caps/floors. Uses `expm1`/`log1p` for numerical stability near growth≈discount. `windowLength` must be > 0 (asserted; "pulse" effects were deliberately removed — approximate a point-in-time effect with a tiny window if ever needed). `calculateCostPerLife` combines weighted effects harmonically and handles negative/Infinity values deliberately.
- `assumptionsDataHelpers.js` — default/combined assumptions construction, donor stats, per-donation lives saved, category breakdowns. `createDefaultAssumptions()` deep-copies the whole generated dataset (expensive — don't call casually; `AssumptionsContext` owns the memoized instance).
- `assumptionsAPIHelpers.js` — pure state-transition helpers for user assumptions (set/clear overrides, multipliers, effects) plus `normalizeUserAssumptions`, which prunes default-equal values AND **throws** on anything the current schema doesn't know (unknown sections/categories/recipients/effectIds/fields, non-boolean `disabled`, non-finite numeric values). It mirrors the server-side snapshot validator (`src/server/sharedAssumptionsValidation.js`) — keep them in sync until they're unified (review item 9). Callers feeding it external data must catch.
- `savedAssumptionsStore.js` — the localStorage "Assumptions Library" (entries, active id, eviction, share-reference attachment). Fires `SAVED_ASSUMPTIONS_CHANGED_EVENT` on writes.
- `dataValidation.js` / `startupValidation.js` — assert vocabulary + app-startup integrity checks. Known drift: startup validation enforces rules the build-time generator doesn't (review item 9 unifies them).
- `donationDataHelpers.js` — donation/donor/recipient lookups over generated data. Use `getCreditedAmount(donation)` for the donor-credited portion — never hand-roll `amount * credit` (generated rows precompute `creditedAmount`; calculator-created donations have neither field and count in full).
- `effectValidation.js`, `effectEditorUtils.js`, `effectFieldHelpers.js`, `assumptionsFormValidation.js` — editor-side parsing/validation of in-progress (stringly) input. `calculateEffectCostPerLife` pre-screens expected mid-typing states and returns Infinity for them; anything that throws past the pre-screen is a real bug and must surface.
- `formatters.js` — display formatting. `formatLives`/`formatCurrency` handle negatives and ∞; scientific notation above ~1e21.
- `shareAssumptions.js` — client for the share API (`/api/shared-assumptions`).

## Gotchas

- Years are integers everywhere; entry points assert this. `donationYear` in the future is clamped to the current year.
- `effectToCostPerLife` branches on `costPerQALY !== undefined` — a stray field flips the model. That's why unknown-field rejection exists at every external boundary.
- `selectEffectsForYear` filters by `validTimeInterval` (`[start|null, end|null]`); effects also re-filter inside `calculateCostPerLife` — harmless double filter, don't "fix" one without the other.
- `effectsVisualization.js` returns a points ARRAY with `seriesMetadata` attached as an expando property — `.map`/`.filter` upstream silently strips it.
- Test conventions: `effectsCalculation.test.js` is property-style (monotonicity, boundary continuity, integration-matches-total) — extend in that spirit. Several validation files still have thin coverage (see docs/CodebaseReview-2026-06-10.md §2.8).
