---
id: thiel-fellowship
name: 'Thiel Fellowship'
categories:
  - id: education
    fraction: 1.0
---

# Justification of cost per life

The Thiel Fellowship inherits the [Education](/cause/education) category default. The case for a lower estimate rests on the Fellowship's "hits-based" strategy: it accelerates unusually high-upside talent rather than improving average educational outcomes. But most of the raw value successful fellows create should still go to selection and the fellows themselves. At the current \$200,000-\$250,000 cost per fellow, the evidence is not strong enough to justify a below-default override.

## Description of effect

This effect captures the welfare gains from the **Thiel Fellowship**, which pays unusually young founders and researchers to work full-time on entrepreneurial or scientific projects instead of following a conventional college path. The grant was historically \$100,000, and the 2026 class receives \$250,000 over two years. The baseline "Standard Education" cause raises educational attainment (e.g., university scholarships, K-12 interventions). The Thiel Fellowship instead accelerates talent. We model this as a shift from a normal-distribution strategy (lifting the average student's wages) to a power-law strategy (uncapping the upside of outlier talent). The primary impact comes from accelerating high-impact companies or projects and from the cultural signal against credentialism. ([Thiel Foundation 2026 class announcement](https://www.businesswire.com/news/home/20260420984007/en/Thiel-Foundation-Announces-2026-Class-of-Thiel-Fellows))

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** inherits the Education default, with a judgmental recipient-specific uncertainty range of roughly \$5,000-\$200,000/QALY

*If you disagree with this estimate after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1.  **Power Law Distribution:** The economic impact of the most successful Thiel Fellows (e.g., Vitalik Buterin, Dylan Field, Austin Russell) follows a Pareto distribution, whereas the impact of standard scholarship recipients follows a normal distribution. A single outlier success can generate more economic surplus than thousands of standard degrees.
2.  **The Acceleration Counterfactual:** We assume the Fellowship does not _create_ genius, but accelerates it. The value comes from moving large outcomes forward by 2-3 years and preventing high-potential talent from getting trapped in low-leverage career paths due to debt, signaling pressure, or institutional default paths.
3.  **Attribution Discount:** We apply a very large discount to the raw output of fellows, attributing the vast majority of their success to selection and innate ability. The Fellowship gets credit only for the delta of time saved, risk taken, network access, and cultural permission.
4.  **Broader Upside and Signaling:** Beyond the explicit large-company calculation below, we include a judgmental allowance for rare larger outcomes, earlier entry into frontier fields, peer-network effects, and the cultural signal that "skills > credentials." That allowance is deliberately much smaller than the total value created by high-outcome alumni.

## Details

### Why we use the category default

We benchmark the Thiel Fellowship against the education category estimate of **\$25,000/QALY**. We compare two things: the expected value of a marginal Fellowship slot ($EV_{TF}$), and what the same philanthropic budget buys through standard effective education charities ($EV_{Base}$).

$$\text{Relative effectiveness} = \dfrac{EV_{TF}}{EV_{Base}}$$

The 2026 class receives **\$250,000 over two years**, and recent donation rows also use \$200,000-\$250,000 per fellow. At that cost, the hits-based model does not clearly beat the education default.

### 1. Baseline: standard scholarship (EV_Base)

Investing **\$250,000** in standard US university scholarships.

- **Outcome:** Enables roughly 2-3 students to complete degrees with less debt.
- **Economic Value:** The present value of the "college premium" (lifetime earnings increase) is estimated at roughly **\$500,000** per successful student.
- **Probability:** High (80%+ graduation rate).

$$EV_{Base} \approx 2.5 \times \$500{,}000 \times 80\% \approx \$1{,}000{,}000$$

### 2. Intervention: Thiel Fellowship (EV_TF)

Investing **\$250,000** of current philanthropic cost in the Fellowship.

- **Probability of a very large outcome:** Based on historical cohorts (Ethereum, Figma, Luminar, OYO), we use a deliberately conservative **2%** rate for outcomes large enough, attributable enough, and independent enough to enter this calculation.
- **Value of Outcome:** The average "Unicorn" creates ~\$5B in value.
- **Attribution (The "Acceleration" Delta):** We assume the founder would have eventually succeeded, but the Fellowship accelerates this by **2 years**. The time-value of accelerating \$5B by 2 years (at 5% discount rate) is roughly **\$500M**.
- **Attribution Penalty:** To be conservative, we credit the Fellowship with only **1%** of that acceleration value, reflecting strong selection bias.

$$EV_{TF} = (2\% \text{ chance}) \times \$500{,}000{,}000 \text{ value} \times 1\% \text{ attribution}$$

$$EV_{TF} = 0.02 \times 500{,}000{,}000 \times 0.01 = \$100{,}000$$

This narrow calculation alone would make the Fellowship less effective than the baseline education benchmark. But it leaves out much of the hits-based case: rarer much-larger outcomes, earlier entry into frontier fields, network effects among fellows, and the signaling effect on non-fellows.

We treat those omitted channels as real but highly uncertain. Centrally, we add a judgmental **\$900,000** upside-and-signaling allowance to the explicit **\$100,000** large-outcome calculation, giving about **\$1 million of adjusted attributable surplus per current Fellowship slot**. This still credits the Fellowship with only a very small fraction of the value its highest-outcome alumni generate. But it avoids assuming that broad hits-based upside automatically justifies a much larger multiplier.

### 3. Final cost-per-QALY calculation

Comparing the adjusted Expected Values:

$$\text{Relative Effectiveness} = \dfrac{EV_{TF}}{EV_{Base}} = \dfrac{\$1{,}000{,}000}{\$1{,}000{,}000} = 1.0$$

This implies the Thiel Fellowship may be comparable to standard education funding under the central model. It could still be much better if the Fellowship is genuinely causal for one or more unusually large successes, but it could also be worse if most fellow outcomes would have happened anyway.

That comparison supports using the Education category default rather than a recipient-specific lower override.

The plausible recipient-specific range is roughly **\$5,000-\$200,000/QALY**. The low end corresponds to the Fellowship being genuinely causal for one or more very large successes or for a broader talent-allocation shift. The high end corresponds to the skeptical view that most fellow outcomes would have happened anyway and that the credentialism signal has little durable social value. The range is wide because the estimate is dominated by rare outcomes and attribution, not by the stipend alone.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on December 19th 2025 by Google Gemini 3 Pro, with prompts from Impact List staff._

The estimate is highly sensitive to the **Attribution** variable. If you believe Vitalik Buterin would have built Ethereum exactly as fast without Peter Thiel's money, the case for a very low \$ / QALY estimate weakens sharply. However, if you credit the Fellowship with even a modest "tipping point" effect on the crypto or hard-tech ecosystems, the ROI can still beat standard education interventions. A below-default override would need stronger source support for the hits-based attribution case.
