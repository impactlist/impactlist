# src/components/ — component conventions

## Layout

- Root: modals (Save/Share/Description/Confirm/Migration/SpecificDonation), `AssumptionsEditor` (the editor shell), `MiniImpactList`, `CategoryDisplay`, `SavedAssumptionsPanel`.
- `shared/` — design-system primitives: `ModalShell` (use it for ALL modals), `SortableTable`, `Tooltip`, `FormField`, `CurrencyInput`/`NumericInput`, `MarkdownContent`, `AssumptionsSelector`/`AssumptionsDropdown`, `PageHeader`, etc.
- `assumptions/` — the assumptions editor internals (has its own context file).
- `calculator/` — donation calculator pieces (`CalculatorForm`, `RecipientTable`, `CalculatorStats`).
- `charts/` — recharts wrappers (`ImpactBarChart`, `LivesSavedGraph`, `EntityChartSection` lives in entity/). Negative-value domains are handled deliberately.
- `entity/` — donor/recipient detail-page sections (`EntityStatistics`, `EntityChartSection`, `EntityDonationTable`).
- `layout/` — `Header`, `Footer`.

## Hard rules

- **Modals**: render through `shared/ModalShell.jsx`. It owns the animated scrim/panel plus `role="dialog"`, `aria-modal`, `aria-labelledby`, focus-in/restore, Tab trapping, Escape, and scrim-click close (`dismissible={false}` to suppress while busy). `ModalHeader` is the shared title+X row. Give the heading an id and pass it as `labelledBy`.
- **`SortableTable`**: throws if asked to sort a column no row has data for — columns whose cells are computed in `render` must set `sortable: false` (see `calculator/RecipientTable.jsx`). Its cost-per-life comparator encodes the domain rule (negatives sort worse than all positives; closer to zero = worse) — covered by `SortableTable.test.jsx`; don't change ordering semantics without updating those tests. The sort is memoized on data identity — callers must pass memoized arrays — and rows key by `item.id` when present (index fallback otherwise), so give rows ids where you can. The sticky-header clone is `role="presentation"`/aria-hidden, so role-based queries in tests see only the primary table.
- **No `.defaultProps`** on function components (React 19 ignores them) — use destructure defaults.
- React 19 + framer-motion for transitions; PropTypes on shared components; `prop-types` is a direct dependency.
- Styling: `impact-*` classes / `var(--*)` tokens from `src/index.css`. `SpecificDonationModal` still uses raw gray/indigo utilities — migrating it to the design system is review item 15, don't copy its style.

## Testing

Behavioral Testing Library tests co-located with components. `framer-motion` is sometimes mocked per-file — mocks must export `AnimatePresence` too, since `ModalShell` uses it. ResizeObserver/matchMedia are stubbed globally in `src/test-setup.js`.

## Known debt (tracked in docs/CodebaseReview-2026-06-10.md)

`CurrencyInput`/`NumericInput` are ~80% duplicates; `AssumptionsDropdown` has internal duplication and incomplete menu keyboard semantics (item 15). Prefer fixing through those items rather than piecemeal.
