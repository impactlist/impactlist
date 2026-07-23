# src/pages/ — route components

One component per route; all lazy-loaded in `src/App.jsx` behind a Suspense fallback.

## Conventions

- Every page calls `useDocumentTitle('...')` (entity pages pass `entity?.name` — the hook no-ops on falsy, so titles resolve once data loads and `NotFound` owns the title when an ID is unknown).
- Unknown entity IDs are EXPECTED input (stale links): detail pages render `<NotFound message={...} />` — after all hooks, before the loading return — and their data effects early-return instead of throwing. `App.jsx` has the `path="*"` catch-all. Keep throws for genuinely impossible states only.
- All calculation reads go through `combinedAssumptions` from `useAssumptions()`; raw generated data (`donorsById` etc.) is only for existence checks and static lookups.
- Persisted-storage reads (`DonationCalculator` localStorage) must parse inside try/catch, clear the bad key, and notify — a throw here bricks the page permanently because refresh doesn't clear storage.

## Page notes

- `DonorList` — the homepage ranking table. Its cause scope lives in the
  `causes` query parameter (absent means all causes); scoped rows are fully
  recalculated and use categorized donation portions only.
- `DonorDetail` / `RecipientDetail` — stats + category chart; the chart logic is shared via `hooks/useCategoryChartData` + `hooks/useChartViewTransition` (see the hooks context file) — page-level code is just data assembly in one `useMemo`.
- `AssumptionsPage` — the editor shell. Tab/entity state lives in the URL (`?tab=...&categoryId=...`) with deliberate push/replace semantics and back/forward support; it's the best-tested page (60+ integration tests) — run them after any change to save/share/library flows. Two dirtiness indicators coexist BY DESIGN: the library panel reports only the APPLIED state vs the active entry (what the whole site renders), while un-applied drafts show only in the editor (surfaced by its amber draft indicators — Global tab badge, unapplied-count chip + Discard, cross-tab Review reminder, graph draft-preview labeling — preserved across entry switches by `useGlobalForm`'s value-aware rehydration, loss-guarded by the navigation blocker — which for dirty drill-in editors also fires on tab/entity switches and the back button, since those unmount the editor). Don't make the panel draft-aware — it would misreport the applied state; the two-indicator contract is pinned by the "preserves unapplied global drafts" tests.
- `DonationCalculator` — persists per-category amounts and specific donations to localStorage. Persisted state loads in the **state initializers** (not effects) so the unconditional save effects can never write before the load; the corruption notification is deferred to a mount effect because notifying mid-render is illegal. Donor stats for the rank readout are memoized per `combinedAssumptions`.
- `NotFound` — also used directly by detail pages; takes a `message` prop.

## Conventions for derived data

Pages derive synchronous data with `useMemo` keyed on `[entityId, combinedAssumptions]` — never `useEffect`+`setState` (that pattern caused double renders and fake "Loading…" flashes; it was removed in review item 12, don't reintroduce it). There are no loading states for generated data: it's imported, so it's synchronously available. Static table column configs live at module scope. Arrays passed to `SortableTable` must be memoized — its sort memo keys on data identity.
