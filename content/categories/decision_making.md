---
id: decision-making
name: 'Improving Decision Making'
effects:
  - effectId: standard
    startTime: 3
    windowLength: 20
    costPerQALY: 1_200
---

# Justification of cost per life

_The following analysis was done on November 26th 2025, written by Claude Opus 4.5 and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing, but check the global assumptions for this value and other relevant parameters, such as the discount factor).

## Description of effect

This effect captures welfare gains from charities that improve how high-stakes institutions think and choose—including calibrated forecasting and prediction markets for policy, structured analytic techniques (premortems, red-team reviews), decision audits, and better evidence pipelines in executive agencies and legislatures.

## Point Estimates

- **Cost per QALY:** \$1,200 (\$500–\$50,000)
- **Start time:** 3 years
- **Duration:** 20 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. Forecasting tournaments produce substantially higher accuracy than status-quo methods; trained teams achieved 30–60% lower Brier scores than controls in the IARPA program. ([Mellers et al. 2015](https://www.pnas.org/doi/10.1073/pnas.1502419112), [Good Judgment](https://goodjudgment.com/research/))
2. Prediction markets show competitive or superior accuracy to polls and experts. ([Wolfers & Zitzewitz 2004](https://www.aeaweb.org/articles?id=10.1257/0895330041371321))
3. Premortems and red-team methods increase identification of failure modes and reduce planning errors. ([Klein 2007](https://hbr.org/2007/09/performing-a-project-premortem))
4. Major policies routinely involve tens of billions of dollars in annual benefits and costs. ([OMB reports](https://bidenwhitehouse.archives.gov/wp-content/uploads/2024/02/FY-20-21-22-BCA-Report-FINAL.pdf))
5. Philanthropy has successfully seeded forecasting infrastructure, tournament platforms, and government partnerships. ([Open Philanthropy grants](https://www.openphilanthropy.org/grants/), [Effective Institutions Project](https://effectiveinstitutionsproject.org/))
6. Forecast accuracy improvements of tens of percent translate to fraction-of-a-percent gains in realized welfare after dilution, organizational frictions, and partial uptake.
7. The money-metric value of a QALY in high-income settings is approximately \$100,000, consistent with ICER thresholds.
8. When decision-making frameworks become institutionally embedded (via executive orders, legislation, or standard practice), they can persist for decades; without such embedding, effects typically decay over 5–10 years. ([25 Years of EO 12866](https://regulatorystudies.columbian.gwu.edu/25-years-eo-12866), [Good Judgment track record](https://goodjudgment.com/resources/the-superforecasters-track-record/))

## Details

### Cost per QALY

The point estimate (\$1,200/QALY) and range (\$500–\$50,000/QALY) are derived from modeling a program that installs calibrated forecasting and decision protocols across high-stakes government choices.

**Model parameters:**

- $R$ = Annual welfare-relevant benefits at stake: \$50 billion/year (Assumption 4)
- $f$ = Proportional improvement in choice quality: 0.3% (Assumption 6)
- $h$ = Share of benefits that are QALY-relevant: 50%
- $v$ = Money-metric value per QALY: \$100,000 (Assumption 7)
- $d$ = Years of effect persistence: 20 (Assumption 8)
- $C$ = Philanthropic cost: \$18 million

**Calculation:**

Annual QALYs produced:
$$\text{QALYs}_{\text{per year}} = \dfrac{h \times f \times R}{v} = \dfrac{0.5 \times 0.003 \times \$50{,}000{,}000{,}000}{\$100{,}000} = 750 \text{ QALYs}$$

Total QALYs over the window:
$$\text{QALYs}_{\text{total}} = d \times \text{QALYs}_{\text{per year}} = 20 \times 750 = 15{,}000 \text{ QALYs}$$

Cost per QALY:
$$\text{Cost per QALY} = \dfrac{C}{\text{QALYs}_{\text{total}}} = \dfrac{\$18{,}000{,}000}{15{,}000} = \$1{,}200$$

**Range:** Varying parameters ($R$: \$20–100B; $f$: 0.1–1.0%; $h$: 30–60%; $d$: 5–30 years; $C$: \$10–40M) yields approximately \$500–\$50,000/QALY. Lower values correspond to successful institutionalization; higher values reflect limited adoption or rapid decay.

### Start Time

The 3-year start time reflects the delay between standing up forecasting infrastructure and first consequential uses. Tournaments, prediction markets, and decision audits typically take months to establish, with first uses arriving in the next budget or policy cycle.

### Duration

The 20-year duration reflects evidence that institutionally embedded decision-making reforms can persist for decades. US regulatory cost-benefit analysis requirements have persisted for 44+ years across administrations of both parties (E.O. 12291 in 1981, continued through E.O. 12866 in 1993 and beyond). ([GW Regulatory Studies Center](https://regulatorystudies.columbian.gwu.edu/25-years-eo-12866)) Good Judgment's superforecasting infrastructure has operated continuously for 14+ years since the IARPA tournament, with growing government and corporate adoption. ([Good Judgment](https://goodjudgment.com/)) The UK What Works Network has operated for 12+ years. ([GOV.UK](https://www.gov.uk/guidance/what-works-network))

However, programs without institutional embedding typically decay within 2–10 years due to leadership transitions, funding cuts, or methodological obsolescence. The 20-year estimate reflects an expected value across scenarios where some programs achieve lasting institutionalization while others fail to take root.

---

_These estimates are approximate and we welcome contributions to improve them. Learn how you can help [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
