# src/components/assumptions/ — the assumptions editor

The editing UI for global parameters, category effects, and per-recipient effect overrides. Rendered inside `AssumptionsEditor.jsx` (component root one level up) on the `/assumptions` page, with tab/entity selection held in the URL.

## Structure

- `GlobalValuesSection` / `CategoryValuesSection` / `RecipientValuesSection` — the three tabs' list/summary views.
- `CategoryEffectEditor` — edits a category's effects (direct field values).
- `RecipientEffectEditor` / `MultiCategoryRecipientEditor` — edit a recipient's per-category effect **overrides/multipliers** (not direct values). Multi-category recipients get one section per category.
- `effects/` — per-type input layouts: `QalyEffectInputs`, `PopulationEffectInputs`, and recipient variants that adapt overrides onto the same layouts via `useRecipientEffectAdapter`.
- `TabNavigation` — textbook ARIA tablist; copy its pattern for new tabbed UI.

## The data model the editors speak

- Category effect edits are stored as direct fields: `{effectId, costPerQALY: 123, disabled?}` — only diffs from defaults survive `normalizeUserAssumptions`.
- Recipient effect edits are wrappers: `{effectId, overrides: {field: value}, multipliers: {field: factor}, disabled?}`. An override and multiplier for the same field are mutually exclusive (setting one clears the other).
- Draft state in the editors is stringly (users type partial values like `"-"` or `"1,0"`); `effectEditorUtils.cleanEffectsForSave` converts to numbers at save and throws on garbage. Preview costs use `calculateEffectCostPerLife`, which renders expected mid-typing states as Infinity ("N/A").
- Editor drafts carry an internal `_baseEffect` reference for display purposes — it must NEVER reach `normalizeUserAssumptions`/saved state (validation would reject it as an unknown field). The save paths strip down to the wrapper shape.

## Known debt — read before editing here

This directory is review item 6 (docs/CodebaseReview-2026-06-10.md §2.4.1): ~200 lines of draft-state logic are duplicated between `RecipientEffectEditor` and `MultiCategoryRecipientEditor`'s inner section, and the per-effect card JSX is triplicated across both plus `CategoryEffectEditor`. The planned fix is a shared `useRecipientEffectsDraft` hook + `<EffectCard>`. If you're changing edit behavior, expect to make the same change in 2–3 places until item 6 lands — and consider doing item 6 first. The editors have no direct unit tests; coverage comes via `AssumptionsPage.test.jsx` integration tests.
