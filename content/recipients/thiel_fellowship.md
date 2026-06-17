---
id: thiel-fellowship
name: 'Thiel Fellowship'
categories:
  - id: education
    fraction: 1.0
    effects:
      - effectId: standard
        overrides:
          costPerQALY: 10000
---

# Justification of cost per life

_The following analysis was done on December 19th 2025, written by Google Gemini 3 Pro and edited by Impact List staff for clarity._

We assign the Thiel Fellowship a **cost per QALY of \$10,000**. The case for a low number rests on the Fellowship's "hits-based" strategy of accelerating unusually high-upside talent rather than improving average educational outcomes, but most of the raw value created by successful fellows should still be attributed to selection and the fellows themselves.

## Description of effect

This effect captures the welfare gains from the **Thiel Fellowship**, which pays unusually young founders and researchers to work full-time on entrepreneurial or scientific projects instead of following a conventional college path. The grant was historically \$100,000, and the 2026 class receives \$250,000 over two years. While the baseline "Standard Education" cause focuses on increasing educational attainment (e.g., university scholarships, K-12 interventions), the Thiel Fellowship acts as a talent-acceleration mechanism. We model this as shifting from a normal-distribution strategy (lifting the average student's wages) to a power-law strategy (uncapping the upside of outlier talent). The primary impact comes from accelerating high-impact companies or projects and from the cultural signal against credentialism. ([Thiel Foundation 2026 class announcement](https://www.businesswire.com/news/home/20260420984007/en/Thiel-Foundation-Announces-2026-Class-of-Thiel-Fellows))

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$10,000 (\$2,500-\$100,000)

*If you disagree with this estimate after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1.  **Power Law Distribution:** The economic impact of the most successful Thiel Fellows (e.g., Vitalik Buterin, Dylan Field, Austin Russell) follows a Pareto distribution, whereas the impact of standard scholarship recipients follows a normal distribution. A single outlier success can generate more economic surplus than thousands of standard degrees.
2.  **The Acceleration Counterfactual:** We assume the Fellowship does not _create_ genius, but accelerates it. The value comes from moving large outcomes forward by 2-3 years and preventing high-potential talent from getting trapped in low-leverage career paths due to debt, signaling pressure, or institutional default paths.
3.  **Attribution Discount:** We apply a very large discount to the raw output of fellows, attributing the vast majority of their success to selection and innate ability. The Fellowship gets credit only for the delta of time saved, risk taken, network access, and cultural permission.
4.  **Broader Upside and Signaling:** Beyond the explicit large-company calculation below, we include a judgmental allowance for rare larger outcomes, earlier entry into frontier fields, peer-network effects, and the cultural signal that "skills > credentials." That allowance is deliberately much smaller than the total value created by high-outcome alumni.

## Details

### Deriving the \$10,000/QALY estimate

We benchmark the Thiel Fellowship against the current baseline education estimate of **\$25,000/QALY**. The key comparison is between the expected value of a marginal Fellowship slot ($EV_{TF}$) and what the same philanthropic budget would buy through standard effective education charities ($EV_{Base}$).

$$\text{Relative effectiveness} = \dfrac{EV_{TF}}{EV_{Base}}$$

We analyze the expected value of a normalized \$100,000 investment in both scenarios, then apply the same relative-effectiveness ratio to the education baseline.

### 1. Baseline: standard scholarship (EV_Base)

Investing \$100,000 in a standard US university scholarship.

- **Outcome:** Enables ~1 student to complete a degree without debt.
- **Economic Value:** The present value of the "college premium" (lifetime earnings increase) is estimated at roughly **\$500,000**.
- **Probability:** High (80%+ graduation rate).

$$EV_{Base} \approx \$400{,}000$$

### 2. Intervention: Thiel Fellowship (EV_TF)

Investing \$100,000 of normalized philanthropic cost in the Fellowship.

- **Probability of a very large outcome:** Based on historical cohorts (Ethereum, Figma, Luminar, OYO), we use a deliberately conservative **2%** rate for outcomes large enough, attributable enough, and independent enough to enter this calculation.
- **Value of Outcome:** The average "Unicorn" creates ~\$5B in value.
- **Attribution (The "Acceleration" Delta):** We assume the founder would have eventually succeeded, but the Fellowship accelerates this by **2 years**. The time-value of accelerating \$5B by 2 years (at 5% discount rate) is roughly **\$500M**.
- **Attribution Penalty:** To be conservative, we credit the Fellowship with only **1%** of that acceleration value, reflecting strong selection bias.

$$EV_{TF} = (2\% \text{ chance}) \times \$500{,}000{,}000 \text{ value} \times 1\% \text{ attribution}$$

$$EV_{TF} = 0.02 \times 500{,}000{,}000 \times 0.01 = \$100{,}000$$

That deliberately narrow calculation alone would make the Fellowship less effective than the baseline education benchmark. The reason not to stop there is that it excludes much of the hits-based case: rarer much-larger outcomes, earlier entry into frontier fields, network effects among fellows, and the signaling effect on non-fellows.

We treat those omitted channels as real but highly uncertain. Centrally, we add a judgmental **\$900,000** upside-and-signaling allowance to the explicit **\$100,000** large-outcome calculation, giving about **\$1 million of adjusted attributable surplus per \$100,000 of normalized Fellowship spending**. This still credits the Fellowship with only a very small fraction of the value generated by its highest-outcome alumni, but avoids assuming that broad hits-based upside automatically justifies a much larger multiplier.

### 3. Final cost-per-QALY calculation

Comparing the adjusted Expected Values:

$$\text{Relative Effectiveness} = \dfrac{EV_{TF}}{EV_{Base}} = \dfrac{\$1{,}000{,}000}{\$400{,}000} = 2.5$$

This implies the Thiel Fellowship could be more effective than standard education funding due to the power law of innovation, while still leaving most alumni success attributed to selection and the fellows themselves.

Applying that comparison to the baseline:

$$\text{Cost per QALY}_{TF} = \dfrac{\$25{,}000}{2.5} = \$10{,}000$$

The plausible range is **\$2,500-\$100,000/QALY**. The low end corresponds to the Fellowship being genuinely causal for one or more very large successes or for a broader talent-allocation shift. The high end corresponds to the skeptical view that most fellow outcomes would have happened anyway and that the credentialism signal has little durable social value. The range is wide because the estimate is dominated by rare outcomes and attribution, not by the size of the stipend.

{{CONTRIBUTION_NOTE}}

# Internal Notes

The estimate is highly sensitive to the **Attribution** variable. If you believe Vitalik Buterin would have built Ethereum exactly as fast without Peter Thiel's money, the case for a very low \$ / QALY estimate weakens sharply. However, if you credit the Fellowship with even a modest "tipping point" effect on the crypto or hard-tech ecosystems, the ROI can still beat standard education interventions. The \$10,000/QALY estimate acknowledges the massive "hits" while heavily discounting for selection bias.
