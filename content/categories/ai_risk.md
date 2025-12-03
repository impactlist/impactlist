---
id: ai-risk
name: 'AI Existential Risk'
effects:
  - effectId: population
    startTime: 15
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 700_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: 1.0
---

# Justification of cost per life

_The following analysis was done on November 15th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

Unlike a "normal" cause category where we estimate cost per QALY, donations to AI existential risk charities aim to avert a low-probability but truly catastrophic event. We define such an event, estimate how many people it would affect and harm, and estimate the cost of reducing its probability by one in a million.

## Description of effect

This effect captures welfare gains from reducing the probability of human extinction caused by misaligned artificial general intelligence (AGI) or artificial superintelligence (ASI). The concern is that sufficiently capable AI systems could pursue goals not aligned with human values, either from specification failures or unintended instrumental drives like resource acquisition and self-preservation.

## Point Estimates

- **Cost per microprobability:** \$700,000 (\$50,000–\$10 million)
- **Population fraction affected:** 1.0 (by definition, everyone dies)
- **QALY improvement per affected person per year:** 0.9 (0.7–1.0)
- **Start time:** 15 years
- **Duration:** Defined by global time limit parameter (default is 100 years)

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. The baseline probability of AI-caused extinction this century is approximately 10%. ([See detailed justification](/assumption/ai-doom-probability))
2. Global life expectancy is ~73 years; healthy life expectancy (HALE) is ~63–64 years, implying average quality weight ~0.85–0.9. ([WHO](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy), [Our World in Data](https://ourworldindata.org/life-expectancy))
3. World population projected to peak at ~10.3 billion in the 2080s. ([UN 2024](https://population.un.org/wpp/publications/files/wpp2024_summary_of_results.pdf))
4. For currently alive people, average remaining life expectancy is ~40 years with ~0.9 quality weight, yielding ~36 QALYs per person.
5. Cumulative AI safety spending through 2025 is approximately \$1 billion (Open Philanthropy ~\$400M, SFF ~\$53M, FTX Future Fund ~\$32M, LTFF ~\$10M, plus lab safety teams ~\$32M/year and government programs). ([EA Forum](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation), [TIME](https://time.com/7012763/cari-tuna/))
6. This cumulative spending has reduced extinction risk by approximately 0.2 percentage points (range 0.02–2pp). This is a rough estimate based on the field's influence on lab practices, public policy, and scientific debate. ([See detailed justification](/assumption/effect-of-all-ai-safety-spending))
7. Total cost per AI safety employee is approximately 2× salary (~\$400–500k/year) including benefits, compute, and overhead. ([EA Forum](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation))
8. AI research scientist salaries in the US are ~\$180–220k/year. ([Glassdoor](https://www.glassdoor.com/Salaries/ai-research-scientist-salary-SRCH_KO0%2C21.htm))
9. One AI safety career may avert 1–50 microdooms (one-in-a-million risk reductions), with central estimate ~10. ([Jurkovic 2023](https://www.lesswrong.com/posts/mTtxJKN3Ew8CAEHGr/microdooms-averted-by-working-on-ai-safety))

## Details

### Cost per Microprobability

The point estimate (\$700,000/microprobability) and range (\$50,000–\$10 million) are derived from two approaches.

**Approach 1 — Field-level estimate:**

We estimate how much risk reduction ~\$1 billion in cumulative AI safety spending (Assumption 5) has achieved. Many visible AI safety ideas—alignment, RLHF, evaluations, red-teaming, the concept of "p(doom)"—were developed or amplified by this community and now influence lab practices, public policy, and scientific debate. It would be overconfident to claim huge risk reductions, but hard to believe decades of safety work had zero effect.

Per Assumption 6, this spending reduced extinction risk by ~0.2 percentage points (from 10.00% to 9.80%):

- Microprobabilities averted: 0.002 / 10⁻⁶ = 2,000
- Cost per microprobability: \$1B / 2,000 = **\$500,000**

Pessimistic (only 0.02pp reduction): \$5 million/microprobability
Optimistic (2pp reduction with \$0.5B): \$25,000/microprobability

**Approach 2 — Career-level estimate:**

A "microdoom" is a one-in-a-million reduction in AI existential risk. Jurkovic (2023) explores several models for how much risk reduction an additional AI safety professional might achieve (Assumption 9):

- Linear-growth model: ~10 microdooms per career
- Diminishing returns model: ~49 microdooms per career
- Pareto model (10% of people account for 90% of impact): 10–270 microdooms

We use a central estimate of 10 microdooms per career. If a typical AI safety career costs ~\$10 million (Assumptions 7, 8: ~\$450k/year × 22 years):

- Cost per microprobability: \$10M / 10 = **\$1 million**

Best case (\$5M cost, 50 microdooms): \$100,000/microprobability
Worst case (\$20M cost, 1 microdoom): \$20 million/microprobability

**Combined:** These approaches broadly agree on the order of magnitude. Taking a logarithmic middle ground between \$500k and \$1M yields **\$700,000** as the central estimate.

### Population Fraction Affected

The point estimate (1.0) reflects that the event is defined as extinction—all humans die, regardless of location. There is no gradual recovery and no surviving generations.

In conceivable scenarios where misaligned AI kills almost everyone but leaves a tiny number of survivors (e.g., in captivity), those survivors would likely have near-zero quality of life. We treat extinction as affecting 100% of people.

Note: This modeling only counts QALYs for humans, not for non-human animals or other sentient life that might exist by the time AGI arrives.

### QALY Improvement per Affected Person per Year

The point estimate (0.9) and range (0.7–1.0) represent the average quality-of-life weight for human existence.

WHO estimates healthy life expectancy (HALE) at ~63–64 years vs. ~73 years total life expectancy (Assumption 2), implying people spend most of their lives in reasonably good health. This suggests an average quality-of-life weight of ~0.85–0.9. We use 0.9 QALYs per year, treating this as all-things-considered quality including work, relationships, culture, and periods of hardship.

**How total QALYs scale with time limit:**

The cost per QALY depends on the duration (time limit) the user chooses. With world population of ~10 billion (Assumption 3) and 0.9 QALYs per person per year:

**Example 1 — Time limit = 40 years (currently alive people only):**

- Total QALYs lost: 10B × 0.9 × 40 = **360 billion QALYs**
- QALYs saved per microprobability: 360B × 10⁻⁶ = 360,000
- Cost per QALY: \$700k / 360,000 ≈ **\$2/QALY**

**Example 2 — Time limit = 100 years (default, ~2–3 generations):**

- Total QALYs lost: 10B × 0.9 × 100 = **900 billion QALYs**
- QALYs saved per microprobability: 900B × 10⁻⁶ = 900,000
- Cost per QALY: \$700k / 900,000 ≈ **\$0.78/QALY**

**Example 3 — Time limit = 1,000 years (~25 generations):**

- Total QALYs lost: 10B × 0.9 × 1,000 = **9 trillion QALYs**
- QALYs saved per microprobability: 9T × 10⁻⁶ = 9 billion
- Cost per QALY: \$700k / 9B ≈ **\$0.00008/QALY**

These examples assume constant population for simplicity. The actual calculation uses global parameters that define the future population curve, so scaling may not be exactly linear. The default time limit is 100 years; users can adjust this to match their values.

### Start Time

The 15-year start time reflects uncertainty about when transformative AI might arrive. Expert surveys suggest human-level or superhuman AI within this century is more likely than not, but with very wide uncertainty on the exact date.

### Duration

The duration is controlled by the global "time limit" parameter, which defaults to 100 years. Unlike other catastrophic risks where some people survive and recover, AI-caused extinction means no future generations ever exist—so the choice of time horizon significantly affects the estimated impact.

Example time limits:

- **40 years** counts only currently alive people's remaining lifespans
- **100 years** (default) includes roughly 2–3 generations
- **1,000 years** includes roughly 25 generations of descendants
- **Up to 1 trillion years** for longtermists who want to see the full potential loss of humanity's future

The cost per QALY depends on the chosen time limit and other global parameters that define the future population curve. This allows users to see impact estimates that match their own values about how much weight to give future generations.

## What Kinds of Charities Are We Modeling?

These estimates assume marginal donations go to **high-leverage, impact-focused AI existential risk charities**, not generic AI ethics projects or commercial R&D. Examples include:

**Technical AI alignment and robustness research:**

- Understanding and preventing deceptive behavior in advanced models
- Developing interpretability tools to see what models are "thinking"
- Designing training methods that reduce dangerous goal misgeneralization
- Creating evaluation suites that stress-test models for catastrophic capabilities

**AI governance, policy, and standards:**

- Designing and advocating for safety standards for frontier models (testing requirements, red-team evaluations, compute thresholds)
- Supporting government AI safety institutes and regulatory frameworks
- Working on international coordination to reduce "racing" dynamics
- Analyzing and influencing corporate governance at leading AI labs

**Field-building and talent pipelines:**

- Training researchers who specialize in alignment and safety (e.g., SERI MATS, AI safety fellowships)
- Building career paths into AI governance roles in governments and international organizations

We are _not_ modeling generic "AI for social good" projects, narrow AI ethics work focused only on bias/privacy/labor impacts, or investments that mainly speed up capabilities without improving safety.

## Key Uncertainties

These numbers are order-of-magnitude guesses, not precise forecasts. Major uncertainties include:

1. **Baseline extinction risk from AI.** Estimates of "p(doom)" vary widely—from well below 1% to well above 50%—even among experts. Our modeling does not depend on any single value, but the true risk heavily influences how valuable risk reduction is.

2. **Timing of transformative AI.** If AGI/ASI arrives very soon, there may be little time for additional safety work to have effect. If it arrives much later, current efforts may need to be sustained or updated over decades.

3. **Effectiveness of safety interventions.** We do not yet know which combination of alignment research, evaluations, regulation, and industry self-governance will be effective. It is possible that large parts of our current portfolio will have little marginal impact.

4. **Interaction with other risks and benefits.** AI safety work might also reduce other catastrophic risks (AI-enabled bioterrorism, cyberwarfare) or speed up beneficial applications. These co-benefits are not included above.

5. **Valuing future generations.** The default time limit (100 years) includes 2–3 generations beyond those currently alive. Users can adjust this: shorter (~40 years) for only currently alive people, or much longer (up to 1 trillion years) for full longtermist weight. This choice dramatically affects the implied cost per QALY.

6. **Non-human welfare.** If misaligned AI destroys most animal life, welfare losses for non-human animals could be enormous. On the flip side, aligned AI might vastly reduce wild-animal suffering or improve farmed animal lives. Our framework here is human-centric.

---

_These estimates are approximate and we welcome contributions to improve them. Learn how you can help [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes

https://80000hours.org/articles/existential-risks/ argues the cost is about \$1000, but maybe \$100, counting existing people

We've already spent between 600 million and a billion dollars on AI safety. Assume we've reduced xrisk by 1%. Assume the marginal value of the next billion is the same.

So 1 billion --> 1% chance of saving 8 billion people --> 80 million lives in EV... but each person's life is already half over, so 40 million lives for a billion, or \$25 per life.

Note that this assumes that in a good AI future our longevity is not increased at all -- everyone just lives a normally long life, of equal quality to their life now.
But in reality a good AGI outcome would likely significantly extend our lives, possibly up to a trillion years or more.

If people lived a million years on average after a good AGI outcome, then that multiplies the lives by 12500, \$25/12500 = \$0.002

Each person lives a billion years --> \$0.000002
