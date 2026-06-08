---
id: ai-risk
name: 'AI Existential Risk'
effects:
  - effectId: population
    startTime: 15
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 770_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: 0.75
---

# Justification of cost per life

_The following analysis was done on April 15th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

Unlike a typical cause area, donations to AI existential-risk charities are best modeled as slightly reducing the probability of a catastrophe rather than directly buying QALYs. We therefore estimate the cost of averting one **microprobability**: a one-in-a-million absolute reduction in the probability of an **AI-caused existential catastrophe**.

## Description of effect

This effect captures welfare gains from reducing the probability that advanced AI causes an existential catastrophe: either **literal human extinction**, or a permanent global outcome such as **irreversible disempowerment** or **stable totalitarian lock-in** severe enough to permanently and drastically curtail humanity's future.

This broader event definition matches the standard existential-risk framing more closely than extinction-only modeling does. It also better fits how many expert surveys and technical arguments are actually framed: not just around everyone dying, but around humanity irreversibly losing the ability to choose its own future.

## What Kinds of Charities Are We Modeling?

These estimates are for **high-leverage, explicitly existential-risk-focused AI safety charities**: technical alignment and control work, governance and standards work aimed at reducing catastrophic risk, and field-building that increases strong safety talent or institutional capacity.

They are **not** estimates for generic AI ethics, ordinary responsible-AI work focused mainly on bias or privacy, or projects that mainly make frontier systems more capable.

## Point Estimates

- **Cost per microprobability:** \$770,000 (\$123,000–\$8 million)
- **Population fraction affected:** 1.0 (the modeled event is global by construction)
- **QALY improvement per affected person per year:** 0.75 (0.5–0.9)
- **Start time:** 15 years (~2041)
- **Duration:** Defined by global time limit parameter (default is 100 years)

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. The baseline probability of AI-caused existential catastrophe this century is approximately 12%, with a plausible range around 3–35%. A useful decomposition is about 8% extinction risk plus about 4 percentage points of additional irreversible-disempowerment or lock-in risk. ([See detailed justification](/assumption/ai-existential-catastrophe-probability))
2. The aggregate median forecast for high-level machine intelligence (HLMI) is around 2047, but with substantial probability mass in the 2030s and early 2040s. ([Grace et al. 2024](https://arxiv.org/abs/2401.02843))
3. World population at the relevant horizon is roughly 10–10.5 billion. ([UN 2024](https://population.un.org/wpp/assets/Files/WPP2024_Summary-of-Results.pdf))
4. Conditional on such a catastrophe occurring, the average welfare shortfall is roughly 0.75 QALY-equivalents per affected person per year, with a plausible range of 0.5–0.9. ([See detailed justification](/assumption/ai-existential-catastrophe-severity))
5. Cumulative AI safety spending through 2025 is roughly \$1 billion, probably in the high hundreds of millions to low single-digit billions. ([McAleese 2025 update](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation), [Open Philanthropy](https://www.openphilanthropy.org/focus/potential-risks-advanced-ai/))
6. Roughly \$1 billion of historical AI safety spending has probably reduced AI-caused existential-catastrophe risk by about 0.13 percentage points, with a plausible positive range around 0.013–0.65 percentage points. ([See detailed justification](/assumption/effect-of-all-ai-safety-spending-on-ai-existential-catastrophe))
7. A frontier AI safety researcher costs roughly \$0.5–0.8 million per year fully loaded, implying roughly \$8–16 million for a 15–20 year career. ([OpenAI careers](https://openai.com/careers/research-scientist), [Anthropic careers](https://www.anthropic.com/careers))
8. A strong additional AI safety career plausibly averts about 2–65 microcatastrophes, with a rough central estimate around 13. This is an inference from extinction-focused career estimates plus partial overlap with non-extinction catastrophe channels such as irreversible disempowerment and lock-in. ([Jurkovic 2023](https://www.lesswrong.com/posts/mTtxJKN3Ew8CAEHGr/microdooms-averted-by-working-on-ai-safety))

## Details

### Cost per Microprobability

The point estimate (\$770,000 per microprobability) and range (\$123,000–\$8 million) are derived from two approaches.

**Approach 1 — Field-level estimate**

The most direct anchor is the estimate of what historical AI safety spending has already achieved. Per Assumptions 5 and 6, roughly \$1 billion of spending has probably reduced AI-caused existential-catastrophe risk by about **0.13 percentage points**:

- Microprobabilities averted: `0.0013 / 10^-6 = 1,300`
- Cost per microprobability: `\$1B / 1,300 ≈ \$769,000`

Pessimistic case: `0.013` percentage points -> about **\$7.7 million** per microprobability  
Optimistic case: `0.65` percentage points -> about **\$154,000** per microprobability

This estimate is already meant to be net of positive and negative effects, because the underlying assumption page explicitly tries to account for both. It also includes more than just extinction-prevention channels: the same technical, governance, and institutional work can bear on irreversible disempowerment and lock-in as well, though probably not quite as strongly as they bear on literal extinction.

**Approach 2 — Career-level estimate**

Jurkovic (2023) frames career impact in extinction-focused "microdoom" terms. Once the modeled event also includes irreversible disempowerment and stable lock-in, it is reasonable to scale those extinction-focused anchors upward somewhat rather than leaving them unchanged, because governance, evals, control work, and institution-building can reduce non-extinction catastrophe channels too. But the uplift should be smaller than a full proportional scaling, because some of the extra non-extinction risk mass is less directly targeted by the historical technical portfolio.

Using a central estimate of **13 microcatastrophes per career** and a typical career cost of roughly **\$10 million** (Assumptions 7 and 8):

- Cost per microprobability: `\$10,000,000 / 13 ≈ \$769,000`

Best case: `\$8M / 65 ≈ \$123,000` per microprobability  
Worst case: `\$16M / 2 = \$8 million` per microprobability

**Combined**

Both approaches land near **\$770,000 per microprobability**, which is why we use that as the point estimate.

The stated range (**\$123,000–\$8 million**) takes the widest bounds across both approaches rather than the range from either single approach alone.

The field-level estimate is based on the historical average effect of AI safety spending to date, while this page is meant to model forward-looking marginal donations to strong charities. The best marginal opportunities may be better than the historical average dollar, but that is at least partly offset by diminishing returns and by the field becoming larger and more crowded, so we treat the historical estimate as a reasonable starting point rather than automatically adjusting it upward.

### Population Fraction Affected

The point estimate (1.0) reflects that the modeled event is global by construction.

In literal extinction, everyone dies. In irreversible disempowerment or stable lock-in, people may remain alive, but the catastrophe still affects the whole population. We therefore model the difference between extinction and non-extinction catastrophes through the **severity per person-year**, not by shrinking the affected population.

This is a simplifying convention. In real lock-in or disempowerment scenarios the intensity of harm could be uneven across people, but the model absorbs that heterogeneity into the severity term rather than trying to split the world into fully affected and partially affected sub-populations.

### QALY Improvement per Affected Person per Year

The point estimate (0.75) and range (0.5–0.9) represent the average welfare shortfall of the broader catastrophe class we are modeling.

Extinction is close to a full loss of human life-years, so it belongs near the top of the range. Permanent disempowerment or totalitarian lock-in is somewhat less severe per person-year because many people remain alive, but it can still destroy much of what makes human futures valuable: agency, autonomy, pluralism, culture, relationships under self-direction, and the ability of civilization to revise course. So the right central value is lower than extinction-only modeling, but still very high.

**How total QALYs scale with time limit:**

With world population of about 10 billion (Assumption 3) and 0.75 QALY-equivalents per person per year:

**Example 1 — Time limit = 40 years**

- Total QALYs lost: `10B x 0.75 x 40 = 300 billion QALYs`
- QALYs saved per microprobability: `300B x 10^-6 = 300,000`
- Cost per QALY: `\$770,000 / 300,000 ≈ \$2.6/QALY`

**Example 2 — Time limit = 100 years**

- Total QALYs lost: `10B x 0.75 x 100 = 750 billion QALYs`
- QALYs saved per microprobability: `750B x 10^-6 = 750,000`
- Cost per QALY: `\$770,000 / 750,000 ≈ \$1.0/QALY`

**Example 3 — Time limit = 1,000 years**

- Total QALYs lost: `10B x 0.75 x 1,000 = 7.5 trillion QALYs`
- QALYs saved per microprobability: `7.5T x 10^-6 = 7.5 million`
- Cost per QALY: `\$770,000 / 7.5M ≈ \$0.10/QALY`

These examples assume constant population for simplicity. The actual calculation uses global parameters that define the future population curve, so scaling may not be exactly linear.

These implied cost-per-QALY figures are extremely low relative to GiveWell-style global-health benchmarks. That is not unique to this page; it is a general feature of existential-risk expected-value models when you combine very large stakes with a nontrivial probability of catastrophe and at least modest tractability. It also means the result is highly sensitive to a few contestable assumptions, especially the baseline catastrophe probability, the effectiveness of marginal safety work, the severity assigned to non-extinction catastrophes, and the chosen time limit.

### Start Time

The 15-year start time means the main risk arrives around **2041**. This is earlier than the 50% date in the Grace et al. survey for high-level machine intelligence (2047), but that still seems appropriate for two reasons:

1. Catastrophic risk could become serious **before** full economy-wide AI performance at roughly HLMI level if systems become strategically dangerous first.
2. We still need a round number that is not too anchored on the exact median of one survey.

So 15 years is a compromise between very short timelines and much slower views.

### Duration

The duration is controlled by the global "time limit" parameter, which defaults to 100 years. The very large `windowLength` in the YAML frontmatter is just a ceiling so the calculator can accommodate long horizons; in practice the effect is clamped by the user's chosen global time-limit parameter.

Because the modeled catastrophe is permanent by construction, the value of this cause area is highly sensitive to how much weight you place on future people.

## Key Uncertainties

1. **How high the underlying catastrophe risk really is.** If AI existential catastrophe risk is closer to 3% than 20%, the cause is still important but the case is less overwhelming.

2. **How effective current interventions are at the margin.** This is the biggest empirical uncertainty. The best current interventions may be much better than the average dollar spent so far, or they may hit severe diminishing returns.

3. **Whether safety work partly accelerates capabilities.** Some "safety" work improves model robustness, usefulness, or legitimacy, which can have offsetting effects.

4. **Whether current safety techniques scale to genuinely superhuman systems.** Existing work may help a lot, help a little, or mostly buy time without solving the hard part.

5. **How severe non-extinction catastrophes are relative to extinction.** Permanent lock-in or disempowerment is not best modeled as ordinary bad policy, but it is also not literally identical to everyone dying.

6. **Timelines.** If transformative AI arrives very soon, there is less time for philanthropy to matter. If it arrives much later, today's work may need to be refreshed over decades.

7. **Where to draw the boundary around the modeled event.** AI can worsen surveillance, repression, and concentration of power by many degrees. The hard question is which of those pathways are merely very bad and which are global, effectively irreversible, and severe enough to count as permanent curtailment of humanity's future.

8. **How much moral weight to put on future generations.** The default 100-year time limit puts much less weight on very distant future generations than fully longtermist views do. Users can adjust it.

{{CONTRIBUTION_NOTE}}

# Internal Notes
