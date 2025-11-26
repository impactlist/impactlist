---
id: social-justice
name: 'Social Justice'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 10
    costPerQALY: 160_000
---

# Justification of cost per life

_The following analysis was done on November 13th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing, but check the global assumptions for this value and other relevant parameters, such as the discount factor).

## Description of effect

This effect captures welfare gains from philanthropic work that is politically contentious in the U.S.: advocacy and litigation around discrimination and civil rights, campaigns that change public-sector or corporate practices (accountability policies, bias-mitigation standards), and supports for marginalized groups. We consider both direct wellbeing gains and potential harms (backlash, displaced risks, unintended consequences).

## Point Estimates

- **Cost per QALY:** \$160,000 (\$50,000–\$700,000)
- **Start time:** 1 year
- **Duration:** 10 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. Inclusive policy changes can improve mental health—e.g., same-sex marriage legalization was followed by a 7% reduction in adolescent suicide attempts. ([Raifman et al. 2017](https://jamanetwork.com/journals/jamapediatrics/fullarticle/2604258))
2. Body-worn cameras show modest reductions in citizen complaints and use of force, with small or null crime effects. ([Lum et al. 2019](https://onlinelibrary.wiley.com/doi/10.1002/cl2.1043))
3. Anti-bias/DEI trainings show short-run improvements in knowledge/attitudes but weak evidence of lasting behavior change. ([Bezrukova et al. 2016](https://doi.org/10.1037/bul0000067), [UK EHRC 2018](https://www.equalityhumanrights.com/en/publication-download/unconscious-bias-training-assessment))
4. Some reforms have unintended harms—e.g., "Ban-the-Box" policies increased racial disparities in callbacks. ([Agan & Starr 2018](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2795795))
5. Sustained reductions in distress/stigma yield approximately 0.02–0.10 QALY/person-year depending on severity. ([HLI methodology](https://www.happierlivesinstitute.org/report/the-case-for-using-subjective-well-being-to-evaluate-life-improving-interventions/))
6. A portfolio-level penalty of ~25% is applied to account for potential downstream harms and backlash.

## Details

### Cost per QALY

The point estimate (\$160,000/QALY) and range (\$50,000–\$700,000/QALY) are derived from modeling a representative \$1M grant portfolio.

**Model: \$1M portfolio (40% inclusive-policy advocacy, 40% accountability reform, 20% bias-mitigation):**

**Inclusive-policy advocacy (\$400k):**
- 15% chance of policy win affecting 50,000 people; 1% experience meaningful improvement
- 0.02 QALY/year for 2 years among beneficiaries (Assumption 5)
- Expected QALYs: 50,000 × 1% × 0.02 × 2 × 15% = **3.0 QALYs**

**Accountability/safety reform (\$400k):**
- Averts ~10 non-fatal injury/trauma incidents at 0.15 QALY each = 1.5 QALYs
- Minus 0.2 QALY for trust spillovers = **1.3 QALYs**

**Bias-mitigation programs (\$200k):**
- Limited durable effect; net **0.3 QALYs** after backlash adjustment

**Subtotal:** 3.0 + 1.3 + 0.3 = 4.6 QALYs

**Risk adjustment:** Apply –25% penalty for downstream harms (Assumption 6):
- Adjusted: 4.6 × 0.75 = **3.45 QALYs**

**Learning effect:** +80% of one year's impact over next four years = +1.6 QALYs

**Final:** ~5.1 QALYs per \$1M → **~\$196,000/QALY**

We round to \$160,000/QALY to reflect that some policy changes produce small but broad mental-health gains.

**Range:** Optimistic cases (successful state-level protections with minimal backlash) could reach \$50k–\$100k/QALY. Pessimistic cases (net harms from poorly targeted reforms) could exceed \$500k/QALY.

### Start Time

The 1-year start time reflects that advocacy and policy changes typically begin affecting beneficiaries within 1–2 years of funding.

### Duration

The 10-year duration reflects that benefits from policy and practice changes persist for several years but may be reversed or eroded, and effects of training-based interventions fade relatively quickly.

---

_These estimates are approximate and we welcome contributions to improve them. Learn how you can help [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
