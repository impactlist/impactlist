---
id: charter-cities-institute
name: 'Charter Cities Institute'
categories:
  - id: institutions
    fraction: 1
    effects:
      - effectId: standard
        overrides:
          costPerQALY: 400
---

# Justification of cost per life

_The following analysis was done on December 16th 2025, written by Google Gemini 3 Pro Thinking and edited by Impact List staff for clarity._

We assign the Charter Cities Institute (CCI) a **cost per QALY of \$400**. The main reason it comes in below the baseline [Improving Institutions](/cause/institutions) estimate is that successful institutional improvements in lower-income countries can generate much larger welfare gains per dollar.

## Description of effect

This effect captures the welfare gains from creating "Charter Cities": new urban jurisdictions in the Global South with special governance rights. While the baseline "Improving Institutions" cause focuses on legislative reform in high-income nations (e.g., zoning in the US), CCI attempts to replicate the "Singapore effect" in Low-to-Middle Income Countries (LMICs). We model this as a high-variance, high-reward arbitrage: accepting a lower probability of success in exchange for vastly higher marginal utility of income.

## Point Estimates

- **Cost per QALY:** \$400

If you disagree with this estimate after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1.  **The Valuation Arbitrage:** The primary driver is the difference in the marginal utility of income. A dollar of economic growth in CCI's target regions (e.g., Zambia, Nigeria) generates roughly 50x more wellbeing (QALYs) than in the baseline's target regions (US/UK) due to the logarithmic utility of income.
2.  **The Probability Discount:** Establishing a new city is significantly riskier than passing a zoning law. We assume CCI projects are roughly 4x less likely to succeed than the baseline intervention (3% vs 12%).
3.  **Catch-up Growth:** Successful charter cities in LMICs have higher potential growth rates (7-10%) compared to rich-country cities (2-3%), which partially offsets the lower probability of success.
4.  **Attribution Similarity:** We assume the attribution rate for philanthropic ecosystem building (CCI) is roughly similar to policy advocacy (Baseline).

## Details

### Deriving the \$400/QALY estimate

We benchmark CCI against the baseline institutions estimate of **\$4,000/QALY**. The core comparison is between the expected value of the Charter Cities Institute ($EV_{CCI}$) and the expected value of the baseline ($EV_{Base}$):

$$\text{Relative effectiveness} = \frac{EV_{CCI}}{EV_{Base}}$$

We decompose Expected Value ($EV$) into two components: Probability of Success ($P$) and Value of Outcome ($V$).

### 1. Probability Ratio

The baseline (US zoning reform) is estimated to have a 12% success rate, while CCI (new city governance) is estimated at 3%. This makes CCI approximately 4x less reliable:

$$P_{ratio} = \frac{P_{CCI}}{P_{Base}} = \frac{3\%}{12\%} = 0.25$$

### 2. Valuation Ratio

This captures how efficiently economic gains convert to QALYs:

- **Baseline:** Targets high-income populations (e.g., US/UK).
- **CCI:** Targets low-income populations (Global South).

Standard welfare economics suggests that increasing consumption in the latter group is approximately **50x** more effective at generating welfare (QALYs) than in the former. This means CCI outcomes are 50x more valuable per unit of economic growth:

$$V_{ratio} = \frac{V_{LMIC}}{V_{Rich}} \approx 50$$

### 3. Final cost-per-QALY calculation

Combining the factors:

$$\text{Relative Effectiveness} = P_{ratio} \times V_{ratio} = 0.25 \times 50 = 12.5$$

This implies CCI could be much more effective than the baseline institutions estimate. Converting that comparison into a cost per QALY:

$$\text{Cost per QALY}_{CCI} = \frac{\$4{,}000}{12.5} \approx \$320$$

We round this **up** to **\$400/QALY** to account for higher execution friction and "unknown unknowns" in frontier markets.

---

{{CONTRIBUTION_NOTE}}

# Internal Notes

The core argument rests entirely on the $V_{ratio}$. If the user rejects the premise that income gains in Africa are 50x more valuable than in the US, the case for a very low \$ / QALY estimate weakens substantially. However, this assumption is standard in effective altruism (logarithmic utility of income). The $P_{ratio}$ of 0.25 is a conservative estimate; if charter cities are actually impossible (0% success), the true cost per QALY would be effectively infinite. If they are easier than expected (e.g., 6%), the implied cost per QALY would be lower than the current \$400 estimate.
