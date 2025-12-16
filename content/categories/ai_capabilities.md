---
id: ai-capabilities
name: 'AGI Development'
effects:
  - effectId: standard-mundane
    startTime: 3
    windowLength: 20
    costPerQALY: 42_000
  - effectId: standard-utopia
    startTime: 15
    windowLength: 5
    costPerQALY: 40_000
  - effectId: population-doom
    startTime: 15
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 50_000_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: -1.0
---

# Justification of cost per life

_The following analysis was done on November 16th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

This category covers philanthropic funding for AI capabilities—projects that make AI systems more capable, available, and widely deployed, without being primarily focused on safety or alignment.

We model **three distinct effects**:

1. **standard-mundane**: A positive effect where better AI yields higher productivity and broadly higher wellbeing. We estimate a cost per QALY.
2. **standard-utopia**: A positive effect where faster capabilities may bring forward the arrival of a beneficial AGI world, giving people extra years of much higher quality of life. We estimate a cost per QALY.
3. **population-doom**: A negative effect where accelerating AI capabilities slightly increases the chance of existential catastrophe from misaligned AI. We estimate a cost per microprobability (increasing risk).

The overall sign of this cause area depends on how these effects trade off given your assumptions about AI timelines and the probability of good vs bad outcomes.

---

## Effect 1: standard-mundane

This effect captures welfare gains from AI as a general-purpose technology: higher productivity, better tools, time savings, and improved quality of goods and services.

### Point Estimates

- **Cost per QALY:** \$42,000 (\$15,000–\$250,000)
- **Start time:** 3 years
- **Duration:** 20 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

### Assumptions

1. Generative AI alone could add \$2.6–4.4 trillion per year across use cases. ([McKinsey 2023](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier))
2. AI will raise productivity by ~1.5% by 2035, ~3% by 2055, and ~3.7% by 2075. ([Penn Wharton 2025](https://budgetmodel.wharton.upenn.edu/issues/2025/9/8/projected-impact-of-generative-ai-on-future-productivity-growth))
3. A study of 5,172 customer-support agents found AI tools increased productivity by 14% on average and >30% for least experienced workers. ([Brynjolfsson et al. 2024](https://academic.oup.com/qje/article/140/2/889/7990658))
4. Marginal R&D spending yields ~\$5–13 in present-value social benefits per dollar. ([Open Philanthropy](https://www.openphilanthropy.org/research/social-returns-to-productivity-growth/))
5. One WELLBY ≈ £13,000 (~\$16,000); roughly 6 WELLBYs ≈ 1 QALY, implying ~\$90,000–120,000 per QALY in high-income settings. ([HM Treasury](https://www.gov.uk/government/publications/green-book-supplementary-guidance-wellbeing))
6. Global corporate AI investment reached \$252.3 billion in 2024. ([Stanford AI Index 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report/economy))
7. The global AI market is projected to exceed \$3.4 trillion by 2033. ([Grand View Research](https://www.grandviewresearch.com/industry-analysis/artificial-intelligence-ai-market))
8. Philanthropic AI capabilities spending is tiny by comparison (e.g., Humanity AI's \$500M five-year fund). ([MacArthur Foundation](https://www.macfound.org/press/press-releases/humanity-ai-commits-500-million-to-build-a-people-centered-future-for-ai))

### Details

#### Cost per QALY

The point estimate (\$42,000/QALY) and range (\$15,000–\$250,000) are derived from two key parameters:

**Raw social return per dollar of AI R&D:**

Because AI is a particularly powerful general-purpose technology with near-zero marginal replication costs, we assume \$12 of global consumption-equivalent benefit per \$1 of AI capabilities R&D (range \$6–30).

**Philanthropic additionality:**

Corporate AI investment is enormous (Assumptions 6, 7), so philanthropy has low but non-zero additionality. Some grants support research that profit-driven actors wouldn't prioritize (AI for low-income countries, open models for underserved languages). We assume 15–20% additionality.

**Calculation:**

$$
E_{\text{mundane}} \approx 12 \times 0.2 = 2.4
$$

Using \$100,000 per QALY benchmark (Assumption 5):

$$
\text{Cost per QALY} \approx \dfrac{\$100{,}000}{2.4} \approx \$42{,}000
$$

#### Start Time

The 3-year start time reflects that mundane AI benefits from philanthropic funding accrue as current systems are developed, deployed, and integrated into workflows.

#### Duration

The 20-year duration represents a window in which current generations experience incremental productivity and convenience gains before further transformative changes (including AGI) dominate.

---

## Effect 2: standard-utopia

This effect captures gains from bringing forward a beneficial AGI world—where most diseases are curable, extreme poverty is eliminated, and work is much less drudgerous—conditional on such a world existing at all.

### Point Estimates

- **Cost per QALY:** \$40,000 (\$10,000–\$150,000)
- **Start time:** 15 years
- **Duration:** 5 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

### Assumptions

1. Baseline AGI arrival is ~35 years from now (~2060) without marginal philanthropic funding.
2. Total cumulative AGI-relevant spending will be ~\$10 trillion (\$5–30 trillion range).
3. Philanthropic additionality for AGI-accelerating R&D is ~5% (conservative given massive private funding).
4. In a "good AGI world," average QALY weights might rise to 0.95–1.0 as health improves and poverty vanishes.
5. Extra QALYs per year in good AGI world vs baseline: ~500 million QALYs/year globally.
6. Probability of genuinely good AGI outcome (non-doom, non-dystopian): ~30% (range 20–50%).

### Details

#### Cost per QALY

The point estimate (\$40,000/QALY) and range (\$10,000–\$150,000) are derived from a timing model.

**Calculation:**

Each philanthropic dollar effectively adds a tiny fraction of total AGI R&D. If total AGI effort is proportional to cumulative spend, a marginal donation shifts arrival time by:

$$
\Delta T \approx \dfrac{a_{\text{cap}} \times d}{S_{\text{total}}} \times T_{\text{horiz}}
$$

QALYs per dollar from timing:

$$
\text{QALYs per \$} \approx p_{\text{good}} \times \dfrac{a_{\text{cap}}}{S_{\text{total}}} \times T_{\text{horiz}} \times \Delta Q_{\text{year}}
$$

Using central values (Assumptions 1–6):

- $p_{\text{good}} = 0.3$
- $a_{\text{cap}} = 0.05$
- $S_{\text{total}} = 10^{13}$
- $T_{\text{horiz}} = 35$ years
- $\Delta Q_{\text{year}} = 5 \times 10^{8}$

This yields ~0.000026 QALYs per dollar, or **~\$38,000 per QALY**. We round to \$40,000 given deep uncertainties.

#### Start Time

The 15-year start time represents when AGI benefits might begin materializing, acknowledging uncertainty about arrival timing.

#### Duration

The 5-year duration represents a window in which "being earlier" matters most—the gap between accelerated and baseline AGI arrival where people enjoy AGI-grade benefits they wouldn't otherwise have had yet.

---

## Effect 3: population-doom

This effect captures the harm from AI capabilities funding slightly increasing the probability of AI-caused human extinction—the same event modeled in AI Existential Risk, but here the direction is reversed (increasing rather than decreasing risk).

Note: The QALY improvement per year is **-1.0** (negative), indicating this is a harmful effect.

### Point Estimates

- **Cost per microprobability (increase):** \$50 million (\$5–200 million)
- **Population fraction affected:** 1.0 (everyone dies)
- **QALY improvement per affected person per year:** -1.0 (harm, not benefit)
- **Start time:** 15 years
- **Duration:** Defined by global time limit parameter (default is 100 years)

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

### Assumptions

1. The probability of AI-caused extinction this century is approximately 10%, with mainstream expert estimates ranging from a few percent to over 25%. ([Ord 2024](https://www.tobyord.com/writing/the-precipice-revisited), [AI Impacts 2022](https://aiimpacts.org/2022-expert-survey-on-progress-in-ai/), [Grace et al. 2024](https://arxiv.org/abs/2401.02843))
2. Total cumulative AI capabilities spending will be ~\$10 trillion (\$5–30 trillion range).
3. Marginal risk per dollar scales with overall capabilities effort: $dP/dS \approx P_{\text{doom}}/S_{\text{total}}$.
4. Philanthropic capabilities funding is more concentrated on frontier research than average AI spending—leverage factor $L = 3$ (range 0.5–5).
5. World population at time of catastrophe: ~10 billion.
6. Average quality of life weight: 0.9 QALYs per year.

### Details

#### Cost per Microprobability

The point estimate (\$50 million/microprobability increase) and range (\$5–200 million) are derived from relating philanthropic spending to marginal risk increase.

**Step 1 — Marginal risk per dollar of average AI spending:**

With $P_{\text{doom}} = 0.1$ and $S_{\text{total}} = 10^{13}$ (Assumptions 1, 2):

$$
\dfrac{dP}{dS} \approx \dfrac{0.1}{10^{13}} = 10^{-14}\ \text{per dollar}
$$

For \$1 million of average AI spending: ~0.01 microprobabilities increase.

**Step 2 — Philanthropic leverage:**

Philanthropic grants may target frontier models, open-source foundations, or high-risk research directions. With leverage factor $L = 3$ (Assumption 4):

$$
\text{Microprobabilities per \$1M philanthropic} \approx 0.03
$$

**Step 3 — Cost per microprobability:**

$$
\text{Dollars per +1 microprobability} \approx \dfrac{\$1M}{0.03} \approx \$33M
$$

We round to **\$50 million** given parameter uncertainty.

#### Population Fraction Affected

The point estimate (1.0) reflects that extinction kills everyone. There are no survivors.

#### QALY Improvement per Affected Person per Year

The value is **-1.0** because this effect represents harm: increasing the probability of extinction destroys QALYs rather than creating them.

With the default 100-year time limit, world population of 10 billion, and 1.0 QALY/year impact:

- Total QALYs at stake: 10B × 1.0 × 100 = **1 trillion QALYs**
- Per microprobability: 1 million QALYs

Each \$1M of philanthropic AI capabilities spending increases expected QALY loss by roughly 20,000 QALYs via existential risk.

#### Start Time

The 15-year start time reflects typical expert timelines to transformative AI when existential risk would materialize.

#### Duration

The duration is controlled by the global "time limit" parameter, which defaults to 100 years. Because extinction means no future generations ever exist, the choice of time horizon significantly affects the estimated harm.

Example time limits:

- **40 years** counts only currently alive people's remaining lifespans
- **100 years** (default) includes roughly 2–3 generations
- **1,000 years** includes roughly 25 generations
- **Up to 1 trillion years** for longtermists assessing full potential loss

These examples assume constant population for simplicity. The actual calculation uses global parameters that define the future population curve, so scaling may not be exactly linear.

---

{{CONTRIBUTION_NOTE}}

# Internal Notes

This section contains internal notes that shouldn't be displayed on the website.
