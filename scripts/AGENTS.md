# scripts/ — content → data generator

`generate-data-from-markdown.js` compiles `content/**/*.md` into `src/data/generatedData.js` (gitignored). Run via `npm run generate-data`; `npm run build`, `npm run dev`, and the `npm test*` scripts all run it automatically via pre-scripts (direct `npx vitest` invocations do NOT).

## Validation philosophy

Bad content must fail the BUILD, loudly, with the file named in the error. Donations are the strictest part (they're the site's core metric):

- Dates: strict `YYYY-MM-DD`, validated from the RAW frontmatter text via `extractRawDonationDates` + `normalizeStrictDateString` — never trust parsed YAML dates (YAML silently rolls `2021-02-30` → `2021-03-02` and parses non-ISO formats in machine-local time). Year sanity range 1900–2100.
- `amount`: positive finite number. `credit`: required non-empty map, each value in (0,1], summing to 1 (±0.001). Allowed row fields only: date, recipient, amount, credit, source, notes.
- Duplicate detection, two levels (`buildDonationKeys`): exact key (recipient/date/amount/credit/notes) catches re-records; event key (same minus credit) catches the same gift independently attributed to different donors. `source` is in neither key (same event, two citations = still duplicate); distinct `notes` are the escape hatch for genuinely identical separate donations.
- Missing `donations:` array is a hard error; `donations: []` is the explicit placeholder (see `content/donations/multiple_donors.md`).
- `validateDataIntegrity` checks donation→donor, donation→recipient, recipient→category, recipient-effect→category-effect references, then throws on any accumulated error. Donation records carry a build-time-only `sourceFile` for error messages, stripped in `addReadableFields` before output.
- Every loader is strict (review items 9–10): globs go through `sortedGlobSync` (deterministic output), duplicate entity ids across files throw naming both files, and unknown frontmatter keys are rejected against per-loader allowlists (the `*_FIELDS` sets near the top of the script — extend the set when adding a field, or the build fails).
- Entity-shape rules (`validateCategory`/`validateRecipient` from `src/utils/dataValidation.js` — fraction sums, `windowLength > 0`, NaN rejection) and the `globalParameterRules.js` table run at build time over ALL entities, before donation-less recipients are filtered out; app startup re-runs them as a backstop. Curated profiles are validated against the FILTERED entity set (what actually ships).
- Content guards: internal-notes headings in any form (`## internal notes` etc.) and unreplaced `{{PLACEHOLDER}}` tokens fail the build after extraction/replacement.
- Recipient default effects are `{effectId, overrides, multipliers}` wrappers — when curated profiles normalize recipient effects, field legality comes from the base CATEGORY effect; the wrapper only supplies default override/multiplier values to diff against.

## Tests (`__tests__/` + `__fixtures__/`)

Black-box: each test copies a fixture workspace into a temp dir (`.tmp-generate-data-*` in repo root) along with the script's `src/utils` imports (the `SHARED_MODULES` list in the test file — extend it if the generator gains a new shared import), runs the script as a subprocess, and asserts on exit code/output or dynamically imports the generated module. Failure-mode tests overwrite `content/donations/donor_a.md` in the `donation-validation` fixture with inline YAML — cheap to extend; add a fixture case for every new validation rule. Temp dirs are cleaned in `afterEach`; a crashed run can leave one behind (they're eslint-ignored, delete freely).
