# src/hooks/ — shared hooks

- `useDocumentTitle(title)` — sets `"<title> — Impact List"`; no-ops on falsy (so detail pages can pass `entity?.name` while loading and NotFound owns the 404 title). Every page uses it.
- `useNameSearch(items)` — list-page search state: returns `{searchTerm, setSearchTerm, filteredItems}` filtering by `name` (case-insensitive, query trimmed). `filteredItems` is memoized per term — safe to pass straight to SortableTable. Used by DonorList and RecipientList.
- `useCategoryChartData(combinedAssumptions, donations, {maxCategories})` — memoized per-category aggregation (donation amount + lives saved per category) behind the donor/recipient detail charts; collapses the tail into an "Other Causes" row past `maxCategories`. Pass real donations only (no synthesized "unknown" rows).
- `useChartViewTransition(rawChartData)` — the detail charts' donations⇄lives-saved toggle state machine. The chart renders `valueTarget` with recharts animation; a toggle animates by holding the FROM value and retargeting, then rows rebuild once idle. Returns `{chartData, chartView, isTransitioning, handleChartViewChange}`.
- `useFormattedNumberInput(value, emitChange)` — the formatted-number input core (local display state, comma formatting, cursor preservation, prop→display sync) behind CurrencyInput/NumericInput; `emitChange(formatted, raw)` leaves parsing to the component.
- `useDismissibleMenu` — outside-click + Escape dismissal for popovers/menus; use it instead of hand-rolling listeners. `onDismiss` receives the reason (`'outside' | 'escape'`) so callers can refocus the trigger on Escape (Header and AssumptionsDropdown do).
- `useAssumptionsLibrary` — the saved-assumptions library state machine shared by AssumptionsPage and AssumptionsSelector: entries (curated + saved), active entry, fingerprint-based unsaved-changes detection, the change-event subscription, and the load/confirm/replace flow (callers render the confirmation modal from `pendingLoadEntry`). `notifyOnEntrySwitch` adds the page's informational notices. Mocks of `markSavedAssumptionsLoaded` must return `{ ok }` — the hook checks it.
- `useAssumptionsEditorController` — the assumptions editor's tab/entity/URL orchestration.
- `useAssumptionsShareActions` / `useSaveAssumptionsModal` — share-link and save-to-library flows shared by AssumptionsPage and AssumptionsSelector.
- `useAssumptionsSelectorPreference` — localStorage-backed "show selector on every page" preference.
- `useRecipientEffectsDraft` — the recipient effect editors' entire draft state machine (stringly override drafts, override/multiplier exclusivity, validation errors, preview costs, minimal save shape via `getEffectsToSave()` — drafts carry an internal `_baseEffect` that must never reach saved state). Takes `defaultAssumptions`/`userAssumptions` as arguments (pure; unit-tested with synthetic data).
- `useRecipientEffectAdapter` — adapts recipient override/multiplier wrappers onto the category effect-input layouts.
- `useGlobalForm` — global-parameters form state for the editor.
- `useAssumptionsForm.js` — **misnamed**: it actually exports `useRecipientSearch` (recipient search/filter state). Rename pending; don't add a real `useAssumptionsForm` without resolving the collision.

Convention: hooks that subscribe to storage/events must clean up, and anything loading external assumption data must catch `normalizeUserAssumptions` incompatibility errors (see the `src/contexts/` context file).
