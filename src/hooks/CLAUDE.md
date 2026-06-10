# src/hooks/ — shared hooks

- `useDocumentTitle(title)` — sets `"<title> — Impact List"`; no-ops on falsy (so detail pages can pass `entity?.name` while loading and NotFound owns the 404 title). Every page uses it.
- `useDismissibleMenu` — outside-click + Escape dismissal for popovers/menus; use it instead of hand-rolling listeners.
- `useAssumptionsEditorController` — the assumptions editor's tab/entity/URL orchestration.
- `useAssumptionsShareActions` / `useSaveAssumptionsModal` — share-link and save-to-library flows shared by AssumptionsPage and AssumptionsSelector.
- `useAssumptionsSelectorPreference` — localStorage-backed "show selector on every page" preference.
- `useRecipientEffectAdapter` — adapts recipient override/multiplier wrappers onto the category effect-input layouts.
- `useGlobalForm` — global-parameters form state for the editor.
- `useAssumptionsForm.js` — **misnamed**: it actually exports `useRecipientSearch` (recipient search/filter state). Rename pending; don't add a real `useAssumptionsForm` without resolving the collision.

Convention: hooks that subscribe to storage/events must clean up, and anything loading external assumption data must catch `normalizeUserAssumptions` incompatibility errors (see the `src/contexts/` context file).
