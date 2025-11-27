---
id: nuclear
name: 'Nuclear'
effects:
  - effectId: population
    startTime: 25
    windowLength: 30
    costPerMicroprobability: 2_500_000
    populationFractionAffected: 0.9
    qalyImprovementPerYear: 0.75
---

# Justification of cost per life

_The following analysis was done on November 13th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

Unlike a "normal" cause category where we compute the cost per life by estimating cost per QALY, donations to this category aim to avert a low-probability but catastrophic event. We define an event, estimate what fraction of the global population would be affected, determine how much the event would harm each person, and estimate the cost of reducing the event's likelihood by one in a million.

## Description of effect

This effect captures welfare gains from reducing the probability of an all-out nuclear war between major powers (e.g., US and Russia) leading to large-scale nuclear winter and global famine. A full-scale exchange could kill billions through famine and economic collapse, not just direct casualties.

## Point Estimates

- **Cost per microprobability:** \$2.5 million (\$0.5–\$10 million)
- **Population fraction affected:** 0.9 (0.6–1.0)
- **QALY improvement per affected person per year:** 0.75 (0.5–1.0)
- **Start time:** 25 years
- **Duration:** 30 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. A full-scale US–Russia nuclear exchange would kill approximately 5–5.5 billion people, primarily from nuclear winter-induced famine that could cut global calorie production by ~90%. ([Xia et al. 2022](https://www.nature.com/articles/s43016-022-00573-0), [Rodriguez/Rethink Priorities](https://forum.effectivealtruism.org/posts/MCim4PoqmFPCcPy9m/updated-estimates-of-the-severity-of-a-nuclear-war))
2. The probability of full-scale nuclear war over 100 years is approximately 5% (~1 in 20). ([Ord, The Precipice](https://www.tobyord.com/writing/the-precipice-revisited))
3. Philanthropic funding for nuclear security is only ~\$30 million/year, yet past work has influenced major arms-control milestones. ([Founders Pledge](https://www.founderspledge.com/research/global-catastrophic-nuclear-risk-a-guide-for-philanthropists))
4. Open Philanthropy's existential-risk benchmark is roughly \$2 million per microprobability of catastrophe.
5. Each death corresponds to ~36 QALYs lost (40 years remaining × 0.9 quality); survivors lose ~7 QALYs on average from prolonged hardship.

## Details

### Cost per Microprobability

The point estimate (\$2.5 million/microprobability) and range (\$0.5–\$10 million) are derived from two approaches.

**Approach 1 — Near-term lives saved:**

From Davis's analysis: if there's a 40% chance of full-scale war this century killing 5 billion people, and \$25 billion could reduce that by 1 percentage point:
- Expected deaths averted: 5B × 0.01 × 0.40 = 20 million
- Cost per death: \$25B / 20M ≈ \$1,250
- 1 percentage point = 10,000 microprobabilities
- Cost per microprobability: \$25B / 10,000 = **\$2.5 million**

**Approach 2 — Existential risk benchmarks:**

Open Philanthropy's threshold (~\$1B to reduce existential risk by 0.05 basis points) implies ~\$2 million per microprobability of existential catastrophe. Nuclear war is more tractable than some other x-risks due to familiar actors and institutions.

**Range:** \$0.5–\$10 million reflects uncertainty about philanthropic leverage on policy and how much policy changes affect worst-case war probability.

### Population Fraction Affected

The point estimate (0.9) and range (0.6–1.0) reflect that a full-scale war would affect nearly everyone through:

1. **Direct casualties:** Hundreds of millions in the first weeks
2. **Nuclear winter/famine:** Xia et al. model >5 billion deaths from calorie production collapse
3. **Economic collapse:** Modern supply chains would propagate disruption globally

Even regions escaping bombardment would face food, medicine, energy, and governance crises.

### QALY Improvement per Affected Person per Year

The point estimate (0.75) and range (0.5–1.0) are derived by distributing total QALY losses across affected population and duration.

**Stylized breakdown for 10 billion population:**
- ~5 billion die: 36 QALYs each = 180 billion QALYs
- ~4 billion severe survivors: 7 QALYs each = 28 billion QALYs
- ~1 billion mildly affected: 1 QALY each = 1 billion QALYs
- **Total:** ~209 billion QALYs

For 9 billion affected over 30 years: 209B / (9B × 30) ≈ **0.75 QALYs/person/year**

A 1-in-1,000,000 risk reduction therefore saves ~200,000 expected QALYs, implying ~\$12/QALY (range \$2.5–\$50/QALY).

### Start Time

The 25-year start time reflects the expected timing of risk, acknowledging that nuclear risk is spread across the century but philanthropy aims to reduce near-term escalation pathways.

### Duration

The 30-year duration balances:
- Short-term devastation (10–15 years of acute famine/conflict)
- Long-term loss of life expectancy for those who die
- Slow institutional and environmental recovery

---

_These estimates are approximate and we welcome contributions to improve them. Learn how you can help [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
