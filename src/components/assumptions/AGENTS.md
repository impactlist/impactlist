# src/components/assumptions/ — the assumptions editor

The editing UI for global parameters, category effects, and per-recipient effect overrides. Rendered inside `AssumptionsEditor.jsx` (component root one level up) on the `/assumptions` page, with tab/entity selection held in the URL.

## Structure

- `GlobalValuesSection` / `CategoryValuesSection` / `RecipientValuesSection` — the three tabs' list/summary views.
- `CategoryEffectEditor` — edits a category's effects (direct field values); owns the category-flavor draft logic.
- `RecipientEffectEditor` / `MultiCategoryRecipientEditor` — edit a recipient's per-category effect **overrides/multipliers** (not direct values). Multi-category recipients get one section per category. Both are thin shells around `hooks/useRecipientEffectsDraft` (the entire draft state machine — unit-tested; change edit behavior THERE) and `RecipientEffectCard`.
- `EffectCard` — the card chrome shared by all three editors (title/toggle/cost row, active-interval note, disabled dimming); `RecipientEffectCard` composes it with the recipient override inputs.
- `effects/` — per-type input layouts: `QalyEffectInputs`, `PopulationEffectInputs`, and recipient variants that adapt overrides onto the same layouts via `useRecipientEffectAdapter`.
- `TabNavigation` — textbook ARIA tablist; copy its pattern for new tabbed UI.

## The data model the editors speak

- Category effect edits are stored as direct fields: `{effectId, costPerQALY: 123, disabled?}` — only diffs from defaults survive `normalizeUserAssumptions`.
- Recipient effect edits are wrappers: `{effectId, overrides: {field: value}, multipliers: {field: factor}, disabled?}`. An override and multiplier for the same field are mutually exclusive (setting one clears the other).
- Draft state in the editors is stringly (users type partial values like `"-"` or `"1,0"`); `effectEditorUtils.cleanEffectsForSave` converts to numbers at save and throws on garbage. Preview costs use `calculateEffectCostPerLife`, which renders expected mid-typing states as Infinity ("N/A").
- Editor drafts carry an internal `_baseEffect` reference for display purposes — it must NEVER reach `normalizeUserAssumptions`/saved state (validation would reject it as an unknown field). The save paths strip down to the wrapper shape.

## Testing

Recipient draft logic is unit-tested in `src/hooks/useRecipientEffectsDraft.test.js` (init, stringly overrides, override/multiplier exclusivity, validation errors, disable toggling, the minimal save shape, baseline reinitialization). Editor UI behavior is covered by the `AssumptionsPage.test.jsx` integration suite and the e2e smoke specs — run both after changes here.
