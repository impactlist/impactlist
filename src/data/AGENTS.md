# src/data/ — generated output (do not edit)

`generatedData.js` is produced by `npm run generate-data` from `content/` and is gitignored. Never edit it by hand; never commit it. If it's missing (fresh clone) or stale (after content edits), regenerate — dev/test/lint have no automatic hook for this, only `npm run build` regenerates.

Exports consumed by the app: `categoriesById`, `donorsById`, `recipientsById`, `assumptionsById`, `curatedAssumptionProfilesById`, `donations` (one row per credited donor, newest first, with precomputed `creditedAmount`), `globalParameters`. Don't add exports nobody imports — dead exports were deliberately removed to halve the file size.
