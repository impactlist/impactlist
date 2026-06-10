# AssumptionsEditor Refactor Plan

## Objective
Refactor `AssumptionsEditor` to reduce architectural risk, remove dead/duplicated logic, and make behavior easier to reason about and test without changing product behavior (except one explicit UX decision noted below).

## Explicit UX Decision
- Recipient search term will **not persist** when navigating away and returning to the assumptions page.
- Search state becomes page-local and resets on navigation.

## Why This Refactor
Current issues (combined from both reviews):

1. **State sync anti-pattern:** large `useEffect` synchronizes URL props into local state (`editingCategoryId`, `editingRecipient`) with fragile guards.
2. **Too many responsibilities in one component:** routing, URL mutation, tab orchestration, save/reset logic, and editor drill-downs are all centralized.
3. **Submit flow drift:** `handleSubmit` validates/saves data for tabs that are not actively editable from that UI path.
4. **Duplicated save loops:** recipient single-category and multi-category save handlers duplicate core logic.
5. **Persistence API shape mismatch:** save intent is “replace this edited set,” but implementation is per-effect mutation loops.
6. **Context coupling:** domain context also stores editor UI state and legacy name-based wrappers, increasing coupling and ambiguity.
7. **Minor debt:** small simplifications and consistency fixes (`Set` construction, parsing consistency, redundant helper function).

## Principles
- Use **one source of truth** for navigation/editing mode.
- Make behavior **correct by construction**, not by guard-heavy synchronization.
- Prefer **tab-specific handlers** over “validate everything” entry points.
- Use **intent-aligned batch APIs** for complex saves.
- Keep **domain state and UI state separated**.
- Ship in **small, reversible PRs** with tests at each step.

## Scope
In scope:
- `src/components/AssumptionsEditor.jsx`
- `src/pages/AssumptionsPage.jsx`
- `src/contexts/AssumptionsContext.jsx`
- `src/hooks/useAssumptionsForm.js`
- `src/components/assumptions/*` editors/sections touched by save flow

Out of scope (unless required by dependency):
- Visual redesign
- Data model changes in generated content
- Broad assumptions math changes

## Transition Contract (Important)
From Phase 1 onward:
- URL params are the canonical source for tab/editor mode.
- `activeTab` will no longer be independently mutated state.
- If `activeTab` remains exposed in context temporarily, it must be a derived compatibility value from URL-driven state (not a separate source of truth).

This prevents interim divergence between context and URL while later phases are in progress.

## Implementation Plan (Phased)

### Phase 0: Baseline Tests and Safety Net
Goal: lock current behavior before structural changes.

Tasks:
- Add/expand tests for:
  - URL deep-link behavior: `tab`, `categoryId`, `recipientId`, `activeCategory`.
  - Back/forward navigation behavior for entering/exiting editors.
  - Global save behavior and reset behavior.
  - Recipient/category editor save behavior.
- Add regression tests for invalid IDs in URL params (should gracefully return to list view).
- Add behavioral assertions for save outcomes (payload-level), so later API refactors preserve semantics.

Exit criteria:
- Existing behavior captured in tests.
- Refactor phases can run with confidence on unchanged UX.

---

### Phase 1: Unify Routing + Controller Shape (No Stepping-Stone Hook)
Goal: remove sync effect and install final orchestration shape directly.

Tasks:
- Introduce final controller hook (e.g. `useAssumptionsEditorController`) that owns:
  - Derived editor mode from URL props/data
  - Tab change handling
  - Edit entry/exit handling
  - URL param write decisions (push vs replace)
  - Save/reset action orchestration entry points
- Remove local state duplication for `editingCategoryId` and `editingRecipient`.
- Delete the large sync `useEffect` in `AssumptionsEditor`.
- Ensure URL-derived tab handling is canonical and compatible with browser navigation.

Exit criteria:
- No prop-to-state sync effect remains for editor mode.
- Navigation/edit mode passes deep-link and browser history tests.
- Controller responsibilities are explicit and testable.

---

### Phase 2: Normalize Submit/Validation Ownership and Remove Dead Paths
Goal: ensure visible UI and save/validation logic are aligned.

Tasks:
- Replace generic `handleSubmit` with tab-specific behavior:
  - Global tab: validate and save global parameters only.
  - Category/recipient list tabs: no submit path if list views are read-only.
- Move effect validation/save concerns to dedicated editors (`CategoryEffectEditor`, `RecipientEffectEditor`, `MultiCategoryRecipientEditor`) where edits actually occur.
- Remove/simplify stale form pipeline usage in `AssumptionsEditor` (recipient/category paths that are no longer real input flows).

Exit criteria:
- No hidden save behavior for unrelated tabs.
- Save/validate paths map directly to visible editable UI.

---

### Phase 3: Introduce Intent-Aligned Batch APIs + Save Deduplication
Goal: make persistence semantics clearer and reduce redundant updater-chain work.

Clarification:
- This phase is **not** based on a claim of many renders/effects per click (React 18 event batching usually prevents that).
- Motivation is API clarity, reduced repeated structural merge work, and lower bug surface.

Tasks:
- Add batch APIs in `AssumptionsContext` (examples):
  - `replaceCategoryEffects(categoryId, effects)`
  - `replaceRecipientCategoryEffects(recipientId, categoryId, effects)`
  - `replaceRecipientEffectsByCategory(recipientId, effectsByCategory)`
- Implement each batch API with one `setUserAssumptions` call per edited target.
- Update editor save handlers to call batch APIs instead of looping per effect with repeated setters.
- Remove duplicated recipient save loop logic via shared helper path.

Exit criteria:
- Save handlers express “replace edited set” semantics directly.
- Existing behavior preserved in tests.

---

### Phase 4: Context Decoupling + Cleanup
Goal: reduce coupling, close migration gaps, and clean residual debt.

Tasks:
- Remove editor-specific UI state from `AssumptionsContext` where feasible:
  - `activeTab` (fully remove transitional compatibility if still present)
  - `recipientSearchTerm` (move to page-local state; intentionally reset on navigation)
- Migrate mutable APIs toward ID-based signatures where feasible.
- Keep temporary compatibility wrappers only where required; mark and remove when callers are migrated.
- Audit/remove `isActive` prop and related hook gating logic if effectively always `true`.
- Cleanup consistency items:
  - Use consistent numeric parsing/validation utility (`cleanAndParseValue`) where currently loose checks exist.
  - Simplify `categoriesWithCustomValues` construction.
  - Remove unnecessary helper indirection (`getDescription`) and stale comments.

Exit criteria:
- Domain context focuses on assumptions data + domain mutations.
- Search reset behavior is explicit and tested.
- No stale compatibility state remains without documented reason.

## Suggested PR Breakdown (4 PRs)
1. **PR1:** Baseline tests only (Phase 0).
2. **PR2:** Routing/controller unification + derived editor mode + submit/dead pipeline cleanup (Phases 1+2).
3. **PR3:** Batch persistence APIs + save deduplication (Phase 3).
4. **PR4:** Context decoupling + UX decision implementation for search reset + cleanup (`isActive` audit and minor fixes) (Phase 4).

## Risk Analysis and Mitigations
- **Risk:** Navigation regressions (deep-link/back-forward).
  - **Mitigation:** explicit routing tests in PR1, preserved through all phases.
- **Risk:** Behavior drift in assumptions persistence.
  - **Mitigation:** payload-level behavior tests before/after batch API migration.
- **Risk:** Large PR complexity.
  - **Mitigation:** 4 coherent PRs with clear boundaries and reversible steps.
- **Risk:** Breaking callers during API cleanup.
  - **Mitigation:** compatibility adapters + callsite migration verification before wrapper removal.
- **Risk:** UX confusion from search reset behavior.
  - **Mitigation:** explicit product note in changelog/PR and regression test asserting reset semantics.

## Definition of Done
- Large sync `useEffect` removed from `AssumptionsEditor`.
- URL is canonical source of tab/editor mode throughout refactor.
- Save/validation flows are tab-specific and explicit.
- Recipient/category save logic uses shared, intent-aligned batch paths.
- Context no longer owns editor-only UI state.
- Search reset-on-navigation behavior is implemented intentionally and tested.
- `isActive` is removed if unneeded (or documented if retained).
- No user-visible regressions beyond the explicit search persistence change.
