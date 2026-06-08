---
id: environmental
name: 'General Environmental'
effects:
  - effectId: standard
    startTime: 2
    windowLength: 40
    costPerQALY: 50
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 and Claude Opus 4.6, with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from donations to the best current **non-climate environmental** charities, especially those that reduce toxic exposure or air pollution: lead-source elimination, toxic-site remediation, and clean-air policy/data/advocacy. The current quantitative anchors are pollution-focused. The estimate does not separately model biodiversity, ecosystem existence value, or scenic/amenity value, but that is a scope and evidence decision, not because those benefits are outside QALY-equivalent welfare.

## Point Estimates

- **Cost per QALY:** \$50 (\$15–\$30,000)
- **Start time:** 2 years
- **Duration:** 40 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. For the purpose of this page, one DALY averted is treated as roughly one QALY gained, since both metrics are trying to capture healthy life-years and the source estimates here are not precise enough to justify a finer conversion.
2. Lead exposure caused more than 1.5 million deaths and more than 33 million DALYs globally in 2021, and only 48% of countries had legally binding controls on lead paint as of January 2024. ([WHO 2024](https://www.who.int/news-room/fact-sheets/detail/lead-poisoning-and-health))
3. LEEP's 2024 multi-country model estimates **\$4.49 per DALY-equivalent averted** across 13 paint programs, with total modeled costs around **\$4 million** and about **900,000 DALY-equivalents**. Only 145,000 of those DALY-equivalents are direct health DALYs; about 756,000 are lifetime-income equivalents. We treat both as QALY-equivalent welfare for this page, while assigning more model uncertainty to the income bridge than to the direct-health component. ([LEEP 2024](https://leadelimination.org/how-cost-effective-are-leeps-paint-programs/))
4. LEEP says its model is mostly predictive, includes costs but not the potential impact of some non-paint work, and does not account for the counterfactual impact of alternative uses of funding. We therefore apply roughly a **10x skepticism/generalization penalty** when using LEEP as a cause-area anchor, implying a point estimate of about **\$50/QALY** for the cause area as a whole after accounting for category breadth, model uncertainty, and the extra uncertainty in the lifetime-income conversion. See the Details section for the reasoning behind this penalty. ([LEEP 2024](https://leadelimination.org/how-cost-effective-are-leeps-paint-programs/))
5. In a case study of one severely contaminated site in the Dominican Republic, remediating lead-contaminated soil was estimated at roughly \$392-\$3,238 per DALY averted. ([Ericson et al. 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC7007121/))
6. Ambient air pollution kills roughly 5.7 million people globally each year, and the World Bank argues that halving high exposure by 2040 is feasible and affordable. ([World Bank 2023](https://www.worldbank.org/en/publication/accelerating-access-to-clean-air-for-a-livable-planet))
7. Clean-air philanthropy remains highly neglected: outdoor air quality received less than 0.1% of philanthropic foundation funding from 2015 to 2022. ([Clean Air Fund 2024](https://www.cleanairfund.org/resource/philanthropic-funding/))
8. Parks, trails, and related greenspace infrastructure have much thinner human-health cost-effectiveness evidence: a recent systematic review found only one cost-effectiveness study, at about \$23,254 per DALY averted, and concluded the evidence base was insufficient to determine overall cost-effectiveness. ([Jacob et al. 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11102847/))

## Details

### Cost per QALY

The cleanest quantitative anchor in this cause area is **lead elimination**. LEEP's headline **\$4.49 per DALY-equivalent** combines direct health gains with monetized lifetime-income gains converted into common welfare units. Those income gains should not be treated as outside the QALY framework. They are real welfare gains that can be expressed in QALY-equivalent terms.

As a modeling convention, this page treats **DALYs averted** and **QALYs gained** as roughly interchangeable. That is not because the metrics are identical in theory, but because both are healthy-life-year measures and the uncertainty in the intervention evidence is much larger than the difference between the two metrics for our purposes.

Using LEEP's reported total modeled cost and all modeled DALY-equivalents:

$$
\text{All-things-considered cost per DALY-equivalent} = \dfrac{\$4{,}000{,}000}{900{,}000} \approx \$4.4
$$

So the best current lead-paint-elimination opportunities appear to be roughly **\$4-5 per QALY-equivalent** in LEEP's own model.

That is extremely strong, but it would be too optimistic to use directly for the whole cause area. LEEP itself emphasizes that the model is **mostly predictive**, narrow to its 13 paint programs, and does not account for the counterfactual impact of alternative uses of funding (Assumption 4). More broadly, this category is wider than lead paint alone: some environmental opportunities are weaker than lead-source elimination, and LEEP's lifetime-income conversion adds an extra layer of modeling uncertainty.

We therefore apply a large **10x penalty** when moving from LEEP's program-specific all-things-considered estimate to a broader cause-area estimate:

$$
\$4.49 \times 10 \approx \$45
$$

Rounded, this gives a point estimate of **\$50/QALY**.

This 10x penalty is a judgment call, not a number stated directly in the sources. The case for using a penalty this large is that it simultaneously accounts for:

- the predictive rather than retrospective nature of LEEP's model
- model-structure risk and counterfactual-funding concerns
- the extra uncertainty in translating lifetime-income gains into DALY-equivalent welfare
- the fact that the category includes opportunities weaker than lead paint elimination
- the mismatch between "best current environmental-health opportunities" and the many broad environmental nonprofits that are not tightly health-focused

An independent cross-check comes from toxic-site remediation. The geometric midpoint of the **\$392-\$3,238 per DALY** remediation range is about **\$1,130 per DALY**. That is about **23x worse** than our **\$50/QALY** point estimate and about **250x worse** than raw LEEP all-things-considered cost-effectiveness. This pattern is directionally sensible: downstream cleanup of severe hotspots should be much less cost-effective than preventing exposure at the source, and the raw LEEP model should not be treated as a generic environmental-charity benchmark.

Why does lead still dominate the estimate even after this penalty? Because lead is both a huge and unusually tractable environmental-health problem. WHO reports more than **33 million DALYs** from lead exposure in 2021.

We do **not** center the estimate on clean air even though the burden is enormous, because the published chain from **donor dollar -> pollutant reduction -> QALYs** is much thinner there than for lead. The clean-air field does, however, look highly neglected (Assumption 7), and the World Bank argues that large exposure reductions are feasible and affordable (Assumption 6), so strong clean-air philanthropy could plausibly be very cost-effective as well.

The weaker end of the cause area consists of environmental projects where attributable welfare benefits are more diffuse or secondary, such as parks, trails, and some greenspace work. Those may still be socially worthwhile, but the public cost-effectiveness evidence is thinner and usually much weaker (Assumption 8).

**Range:**

- **Optimistic:** about **\$15/QALY**, corresponding to a very strong lead-source-elimination opportunity where most of the central-case skepticism penalties do not apply, but some model error and external-validity discount still remain.
- **Pessimistic:** about **\$30,000/QALY**, corresponding to environmental projects where attributable welfare benefits are diffuse, secondary, or poorly measured.

So the practical sensitivity range is **\$15-\$30,000/QALY**.

This is a practical range, not a formal uncertainty interval. Biodiversity, ecosystem existence value, and nonhuman-animal welfare could in principle be converted into QALY-equivalent welfare too. We do not add a separate term for them here because the current category model is anchored on pollution-focused recipients and the public dollar-to-outcome evidence for those broader environmental channels is much thinner. If the recipient mix shifts toward conservation or ecosystem protection, this page should either split the category or add a dedicated welfare-conversion model.

### Start Time

The 2-year start time reflects the lag between funding and realized benefits. Lead regulations, monitoring systems, cleanup projects, and air-quality policies usually take some time to design, pass, enforce, and translate into lower exposure. Some site-specific remediation can work faster, but 2 years is a reasonable portfolio average.

### Duration

The 40-year duration reflects the long-lived nature of successful pollution-control wins. Lead paint bans, cleaner manufacturing standards, contaminated-site remediation, and cleaner-air governance can reduce exposures for many future birth cohorts, not just the people reached in the first year or two after implementation. As rough anchors for persistence, the U.S. banned consumer lead-based paint in **1978** and completed the phaseout of leaded gasoline in **1996**, and those changes have remained in force for decades. ([EPA on lead paint](https://www.epa.gov/lead/protect-your-family-sources-lead), [EPA on leaded gasoline](https://www.epa.gov/archive/epa/aboutepa/epa-takes-final-step-phaseout-leaded-gasoline.html))

## What Kinds of Charities Are We Modeling?

- Lead paint, spices, cookware, battery recycling, and other source-reduction efforts aimed at lowering human lead exposure
- Toxic-site cleanup and industrial contamination remediation where human welfare is the main benefit
- Clean-air data, advocacy, litigation, and policy work where the main pathway is lower human exposure to pollution
- Not climate mitigation, and not biodiversity/scenic/amenity value unless a recipient-level model can translate those outcomes into QALY-equivalent welfare

## Key Uncertainties

1. **How representative LEEP's modeled paint portfolio is of the best current marginal environmental-health giving opportunities.** It is the strongest quantitative anchor we found, but it is still only one organization's model.
2. **Whether the right penalty on predictive, program-specific lead models is closer to 3x or 30x than 10x.** This is the biggest judgment call in the estimate.
3. **How cost-effective clean-air philanthropy is at the donor margin.** The field looks very neglected, but published donor-to-QALY models are sparse.
4. **How much broader environmental welfare to model explicitly.** Biodiversity, ecosystem resilience, existence value, and nonhuman-animal welfare could be decision-relevant for some recipients, but the current category estimate is mainly calibrated to pollution-focused opportunities.
5. **Whether this category should eventually be split more cleanly between environmental health / pollution and nature / conservation.** The current category is broad enough that one page cannot model every pathway equally well.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- LEEP's \$4.49 figure should be explained as an all-things-considered DALY-equivalent estimate, not a direct-health-only estimate. About 84% of the modeled impact is income-equivalent rather than direct health DALYs.
- The core arithmetic from LEEP's public page is \$4M / 900k DALY-equivalents = about \$4.4 per DALY-equivalent.
- The health-only cross-check is \$4M / 145k health DALYs = about \$27.6 per health DALY.
- The geometric midpoint of the remediation range is about \$1,130/DALY and serves as a useful sanity check against both the raw LEEP figure and the \$50 point estimate.
- As of April 6th 2026, GiveWell's public top-charity pages do not list LEEP, though GiveWell has funded related lead-exposure work through Pure Earth and Founders Pledge publicly recommends LEEP. The 10x penalty on LEEP's all-things-considered figure is partly intended to account for the gap between LEEP's self-reported model and external evaluation. ([GiveWell Top Charities](https://www.givewell.org/charities/top-charities), [GiveWell Pure Earth grant](https://www.givewell.org/research/incubation-grants/Pure-Earth-lead-exposure-July-2021), [Founders Pledge on LEEP](https://www.founderspledge.com/research/lead-exposure-elimination-project-leep))
- If the repo later creates a separate biodiversity/conservation category, this page could become more cleanly "environmental health / pollution."
