# src/pages/ — route components

One component per route; all lazy-loaded in `src/App.jsx` behind a Suspense fallback.

## Conventions

- Every page calls `useDocumentTitle('...')` (entity pages pass `entity?.name` — the hook no-ops on falsy, so titles resolve once data loads and `NotFound` owns the title when an ID is unknown).
- Unknown entity IDs are EXPECTED input (stale links): detail pages render `<NotFound message={...} />` — after all hooks, before the loading return — and their data effects early-return instead of throwing. `App.jsx` has the `path="*"` catch-all. Keep throws for genuinely impossible states only.
- All calculation reads go through `combinedAssumptions` from `useAssumptions()`; raw generated data (`donorsById` etc.) is only for existence checks and static lookups.
- Persisted-storage reads (`DonationCalculator` localStorage) must parse inside try/catch, clear the bad key, and notify — a throw here bricks the page permanently because refresh doesn't clear storage.

## Page notes

- `DonorList` — the homepage ranking table.
- `DonorDetail` / `RecipientDetail` — heavy twins: stats + category chart with a 4-effect view-transition state machine. They share ~250 duplicated lines that have already drifted; extracting `useCategoryChartData` + `useChartViewTransition` is review item 7 — make behavioral changes in BOTH files until then.
- `AssumptionsPage` — the editor shell. Tab/entity state lives in the URL (`?tab=...&categoryId=...`) with deliberate push/replace semantics and back/forward support; it's the best-tested page (50+ integration tests) — run them after any change to save/share/library flows.
- `DonationCalculator` — persists per-category amounts and specific donations to localStorage; recomputes the full donor leaderboard per keystroke (known perf item 12).
- `NotFound` — also used directly by detail pages; takes a `message` prop.

## Known debt

Most pages still derive data via `useEffect`+`setState` instead of `useMemo`, causing double renders and artificial "Loading..." flashes for synchronously available data — that conversion is review item 12 (paired with item 7). Don't add new effect-derived state.
