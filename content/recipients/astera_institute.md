---
id: astera-institute
name: 'Astera Institute'
categories:
  - id: ai-capabilities
    fraction: 0.05
  - id: ai-risk
    fraction: 0.05
  - id: longevity
    fraction: 0.45
  - id: science-tech
    fraction: 0.35
  - id: other
    fraction: 0.10
---

# Justification of cost per life for AI Existential Risk category

_The following analysis was done on December 18th 2025, written by Claude Opus 4.5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life multiplier by analyzing the effective deployment rate of donations to Astera Institute for AI existential risk reduction specifically.

## Description of effect

This effect captures the discount applied to donations intended for AI x-risk reduction when routed through the Astera Institute. Unlike dedicated AI safety organizations (e.g., MIRI, ARC, Redwood Research), Astera operates as a multi-cause private foundation with significant endowment accumulation, low payout rates, and an AI research program (Obelisk) that primarily pursues AGI capabilities rather than traditional alignment work.

## Point Estimates

- **Cost per QALY multiplier:** 0.1x (relative to baseline AI safety organization)

If you disagree with this estimate after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. **Low Payout Rate:** Astera deploys approximately 1.4% of assets annually, compared to the 5% legal minimum for private foundations. This means donations sit in an endowment rather than funding immediate work.
2. **Low External Grant Rate:** Of funds actually spent, only ~19% (2023) flows to external organizations. The remainder funds internal operations and salaries.
3. **Capabilities vs. Safety:** Astera's AI program (Obelisk) pursues "neuroscience-informed AGI development"—this is capabilities research with safety-conscious framing, not dedicated alignment work. Only one researcher (Steve Byrnes) appears to do traditional AI safety research.
4. **Cause Area Dilution:** AI/AGI represents only ~25-35% of Astera's portfolio, with longevity research (~40%) and metascience (~20%) comprising the remainder.

## Details

### Derivation of the Multiplier (0.1x)

We calculate the effective deployment multiplier ($M$) by combining four discount factors that capture how donations are diluted before reaching AI x-risk work.

### 1. Payout Rate Discount

Astera's annual expenditure as a percentage of assets:

$$D_{payout} = \frac{\text{Actual Payout}}{\text{Standard Payout}} = \frac{1.4\%}{5\%} = 0.28$$

### 2. External Grant Discount

Percentage of expenses flowing to external organizations vs. internal operations:

$$D_{external} = \frac{\text{Grants Paid}}{\text{Total Expenses}} = \frac{\$5.3M}{\$27.5M} = 0.19$$

### 3. AI X-Risk Focus Discount

Estimated share of AI spending dedicated to genuine safety/alignment work (vs. capabilities):

$$D_{safety} = \frac{\text{Safety Work}}{\text{Total AI Work}} \approx 0.15$$

This reflects that Obelisk's primary mission is building AGI, with safety as a secondary consideration. Steve Byrnes' alignment research represents a small fraction of the AI program budget.

### 4. Cause Area Allocation Discount

AI/AGI share of Astera's total portfolio:

$$D_{cause} = \frac{\text{AI Budget}}{\text{Total Budget}} \approx 0.30$$

### 5. Final Multiplier Calculation

For donations earmarked for AI x-risk, we apply the payout and safety discounts:

$$M = D_{payout} \times D_{safety} = 0.28 \times 0.15 = 0.042$$

For unrestricted donations, we additionally apply cause allocation:

$$M_{unrestricted} = D_{payout} \times D_{cause} \times D_{safety} = 0.28 \times 0.30 \times 0.15 = 0.013$$

We use **0.1** as a rounded, conservative estimate that:

- Gives partial credit for potential future deployment of endowment
- Acknowledges some indirect safety value from Byrnes' neuroscience-informed approach
- Accounts for uncertainty in internal budget allocations

---

{{CONTRIBUTION_NOTE}}

# Internal Notes

The core argument rests on the combination of (1) endowment hoarding and (2) the Obelisk program being primarily capabilities research. If Astera dramatically increased its payout rate or pivoted Obelisk toward pure alignment work, the multiplier would improve substantially. However, current trends show declining grant percentages (from 68% in 2021 to 19% in 2023), suggesting the multiplier may worsen over time.

Comparison point: A donation to Anthropic's safety team, MIRI, or ARC would have an effective multiplier of 0.8-1.0x for AI x-risk work, making them 8-10x more efficient vehicles for this cause area.
