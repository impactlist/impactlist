# Impact List

Impact List is a project that aims to build and maintain a list which ranks the top ~1,000 living people by their positive impact on the world via donations.

The goal is to make the list popular enough to increase the status awarded to those who rank highly, bring more awareness to the importance of donation effectiveness, and ultimately cause people to donate more effectively and/or donate more money to effective causes.

See [this description of the project](https://forum.effectivealtruism.org/posts/LCJa4AAi7YBcyro2H/proposal-impact-list-like-the-forbes-list-except-for-impact) for details.

## How you can help

We’re actively seeking volunteers to help with the project.

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute research to the site. This includes keeping the donations up to date and accurate for existing people, adding more people (and all their donations), and helping to improve our research into the effectiveness of various charities or general types of charity.

We also are looking for volunteer developers and UX people to help improve the functionality and appearance of the website.

Join [the discord](https://discord.gg/6GNre8U2ta) to learn more about these and other ways that you can get involved.

## Tech Stack

- React
- Tailwind CSS
- Vite
- Vitest (unit/integration tests)
- Playwright (end-to-end tests)

## Local development

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Generate data
   ```
   npm run generate-data
   ```
4. Start development server (recommended):

   ```
   vercel dev
   ```

   This is the default way to run locally because it serves both:

   - the Vite frontend
   - Vercel serverless routes under `/api/*` (used by shared assumptions and health checks)

5. Optional frontend-only dev server:

   ```
   npm run dev
   ```

   Use this only when you do not need `/api/*` routes.

6. Build for production:
   ```
   npm run build
   ```
7. Preview production build:
   ```
   npm run preview
   ```

## Linting

1. The entire project

```
npm run lint
```

2. On single file

```
npx eslint <filename>
```

### Prettier

Check:

```
npx prettier --check .
```

Write:

```
npx prettier --write .
```

## Testing

Test Scripts Available:

- npm run test - Run tests in watch mode
- npm run test:run - Run once and exit
- npm run test:coverage - Generate coverage report (enforces 50% coverage floors)
- npm run test:watch - Explicit watch mode
- npm run test:e2e - Playwright end-to-end tests (builds the app and serves a preview automatically)
- npm run test:e2e:headed - Same, with a visible browser

CI (GitHub Actions) runs lint, the coverage-gated unit suite, and the production build on every push/PR; the e2e suite runs nightly.

## Shared Assumptions Redis Setup Across Branches/Worktrees

### Why this is needed

Environment variables are configured per **Vercel project/environment**, not per git branch directly.  
Each worktree can be linked to a different Vercel project, and `vercel pull` overwrites `.env.local` with values from the linked project.

### How to make it work everywhere

1. For each Vercel project you use (`orange`, `impactlist`, etc.), add:

   - `SHARED_ASSUMPTIONS_REDIS_REST_URL`
   - `SHARED_ASSUMPTIONS_REDIS_REST_TOKEN`

2. Add them for at least:

   - `development`
   - (recommended) `preview`
   - (recommended) `production`

3. In each branch/worktree:
   - run `vercel link` and confirm which project it points to
   - run `vercel pull --environment=development`
   - run `vercel dev`
     - `vercel dev --listen 3001`

   See `.env.example` for the environment variables the shared-assumptions API reads (and a spelling gotcha to avoid).

### Quick checklist per branch/worktree

1. Check linked project:

   - `.vercel/project.json`

2. Ensure linked project has these vars in `development`:

   - `SHARED_ASSUMPTIONS_REDIS_REST_URL`
   - `SHARED_ASSUMPTIONS_REDIS_REST_TOKEN`

3. Refresh local env:

   - `vercel pull --yes --environment=development`

4. Verify Redis is configured:
   - `curl http://localhost:3001/api/health?check=redis`
   - Response should indicate Redis checks are OK.

## Other

When running `npm audit` or `npm audit fix`, add `--omit=dev` to analyze only the dependencies in the deployed app/runtime. (Note: `npm audit fix --omit=dev` prunes devDependencies from node_modules — run a plain `npm install` afterwards to restore them.)
