---
id: global-priorities-channel-model
name: 'Global Priorities channel model'
---

_The following analysis was done on April 10th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

## How should Global Priorities Research be modeled?

The [Global Priorities Research](/category/global-priorities) page uses a two-channel model:

1. **Direct philanthropic reallocation**
2. **Broader strategic spillovers**

The overall structure is:

$$
\text{Cost per QALY} = \dfrac{C}{Q_d + Q_s}
$$

Where:

- $C$ = annual cost of the GPR work
- $Q_d$ = QALYs created by improving later philanthropic allocation
- $Q_s$ = QALYs created through broader strategic spillovers

The direct channel is:

$$
Q_d = \dfrac{I \times g}{B}
$$

Where:

- $I$ = later philanthropic capital influenced
- $g$ = direct proportional increase in the welfare output of that capital
- $B$ = counterfactual cost per QALY of that capital

The broader strategic channel is modeled as:

$$
Q_s = k \times Q_d
$$

Where:

- $k$ = the broader strategic channel relative to the direct philanthropic channel

This page justifies three especially important judgment calls:

- using **\$400/QALY** for the counterfactual cost-effectiveness of influenced capital
- using **40%** for the direct improvement in that capital's all-things-considered welfare output
- using a broader-strategic channel worth about **100%** of the direct philanthropic channel, with a practical range of **0%-300%**

## 1. Why use an all-things-considered QALY model?

The key premise is that GPR is not only about near-term human-health grantmaking. Its point is to improve the allocation of large later resources across causes, interventions, institutions, and sometimes policy questions. Those downstream effects can still be expressed in QALY-equivalent terms.

That is broadly consistent with how major organizations in this space publicly describe their own work. Rethink Priorities says its updated Moral Parliament tool helps philanthropists and policymakers compare trade-offs across **healthcare resources, global health charities, animal species, and movement-building strategies**. ([Rethink Priorities 2025 results / 2026 plans](https://rethinkpriorities.org/2025-results/)) Coefficient Giving likewise says it converts health and income impacts into common units and then uses the same framework for more indirect work such as **housing supply** and **scientific progress**, by translating those changes into downstream health or income gains. ([Coefficient cost-effectiveness](https://coefficientgiving.org/research/cost-effectiveness/))

So the right question is not whether GPR affects only direct health outcomes. The right question is how much all-things-considered welfare a better portfolio produces, expressed in QALY-equivalent units.

## 2. Why use \$400/QALY for the counterfactual influenced capital?

This benchmark is not meant to represent ordinary untargeted philanthropy. It is meant to represent **impact-motivated but non-frontier** capital of the sort that a strong GPR organization can still improve.

The site's own category estimates already suggest that serious opportunities span a very wide range:

- [Animal Welfare](/category/animal-welfare): about **\$2.3/QALY**
- [Meta and Theory](/category/meta-theory): about **\$25/QALY**
- [Global Health](/category/global-health): about **\$90/QALY**
- [Global Development](/category/global-development): about **\$210/QALY**
- [Climate Change](/category/climate-change): about **\$590/QALY**
- [Human Rights](/category/human-rights): about **\$600/QALY**
- [Conflict Mitigation](/category/conflict-mitigation): about **\$1,000/QALY**
- [Institutions](/category/institutions): about **\$3,000/QALY**

Coefficient Giving's public bar is even stronger: it says its current minimum grantmaking bar is roughly equivalent to **one healthy life-year per \$50** spent. ([Coefficient cost-effectiveness](https://coefficientgiving.org/research/cost-effectiveness/))

That does **not** mean the counterfactual capital influenced by GPR is usually as weak as ordinary philanthropy or as strong as Coefficient's own current frontier. A central figure of **\$400/QALY** is a reasonable middle ground for capital that is already trying to do good, but is still materially improvable by better prioritization. A practical range of **\$200-\$1,000/QALY** reflects donors who are respectively closer to or further from the frontier.

## 3. Why use 40% for the direct improvement factor?

If the counterfactual portfolio is around **\$400/QALY**, and some frontier opportunities are in the **\$25-\$100/QALY** range, then a complete shift of all influenced capital toward the frontier would imply a much larger gain than **40%**.

But GPR should not be credited with anything like a complete shift:

- many clients already have some impact orientation
- many recommendations are adopted only partially
- some work improves intervention choice **within** a cause rather than changing the cause itself
- some projects mostly improve judgment, grant selection, or sequencing rather than triggering a dramatic cause pivot

So the central question is not whether a large improvement is possible in principle, but what is plausible **on average across all influenced capital**.

The public evidence supports a meaningful but not extreme central figure. Rethink Priorities says its GHD research supported major donors whose program budgets total **hundreds of millions of dollars**, and publicly reports one case where its research shifted **\$8 million** toward a more cost-effective lead intervention. ([Rethink Priorities 2025 results / 2026 plans](https://rethinkpriorities.org/2025-results/), [RP impact page](https://rethinkpriorities.org/impact-area/improving-outcomes-shifting-funding-to-more-cost-effective-options/)) RP also describes cross-cause prioritization tools that compare very different downstream priorities rather than making only narrow within-cause tweaks. ([Rethink Priorities 2025 results / 2026 plans](https://rethinkpriorities.org/2025-results/)) Coefficient Giving says it has helped Good Ventures give **over \$4 billion** historically and directed **over \$100 million** from non-Good-Ventures donors in 2024, with that number more than doubling in 2025 so far. ([Open Philanthropy Is Now Coefficient Giving](https://coefficientgiving.org/research/open-philanthropy-is-now-coefficient-giving/))

Taken together, that evidence supports a model where the average influenced dollar gets materially better, but not one where every influenced dollar is pushed all the way to the current best opportunity. A direct improvement factor of **40%**, with a practical range of **15%-80%**, is therefore a moderate central choice.

## 4. Why model broader strategic spillovers as a separate channel?

The direct philanthropic-allocation effect is the clearest measured channel, but it is not the whole story.

Rethink Priorities says its Worldview Investigations team works on **cross-cause prioritization** and creates tools and insights that guide **funders and key stakeholders**. ([Rethink Priorities 2025 results / 2026 plans](https://rethinkpriorities.org/2025-results/)) The same update highlights tools that compare movement-building strategies and work on digital minds and AI strategy that informs not only donors but also broader institutions. ([Rethink Priorities 2025 results / 2026 plans](https://rethinkpriorities.org/2025-results/)) Coefficient Giving's public framework similarly treats indirect effects on housing, innovation, and other structural variables as convertible into common welfare units rather than as outside the metric. ([Coefficient cost-effectiveness](https://coefficientgiving.org/research/cost-effectiveness/))

That suggests the non-donation effects of strong GPR should not be set to zero. Better prioritization can also affect:

- which problems talented people work on
- which fields get early institution-building support
- which policy agendas and strategies look worth pursuing
- which conceptual tools later decision-makers inherit

These are not obviously tiny effects relative to later grant reallocation. For some of the strongest GPR, they may be a large part of the point. A cause-prioritization report that changes which field a donor backs can also change who later enters that field, which institutions get built around it, and which policy ideas become live options.

At the same time, these spillovers are harder to attribute cleanly than later grants, so they should not be treated as measured with the same confidence. The category therefore models them as a separate strategic channel worth about **100%** of the direct philanthropic channel in the central case, with a practical range of **0%-300%**.

That central figure should not be read as saying spillovers are exactly equal to later philanthropic effects. It is a rough claim that, for frontier-style GPR, the broader strategic effects are plausibly of the **same order of magnitude** as the later grant-allocation effects, not merely a 10% or 25% footnote.

There is also some real **double-counting risk** between the two channels. For example, a philanthropic reallocation may itself help create an institution that later attracts talent or shapes policy. The cleanest way to read the model is therefore that the strategic-channel multiple **should be interpreted net of overlap** with the direct philanthropic channel, not as a fully independent extra effect on top of every downstream grant. The central **100%** figure is meant as a rough net addition after allowing for some overlap, not as a claim that the two channels are perfectly separable.

## 5. What number does this imply?

Using the central assumptions from the category page:

- $C$ = \$2,000,000
- $I$ = \$200,000,000
- $g$ = 40% = 0.4
- $B$ = \$400/QALY
- $k$ = 100% = 1.0

Then the direct philanthropic effect is:

$$
\dfrac{200{,}000{,}000 \times 0.4}{400} = 200{,}000 \text{ QALYs}
$$

The broader strategic channel is:

$$
1.0 \times 200{,}000 = 200{,}000 \text{ QALYs}
$$

So:

$$
\text{Total QALYs} = 200{,}000 + 200{,}000 = 400{,}000
$$

$$
\text{Cost per QALY} = \dfrac{2{,}000{,}000}{400{,}000} = 5
$$

That implies a central estimate of about **\$5/QALY**.

## 6. Main uncertainties

The most important uncertainties are:

1. whether the capital influenced by frontier GPR is really as far from the frontier as **\$400/QALY**
2. whether the average direct gain is closer to **15%**, **40%**, or **80%**
3. whether the broader strategic channel is closer to **0%**, **100%**, or **300%** of the direct philanthropic channel
4. how much overlap there really is between later philanthropic reallocation and the broader strategic channel
5. whether the public historical evidence overstates marginal future impact because it comes disproportionately from unusually successful cases
