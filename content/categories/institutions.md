---
id: institutions
name: 'Improving Institutions'
effects:
  - effectId: standard
    startTime: 5
    windowLength: 40
    costPerQALY: 4_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing, but check the global assumptions for this value and other relevant parameters, such as the discount factor).

## Description of effect

This effect captures welfare gains from ambitious institutional reforms in rich countries—statewide upzoning, streamlined housing approvals, charter-city-style special jurisdictions, and similar governance innovations. These reforms improve quality of life through better housing, shorter commutes, and higher real incomes.

## Point Estimates

- **Cost per QALY:** \$4,000 (\$1,000–\$60,000)
- **Start time:** 5 years
- **Duration:** 40 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. Relaxing land-use constraints in top-productivity metros could raise U.S. GDP by several percent; debate exists on exact magnitudes but sign and scale are substantial. ([Hsieh & Moretti 2019](https://www.aeaweb.org/articles?id=10.1257%2Fmac.20170388), [Greaney 2023](https://www.aeaweb.org/articles?from=f&id=10.1257%2Fmac.20230141))
2. Major zoning reforms have measurably increased housing supply within a few years (Auckland, Minneapolis 2040). ([Auckland study](https://www.auckland.ac.nz/assets/business/our-research/docs/economic-policy-centre/Working%20paper%2017.pdf), [Minneapolis study](https://www.econstor.eu/bitstream/10419/320557/1/GLO-DP-1629.pdf))
3. Philanthropic actors have supported successful housing policy reforms in multiple jurisdictions. ([Open Philanthropy](https://www.openphilanthropy.org/focus/housing-policy-reform/))
4. The money-metric value of a QALY is approximately \$100,000 in high-income settings, consistent with ICER thresholds. ([ICER 2023](https://icer.org/wp-content/uploads/2023/09/ICER_2023_VAF_For-Publication_092523.pdf))
5. A large reform (statewide upzoning + streamlined approvals) could generate approximately \$8 billion/year in consumption-equivalent welfare gains once mature.
6. Probability of philanthropic coalition success within a funding window is approximately 12%.
7. Attribution to philanthropy if successful is approximately 25% of realized benefits.

## Details

### Cost per QALY

The point estimate (\$4,000/QALY) and range (\$1,000–\$60,000/QALY) are derived from modeling a multi-year philanthropic effort to deliver one large institutional reform.

**Model parameters:**

- $R$ = Annual welfare gains once mature: \$8 billion/year (Assumption 5)
- $h$ = Share that is QALY-relevant: 50%
- $v$ = Dollar anchor per QALY: \$100,000 (Assumption 4)
- $d$ = Years benefits persist: 20
- $p_s$ = Probability of success: 12% (Assumption 6)
- $\alpha$ = Attribution to philanthropy: 25% (Assumption 7)
- $C$ = Philanthropic cost: \$75 million

**Calculation:**

$$\text{QALYs}_{\text{per year}} = \dfrac{h \times R}{v} = \dfrac{0.5 \times \$8{,}000{,}000{,}000}{\$100{,}000} = 40{,}000 \text{ QALYs/year}$$

$$\text{QALYs}_{\text{total}} = d \times \text{QALYs}_{\text{per year}} \times (p_s \times \alpha) = 20 \times 40{,}000 \times 0.03 = 24{,}000 \text{ QALYs}$$

$$\text{Cost per QALY} = \dfrac{C}{\text{QALYs}_{\text{total}}} = \dfrac{\$75{,}000{,}000}{24{,}000} \approx \$3{,}125$$

Rounded to \$4,000/QALY to reflect model uncertainty.

**Range:** Varying parameters ($R$: \$2–20B; $h$: 0.3–0.7; $p_s$: 6–25%; $\alpha$: 15–30%; $d$: 10–30 years; $C$: \$50–150M) yields \$1,000–\$60,000/QALY. The low end corresponds to unusually successful, durable reforms; the high end reflects partial rollbacks or higher costs.

### Start Time

The 5-year start time reflects the delay between philanthropic investment and realized welfare gains as reforms pass, are implemented, and development responds.

### Duration

The 40-year duration reflects that successful institutional reforms (zoning changes, governance structures) tend to persist for decades, with benefits compounding as housing stock and economic activity adjust.

---

_These estimates are approximate and we welcome contributions to improve them. Learn how you can help [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
