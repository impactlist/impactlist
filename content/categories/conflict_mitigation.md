---
id: conflict-mitigation
name: 'Conflict Mitigation'
effects:
  - effectId: standard
    startTime: 0
    windowLength: 10
    costPerQALY: 333
---

# Justification of cost per life

_The following analysis was done on April 14th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures human-welfare gains from donations to **top conflict-mitigation organizations** that reduce the probability, duration, or intensity of organized armed conflict through mediation, quiet diplomacy, conflict analysis, early warning, and support for political settlements. Representative organizations include the Centre for Humanitarian Dialogue (HD) and the International Crisis Group (ICG).

This estimate is mainly about preventing or shortening **serious civil-conflict episodes**. It is **not** meant to represent the average peacebuilding NGO, military aid, or generic humanitarian relief. The burden model is intended to be **all-things-considered**: it includes direct health losses plus displacement, healthcare disruption, food insecurity, lost income, governance deterioration, and long-run institutional damage after converting those harms into **QALY-equivalent** terms.

## Point Estimates

- **Cost per QALY:** \$333 (\$20–\$6,700)
- **Start time:** 0 years
- **Duration:** 10 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. The direct health burden of conflict and terrorism is on the order of **10 million DALYs per year** globally, and the total health burden is plausibly closer to **30–40 million QALYs per year** once indirect deaths, displacement, healthcare disruption, food insecurity, and mental illness are included. As an illustrative sanity check, **123.2 million** forcibly displaced people losing only **0.03–0.05 QALYs each** would already imply roughly **3.7–6.2 million QALYs**. That decrement is deliberately modest for a heterogeneous population and is below GBD disability weights for moderate anxiety or moderate depression. ([Coefficient Giving / Open Philanthropy 2022](https://coefficientgiving.org/research/civil-conflict-reduction/), [UNHCR Global Trends 2024](https://www.unhcr.org/global-trends-report-2024), [The Lancet 2019](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736%2819%2930934-1/fulltext), [WHO methods and data sources for DALYs 2000-2019](https://www.who.int/docs/default-source/gho-documents/global-health-estimates/ghe2019_daly-methods.pdf?sfvrsn=31b250097))
2. The world is currently experiencing an unusually high level of organized violence: **2024 had 61 active state-based conflicts across 36 countries**, the highest number since 1946. Mapping the **30–40 million** annual health burden onto roughly **30–60 serious conflict settings** implies about **0.5–1.3 million health QALYs** lost per representative serious conflict-year. We use **1 million health QALYs** as the central value. ([PRIO / UCDP 2025](https://www.prio.org/publications/14453))
3. Once lost income, governance deterioration, and long-run institutional damage are also converted into QALY-equivalent terms, a representative serious conflict-year plausibly destroys about **3 million QALY-equivalents** in total, with a practical range of **1–5 million**. ([See detailed justification](/assumption/all-things-considered-conflict-year-burden))
4. Top mediation and conflict-analysis organizations operate with budgets in the **tens of millions of dollars**. HD reported **50 million Swiss francs (about \$62.5 million)** in contribution income in 2023 and **70+ peacemaking projects**; ICG reported **\$23.5 million** in revenue in 2024. This suggests average project-year costs somewhat below **\$1 million**. A round **\$1 million** central cost is a reasonable best guess for one additional fully loaded high-quality engagement-year once somewhat weaker-than-average marginal opportunities are taken into account, with a plausible range of **\$0.3–2 million**. ([HD Annual Report 2023](https://hdcentre.org/wp-content/uploads/2024/07/Annual-report-2023_English-Final_Web.pdf), [ProPublica 2024](https://projects.propublica.org/nonprofits/organizations/525170039))
5. **\$1 million** of additional top-tier conflict-mitigation spending plausibly has about a **0.1%** chance of averting one representative serious conflict-year, with a practical range of **0.03–0.3%**. This is derived by starting from Clayton and Dorussen's estimate of **123 additional conflict-years** without conflict management between 1946 and 2013, then allocating only a small share of that system-level effect to top-tier philanthropy and dividing by the budgets of organizations like HD and ICG. ([See detailed justification](/assumption/effect-of-top-conflict-mitigation-spending))

## Details

### Cost per QALY

The cleanest way to model this cause area is:

$$
\text{Cost per QALY} = \dfrac{C}{p \times B}
$$

Where:

- $C$ = cost of one additional fully loaded year of high-quality conflict engagement
- $p$ = probability that this engagement averts one representative conflict-year
- $B$ = all-things-considered QALY-equivalent loss in that representative conflict-year

Using the central assumptions:

- $C$ = \$1,000,000
- $p$ = 0.001
- $B$ = 3,000,000 QALY-equivalents

So:

$$
\mathbb{E}[\text{QALYs saved}] = 0.001 \times 3{,}000{,}000 = 3{,}000
$$

$$
\text{Cost per QALY} = \dfrac{1{,}000{,}000}{3{,}000} \approx 333
$$

So the point estimate is **\$333/QALY**.

Assumptions 1-3 turn a very heterogeneous global burden into one representative serious conflict-year. The health-only component is about **1 million QALYs**. The extra step is to treat lost income, governance deterioration, and institutional damage as real welfare losses that should be expressed in the same unit, rather than mentioned and then set to zero. The dedicated assumption page uses a **200%** broader-welfare uplift over the health component in the central case, which gives **3 million QALY-equivalents** in total, with a practical range of **1–5 million**.

Coefficient / Open Philanthropy's civil-conflict writeup says an average civil war's total value is about **20% DALYs** and **80% lost income**, which would imply a much larger non-health share if taken literally. ([Coefficient Giving / Open Philanthropy 2022](https://coefficientgiving.org/research/civil-conflict-reduction/)) The central estimate here keeps the representative-conflict-year model materially below that **4x** anchor, but still treats non-health harms as larger than the health component in light of the cited evidence on income losses and institutional damage.

The burden input is also intentionally approximate. Conflict burden is extremely heterogeneous: a few wars account for a large share of total suffering, while many of the **61** active conflicts are much smaller. So the **3 million QALY-equivalent** figure is best read as a representative serious conflict-year for the sort of cases that top mediation organizations are trying to influence, not as a literal equal-weight average across all conflicts.

The key input is $p$, the probability that an extra \$1 million of top-tier mediation / analysis / diplomacy work averts one serious conflict-year. The empirical literature supports the broad claim that third-party conflict management matters, but it does **not** tell us that one extra NGO dollar captures the average system-wide causal effect. A simple back-of-the-envelope is:

- Clayton and Dorussen imply roughly **123 / 67 ≈ 1.8** conflict-years averted per year by the whole conflict-management system.
- If the **top-tier philanthropic slice** of that system accounts for only about **2–8%** of the effect, that is about **0.04–0.15** conflict-years per year.
- If the organizations being modeled have combined annual budgets on the order of **\$80–90 million**, that implies roughly **0.04–0.18%** conflict-years averted per **\$1 million**.

The **2–8%** top-tier philanthropic share assumption already embeds heavy attribution discounts for:

- attribution to one organization rather than the whole mediation ecosystem
- the fact that many peace processes depend on states or regional bodies
- selection effects in observational studies
- the possibility that extra money often improves coverage or readiness rather than directly causing a breakthrough

**Cross-check against existing conflict-prioritization BOTECs**

Coefficient / Open Philanthropy notes that HD's older budget was about **\$42 million per year** across **23 conflict zones**, or roughly **\$2 million per country-year**, and remarks that a marginal HD mediation-year would only need about a **0.52%** chance of ending a war one year sooner to clear a very high philanthropic-return bar. ([Coefficient Giving / Open Philanthropy 2022](https://coefficientgiving.org/research/civil-conflict-reduction/))

That **0.52%** figure is a break-even condition in a different BOTEC, not a central tractability estimate. So it should be read only as a rough scale check, not as the main basis for the estimate here.

The direct arithmetic on this page remains the main basis for the central tractability estimate: the system-level evidence, a **2–8%** philanthropic share, and **\$80–90 million** of top-tier budgets imply about **0.04–0.18%** per **\$1 million**, which supports a best guess of **0.1%**.

Combining that tractability estimate with a **3 million QALY-equivalent** representative conflict-year gives a central estimate of about **\$333/QALY**.

**Range**

A practical sensitivity range is:

- **Optimistic:** \$300k cost, 0.3% success probability, and 5M QALY-equivalents at stake -> **\$20/QALY**
- **Pessimistic:** \$2M cost, 0.03% success probability, and 1M QALY-equivalents at stake -> about **\$6,700/QALY**

So the direct sensitivity range is **\$20–\$6,700/QALY**.

This should be read as a practical sensitivity range, not a full uncertainty interval. The true uncertainty is probably even wider.

The pessimistic end is already quite demanding. It combines high cost, low tractability, and a burden model that strips out the broader-welfare uplift and falls back to the health-only component.

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

5. **The all-things-considered burden is still hard to quantify.** Conflict's effects on income, education, state capacity, institutions, and long-term mental health are clearly very large, but converting them into one QALY-equivalent figure is still rough.

6. **Category boundaries are fuzzy.** Some work on interstate crises, food-security spillovers, or nuclear flashpoints might arguably belong partly in other categories rather than here.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- The key judgment call is Assumption 5, the **0.1%** probability that \$1 million of top-tier spending averts one representative conflict-year.
- The next most important judgment call is Assumption 3: whether the broader-welfare uplift over the health component should be closer to **0%**, **200%**, or **400%**.
- If future editors revisit this, the most decision-relevant questions are whether the modeled philanthropic slice deserves more than **2–8%** of system-level effect and whether the representative conflict-year should be materially above or below **3 million QALY-equivalents**.
