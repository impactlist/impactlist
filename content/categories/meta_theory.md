---
id: meta-theory
name: 'Meta and Theory'
effects:
  - effectId: standard
    startTime: 5
    windowLength: 25
    costPerQALY: 21
---

# Justification of cost per life

_The following analysis was done on April 14th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from organizations that multiply the impact of other cause areas by improving how people **give, think, and work**. Representative examples include effective-giving organizations and evaluators (such as GiveWell, Giving What We Can, and The Life You Can Save), career and talent-shaping organizations (such as 80,000 Hours), and broader public-intellectual or worldview work that changes how resources, careers, and strategic attention are allocated, including toward catastrophic-risk reduction.

The main pathway is indirect: a dollar to Meta and Theory causes later dollars, careers, institutions, or strategic attention to be directed toward better opportunities. We therefore model this category using two channels:

1. **Direct money-moving and evaluator work**
2. **Career, movement-building, and worldview work**

That structure is more transparent than treating the entire category as one undifferentiated multiplier. It also helps keep pure theory work from dominating the point estimate unless there is unusually strong evidence that it changed downstream donations, careers, institutions, worldviews, or policy.

This category excludes more technical **Global Priorities Research**, which is treated separately.

## Point Estimates

- **Cost per QALY:** \$21 (\$6-\$100)
- **Start time:** 5 years
- **Duration:** 25 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. In the **direct money-moving and evaluator channel**, a strong organization plausibly creates about an **8x donation-equivalent multiplier**, with a rough practical range of **5x-12x**. The closest public anchors are Giving What We Can's **6x** 2023-2024 giving multiplier and The Life You Can Save's **10:1** three-year leverage ratio. GiveWell's roughly **\$397 million** directed in 2024 on around **\$21 million** in operating expenses, plus another **\$45 million** it believes its research influenced, is best read as a looser operational-leverage cross-check rather than the same kind of multiplier, because it measures dollars directed relative to operating cost rather than counterfactual small-donor giving caused. ([Giving What We Can impact](https://www.givingwhatwecan.org/impact), [Giving What We Can 2023-2024 evaluation](https://www.givingwhatwecan.org/impact/2023-2024-impact-evaluation), [The Life You Can Save 2024 Annual Report](https://www.thelifeyoucansave.org/2024-annual-report/), [GiveWell Metrics 2024](https://files.givewell.org/files/metrics/GiveWell_Metrics_Report_2024.pdf))
2. In the **career, movement-building, and worldview channel**, a strong organization plausibly creates about a **4x donation-equivalent multiplier**, with a rough practical range of **1x-8x**. 80,000 Hours says an average plan change is worth **hundreds of thousands of dollars** of value over a lifetime, had tracked **604** plan changes by end-2022 while estimating the true total closer to **2,000**, and in 2024 had over **1,400** one-on-one calls plus **165** headhunts. Older Open Philanthropy discussion of impact-adjusted plan changes points in the same direction. The evidence is noisy and attribution is hard, but the category also includes broader worldview and movement work with weaker direct metrics than 80,000 Hours itself, so **4x** is a reasonable portfolio-average best guess. ([Donate to 80,000 Hours](https://80000hours.org/support-us/donate/), [80,000 Hours review: 2023 to mid-2025](https://80000hours.org/2025/09/80000-hours-review-2023-to-mid-2025/), [Open Philanthropy 2017 grant writeup](https://www.openphilanthropy.org/grants/80000-hours-general-support/))
3. A reasonable central portfolio split for this category is **40% direct money-moving/evaluator work** and **60% career, movement-building, and worldview work**. This is not meant as a literal budget breakdown of all organizations in the ecosystem. It is an all-things-considered modeling split for the kind of marginal donation opportunities this category is trying to represent. ([See detailed justification](/assumption/meta-theory-channel-model))
4. In the **direct money-moving and evaluator channel**, the downstream opportunities influenced are worth about **\$100/QALY** on average, with a rough practical range of **\$80-\$150/QALY**. This is close to the site's own Global Health estimate of **\$90/QALY**, but slightly less optimistic because not all influenced giving goes to the very best GiveWell-style opportunities. ([Global Health](/category/global-health), [GiveWell cost-effectiveness](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness), [How we work, #1: Cost-effectiveness is generally the most important factor in our recommendations](https://blog.givewell.org/2023/10/27/how-we-work-1-cost-effectiveness/))
5. In the **career, movement-building, and worldview channel**, the downstream opportunities influenced are worth about **\$150/QALY** on average, with a rough practical range of **\$50-\$500/QALY**. This is an all-things-considered QALY-equivalent benchmark, not a near-term-human-health-only one. The channel often steers people toward animal welfare, catastrophic-risk reduction, global priorities, institution building, and other mixed portfolios rather than only GiveWell-style global health. That broader and more heterogeneous downstream mix can include both very strong and much weaker destinations, so the central benchmark is set at a slightly higher **\$/QALY** than the direct channel rather than equal to it. ([See detailed justification](/assumption/meta-theory-channel-model), [Animal Welfare](/category/animal-welfare), [Global Priorities](/category/global-priorities), [Global Health](/category/global-health), [Improving Institutions](/category/institutions))
6. Donation, career, and worldview shifts usually take a few years to produce substantial downstream welfare effects. A **5-year** start time is a reasonable portfolio average.
7. Once someone changes how they donate, which problems they work on, or which institutions they build, the resulting effects often persist for decades. A **25-year** duration is a reasonable central estimate.

## Details

### Cost per QALY

The cleanest model for this category is:

$$
\text{QALYs per } \$1 = w_d \times \frac{M_d}{B_d} + w_c \times \frac{M_c}{B_c}
$$

Where:

- $w_d$ = share of the modeled opportunity set in the direct money-moving/evaluator channel
- $w_c$ = share in the career/movement/worldview channel
- $M_d, M_c$ = donation-equivalent multipliers in the two channels
- $B_d, B_c$ = downstream cost per QALY in the two channels

Using the central assumptions above:

- $w_d = 0.4$
- $w_c = 0.6$
- $M_d = 8$
- $M_c = 4$
- $B_d$ = \$100 per QALY
- $B_c$ = \$150 per QALY

So:

$$
\text{QALYs per } \$1 = 0.4 \times \frac{8}{100} + 0.6 \times \frac{4}{150}
$$

$$
= 0.032 + 0.016 = 0.048
$$

$$
\text{Cost per QALY} = \frac{1}{0.048} \approx \$20.8
$$

So the point estimate is **about \$21/QALY**.

This model is more legible than using one blended multiplier and one blended downstream benchmark, because it makes the main empirical judgment calls explicit.

**Channel 1: direct money-moving and evaluator work**

This is the strongest empirical anchor in the whole category.

- Giving What We Can reports a **6x** average giving multiplier for 2023-2024 and says the average 10% pledger ultimately donates about **\$100,000**, of which about **\$15,000** is counterfactual high-impact giving attributable to GWWC and partners.
- The Life You Can Save reports a **10:1** three-year leverage ratio for 2022-2024 and says this is conservative because some influenced giving is not tracked.
- GiveWell's published metrics show extremely high operational leverage, but those figures are not directly comparable to GWWC's multiplier, because GiveWell's numbers include large funders and measure dollars directed or influenced rather than small-donor giving newly caused.

That is why the direct channel uses **8x** rather than simply reading off GiveWell's operating-leverage ratio.

**Channel 2: career, movement-building, and worldview work**

This channel is harder to measure cleanly, but likely matters significantly.

80,000 Hours provides the best public evidence here. Its materials point to large value per plan change and substantial current pipeline activity. But this evidence is noisier than the direct money-moving evidence, because many career or worldview changes operate through longer chains of causation and broader target sets than a direct donation event.

That is why this channel uses a lower central multiplier (**4x**) than the direct money-moving channel. But the downstream benchmark should still be all-things-considered. Many of the opportunities this channel points people toward are not near-term global-health charities; they include animal welfare, catastrophic-risk reduction, global priorities, institution building, and mixed strategic portfolios. Some of that downstream mix likely runs through [AI Existential Risk](/category/ai-risk), [Pandemics](/category/pandemics), and [Nuclear](/category/nuclear), but those pages currently use catastrophe-probability models rather than ordinary **\$/QALY** figures. So the **\$150/QALY** benchmark is meant to capture the average all-things-considered downstream value of the broader opportunity set, including those catastrophic-risk destinations, rather than reading every part of the mix directly off on-site **\$/QALY** benchmarks.

**Sensitivity**

Holding the **40% / 60%** channel split fixed:

- **Optimistic direct, optimistic career/worldview:** 12x on \$80/QALY and 8x on \$50/QALY -> about **\$6/QALY**
- **Optimistic direct, pessimistic career/worldview:** 12x on \$80/QALY and 1x on \$500/QALY -> about **\$16/QALY**
- **Pessimistic direct, optimistic career/worldview:** 5x on \$150/QALY and 8x on \$50/QALY -> about **\$9/QALY**
- **Pessimistic direct, pessimistic career/worldview:** 5x on \$150/QALY and 1x on \$500/QALY -> about **\$69/QALY**

Those four corners show that the category can look extremely strong if the broader channel really does send many people toward very high-value downstream paths. But the evidence for that channel is still much noisier than for direct money-moving, which is why the headline point estimate stays well above the optimistic edge.

The headline range is wider than this simple table: **\$6-\$100/QALY**. The main reason is that the table holds the channel split fixed, while in reality the mix can vary substantially across plausible marginal opportunities. A more theory-heavy or movement-building-heavy portfolio can be meaningfully worse than the central case, while an unusually evaluator-heavy or high-talent-placement-heavy portfolio can be somewhat better.

### Start Time

The **5-year** start time reflects a blend of faster and slower pathways.

Some effective-giving organizations can move money almost immediately, but the largest effects often come from habits and relationships that build over a few years. Career changes are slower still: someone may first encounter the ideas, spend time exploring them, retrain or build career capital, and only later enter a substantially more impactful role. Worldview and theory effects can take even longer.

Because this category includes all three pathways, **5 years** is a reasonable portfolio average.

### Duration

The **25-year** duration reflects that many of the downstream changes in this category are persistent.

A donor who changes their giving philosophy may give more effectively for decades. A career change can alter how someone spends the next 20-30 working years. An institution or fund that is created because of meta work can continue influencing later decisions long after the original intervention.

We do not use a longer duration than 25 years because some effects decay: donors lapse, careers drift, ideas get outdated, and institutions lose focus. So **25 years** is a compromise between short-lived outreach wins and rarer worldview changes that last much longer.

## What Kinds of Charities Are We Modeling?

These estimates assume marginal donations go to **high-quality, high-leverage meta organizations** that do things such as:

- help donors find and fund more effective opportunities
- produce high-quality evaluator or grantmaking research for impact-focused donors
- help talented people enter more impactful careers, including catastrophic-risk and other frontier paths
- spread ideas or frameworks that later change how money, talent, and strategic attention are allocated

We are **not** mainly modeling:

- generic networking or community events with weak evidence of downstream leverage
- theory or philosophy work with no plausible pathway to changing real decisions
- ordinary nonprofit support services that do not substantially improve allocation
- technical global-priorities research, which is treated under Global Priorities Research

## Key Uncertainties

1. **The channel mix.** The direct money-moving share is one of the most important inputs. A more evaluator-heavy opportunity set would look better; a more worldview-heavy one would look worse.
2. **How much to credit career and worldview work.** This remains the hardest part of the estimate. Public evidence exists, but it is weaker and less directly comparable than money-moving evidence.
3. **How broad the downstream cause mix is.** If career and worldview work mainly pushes resources toward very high-value downstream areas such as animal welfare, catastrophic-risk reduction, or top global health, the estimate is too pessimistic. If it mostly pushes resources toward weaker institution-building or more diffuse movement work, it is too optimistic.
4. **Marginal versus average impact.** Public success metrics usually describe historical averages or standout case studies, not the next dollar.
5. **Double counting risk.** Meta work often creates value by sending resources into other cause areas that also have their own pages on this site. That is conceptually fine, but it means readers should interpret category comparisons with care.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- This version fixes the transparency problem in the earlier blended model by making the channel weights and downstream benchmarks explicit.
- The most important future levers are: direct-channel multiplier, career/worldview multiplier, channel mix, and the downstream `$/QALY` benchmark for the broader career/worldview bucket.
- If future editors want to change this estimate substantially, they should probably update the dedicated assumption page rather than trying to tweak a sentence or two in the category page.
