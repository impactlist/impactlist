---
id: pandemics
name: 'Pandemics'
effects:
  - effectId: population
    startTime: 20
    windowLength: 10
    costPerMicroprobability: 1_000_000
    populationFractionAffected: 0.8
    qalyImprovementPerYear: 0.5
---

# Justification of cost per life

_The following analysis was done on November 15th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

Unlike a "normal" cause category where we estimate cost per QALY, donations to pandemic charities aim to avert a low-probability but extremely serious event. We define such an event, estimate how many people it would affect and harm, and estimate the cost of reducing its probability by one in a million.

## Description of effect

This effect captures welfare gains from reducing the probability of a global catastrophic pandemic (natural or engineered) that kills ~10% of the world's population (~1 billion people) and causes long-lasting health and social damage to billions of survivors. This is similar to "global catastrophic biological risks" (GCBRs) as defined by Johns Hopkins and Founders Pledge.

## Point Estimates

- **Cost per microprobability:** \$1 million (\$0.1–\$10 million)
- **Population fraction affected:** 0.8 (0.5–1.0)
- **QALY improvement per affected person per year:** 0.5 (0.3–0.8)
- **Start time:** 20 years
- **Duration:** 10 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. The 1918 influenza killed ~50 million people (possibly 100 million) when global population was 1.8 billion. ([CDC](https://archive.cdc.gov/www_cdc_gov/flu/pandemic-resources/1918-commemoration/1918-pandemic-history.htm))
2. Future biological threats—especially engineered pathogens—could kill hundreds of millions or billions. ([Founders Pledge GCBR](https://dkqj4hmn5mktp.cloudfront.net/GCBR_Report_Founders_Pledge_7505b1ebe0.pdf))
3. The probability of existential or catastrophic pandemic this century is approximately 1–3%, with anthropogenic risks (engineered pathogens) being the primary concern. ([Ord, The Precipice](https://www.tobyord.com/writing/the-precipice-revisited), [Lewis/80,000 Hours](https://80000hours.org/problem-profiles/preventing-catastrophic-pandemics/full-report/))
4. Gain-of-function research on virulent influenza carries 0.01–0.1% probability per lab-year of triggering a pandemic killing 2 million to 1.4 billion. ([Lipsitch & Inglesby 2014](https://journals.asm.org/doi/10.1128/mbio.02366-14))
5. Philanthropic funding for GCBRs is tiny (<2% of health security spending is truly focused on catastrophic risks). ([Founders Pledge](https://dkqj4hmn5mktp.cloudfront.net/GCBR_Report_Founders_Pledge_7505b1ebe0.pdf))
6. Each pandemic death corresponds to ~36 QALYs lost (40 years × 0.9 quality); survivors lose ~2 QALYs on average from long-term effects.

## Details

### Cost per Microprobability

The point estimate (\$1 million/microprobability) and range (\$0.1–\$10 million) are derived from two approaches.

**Approach 1 — Field-level estimate:**

If ~\$3 billion in targeted GCBR spending to date (governments + philanthropy) reduced catastrophic pandemic risk by ~0.3 percentage points (from 1.3% to 1.0%):

- Microprobabilities averted: 0.003 / 10⁻⁶ = 3,000
- Cost per microprobability: \$3B / 3,000 = **\$1 million**

Pessimistic (\$3B reduces risk by only 0.03pp): \$10 million/microprobability
Optimistic (\$1B reduces risk by 0.3pp): \$0.3 million/microprobability

**Approach 2 — Micro-level (gain-of-function policy):**

If \$20 million advocacy campaign prevents 10 high-risk lab-years, each with ~0.003% catastrophic pandemic probability:

- Risk reduction: 10 × 3×10⁻⁵ = 3×10⁻⁴ = 300 microprobabilities
- Cost per microprobability: \$20M / 300 ≈ **\$67,000**

This suggests best interventions achieve well under \$1 million/microprobability.

**Combined:** We use \$1 million as a conservative central estimate.

### Population Fraction Affected

The point estimate (0.8) and range (0.5–1.0) reflect that catastrophic pandemics affect far more than those who die:

- A transmissible pathogen can infect a large share of humanity (1918: ~1/3 infected)
- If 10% die, many more experience serious illness, bereavement, economic shock
- Even uninfected people face economic collapse, overwhelmed health systems, instability

### QALY Improvement per Affected Person per Year

The point estimate (0.5) and range (0.3–0.8) distribute total QALY losses across affected population and duration.

**Stylized breakdown for 10 billion population:**

- 1 billion die: 36 QALYs each = 36 billion QALYs
- 3 billion severely affected survivors: 2 QALYs each = 6 billion QALYs
- 6 billion indirectly affected: 0.25 QALYs each = 1.5 billion QALYs
- **Total:** ~43.5 billion QALYs (rounded to 40 billion)

For 8 billion affected over 10 years: 40B / (8B × 10) = **0.5 QALYs/person/year**

A 1-in-1,000,000 risk reduction therefore saves ~40,000 expected QALYs, implying ~\$25/QALY (range \$2.5–\$250/QALY).

### Start Time

The 20-year start time reflects that GCBR risk is rising with advances in biotechnology and AI, with somewhat higher concern in coming decades. Expected timing if event occurs: ~40 years (range 10–70 years).

### Duration

The 10-year duration reflects that:

- For deaths, long-term losses are folded into an "equivalent" intense 10-year impact
- For survivors, worst effects (health, economic, institutional) concentrate in first 5–20 years

---

_These estimates are approximate and we welcome contributions to improve them. You can submit quick feedback with [this form](https://forms.gle/NEC6LNics3n6WVo47) or get more involved [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
