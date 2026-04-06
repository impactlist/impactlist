---
id: environmental
name: 'General Environmental'
effects:
  - effectId: standard
    startTime: 2
    windowLength: 40
    costPerQALY: 140
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High) and Claude Opus 4.6 (Max), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures human-health benefits from donations to the best current **non-climate environmental** charities, especially those that reduce toxic exposure or air pollution: lead-source elimination, toxic-site remediation, and clean-air policy/data/advocacy. It is primarily a **human-health** estimate. It does **not** try to directly value biodiversity, ecosystem existence value, or scenic/amenity value, and it excludes climate mitigation.

## Point Estimates

- **Cost per QALY:** \$140 (\$60–\$30,000)
- **Start time:** 2 years
- **Duration:** 40 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. For the purpose of this page, one DALY averted is treated as roughly one QALY gained.
2. Lead exposure caused more than 1.5 million deaths and more than 33 million DALYs globally in 2021, and only 48% of countries had legally binding controls on lead paint as of January 2024. ([WHO 2024](https://www.who.int/news-room/fact-sheets/detail/lead-poisoning-and-health))
3. LEEP's 2024 multi-country model estimates \$4.49 per DALY-equivalent averted across 13 paint programs, but only 145,000 of the 900,000 modeled DALY-equivalents represent LEEP's counterfactual share of direct health DALYs, with total modeled costs around \$4 million. That implies roughly \$28 per health DALY averted. ([LEEP 2024](https://leadelimination.org/how-cost-effective-are-leeps-paint-programs/))
4. LEEP says its model is mostly predictive, includes costs but not the potential impact of some non-paint work, and does not account for the counterfactual impact of alternative uses of funding. We therefore apply roughly a 5x skepticism/generalization penalty when using LEEP as a cause-area anchor, implying about \$140 per QALY for best-in-class lead-focused environmental-health work. ([LEEP 2024](https://leadelimination.org/how-cost-effective-are-leeps-paint-programs/))
5. Remediating severe lead-contaminated sites in LMICs has been estimated at roughly \$392-\$3,238 per DALY averted. ([Ericson et al. 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC7007121/))
6. Ambient air pollution kills roughly 5.7 million people globally each year, and the World Bank argues that halving high exposure by 2040 is feasible and affordable. ([World Bank 2023](https://www.worldbank.org/en/publication/accelerating-access-to-clean-air-for-a-livable-planet))
7. Clean-air philanthropy remains highly neglected: outdoor air quality received less than 0.1% of philanthropic foundation funding from 2015 to 2022. ([Clean Air Fund 2024](https://www.cleanairfund.org/resource/philanthropic-funding/))
8. Parks, trails, and related greenspace infrastructure have much thinner human-health cost-effectiveness evidence: a recent systematic review found only one cost-effectiveness study, at about \$23,254 per DALY averted, and concluded the evidence base was insufficient to determine overall cost-effectiveness. ([Jacob et al. 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11102847/))

## Details

### Cost per QALY

The cleanest quantitative anchor in this cause area is **lead elimination**. But LEEP's headline **\$4.49 per DALY-equivalent** is not a QALY estimate in our sense: it combines direct health gains with monetized lifetime-income gains converted into "DALY-equivalents." LEEP's own writeup says that only 145,000 of 900,000 DALY-equivalents are direct health DALYs, while 756,000 are income equivalents (Assumption 3). So for a human-health category page, we should use the **health-only** portion instead of the headline number.

Using LEEP's reported total modeled cost and health DALYs:

$$
\text{Health-only cost per DALY} = \dfrac{\$4{,}000{,}000}{145{,}000} \approx \$27.6
$$

So the best current lead-paint-elimination opportunities appear to be on the order of **\$30 per QALY** on a health-only basis.

That is extremely strong, but it would still be too optimistic to use directly for the whole cause area. LEEP itself emphasizes that the model is **mostly predictive**, narrow to its 13 paint programs, and does not account for the counterfactual impact of alternative uses of funding (Assumption 4). More broadly, this category is wider than lead paint alone: some environmental-health opportunities are weaker than lead-source elimination, and some environmental charities generate value mainly outside the human-health metric used here.

We therefore apply a large **5x penalty** when moving from LEEP's program-specific health-only estimate to a broader cause-area estimate:

$$
\$27.6 \times 5 \approx \$138
$$

Rounded, this gives a point estimate of **\$140/QALY**.

This 5x penalty is a judgment call, not a number stated directly in the sources. The case for using a penalty this large is that it simultaneously accounts for:

- the predictive rather than retrospective nature of LEEP's model
- model-structure risk and counterfactual-funding concerns
- the fact that the category includes opportunities weaker than lead paint elimination
- the mismatch between "best current environmental-health opportunities" and the many broad environmental nonprofits that are not tightly health-focused

An independent cross-check comes from toxic-site remediation. The geometric midpoint of the **\$392-\$3,238 per DALY** remediation range is about **\$1,130 per DALY**. That is about **8x worse** than our **\$140/QALY** point estimate and about **41x worse** than raw LEEP health-only cost-effectiveness. This pattern is directionally sensible: downstream cleanup of severe hotspots should be much less cost-effective than preventing exposure at the source, but not so different that the two literatures look like they are describing completely unrelated worlds.

Why does lead still dominate the estimate even after this penalty? Because lead is both a huge and unusually tractable environmental-health problem. WHO reports more than **33 million DALYs** from lead exposure in 2021.

We do **not** center the estimate on clean air even though the burden is enormous, because the published chain from **donor dollar -> pollutant reduction -> QALYs** is much thinner there than for lead. The clean-air field does, however, look highly neglected (Assumption 7), and the World Bank argues that large exposure reductions are feasible and affordable (Assumption 6), so strong clean-air philanthropy could plausibly be very cost-effective as well.

Toxic-site remediation is a useful middle anchor. Pure Earth / GeoHealth estimate a range of roughly **\$392-\$3,238 per DALY** for remediating a severe LMIC lead hotspot (Assumption 5). That is much worse than the most optimistic lead-source-elimination models, but still very good by ordinary public-health standards.

The thin upper tail of the cause area consists of environmental projects where direct human-health benefits are more diffuse or secondary, such as parks, trails, and some greenspace work. Those may still be socially worthwhile, but when measured narrowly in direct human-health DALYs the evidence is thinner and usually much weaker (Assumption 8).

**Range:**

- **Optimistic:** about **\$60/QALY**, corresponding to a very strong lead-source-elimination opportunity but still allowing for some model error rather than taking LEEP's raw health-only estimate at face value.
- **Pessimistic:** about **\$30,000/QALY**, corresponding to environmental projects where direct human-health benefits are diffuse, secondary, or poorly measured.

So the practical sensitivity range is **\$60-\$30,000/QALY**.

This is a practical range, not a formal uncertainty interval. If one wanted to count biodiversity, ecosystem existence value, or nonhuman-animal welfare directly, many environmental projects would look better than this page suggests. On the other hand, if one wanted a representative estimate for mainstream broad environmental nonprofits rather than top current environmental-health opportunities, the true human-health-only number might be worse.

### Start Time

The 2-year start time reflects the lag between funding and realized benefits. Lead regulations, monitoring systems, cleanup projects, and air-quality policies usually take some time to design, pass, enforce, and translate into lower exposure. Some site-specific remediation can work faster, but 2 years is a reasonable portfolio average.

### Duration

The 40-year duration reflects the long-lived nature of successful pollution-control wins. Lead paint bans, cleaner manufacturing standards, contaminated-site remediation, and cleaner-air governance can reduce exposures for many future birth cohorts, not just the people reached in the first year or two after implementation.

## What Kinds of Charities Are We Modeling?

- Lead paint, spices, cookware, battery recycling, and other source-reduction efforts aimed at lowering human lead exposure
- Toxic-site cleanup and industrial contamination remediation where human health is the main benefit
- Clean-air data, advocacy, litigation, and policy work where the main pathway is lower human exposure to pollution
- Not climate mitigation, and not biodiversity/scenic/amenity value as such

## Key Uncertainties

1. **How representative LEEP's modeled paint portfolio is of the best current marginal environmental-health giving opportunities.** It is the strongest quantitative anchor we found, but it is still only one organization's model.
2. **Whether the right penalty on predictive, program-specific lead models is closer to 3x or 10x than 5x.** This is the biggest judgment call in the estimate.
3. **How cost-effective clean-air philanthropy is at the donor margin.** The field looks very neglected, but published donor-to-QALY models are sparse.
4. **How much environmental value sits outside human-health QALYs.** Biodiversity, ecosystem resilience, existence value, and nonhuman-animal welfare are mostly not counted here.
5. **Whether this category should eventually be split more cleanly between environmental health / pollution and nature / conservation.** The current category is broad enough that one page cannot model every pathway equally well.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- Do not use LEEP's \$4.49 as a QALY figure without explaining that 84% of the modeled impact is income-equivalent rather than direct health DALYs.
- The core arithmetic from LEEP's public page is \$4M / 145k health DALYs = about \$27.6 per health DALY.
- The geometric midpoint of the remediation range is about \$1,130/DALY and serves as a useful sanity check against both the raw LEEP figure and the \$140 point estimate.
- If the repo later creates a separate biodiversity/conservation category, this page could become more cleanly "environmental health / pollution."
