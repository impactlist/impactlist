---
id: institutions
name: 'Improving Institutions'
effects:
  - effectId: standard
    startTime: 3
    windowLength: 25
    costPerQALY: 3_000
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from **nonpartisan efforts to improve the rules, capacity, and administrative competence of important institutions**, especially governments and closely related public-interest institutions in high-income settings. Representative pathways include land-use reform, benefits and tax administration, election administration, legal and regulatory reform, civic technology, and other institutional-design work that makes large systems work better for many people at once.

This is an upstream and somewhat hits-based category. The strongest cases here are not vague "institution building" in the abstract, but interventions that either remove a major bottleneck or make a large public system materially easier to use. The weakest cases are generic thought leadership, purely ideological institution-building, or work with no clear route to concrete institutional change.

## Point Estimates

- **Cost per QALY:** \$3,000 (\$500–\$60,000)
- **Start time:** 3 years
- **Duration:** 25 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. Some institutional bottlenecks clearly sit on very large welfare stakes. Housing-supply constraints in productive places push demand into prices rather than additional housing and population, and the macro stakes of relaxing such constraints are large even though the exact magnitude is disputed. ([Baum-Snow 2023](https://www.aeaweb.org/articles?id=10.1257/jep.37.2.53), [Hsieh & Moretti 2019](https://www.aeaweb.org/articles?id=10.1257%2Fmac.20170388), [Greaney comment](https://www.aeaweb.org/articles?id=10.1257%2Fmac.20230141))
2. Institutional reforms can measurably change real outcomes, but the evidence is mixed and context-dependent. Auckland's large upzoning reform increased housing construction, while evidence on Minneapolis 2040 remains harder to disentangle from simultaneous demand shocks and later policy changes. ([Auckland / Greenaway-McGrevy & Phillips 2023](https://economics.yale.edu/research/cfp-1863-impact-upzoning-housing-construction-auckland), [Minneapolis Fed 2025](https://www.minneapolisfed.org/article/2025/unpacking-supply-and-demand-in-rent-trends-since-the-minneapolis-2040-plan))
3. Administrative and civic-tech improvements can create large household and agency benefits. Code for America reports that its tax-benefits tools have helped 726,000 people file returns and claim more than \$1.4 billion since 2020, and that a 2025 Texas Medicaid-renewal intervention should save at least 220,000 caseworker hours per year while helping more than 500,000 clients retain coverage. ([Code for America tax benefits](https://codeforamerica.org/programs/tax-benefits/), [Code for America 2025 impact report](https://codeforamerica.org/impact/2025/))
4. Public-sector administrative improvements can also be valuable at national scale. Congressional Research Service reports that the 2024 IRS Direct File pilot saved users an estimated \$5.6 million in tax-preparation fees on more than 140,800 accepted returns, and Treasury's FIT team estimates \$1.4-\$3.0 billion in government-wide cost-saving opportunities from digital end-to-end process transformation. ([CRS 2024 Direct File overview](https://www.congress.gov/crs-product/IF12654), [U.S. Treasury FIT 2026](https://fiscal.treasury.gov/fit/digital-for-federal-government.html))
5. Strong organizations in this space can absorb and productively use low-seven- to low-eight-figure budgets. Code for America reported roughly \$29.9 million of revenue in 2024, CEIR roughly \$9.4 million, and Coefficient Giving's Abundance & Growth fund reports **110+ grants made** and **\$120 million committed** across housing, innovation policy, and state-capacity-adjacent work. So a **\$10 million philanthropic push over roughly 3-5 years** is a reasonable central unit for one serious organization or campaign, and the central model assumes roughly constant returns to scale within that range rather than sharp nonlinearities. ([Code for America 2024 Form 990 via ProPublica](https://projects.propublica.org/nonprofits/organizations/271067272), [CEIR 2024 Form 990 via ProPublica](https://projects.propublica.org/nonprofits/organizations/813815137), [Coefficient Giving](https://coefficientgiving.org/funds/abundance-and-growth/))
6. A money-metric value of a QALY in high-income policy settings is approximately \$100,000, near the lower end of ICER's current \$100,000-\$150,000 benchmark range. ([ICER 2023 Value Assessment Framework](https://icer.org/wp-content/uploads/2023/10/ICER_2023_2026_VAF_For-Publication_110425.pdf))
7. **Limited-impact scenario:** 50% probability. The work improves one public process, legal rule, or local institution, generating roughly **\$30 million** of total welfare-equivalent value over its lifetime. This is the scale of a solid but bounded administrative or policy win.
8. **Moderate-impact scenario:** 40% probability. The work materially improves a state-level or multi-jurisdiction institution, generating roughly **\$300 million** of total welfare-equivalent value. This is the scale of a durable reform that materially changes how many people interact with a major system.
9. **Major-win scenario:** 10% probability. The work helps produce a genuinely important and durable institutional reform, generating roughly **\$2 billion** of total welfare-equivalent value. This is large, but still modest relative to the stakes of successful housing, tax, benefits, or state-capacity reforms. The 50% / 40% / 10% split reflects a prior that most serious efforts create some value but remain bounded, a large minority achieve a meaningful durable win, and only around one in ten lands a genuinely breakout reform.
10. It takes roughly 3 years for these efforts to translate from funding into enacted reforms, deployed systems, or stable administrative changes.
11. Benefits persist for roughly 25 years on average: many software, workflow, and coalition wins fade within 5-10 years, but the category's strongest legal, regulatory, and governance reforms often persist for decades, so the expected duration should be materially longer than a pure civic-tech horizon.

## Details

### Cost per QALY

Because this category spans several intervention types and has a fat-tailed return distribution, the cleanest model is a scenario-weighted expected-value calculation rather than a single-intervention formula:

$$\text{Expected welfare value} = p_L \cdot V_L + p_M \cdot V_M + p_H \cdot V_H$$

$$\text{Expected QALYs} = \dfrac{\text{Expected welfare value}}{v}$$

$$\text{Cost per QALY} = \dfrac{C}{\text{Expected QALYs}}$$

Where:

- $C$ = philanthropic cost
- $p_L, p_M, p_H$ = probabilities of the limited-impact, moderate-impact, and major-win scenarios
- $V_L, V_M, V_H$ = total welfare-equivalent value created in each scenario
- $v$ = money-metric value per QALY

By **welfare-equivalent value**, we mean the total improvement in outcomes, whether health, income, time, administrative burden, or other quality-of-life effects, expressed in dollar terms so it can be converted into QALYs using the \$100,000-per-QALY assumption.

Using the central assumptions above:

- $C$ = \$10,000,000
- $p_L = 0.50$ and $V_L$ = \$30,000,000
- $p_M = 0.40$ and $V_M$ = \$300,000,000
- $p_H = 0.10$ and $V_H$ = \$2,000,000,000
- $v$ = \$100,000

So:

$$\text{Expected welfare value} = 0.50 \times 30{,}000{,}000 + 0.40 \times 300{,}000{,}000 + 0.10 \times 2{,}000{,}000{,}000 = 335{,}000{,}000$$

$$\text{Expected QALYs} = \dfrac{335{,}000{,}000}{100{,}000} = 3{,}350$$

$$\text{Cost per QALY} = \dfrac{10{,}000{,}000}{3{,}350} \approx 2{,}985$$

So the point estimate is **\$3,000/QALY**.

### Anchoring the scenario values

The three scenario values are meant to be read as follows:

- **Limited impact: \$30 million.** This is not a moonshot. It is the scale of a meaningful but bounded win: improving one public workflow, reducing administrative burden for a large user group, or getting one local legal or procedural change over the line. Code for America's realized tax-benefits work and Direct File's early fee savings make clear that tens of millions of value can be created without needing a once-in-a-generation reform.
- **Moderate impact: \$300 million.** This is the scale of a durable state-level or multi-jurisdiction institutional improvement. Code for America's recent Medicaid-renewal and integrated-benefits work suggests how quickly gains can accumulate once an intervention meaningfully changes a large system used by hundreds of thousands of people.
- **Major win: \$2 billion.** This is large, but still small relative to the stakes of major institutional bottlenecks. Treasury's own digital-transformation work points to \$1.4-\$3.0 billion in government-wide savings opportunities, and the housing literature makes clear that land-use rules can affect welfare on a much larger scale than that even if one takes a cautious view about the most aggressive macro estimates.

The central split is still hits-based: the **major-win** scenario contributes \$200 million of the \$335 million expected welfare value, or about **60%** of the total. That is a smaller concentration than before, but it remains one of the main reasons the estimate is uncertain.

### Range

The practical sensitivity range is wide because this category is both heterogeneous and fat-tailed.

- **Pessimistic:** \$15 million cost, 75% / 20% / 5% scenario weights, and scenario values of \$5M / \$50M / \$250M gives about **\$57,000/QALY**.
- **Optimistic:** \$6 million cost, 35% / 40% / 25% scenario weights, and scenario values of \$50M / \$400M / \$4B gives about **\$500/QALY**.

So the practical range is **\$500-\$60,000/QALY**.

The single most important parameter is the **major-win probability**. Holding the scenario values and \$10 million cost fixed, moving the major-win probability from **5%** to **25%** changes the estimate from roughly **\$4,200/QALY** to roughly **\$1,600/QALY**. The wider \$500-\$60,000 range comes from varying costs and scenario values as well, not just that one probability.

### Start Time

The 3-year start time reflects that these interventions usually matter faster than deep scientific or cultural change, but slower than direct service. A good organization can publish work or ship tools sooner than that, but durable institutional impact usually requires some combination of coalition building, legal design, procurement, implementation, and adaptation inside the target institution.

### Duration

The 25-year duration is a compromise across very different pathways. Some institutional wins, especially software, workflow, and administrative-process improvements, may decay within 5-10 years as systems change. But the category's strongest legal, regulatory, and governance reforms can persist for decades. Twenty-five years is therefore an expected-value middle ground between shorter-lived administrative wins and genuinely durable institutional reforms.

## What Kinds of Charities Are We Modeling?

These estimates are aimed at organizations like:

- housing-policy and abundance organizations that remove major legal bottlenecks to building
- civic-tech and public-service organizations that make tax, benefits, permitting, or related systems easier to use
- election-administration, legal, or institutional-design organizations that make important public systems more competent, trustworthy, or workable

This is also roughly the ecosystem historically funded through Open Philanthropy's housing-policy-reform work and now continued within Coefficient Giving's Abundance & Growth fund. ([Coefficient Giving](https://coefficientgiving.org/funds/abundance-and-growth/))

We are **not** modeling partisan campaign spending, generic journalism, pure forecasting and evidence-synthesis work, or direct service programs whose main effect is better modeled in another category.

## Key Uncertainties

1. **How much of the category should be driven by housing-style reforms versus administrative service delivery.** Housing may dominate the upside, but many actual charities in the category are doing something else.

2. **How often philanthropy is genuinely causal.** In institutional reform, many wins are coalition wins. The charity may be essential, somewhat helpful, or mostly along for the ride.

3. **How fat-tailed the distribution really is.** If major wins are rarer than 10%, the estimate worsens quickly. If they are more common, the category becomes much stronger.

4. **How durable reforms are in practice.** Administrative improvements can be undone or neglected; legal reforms can be reversed; but some changes become embedded for a long time.

5. **How to convert institutional gains into QALY-like welfare.** Some benefits are clearly health-related, others mostly save time or money, and others improve trust, competence, or optionality in ways that are valuable but hard to quantify cleanly.

6. **Category heterogeneity.** "Improving institutions" may ultimately be too broad a bucket. If the site adds more recipients here, it may become worth splitting the category into narrower clusters.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- This version is intentionally broader than a housing-only model because the current category mapping includes civic-tech, election-administration, legal, and other institutional recipients that do not fit a single land-use formula.
- The duration is intentionally longer than a pure civic-tech baseline because much of the category's upside comes from durable legal and governance changes rather than software alone.
- If future editors want to improve this page further, the best next step is probably to split `institutions` into narrower subcategories such as `abundance / state capacity`, `civic tech / benefits delivery`, and `institutional legal reform`.
