---
id: ai-risk
name: 'AI Existential Risk'
effects:
  - effectId: population
    startTime: 15
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 1_000_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: 0.9
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High) and Claude Opus 4.6 (Max), with prompts from Impact List staff._

Unlike a typical cause area, donations to AI existential-risk charities are best modeled as slightly reducing the probability of a catastrophe rather than directly buying QALYs. We therefore estimate the cost of averting one **microprobability**: a one-in-a-million absolute reduction in the probability of AI-caused human extinction.

## Description of effect

This effect captures welfare gains from reducing the probability that misaligned AGI or ASI causes **literal human extinction**. Many AI risk discussions also include similarly permanent catastrophes such as irreversible disempowerment or totalitarian lock-in. We do **not** model those here; the goal is to keep the event definition clean and tightly connected to the population-level effect we are modeling.

## Point Estimates

- **Cost per microprobability:** \$1 million (\$200,000–\$16 million)
- **Population fraction affected:** 1.0 (by definition, everyone dies)
- **QALY improvement per affected person per year:** 0.9 (0.75–1.0)
- **Start time:** 15 years (~2041)
- **Duration:** Defined by global time limit parameter (default is 100 years)

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. The baseline probability of AI-caused extinction this century is approximately 8%, with a plausible range around 2–25%. ([See detailed justification](/assumption/ai-doom-probability))
2. The aggregate median forecast for high-level machine intelligence (HLMI) is around 2047, but with substantial probability mass in the 2030s and early 2040s. ([Grace et al. 2024](https://arxiv.org/abs/2401.02843))
3. World population at the relevant horizon is roughly 10–10.5 billion. ([UN 2024](https://population.un.org/wpp/assets/Files/WPP2024_Summary-of-Results.pdf))
4. Average human life-years are worth roughly 0.85–0.9 QALYs, so 0.9 is a reasonable all-things-considered central value. ([WHO](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy), [Our World in Data](https://ourworldindata.org/life-expectancy))
5. Cumulative AI safety spending through 2025 is roughly \$1 billion, probably in the high hundreds of millions to low single-digit billions. ([McAleese 2025 update](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation), [Open Philanthropy](https://www.openphilanthropy.org/focus/potential-risks-advanced-ai/))
6. Roughly \$1 billion of historical AI safety spending has probably reduced extinction risk by about 0.1 percentage points, with a plausible positive range around 0.01–0.5 percentage points. ([See detailed justification](/assumption/effect-of-all-ai-safety-spending))
7. A frontier AI safety researcher costs roughly \$0.5–0.8 million per year fully loaded, implying roughly \$8–16 million for a 15–20 year career. ([OpenAI careers](https://openai.com/careers/research-scientist), [Anthropic careers](https://www.anthropic.com/careers))
8. A strong additional AI safety career plausibly averts 1–50 microdooms, with a rough central estimate around 10. ([Jurkovic 2023](https://www.lesswrong.com/posts/mTtxJKN3Ew8CAEHGr/microdooms-averted-by-working-on-ai-safety))

## Details

### Cost per Microprobability

The point estimate (\$1 million per microprobability) and range (\$200,000–\$16 million) are derived from two approaches.

**Approach 1 — Field-level estimate**

The most direct anchor is the estimate of what historical AI safety spending has already achieved. Per Assumptions 5 and 6, roughly \$1 billion of spending has probably reduced extinction risk by about **0.1 percentage points**:

- Microprobabilities averted: 0.001 / 10^-6 = 1,000
- Cost per microprobability: \$1B / 1,000 = **\$1 million**

Pessimistic case: 0.01 percentage points -> **\$10 million** per microprobability  
Optimistic case: 0.5 percentage points -> **\$200,000** per microprobability

This estimate is already net of positive and negative effects, because the underlying assumption page explicitly tries to account for both.

**Approach 2 — Career-level estimate**

A "microdoom" in this context is the same thing as a one-in-a-million reduction in AI existential risk, i.e. a microprobability reduction for the specific event we are modeling here. Jurkovic (2023) explores several rough models for how much risk reduction an additional AI safety professional might achieve. Those models often yield figures above 10 microdooms for especially strong contributors, but the uncertainty is extremely large.

Using a central estimate of **10 microdooms per career** and a typical career cost of roughly **\$10 million** (Assumptions 7 and 8):

$$
\text{Cost per microprobability} \approx \dfrac{\$10{,}000{,}000}{10} = \$1{,}000{,}000
$$

Best case: \$8M cost and 50 microdooms -> **\$160,000** per microprobability  
Worst case: \$16M cost and 1 microdoom -> **\$16 million** per microprobability

**Combined**

Both approaches land close to **\$1 million per microprobability**, which is why we use that as the point estimate. Given the uncertainty, one significant digit is appropriate.

The stated range (**\$200,000–\$16 million**) takes the widest bounds across both approaches rather than the range from either single approach alone.

The field-level estimate is based on the historical average effect of AI safety spending to date, while this page is meant to model forward-looking marginal donations to strong charities. The best marginal opportunities may be better than the historical average dollar, but that is at least partly offset by diminishing returns and by the field becoming larger and more crowded, so we treat the historical estimate as a reasonable starting point rather than automatically adjusting it upward.

### Population Fraction Affected

The point estimate (1.0) reflects that the modeled event is extinction. If the event happens, everyone dies.

This is narrower than many survey questions about "extremely bad outcomes," which often include permanent disempowerment or dystopia as well as extinction. We intentionally exclude those broader catastrophes here rather than trying to partially model them.

### QALY Improvement per Affected Person per Year

The point estimate (0.9) and range (0.75–1.0) represent the average quality-of-life weight of human existence.

WHO healthy-life-expectancy data imply that the average human year is somewhat below a perfect-health year but still substantially positive (Assumption 4). We use **0.9** rather than a lower number because this category is meant to capture all-things-considered human welfare, not just physical health: relationships, agency, culture, achievement, enjoyment, and ordinary life experience all matter.

**How total QALYs scale with time limit:**

With world population of ~10 billion (Assumption 3) and 0.9 QALYs per person per year:

**Example 1 — Time limit = 40 years (roughly currently alive people only):**

- Total QALYs lost: 10B × 0.9 × 40 = **360 billion QALYs**
- QALYs saved per microprobability: 360B × 10^-6 = 360,000
- Cost per QALY: \$1M / 360,000 ≈ **\$2.8/QALY**

**Example 2 — Time limit = 100 years (default, ~2–3 generations):**

- Total QALYs lost: 10B × 0.9 × 100 = **900 billion QALYs**
- QALYs saved per microprobability: 900B × 10^-6 = 900,000
- Cost per QALY: \$1M / 900,000 ≈ **\$1.1/QALY**

**Example 3 — Time limit = 1,000 years (~25 generations):**

- Total QALYs lost: 10B × 0.9 × 1,000 = **9 trillion QALYs**
- QALYs saved per microprobability: 9T × 10^-6 = 9 billion
- Cost per QALY: \$1M / 9B ≈ **\$0.00011/QALY**

These examples assume constant population for simplicity. The actual calculation uses global parameters that define the future population curve, so scaling may not be exactly linear.

These implied cost-per-QALY figures are extremely low relative to GiveWell-style global-health benchmarks. That is not unique to this page; it is a general feature of existential-risk expected-value models when you combine very large stakes with a nontrivial probability of catastrophe and at least modest tractability. It also means the result is highly sensitive to a few contestable assumptions, especially the baseline extinction probability, the effectiveness of marginal safety work, and the chosen time limit. Readers who think the implied \$1.1/QALY at the default 100-year horizon is too optimistic should treat those inputs as the main levers to revisit.

### Start Time

The 15-year start time means the main risk arrives around **2041**. This is earlier than the 50% date in the Grace et al. survey for high-level machine intelligence (2047), but that seems appropriate for two reasons:

1. Catastrophic risk could become serious **before** full economy-wide AI performance at roughly HLMI level if systems become strategically dangerous first.
2. We still need a round number that is not too anchored on the exact median of one survey.

So 15 years is a compromise between very short timelines and much slower views.

### Duration

The duration is controlled by the global "time limit" parameter, which defaults to 100 years. Because extinction eliminates all future generations within the chosen horizon, the value of this cause area is extremely sensitive to how much weight you place on future people.

Example time limits:

- **40 years** counts roughly the remaining lives of people alive today
- **100 years** (default) includes the next few generations
- **1,000 years** includes many descendant generations
- **Up to 1 trillion years** for users who want a fully longtermist view

## What Kinds of Charities Are We Modeling?

These estimates assume marginal donations go to **high-leverage, explicitly existential-risk-focused AI safety charities**, not generic AI ethics or capabilities work. Representative activities include:

**Technical alignment and control work**

- Detecting deceptive or misaligned behavior in frontier models
- Improving interpretability and auditing tools
- Building better dangerous-capability evaluations and red-teaming methods
- Research on scalable oversight, control, and monitoring

**Governance and policy**

- Frontier-model standards, eval requirements, and deployment thresholds
- Government AI safety institutes, incident reporting, and compute governance
- International coordination that reduces racing pressure
- Corporate governance and lab policy work

**Field-building and capacity building**

- Training strong technical and governance talent
- Fellowships, bootcamps, mentoring, and career transition programs
- Building institutions that can absorb more excellent safety talent over time

We are **not** modeling generic "AI for good" work, ordinary responsible-AI work focused only on bias/privacy, or projects that mainly make frontier systems more capable.

## Key Uncertainties

1. **How high the underlying extinction risk really is.** If AI extinction risk is closer to 1% than 20%, the cause is still important but the case is less overwhelming.

2. **How effective current interventions are at the margin.** This is the biggest empirical uncertainty. The best current interventions may be much better than the average dollar spent so far, or they may hit severe diminishing returns.

3. **Whether safety work partly accelerates capabilities.** Some "safety" work improves model robustness, usefulness, or legitimacy, which can have offsetting effects.

4. **Whether current safety techniques scale to genuinely superhuman systems.** Existing work may help a lot, help a little, or mostly buy time without solving the hard part.

5. **Timelines.** If transformative AI arrives very soon, there is less time for philanthropy to matter. If it arrives much later, today's work may need to be refreshed over decades.

6. **How much moral weight to put on future generations.** The default 100-year time limit puts much less weight on very distant future generations than fully longtermist views do. Users can adjust it.

7. **What to do about non-extinction catastrophes.** Permanent disempowerment, totalitarian lock-in, or civilizational collapse without extinction are real concerns, but they are not counted here. Including them would push the estimate lower than \$1 million per microprobability.

{{CONTRIBUTION_NOTE}}

# Internal Notes
