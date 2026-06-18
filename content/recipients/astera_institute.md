---
id: astera-institute
name: 'Astera Institute'
categories:
  - id: ai-capabilities
    fraction: 0.05
  - id: ai-risk
    fraction: 0.05
    effects:
      - effectId: population
        multipliers:
          costPerMicroprobability: 10
  - id: longevity
    fraction: 0.45
  - id: science-tech
    fraction: 0.35
  - id: other
    fraction: 0.10
---

# Justification of Astera Institute category mix and AI-risk multiplier

We model Astera Institute as a multi-cause foundation with a small AI-risk slice. The category allocation handles most of the dilution: 45% longevity, 35% science and technology, 10% other, 5% AI capabilities, and 5% AI risk. We additionally apply a **10x cost-per-microprobability multiplier** to the AI-risk slice, meaning that the AI-risk portion is modeled as about **0.1x as effective** as a donation to the default [AI Existential Risk](/cause/ai-risk) category.

## Description of effect

This effect captures two things. First, an unrestricted donation to Astera is spread across several cause areas rather than going mainly to AI risk. Second, even the AI-risk slice appears less directly targeted than a dedicated AI-safety organization: Astera operates as a multi-cause private foundation with significant endowment accumulation, low payout rates, and an AI research program (Obelisk) that appears closer to neuroscience-informed AGI research than to pure alignment or governance work.

## Point estimates and {{PLAUSIBLE_RANGES}}

- **AI-risk cost-per-microprobability multiplier:** 10x (3x-50x)
- **Equivalent AI-risk effectiveness multiplier:** 0.1x relative to the default AI-risk category

*If you disagree with this estimate after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. **Low Payout Rate:** Astera deploys approximately 1.4% of assets annually, compared to the 5% legal minimum for private foundations. This means donations sit in an endowment rather than funding immediate work. ([Astera ProPublica filing page](https://projects.propublica.org/nonprofits/organizations/845162617))
2. **Low External Grant Rate:** Of funds actually spent, only ~19% (2023) flows to external organizations. The remainder funds internal operations and salaries. We track this number as a warning sign about deployment, but do not apply it as a separate multiplier to the AI-risk slice because Astera's relevant AI work is mostly internal research rather than external grantmaking. ([Astera ProPublica filing page](https://projects.propublica.org/nonprofits/organizations/845162617))
3. **Capabilities vs. Safety:** Astera's AI program (Obelisk) pursues neuroscience-informed AGI development; this is capabilities research with safety-conscious framing, not dedicated alignment work. Steven Byrnes appears to be the clearest dedicated AI-safety researcher in the program. ([Astera Obelisk](https://astera.org/obelisk/), [Steve Byrnes](https://astera.org/team/steve-byrnes/))
4. **Cause Area Dilution:** The frontmatter already models Astera as mostly not AI risk: 45% longevity, 35% science and technology, 10% other, 5% AI capabilities, and 5% AI risk. The multiplier below applies only to the AI-risk slice.

## Details

### Derivation of the AI-risk multiplier

We calculate an effective AI-risk deployment multiplier ($M$) by combining the discount factors that capture how donations are diluted before reaching direct AI x-risk work. Because the calculator expresses AI-risk effectiveness as a cost per microprobability, an effectiveness multiplier of **0.1x** is encoded as a **10x cost-per-microprobability multiplier**.

### 1. Payout rate discount

Astera's annual expenditure as a percentage of assets:

$$D_{payout} = \frac{\text{Actual Payout}}{\text{Standard Payout}} = \frac{1.4\%}{5\%} = 0.28$$

### 2. External grant discount

Percentage of expenses flowing to external organizations vs. internal operations:

$$D_{external} = \frac{\text{Grants Paid}}{\text{Total Expenses}} = \frac{\$5.3M}{\$27.5M} = 0.19$$

### 3. AI x-risk focus discount

Estimated share of AI spending dedicated to genuine safety/alignment work (vs. capabilities):

$$D_{safety} = \frac{\text{Safety Work}}{\text{Total AI Work}} \approx 0.15$$

This reflects that Obelisk's primary mission is building AGI, with safety as a secondary consideration. Steve Byrnes' alignment research represents a small fraction of the AI program budget.

### 4. Cause area allocation discount

AI/AGI share of Astera's total portfolio:

$$D_{cause} = \frac{\text{AI Budget}}{\text{Total Budget}} \approx 0.30$$

### 5. Final multiplier calculation

For the AI-risk slice, we apply the payout and safety discounts:

$$M = D_{payout} \times D_{safety} = 0.28 \times 0.15 = 0.042$$

For unrestricted donations, we additionally apply cause allocation:

$$M_{unrestricted} = D_{payout} \times D_{cause} \times D_{safety} = 0.28 \times 0.30 \times 0.15 = 0.013$$

The raw calculation gives **0.042x** effectiveness for the AI-risk slice. We use **0.1x** as a rounded estimate that:

- gives partial credit for potential future deployment of endowment
- acknowledges some indirect safety value from neuroscience-informed or safety-conscious work
- avoids over-penalizing Astera when public budget allocations are incomplete

We do **not** multiply by $D_{external}$ in the final AI-risk-slice estimate. That factor is useful for understanding Astera as a foundation, but it is not independent of the AI-risk question: if the relevant AI work is internal Obelisk research, then a low external-grant share does not by itself mean the AI-risk slice is less deployed. Applying it on top of the payout and safety-focus discounts would likely double-count deployment uncertainty. The longevity and science-tech slices also receive no recipient-specific payout multiplier here because their category defaults already include broad marginality and additionality discounts; the extra recipient-specific adjustment is reserved for the AI-risk slice's unusual mix of endowment delay and capabilities-oriented AI work.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on December 18th 2025 by Claude Opus 4.5, with prompts from Impact List staff._

The core argument rests on the combination of (1) endowment hoarding and (2) the Obelisk program being primarily capabilities research. If Astera dramatically increased its payout rate or pivoted Obelisk toward pure alignment work, the multiplier would improve substantially. However, current trends show declining grant percentages (from 68% in 2021 to 19% in 2023), suggesting the multiplier may worsen over time.

Comparison point: A donation to a dedicated AI-risk organization would usually have an effective multiplier much closer to 1x for the AI-risk category, making it roughly an order of magnitude more direct than Astera's modeled AI-risk slice.
