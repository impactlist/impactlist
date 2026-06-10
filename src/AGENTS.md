# src/ — app architecture

Impact List is a React 19 + Vite SPA that ranks philanthropists by estimated lives saved. This file is the map; each subdirectory has its own context file (paired CLAUDE.md/AGENTS.md with identical content) with specifics.

## Data flow (the one diagram to internalize)

```
content/*.md  --npm run generate-data-->  src/data/generatedData.js (gitignored)
                                              |
                                              v
        createDefaultAssumptions()  ->  defaultAssumptions      (the site's published numbers)
        + userAssumptions (minimal diff, sessionStorage)        (the user's edits)
        = createCombinedAssumptions()  ->  combinedAssumptions  (what every page calculates from)
```

- `userAssumptions` stores ONLY diffs from defaults (pruned by `normalizeUserAssumptions`). Null means "using defaults".
- `combinedAssumptions` is memoized in `AssumptionsContext` and is the only thing pages should calculate from.
- Saved "library" entries and shared links serialize `userAssumptions` diffs, so they can outlive a data update — every load path validates and catches incompatibility (see the `utils/` context file).

## Domain rules that override intuition

- **Negative cost per life is legitimate**: donations to some recipients cause deaths. Never "fix" negatives, clamp to positive, or assume cost > 0. Sorting/formatting handles negatives deliberately (negatives are *worse* than any positive; closer to zero is worse than further).
- **Cost per life of Infinity** means "no effect" (e.g. disabled effects); `'∞'` renders for it. Cost of 0 is invalid (asserted against), not "free".
- Effect type is sniffed by field presence: `costPerQALY` ⇒ QALY effect; `costPerMicroprobability` ⇒ population effect. A stale field on an effect would silently flip its model — which is why validation rejects unknown fields everywhere.

## Error-handling philosophy

Fail hard and loudly on unexpected states (project rule). The deliberate exceptions — catch-clear, plus a user notification where a UI notification context is available — exist so persisted bad data can't brick the app: storage `JSON.parse` (calculator localStorage notifies; the AssumptionsContext sessionStorage guard runs in the state initializer before any UI exists, so it logs and clears only), and the three external-assumption load paths (library load ×2, shared-link import — all notify). Unknown URLs/entity IDs render `pages/NotFound.jsx` — they're expected input, not invariant violations.

## Cross-cutting conventions

- All routes are `React.lazy` in `App.jsx`; pages set titles via `hooks/useDocumentTitle` (no-ops on falsy so loading/NotFound flows compose).
- Modals must use `components/shared/ModalShell.jsx` (dialog semantics, focus trap, Escape/scrim close). Don't hand-roll scrim+panel.
- Design tokens: `impact-*` classes and `var(--*)` custom properties defined in `src/index.css` (`@layer components`). Prefer them over raw Tailwind color utilities.
- Tests are behavioral (Testing Library, no snapshots). `src/test-setup.js` stubs ResizeObserver/IntersectionObserver/matchMedia, so layout-measuring components render fine in jsdom.
- Pure JS (ES6) + React + Tailwind + Vite only — no TypeScript, no new frameworks.

## Workflow gotchas

- Fresh clone: `npm run generate-data` BEFORE `npm run dev` or `npm test` — `src/data/generatedData.js` is gitignored and everything imports it. Editing `content/` does nothing until you regenerate.
- `vitest.config.js` and `vite.config.js` are separate; vitest defines an `@ -> src` alias that vite does NOT — don't use it in app code.
- CI (`.github/workflows/ci.yml`): generate → lint → coverage-gated tests (50% floors) → build.
- The prioritized improvement backlog lives in `docs/CodebaseReview-2026-06-10.md`; check it before starting refactors — several known issues are deliberately deferred to numbered items there.
