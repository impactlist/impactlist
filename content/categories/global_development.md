---
id: global-development
name: 'Global Development / Poverty'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 15
    costPerQALY: 250
---

# Justification of cost per life

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures improvements in quality of life from economic interventions targeting people in extreme poverty. Unlike Global Health interventions that primarily avert deaths, these programs increase consumption, assets, income, and psychological wellbeing through cash transfers, livelihood programs, and developmental interventions. Benefits persist for years and can help households escape poverty traps.

## Point Estimates

- **Cost per QALY:** \$250 (\$100–\$600)
- **Start time:** 1 year
- **Duration:** 15 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. The leading evidence-backed poverty interventions are unconditional cash transfers (GiveDirectly), graduation/livelihood programs (BRAC model), and deworming programs with long-term income effects. ([GiveWell](https://www.givewell.org/charities/top-charities), [J-PAL](https://www.povertyactionlab.org/evidence-effect/graduation-approach))
2. GiveDirectly's cash transfer program is approximately 30–40% as cost-effective as GiveWell's top health charities. ([GiveWell](https://blog.givewell.org/2024/11/12/re-evaluating-the-impact-of-unconditional-cash-transfers/))
3. GiveWell's moral weights assign 1 unit of value to doubling consumption for one person for one year, and 134 units to averting the death of a 5-year-old child (approximately 60 remaining life-years). ([GiveWell Moral Weights](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/moral-weights))
4. Cash transfers of approximately \$1,000 cost donors approximately \$1,200 per household after overhead, with 85–90% of donations reaching recipients. ([GiveDirectly](https://www.givedirectly.org/financials/))
5. Graduation programs cost \$300–\$2,000 per household and produce benefit-cost ratios of approximately 1.2 in rigorous evaluations. ([Banerjee et al. 2015](https://www.science.org/doi/10.1126/science.1260799), [BRAC UPGI](https://bracultrapoorgraduation.medium.com/understanding-the-costs-of-graduation-investing-in-long-term-gains-b5f3b9ad1dfd))
6. Deworming costs \$0.30–\$1.00 per child treated and may produce long-term income gains of approximately 10–15%, though evidence is based primarily on one study. ([GiveWell Deworming](https://www.givewell.org/international/technical/programs/deworming))
7. Consumption and asset gains from these interventions persist for 10–15 years, with effects diminishing over time. ([Haushofer & Shapiro 2018](https://www.povertyactionlab.org/sites/default/files/research-paper/The-long-term-impact-of-conditional-cash-tranfer_Kenya_Haushofer_Shapiro_January2018.pdf), [Bandiera et al. 2017](https://bracinternational.org/ultra-poor-graduation/))
8. The conversion from consumption-doubling units to QALY-equivalents is approximately 0.45 QALYs per unit, derived from GiveWell's moral weights (60 life-years / 134 units).

## Details

### Cost per QALY

The point estimate (\$250/QALY) and range (\$100–\$600/QALY) represent a portfolio of the most effective economic interventions for poverty reduction. This estimate is derived by combining cost-effectiveness data from multiple intervention types and converting consumption/income gains to QALY-equivalents using GiveWell's moral weights framework (Assumptions 3 and 8).

**Cash transfers (GiveDirectly):** GiveWell's November 2024 re-evaluation found GiveDirectly's program produces approximately 3–4 units of value per \$1,200 transfer when including direct consumption gains, spillover effects to non-recipients, and asset accumulation (Assumption 2). Using our conversion factor (Assumption 8):

$$\dfrac{\$1,200}{3.5 \text{ units} \times 0.45 \text{ QALYs/unit}} \approx \$760/\text{QALY (single year)}$$

However, research shows consumption and asset gains persist 10–15 years with gradual decay (Assumption 7). Three-year follow-ups in Kenya found recipients maintained 40–60% of asset gains, and long-term studies in Uganda found income effects persisting 12+ years. Accounting for sustained but decaying benefits over 15 years yields approximately \$200–\$400/QALY.

**Graduation programs:** The BRAC model and similar programs cost \$300–\$2,000 per household (Assumption 5) and have been shown effective across six countries in rigorous RCTs. [Banerjee et al. (2015)](https://www.science.org/doi/10.1126/science.1260799) found benefit-cost ratios exceeding 1.0 in five of six sites, with benefits persisting 7–10 years after program completion. These programs produce sustained increases in consumption (9%), earnings (37%), savings (9x), and assets (2x). The higher upfront cost is offset by larger and more durable effects, yielding estimated cost-effectiveness of \$150–\$400/QALY.

**Deworming:** Mass drug administration costs \$0.30–\$1.00 per child (Assumption 6), making it extremely cheap per person reached. GiveWell's recommendation is based primarily on one long-term study finding 10–15% income gains persisting into adulthood. However, GiveWell applies substantial discounts (~87%) for replicability uncertainty, as the evidence base is thin. When accounting for these discounts, deworming may be comparable in cost-effectiveness to cash transfers, though with higher variance.

The wide range (\$100–\$600/QALY) reflects: uncertainty in converting consumption gains to QALYs, variation across programs and contexts, differing philosophical views on valuing consumption versus health gains, and substantial uncertainty in long-term effect persistence.

### Start Time

The one-year start time reflects the typical delay between donation and program implementation. Cash transfers via mobile money platforms can be delivered within months, while graduation programs require 18–24 months of active intervention before benefits fully materialize.

### Duration

The 15-year duration represents the estimated period over which economic benefits persist (Assumption 7). Long-term follow-ups of both cash transfers and graduation programs show sustained effects on assets, consumption, and income for at least 7–12 years, with some studies finding effects persisting even longer. We use 15 years as a reasonable upper bound while acknowledging that effects gradually decay over time.

---

_These estimates are approximate and we welcome contributions to improve them. You can submit quick feedback with [this form](https://forms.gle/NEC6LNics3n6WVo47) or get more involved [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
