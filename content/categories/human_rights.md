---
id: human-rights
name: 'Human Rights and Justice'
effects:
  - effectId: standard
    startTime: 2
    windowLength: 25
    costPerQALY: 600
---

# Justification of cost per life

_The following analysis was done on November 12th 2025, written by GPT 5 Pro and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from charities that protect people from severe, widely-recognized rights violations with broad political support: preventing violence against women and girls (VAWG), reducing modern slavery and bonded labour, and strengthening rule of law (fair trials, legal identity, protection from arbitrary detention). This excludes more ideologically contentious projects.

## Point Estimates

- **Cost per QALY:** \$600 (\$200–\$2,000)
- **Start time:** 2 years
- **Duration:** 25 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. Community activist programs (e.g., SASA!) achieve approximately \$180/DALY for VAWG prevention; self-defence programs achieve ~\$260/DALY; radio campaigns may achieve ~\$13/DALY with weaker evidence. ([EA Forum 2023](https://forum.effectivealtruism.org/posts/uH9akQzJkzpBD5Duw/what-you-can-do-to-help-stop-violence-against-women-and))
2. DALYs capture approximately two-thirds of total QALY impact for VAWG; non-health aspects (autonomy, safety, social functioning) add roughly one-third, so QALYs ≈ 1.5 × DALYs.
3. Freedom Fund's India hotspot model reduced households in bonded labour from 56% to 11%, freeing ~125,000 people at ~\$126/person. ([Freedom Fund 2019](https://cdn.freedomfund.org/app/uploads/2024/03/Freedom-Fund-Evidence-in-Practice-Paper-Unlocking-what-works.pdf))
4. Bonded labour causes approximately 0.5 DALYs/year loss; including non-health harms yields ~0.65 QALYs/year lost. A freed person avoids 2–4 extra years of bondage on average.
5. Open Philanthropy values incarceration avoided at \$500–\$1,000 per prison-year for grants to meet their funding bar. ([Open Philanthropy 2019](https://www.openphilanthropy.org/research/criminal-justice-reform-strategy/))
6. One year in prison reduces quality of life by approximately 0.3–0.7 QALYs (central estimate 0.5), based on prisoner health studies. ([PLOS One](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0290626))
7. Criminal justice reforms face implementation challenges; realized cost-effectiveness often falls below optimistic estimates. ([EA Forum 2022](https://forum.effectivealtruism.org/posts/h2N9qEbvQ6RHABcae/a-critical-review-of-open-philanthropy-s-bet-on-criminal))

## Details

### Cost per QALY

The point estimate (\$600/QALY) and range (\$200–\$2,000/QALY) represent a blend across three intervention types with different cost-effectiveness profiles.

**Violence against women and girls (VAWG):**

Using DALY-based estimates (Assumption 1) and converting to QALYs (Assumption 2):

- Community activist programs: \$180/DALY → ~\$120/QALY
- Self-defence programs: \$260/DALY → ~\$170/QALY

Doubling these for implementation risk and publication bias yields **\$200–\$400/QALY** for well-evidenced VAWG prevention.

**Modern slavery and bonded labour:**

At \$126/person freed (Assumption 3) and 1.3–2.6 QALYs gained per person (Assumption 4), naive cost per QALY is \$50–\$100. Inflating 3–4× for attribution uncertainty and sustainability yields **\$300–\$400/QALY** for promising anti-slavery work.

**Criminal justice reforms:**

At \$500–\$1,000 per prison-year avoided (Assumption 5) and 0.5 QALYs per year (Assumption 6), implied cost per QALY is \$1,000–\$2,000. Given implementation challenges (Assumption 7), the range is **\$1,000–\$4,000/QALY**.

**Blended estimate:**

Weighting ~60–70% toward VAWG and anti-slavery (\$150–\$400/QALY) and ~30–40% toward justice reforms (\$1,000–\$4,000/QALY) yields a point estimate of **\$600/QALY** with range \$200–\$2,000.

### Start Time

The 2-year start time reflects that VAWG prevention and anti-slavery programs typically show effects within 1–3 years as communities change norms and individuals exit exploitation.

### Duration

The 25-year duration reflects the long-term benefits of preventing violence, freeing individuals from bondage, and improving justice systems—effects that persist across victims' remaining lifespans and can compound through community-level change.

---

_These estimates are approximate and we welcome contributions to improve them. Learn how you can help [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
