---
id: thiel-fellowship
name: 'Thiel Fellowship'
categories:
  - id: education
    fraction: 1.0
    effects:
      - effectId: standard
        overrides:
          costPerQALY: 5_900
---

# Justification of cost per life

We assign the Thiel Fellowship a **cost per QALY of \$5,900**. That is about four times better than the default [Education](/cause/education) estimate of **\$25,000/QALY**. A \$250,000 Fellowship slot would buy about 10 QALYs at the education default; our recipient-specific model estimates about 43 QALYs.

This is not because the Fellowship is a normal education program. It is a hits-based talent intervention: it gives unusually young founders money, permission, and a network at the point when a different life path may still be possible.

The estimate is very uncertain. Most of the value comes from rare outlier outcomes, and those are hard to attribute. The central case only needs a small share of large alumni outcomes to be caused or materially accelerated by the Fellowship. The skeptical case is also real, so the range is wide.

## Description of effect

This effect captures the welfare gains from the **Thiel Fellowship**, a two-year program for young people who want to build companies, research projects, or other ambitious work instead of following a conventional college path. The Fellowship gives **\$250,000 over two years**, does not take equity, and gives fellows access to a network of founders, investors, scientists, and former fellows. ([Thiel Fellowship](https://thielfellowship.org/), [FAQ](https://thielfellowship.org/faq), [2026 class announcement](https://www.businesswire.com/news/home/20260420984007/en/Thiel-Foundation-Announces-2026-Class-of-Thiel-Fellows))

We model this as a **power-law talent accelerator**. The ordinary education category estimates the value of raising average attainment and student wellbeing. The Thiel Fellowship instead aims to change the path of a small number of unusually high-upside people. The core question is not whether fellows are talented — they clearly are. The question is how often the Fellowship changes what they do, rather than merely identifying people who would have done the same thing anyway.

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$5,900 (\$1,000-\$100,000)

*If you disagree with this estimate after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. **Current cost per fellow:** The current grant is **\$250,000 over two years**. We use this as the cost of one marginal Fellowship slot. ([FAQ](https://thielfellowship.org/faq))
2. **Chance of a large outcome:** We use **2%** as the best guess that a marginal fellow produces a large, socially valuable outcome that belongs in this calculation, with a plausible range of **0.5%-6%**. The raw public record points higher: the 2026 announcement says prior fellows have founded Anthropic, Cognition, Etched, Ethereum, Figma, Fluidstack, Mercor, Positron, and companies or projects collectively worth hundreds of billions of dollars. But a marginal slot should be lower than the observed alumni average because the famous cohorts are selected, many younger fellows have not matured, and some successes may be socially ambiguous. ([2026 class announcement](https://www.businesswire.com/news/home/20260420984007/en/Thiel-Foundation-Announces-2026-Class-of-Thiel-Fellows))
3. **Net social value of a large outcome:** We use **\$1 billion** of net social value per large outcome, with a plausible range of **\$200 million-\$5 billion**. This is not the same as market valuation or founder wealth. It is meant to net out rent capture, duplicated effort, and cases where the social value of a company is much lower than its valuation.
4. **Track-change share:** We assume the Fellowship is decisive for **15%** of large outcomes, with a plausible range of **5%-40%**. "Decisive" means the fellow probably would not have built the same thing, or not on anything like the same path, without the grant, dropout requirement, social permission, and network.
5. **Acceleration for the remaining outcomes:** For the **85%** of large outcomes that would probably have happened anyway, we use a **10% average acceleration value**, with a plausible range of **0%-20%**. This is an average across the group: some fellows get no acceleration, while others might move a large outcome forward by several years. A 10% value is roughly the time value of moving an outcome forward by about two years at a 5% annual discount rate. We do **not** apply a further generic attribution penalty to this acceleration value: if the Fellowship caused the acceleration, that acceleration is already the counterfactual contribution.
6. **Money-to-QALY conversion:** We use **\$110,000/QALY**, with a plausible range of **\$100,000-\$115,000/QALY**, matching the education category's money-metric conversion for rich-country welfare gains. ([Education](/cause/education))

## Details

### Central calculation

We estimate the expected value of one marginal Fellowship slot directly, rather than benchmarking it to ordinary education programs.

The model is:

$$
EV_{\text{TF}} = p_{\text{large}} \times V_{\text{large}} \times \left(s_{\text{track}} + (1 - s_{\text{track}}) \times a_{\text{accel}}\right)
$$

Where:

- $p_{\text{large}}$ is the chance of a large socially valuable outcome
- $V_{\text{large}}$ is the net social value if that outcome happens
- $s_{\text{track}}$ is the share of large outcomes where the Fellowship changes the fellow's life track
- $a_{\text{accel}}$ is the value of accelerating outcomes that would have happened anyway

Using the central assumptions:

$$
EV_{\text{TF}} = 0.02 \times 1{,}000{,}000{,}000 \times (0.15 + 0.85 \times 0.10) \approx \$4{,}700{,}000
$$

Using the **\$110,000/QALY** money-metric welfare conversion from the assumptions above, that is:

$$
Q_{\text{TF}} \approx \frac{\$4{,}700{,}000}{\$110{,}000/\text{QALY}} \approx 43 \text{ QALYs}
$$

At **\$250,000** per slot:

$$
\text{Cost per QALY} \approx \frac{\$250{,}000}{43} \approx \$5{,}900
$$

### Why use a recipient-specific estimate

The education default is **\$25,000/QALY**. It is anchored on programs like college-completion support and schoolwide wellbeing interventions. Those have stronger causal evidence, but lower upside per participant.

The Thiel Fellowship is different. A 2% chance of a \$1B net-social-value outcome is \$20M before attribution. Crediting the Fellowship with 15% track-change value plus 10% average acceleration value for the rest gives about \$4.7M of expected value per slot, or about 43 QALYs after the money-to-QALY conversion.

That gives a central estimate of about **\$5,900/QALY**. The skeptical case is live: maybe the fellows would have made the same companies anyway, maybe many outcomes are mostly private value, or maybe marginal fellows are weaker than the famous early cohorts. Those objections drive the high end of the range.

### Plausible range

The plausible range is **\$1,000-\$100,000/QALY**.

The range is asymmetric around the central estimate. The high-cost tail is wider because several doubts can move together: selection may explain most outcomes, marginal fellows may be weaker, and market value may overstate social value. The low-cost tail is bounded because even favorable assumptions still depend on rare large outcomes and partial attribution.

The low end corresponds to a world where the historical hit rate generalizes reasonably well, some large outcomes really depend on the Fellowship, and net social value is close to the headline scale of the best alumni companies. The high end corresponds to a skeptical world where selection explains most of the observed success, marginal fellows are weaker than the famous cohorts, and many large outcomes have much lower net social value than their market valuations suggest.

The range is wide because this is a hits-based estimate. Small changes in the large-outcome rate, the track-change share, or the net-social-value estimate move the result by a lot.

{{CONTRIBUTION_NOTE}}

# Internal Notes

June 2026 revision: replaced the category-default model with a recipient-specific expected-value model. The key calibration question is whether the central assumptions -- 2% large-outcome rate, \$1B net social value, 15% track-change share, 10% average acceleration, and \$110,000/QALY conversion -- are best-guess medians rather than conservative or optimistic endpoints.

The estimate is highly sensitive to the causal share assigned to the Fellowship. The central model gives the Fellowship credit for 15% of large outcomes as true track changes, plus 10% average acceleration value for the rest. If the true track-change share is near zero and most alumni outcomes are mostly selection, the estimate can easily be worse than the education default. If the Fellowship is often decisive for unusually high-upside founders, the cost per QALY could be much lower than the published point estimate.
