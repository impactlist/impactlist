---
id: charter-cities-institute
name: 'Charter Cities Institute'
categories:
  - id: institutions
    fraction: 1
    effects:
      - effectId: standard
        overrides:
          costPerQALY: 1500
---

# Justification of cost per life

We assign the Charter Cities Institute (CCI) a **cost per QALY of \$1,500**. It comes in below the baseline [Improving Institutions](/cause/institutions) estimate mainly because successful institutional improvements in lower-income countries can generate much larger welfare gains per dollar. We still apply a large attribution discount: CCI researches, advises, and convenes around charter cities, but it does not build them.

## Description of effect

This effect captures the welfare gains from CCI's research, advocacy, technical assistance, partnerships, and convening around new city-governance projects in lower-income countries. CCI does not itself found or operate cities; the causal chain runs through third-party projects and governments. We model this as a high-variance institutional-reform bet: accepting a lower probability of success and more attribution uncertainty in exchange for higher marginal utility of income if a real reform succeeds. ([Charter Cities Institute](https://chartercitiesinstitute.org/), [Rethink Priorities intervention report](https://rethinkpriorities.org/research-area/intervention-report-charter-cities/))

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$1,500 (\$400-\$60,000)

*If you disagree with this estimate after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1.  **The Valuation Arbitrage:** The primary driver is the difference in the marginal utility of income. A dollar of economic growth in CCI's target regions (e.g., Zambia, Nigeria) can generate much more wellbeing than in the baseline's target regions (US/UK) under logarithmic utility of income. We use a **20x** valuation ratio to leave room for migration, distribution, public-finance leakage, and the fact that not every benefit of a charter-city project accrues to the poorest residents.
2.  **The Probability Discount:** Establishing a new city is significantly riskier than the typical institutions intervention. We assume CCI projects are roughly 4x less likely to produce a major durable win than the baseline category's scenario-weighted mix, because CCI depends on third-party city projects, governments, investors, and residents all coordinating successfully.
3.  **Execution Friction and Attribution:** We apply a further **0.4x** haircut for the difficulty of translating research and technical assistance into durable, politically accepted, welfare-improving city governance, and for the fact that CCI is usually one contributor among many.
4.  **Catch-up Growth:** Successful charter cities in LMICs have higher potential growth rates (7-10%) compared to rich-country cities (2-3%), which partially offsets the lower probability of success.
5.  **Direct Evidence Is Thin:** This is a hits-based override rather than a measured CCI effect. The range extends back toward the institutions default, and well above it, if CCI is rarely causal for durable institutional improvements.

## Details

### Deriving the \$1,500/QALY estimate

We benchmark CCI against the institutions category estimate of **\$3,000/QALY**. The core comparison is between the expected value of the Charter Cities Institute ($EV_{CCI}$) and the expected value of the baseline ($EV_{Base}$):

$$\text{Relative effectiveness} = \frac{EV_{CCI}}{EV_{Base}}$$

We decompose Expected Value ($EV$) into two components: Probability of Success ($P$) and Value of Outcome ($V$).

### 1. Probability discount

The institutions baseline is a scenario-weighted category model rather than one clean success-probability estimate: it puts 10% on a major-win scenario and additional mass on smaller limited or moderate wins. CCI's pathway is materially less reliable than that baseline mix because it depends on third-party city projects, governments, investors, and residents all coordinating successfully. We summarize that extra execution risk with a **0.25x** probability discount:

$$P_{ratio} \approx 0.25$$

### 2. Valuation ratio

This captures how efficiently economic gains convert to QALYs:

- **Baseline:** Targets high-income populations (e.g., US/UK).
- **CCI:** Targets low-income populations (Global South).

Standard welfare economics suggests that increasing consumption in the latter group can be much more effective at generating welfare (QALYs) than in the former. We use **20x** after discounting for distribution and attribution inside the project:

$$V_{ratio} = \frac{V_{LMIC}}{V_{Rich}} \approx 20$$

### 3. Final cost-per-QALY calculation

Combining the factors:

$$\text{Relative Effectiveness} = P_{ratio} \times V_{ratio} \times F_{execution} = 0.25 \times 20 \times 0.4 = 2.0$$

This implies CCI could be much more effective than the baseline institutions estimate. Converting that comparison into a cost per QALY:

$$\text{Cost per QALY}_{CCI} = \frac{\$3{,}000}{2.0} = \$1{,}500$$

The plausible range is **\$400-\$60,000/QALY**. The low end is a real charter-city success in a low-income setting where CCI was materially causal. The high end is the more common case, where advocacy, convening, or policy design absorbs funding without producing a durable institutional improvement. Read the estimate as a hits-based override, not as a claim that the average charter-city project reliably clears this bar.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on December 16th 2025 by Google Gemini 3 Pro, with prompts from Impact List staff._

The core argument rests on both $V_{ratio}$ and attribution. If CCI is rarely causal for durable governance improvements, the true cost per QALY could be much worse than the point estimate. If a project succeeds in a low-income setting and CCI is materially causal, the estimate could be much better.
