---
id: khan-academy
name: 'Khan Academy'
categories:
  - id: education
    fraction: 1
    effects:
      - effectId: standard
        overrides:
          costPerQALY: 1600
---

# Justification of cost per life

_The following analysis was done on December 16th 2025, written by Gemini 3 Pro and edited by Impact List staff for clarity._

We assign Khan Academy a **cost per QALY of \$1,600**. The main reason it comes in below the baseline [Education](/cause/education) estimate is Khan Academy's unusually low cost of reaching learners at scale.

## Description of effect

This effect captures the welfare gains from free, globally accessible digital education. While the baseline "Education" cause focuses on high-touch, high-cost interventions in rich countries (e.g., intensive student advising or anti-bullying programs costing thousands per student), Khan Academy operates as a software platform. We model this as a "volume play": while the probability of a life-changing outcome per user is lower than intensive mentoring, the cost per user is orders of magnitude lower, and the reach extends into high-impact regions (Global South).

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$1,600 (\$500-\$25,000)

_If you disagree with this estimate after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values._

## Assumptions

1.  **Zero Marginal Cost (The Software Arbitrage):** The primary driver is the cost structure. The baseline relies on human labor (advisors/teachers), costing ~\$5,000-\$15,000 per successful outcome. Khan Academy supports large numbers of learners on a software platform, so a reasonable all-in delivery cost is about \$5 per active learner.
2.  **Intensity Discount:** Watching videos is a weaker intervention than 1-on-1 coaching. We assume roughly 1 in 400 active Khan Academy users achieves a counterfactual life outcome comparable to the baseline intervention, versus about 1 in 4 for intensive advising. That is a 1% relative success-probability ratio.
3.  **Global South Premium:** Unlike the baseline (US/UK focus), Khan Academy reaches a global user base, including significant usage in LMICs. Income gains in these regions convert to QALYs at a higher rate under logarithmic utility, so we apply a conservative 2x valuation boost.
4.  **Attribution and Substitution:** We apply a modest 0.8x adjustment for substitution and attribution risk. The adjustment is not larger because the 1-in-400 success assumption already absorbs most of the low-dosage, low-compliance, and user-churn concern.

## Details

### Deriving the \$1,600/QALY estimate

We benchmark Khan Academy against the current baseline education estimate of **\$25,000/QALY** and compare it to a portfolio of high-touch education interventions.

$$\text{Relative effectiveness} = \frac{Eff_{KA}}{Eff_{Base}}$$

We decompose Efficiency into three components: Cost ($C$), Probability of Success ($P$), and Value of Outcome ($V$).

### 1. Cost ratio

The baseline relies on labor-intensive interventions costing ~\$5,000 per student, while Khan Academy operates at ~\$5 per active learner. This makes Khan Academy 1000x cheaper per unit of delivery:

$$C_{ratio} = \frac{C_{KA}}{C_{Base}} = \frac{5}{5000} = 0.001$$

### 2. Probability/intensity ratio

The baseline has high compliance and high impact (e.g., ~25% success rate for intensive advising). Khan Academy has low compliance and variable impact: we assume only 1 in ~400 active users achieves a counterfactual life outcome equivalent to the baseline intervention. Relative to a 25% baseline success rate, that is a 1% success-probability ratio:

$$P_{ratio} = \frac{P_{KA}}{P_{Base}} = \frac{0.25\%}{25\%} = 0.01$$

### 3. Valuation ratio

The baseline targets rich country students, while Khan Academy reaches a mix of rich and Global South users. We apply a conservative **2x** valuation boost to Khan Academy to account for its reach into regions where the marginal utility of education/income is higher.

### 4. Final cost-per-QALY calculation

Combining the factors:

where $A = 0.8$ is the attribution and substitution adjustment. This is a further haircut for cases where Khan Academy supplements or displaces learning that would have happened anyway; it is deliberately modest because the probability/intensity ratio already carries most of the discount for low engagement.

$$\text{Relative Efficiency} = \frac{P_{ratio} \times V_{ratio} \times A}{C_{ratio}} = \frac{0.01 \times 2 \times 0.8}{0.001} = 16$$

This simple model suggests Khan Academy outperforms the baseline because the software cost structure can overwhelm the lower success rate.

Applying the 16x relative-efficiency estimate to the current education baseline gives:

$$\text{Cost per QALY}_{KA} = \frac{\$25{,}000}{16} \approx \$1{,}600$$

The plausible range is **\$500-\$25,000/QALY**. Khan looks much better than the point estimate if self-directed use produces counterfactual career or learning gains for more than 1 in 400 active users, especially in lower-income settings. It looks much worse if most usage is low-intensity, quickly abandoned, or replaces learning that would have happened anyway. That is why the top of the range reaches the general education baseline rather than treating scale alone as decisive.

{{CONTRIBUTION_NOTE}}

# Internal Notes

This estimate is highly sensitive to the "Intensity Discount." If one believes that digital education _never_ causes a counterfactual life change (0% success), the true cost per QALY would be effectively infinite. If one believes it works even 1% as well as a human tutor, the cost advantage (1000x cheaper) makes it an incredibly efficient intervention. The \$1,600/QALY estimate is a middle ground that credits the scale while acknowledging the low "dosage" of the intervention.
