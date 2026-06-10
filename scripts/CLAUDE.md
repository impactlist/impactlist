# scripts/ — content → data generator

`generate-data-from-markdown.js` compiles `content/**/*.md` into `src/data/generatedData.js` (gitignored). Run via `npm run generate-data`; `npm run build` runs it automatically, dev/test do NOT — regenerate manually after content edits.

## Validation philosophy

Bad content must fail the BUILD, loudly, with the file named in the error. Donations are the strictest part (they're the site's core metric):

- Dates: strict `YYYY-MM-DD`, validated from the RAW frontmatter text via `extractRawDonationDates` + `normalizeStrictDateString` — never trust parsed YAML dates (YAML silently rolls `2021-02-30` → `2021-03-02` and parses non-ISO formats in machine-local time). Year sanity range 1900–2100.
- `amount`: positive finite number. `credit`: required non-empty map, each value in (0,1], summing to 1 (±0.001). Allowed row fields only: date, recipient, amount, credit, source, notes.
- Duplicate detection, two levels (`buildDonationKeys`): exact key (recipient/date/amount/credit/notes) catches re-records; event key (same minus credit) catches the same gift independently attributed to different donors. `source` is in neither key (same event, two citations = still duplicate); distinct `notes` are the escape hatch for genuinely identical separate donations.
- Missing `donations:` array is a hard error; `donations: []` is the explicit placeholder (see `content/donations/multiple_donors.md`).
- `validateDataIntegrity` checks donation→donor, donation→recipient, recipient→category, recipient-effect→category-effect references. Donation records carry a build-time-only `sourceFile` for error messages, stripped in `addReadableFields` before output.
- The curated-profiles loader is the strictness gold standard (rejects unknown keys/fields/ids, normalizes to minimal diffs) — copy its approach when hardening the other loaders (review item 10).

## Known gaps (deliberate, tracked as review items 9–10)

Glob order isn't sorted (output ordering is filesystem-dependent); duplicate entity IDs across files silently last-write-win; unknown frontmatter keys in donor/recipient/category loaders are silently ignored; fraction-sum/windowLength/NaN rules are enforced only at app startup, not at build. Don't partially fix these outside those items.

## Tests (`__tests__/` + `__fixtures__/`)

Black-box: each test copies a fixture workspace into a temp dir (`.tmp-generate-data-*` in repo root), runs the script as a subprocess, and asserts on exit code/output or dynamically imports the generated module. Failure-mode tests overwrite `content/donations/donor_a.md` in the `donation-validation` fixture with inline YAML — cheap to extend; add a fixture case for every new validation rule. Temp dirs are cleaned in `afterEach`; a crashed run can leave one behind (they're eslint-ignored, delete freely).
