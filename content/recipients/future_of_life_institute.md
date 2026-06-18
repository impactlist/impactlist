---
id: future-of-life-institute
name: 'Future of Life Institute'
categories:
  - id: ai-risk
    fraction: 1
    effects:
      - effectId: population
        multipliers:
          costPerMicroprobability: 2
---

# Justification of cost per life

We assign the Future of Life Institute a **2x cost-per-microprobability multiplier** relative to the default [AI Existential Risk](/cause/ai-risk) estimate, with a {{PLAUSIBLE_RANGE}} of **1x-10x**. Because this is a cost multiplier, 2x means we model FLI as about half as effective as the category default per dollar. This estimate is very uncertain.

The reason for the multiplier is deployment uncertainty, not a claim that FLI's broad advocacy is intrinsically worse than technical alignment work. Public information does not let us verify that most of FLI's large 2021 windfall has been spent on actual AI-risk work. FLI's filings report large 2022 transfers to affiliated organizations, while FLI's public annual reports show much lower direct operating and program activity. Because funds that remain unspent, sit in affiliated entities, or are deployed only slowly have less expected value in a fast-moving AI-risk window, we model FLI as roughly half as effective as an immediately deployed donation to the category default. ([FLI 2022 Form 990](https://pdf.guidestar.org/PDF_Images/2022/471/052/2022-471052538-202510309349301606-.pdf), [FLI 2022 Annual Report](https://futureoflife.org/wp-content/uploads/2023/10/FLI-2022-Annual-Report.pdf), [FLI 2023 Annual Report](https://futureoflife.org/wp-content/uploads/2025/06/FLI-2023-Annual-Report.pdf), [FLI finances](https://futureoflife.org/about-us/finances/))

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. FLI is genuinely focused on AI-risk-relevant policy and public advocacy, so a donation should remain in the [AI Existential Risk](/cause/ai-risk) category rather than being moved to generic advocacy or "other."
2. Deployment speed is the main discount. A fast-moving AI-risk window makes delayed or affiliate-routed funds less valuable than immediately deployed grants to a top current AI-risk organization.
3. A simple deployment-mix model is that roughly half of marginal value is equivalent to default AI-risk spending, while the other half is delayed or hard to verify and worth only about 0.2x-0.4x as much. On cost-multiplier terms, that implies roughly $1 / (0.5/1 + 0.5/3) \approx 1.5$ to $1 / (0.5/1 + 0.5/5) \approx 1.7$, which we round pessimistically to a **2x** central cost multiplier.
4. The range is wide because the public filings do not let us cleanly trace how much of the windfall has already become counterfactual AI-risk work.

The low end of the range (1x) corresponds to FLI deploying its resources quickly and counterfactually into high-quality AI-risk policy or technical work. The high end (10x) corresponds to a world where most of the relevant funds remain delayed, are routed through affiliates whose AI-risk output is hard to verify, or support broad advocacy whose marginal effect is substantially weaker than the category default.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on June 9th 2026 by GPT-5, with prompts from Impact List staff._
