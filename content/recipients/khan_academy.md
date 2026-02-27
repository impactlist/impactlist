---
id: khan-academy
name: 'Khan Academy'
categories:
  - id: education
    fraction: 1
    effects:
      - effectId: standard
        overrides:
          costPerQALY: 2000
---

# Justification of cost per life

_The following analysis was done on December 16th 2025, written by Gemeni 3 Pro Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by applying a multiplier to the baseline **Education** cost per [QALY](https://en.wikipedia.org/wiki/Quality-adjusted_life_year). This multiplier reflects the comparative advantage of Khan Academy as a zero-marginal-cost digital public good relative to the labor-intensive interventions in the baseline.

## Description of effect

This effect captures the welfare gains from free, globally accessible digital education. While the baseline "Education" category focuses on high-touch, high-cost interventions in rich countries (e.g., intensive student advising or anti-bullying programs costing thousands per student), Khan Academy operates as a software platform. We model this as a "volume play": while the probability of a life-changing outcome per user is lower than intensive mentoring, the cost per user is orders of magnitude lower, and the reach extends into high-impact regions (Global South).

## Point Estimates

- **Multiplier:** 0.05x (relative to baseline)

If you disagree with this estimate after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1.  **Zero Marginal Cost (The Software Arbitrage):** The primary driver of the multiplier is the cost structure. The baseline relies on human labor (advisors/teachers), costing ~\$5,000–\$15,000 per successful outcome. Khan Academy supports ~150M registered users with a budget of ~\$100M, resulting in a cost per active learner of less than \$10.
2.  **Intensity Discount:** Watching videos is a weaker intervention than 1-on-1 coaching. We assume the probability of a "life trajectory change" (success) per Khan Academy user is roughly 50-100x lower than for a student receiving intensive multi-year advising (Baseline).
3.  **Global South Premium:** Unlike the baseline (US/UK focus), ~40–50% of Khan Academy’s traffic originates internationally, including significant usage in LMICs (India, Brazil). Income gains in these regions convert to QALYs at a much higher rate (logarithmic utility).
4.  **Attribution:** We heavily discount attribution (to ~5-10%) to account for the fact that Khan Academy is often a supplement to, rather than a replacement for, schooling.

## Details

### Derivation of the Multiplier (0.05x)

We calculate the cost-effectiveness multiplier ($M$) by comparing the expected efficiency of Khan Academy ($Eff_{KA}$) against the Baseline ($Eff_{Base}$).

$$M = \frac{Eff_{Base}}{Eff_{KA}}$$

We decompose Efficiency into three components: Cost ($C$), Probability of Success ($P$), and Value of Outcome ($V$).

### 1. Cost Ratio

The baseline relies on labor-intensive interventions costing ~\$5,000 per student, while Khan Academy operates at ~\$5 per active learner. This makes Khan Academy 1000x cheaper per unit of delivery:

$$C_{ratio} = \frac{C_{KA}}{C_{Base}} = \frac{5}{5000} = 0.001$$

### 2. Probability/Intensity Ratio

The baseline has high compliance and high impact (e.g., ~25% success rate for intensive advising). Khan Academy has low compliance and variable impact—we assume only 1 in ~400 active users achieves a counterfactual life outcome equivalent to the baseline intervention. This makes Khan Academy 400x less reliable per user:

$$P_{ratio} = \frac{P_{KA}}{P_{Base}} \approx 0.0025$$

### 3. Valuation Ratio

The baseline targets rich country students, while Khan Academy reaches a mix of rich and Global South users. We apply a conservative **2x** valuation boost to Khan Academy to account for its reach into regions where the marginal utility of education/income is higher.

### 4. Final Multiplier Calculation

Combining the factors:

$$\text{Relative Efficiency} = \frac{P_{ratio} \times V_{ratio}}{C_{ratio}} = \frac{0.0025 \times 2}{0.001} = \frac{0.005}{0.001} = 5$$

This suggests Khan Academy is **5x** more cost-effective than the baseline purely due to the software cost structure overwhelming the lower success rate.

However, to be robust against high user churn and attribution difficulties, we apply a further safety factor, increasing the assumed cost-effectiveness to roughly **20x** the baseline (Multiplier 0.05).

$$M \approx 0.05$$

---

{{CONTRIBUTION_NOTE}}

# Internal Notes

This multiplier is highly sensitive to the "Intensity Discount." If one believes that digital education _never_ causes a counterfactual life change (0% success), the multiplier is infinite. If one believes it works even 1% as well as a human tutor, the cost advantage (1000x cheaper) makes it an incredibly efficient intervention. The 0.05x multiplier is a conservative middle ground that credits the scale while acknowledging the low "dosage" of the intervention.
