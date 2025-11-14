---
id: political
name: 'Political'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 4
    costPerQALY: 30_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **\$30,000 per QALY**  
**Range (plausible):** **\$3,000–\$300,000 per QALY**

## Details

**What’s in scope.**  
This estimate covers _partisan_ donations to candidates or PACs in high-income democracies (e.g., U.S., U.K.). The impact pathway is: dollars → slightly higher win probability in close races → policy differences → QALYs. We explicitly account for (i) counter-donations by the opposing side and (ii) the risk that campaign spending moves few votes.

**What we know about moving election outcomes.**

- Field experiments and meta-analyses suggest **small average persuasive effects** of general-election contact/advertising; many studies find near-zero persuasion in high-salience races. See Kalla & Broockman’s review/meta-analysis ([APSR 2018](https://www.cambridge.org/core/journals/american-political-science-review/article/minimal-persuasive-effects-of-campaign-contact-in-general-elections-evidence-from-49-field-experiments/753665A313C4AB433DBF7110299B7433); working paper version [SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3042867)). TV ad effects, when present, are often **short-lived** ([Gerber, Gimpel, Green & Shaw 2011](https://www.cambridge.org/core/journals/american-political-science-review/article/how-large-and-longlasting-are-the-persuasive-effects-of-televised-campaign-ads-results-from-a-randomized-field-experiment/DA29FE8A5581C772006A1DEBB21CFC4C)). Some designs do find **positive vote-share responses** to advertising ([Spenkuch & Toniatti 2016](https://www.ifo.de/DocDL/cesifo1_wp5780.pdf)).
- **Turnout mobilization** reliably moves votes at modest cost (e.g., door-to-door, mail, SMS), though effects vary by context; see overviews and meta-analyses ([Gerber & Green, _Get Out the Vote_](https://www.researchgate.net/publication/396933704_Get_Out_the_Vote_How_to_Increase_Voter_Turnout); Yale ISPS summary of GOTV evidence: [ISPS](https://isps.yale.edu/research/field-experiments-initiative/lessons-from-gotv-experiments); newer meta on mobilization tactics: [Mann et al. 2024](https://www.sciencedirect.com/science/article/pii/S0261379423001518)).
- **Zero-sum dynamics & diminishing returns:** Opposing donors respond, and competitive races see **very large** total spending (FEC and OpenSecrets summaries: [FEC 2024 cycle](https://www.fec.gov/updates/statistical-summary-of-24-month-campaign-activity-of-the-2023-2024-election-cycle/); [OpenSecrets overview](https://www.opensecrets.org/elections-overview/cost-of-election); digital ad totals: [Brennan Center/Wesleyan 2024–25](https://www.brennancenter.org/our-work/analysis-opinion/online-ad-spending-2024-election-totaled-least-19-billion); TV ad totals: [Wesleyan Media Project](https://mediaproject.wesleyan.edu/releases-103124/)). This tug-of-war reduces the net effect of any one side’s extra dollar.

**Why policy differences can still be very large in QALY terms.**

Even small shifts in win probability can matter because government decisions control **billions** in resources and major regulatory choices. For a concrete, relatively apolitical anchor, consider U.S. **global health appropriations**: year-to-year changes have been on the order of **hundreds of millions** of dollars (e.g., FY2024 global health funding dropped by about **\$0.5 billion** vs. FY2023; [KFF 2024](https://www.kff.org/global-health-policy/global-health-funding-in-the-fy-2024-final-appropriations-bill/); see live tracker: [KFF tracker](https://www.kff.org/interactive/u-s-global-health-budget-tracker/)). If a small share of a budget delta reaches highly cost-effective programs, the implied QALY swings can be sizeable when benchmarked to global opportunities (~**\$90/QALY** from top global health/development, per our separate estimates).

**Explicit assumptions & calculation (base case).**

We model donations targeted to an exceptionally close, policy-salient national race in which one side’s platform yields higher expected QALYs (e.g., via health, safety, or international policy). Let:

- $B$: policy budget swing at stake across the term (conservative anchor from recent U.S. global health deltas) = **\$500 million**.  
  Evidence on scale: [KFF FY2024 vs FY2023](https://www.kff.org/global-health-policy/global-health-funding-in-the-fy-2024-final-appropriations-bill/).
- $f$: fraction of $B$ that converts into outcomes near top-tier effectiveness (portfolio dilution + implementation losses) = **20%**.  
  Benchmarked to best-in-class opportunities being a minority of total spend.
- $c$: cost per QALY for those best-in-class opportunities = **\$100/QALY** (rounded from \~\$90/QALY global health/development).
- $g$: **marginal influence factor of the race** on realizing that swing (because many actors/branches matter) = **5%**.  
  Reflects that one race marginally shifts the coalition/agenda.
- $p$: **net** increase in win probability from a well-targeted **\$10 million** partisan donation after accounting for counter-spending and diminishing returns = **0.7 percentage points** (= **0.007**).  
  This is deliberately modest given minimal average persuasion and saturated spending, yet allows for targeted GOTV/ad effects in a true toss-up (see persuasion/GOTV literature above).
- $C$: donation amount = **\$10 million**.

Compute QALYs at stake from the policy wedge:

$$
\text{QALYs}_{\text{wedge}} = \frac{f \times B}{c}
= \frac{0.20 \times \$500{,}000{,}000}{\$100/\text{QALY}}
= 1{,}000{,}000\ \text{QALYs}.
$$

Portion causally tied to winning this race:

$$
\text{QALYs}_{\text{race}} = g \times \text{QALYs}_{\text{wedge}}
= 0.05 \times 1{,}000{,}000 = 50{,}000\ \text{QALYs}.
$$

Expected QALYs from the donation:

$$
\mathbb{E}[\text{QALYs}] = p \times \text{QALYs}_{\text{race}}
= 0.007 \times 50{,}000 = 350\ \text{QALYs}.
$$

Cost per QALY:

$$
\textbf{Cost per QALY} = \frac{C}{\mathbb{E}[\text{QALYs}]}
= \frac{\$10{,}000{,}000}{350} \approx \textbf{\$28{,}600\ \text{per QALY}} \ \ (\text{rounded to } \textbf{\$30{,}000}).
$$

**Zero-sum adjustment is built in.**  
The parameter $p$ is **after** accounting for the likely response of the other side (counter-donations and messaging) and the crowding that reduces marginal returns in saturated media markets (see spending saturation: [FEC](https://www.fec.gov/updates/statistical-summary-of-24-month-campaign-activity-of-the-2023-2024-election-cycle/); [OpenSecrets](https://www.opensecrets.org/elections-overview/cost-of-election); evidence of small average persuasion: [Kalla & Broockman](https://www.cambridge.org/core/journals/american-political-science-review/article/minimal-persuasive-effects-of-campaign-contact-in-general-elections-evidence-from-49-field-experiments/753665A313C4AB433DBF7110299B7433); short-lived ad effects: [Gerber et al.](https://www.cambridge.org/core/journals/american-political-science-review/article/how-large-and-longlasting-are-the-persuasive-effects-of-televised-campaign-ads-results-from-a-randomized-field-experiment/DA29FE8A5581C772006A1DEBB21CFC4C)).

**Range and uncertainty.**  
We vary key parameters within conservative bounds:

- $B$: **\$200 million–\$1 billion**;
- $f$: **10%–30%**; $c$: **\$90–\$300/QALY** (to reflect dilution vs. top-tier opportunities);
- $g$: **1%–15%** (how pivotal this race is for the policy wedge);
- $p$: **0.1–3 percentage points** net win-probability shift per **\$5–\$30 million** in very close races (consistent with small average persuasion but allowing targeted GOTV/ads to matter at the margin; [Kalla & Broockman](https://www.cambridge.org/core/journals/american-political-science-review/article/minimal-persuasive-effects-of-campaign-contact-in-general-elections-evidence-from-49-field-experiments/753665A313C4AB433DBF7110299B7433); [Spenkuch & Toniatti](https://www.ifo.de/DocDL/cesifo1_wp5780.pdf); GOTV meta: [Mann et al. 2024](https://www.sciencedirect.com/science/article/pii/S0261379423001518)).

Sweeping these yields roughly **\$3,000–\$300,000 per QALY**. The lower end corresponds to unusually tractable, ultra-close races linked to large, high-effectiveness policy wedges; the upper end reflects years when spending largely cancels out or policy differences are small.

**Bottom line.**  
Partisan political giving is **hits-based and zero-sum-pressured**: most dollars move little, but well-timed funding in true toss-ups tied to large, outcome-relevant policy wedges can be competitive with mid-five-figure per-QALY charities on expectation. A cautious central estimate of **\$30,000 per QALY** reflects modest net effects on win probability, dilution of policy into broad budgets, and the reality of counter-spending.

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes

## Start time & duration (for modeling)

- **Start time:** **0.5 years** (range **0.25–1.0 years**).  
  _Why:_ Donations typically precede elections by months; benefits begin if the backed side wins and enacts policy soon after taking office.

- **Duration of benefit:** **2 years** (range **1–4 years**).  
  _Why:_ Many election-dependent policy changes (appropriations, regulatory priorities) run with the term and can persist into the next cycle, but may be reversed.
