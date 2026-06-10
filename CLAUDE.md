# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Where to find context

Most directories have their own CLAUDE.md (with an identical AGENTS.md) describing that area's architecture and gotchas — read the one for whatever you're touching. Start with `src/CLAUDE.md` for the overall architecture and data-flow map. The prioritized improvement backlog is `docs/CodebaseReview-2026-06-10.md`; check it before refactoring, since many known issues are deliberately deferred to numbered items there.

## Workflow essentials

- The app imports gitignored generated data (`src/data/generatedData.js`); `npm run dev`/`npm test*`/`npm run build` all regenerate it automatically via pre-scripts. Run `npm run generate-data` yourself only before direct `npx vitest`/`npx playwright` invocations.
- Verify with: `npm run test:run` (fast, ~6s), `npm run lint` (~2s), `npm run build`. CI (`.github/workflows/ci.yml`) runs generate → lint → coverage-gated tests (50% floors via `npm run test:coverage`) → build on pushes to master and PRs. E2e (`npm run test:e2e`) is chromium-only by design.
- `npm run test:e2e:release` runs the e2e suite on chromium + firefox + webkit (self-installs the extra browsers). It exists ONLY for preparing a release or publicity push — do NOT run it as part of routine verification, even when finalizing UI changes; chromium e2e is the session gate.
- Tests are behavioral (Testing Library / subprocess fixtures for the generator / mocked Redis for the server). Write tests in the style of the suite you're extending.

## Most Critical Instructions

- Avoid code duplication when you have an opportunity to modularize or reuse code (the DRY principle). When making changes, look for and flag opportunities to simplify code (without compromising functionality.)
- Make the code as simple and maintainable as possible while maintaining correctness and functionality. Don't make short term fixes that layer on extra complexity just to get things working in the short term.
- Don't remove functionality just because it's easier.
- Take pride in your code quality. Only write code that you would be happy to defend in front of a big meeting of senior developers.
- You can use git to find info about previous or current changes, but don't do things like 'git add' or 'git commit' which change the git state.
- Please use best practices for all of these frameworks and languages. For instance when doing CSS stuff, do it the way that corresponds to best practices for Tailwind. Same for React, Vite, and JavaScript.
- Never try to run the site yourself. I'll do that.

## Normal instructions

- Don't make assumptions about which values are acceptable unless you check with me. For instance don't constrain inputs to only positive numbers unless you're very sure I don't want negative numbers.
- It's important to realize that some recipients can have negative cost per life, which means that money donated to those recipients causes people to die. This is all part of the framework.

## Code Style Guidelines

- Error handling: Never fail silently when something unexpected happens. We always want to fail hard and loudly to not let subtle bugs persist.
- Comments: Document complex logic and public interfaces
- Please only use pure JavaScript (ES6), plus React, plus Tailwind, plus Vite.

## Math rendering

Markdown content is rendered via `react-markdown` with `remark-math` and `rehype-katex` plugins (configured in `src/components/shared/MarkdownContent.jsx`). KaTeX CSS is imported in `src/main.jsx`.

### Delimiters

Both forms are used in the codebase:

- Inline math: `$...$` (used heavily in assumptions and variable definitions)
- Block math: `$$...$$` (used for standalone equations)

### Escaping rules

- **Currency dollar signs** should be escaped as `\$` whenever you intend a literal dollar sign (especially inside math), because `$` is the math delimiter.
- **Thousands separators** in math often use `{,}` (e.g., `\$40{,}000`) and this is a good default for consistency/readability. Existing content also contains plain commas in some equations.
- **En-dashes/ranges** inside math blocks use `\text{–}` (e.g., `0.1\text{–}0.2`).

### Common LaTeX conventions used in content

- Both `\dfrac{...}{...}` and `\frac{...}{...}` are used in existing content. Prefer consistency with the file you are editing.
- `\text{...}` for words/labels inside equations
- `\approx` for approximation
- Subscripts with text: `Q_{\text{extra}}`
