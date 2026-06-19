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

{{STANDARD_QALY_METHOD_NOTE}}

## Description of effect

This effect captures welfare gains from donations to the best current **non-climate environmental** charities, especially those that reduce toxic exposure or air pollution: lead-source elimination, toxic-site remediation, and clean-air policy/data/advocacy. The current quantitative anchors are pollution-focused. We do not separately model biodiversity, ecosystem existence value, or scenic/amenity value. That is a scope and evidence decision, not a claim that those benefits fall outside QALY-equivalent welfare.

## What kinds of charities are we modeling?

We model **non-climate environmental work whose main benefit is lower human exposure to pollution** — primarily lead-source reduction, toxic-site cleanup, and clean-air advocacy. General conservation, parks, reefs, and biodiversity work should not inherit this default unless a recipient-level model translates their benefits into QALY-equivalent welfare.

:::details{title="What is and is not modeled"}
Representative activities include:

- Lead paint, spices, cookware, battery recycling, and other source-reduction efforts aimed at lowering human lead exposure
- Toxic-site cleanup and industrial contamination remediation where human welfare is the main benefit
- Clean-air data, advocacy, litigation, and policy work where the main pathway is lower human exposure to pollution

We are **not** modeling climate mitigation, biodiversity/scenic/amenity value, or conservation capital projects unless a recipient-level model can translate those outcomes into QALY-equivalent welfare.
:::

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$50 (\$15–\$60,000)
- **Start time:** 2 years
- **Duration:** 40 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. For the purpose of this page, one DALY averted is treated as roughly one QALY gained, since both metrics are trying to capture healthy life-years and the source estimates here are not precise enough to justify a finer conversion.
2. WHO's current lead fact sheet reports that lead exposure was attributed to more than **3.5 million deaths** and more than **71.5 million DALYs** globally in 2023, primarily through cardiovascular effects, and only 48% of countries had legally binding controls on lead paint as of January 2024. ([WHO lead fact sheet](https://www.who.int/news-room/fact-sheets/detail/lead-poisoning-and-health))
3. LEEP's 2024 multi-country model estimates **\$4.49 per DALY-equivalent averted** across 13 paint programs, with total modeled costs around **\$4 million** and about **900,000 DALY-equivalents**. Only 145,000 of those DALY-equivalents are direct health DALYs; about 756,000 are lifetime-income equivalents. We treat both as QALY-equivalent welfare for this page, but we assign more model uncertainty to the income bridge than to the direct-health component. Rounded, this is a roughly **\$5/QALY-equivalent** lead-source-elimination anchor. ([LEEP 2024](https://leadelimination.org/how-cost-effective-are-leeps-paint-programs/))
4. LEEP says its model is mostly predictive, includes costs but not the potential impact of some non-paint work, and does not account for the counterfactual impact of alternative uses of funding. We therefore apply roughly a **10x skepticism/generalization penalty** to the rounded **\$5/QALY-equivalent** lead anchor when using LEEP as a cause-area estimate, implying a point estimate of about **\$50/QALY** after accounting for category breadth, model uncertainty, and the extra uncertainty in the lifetime-income conversion. See the Details section for the reasoning behind this penalty. ([LEEP 2024](https://leadelimination.org/how-cost-effective-are-leeps-paint-programs/))
5. In a case study of one severely contaminated site in the Dominican Republic, remediating lead-contaminated soil was estimated at roughly \$392-\$3,328 per DALY averted. ([Ericson et al. 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC7007121/))
6. Ambient air pollution kills roughly 5.7 million people globally each year, and the World Bank argues that halving high exposure by 2040 is feasible and affordable. ([World Bank 2023](https://www.worldbank.org/en/publication/accelerating-access-to-clean-air-for-a-livable-planet))
7. Clean-air philanthropy remains highly neglected: outdoor air quality received less than 0.1% of philanthropic foundation funding from 2015 to 2022. ([Clean Air Fund 2024](https://www.cleanairfund.org/resource/philanthropic-funding/))
8. Parks, trails, and related greenspace infrastructure have much thinner human-health cost-effectiveness evidence: a recent systematic review found only one cost-effectiveness study, at about \$23,254 per DALY averted, and concluded the evidence base was insufficient to determine overall cost-effectiveness. ([Jacob et al. 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11102847/))

## Details

### Cost per QALY

The estimate is anchored on **lead elimination**, the strongest quantitative evidence in this cause area. In LEEP's own model the best current lead-paint-elimination opportunities cost roughly **\$4-5 per QALY-equivalent** (its headline **\$4.49 per DALY-equivalent**, Assumption 3). We round that program-specific anchor to **\$5/QALY-equivalent**, then apply a large **10x penalty** to reach a broader cause-area estimate of **\$50/QALY**.

:::details{title="From LEEP's headline figure to the point estimate"}
LEEP's headline **\$4.49 per DALY-equivalent** combines direct health gains with monetized lifetime-income gains converted into common welfare units. Only about **145,000** of the modeled 900,000 DALY-equivalents are direct health DALYs; the rest are lifetime-income equivalents. The health-only cross-check is still very strong — about **\$28 per direct-health DALY** using LEEP's \$4M / 145k figures — but it is meaningfully weaker than the all-things-considered headline. We use the all-things-considered figure because the income gains are real welfare gains expressible in QALY-equivalent terms. The 10x penalty below then absorbs the extra uncertainty in that bridge. This page treats **DALYs averted** and **QALYs gained** as roughly interchangeable (Assumption 1): both are healthy-life-year measures, and the uncertainty in the intervention evidence dwarfs the difference between the two metrics for our purposes.

Using LEEP's reported total modeled cost and all modeled DALY-equivalents:

$$
\text{All-things-considered cost per DALY-equivalent} = \dfrac{\$4{,}000{,}000}{900{,}000} \approx \$4.4
$$

Applying the 10x penalty to the rounded **\$5/QALY-equivalent** anchor:

$$
\$5 \times 10 = \$50
$$

This gives a point estimate of **\$50/QALY**. Using the unrounded \$4.49 figure would give about \$45/QALY; we use the rounded \$5 anchor because the penalty is itself a coarse judgment about model and category uncertainty, not a precise multiplier.
:::

The penalty is large because LEEP's model is **mostly predictive**, narrow to its 13 paint programs, and ignores the counterfactual impact of alternative funding (Assumption 4), while the category as a whole is wider than lead paint and the lifetime-income conversion adds extra modeling uncertainty. This 10x is a judgment call, not a number from the sources.

:::details{title="What the 10x penalty is accounting for"}
The case for a penalty this large is that it simultaneously accounts for:

- the predictive rather than retrospective nature of LEEP's model
- model-structure risk and counterfactual-funding concerns
- the extra uncertainty in translating lifetime-income gains into DALY-equivalent welfare
- the fact that the category includes opportunities weaker than lead paint elimination
- the mismatch between "best current environmental-health opportunities" and the many broad environmental nonprofits that are not tightly health-focused
:::

An independent cross-check comes from toxic-site remediation: the geometric midpoint of the **\$392-\$3,328 per DALY** remediation range (Assumption 5) is about **\$1,140 per DALY** — about **23x worse** than our **\$50/QALY** point estimate and about **250x worse** than raw LEEP cost-effectiveness. This is directionally sensible: downstream cleanup of severe hotspots should be much less cost-effective than preventing exposure at the source, and the raw LEEP model should not be treated as a generic environmental-charity benchmark.

Why does lead still dominate the estimate even after this penalty? Because lead is both a huge and unusually tractable environmental-health problem. WHO reports more than **71.5 million DALYs** from lead exposure in 2023.

We do **not** center the estimate on clean air, even though the burden is enormous. The published chain from **donor dollar -> pollutant reduction -> QALYs** is much thinner there than for lead. But the field looks highly neglected (Assumption 7), and the World Bank argues that large exposure reductions are feasible and affordable (Assumption 6). So strong clean-air philanthropy could plausibly be very cost-effective too.

The weaker end of the cause area consists of environmental projects where attributable welfare benefits are more diffuse or secondary, such as parks, trails, and some greenspace work. Those may still be socially worthwhile, but the public cost-effectiveness evidence is thinner and usually much weaker (Assumption 8).

**Range:**

- **Optimistic:** about **\$15/QALY**, corresponding to a very strong lead-source-elimination opportunity where most of the central-case skepticism penalties do not apply, but some model error and external-validity discount still remain. The lower bound stays close to LEEP's raw \$4-5/QALY because that anchor caps how cost-effective the category plausibly gets.
- **Pessimistic:** about **\$60,000/QALY**. The single greenspace cost-effectiveness study we found sits near \$23,000/DALY (Assumption 8), but we set the upper tail wider than that. The dominant uncertainty here is not a single parameter. It is whether LEEP's predictive, externally-unvalidated model overstates the cause area, whether its lifetime-income component (about 84% of modeled impact) converts to welfare as assumed, and how much of a marginal dollar to "general environmental" charities funds diffuse conservation or greenspace work with very thin dollar-to-QALY evidence rather than tractable lead reduction.

So our plausible range is **\$15-\$60,000/QALY** — narrow on the optimistic side because the raw lead anchor bounds it, and wide on the pessimistic side because of correlated model and channel-mix uncertainty that lives outside the single-anchor calculation. This interval covers the pollution-focused channels the model is anchored on. It adds no separate term for biodiversity, ecosystem existence value, or nonhuman-animal welfare. Those could in principle be converted into QALY-equivalent welfare, but they have much thinner public dollar-to-outcome evidence (Key uncertainties 4-5).

### Start time

The 2-year start time reflects the lag between funding and realized benefits. Lead regulations, monitoring systems, cleanup projects, and air-quality policies usually take some time to design, pass, enforce, and translate into lower exposure. Some site-specific remediation can work faster, but 2 years is a reasonable portfolio average.

### Duration

The 40-year duration reflects the long-lived nature of successful pollution-control wins. Lead paint bans, cleaner manufacturing standards, contaminated-site remediation, and cleaner-air governance can reduce exposures for many future birth cohorts, not just the people reached in the first year or two after implementation. As rough anchors for persistence, the U.S. banned consumer lead-based paint in **1978** and completed the phaseout of leaded gasoline in **1996**, and those changes have remained in force for decades. ([EPA on lead paint](https://www.epa.gov/lead/protect-your-family-sources-lead), [EPA on leaded gasoline](https://www.epa.gov/archive/epa/aboutepa/epa-takes-final-step-phaseout-leaded-gasoline.html))

## Key uncertainties

1. **How representative LEEP's modeled paint portfolio is of the best current marginal environmental-health giving opportunities.** It is the strongest quantitative anchor we found, but it is still only one organization's model.
2. **Whether the right penalty on predictive, program-specific lead models is closer to 3x or 30x than 10x.** This is the biggest judgment call in the estimate.
3. **How cost-effective clean-air philanthropy is at the donor margin.** The field looks very neglected, but published donor-to-QALY models are sparse.
4. **How much broader environmental welfare to model explicitly.** Biodiversity, ecosystem resilience, existence value, and nonhuman-animal welfare could be decision-relevant for some recipients, but the current category estimate is mainly calibrated to pollution-focused opportunities.
5. **Whether this category should eventually be split more cleanly between environmental health / pollution and nature / conservation.** The current category is broad enough that one page cannot model every pathway equally well.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on April 6th 2026 by GPT-5.4 and Claude Opus 4.6, with prompts from Impact List staff._

- LEEP's \$4.49 figure should be explained as an all-things-considered DALY-equivalent estimate, not a direct-health-only estimate. About 84% of the modeled impact is income-equivalent rather than direct health DALYs.
- The core arithmetic from LEEP's public page is \$4M / 900k DALY-equivalents = about \$4.4 per DALY-equivalent.
- The health-only cross-check is \$4M / 145k health DALYs = about \$27.6 per health DALY.
- The geometric midpoint of the remediation range is about \$1,140/DALY and serves as a useful sanity check against both the raw LEEP figure and the \$50 point estimate.
- As of April 6th 2026, GiveWell's public top-charity pages do not list LEEP, though GiveWell has funded related lead-exposure work through Pure Earth and Founders Pledge publicly recommends LEEP. The 10x penalty on LEEP's all-things-considered figure is partly intended to account for the gap between LEEP's self-reported model and external evaluation. ([GiveWell Top Charities](https://www.givewell.org/charities/top-charities), [GiveWell Pure Earth grant](https://www.givewell.org/research/incubation-grants/Pure-Earth-lead-exposure-July-2021), [Founders Pledge on LEEP](https://www.founderspledge.com/research/lead-exposure-elimination-project-leep))
- If the repo later creates a separate biodiversity/conservation category, this page could become more cleanly "environmental health / pollution."
