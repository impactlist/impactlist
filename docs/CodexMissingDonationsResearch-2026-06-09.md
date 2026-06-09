# Codex Missing Donations Research - 2026-06-09

## Scope

Primary window: 2025-06-09 through 2026-06-09.

Included donors: Anne Wojcicki, Azim Premji, Bill Gates, Elon Musk, Eric Schmidt, George Soros, Jaan Tallinn, Jed McCaleb, Jeff Bezos, Jensen Huang, Larry Ellison, Larry Page, MacKenzie Scott, Marc Benioff, Mark Zuckerberg, Melinda French Gates, Michael Bloomberg, Peter Thiel, Reid Hoffman, and Sergey Brin.

Excluded donors: Vitalik Buterin, Warren Buffett, Dustin Moskovitz, and Cari Tuna.

No donation data files were edited. This is an advisory research file only.

## Production Notes

Do not add every item mechanically. A large share of recent public "donation" news is downstream foundation grantmaking, matching pledges, internal transfers between giving vehicles, political giving, or annual/lifetime aggregates that would double-count existing entries.

I classify findings as:

- Add candidate: likely new personal donation or a project-consistent pass-through entry.
- Reconcile candidate: potentially useful, but should replace/update an aggregate or existing row rather than be added on top.
- Hold/exclude: not production-ready as a donation row under the current methodology.

## Additions From Comparing The Other Draft

After comparing against `docs/MissingDonationsResearch-2026-06.md`, these are the points I would add to this file because they affect production decisions or reduce double-count risk:

- Bill Gates: an older $20M Carnegie Mellon computer-science building gift was surfaced. It is foundation-routed and outside the last-year window, but it may be worth adding only if the project keeps similar Bill & Melinda Gates Foundation university-building rows. Source: [CMU](https://www.cmu.edu/cmnews/extra/040914_gates.html).
- Elon Musk: the existing 2023-12-01 "unknown" $108.2M entry appears to actually describe the Dec. 30, 2024 gift of 268,000 Tesla shares. That is an existing-row date/source correction, not a new gift. The existing 2024-12-20 $137M Musk Foundation row also needs stronger sourcing before relying on it.
- Eric Schmidt: the other draft includes a reported 2025 aggregate of $774.9M to Eric & Wendy Schmidt giving vehicles. I would not add it yet because it mixes gifts and pledges and will likely overlap the eventual FY2025 990 for the Fund for Strategic Innovation. It is worth re-checking when the FY2025 990 posts.
- George Soros: Bard College's $500M challenge was completed on 2026-01-21, inside the last-year window, but the better classification is OSF challenge/pledge completion rather than a new personal George Soros donation. This is a high-value false positive to keep excluded.
- Jed McCaleb: the other draft is more precise that FY2024 contributions received were $0 for both Navigation Charitable Fund and Astera Institute. It also supports treating the Navigation Fund $1.309B Form 990 figure as a correction to the existing $1.0B founding gift rather than a new donation.
- Jeff Bezos: the four 2025 Courage & Civility awards are announced as by Jeff Bezos and Lauren Sanchez Bezos; decide whether future rows should continue crediting Jeff 1.0 or introduce Lauren credit. The fifth $5M 2025 Courage & Civility recipient remains unidentified and should not be added.
- Jensen Huang: the DAF recipient in the Form 4 gifts is likely the Huangs' "GeForce Fund" at Schwab Charitable / DAFgiving360. If added, these rows likely need a new `schwab-charitable-daf`-style recipient. The important production distinction is that these DAF transfers came from the personal Living Trust, not from the foundation.
- Larry Ellison: the current 2025 EIT/Oxford row needs re-checking. The Oxford GBP 118M vaccine program may be institute spending or EIT capex rather than a clean personal gift, and should not be added on top of the existing EIT row without resolving that.
- Larry Page: for FY2024, the other draft gives more itemization: Climate Breakthrough $10M, Rockefeller Philanthropy Advisors $6M, Windward Fund $6M, World Resources Institute $4.75M, Global Fishing Watch $3M, European Climate Foundation $2.15M, Great Barrier Reef Foundation $2M, and Avina Americas $1.5M. This strengthens the "choose contributions-in or grants-out, not both" note.
- MacKenzie Scott: Red Lake Nation College's $7M gift is a borderline case. It was announced in April 2026 but reportedly received in 2025, so it may already be inside the Dec. 2025 Yield Giving aggregate. Exclude unless a source confirms it was outside that disclosure.
- Mark Zuckerberg / Priscilla Chan: the other draft gives a useful exact false positive: 397,007 Meta Class A shares, about $300.6M, moved from CZI Holdings to the CZI Foundation on 2025-08-01. Because Zuckerberg already had no pecuniary interest in CZI Holdings, this is an internal giving-vehicle movement, not a new personal donation. Source: [SEC](https://www.sec.gov/Archives/edgar/data/1326801/000095010325010038/xslF345X05/dp232802_4-zuckerberg0806.xml).
- Melinda French Gates: the other draft makes the additivity clearer: the $250M Action for Women's Health row, $50M Wellcome Leap Pivotal share, and $215M June 2026 women's-health funding should be treated as additive only if the project books Pivotal-channeled grants as personal giving.
- Peter Thiel: the Leo Strauss Foundation $100K older candidate is lower priority; DonorsTrust transfers around $3.07M in FY2024 are best excluded unless the project explicitly wants opaque DAF flows.
- Reid Hoffman: "Reid Hoffman Foundation" references appear to mean Aphorism Foundation. The 2024 and 2025 Second Harvest matching campaigns look foundation-routed or co-funded, so they should not be added as new personal gifts without revisiting the existing Aphorism treatment.

## Highest-Priority Last-Year Candidates

| Donor | Date | Candidate | Amount | Recommendation | Sources |
|---|---:|---|---:|---|---|
| Sergey Brin | 2025-11-26 | Alphabet stock gift split across Catalyst4, Sergey Brin Family Foundation, and Michael J. Fox Foundation | About $1.1B total | Add candidate if not already present; keep separate from the May 2025 gift | [Fortune](https://fortune.com/2025/11/30/sergey-brin-gift-1-billion-alphabet-stock-ai-rally-michael-j-fox/), [Philanthropy News Digest](https://philanthropynewsdigest.org/news/google-cofounder-brin-donates-1.1-billion-in-alphabet-shares) |
| Bill Gates | 2025 calendar year | Gates Foundation contribution | About $3.7B | Add/reconcile candidate; exact transfer date and composition need verification | [Gates Foundation fact sheet](https://www.gatesfoundation.org/about/foundation-fact-sheet), [Chronicle coverage](https://www.philanthropy.com/news/michael-bloomberg-biggest-donor-of-2025-tops-philanthropy-50-list-for-third-year-in-a-row/) |
| Michael Bloomberg | 2025 calendar year | Bloomberg Philanthropies annual giving increment | About $4.3B | Reconcile candidate; either add 2025 increment or update lifetime aggregate, not both | [Chronicle](https://www.philanthropy.com/news/michael-bloomberg-biggest-donor-of-2025-tops-philanthropy-50-list-for-third-year-in-a-row/), [Bloomberg annual report](https://www.bloomberg.org/annualreport/) |
| Melinda French Gates | 2026-06-04 | Pivotal women's health funding | $215M | Add candidate if this project books Pivotal pledges; do not separately add sub-components | [Pivotal](https://www.pivotal.com/media/melinda-french-gates-expands-her-work-in-womens-health), [AP](https://apnews.com/article/acd646dfd9b1038fb6c2920de8e5ccbf) |
| MacKenzie Scott | 2026-01 to 2026-04 | New gifts announced after the Dec 2025 Yield Giving disclosure | At least $216M across four named gifts | Add now only if reconciling against the next Scott aggregate; otherwise wait for next Yield Giving disclosure | [Meals on Wheels](https://www.prnewswire.com/news-releases/meals-on-wheels-america-announces-70-million-gift-from-philanthropist-mackenzie-scott-that-will-help-strengthen-the-meals-on-wheels-network-302737473.html), [NAMI](https://www.prnewswire.com/news-releases/nami-announces-59-million-gift-from-philanthropist-mackenzie-scott-302675430.html), [The Trevor Project](https://www.thetrevorproject.org/blog/the-trevor-project-receives-historic-gift-from-mackenzie-scott/), [ECSU](https://www.ecsu.edu/news/ecsu-receives-42-million-dollar-gift-from-philanthropist-mackenzie-scott.php) |
| Elon Musk | 2025-12-30 | Tesla share gift to unnamed charities | About $96M-$100M | Add candidate using an unknown-charity recipient until FY2025 filing identifies destination | [SEC Form 4](https://www.sec.gov/Archives/edgar/data/1318605/000110465925125703/xslF345X05/tm2534544-1_4seq1.xml), [Yahoo Finance](https://finance.yahoo.com/news/elon-musk-gave-100-million-141518227.html) |
| Jensen Huang | 2025-06, 2025-09, 2025-12 | Nvidia share gifts to the Jen-Hsun & Lori Huang Foundation and a donor-advised fund | About $254M missing in-window, depending on price basis | Add candidate for personal Form 4 gifts; avoid re-adding the existing June 2025 foundation portion | [SEC June 2025 Form 4](https://www.sec.gov/Archives/edgar/data/1197649/000104581025000128/wk-form4_1749074374.xml), [SEC Sept 2025 Form 4](https://www.sec.gov/Archives/edgar/data/1197649/000119764925000034/wk-form4_1758065770.xml), [SEC Dec 2025 Form 4](https://www.sec.gov/Archives/edgar/data/1197649/000119764925000061/wk-form4_1766181832.xml) |
| Jeff Bezos | 2025-12-17 | Four confirmed 2025 Courage & Civility awards | $20M confirmed | Add candidate for four named awardees; do not add a fifth until identified | [AP](https://apnews.com/article/16bdf231503ec127a958942ec7d50584), [National Math Stars](https://www.businesswire.com/news/home/20251217472999/en/National-Math-Stars-Ilana-Walder-Biesanz-Recognized-with-Bezos-Courage-Civility-Award) |
| Jaan Tallinn | 2025, announced by late Sept | SFF 2025 recommendations | $34.33M recommended / $34.92M expected | Add candidate if SFF recommendations are treated as donations; itemize recipients to match current file convention | [SFF 2025 recommendations](https://survivalandflourishing.fund/2025/recommendations) |
| Peter Thiel | 2026-04-20 | Thiel Fellowship 2026 class | $3M | Add candidate under existing Thiel Fellowship convention | [BusinessWire](https://www.businesswire.com/news/home/20260420984007/en/Thiel-Foundation-Announces-2026-Class-of-Thiel-Fellows) |
| Marc Benioff | 2025 calendar year | "More than $37M" personal giving outside San Francisco | More than $37M | Reconcile candidate; needs recipient split before production-quality cost-effectiveness treatment | [Salesforce](https://www.salesforce.com/news/stories/marc-lynne-benioff-philanthropy-2026/) |

## Donor-by-Donor Findings

### Anne Wojcicki

No solid missing donation found in the last-year window.

Checked but excluded:

- TTAM Research Institute's 2025 purchase of 23andMe assets is an acquisition by a nonprofit, not a confirmed personal charitable transfer by Wojcicki. Sources: [STAT](https://www.statnews.com/2025/06/13/23andme-anne-wojcicki-wins-back-from-bankruptcy-will-become-nonprofit-ttam/), [Bio-IT World](https://www.bio-itworld.com/news/2025/07/02/anne-wojcicki-buys-back-23andme-for-305m-promises-data-security).
- The older $50M Brin/Wojcicki challenge to Michael J. Fox Foundation appears already represented through the Sergey Brin file rather than missing. Sources: [PR Newswire](https://www.prnewswire.com/news-releases/brin-wojcicki-foundation-announces-50-million-challenge-grant-to-michael-j-fox-foundation-to-spur-progress-toward-parkinsons-cure-122862924.html), [MJFF](https://www.michaeljfox.org/publication/michael-j-fox-foundation-surpasses-50-million-brin-wojcicki-challenge).

### Azim Premji

No solid missing personal donation found in the last-year window.

Checked but excluded:

- The Azim Premji Foundation's 2025 girls' higher-education scholarships, reported as Rs 2,250 crore over three years, are foundation program spending rather than a new personal transfer from Premji. Sources: [Mint](https://www.livemint.com/education/news/azim-premji-foundation-commits-2-250-crore-for-girls-college-education-11747312536545.html), [Economic Times](https://economictimes.indiatimes.com/industry/services/education/azim-premji-foundation-plans-to-disburse-rs-2250-crores-in-scholarships-for-girls-pursuing-higher-education/articleshow/121192992.cms).
- June 2025 Wipro promoter-entity share transactions appear to be inter-se promoter/entity transfers, not charitable gifts. Sources: [Mint](https://www.livemint.com/market/stock-market-news/wipro-block-deal-azim-premji-trust-sells-20-23-crore-equity-shares-worth-over-rs-5-057-crore-check-details-11749479406705.html), [Economic Times](https://economictimes.indiatimes.com/markets/stocks/news/wipro-promoter-entities-swap-1-72-stake-worth-rs-4675-crore/articleshow/121783287.cms).

### Bill Gates

Add/reconcile candidates:

| Date | Candidate | Amount | Recommendation | Sources |
|---|---|---:|---|---|
| 2025 calendar year | Bill Gates contribution to the Gates Foundation | About $3.7B | Strong candidate, but exact transfer date and asset composition need a primary filing or better citation before production entry | [Gates Foundation fact sheet](https://www.gatesfoundation.org/about/foundation-fact-sheet), [Chronicle](https://www.philanthropy.com/news/michael-bloomberg-biggest-donor-of-2025-tops-philanthropy-50-list-for-third-year-in-a-row/) |
| 2024 filings, surfaced in 2026 | Pivotal Philanthropies Pathways / Opportunities / Momentum | About $982M each, about $2.95B total | Older candidate, likely part of Bill's broader post-divorce Pivotal transfer arrangement; do not also add a $10.8B or $12.5B aggregate | [Forbes](https://www.forbes.com/sites/monicahunter-hart/2026/01/28/bill-gates-donated-another-2-billion-to-ex-wife-melindas-foundations-new-records-show/), [Inc.](https://www.inc.com/leila-sheridan/melinda-gates-just-received-another-2-billion-from-her-ex-heres-what-new-filings-reveal/91294023) |

Checked but excluded:

- Gates Foundation 2025 Gavi, polio, or other program pledges are foundation payouts, not new personal transfers.
- The May 2025 pledge to give away virtually all remaining wealth is a future plan, not a completed donation. Source: [Axios](https://www.axios.com/2025/05/08/bill-gates-give-away-virtually-all-wealth-gates-foundation).
- NextLadder Ventures is a $1B multi-funder commitment with no disclosed Gates share. Source: [AP](https://apnews.com/article/5c84fa707ba8275a7afb2bc5245c286d).

### Elon Musk

Add candidate:

| Date | Candidate | Amount | Recommendation | Sources |
|---|---|---:|---|---|
| 2025-12-30 | 210,699 Tesla shares transferred as a gift by the Elon Musk Revocable Trust | About $96M-$100M | Likely missing; use an unknown-charity recipient until a Form 990 or reporting identifies the actual recipient | [SEC Form 4](https://www.sec.gov/Archives/edgar/data/1318605/000110465925125703/xslF345X05/tm2534544-1_4seq1.xml), [Yahoo Finance](https://finance.yahoo.com/news/elon-musk-gave-100-million-141518227.html) |

Checked but excluded:

- The Dec. 30, 2024 Tesla share gift appears already represented in the Musk file, though the existing date may need review.
- Musk Foundation grants, XPRIZE payouts, and political contributions should not be added as personal donation rows on top of existing foundation/commitment entries.

### Eric Schmidt

Candidates with methodology caveat:

| Date | Candidate | Amount | Recommendation | Sources |
|---|---|---:|---|---|
| 2025-11-05 | Schmidt Sciences AI2050 fellows | More than $18M | Hold unless this repo intentionally tracks downstream Schmidt Sciences grants | [Schmidt Sciences](https://www.schmidtsciences.org/schmidt-sciences-awards-18m-to-researchers-working-to-ensure-ai-benefits-society/) |
| 2025-12-11 | Humanities and AI Virtual Institute teams | $11M | Hold for same downstream-grant reason | [Schmidt Sciences](https://www.schmidtsciences.org/havi-2025-announcement/) |
| 2026-01-27 | AI at Work research studies | More than $3M | Hold for same downstream-grant reason | [Schmidt Sciences](https://www.schmidtsciences.org/schmidt-sciences-awards-over-3-million-to-study-ais-impact-on-jobs/) |
| FY2022-FY2024 | Contributions into Eric and Wendy Schmidt Fund for Strategic Innovation | About $512M total across available 990 years | Older contribution-in candidates; likely cleaner than itemizing downstream Schmidt Sciences grants | [ProPublica profile](https://projects.propublica.org/nonprofits/organizations/463460261) |

Production view: prefer contributions into the Schmidt philanthropic vehicle, or downstream grants, but not both.

### George Soros

No solid missing personal donation found in the last-year window.

Checked but excluded:

- Open Society Foundations announced $30M over three years to counter antisemitism and anti-Muslim hate in May 2026. This is OSF grantmaking, not a new personal George Soros transfer. Sources: [OSF](https://www.opensocietyfoundations.org/newsroom/open-society-foundations-announce-30-million-investment-to-counter-antisemitism-and-anti-muslim-hate), [AP](https://apnews.com/article/1bc42f6e6e6ffe8fbf964b37c61b7bf6).
- OSF announced a $300M, five-year U.S. economic security and civil liberties initiative in May 2026. Same downstream-grant issue. Sources: [OSF](https://www.opensocietyfoundations.org/newsroom/open-society-foundations-launch-300-million-initiative-to-advance-economic-security-and-defend-civil-liberties-in-the-united-states), [AP](https://apnews.com/article/6e209d738f5e2f74c1c4ec1dc6a20ce5).
- OSF's fact sheet still describes lifetime George Soros giving as over $32B, which appears broadly covered by existing OSF entries rather than a new 2025-2026 gift. Source: [OSF fact sheet](https://www.opensocietyfoundations.org/newsroom/open-society-foundations-and-george-soros/ro).

### Jaan Tallinn

Add candidates:

| Date | Candidate | Amount | Recommendation | Sources |
|---|---|---:|---|---|
| 2025, exact date not shown | SFF 2025 S-Process recommendations | $34.33M recommended / $34.92M expected | Add candidate if SFF recommendations are treated as donations; itemize recipients | [SFF 2025](https://survivalandflourishing.fund/2025/recommendations) |
| 2024 | Regular SFF 2024 S-Process recommendations | About $19.01M | Older missing candidate; appears distinct from existing 2024 Initiative Committee rows | [SFF recommendations](https://survivalandflourishing.fund/recommendations) |
| 2024 | SFF 2024 FlexHEG Tallinn-funded portions | About $2.7M | Older missing candidate; credit only Tallinn's portion, not FLI or Blake Borgeson amounts | [SFF recommendations](https://survivalandflourishing.fund/recommendations) |

Largest 2025 rows to check first: AI Futures Project $2.035M, AI Policy Institute $1.635M, MIRI $1.607M, SecureDNA $1.5M, Lightcone $1.311M, Palisade $1.133M, RAND Technology and Security Policy Center $1.022M, PIBBSS $1.014M, FAR AI $919K, Tarbell Center $783K, CAIS Action Fund $772K, SecureBio $754K, Metaculus $750K, ACS Research $706K, Ovelle Bio $667K, Civic AI $600K, Eisenstat Research Program $593K, and Centre for Long-Term Resilience $565K.

### Jed McCaleb

No solid missing new personal donation found in the last-year window.

Checked but excluded:

- Navigation Fund reports substantial 2025 grantmaking, but that is downstream from the already-recorded founding endowment. Source: [Navigation Fund](https://www.navigation.org/about).
- Astera Institute and Navigation Fund FY2024 filings should be checked for contributions-in, but available reporting indicates no new personal contribution comparable to the existing Astera and Navigation Fund endowment entries. Sources: [Astera ProPublica](https://projects.propublica.org/nonprofits/organizations/845162617), [Navigation ProPublica](https://projects.propublica.org/nonprofits/organizations/921117448).

Data-quality note: the existing Navigation Fund founding gift may need an amount review, because FY2023 filings and secondary reporting point closer to $1.3B than $1.0B. Treat this as an existing-row correction, not a new donation.

### Jeff Bezos

Add candidates:

| Date | Candidate | Amount | Recommendation | Sources |
|---|---|---:|---|---|
| 2025-12-17 | David Flink / Neurodiversity Alliance Courage & Civility award | $5M | Add candidate | [AP](https://apnews.com/article/16bdf231503ec127a958942ec7d50584), [Neurodiversity Alliance](https://thendalliance.org/david-flink-recognized-with-bezos-courage-civility-award-from-jeff-bezos-and-lauren-sanchez-bezos/) |
| 2025-12-17 | Ilana Walder-Biesanz / National Math Stars Courage & Civility award | $5M | Add candidate | [BusinessWire](https://www.businesswire.com/news/home/20251217472999/en/National-Math-Stars-Ilana-Walder-Biesanz-Recognized-with-Bezos-Courage-Civility-Award) |
| 2025-12-17 | Richard Rusczyk / MATHCOUNTS Courage & Civility award | $5M | Add candidate | [MATHCOUNTS](https://www.mathcounts.org/about/register-competition-series-dec-15) |
| 2025-12-17 | Kara Ball / Understood.org Courage & Civility award | $5M | Add candidate | [Yahoo Finance](https://finance.yahoo.com/news/kara-ball-recognized-bezos-courage-130000175.html) |

Checked but excluded or reconcile:

- The Bezos Day 1 Families Fund 2025 round awarded $102.5M to 32 recipients. The current file reportedly includes only 3 recipients, but the whole round is downstream from the already-recorded $2B Day One commitment. Either track all Day 1 annual awards consistently, or treat them as endowment payouts and remove the partial entries; do not half-track. Source: [Day 1 Families Fund](https://www.bezosdayonefund.org/day1familiesfund).
- Bezos Earth Fund grants, including nuclear/climate/ocean items, are downstream from the existing Earth Fund endowment. Source example: [Axios nuclear initiative](https://www.axios.com/2026/01/29/bezos-fund-nuclear-initiative).

### Jensen Huang

Add/reconcile candidates:

| Date | Candidate | Amount | Recommendation | Sources |
|---|---|---:|---|---|
| 2025-06-02 | Donor-advised fund portion of Nvidia share gifts | About $30.2M | Add if project tracks personal DAF transfers; do not re-add the paired foundation portion already represented by the June 2025 entry | [SEC Form 4](https://www.sec.gov/Archives/edgar/data/1197649/000104581025000128/wk-form4_1749074374.xml) |
| 2025-09-15 | Jen-Hsun & Lori Huang Foundation plus DAF Nvidia share gifts | About $200M | Add/reconcile candidate | [SEC Form 4](https://www.sec.gov/Archives/edgar/data/1197649/000119764925000034/wk-form4_1758065770.xml) |
| 2025-12-17 | Jen-Hsun & Lori Huang Foundation plus DAF Nvidia share gifts | About $24.2M | Add/reconcile candidate | [SEC Form 4](https://www.sec.gov/Archives/edgar/data/1197649/000119764925000061/wk-form4_1766181832.xml) |
| 2024-09-20 | Older foundation plus DAF Nvidia share gifts | About $181.9M | Older missing candidate | [SEC Form 4](https://www.sec.gov/Archives/edgar/data/1197649/000104581024000290/wk-form4_1727208751.xml) |

Checked but excluded:

- California College of the Arts, UCSF, CoreWeave compute, and similar items are foundation grants or program spending if they come from the Huang Foundation, not new personal transfers.

### Larry Ellison

Last-year issue:

| Date | Candidate | Amount | Recommendation | Sources |
|---|---|---:|---|---|
| 2025-09 | Oxford Vaccine Group / Ellison Institute of Technology vaccine research | GBP 118M, roughly $160M-$170M | Reconcile with the existing $100M EIT/Oxford row; likely an amount/source correction or related commitment, not an additive row without more work | [Oxford Vaccine Group](https://www.ovg.ox.ac.uk/news/oxford-launches-major-new-ai-vaccine-research-programme-with-the-ellison-institute-of-technology), [The Register](https://www.theregister.com/2025/09/01/ellison_oxford_vaccine_research/) |

Older candidates:

- Larry Ellison Foundation contributions-in, especially 2023 Form 990-PF contribution of about $178.9M and other 2011-2023 contributions, are plausible older missing personal transfers if the project tracks contributions into his foundation. Source: [ProPublica](https://projects.propublica.org/nonprofits/organizations/943269827).
- A 2014 $100M Global Polio Eradication Initiative pledge is a notable older gap if foundation/police health pledges are in scope. Source: [GPEI archive](https://www.archive.polioeradication.org/news-post/lawrence-ellison-foundation-joins-global-effort-to-end-polio-with-100-million-donation/).

Checked but excluded:

- Tony Blair Institute, Dian Fossey Gorilla Fund, and similar rows are Larry Ellison Foundation grants out. Do not add them on top of contributions-in.
- Political gifts and commercial backing for media/company transactions are out of scope.

### Larry Page

No clear last-year personal donation found. Older FY2024 filing candidates:

| Date | Candidate | Amount | Recommendation | Sources |
|---|---|---:|---|---|
| FY2024 / 2024-12 | Carl Victor Page Memorial Foundation contribution received | $102.7M | Cleaner personal-transfer signal, but do not also add FY2024 grants out | [ProPublica](https://projects.propublica.org/nonprofits/organizations/201922957), [Cause IQ](https://www.causeiq.com/organizations/carl-victor-page-memorial-foundation%2C201922957/) |
| FY2024 / 2024-12 | Direct grants including Climate Breakthrough $10M, Windward Fund $6M, WRI/Global Fishing Watch recurring grants | About $49M direct grants, plus DAF transfers | Use only if continuing current Page convention of tracking grants out rather than contributions in | [Cause IQ](https://www.causeiq.com/organizations/carl-victor-page-memorial-foundation%2C201922957/), [ProPublica](https://projects.propublica.org/nonprofits/organizations/201922957) |
| FY2024 / 2024-12 | National Philanthropic Trust DAF transfer | $235M | Hold/exclude due to DAF opacity and downstream double-count risk | [Cause IQ](https://www.causeiq.com/organizations/carl-victor-page-memorial-foundation%2C201922957/) |

Production view: choose contributions-in or grants-out for a given year, not both.

### MacKenzie Scott

Add/reconcile candidates outside the Dec. 2025 Yield Giving aggregate:

| Date announced | Candidate | Amount | Recommendation | Sources |
|---|---|---:|---|---|
| 2026-04-09 | Meals on Wheels America | $70M | Add now only with a future aggregate reconciliation note | [PR Newswire](https://www.prnewswire.com/news-releases/meals-on-wheels-america-announces-70-million-gift-from-philanthropist-mackenzie-scott-that-will-help-strengthen-the-meals-on-wheels-network-302737473.html) |
| 2026-01-30 | NAMI | $59M | Same | [PR Newswire](https://www.prnewswire.com/news-releases/nami-announces-59-million-gift-from-philanthropist-mackenzie-scott-302675430.html) |
| 2026-01-12 | The Trevor Project | $45M | Same; reports indicate it was not in the Dec. 2025 disclosure | [Trevor Project](https://www.thetrevorproject.org/blog/the-trevor-project-receives-historic-gift-from-mackenzie-scott/) |
| 2026-03-13 | Elizabeth City State University | $42M | Same | [ECSU](https://www.ecsu.edu/news/ecsu-receives-42-million-dollar-gift-from-philanthropist-mackenzie-scott.php) |

Checked but excluded:

- UNCF's $70M gift announced in Sept. 2025 is likely inside the Dec. 2025 Yield Giving aggregate already in the file. Source: [AP](https://apnews.com/article/4db7e27b4b1180f2b7969f1a1910a350).
- Individual recipients in the Dec. 2025 disclosure should not be added separately while the aggregate $7.166B row remains. Source: [Yield Giving](https://yieldgiving.com/essays/we-are-the-ones-we-ve-been-waiting-for/).

### Marc Benioff

Candidate:

| Date | Candidate | Amount | Recommendation | Sources |
|---|---|---:|---|---|
| 2025 calendar year | Giving outside San Francisco, including American Cancer Society, DonorsChoose, Jane Goodall Legacy Foundation, and others | More than $37M | Reconcile candidate; needs recipient-level allocation before production-quality row(s) | [Salesforce](https://www.salesforce.com/news/stories/marc-lynne-benioff-philanthropy-2026/) |

Checked but excluded:

- Salesforce corporate gifts and Salesforce.org activity are corporate philanthropy, not personal Benioff donations.
- GLIDE auction proceeds are paid by auction winners, not by Benioff personally.
- The Hawaii hospital commitment needs transfer-date clarity before it becomes an addable row.

### Mark Zuckerberg / Priscilla Chan

No solid last-year personal donation found.

Checked but excluded:

- Biohub's 2026 Virtual Biology Initiative is a $500M, five-year Biohub/CZI program commitment, not clearly a new Zuckerberg/Chan personal transfer. Sources: [Biohub](https://biohub.org/news/virtual-biology-initiative/), [Axios](https://www.axios.com/2026/04/29/zuckerberg-chan-biohub-philanthropy-ai-disease).
- The 2025 Biohub refocus had no separate donation amount. Sources: [AP](https://apnews.com/article/87c24eb349abcce8abec132b8538d7b0), [Axios](https://www.axios.com/2025/11/06/zuckerberg-chan-biohub-ai-disease).
- Internal CZI Holdings to CZI Foundation share transfers are high double-count risk unless the project explicitly tracks internal movement among CZI vehicles.

### Melinda French Gates

Add/reconcile candidates:

| Date | Candidate | Amount | Recommendation | Sources |
|---|---|---:|---|---|
| 2026-06-04 | Women's health funding through Pivotal | $215M | Add candidate if booking Pivotal pledges; do not add Co-Impact/Menopause/Wellcome Leap separately if using aggregate | [Pivotal](https://www.pivotal.com/media/melinda-french-gates-expands-her-work-in-womens-health), [AP](https://apnews.com/article/acd646dfd9b1038fb6c2920de8e5ccbf) |
| 2025-09 / fall 2025 | Wellcome Leap women's health partnership | $50M Pivotal share | Component candidate only if not included in the $215M aggregate treatment | [Wellcome Leap](https://wellcomeleap.org/pivotal_partnership_news/) |
| 2024-12 | Women-in-the-workplace / AI / leadership organizations via Pivotal | $150M | Older candidate; check against the broader $1B women's power commitment before adding | [Fortune](https://fortune.com/2024/12/11/melinda-french-gates-150-million-donation-women-in-the-workplace-ai/) |

Checked but excluded:

- The existing 2025-11-12 $250M Action for Women's Health row appears already present.
- Bill Gates transfers into Pivotal are Bill's donations, not Melinda's personal donations.

### Michael Bloomberg

Add/reconcile candidates:

| Date | Candidate | Amount | Recommendation | Sources |
|---|---|---:|---|---|
| 2025 calendar year | Bloomberg Philanthropies annual giving increment | $4.3B | Use as the 2025 increment or update the lifetime aggregate to $25.4B; do not do both | [Chronicle](https://www.philanthropy.com/news/michael-bloomberg-biggest-donor-of-2025-tops-philanthropy-50-list-for-third-year-in-a-row/), [Bloomberg annual report](https://www.bloomberg.org/annualreport/) |

Components to avoid double-counting against the aggregate:

- Tobacco-control Accelerator Fund, $20M. Source: [Bloomberg](https://www.bloomberg.org/press/bloomberg-philanthropies-recognizes-governments-and-ngos-in-six-countries-for-exceptional-efforts-to-combat-tobacco-use/).
- Global vision-care initiative, $75M. Source: [Bloomberg](https://www.bloomberg.org/press/bloomberg-philanthropies-launches-global-effort-to-improve-vision-care/).
- Global methane reduction initiative, $100M. Source: [Bloomberg](https://www.bloomberg.org/press/michael-r-bloomberg-launches-unprecedented-end-to-end-global-methane-emissions-reduction-effort-from-space-detection-to-rapid-response/).
- Global Polio Eradication Initiative, $100M pledge. Source: [GPEI pledge table](https://polioeradication.org/wp-content/uploads/2025/12/GPEI-pledging-table-20251208.pdf).
- National September 11 Memorial & Museum / Never Forget Fund, $25M match, announced 2026. Source: [AP](https://apnews.com/article/72aea9254c308958a4cb408232ff74cf).

Older notable items such as the 2024 Johns Hopkins $1B medical education gift and $600M to historically Black medical schools are likely inside the current through-2024 aggregate if that aggregate remains.

### Peter Thiel

Add candidate:

| Date | Candidate | Amount | Recommendation | Sources |
|---|---|---:|---|---|
| 2026-04-20 | Thiel Fellowship 2026 class | $3M | Add candidate under the same convention as existing fellowship rows | [BusinessWire](https://www.businesswire.com/news/home/20260420984007/en/Thiel-Foundation-Announces-2026-Class-of-Thiel-Fellows) |

Older/secondary candidate:

- A 2024 Leo Strauss Foundation grant of about $100K may be missing if the project tracks Thiel Foundation pass-through grants. This is lower priority and needs recipient setup/source verification.

Checked but excluded:

- DonorsTrust and political/lobbying gifts have high opacity or are out of scope.

### Reid Hoffman

No solid missing last-year personal donation found.

Checked:

- Stanford HAI 2025 Hoffman-Yee follow-on grants appear covered by the existing cumulative Stanford HAI entry. Source: [Stanford HAI](https://hai.stanford.edu/news/stanford-research-teams-receive-new-hoffman-yee-grant-funding-for-2025).
- A reported older $5M gift to Lever for Change operations through a DAF may be a missing 2024 candidate, distinct from the $10M Trust in American Institutions Challenge, but it is outside the last-year window and should be verified before adding. Source: [Lever for Change](https://leverforchange.org/article/newsletter-article/why-billionaires-like-mackenzie-scott-and-reid-hoffman-are-partnering-with-this-nonprofit-trying-to-shake-up-philanthropy/).
- Second Harvest matching campaigns appear foundation-routed or co-funded and should not be added as personal rows without reconciliation.

### Sergey Brin

Add candidates:

| Date | Candidate | Amount | Recommendation | Sources |
|---|---|---:|---|---|
| 2025-11-26 | Catalyst4 portion of Alphabet stock gift | About $1B | Add candidate if absent | [Fortune](https://fortune.com/2025/11/30/sergey-brin-gift-1-billion-alphabet-stock-ai-rally-michael-j-fox/), [Philanthropy News Digest](https://philanthropynewsdigest.org/news/google-cofounder-brin-donates-1.1-billion-in-alphabet-shares) |
| 2025-11-26 | Sergey Brin Family Foundation portion | About $90M | Add candidate if absent; do not also add downstream foundation grants | Same sources |
| 2025-11-26 | Michael J. Fox Foundation portion | About $45M | Add candidate if absent | Same sources |

Checked but excluded:

- The May 2025 stock gifts to Catalyst4, Sergey Brin Family Foundation, and Michael J. Fox Foundation appear already represented, though one Catalyst4 date may need review.
- A Feb. 2026 Alphabet stock gift is real but the recipient was not identified in the sources I found, so it is not production-ready.
- Brin Family Foundation grant payouts should not be added on top of contributions into the foundation.
