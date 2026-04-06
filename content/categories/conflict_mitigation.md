---
id: conflict-mitigation
name: 'Conflict Mitigation'
effects:
  - effectId: standard
    startTime: 0
    windowLength: 10
    costPerQALY: 1_000
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures human-welfare gains from donations to **top conflict-mitigation organizations** that reduce the probability, duration, or intensity of organized armed conflict through mediation, quiet diplomacy, conflict analysis, early warning, and support for political settlements. Representative organizations include the Centre for Humanitarian Dialogue (HD) and the International Crisis Group (ICG).

This estimate is mainly about preventing or shortening **serious civil-conflict episodes**. It is **not** meant to represent the average peacebuilding NGO, military aid, or generic humanitarian relief. It also focuses on QALY-scale human harms rather than the full economic and institutional damage of war, so it should be read as a **partial welfare estimate** rather than a complete accounting of conflict's social cost.

## Point Estimates

- **Cost per QALY:** \$1,000 (\$80–\$13,000)
- **Start time:** 0 years
- **Duration:** 10 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. The direct health burden of conflict and terrorism is on the order of **10 million DALYs per year** globally, and the total health burden is plausibly closer to **30–40 million QALYs per year** once indirect deaths, displacement, healthcare disruption, food insecurity, and mental illness are included. As an illustrative sanity check, **123.2 million** forcibly displaced people losing only **0.03–0.05 QALYs each** would already imply roughly **3.7–6.2 million QALYs**. That decrement is deliberately modest for a heterogeneous population and is below GBD disability weights for moderate anxiety or moderate depression. ([Coefficient Giving / Open Philanthropy 2022](https://coefficientgiving.org/research/civil-conflict-reduction/), [UNHCR Global Trends 2024](https://www.unhcr.org/global-trends-report-2024), [The Lancet 2019](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736%2819%2930934-1/fulltext), [WHO methods and data sources for DALYs 2000-2019](https://www.who.int/docs/default-source/gho-documents/global-health-estimates/ghe2019_daly-methods.pdf?sfvrsn=31b250097))
2. The world is currently experiencing an unusually high level of organized violence: **2024 had 61 active state-based conflicts across 36 countries**, the highest number since 1946. Mapping the **30–40 million** total annual conflict burden onto roughly **30–60 serious conflict settings** implies about **0.5–1.3 million QALYs lost per representative conflict-year**. We use **1 million QALYs** as the central value. ([PRIO / UCDP 2025](https://www.prio.org/publications/14453))
3. Top mediation and conflict-analysis organizations operate with budgets in the **tens of millions**. HD reported **50 million CHF** in contribution income in 2023 and **70+ peacemaking projects**; ICG reported **\$23.5 million** in revenue in 2024. This suggests average project-year costs below **\$1 million**, but marginal dollars may fund somewhat worse opportunities than the average project. HD also says it is expanding fundraising and welcomes more flexible funding, which is at least weak evidence of room for more funding. We therefore use **\$1 million** as a conservative central cost for one additional high-quality engagement-year, with a plausible range of **\$0.3–2 million**. ([HD Annual Report 2023](https://hdcentre.org/wp-content/uploads/2024/07/Annual-report-2023_English-Final_Web.pdf), [ProPublica 2024](https://projects.propublica.org/nonprofits/organizations/525170039))
4. **\$1 million** of additional top-tier conflict-mitigation spending plausibly has about a **0.1%** chance of averting one representative serious conflict-year, with a practical range of **0.03–0.3%**. This is derived by starting from Clayton and Dorussen's estimate of **123 additional conflict-years** without conflict management between 1946 and 2013, then allocating only a small share of that system-level effect to top-tier philanthropy and dividing by the budgets of organizations like HD and ICG. ([See detailed justification](/assumption/effect-of-top-conflict-mitigation-spending))

## Details

### Cost per QALY

The cleanest way to model this cause area is:

$$
\text{Cost per QALY} = \dfrac{C}{p \times B}
$$

Where:

- $C$ = cost of one additional fully loaded year of high-quality conflict engagement
- $p$ = probability that this engagement averts one representative conflict-year
- $B$ = QALYs lost in that representative conflict-year

Using the central assumptions:

- $C$ = \$1,000,000
- $p$ = 0.001
- $B$ = 1,000,000 QALYs

So:

$$
\mathbb{E}[\text{QALYs saved}] = 0.001 \times 1{,}000{,}000 = 1{,}000
$$

$$
\text{Cost per QALY} = \dfrac{1{,}000{,}000}{1{,}000} = 1{,}000
$$

So the point estimate is **\$1,000/QALY**.

The rough burden multiplier in Assumption 1 deserves some explanation. Direct conflict DALYs are about **10 million**. If the **123.2 million** forcibly displaced lose only **0.03–0.05 QALYs** each, that already adds about **3.7–6.2 million QALYs**. That is just an illustrative check, not a claim that there is a precise published "displacement disability weight" in that range. We use it only to show that a very small average decrement across a huge displaced population already moves the total burden materially, and it is below GBD disability weights for moderate anxiety or moderate depression. Conflict-related mental illness among conflict-affected populations plausibly adds several million more, and excess mortality from disrupted healthcare, malnutrition, and disease can bridge the rest. So **30–40 million QALYs per year** is rough, but not an arbitrary multiplier.

Assumption 2 is also intentionally approximate. Conflict burden is extremely heterogeneous: a few wars account for a large share of total suffering, while many of the **61** active conflicts are much smaller. So the **1 million QALY** figure is best read as a representative serious conflict-year for the sort of cases that top mediation organizations are trying to influence, not as a literal equal-weight average across all conflicts.

The key input is $p$, the probability that an extra \$1 million of top-tier mediation / analysis / diplomacy work averts one serious conflict-year. The empirical literature supports the broad claim that third-party conflict management matters, but it does **not** tell us that one extra NGO dollar captures the average system-wide causal effect. A simple back-of-the-envelope is:

- Clayton and Dorussen imply roughly **123 / 67 ≈ 1.8** conflict-years averted per year by the whole conflict-management system.
- If the **top-tier philanthropic slice** of that system accounts for only about **2–8%** of the effect, that is about **0.04–0.15** conflict-years per year.
- If the organizations being modeled have combined annual budgets on the order of **\$70–80 million**, that implies roughly **0.05–0.2%** conflict-years averted per **\$1 million**.

That is why the central **0.1%** figure is heavily discounted for:

- attribution to one organization rather than the whole mediation ecosystem
- the fact that many peace processes depend on states or regional bodies
- selection effects in observational studies
- the possibility that extra money often improves coverage or readiness rather than directly causing a breakthrough

**Cross-check against existing conflict-prioritization BOTECs**

Coefficient / Open Philanthropy notes that HD's older budget was about **\$42 million per year** across **23 conflict zones**, or roughly **\$2 million per country-year**, and remarks that a marginal HD mediation-year would only need about a **0.52%** chance of ending a war one year sooner to clear a very high philanthropic-return bar. ([Coefficient Giving / Open Philanthropy 2022](https://coefficientgiving.org/research/civil-conflict-reduction/))

Our point estimate is more conservative than that BOTEC in two important ways:

- it assumes only a **0.1%** chance of averting one representative conflict-year, not **0.52%**
- it values outcomes mainly through health-weighted QALY losses rather than a broader welfare measure that also includes most income losses

So **\$1,000/QALY** is not an especially aggressive read of the existing cause-prioritization literature. If anything, it already embeds large discounts for attribution and for the possibility that a marginal donor mostly improves readiness and coverage rather than directly causing a peace breakthrough.

**Range**

A practical sensitivity range is:

- **Optimistic:** \$300k cost, 0.3% success probability, and 1.3M QALYs at stake -> about **\$80/QALY**
- **Pessimistic:** \$2M cost, 0.03% success probability, and 0.5M QALYs at stake -> about **\$13,000/QALY**

So the direct sensitivity range is **\$80–\$13,000/QALY**.

This should be read as a practical sensitivity range, not a full uncertainty interval. The true uncertainty is probably even wider.

One reason not to be more pessimistic than this is that the estimate already excludes most of conflict's macroeconomic, governance, and long-run institutional damage. If those were fully translated into welfare terms, the cause would look better than the headline QALY estimate shown here.

### Start Time

The 0-year start time reflects that the best conflict-mitigation work is often highly time-sensitive. Early warning, quiet diplomacy, local mediation, and emergency de-escalation can matter within days or weeks rather than after a long implementation lag.

### Duration

The 10-year duration reflects that preventing or shortening one serious conflict often produces benefits over multiple horizons:

- immediate reductions in killing, injury, and acute trauma
- several years of avoided displacement, healthcare disruption, and food insecurity
- some medium-run reduction in recurrence and retaliatory escalation

Ten years should not be read as "peace lasts forever". It is a compromise between a narrow one-conflict-year model and the reality that successful de-escalation usually prevents harms that would otherwise spill over for years.

## What Kinds of Charities Are We Modeling?

These estimates assume marginal donations go to **high-leverage conflict-mitigation organizations**, not to the average organization that works somewhere in the peacebuilding space.

Representative activities include:

- mediation, quiet diplomacy, shuttle talks, and support for ceasefires or political settlements
- conflict analysis, early warning, and briefing decision-makers who can still change outcomes
- building channels of communication among governments, armed groups, regional organizations, and local intermediaries
- narrowly targeted work that reduces escalation risk in major hot spots

We are **not** modeling:

- military support to one side of a conflict
- generic humanitarian relief delivered after violence has already occurred
- broad community programming with weak evidence of changing macro conflict outcomes
- purely academic conflict research with no plausible route to near-term action

## Key Uncertainties

1. **Attribution is extremely difficult.** Peace processes are almost always overdetermined. Even when a mediator mattered a lot, how much credit should go to one NGO rather than to local actors, governments, or the UN?

2. **The literature is mostly observational.** The best studies strongly suggest that mediation and peacekeeping matter, but selection effects are hard to eliminate entirely.

3. **Marginal dollars may be worse or better than average dollars.** The cost input uses organization-level averages, but the next dollar may go either to a highly leveraged opening or to a lower-quality project at the edge of the portfolio.

4. **Room for more funding is uncertain.** HD's own fundraising language suggests some additional absorbable opportunities, but that does not guarantee that every extra million dollars can be spent at average quality.

5. **Indirect harms are still hard to quantify.** Conflict's effects on infant mortality, education, income, state capacity, and long-term mental health are clearly very large, but turning them into one clean QALY figure is difficult.

6. **Category boundaries are fuzzy.** Some work on interstate crises, food-security spillovers, or nuclear flashpoints might arguably belong partly in other categories rather than here.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- The key judgment call is Assumption 4, the **0.1%** probability that \$1 million of top-tier spending averts one representative conflict-year.
- This remains a health-weighted estimate. A more total-welfare estimate that fully included economic and institutional harms of war would likely come out lower than \$1,000/QALY.
- If future editors revisit this, the most decision-relevant questions are whether the modeled philanthropic slice deserves more than **2–8%** of system-level effect and whether **30–40 million QALYs/year** still understates conflict's total health burden.
