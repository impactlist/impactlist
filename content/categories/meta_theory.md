---
id: meta-theory
name: 'Meta and Theory'
effects:
  - effectId: standard
    startTime: 5
    windowLength: 25
    costPerQALY: 25
---

# Justification of cost per life

_The following analysis was done on November 16th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing, but check the global assumptions for this value and other relevant parameters, such as the discount factor).

## Description of effect

This effect captures welfare gains from organizations that multiply the impact of other cause areas: effective altruism movement building, effective giving organizations (80,000 Hours, Giving What We Can, The Life You Can Save), and normative/conceptual work on effective altruism and longtermism. This excludes technical Global Priorities Research (treated separately). Impact comes from redirecting money and talent toward more effective opportunities.

## Point Estimates

- **Cost per QALY:** \$25 (\$4–\$300)
- **Start time:** 5 years
- **Duration:** 25 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. 80,000 Hours achieves at least a 15× donation multiplier from career changes alone, with marginal cost per impact-adjusted plan change under £250–500. ([EA Forum 2016](https://forum.effectivealtruism.org/posts/WKkF36bJsH8FmYZkw/why-donate-to-80-000-hours))
2. Giving What We Can achieves approximately 12.2× donation multiplier (5th–95th percentile: 0.8–19.1×). ([Sempere 2023](https://forum.nunosempere.com/posts/5Lytcvj7GCSysBtSD/my-impact-assessment-of-giving-what-we-can))
3. The Life You Can Save moved \$23M on a \$1.3M budget in 2021 (gross 18.5×, adjusted ~16×). ([EA Infrastructure Fund 2023](https://www.lesswrong.com/posts/bBnxGAc4NT9aRdEtL/ea-infrastructure-fund-june-2023-grant-recommendations))
4. Top Meta & Theory organizations achieve an effective donation multiplier of approximately 8–10× after adjusting for counterfactuals, charity mix, and attrition (range 3–20×).
5. GiveWell top charities achieve approximately \$120/QALY. ([Our World in Data](https://ourworldindata.org/cost-effectiveness), [GiveWell](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness))
6. Theoretical work (books, essays, talks) has more uncertain returns but feeds into donation and career multipliers by shaping values.
7. Once someone adopts a donation habit (e.g., GWWC pledge), they often maintain it for decades. ([GWWC pledge](https://www.givingwhatwecan.org/pledge))

## Details

### Cost per QALY

The point estimate (\$25/QALY) and range (\$4–\$300/QALY) reflect Meta & Theory's role as a multiplier on high-impact donations and careers.

**Calculation 1 — Movement building and effective giving:**

With a 10× donation multiplier (Assumption 4) onto charities at \$120/QALY (Assumption 5):

$$\text{QALYs per Meta } \$1 = \dfrac{10}{120} \approx 0.083$$
$$\text{Cost per QALY} \approx \$12$$

With a more conservative 5× multiplier:
$$\text{Cost per QALY} \approx \$24$$

This suggests donation-moving work alone achieves approximately \$10–\$50/QALY before counting career change impact.

**Calculation 2 — Theory and worldview change:**

Theoretical work (effective altruism philosophy, longtermism, public-facing books) has more uncertain returns but is a crucial upstream driver of the donation and career multipliers. We estimate \$50–\$200/QALY on average, with occasional high-impact hits.

**Combined estimate:**

Treating the category as roughly half movement-building (\$15–\$40/QALY) and half theory (\$50–\$200/QALY), and taking a logarithmic average, yields a point estimate of \$25/QALY. The range (\$4–\$300) reflects variation from strong multipliers with impactful theory to scenarios where many projects have little effect.

### Start Time

The 5-year start time reflects that movement-building takes 1–3 years to convert someone into a substantial donor or prompt a career change, with those behaviors then ramping up as incomes grow.

### Duration

The 25-year duration reflects that donation habits and career changes persist for decades (Assumption 7). The GWWC pledge is framed as a lifetime commitment, and career changes typically shift impact for 20–30 remaining working years.

---

_These estimates are approximate and we welcome contributions to improve them. Learn how you can help [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
