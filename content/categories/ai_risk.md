---
id: ai-risk
name: 'AI Existential Risk'
effects:
  - effectId: population
    startTime: 15
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 2_000_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: 1.0
---

# Justification of cost per life

_The following analysis was done on November 15th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

Unlike a "normal" cause category where we estimate cost per QALY, donations to AI existential risk charities aim to avert a low-probability but truly catastrophic event. We define such an event, estimate how many people it would affect and harm, and estimate the cost of reducing its probability by one in a million.

## Description of effect

This effect captures welfare gains from reducing the probability of human extinction caused by misaligned artificial general intelligence (AGI) or artificial superintelligence (ASI). The concern is that sufficiently capable AI systems could pursue goals not aligned with human values, either from specification failures or unintended instrumental drives like resource acquisition and self-preservation.

## Point Estimates

- **Cost per microprobability:** \$2 million (\$0.2–\$20 million)
- **Population fraction affected:** 1.0 (by definition, everyone dies)
- **QALY improvement per affected person per year:** 0.9 (0.7–1.0)
- **Start time:** 15 years
- **Duration:** 40 years (for people alive at time of catastrophe)

## Assumptions

1. Toby Ord estimates 10% probability of existential catastrophe from unaligned AI this century, higher than all other anthropogenic existential risks combined. ([The Precipice Revisited](https://www.tobyord.com/writing/the-precipice-revisited))
2. The 2022 AI Impacts Expert Survey asked hundreds of ML researchers about "human extinction or similarly permanent and severe disempowerment" from future AI; many assigned several percent probability or more. ([AI Impacts](https://aiimpacts.org/2022-expert-survey-on-progress-in-ai/))
3. A 2024–2025 survey of 2,778 AI researchers found 38–51% gave ≥10% chance to extinction-level outcomes from advanced AI. ([Grace et al. 2024](https://arxiv.org/abs/2401.02843))
4. Geoffrey Hinton estimates ~20% chance AI leads to human extinction. ([The Guardian](https://www.theguardian.com/technology/2024/dec/27/godfather-of-ai-raises-odds-of-the-technology-wiping-out-humanity-over-next-30-years))
5. Dario Amodei estimates ~25% chance of extremely bad AI outcomes including extinction. ([Axios](https://www.axios.com/2025/09/17/anthropic-dario-amodei-p-doom-25-percent))
6. Global life expectancy is ~73 years; healthy life expectancy (HALE) is ~63–64 years, implying average quality weight ~0.85–0.9. ([WHO](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy), [Our World in Data](https://ourworldindata.org/life-expectancy))
7. World population projected to peak at ~10.3 billion in the 2080s. ([UN 2024](https://population.un.org/wpp/publications/files/wpp2024_summary_of_results.pdf))
8. Each death corresponds to ~36 QALYs lost (40 years remaining × 0.9 quality).
9. Cumulative AI safety spending through 2025 is ~\$1 billion (Open Philanthropy ~\$400M, SFF ~\$53M, FTX Future Fund ~\$32M, LTFF ~\$10M, plus lab safety teams ~\$32M/year and government programs). ([EA Forum](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation), [TIME](https://time.com/7012763/cari-tuna/))
10. Total cost per AI safety employee is ~2× salary (~\$400–500k/year) including benefits, compute, and overhead. ([EA Forum](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation))
11. AI research scientist salaries in the US are ~\$180–220k/year. ([Glassdoor](https://www.glassdoor.com/Salaries/ai-research-scientist-salary-SRCH_KO0%2C21.htm))
12. One AI safety career may avert 1–50 microdooms, with central estimate ~10. ([Jurkovic 2023](https://www.lesswrong.com/posts/mTtxJKN3Ew8CAEHGr/microdooms-averted-by-working-on-ai-safety))

## Why Take This Risk Seriously?

Several lines of evidence suggest that experts take AI existential risk seriously:

- In _The Precipice_, philosopher Toby Ord gives 10% probability to existential catastrophe from unaligned AI this century (Assumption 1). He reiterates this in his 2024 follow-up.
- The 2022 AI Impacts survey and the 2024–2025 survey of 2,778 AI researchers (Assumptions 2, 3) found that many researchers assign several percent or more to extinction-level outcomes.
- High-profile AI scientists like Geoffrey Hinton (~20%) and Dario Amodei (~25%) have publicly given non-trivial "p(doom)" estimates (Assumptions 4, 5).

Not all experts agree—figures like Yann LeCun argue these risks are exaggerated. But there is a live, mainstream scientific and policy discussion about whether AGI/ASI could end human civilization. Even if the true risk were "only" 1%, reducing it by a tiny absolute amount could be extremely valuable in expectation.

## Details

### Cost per Microprobability

The point estimate (\$2 million/microprobability) and range (\$0.2–\$20 million) are derived from two approaches.

**Approach 1 — Field-level estimate:**

We estimate how much risk reduction ~\$1 billion in cumulative AI safety spending (Assumption 9) has achieved. Many visible AI safety ideas—alignment, RLHF, evaluations, red-teaming, the concept of "p(doom)"—were developed or amplified by this community and now influence lab practices, public policy, and scientific debate. It would be overconfident to claim huge risk reductions, but hard to believe decades of safety work had zero effect.

We assume this spending reduced extinction risk by ~0.03 percentage points (from 10.00% to 9.97%):

- Microprobabilities averted: 0.0003 / 10⁻⁶ = 300
- Cost per microprobability: \$1B / 300 = **\$3.3 million**

Pessimistic (only 0.003pp reduction): \$33 million/microprobability
Optimistic (0.3pp reduction with \$0.5B): \$170,000/microprobability

**Approach 2 — Career-level estimate:**

A "microdoom" is a one-in-a-million reduction in AI existential risk. Jurkovic (2023) explores several models for how much risk reduction an additional AI safety professional might achieve (Assumption 12):

- Linear-growth model: ~10 microdooms per career
- Diminishing returns model: ~49 microdooms per career
- Pareto model (10% of people account for 90% of impact): 10–270 microdooms

We use a central estimate of 10 microdooms per career. If a typical AI safety career costs ~\$10 million (Assumptions 10, 11: ~\$450k/year × 22 years):

- Cost per microprobability: \$10M / 10 = **\$1 million**

Best case (\$5M cost, 50 microdooms): \$100,000/microprobability
Worst case (\$20M cost, 1 microdoom): \$20 million/microprobability

**Combined:** These approaches broadly agree on the order of magnitude. Taking a logarithmic middle ground between \$1M and \$3.3M yields **\$2 million** as the central estimate.

### Population Fraction Affected

The point estimate (1.0) reflects that the event is defined as extinction—all humans die, regardless of location. There is no gradual recovery and no surviving generations.

In conceivable scenarios where misaligned AI kills almost everyone but leaves a tiny number of survivors (e.g., in captivity), those survivors would likely have near-zero quality of life. We treat extinction as affecting 100% of people.

Note: This modeling only counts QALYs for humans, not for non-human animals or other sentient life that might exist by the time AGI arrives.

### QALY Improvement per Affected Person per Year

The point estimate (0.9) and range (0.7–1.0) are derived by estimating how many high-quality life-years each person loses.

**Step 1 — Remaining life expectancy:**

Global life expectancy at birth is ~73 years (Assumption 6). For the "average person" alive at the time of an AI catastrophe, accounting for mixed ages and countries, we assume ~40 years remaining.

**Step 2 — Quality of life:**

WHO estimates healthy life expectancy (HALE) at ~63–64 years vs. ~73 years total, implying people spend most of their lives in reasonably good health. This suggests an average quality-of-life weight of ~0.85–0.9. We use 0.9 QALYs per year, treating this as all-things-considered quality including work, relationships, culture, and periods of hardship.

**Step 3 — QALYs lost per person:**

If someone dies instantly in an AI catastrophe instead of living out their remaining life:

- QALYs lost per person ≈ 40 × 0.9 = **36 QALYs** (Assumption 8)

**Step 4 — Total QALYs lost:**

With world population of ~10 billion (Assumption 7):

- 10 billion die × 36 QALYs each = **360 billion QALYs**

For 10 billion affected over 40 years: 360B / (10B × 40) = **0.9 QALYs/person/year**

A 1-in-1,000,000 risk reduction therefore saves ~360,000 expected QALYs, implying ~\$6/QALY (range \$0.6–\$60/QALY).

This is larger than our nuclear-war estimate (~200 billion QALYs) because everyone dies and we treat all deaths as premature by several decades. Crucially, this **still ignores the vast number of future generations that would never exist if humanity goes extinct**.

### Start Time

The 15-year start time reflects uncertainty about when transformative AI might arrive. Expert surveys suggest human-level or superhuman AI within this century is more likely than not, but with very wide uncertainty on the exact date.

### Duration

The 40-year duration represents the average remaining lifespan of people alive at the time of catastrophe. For AI doom there are no survivors, so we are simply averaging over the remaining lifetime people would have had if not killed. This captures uncertainty about age distribution, future life expectancy improvements, and regional differences.

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

5. **The long-run future.** Our QALY calculations only include people alive at the time of catastrophe. They do not count the potentially vast number of future people who would never exist if humanity goes extinct. Longtermist analyses argue that preserving humanity's long-run potential—centuries of civilization, possible space settlement, trillions of future lives—dominates the calculus.

6. **Non-human welfare.** If misaligned AI destroys most animal life, welfare losses for non-human animals could be enormous. On the flip side, aligned AI might vastly reduce wild-animal suffering or improve farmed animal lives. Our framework here is human-centric.

Given these uncertainties, these estimates are rough tools for comparison. They suggest that even under conservative, near-term, human-only assumptions, **top AI existential risk charities plausibly achieve ~\$1–\$60 per QALY**, with a central estimate around **\$6 per QALY**.

_These estimates are approximate and we welcome contributions to improve them. Learn how you can help [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes

https://80000hours.org/articles/existential-risks/ argues the cost is about \$1000, but maybe \$100, counting existing people

We've already spent between 600 million and a billion dollars on AI safety. Assume we've reduced xrisk by 1%. Assume the marginal value of the next billion is the same.

So 1 billion --> 1% chance of saving 8 billion people --> 80 million lives in EV... but each person's life is already half over, so 40 million lives for a billion, or \$25 per life.

Note that this assumes that in a good AI future our longevity is not increased at all -- everyone just lives a normally long life, of equal quality to their life now.
But in reality a good AGI outcome would likely significantly extend our lives, possibly up to a trillion years or more.

If people lived a million years on average after a good AGI outcome, then that multiplies the lives by 12500, \$25/12500 = \$0.002

Each person lives a billion years --> \$0.000002
