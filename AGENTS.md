# Repository Guidelines

- Ignore this file if you're Claude Code, it's for another coding agent

## Project Structure & Module Organization
- Source: `src/` (components, pages, utils, hooks, contexts). Data generated to `src/data/generatedData.js`.
- Content: `content/` (categories, donors, recipients, donations, `globalParameters.md`).
- Scripts: `scripts/` (e.g., `generate-data-from-markdown.js`).
- Static: `public/`, entry `index.html`.

## Build, Test, and Development Commands
- `npm run dev`: Start Vite dev server.
- `npm run generate-data`: Build `src/data/generatedData.js` from `content/`.
- `npm run build`: Generate data, then production build via Vite.
- `npm run preview`: Serve the built app locally.
- `npm run lint` / `npm run lint:fix`: Lint (and auto-fix) JS/JSX.

## Coding Style & Naming Conventions
- Formatting: Prettier (2-space indent, 120 char width, single quotes). Config in `.prettierrc`.
- Linting: ESLint with React, Hooks, and Prettier plugins (`eslint.config.js`). Warnings blocked in CI via `lint-staged`.
- Components: Named arrow functions in PascalCase files, e.g. `src/components/RecipientList.jsx`.
- Utilities: camelCase files, e.g. `src/utils/effectsCalculation.js`.
- Hooks: `useX` naming in `src/hooks/`, e.g. `useAssumptionsForm.js`.

## Commit & Pull Request Guidelines
- Commits: Imperative, concise messages (e.g., “fix combined cost per life”). Group related changes.
- Pre-commit: Husky + `lint-staged` runs ESLint on staged JS/JSX with `--max-warnings=0`.
- PRs: Include description, linked issues, and rationale. For UI changes, add screenshots or short clips. Note any data changes and run `npm run generate-data` before screenshots.
- Do not commit `src/data/generatedData.js` (it’s generated and gitignored).

## Data & Configuration Tips
- Edit `content/**` markdown and `content/globalParameters.md`; then run `npm run generate-data`.
- Validate generation output; the script performs integrity checks and will fail fast on missing links.
