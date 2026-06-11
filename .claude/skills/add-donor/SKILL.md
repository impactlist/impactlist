---
name: add-donor
description: |
  Add a new donor/philanthropist to Impact List end-to-end: research their lifetime giving,
  create their donor and donations files, create any missing recipient files with researched
  category breakdowns, and validate with the data generator. Use whenever the user asks to add
  a person to the list or site ("add Steve Ballmer", "put MacKenzie Scott on the list",
  "research X's donations and add them"), even if they only name the person. Also use when
  backfilling newly discovered donations for an existing donor or creating new recipient
  organization files, since the same formats, policies, and validation rules apply.
---

# Add a donor to Impact List

Adding a donor means producing all of this, in roughly this order:

1. Extensive research into the person's lifetime charitable giving (most of the work)
2. `content/donors/<name_in_snake_case>.md` — the donor's profile
3. `content/donations/<name_in_snake_case>.md` — their donation events
4. `content/recipients/<org_in_snake_case>.md` — one file for each recipient org that doesn't already exist, with a researched category breakdown
5. Optionally `public/images/people/small/<donor-id>.jpeg` — a photo
6. A passing `npm run generate-data` and a final report to the user

`content/README.md` is the authoritative schema reference if anything here seems ambiguous. The generator (`scripts/generate-data-from-markdown.js`) enforces every format rule below at build time and names the offending file when it fails — treat it as your safety net, not your first check.

## The cardinal rule: record money once, when it leaves the donor's hands

Track only donations made **directly by the donor** (including their personal trust or holding vehicle). The moment money lands in any charitable vehicle, it has been donated — exactly once.

The case that matters most: many major donors run their own foundation. **Record the donor's contributions INTO the foundation. Never record the grants the foundation later pays out.** That money was already counted when it entered; recording both directions double-counts. Example: Jed McCaleb's $1.309B founding gift to the Navigation Fund is one donation row; the Navigation Fund's hundreds of downstream grants appear nowhere in his file.

The downstream impact is not lost. The foundation itself is a recipient with category fractions approximating its grantmaking portfolio — that is the mechanism by which the model captures what the foundation does with the money. Your job when creating the foundation's recipient file is to make those fractions reflect reality (see Step 4).

Apply the same once-and-only-once logic to every candidate donation:

| Candidate | Verdict |
|---|---|
| Personal gift directly to a charity | Record it |
| Contribution into their own foundation (990-PF "contributions received") | Record it, recipient = the foundation |
| Grants paid OUT by their foundation | Exclude — double-count |
| Transfer between two of their giving vehicles (foundation → foundation, holding entity → foundation) | Exclude — the money was counted entering the first vehicle |
| Contribution into a donor-advised fund from personal assets | Record it, recipient = the DAF (e.g. `fidelity-charitable-daf`) |
| Grants recommended out of their DAF | Exclude — double-count |
| Pledge / Giving Pledge signature / "$1B over 10 years" announcement | Exclude — record actual transfers as they occur, when findable |
| Political contributions (campaigns, PACs, 501(c)(4) advocacy) | Exclude — deliberately out of scope (see the commented-out entry in `content/donations/dustin_moskovitz.md`) |
| Regranting round the donor funds where they pay charities directly (e.g. SFF S-process) | Record each receiving charity as its own donation |
| Grant routed through a fiscal sponsor / intermediary | Record the org actually doing the work; name the intermediary in `notes` |
| For-profit investments, even mission-driven ones (e.g. an anti-aging startup) | Exclude — not a donation |

`content/donations/jed_mccaleb.md` is the worked example of nearly all of this: foundation founding gifts via 990-PF, SFF rounds expanded to individual charities, intermediaries noted, speculative amounts flagged in `notes`. Read it before writing your first donations file.

One hard case deserves explicit guidance: donors whose main vehicle is an **LLC or DAF that files no public 990** (Ballmer Group, Emerson Collective style), so inflows are unobservable. Prefer any documented inflow (a press-confirmed transfer, SEC Form 4 stock gifts into the vehicle, a leaked figure). If none exists, one clearly-labeled aggregate row using the vehicle's documented cumulative grantmaking as a conservative *floor* for what the donor put in is acceptable — date it at the end of the period it covers, explain the construction in `notes`, and flag it prominently in your report. What you must never do is itemize the vehicle's individual grants out as donor rows (with or without such an aggregate row) — that's the double-count again.

## Who gets a donor file

- **Living people only.** The list excludes deceased donors — verify the person is alive before researching anything else (plenty of plausible candidates are 85+).
- **Spouses and partners: one file unless you're forced.** Default to a single donor file for the publicly-identified giver even when gifts are announced jointly — a leaderboard full of names nobody recognizes costs more than perfect attribution buys. Create the partner's file only when they're so central to the giving that crediting one person would be misleading (the bar: Cari Tuna, Connie Ballmer — co-founders who run the vehicles and make individually-credited gifts).
- **Joint gifts with someone who isn't getting a file** — two cases, both credited 1.0 to the listed donor (a credit split requires every named id to have a donor file):
  - *Living non-prominent spouse/partner* (household wealth, one public face): record the FULL amount under the listed spouse and name the partner in `notes`. Collapsing the spouse removes their row, not half the household's giving.
  - *Deceased partner, or a separate-wealth co-donor who isn't list-worthy*: record only the listed donor's share as the `amount`, with the full face value and partners in `notes`.
  - Reserve full-amount credit splits for partners who are independently list-worthy (e.g. a $400M gift split with David Geffen).
- **Pass-through people are not donors of someone else's money.** A person whose foundation is funded by another living donor's gifts (Warren Buffett's children, say) qualifies only for what they gave from their own wealth — the funder's money is already credited to the funder.

## Step 0 — Make sure they're not already (partially) here

- Check `content/donors/` for an existing file.
- Grep all of `content/donations/` for the person's name and likely id. Donors frequently appear as partial credit on joint gifts in *other* donors' files before they have a file of their own (e.g. Anne Wojcicki held 0.5 credit on gifts in `sergey_brin.md` before she was a donor). Any event already recorded anywhere must not be recorded again — the build fails on exact duplicates, and also when the same recipient/date/amount appears with a different credit map.
- If an existing entry's credit map should now include the new donor, edit that entry in place rather than adding a new one — and flag it in your report, since it changes the other donors' totals.

## Step 1 — Research their giving

The goal is a verified list of donation events — date, recipient, amount in USD, source URL — plus the donor's net worth, birth date, and a short bio.

Read `references/research-playbook.md` (in this skill's directory) for source-by-source tactics: ProPublica/IRS 990 lookups including the bulk-XML fallback when ProPublica blocks downloads, SEC Form 4 stock-gift research, SFF round pages, donation trackers, and the standard secondary sources. The shape of the work:

1. **Map their giving vehicles first.** Find every foundation, DAF, and LLC they give through, with EINs. Wikipedia, Inside Philanthropy, and ProPublica's search are the fast path. This determines where to apply the cardinal rule.
2. **Get foundation inflows, at the finest observable granularity.** Individually documented transfers (an SEC Form 4 stock gift, an announced contribution) are separate rows with their real dates — two gifts to the foundation in one year stay two rows. When individual events aren't observable — the common case — fall back to the annual "contributions, gifts, grants received" figure (990-PF Part I line 1): one row per nonzero fiscal year, dated at fiscal-year end. Never record both for the same vehicle-year: itemized rows plus the annual total double-counts, so drop the aggregate or reduce it to a clearly-noted remainder row. Confirm the donor (not someone else) was the contributor when possible.
3. **Sweep for direct personal gifts.** News archives, recipient press releases, university announcements, Chronicle of Philanthropy, donations.vipulnaik.com, SFF pages for EA-adjacent donors, SEC Form 4 (transaction code G) for public-company founders.
4. **Classify every candidate** against the table above before it earns a row. Most "donation" news for foundation-running donors is downstream grantmaking, pledges, or aggregates — the research that distinguishes these is the core skill of this task.

The named filings (990-PF, Form 4) exist only for US entities. For non-US donors the same structure applies through whatever the local equivalent is — charity-register accounts (UK/Canada/Australia), stock-exchange insider disclosures for share gifts — and where no registry exists, recipient announcements and quality press are the primary record (see the playbook's non-US section). Rows built on those are fully legitimate.

Be extensive. Fan out searches (use parallel subagents if available), check every era of their giving, and corroborate the large numbers with primary sources. Completeness matters most at the top: a missed $5K gift is noise; a missed $500M foundation contribution puts the donor at the wrong leaderboard position.

**Estimates are acceptable; invention is not.** Mirroring the existing data:

- `amount` must be a number. When sources confirm a donation but not the figure, use a defensible estimate and say exactly that in `notes` (see the McCaleb→OpenAI entry: "The amount here is a very speculative guess…").
- Approximate unknown dates to something sensible (Jan 1 of the year, first of a round's month) and note the approximation.
- If you can't verify a donation actually happened, leave it out.
- Watch aggregate-vs-itemized double-counting: never record "$400M lifetime giving" alongside the individual gifts it comprises, and never record both a foundation's contributions-received and the same money as individual checks.

## Step 2 — The donor file

`content/donors/<name_in_snake_case>.md`. Exact format:

```yaml
---
id: 'jane-roe'
name: 'Jane Roe'
birthDate: 1956-03-24
netWorth: 12_000_000_000
about: 'Jane Roe co-founded Example Corp and led it as CEO until 2014. Born in 1956 in Detroit. She is married to [John Roe](/donor/john-roe). [Wikipedia](https://en.wikipedia.org/wiki/Jane_Roe)'
---
```

(`content/donors/jed_mccaleb.md` and `bill_gates.md` are real examples — Gates shows the optional body sections.)

Field rules (build-enforced unless noted):

- `id` — kebab-case, unique across all donors. This exact string is what `credit` maps reference. File name is the snake_case twin of the id (`steve_ballmer.md` ↔ `steve-ballmer`).
- `name` — display name.
- `birthDate` — optional, but include it when known (every current donor has one). Strict real `YYYY-MM-DD`.
- `netWorth` — required number, USD. Use a current Forbes or Bloomberg figure. Underscore separators for readability. For a married couple who both have donor files, Forbes attributes the whole household fortune to one spouse — split it ~50/50 across the two files rather than duplicating it (precedent: `dustin_moskovitz.md` and `cari_tuna.md` each carry half), and say so in each file's `# Internal Notes`.
- `about` — required. One short paragraph: what they're known for, birth year/place. Convention: cross-link related donors as `[Name](/donor/their-id)` and end with a `[Wikipedia](url)` link.
- `totalDonated` — omit. The system sums their donation rows. (Only used for unusual cases like splitting a couple's pre-divorce giving — see `bill_gates.md` — and needs a body note explaining itself.)
- No other fields are allowed; an unknown key fails the build.

Markdown body after the frontmatter is optional and renders on the donor page (e.g. a `# Notes` section explaining a credit-split decision). A level-1 `# Internal Notes` heading and everything under it is stripped from the published site — use it for editor-facing reasoning. Only that exact heading form works; variants fail the build.

## Step 3 — The donations file

`content/donations/<name_in_snake_case>.md`. Exact format:

```yaml
---
donations:
  # Comments grouping rounds/years are encouraged for maintainability
  - date: 2014-11-12
    recipient: example-university
    amount: 60_000_000
    credit:
      jane-roe: 1.0
    source: 'https://news.example.edu/2014/11/roe-gift-announcement/'
    notes: 'Funded 12 new computer science professorships. Amount estimated by press reports; the university did not disclose.'

  - date: 2018-12-31
    recipient: roe-family-foundation
    amount: 295_000_000
    credit:
      jane-roe: 0.5
      john-roe: 0.5
    source: 'https://projects.propublica.org/nonprofits/organizations/<EIN>'
    notes: 'FY2018 contributions received per Form 990-PF.'
---
```

Rules the generator enforces:

- Allowed fields per entry: `date`, `recipient`, `amount`, `credit`, `source`, `notes` — nothing else.
- `date` — strict real `YYYY-MM-DD` (validated from the raw text; `2021-02-30` or `Jan 5, 2021` fails), year 1900–2100.
- `recipient` — must exactly match the `id` of a file in `content/recipients/` (Step 4).
- `amount` — positive number. Underscore separators. USD; convert foreign currencies at the gift-date rate and say so in `notes`.
- `credit` — required map of donor ids → fractions, each in (0, 1], summing to 1 (±0.001). Every donor id referenced must have a donor file, so credit splits are only available between listed donors — "Who gets a donor file" above governs who that is. Couples who both clear that bar split genuinely joint gifts 0.5/0.5 (Gates/French Gates, Moskovitz/Tuna); for everyone else record the listed donor's share as the `amount` with credit 1.0 and the full gift in `notes`. State the choice in your report.
- **Every donation event exists in exactly ONE file across the whole directory.** `credit`, not file location, determines attribution. Put the new donor's donations in their file; put joint gifts in the file of the donor most associated with the gift (or `multiple_donors.md`, the unattributed parking lot) — never in two places. Two genuinely separate but identical-looking donations need distinct `notes` to disambiguate.
- `source` and `notes` are optional to the parser but must be non-empty if present. In practice: always cite a `source` URL — and **any link that proves the donation qualifies**, whatever the outlet (a regional paper, a foreign-language announcement, an annual-report PDF; there is no approved-source list). Use `notes` for anything a future researcher needs (estimation reasoning, fiscal-year basis, intermediary, currency conversion).

YAML gotcha: escape apostrophes inside single-quoted strings by doubling them (`'Inside Philanthropy''s estimate'`).

## Step 4 — Recipient files

For every `recipient:` id you reference, a file must exist in `content/recipients/`.

**Reuse before creating.** There are 300+ recipients; search the directory for plausible existing names/ids first (`grep -ril "oxford" content/recipients/`). Universities, big NGOs, and DAFs are frequently already present. Creating a near-duplicate id is worse than any other mistake here because it silently splits one org's donations across two pages.

Exact format for a new recipient:

```yaml
---
id: roe-family-foundation
name: 'Roe Family Foundation'
categories:
  - id: global-development
    fraction: 0.55
  - id: education
    fraction: 0.30
  - id: local-community
    fraction: 0.15
---

# Justification of cost per life

{{RECIPIENT_DEFAULT_JUSTIFICATION}}

{{CONTRIBUTION_NOTE}}
```

- `id` kebab-case unique, file name its snake_case twin. Only `id`, `name`, `categories` are allowed in frontmatter.
- `fraction`s must sum to 1.
- The body above is the standard default-justification boilerplate — include it verbatim (the `{{...}}` placeholders are substituted at build time; a typo'd placeholder fails the build).

**Category fractions are a research output, not a guess.** Base them on what the org actually does with money:

- Operating charity with one mission → single category at 1.0 (`against-malaria-foundation` → `global-health: 1.0`).
- University → `education: 1.0` unless the gift's restricted purpose says otherwise (a gift to a medical research institute is `health-medicine`, not `education`).
- Foundation/DAF recipient → split across its grantmaking portfolio. Use its 990-PF grant lists, annual reports, and program pages; approximate by share of grant dollars, not by count of programs. (Examples to study: `navigation_fund.md`, `gates_foundation.md`, `astera_institute.md`.)
- Generic commercial DAF where grantmaking is opaque → `other: 1.0` (see `fidelity_charitable_daf.md`).
- Look at similar existing recipients and match their precedent before inventing your own mapping.
- Put your fraction reasoning (with sources) under a `# Internal Notes` heading at the bottom of the file when it isn't obvious — future researchers will need to know whether 0.55 came from a 990 analysis or a shrug.

Valid category ids (the `name` shown is how it renders):

```
ai-capabilities — AGI Development        human-rights — Human Rights and Justice
ai-risk — AI Existential Risk            institutions — Improving Institutions
animal-welfare — Animal Welfare          local-community — Local Community
arts-culture — Arts, Culture, Heritage   longevity — Longevity
climate-change — Climate Change          meta-theory — Meta and Theory
conflict-mitigation — Conflict Mitigation nuclear — Nuclear
decision-making — Improving Decision Making  other — Other
disaster-relief — Disaster Relief        pandemics — Pandemics
education — Education                    political — Political
environmental — General Environmental    population — Population
global-development — Global Development / Poverty  religious — Religious
global-health — Global Health            science-tech — Science and Tech
global-priorities — Global Priorities Research     social-justice — Social Justice
health-medicine — Health / Medicine
housing — Homelessness and Housing
```

Distinctions that trip people up: `global-health` is developing-world health interventions while `health-medicine` is rich-country medical research/hospitals; `global-development` is poverty/economic development; `ai-capabilities` (AGI Development) is a *negative-cost-per-life* category by design — labs like OpenAI legitimately carry it, donations there are modeled as increasing existential risk. Never "fix" a negative cost per life; it's the framework working as intended.

Recipients can also override or multiply category effect parameters (`effects:` with `overrides`/`multipliers`). That's rare and belongs to deep effectiveness analysis — the default-justification boilerplate is the norm for new recipients. If your research strongly suggests a recipient is far more/less effective than its category baseline, flag it in your report and (only if asked to pursue it) use the effectiveness-estimation skill at `.claude/skills/effectiveness-estimation/SKILL.md` — don't hand-roll a multiplier inline.

## Step 5 — Photo (best effort)

The site shows `public/images/people/small/<donor-id>.jpeg` (`.jpg` also works), square-cropped, ~460×460 (any reasonable square size works), falling back to `unknown.jpeg` when absent. Wikimedia Commons usually has a freely licensed photo of public figures: download it, square-crop (`sips -c <side> <side> in.jpg --out out.jpeg` on macOS), and drop it in. If you can't get a properly licensed image, skip this and note it in your report — the fallback renders fine.

## Step 6 — Validate and report

1. Run `npm run generate-data`. It must exit cleanly — it validates every rule above and names the offending file otherwise. Fix and re-run until green. (Never edit `src/data/generatedData.js` directly; it's a gitignored build artifact.)
2. Do not start the dev server to check the result — the user runs the site themselves.
3. Report to the user:
   - Donation count and total recorded, with the largest items
   - Every new recipient file created, with its category split and one line on where the split came from
   - Entries that are estimates or approximate-dated (anything whose `notes` hedges)
   - Candidates you found and **excluded**, with the policy reason (pledges, foundation grants out, political, unverifiable) — this is as valuable as what you added
   - Any edit you made to other donors' files (joint-gift credit changes)
   - Whether a photo was added

The user reviews category fractions and estimation judgment calls — surface them; don't bury them.
