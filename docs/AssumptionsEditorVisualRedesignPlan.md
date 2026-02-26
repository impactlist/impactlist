# Assumptions Editor Visual Redesign Plan

## Objective
Deliver a high-quality visual redesign of the assumptions editor that feels intentional and polished, while preserving
existing behavior, URL routing, and data semantics.

This plan improves the earlier proposal by adding:
- explicit visual system definition (tokens, typography, spacing, states),
- accessibility and interaction contracts,
- realistic implementation sequencing,
- performance and regression guardrails,
- concrete acceptance criteria per phase.

## Product Context
The assumptions editor is a high-trust control surface. Users need to:
- understand which values are defaults vs custom overrides,
- quickly scan many parameters and entities,
- confidently edit without ambiguity,
- recover/reset safely.

Current UI does not communicate this trust level strongly enough due to weak hierarchy, generic controls, and
inconsistent state treatment.

## Existing UI Pain Points (Observed in Code)

### 1. Weak page-level hierarchy
- Page shell is a generic centered card with basic heading treatment.
- Top controls do not read as a cohesive control bar.
- Relevant files:
  - `src/pages/AssumptionsPage.jsx`
  - `src/components/AssumptionsEditor.jsx`

### 2. Tabs are functionally correct but visually and semantically thin
- Tabs are plain buttons with bottom border style.
- No explicit `tablist`/`tab`/`tabpanel` semantics or keyboard model.
- Relevant file:
  - `src/components/assumptions/TabNavigation.jsx`

### 3. Action hierarchy is generic
- Reset and Save look like standard utility buttons rather than a deliberate hierarchy.
- Relevant file:
  - `src/components/assumptions/FormActions.jsx`

### 4. Card primitive has insufficient state expression
- `SectionCard` mostly changes border/background color for `custom` and `error`.
- No strong structural affordance for state.
- Relevant file:
  - `src/components/shared/SectionCard.jsx`

### 5. Input primitives are duplicated and mechanically styled
- `NumericInput` and `CurrencyInput` maintain separate visual logic.
- Focus/error/custom states rely mostly on border color.
- Relevant files:
  - `src/components/shared/NumericInput.jsx`
  - `src/components/shared/CurrencyInput.jsx`

### 6. Recipient/category lists are hard to scan at scale
- Dense inline layouts with low information hierarchy.
- Actions and metadata compete visually.
- Relevant files:
  - `src/components/assumptions/CategoryValuesSection.jsx`
  - `src/components/assumptions/RecipientValuesSection.jsx`

### 7. No global token system in CSS
- Global stylesheet currently contains only Tailwind directives.
- Relevant file:
  - `src/index.css`

## Design Direction
Adopt a **Research Dashboard** aesthetic:
- Tone: precise, editorial, high-trust, quietly premium.
- Composition: warm, layered surfaces with strong section rhythm.
- Typography: characterful serif display for page identity + neutral sans for controls/data.
- Interaction language: restrained motion, strong focus treatment, explicit state signaling.

## Design Principles
1. **Trust-first clarity**: every state should be obvious without reading helper text.
2. **Signal over decoration**: visual richness must improve scanning and confidence.
3. **Consistent primitives**: one field shell, one action system, one card language.
4. **Accessible by default**: semantics, keyboard flow, contrast, reduced motion support.
5. **Incremental delivery**: ship in phases with regression tests and visual QA.

## Scope

### In Scope
- Assumptions page shell and header/control bar.
- Tab navigation redesign and semantics.
- Action button hierarchy.
- Section card visual/state redesign.
- Unified field visual language for numeric/currency input.
- Category and recipient list scanability updates.
- Global design tokens and typographic system for this surface.
- Motion pass (targeted, optionalized by preference).

### Out of Scope
- Changes to assumptions calculations or persistence behavior.
- Major information architecture changes outside assumptions editor flow.
- New saved presets feature (not currently implemented in this branch).

## Visual System Specification

### 1. Typography
- Display face (headings): serif with editorial personality.
  - Example stack: `'Fraunces', 'Iowan Old Style', 'Palatino Linotype', serif`
- Body/UI face: clean sans for data density.
  - Example stack: `'IBM Plex Sans', 'Avenir Next', 'Segoe UI', sans-serif`
- Scale:
  - Display XL: page title
  - Display M: section headings
  - Body M: labels and helper copy
  - Body S: metadata and secondary text

### 2. Color Tokens (CSS variables in `src/index.css`)
- `--bg-canvas`: warm off-white page background.
- `--bg-surface`: primary panel surface.
- `--bg-surface-alt`: subtle elevated strip.
- `--text-strong`: deep ink for primary text.
- `--text-muted`: neutral muted for supporting text.
- `--accent`: primary action color.
- `--accent-soft`: low-contrast accent wash.
- `--success`, `--warning`, `--danger`: semantic states.
- `--border-subtle`, `--border-strong`: border hierarchy.

### 3. Shape + Depth
- Radius scale: `8 / 12 / 16`.
- Shadow scale:
  - `shadow-1`: panel separation
  - `shadow-2`: elevated controls
  - `shadow-focus`: accessible focus halo

### 4. Spacing Rhythm
- Base unit: `4px`.
- Core steps used heavily: `8, 12, 16, 24, 32`.
- Grid rhythm:
  - page sections spaced with `24-32`,
  - card internals in `12-16`,
  - field stacks in `8-12`.

### 5. State Model (Must be consistent everywhere)
- `default`
- `hover`
- `focus-visible`
- `custom` (user override present)
- `error`
- `disabled`

`custom` cannot rely on color alone. It should include one extra structural cue (status strip, badge, icon, or label).

## Component-by-Component Redesign

### A. Page Shell (`AssumptionsPage`, `AssumptionsEditor`)
Implement a stronger shell with:
- atmospheric but subtle background treatment,
- refined title row with supporting context copy,
- elevated editor container with intentional vertical rhythm.

Control bar should include:
- tab/segment control (left),
- context indicator (middle/inline where useful),
- actions (right) with dominant primary only when valid.

### B. Tabs (`TabNavigation`)
Replace bottom-border tabs with segmented control:
- rounded container and animated active pill,
- clear active typography shift,
- keyboard support:
  - arrow key navigation,
  - `Home/End`,
  - proper `aria-selected`, `aria-controls`, `role="tablist"` and `role="tab"`.

### C. Actions (`FormActions`)
Define 3-tier action hierarchy:
- primary: Save (only when relevant and enabled),
- secondary: Reset section,
- tertiary/text: inline single-item reset actions.

Interaction rules:
- primary gets strongest color and subtle elevation,
- disabled states remain readable and clearly non-interactive,
- avoid equal visual weight between save and reset.

### D. Section Cards (`SectionCard`)
Redesign cards as “parameter tiles”:
- explicit header row (label + state/action),
- body row for field/value,
- footer/helper row for defaults or metadata.

State treatment:
- `custom`: left status strip + soft tinted background.
- `error`: stronger border + error icon/label region + message spacing.
- `default`: neutral surface with subtle hover lift.

### E. Field System (`NumericInput`, `CurrencyInput`)
Create one shared field shell style contract:
- consistent height, padding, radius, and prefix alignment,
- consistent focus ring behavior,
- consistent error and helper text layout,
- consistent disabled/read-only presentation.

Keep separate logic components if needed, but style API should be shared to avoid drift.

### F. Global Values Section
Improve comprehension:
- stronger label/description relationship,
- tooltip triggers with keyboard/focus support,
- clearer readonly distinction for fixed values.

Rework “animal lives vs human lives” note:
- integrate as a designed info block that matches token system,
- maintain high contrast and accessible link affordance.

### G. Categories Section
Increase scanability in dense grids:
- card titles with better truncation behavior and hover affordance,
- right-aligned edit actions with clear consistency,
- lightweight metadata line for default vs custom context,
- avoid badge clutter.

### H. Recipients Section
Improve large-list readability:
- clearer row structure: name, value, metadata, action cluster,
- stronger separation between search controls and result state text,
- improve empty state design and wording hierarchy.

## Motion Strategy
Use motion intentionally and sparingly:
- page entrance: one subtle stagger on major sections,
- segmented control active-pill transition,
- card hover/focus elevation transitions,
- optional list filter transitions where cheap.

Requirements:
- respect `prefers-reduced-motion`,
- avoid layout-thrashing animations,
- no decorative looping motion.

## Accessibility Requirements (Non-Negotiable)
1. Keyboard complete flow for tabs, search, actions, reset controls.
2. Semantic tab implementation (`tablist`, `tab`, `tabpanel` relationships).
3. Visible focus indicators with adequate contrast on all interactive elements.
4. Color contrast meeting WCAG AA for text and controls.
5. Error messaging connected via ARIA (`aria-invalid`, `aria-errormessage`).
6. Tooltip content available on keyboard focus, not mouse-only.
7. Reduced-motion behavior for all animated transitions.

## Technical Delivery Plan

### Phase 0: Design Foundations
Deliverables:
- token definitions in `src/index.css`,
- typography import + font-family variables,
- reusable utility classes (or class conventions) for surfaces/states.

Exit Criteria:
- tokens available and consumed by at least one component,
- no functional behavior changes.

### Phase 1: Primitive Pass
Targets:
- `SectionCard`
- `FormActions`
- shared field visual contract across `NumericInput` and `CurrencyInput`

Tasks:
- implement new visual states and spacing rhythm,
- standardize helper/error/reset alignment patterns,
- preserve existing value parsing and submit behavior.

Exit Criteria:
- primitives visually cohesive,
- existing assumptions tests remain green.

### Phase 2: Navigation + Shell Pass
Targets:
- `AssumptionsPage`
- `AssumptionsEditor` top area
- `TabNavigation`

Tasks:
- apply new shell layout and control bar,
- ship segmented control styling and ARIA/keyboard support,
- align actions with active tab context.

Exit Criteria:
- improved top-level hierarchy,
- keyboard tab interactions covered by tests.

### Phase 3: Section Pass (Global, Categories, Recipients)
Targets:
- `GlobalValuesSection`
- `CategoryValuesSection`
- `RecipientValuesSection`
- shared minor primitives (`SearchInput`, `YearSelector`, tooltip trigger behavior)

Tasks:
- apply tile layout and metadata hierarchy,
- improve list scanability and action placement,
- refine empty/search state presentation.

Exit Criteria:
- all three tabs share the same visual language and state model.

### Phase 4: Motion + Polish + QA
Tasks:
- add restrained transitions and entrance choreography,
- apply reduced-motion fallbacks,
- run visual QA across breakpoints and states.

Exit Criteria:
- no interaction regressions,
- motion enhances clarity without distraction.

## Test and QA Plan

### Functional Regression
- Run existing assumptions route and editor tests (`AssumptionsPage.test.jsx`, controller tests).
- Add tests for:
  - tab keyboard navigation semantics,
  - focus-visible presence on primary controls,
  - tooltip keyboard visibility behavior.

### Visual/Interaction QA Checklist
- Desktop widths: `1024+`, tablet: `768`, mobile: `<=640`.
- Validate:
  - density and truncation in category/recipient cards,
  - custom/error/default states in all sections,
  - disabled/read-only differentiation,
  - focus order and focus visibility.

### Performance Guardrails
- Avoid expensive re-renders caused by purely presentational state.
- Prefer CSS transitions over JS animation where possible.
- Keep animation durations short (`120-240ms`) and easing consistent.

## Risks and Mitigations
- **Risk:** Visual drift across components.
  - **Mitigation:** lock token/state spec before section implementation.
- **Risk:** A11y regressions from custom tab/tooltip behavior.
  - **Mitigation:** semantic implementation + keyboard tests in same PR.
- **Risk:** Over-animation.
  - **Mitigation:** motion budget and reduced-motion checks.
- **Risk:** Scope creep into behavior changes.
  - **Mitigation:** explicit out-of-scope rules and regression tests per phase.

## Suggested PR Breakdown
1. Foundation tokens + typography + primitive scaffolding.
2. Primitive redesign (`SectionCard`, `FormActions`, unified field visuals).
3. Page shell + segmented tabs + control bar semantics.
4. Global/Categories/Recipients section visual pass.
5. Motion polish, accessibility hardening, and final QA fixes.

## Definition of Done
- Assumptions editor has a cohesive visual identity, not default utility styling.
- State hierarchy (`default/custom/error/disabled`) is obvious and consistent.
- Tabs and tooltips are fully keyboard-accessible and semantically correct.
- Inputs share one visual language across numeric and currency variants.
- Categories and recipients views are significantly more scannable at density.
- Reduced-motion users get a stable, non-animated equivalent.
- Existing behavior is preserved and regression tests pass.
