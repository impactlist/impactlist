# content/ — the dataset (markdown + YAML frontmatter)

**`README.md` in this directory is the authoritative schema/conventions reference — read it first.** This file only adds agent-facing notes.

- Categories, donors, recipients, donations, assumptions (+ `assumptions/profiles/` for curated profiles), and `globalParameters.md`. The generator (`scripts/generate-data-from-markdown.js`) compiles all of it into `src/data/generatedData.js`; run `npm run generate-data` after edits or the app won't see them.
- Donation rules are build-enforced (see the `scripts/` context file): strict `YYYY-MM-DD` dates, positive numeric amounts, credit maps summing to 1, no duplicate events across files — every donation event is recorded in exactly ONE file, with `credit` (not file location) determining attribution. Genuinely identical separate donations need distinct `notes`.
- A level-1 `# Internal Notes` heading and everything under it is stripped from published content. Only that exact heading is stripped — any other variant (`## Internal Notes`, different casing) fails the build rather than shipping publicly.
- `{{VARIABLE}}` placeholders (e.g. `{{CONTRIBUTION_NOTE}}`) are substituted by the generator from `MARKDOWN_VARIABLES`; an unknown/unreplaced `{{TOKEN}}` fails the build.
- Math in content renders via KaTeX: `$...$` inline, `$$...$$` block; escape literal dollars as `\$`; `{,}` for thousands separators inside math (full conventions in the "Math rendering" section of the repo-root CLAUDE.md — they apply regardless of which agent you are).
- Domain reminder: some recipients have NEGATIVE cost per life (donations cause deaths) — that's intended, not a data error.
- Effectiveness write-ups (cost-per-life justifications in `assumptions/`, `categories/`, `recipients/`) have a dedicated skill: use the effectiveness-estimation skill at `.claude/skills/effectiveness-estimation/SKILL.md` (Claude Code invokes it as `/effectiveness-estimation`; other agents can read the SKILL.md directly).
