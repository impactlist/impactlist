---
id: decision-making
name: 'Improving Decision Making'
effects:
  - effectId: standard
    startTime: 2
    windowLength: 10
    costPerQALY: 4_000
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from donations to charities that improve how high-stakes institutions form beliefs and choose actions: probabilistic forecasting, prediction markets, evidence synthesis, collective intelligence, structured analytic techniques such as premortems and red-team reviews, decision audits, and related tools for governments and other consequential organizations.

This is a hits-based and highly upstream category. The strongest evidence is that some methods here improve prediction quality. The weaker and more important question is how often that actually changes important decisions. So the cleanest model is not a single smooth formula, but a scenario-weighted expected-value model.

## Point Estimates

- **Cost per QALY:** \$4,000 (\$1,000–\$150,000)
- **Start time:** 2 years
- **Duration:** 10 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. Forecasting tournaments and related methods can materially improve predictive accuracy relative to ordinary expert judgment. In the IARPA forecasting program, training, teaming, and aggregation substantially improved performance, and in corporate settings prediction markets beat expert forecasts by up to 25% lower mean-squared error. ([Mellers et al. 2014](https://pubmed.ncbi.nlm.nih.gov/24659192/), [Cowgill & Zitzewitz 2015](https://academic.oup.com/restud/article/82/4/1309/2607345))
2. Better forecast scores do not automatically translate into better decisions. Evidence summaries often make research easier to understand, but systematic reviews find unclear or limited evidence that summaries alone increase policymakers' use of evidence, and organizational change typically requires dedicated roles, processes, and leadership support. ([Petkovic et al. 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC8428003/), [Clark et al. 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC10983660/))
3. Forecasting and evidence tools can sometimes affect real decisions when they are embedded in an action framework. CNAS documents a State Department case where Good Judgment forecasts informed Colombia counternarcotics planning, and the anticipatory-action literature finds mainly positive household-level effects from acting on forecasts before shocks. ([Cochran & Tozzi 2017](https://www.cnas.org/publications/reports/getting-it-righter-faster), [ODI 2020](https://odi.org/en/publications/the-evidence-base-on-anticipatory-action/), [WFP 2025](https://www.wfp.org/publications/2025-saving-lives-time-and-money-evidence-anticipatory-action))
4. Mature evidence institutions can influence extremely large stakes. The UK What Works Network covers policy areas accounting for more than £250 billion of public spending, and GAO reported \$62.7 billion of financial benefits in fiscal year 2025. ([What Works Network](https://www.gov.uk/guidance/what-works-network), [GAO 2026 release on FY 2025](https://www.gao.gov/press-release/gao-reports-62.7-billion-financial-benefits-fiscal-year-2025))
5. A strong charity in this space can often operate on low-single-digit millions of dollars per year. Collective Intelligence Project reported about \$1.9 million of 2024 revenue, so a **total philanthropic investment of \$5 million over roughly 3–5 years** is a reasonable anchor for one serious organization or a comparable philanthropic push. ([ProPublica](https://projects.propublica.org/nonprofits/organizations/920327339))
6. **Limited-impact scenario:** 50% probability. The work improves some discussion, prioritization, or smaller decisions, creating about \$10 million of total welfare-equivalent value over its lifetime. With a 10-year duration, this is about \$1 million per year, roughly what one would get from improving about \$1 billion of annual decisions by 0.1%.
7. **Moderate-impact scenario:** 40% probability. The work materially shapes some medium-to-large decisions or one semi-durable process, creating about \$100 million of total welfare-equivalent value. With a 10-year duration, this is about \$10 million per year, roughly what one would get from improving about \$10 billion of annual decisions by 0.1% or about \$1 billion by 1%.
8. **Major-win scenario:** 10% probability. The work helps create or redirect a genuinely important institutional process or policy trajectory, creating about \$800 million of total welfare-equivalent value. With a 10-year duration, this is about \$80 million per year, roughly what one would get from improving about \$80 billion of annual decisions by 0.1% or about \$8 billion by 1%.
9. A money-metric value of a QALY in high-income policy settings is approximately \$100,000, near the lower end of ICER's current \$100,000–\$150,000 benchmark range. ([ICER 2023 Value Assessment Framework](https://icer.org/wp-content/uploads/2023/10/ICER_2023_2026_VAF_For-Publication_110425.pdf))
10. It takes roughly 2 years for these capabilities to mature and enter real decision cycles.
11. Benefits persist for around 10 years on average: many individual outputs fade faster, but embedded decision routines can last much longer. E.O. 12866 has structured U.S. regulatory review since 1993, the What Works Network has operated since 2013, and Good Judgment's forecasting infrastructure traces to the IARPA tournament launched in 2011. ([GW Regulatory Studies Center](https://regulatorystudies.columbian.gwu.edu/looking-back-30-years-executive-order-12866-0), [GOV.UK](https://www.gov.uk/government/publications/the-what-works-network-strategy), [Good Judgment](https://goodjudgment.com/about/))

## Details

### Cost per QALY

Because this category is hits-based, the most legible model is:

$$\text{Expected welfare value} = p_L \cdot V_L + p_M \cdot V_M + p_H \cdot V_H$$

$$\text{Expected QALYs} = \dfrac{\text{Expected welfare value}}{v}$$

$$\text{Cost per QALY} = \dfrac{C}{\text{Expected QALYs}}$$

Where:

- $C$ = philanthropic cost
- $p_L, p_M, p_H$ = probabilities of the limited-impact, moderate-impact, and major-win scenarios
- $V_L, V_M, V_H$ = total welfare-equivalent value created in each scenario
- $v$ = money-metric value per QALY

Using the central assumptions above:

- $C$ = \$5,000,000
- $p_L = 0.5$ and $V_L$ = \$10,000,000
- $p_M = 0.4$ and $V_M$ = \$100,000,000
- $p_H = 0.1$ and $V_H$ = \$800,000,000
- $v$ = \$100,000

So:

$$\text{Expected welfare value} = 0.5 \times 10{,}000{,}000 + 0.4 \times 100{,}000{,}000 + 0.1 \times 800{,}000{,}000 = 125{,}000{,}000$$

$$\text{Expected QALYs} = \dfrac{125{,}000{,}000}{100{,}000} = 1{,}250$$

$$\text{Cost per QALY} = \dfrac{5{,}000{,}000}{1{,}250} = 4{,}000$$

So the point estimate is **\$4,000/QALY**.

### Why this model

The old temptation in this cause area is to jump directly from "forecasting improves Brier scores a lot" to "welfare improves a lot." That bridge is too weak. The evidence base is strong on the first step and much weaker on the second.

A scenario model fits the actual structure of the evidence better: many efforts in this area probably improve conversations more than decisions, some matter because they are paired with a decision framework or live policy process, and a minority may land very large institutional wins. Petkovic et al. and Clark et al. support the view that better evidence products alone are often not enough, while the CNAS case study and anticipatory-action literature show that forecast-linked action can sometimes matter a great deal.

### Anchoring the scenario values

The central estimate says that spending \$5 million on a strong organization has an expected lifetime value of \$125 million. That is a roughly **25x welfare-equivalent return**, which is substantial but not absurd for an upstream field.

Using the 10-year duration assumption, the three scenario values correspond to approximate annual welfare-equivalent gains of \$1 million, \$10 million, and \$80 million. A dimensional way to think about them is:

- **Limited impact:** about \$1 million per year, which is roughly equivalent to improving \$1 billion of annual decisions by 0.1%, or \$100 million by 1%.
- **Moderate impact:** about \$10 million per year, which is roughly equivalent to improving \$10 billion of annual decisions by 0.1%, or \$1 billion by 1%.
- **Major win:** about \$80 million per year, which is roughly equivalent to improving \$80 billion of annual decisions by 0.1%, or \$8 billion by 1%.

These are large numbers, but still small relative to mature public evidence institutions. The **major-win** case is only about **0.13%** of GAO's FY 2025 annual financial benefits, and tiny relative to the more than **£250 billion** public-spending footprint covered by the What Works Network. So the major-win case is not saying that a small charity becomes GAO. It is saying that a rare breakout success captures a very small fraction of the value that mature evidence institutions can influence.

### Range

The practical sensitivity range is wide because this category is very uncertainty-heavy.

- **Pessimistic:** \$8 million cost, 80% / 18% / 2% scenario weights, and scenario values of \$1M / \$15M / \$100M gives about **\$150,000/QALY**.
- **Optimistic:** \$3 million cost, 40% / 40% / 20% scenario weights, and scenario values of \$20M / \$150M / \$1.2B gives about **\$1,000/QALY**.

So the practical range is **\$1,000-\$150,000/QALY**.

This is better read as a practical sensitivity range than as a full uncertainty interval. The true distribution is probably even fatter-tailed.

### Start Time

The 2-year start time reflects the fact that these interventions can matter faster than legislation-scale reform but slower than direct service delivery. A charity can publish useful work sooner than that, but it usually takes at least one or two funding, policy, or strategy cycles before the work predictably affects consequential decisions.

### Duration

The 10-year duration is an expected-value compromise. Some outputs decay quickly. But embedded decision routines can persist for much longer: E.O. 12866 has structured U.S. regulatory review since 1993, the What Works Network since 2013, and Good Judgment's forecasting infrastructure since the IARPA tournament launched in 2011. A 10-year window therefore treats this category as more durable than one-off reports, but much less durable than the strongest long-lived institutions. ([GW Regulatory Studies Center](https://regulatorystudies.columbian.gwu.edu/looking-back-30-years-executive-order-12866-0), [GOV.UK](https://www.gov.uk/government/publications/the-what-works-network-strategy), [Good Judgment](https://goodjudgment.com/about/))

## What Kinds of Charities Are We Modeling?

These estimates are aimed at organizations like:

- forecasting and probabilistic-analysis organizations that improve beliefs about contested or high-stakes questions
- organizations that translate research into decision-ready guidance or structured evaluations
- institutions that improve collective input or strategic reasoning for governments and other major decision-makers

We are **not** modeling generic journalism, generic civic engagement, or direct service delivery here.

## Key Uncertainties

1. **How often current charities actually change decisions rather than only improving discussion.** This is the central crux.
2. **How fat-tailed the distribution is.** A few rare wins may dominate the category's expected value.
3. **How much weight to place on analogies to mature institutions like GAO or the What Works Network.** They show the scale of the stakes, but they are not clean charity analogues.
4. **How well current recipients fit one category.** Rootclaim, Collective Intelligence Project, and Modeling Cooperation are not doing the same thing, so any category-wide estimate is coarse.
5. **How much of the value is QALY-like rather than purely financial, strategic, or epistemic.**

{{CONTRIBUTION_NOTE}}

# Internal Notes

- This version intentionally uses a scenario model because a single "all-in percentage improvement" parameter obscures the actual cruxes.
- If future editors can find stronger evidence on how often forecasting/evidence products change concrete decisions, that would be the single biggest lever for improving this estimate.
- If the category accumulates more recipients, it may become worth splitting into narrower cause areas.
