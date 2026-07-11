# Assumptions Editor UX Audit

**Date:** July 11, 2026  
**Scope:** `/assumptions` — assumptions library, Global/Causes/Recipients tabs, cause and recipient drill-ins, preview years, Apply behavior, search, responsive layout, and accessibility  
**Status:** Analysis and recommendations only; no product code was changed

## Executive summary

The assumptions editor is technically robust. Its validation, navigation protection, URL-backed state, before/after differences view, and computed readouts are unusually strong for a complex modeling interface.

Its main usability problem is not visual polish or correctness. It is **state clarity**.

Users must distinguish four layers:

1. **Draft** — values typed into the form but not yet applied.
2. **Active** — assumptions currently used by rankings and calculations in this browser tab.
3. **Browser-saved** — named snapshots stored locally for reuse.
4. **Shared** — server-backed snapshots available through a link.

The system handles these layers correctly, but the interface does not consistently expose them. A Global draft can affect the on-page graph, survive a tab switch, disappear from view, and leave Causes and Recipients using the previously applied values. After the user applies the draft, there is no confirmation, and the selector changes to **“Custom (unsaved)”**, making successfully applied work still sound at risk.

The three highest-leverage improvements are:

1. Make draft, active, browser-saved, and shared states explicit and persistent.
2. Replace effect IDs and mathematical jargon with human effect names and belief-oriented explanations.
3. Use one preview year across lists and drill-in editors, and preserve list context while editing.

## Relationship to the earlier review

The repository already contains a source-only review with mockups:

- [The Assumptions Editor, Reconsidered](./AssumptionsEditorUXReview-2026-07-08.html)

That review was based on static source inspection and was not tested in the running application. This audit verifies most of its findings in the live UI and adds several issues that were especially clear during interaction testing:

- Global drafts become invisible when another tab is selected.
- The Global graph uses draft values while cause and recipient lists continue to use active values.
- Preview-year divergence produces visibly different costs between a list and its drill-in.
- “Custom values” in the recipient tab conflates built-in recipient-specific assumptions with user edits.
- The year control and effect-field labels have accessibility problems.
- The mobile cause list is a long scan without search or filtering.

## Method

The audit combined:

- A source review of the assumptions page, editor controller, library, diff view, effect editors, inputs, validation, and responsive CSS.
- Live interaction testing of the Vite application.
- Desktop inspection at **1280 × 720**.
- Narrow-screen inspection at **390 × 844**.
- Global editing, cross-tab draft preservation, Apply behavior, cause and recipient drill-ins, recipient search, preview-year changes, back/forward navigation, and mobile layout checks.
- Inspection of the browser accessibility tree for headings, tabs, labels, controls, and status feedback.

No user research sessions or analytics were available, so severity reflects observed interface risk rather than measured abandonment rates.

## Priority summary

| Priority | Finding | Recommended change |
| --- | --- | --- |
| P0 | Unapplied Global edits become invisible after switching tabs, while different parts of the page use different value layers. | Add persistent unapplied status, a Global-tab indicator, explicit preview labeling, and a sticky Apply/Discard action bar. |
| P0 | Apply is silent, then the active selector says “Custom (unsaved).” | Confirm that values were applied site-wide and rename the active state to distinguish “not saved to browser” from “not applied.” |
| P0 | List and drill-in preview years diverge and can display different costs for the same cause. | Own one preview year in the editor shell and pass it to every list and drill-in. |
| P1 | Effects use machine identifiers such as “population” and “standard-mundane” as primary headings. | Add human display names and summaries to the content schema. |
| P1 | Drill-ins replace the catalog, making comparisons repetitive. | Use desktop master-detail or a wide side sheet; use a dedicated full-screen editor with clear back navigation on mobile. |
| P1 | Recipient discovery conflates recipient-specific defaults with user customizations and silently caps search results. | Separate filters and terminology; show total matches and allow more results. |
| P1 | The mobile cause catalog requires a long unfiltered scan. | Add cause search and an “Edited only” filter. |
| P2 | The page introduces itself three times and uses a long tooltip to explain its information architecture. | Trim the shell and move essential state explanations into visible copy. |
| P2 | Several accessibility details weaken otherwise good semantics. | Label the year input, separate tooltip buttons from labels, and associate errors with inputs. |

## What is already strong

The following behaviors should be preserved through any redesign.

### Draft-loss protection

Unapplied Global changes and dirty cause/recipient drill-ins are protected from destructive navigation. The guard covers page exits, tab/entity switches that would close a drill-in, browser back navigation, reloads, and tab closure.

The modal offers meaningful choices: apply and leave, discard and leave, or keep editing. This is much safer than disabling navigation and gives the user control.

### URL-backed navigation

The active tab and editing target live in the URL. Deep links and browser back/forward work, and stale entity IDs fall back to list views instead of breaking the page.

### Honest computed values

Cause and recipient cost per life is correctly presented as a readout rather than a directly editable input. A single cost cannot be safely back-solved into the underlying effect parameters, so keeping the mathematical inputs explicit is the right model.

### Differences and per-row reverts

Applied deviations from the defaults are itemized with before/after values and per-field reverts. Recipient rows preserve useful provenance such as inherited cause values and multipliers.

This should remain the canonical answer to “What active assumptions differ from the defaults?” New draft indicators should describe only unapplied work, not duplicate the applied-differences inventory.

### Validation and draft stability

Invalid values block commits and remain visible. Unrelated state updates do not wipe in-progress form values. Reset actions provide a recovery path from malformed input.

### Responsive fundamentals

At 390px, the inspected layouts had no horizontal overflow. Inputs stack into one column, the tabs remain operable, and long multi-effect editors provide Apply/Cancel actions at both the beginning and end.

## Detailed findings

### 1. Draft state is not persistently visible

**Severity: P0**

The most important observed sequence was:

1. Change Discount Rate from 0% to 1%.
2. The future-value graph immediately changes from **12.0B** to **7.42B** weighted life equivalents.
3. The “Current Assumptions” selector still says **Default (100 years)** because the draft is not active.
4. Switch to Causes.
5. No visible indicator says that a Global draft exists.
6. Cause figures continue using the active 0% discount rate.
7. Return to Global; the 1% draft is still present and can be applied.

This behavior is internally consistent but externally ambiguous:

- The graph looks applied because it reacts immediately.
- The selector correctly describes the active state, but does not mention the draft.
- The Global tab loses its Apply button when another tab is selected.
- The navigation guard only appears when the user attempts to leave the page, which is too late to serve as ordinary status feedback.

Relevant implementation:

- [`src/components/AssumptionsEditor.jsx`](../src/components/AssumptionsEditor.jsx) maintains the Global draft separately from active assumptions and only renders Apply on the Global tab.
- [`src/components/assumptions/GlobalValuesSection.jsx`](../src/components/assumptions/GlobalValuesSection.jsx) passes form values into the future-value graph, so the graph acts as a draft preview.

#### Recommendation

Add a persistent draft-status layer that is deliberately separate from the applied differences view:

- Show **“1 unapplied Global change”** beside Apply.
- Add a small **Unapplied** dot or count to the Global tab while its draft is dirty.
- Label the graph **“Preview using unapplied values”** whenever appropriate.
- Show a sticky Apply/Discard bar when a Global draft exists, particularly on mobile.
- When viewing Causes or Recipients, make the status actionable: **“Global has 1 unapplied change — Review.”**

Do not put unapplied values into the active differences list. That list correctly describes the state used by the rest of the site.

### 2. “Unsaved” has two meanings and Apply provides no closure

**Severity: P0**

After Apply, the active selector changes to **“Custom (unsaved)”**. In that context, “unsaved” means the active assumptions are not stored as a named browser snapshot. Elsewhere, warnings use “unsaved” for drafts that have not been applied and could be discarded.

The verbs are better differentiated than the state labels:

- **Apply** moves Draft → Active.
- **Save to browser** moves Active → Browser-saved.
- **Share** moves Active → Link.

But the interface does not confirm the Apply transition. In live testing, Apply disabled itself, the differences disclosure appeared, and the selector changed to “Custom (unsaved),” but no notification or inline status announced that rankings now used the values.

Relevant implementation:

- [`src/constants/customAssumptionsEntry.js`](../src/constants/customAssumptionsEntry.js) defines the “Custom (unsaved)” label.
- [`src/components/AssumptionsEditor.jsx`](../src/components/AssumptionsEditor.jsx) commits Global changes without showing a notification.

#### Recommendation

Use one meaning per term:

- **Unapplied** — typed but not active.
- **Applied** — used by site-wide calculations.
- **Not saved to browser** — active but not stored as a named local snapshot.
- **Shared** — available through a link.

Suggested copy:

- Selector label: **“Edited — not saved to browser”**
- Apply confirmation: **“Assumptions applied — rankings and calculations now use these values.”**
- Draft status: **“1 unapplied change”**

Keep the confirmation short. The differences disclosure already provides the detail.

### 3. Preview years can silently diverge

**Severity: P0**

The Causes and Recipients lists use a preview year stored in `AssumptionsEditor`. Each cause or recipient drill-in initializes its own preview year to the current year.

The drill-in year selector is only rendered for a multi-effect cause whose effects include bounded `validTimeInterval` values. The current content does not use those intervals, so in normal data the drill-in’s calculation year is hidden.

This produced a concrete live mismatch:

- Cause list set to **2010**: AI Capabilities / AGI Development showed **−$15,231**.
- Cause drill-in: combined cost showed **−$14,619**, calculated for **2026**.
- No visible year explained the difference.

Relevant implementation:

- [`src/components/AssumptionsEditor.jsx`](../src/components/AssumptionsEditor.jsx) owns the list preview year.
- [`src/components/assumptions/CategoryEffectEditor.jsx`](../src/components/assumptions/CategoryEffectEditor.jsx) initializes a separate year and conditionally displays its selector.

The same pattern exists in recipient editors.

#### Recommendation

- Lift preview year to the editor shell.
- Pass it to every cause and recipient list and drill-in.
- Always include it in computed labels: **“Combined cost per life in 2010.”**
- If users are only allowed to inspect historical years through the current year, explain that constraint in the control or help text.
- Preserve the year across tab changes and editor open/close.

### 4. Effects are named for machines, not beliefs

**Severity: P1**

Primary effect headings include:

- “Effect 1: population”
- “Effect 1: standard-mundane”
- “Effect 2: standard-utopia”
- “Effect 3: population-doom”

These are useful IDs for data integrity and cross-referencing with written justifications, but they require users to decode the implementation before understanding the belief being edited. The same IDs also appear in the applied-differences view.

Field labels then expose model vocabulary such as:

- Cost per microprobability
- Population fraction affected
- Welfare change/year

Tooltips explain these terms, but the user must repeatedly interrupt the task to understand the form. The editor-level help points users to the FAQ, taking them away from the edit session.

Relevant implementation:

- [`src/components/assumptions/EffectCard.jsx`](../src/components/assumptions/EffectCard.jsx) renders `effectId` as the heading.
- [`src/constants/effectFieldDefinitions.js`](../src/constants/effectFieldDefinitions.js) defines field labels.
- [`src/constants/effectTooltips.js`](../src/constants/effectTooltips.js) carries the longer explanations.

#### Recommendation: human display names

Add display metadata to category effects:

```yaml
effectId: population-doom
displayName: Increased risk of AI catastrophe
summary: Models the harm from slightly increasing the probability of an AI-caused catastrophe.
```

Render the human name prominently and keep the ID as subdued reference text:

> **Increased risk of AI catastrophe**  
> Population effect · ID: population-doom

Thread the display name through:

- Effect-card headings.
- Applied-differences rows.
- Recipient override headings.
- Editor navigation and accessible labels.

#### Longer-term option: belief-oriented editing

Present the same model as a sentence with editable slots:

> Each **$120M** changes the event probability by **one in a million**. If it happens, it affects **100%** of people, changing welfare by **−0.77 life-years per person per year**, starting in **10 years** and lasting **…**.

Keep “Show raw fields” for expert users. This changes presentation, not the underlying model.

### 5. Drill-ins remove the comparison context

**Severity: P1**

Opening a cause or recipient editor replaces the list. The tabs remain visible, and clean back/forward navigation works, but the cards a user was comparing disappear.

Comparing two causes requires:

1. Find cause A.
2. Open cause A.
3. Apply or Cancel.
4. Find cause B again.
5. Open cause B.

The cost is higher on Recipients because users may also need to repeat a search.

#### Recommendation

On desktop:

- Keep the list mounted.
- Open the editor in a wide right-side sheet or master-detail panel.
- Preserve list scroll position and search state.
- Keep URL semantics unchanged.

On mobile:

- Use a dedicated full-screen editor rather than squeezing a sheet over the list.
- Add a clear **“Back to Causes”** or **“Back to Recipients”** action at the top.
- Use a compact sticky header with entity, year, and computed cost.
- Use sticky Apply/Cancel actions while dirty.

The existing navigation guard and effect-editor commit contract can remain intact.

### 6. Recipient discovery uses ambiguous “custom” terminology

**Severity: P1**

With the default assumptions active and no search term, the Recipients tab said:

> Showing only recipients with custom values. Use search to find others.

It displayed five recipients, including Future of Life Institute and Khan Academy. These are recipients with built-in recipient-specific assumptions, not necessarily values the current user customized. Their cards were not styled as user-customized.

The interface therefore uses “custom” for two concepts:

- A recipient-specific value that differs from its cause baseline in the published model.
- A user edit that differs from the published recipient value.

Relevant implementation:

- [`src/hooks/useAssumptionsForm.js`](../src/hooks/useAssumptionsForm.js) includes recipients with either default or user effect overrides.
- [`src/components/assumptions/RecipientValuesSection.jsx`](../src/components/assumptions/RecipientValuesSection.jsx) describes that result as “custom values,” while its card styling separately checks for meaningful user changes.

#### Recommendation

Use explicit filters:

- **Recipient-specific** — published or active recipient-level assumptions.
- **Edited by me** — user changes relative to the published recipient assumptions.
- **All recipients**.

Default helper copy could be:

> Showing recipients with recipient-specific assumptions. Search to find any recipient.

Inside a recipient editor, explain inherited values once:

> Baseline values come from the cause, including any cause edits you have applied. Recipient-specific values override or multiply that baseline.

Then label field references **“From cause”** instead of the unexplained generic **“Baseline.”**

### 7. Recipient search silently stops at 10

**Severity: P1**

Searching for “foundation” returned ten cards and the message:

> Showing first 10 matching recipients.

The total number of matches was not shown, and there was no way to reveal more results. Results are sliced inside the search hook before the UI receives them.

#### Recommendation

- Retain total match count before limiting the rendered list.
- Show **“10 of 27 matches.”**
- Add **“Show more”** or pagination.
- Consider lightweight result virtualization only if performance profiling shows it is necessary; 400 recipients is small enough for simpler approaches.
- Preserve the query and result position when opening and closing a recipient editor.

### 8. The cause catalog needs search on narrow screens

**Severity: P1**

The Causes tab contains 28 alphabetized cards. On the 390 × 844 viewport:

- The first card began around vertical position 636px.
- The last card began around 2,901px.
- Total page height was approximately 3,131px.

The list is manageable on a three-column desktop layout but becomes a long mobile scan.

#### Recommendation

Add compact controls shared with the recipient catalog where possible:

- Search causes.
- Edited only.
- Optionally sort alphabetically or by cost per life.

Keep alphabetical order as the default because it is predictable and works well with search.

### 9. The shell repeats its hierarchy

**Severity: P2**

A user encounters three stacked headings for one surface:

1. **Assumptions**
2. **Current Assumptions**
3. **Edit/View Assumptions: Default (100 years)**

The third heading repeats the active-set name displayed directly above it. “Edit/View” also hedges between two actions without adding meaning.

The “Current Assumptions” information icon contains three paragraphs explaining curated, local, and remote sets. That is evidence that the layout and terminology are not doing enough explanatory work on their own.

Relevant implementation:

- [`src/pages/AssumptionsPage.jsx`](../src/pages/AssumptionsPage.jsx) renders the page title and selector panel.
- [`src/components/SavedAssumptionsPanel.jsx`](../src/components/SavedAssumptionsPanel.jsx) renders the second heading and long tooltip.
- [`src/components/AssumptionsEditor.jsx`](../src/components/AssumptionsEditor.jsx) renders “Edit/View Assumptions.”

#### Recommendation

- Keep one page title: **Assumptions**.
- Make the active-set selector a compact status/switcher row.
- Place one visible sentence beneath it: **“These assumptions drive every ranking and calculation on the site.”**
- Remove “Edit/View Assumptions: …”.
- Put the tabs directly below the active-set status.
- Move the site-wide “Show assumption selector on all pages” preference out of the saved-set panel and into a page-level settings row.
- Keep detailed library terminology in a short help disclosure or modal, not a three-paragraph tooltip.

### 10. Mobile actions could remain available while editing

**Severity: P2**

The narrow-screen layouts did not overflow horizontally, but long forms separate fields from their actions:

- The mobile Global page was about 2,219px tall.
- Apply was near vertical position 495px.
- The fourth editable Global field began near 975px.
- The multi-effect AI Capabilities page was about 2,537px tall.

Multi-effect editors already duplicate Apply/Cancel at the beginning and end, which is helpful. Global has only the top action.

#### Recommendation

- Add a sticky mobile action bar only while a draft is dirty.
- Include status in the bar: **“1 unapplied change.”**
- Keep actions disabled when errors exist and include the current validation message.
- Preserve the top action on desktop; a sticky bar is less necessary there.

### 11. Accessibility refinements

**Severity: P2**

The editor already uses real tabs, specific action labels, focusable Edit buttons, and modal focus management. The following issues remain.

#### Unlabeled year input

The list context passes `label=""` to `YearSelector`. In the accessibility tree, the spinbutton had a value but no accessible name.

Fix by passing an explicit accessible label such as **“Preview calculation year”**, even if the visible sentence remains split around the input.

Relevant implementation:

- [`src/components/shared/YearSelector.jsx`](../src/components/shared/YearSelector.jsx)
- [`src/components/AssumptionsEditor.jsx`](../src/components/AssumptionsEditor.jsx)

#### Tooltip button included in input names

`FormField` places the tooltip button inside the `<label>`. As a result, effect textboxes appear in the accessibility tree with names such as:

> Cost per microprobability More information

Place the visible label text in the `<label>` and render the tooltip button as a sibling. Give the tooltip a field-specific label such as **“About cost per microprobability.”**

Relevant implementation:

- [`src/components/shared/FormField.jsx`](../src/components/shared/FormField.jsx)

#### Errors are not programmatically associated with effect inputs

`FormField` renders a visible error with `role="alert"`, but the input does not set `aria-invalid` or reference the error through `aria-errormessage`/`aria-describedby`.

Copy the association pattern already used by `NumericInput`:

- `aria-invalid={Boolean(error)}`
- `aria-errormessage={error ? errorId : undefined}`
- A stable ID on the error element

#### Headings include interactive help controls

Editor headings contain information buttons and entity links, so their accessible names include “More information.” Move help controls adjacent to headings rather than inside the heading element where practical.

## Recommended implementation sequence

### Phase 1 — state clarity and correctness cues

Small-to-medium effort; highest user value.

1. Rename “Custom (unsaved).”
2. Add Apply success feedback.
3. Add persistent unapplied status and a Global-tab indicator.
4. Label the Global graph as a draft preview when appropriate.
5. Share one preview year across lists and drill-ins.
6. Fix the year label, tooltip/label structure, and error associations.
7. Clarify recipient-specific versus user-edited terminology.
8. Show total recipient search matches and allow more results.

### Phase 2 — comprehension and navigation

Medium effort.

1. Add effect `displayName` and `summary` metadata.
2. Render human names in editors and the differences view.
3. Trim the three-heading shell.
4. Add cause search and “Edited only” filters.
5. Preserve recipient search state through drill-ins.
6. Introduce desktop side-sheet/master-detail editing and full-screen mobile editing.

### Phase 3 — larger product improvements

Product decisions rather than cleanup.

1. Belief-oriented sentence editing with raw-field fallback.
2. Compare two assumptions sets side by side, including ranking consequences.
3. Worldview-first landing cards for users who want to choose a philosophy before editing parameters.
4. Optional sliders coupled to the future-value graph, with exact numeric inputs retained.

## What not to do

- Do not add more paragraph tooltips as the primary solution. Essential meaning should be visible in the interface.
- Do not make computed cost per life directly editable. The underlying model is not uniquely invertible.
- Do not duplicate the applied-differences view across tabs. Draft indicators should communicate only unapplied work.
- Do not remove navigation guards when moving editors into a sheet or full-screen view.
- Do not introduce auto-apply as the first fix. Explicit Apply lets users stage several Global changes; improve its visibility and feedback first. Auto-apply on blur can remain a later product experiment.
- Do not hide raw IDs entirely. Demote them to reference metadata so documentation and debugging remain possible.

## Suggested success criteria

After the recommended first two phases, a user should be able to answer these questions without opening a tooltip:

- Which assumptions set is active?
- Are the current form values applied site-wide?
- Is anything applied but not saved to the browser?
- Is anything still an unapplied draft, and where?
- What year is each displayed cost calculated for?
- What real-world belief does each effect represent?
- Is a recipient value inherited from its cause, built into the recipient, or edited by the user?
- How many search results exist, and how can more be shown?
- How do I return to the list without losing my place?

The existing architecture already supports most of this. The principal work is to expose the state model and domain concepts more directly, not to replace the underlying assumptions machinery.
