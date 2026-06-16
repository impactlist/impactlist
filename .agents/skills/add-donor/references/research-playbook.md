# Donation research playbook

Source-by-source tactics for building a donor's verified donation list. Work primary sources for the big numbers; secondary sources are for discovery and corroboration. §2–4 lean on US filing systems (IRS, SEC) and US outlets — those are tools available for US donors, not requirements; §5 covers donors from everywhere else.

## 1. Map the giving vehicles

Before hunting individual gifts, enumerate every entity the donor gives through — private foundations, DAF accounts, LLCs (a Chan Zuckerberg Initiative–style LLC is not a charity; only its charitable grants/contributions count, researched per-gift). For each foundation get the **EIN** — everything else keys off it.

- Wikipedia article (often names the foundation outright)
- Inside Philanthropy donor profile (`insidephilanthropy.com` — search "<name> profile"); their "wallet" pages map vehicles well
- ProPublica Nonprofit Explorer search: `https://projects.propublica.org/nonprofits/search?q=<name or foundation>`
- Watch for multiple/renamed vehicles (e.g. one donor with a foundation, a DAF at Fidelity, and a 501(c)(4) — only the first two can produce trackable rows, and the (c)(4) is excluded as political/advocacy)

## 2. Foundation inflows — Form 990-PF

For each foundation the donor funds, the donation rows are the **contributions INTO it** — never grants paid out.

**Record at the finest observable granularity.** When individual transfers are documented — SEC Form 4 stock gifts (§3), an announced founding gift, a press-covered contribution — each is its own row with its real date and source, even if several land in the same fiscal year. Separate events stay separate: real dates feed the impact model's time-dependent effects, and per-row sources make future reconciliation easier. Collapse to an aggregate only when itemization adds no information (many small transfers, one shared source, no individual dates).

**The annual 990-PF figure is the fallback** for the common case where inflows are only visible summed (Schedule B contributor detail is IRS-redacted). Per fiscal year with a nonzero figure:

- `date`: fiscal-year-end date (e.g. Good Ventures FYE June 30 → `2024-06-30`; calendar-year foundations → `YYYY-12-31`)
- `amount`: the line-1 figure
- `source`: the ProPublica org URL (`https://projects.propublica.org/nonprofits/organizations/<EIN>`)
- `notes`: "FY<year> contributions received per Form 990-PF" plus anything about who contributed

Confirm the donor is actually the contributor where possible: Schedule B is usually IRS-redacted in public copies, but `ContributingManagerNm` in the XML, press coverage, or the foundation's own site often settles it. When a couple funds it jointly, split credit 0.5/0.5 only if both clear the "Who gets a donor file" bar in SKILL.md; otherwise record the listed donor's share as the amount with credit 1.0. When you *cannot* confirm the contributor and there's a plausible alternative source (another foundation transferring in — see the Anne Wojcicki Foundation's 2015 $275M, which was an inter-foundation divorce transfer, not a gift), exclude it.

### Getting the numbers

1. **ProPublica API** (no key): `https://projects.propublica.org/nonprofits/api/v2/organizations/<EIN>.json`. Older years appear in `filings_with_data` with parsed fields; recent years often show only "PDF available". ProPublica blocks scripted PDF/XML downloads (403 "Security Check") — don't fight it, go to the IRS source.
2. **IRS bulk XML** (for recent years ProPublica hasn't parsed):
   - Index CSV: `https://apps.irs.gov/pub/epostcard/990/xml/<YEAR>/index_<YEAR>.csv` (~90MB) where YEAR is when the IRS **received** the filing (a FY ending mid-2024 typically lands in the 2025 index — foundations take ~6-month extensions). Grep the EIN to get `OBJECT_ID` and `XML_BATCH_ID`.
   - Batch zip: `https://apps.irs.gov/pub/epostcard/990/xml/<YEAR>/<XML_BATCH_ID>.zip` (~500MB); extract just the file: `unzip -o <zip> <OBJECT_ID>_public.xml`.
   - Useful 990-PF XML tags: `ContriRcvdRevAndExpnssAmt` (contributions received — the number you want), `ContriPaidDsbrsChrtblAmt` (grants paid — for the recipient's category research, NOT donation rows), `FMVAssetsEOYAmt` (assets), `ContributingManagerNm` (who funded it).
   - The old per-file `s3.amazonaws.com/irs-form-990/<id>_public.xml` path is dead; use the batch zips.
3. **Grantmakers.io** and **CauseIQ** sometimes surface parsed figures faster for spot-checks.

**Reconcile, never stack.** For a given vehicle and fiscal year, itemized event rows and the 990 line-1 total describe the same money. If you have both, keep the itemized rows and drop the aggregate; if the itemized events fall materially short of the 990 total, add one remainder row noted as "balance of FY<year> contributions received per 990-PF beyond the itemized gifts above".

A year with $0 contributions received is itself a finding (no donation row) — note it so the next researcher doesn't re-derive it.

## 3. Stock gifts — SEC filings

For founders/insiders of public companies, large gifts move as stock and show up in **Form 4** filings with **transaction code G** (bona fide gift). EDGAR: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=<person or company>&type=4`.

- The Form 4 gives share count and date; value at that day's closing price and note the valuation method.
- The recipient is often unnamed ("a charitable trust", a DAF, "the Foundation"). Footnotes sometimes identify it; press coverage usually does. A gift from a personal living trust to their foundation = a donation row (it's the money entering the vehicle). A transfer between two entities they control where they had no remaining pecuniary interest = exclude (vehicle-internal).
- Form 5 catches gifts reported annually instead.

## 4. Direct-gift discovery sweep

- **Recipient-side announcements** — university/hospital/NGO press releases are the most reliable primary source for amount and date. Search "<name> gift site:edu", "<name> donation announcement".
- **Chronicle of Philanthropy** — annual Philanthropy 50; also their gifts database. Forbes "Top Givers"/400 philanthropy scores corroborate lifetime aggregates (aggregates are sanity checks, never rows).
- **donations.vipulnaik.com** — structured donor pages for EA-adjacent donors (`/donor.php?donor=<Name>`); good leads, re-verify each.
- **Survival and Flourishing Fund** — for EA/x-risk donors: `https://survivalandflourishing.fund/<year>/<h1|h2>/recommendations` (later rounds at `/sff-<year>-<half>-recommendations`). The funders pay receiving charities directly, so each row whose funder is your donor is a donation to that charity. Date ≈ first of the round's month (note the approximation). When the "Receiving Charity" is a fiscal sponsor for the listed org, record the org doing the work and note the intermediary.
- **Giving Pledge** (`givingpledge.org`) — profile/letter confirms intent, never amounts. No rows from pledges.
- **Open Philanthropy / foundation grant databases** — useful ONLY for building the foundation-recipient's category fractions, never for donor rows.
- **News archive passes by era** — "<name> donates" with year qualifiers across their giving lifetime; big donors' early giving (1990s–2000s) is underindexed and worth targeted passes.

## 5. Non-US donors — same rules, different paperwork

The 990/EDGAR machinery above exists only for US entities. The structural rules don't change — record money entering the donor's giving vehicles, never grants out, pledges excluded — but the documents do:

- Several jurisdictions have a charity register with public annual accounts that serve as the 990 analog where the donor runs a foundation there: the UK Charity Commission register, Canada's CRA T3010 filings, Australia's ACNC, and similar. Check whether one exists before assuming nothing is filed.
- Founders/promoters of non-US listed companies usually gift shares through the local exchange's insider-disclosure regime — the Form 4 analog. (Azim Premji's transfers into his trust/foundation, already on the list, were documented through Indian SEBI/exchange disclosures.)
- Where no usable registry exists, recipient announcements, the donor's own statements, and quality press **are** the primary record, and rows built on them are fully legitimate. Convert non-USD amounts at the gift-date rate and note the conversion.

## 6. Classification traps (real examples)

- **Foundation grants out reported as "X donates"** — headlines routinely credit the person for their foundation's grants. If the paying entity is the foundation, it's already counted. ("Bloomberg gives $4.3B in 2025" = Bloomberg Philanthropies grants out → exclude as rows.)
- **Inter-foundation transfers** — Brin Wojcicki Foundation → Anne Wojcicki Foundation ($275M, 2015) was divorce restructuring of already-donated money. Exclude.
- **Matching campaigns** — often paid by the foundation, not personally. Trace the paying entity.
- **Buying a company via a nonprofit** (TTAM/23andMe) — an acquisition, not a donation, unless a personal cash gift into the nonprofit is separately documented.
- **Aggregate-vs-itemized overlap** — a Dec-2025 "$2B to 199 organizations" disclosure may already include the four individually announced gifts you found; record either the itemization or the aggregate remainder, never both.
- **Currency** — convert at the gift-date rate; note the conversion.

## 7. Donor-profile facts

- `netWorth`: current Forbes real-time profile (`forbes.com/profile/<name>`) or Bloomberg Billionaires Index; round to ~3 significant figures.
- `birthDate`: Wikipedia.
- `about`: 1–3 sentences in the house style — what they're known for, born year/place, `[Wikipedia](...)` link at the end, cross-links like `[Melinda French Gates](/donor/melinda-gates)` where relevant.

## 8. Confidence standards

Every row needs a `source` URL a reader can check — and **any link that genuinely demonstrates the donation qualifies**, whatever the outlet: a regional newspaper, a foreign-language article, the recipient's annual-report PDF, an archived press release. There is no approved-source list. The rough hierarchy — official filing (IRS/SEC/charity register) / recipient's own announcement > donor's announcement > quality journalism > aggregator (Inside Philanthropy, Wikipedia) > tracker pages — is for allocating verification effort on the big numbers and for picking a winner when sources disagree on amount or date (prefer the higher tier; note the discrepancy), not for excluding rows. Estimated amounts or approximated dates are fine when flagged in `notes` (existing data does this openly); the only hard floor is that a row with no source at all should not exist.
