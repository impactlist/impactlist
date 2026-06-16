---
id: global-priorities-channel-model
name: 'Global Priorities channel model'
---

_The following analysis was done on April 10th 2026 by GPT-5.4, with prompts from Impact List staff._

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

- using **\$400/QALY** for the counterfactual cost-effectiveness of influenced capital ($B$)
- using **40%** for the direct improvement in that capital's all-things-considered welfare output ($g$)
- using a broader-strategic channel worth about **100%** of the direct philanthropic channel ($k$), with a {{PLAUSIBLE_RANGE}} of **0%-300%**

Together with the scale inputs inherited from the category page — **\$2 million** of annual GPR cost ($C$) influencing **\$200 million** of later philanthropy ($I$) — these imply about **\$5/QALY**: an influenced \$200M improved 40% against a \$400/QALY baseline is 200,000 direct QALYs, and a strategic channel of equal size doubles that to 400,000 QALYs for \$2M of cost. (This page justifies only $B$, $g$, and $k$; $C$ and $I$ are inherited.)

## 1. Why use an all-things-considered QALY model?

The key premise is that GPR is not only about near-term human-health grantmaking. Its point is to improve the allocation of large later resources across causes, interventions, institutions, and sometimes policy questions. Those downstream effects can still be expressed in QALY-equivalent terms.

That is broadly consistent with how major organizations in this space publicly describe their own work. Rethink Priorities says its updated Moral Parliament tool helps philanthropists and policymakers compare trade-offs across **healthcare resources, global health charities, animal species, and movement-building strategies**. ([Rethink Priorities 2025 results / 2026 plans](https://rethinkpriorities.org/2025-results/)) Coefficient Giving likewise says it converts health and income impacts into common units and then uses the same framework for more indirect work such as **housing supply** and **scientific progress**, by translating those changes into downstream health or income gains. ([Coefficient cost-effectiveness](https://coefficientgiving.org/research/cost-effectiveness/))

So the right question is not whether GPR affects only direct health outcomes. The right question is how much all-things-considered welfare a better portfolio produces, expressed in QALY-equivalent units.

## 2. Why use \$400/QALY for the counterfactual influenced capital?

This benchmark ($B$) is not meant to represent ordinary untargeted philanthropy, nor a frontier funder's current best bar. It represents **impact-motivated but non-frontier** capital of the sort that a strong GPR organization can still improve. A central figure of **\$400/QALY** is a reasonable middle ground for capital that is already trying to do good but is still materially improvable by better prioritization, with a plausible range of **\$200-\$1,000/QALY** for donors respectively closer to or further from the frontier.

That \$400 sits well inside the spread of serious opportunities — far worse than the frontier funders GPR competes with, but far better than untargeted giving.

:::details{title="Where the 400/QALY benchmark sits among serious opportunities"}
The site's own category estimates already span a very wide range: [Animal Welfare](/category/animal-welfare) about **\$2.3/QALY**, [Meta and Theory](/category/meta-theory) about **\$21/QALY**, [Global Health](/category/global-health) about **\$90/QALY**, [Global Development](/category/global-development) about **\$210/QALY**, [Human Rights](/category/human-rights) about **\$310/QALY**, [Conflict Mitigation](/category/conflict-mitigation) about **\$333/QALY**, [Climate Change](/category/climate-change) about **\$590/QALY**, and [Institutions](/category/institutions) about **\$3,000/QALY**.

Coefficient Giving's public bar is even stronger: it says its current minimum grantmaking bar is roughly equivalent to **one healthy life-year per \$50** spent. ([Coefficient cost-effectiveness](https://coefficientgiving.org/research/cost-effectiveness/)) The counterfactual capital influenced by GPR is neither as weak as ordinary philanthropy nor as strong as Coefficient's own current frontier, which is why a middle figure is appropriate.
:::

## 3. Why use 40% for the direct improvement factor?

A direct improvement factor ($g$) of **40%**, with a plausible range of **15%-80%**, is a moderate central choice: the average influenced dollar gets materially better, but it is not pushed all the way to the frontier. A complete shift would imply far more than 40% — if the counterfactual portfolio is around **\$400/QALY** and some frontier opportunities are in the **\$25-\$100/QALY** range, moving all influenced capital to the frontier would multiply welfare output several-fold.

But GPR should not be credited with anything like a complete shift:

- many clients already have some impact orientation
- many recommendations are adopted only partially
- some work improves intervention choice **within** a cause rather than changing the cause itself
- some projects mostly improve judgment, grant selection, or sequencing rather than triggering a dramatic cause pivot

So the central question is not whether a large improvement is possible in principle, but what is plausible **on average across all influenced capital** — and the public evidence supports a meaningful but not extreme figure.

:::details{title="Public evidence behind a material-but-partial improvement"}
Rethink Priorities says its GHD research supported major donors whose program budgets total **hundreds of millions of dollars**, and publicly reports one case where its research shifted **\$8 million** toward a more cost-effective lead intervention. ([Rethink Priorities 2025 results / 2026 plans](https://rethinkpriorities.org/2025-results/), [RP impact page](https://rethinkpriorities.org/impact-area/improving-outcomes-shifting-funding-to-more-cost-effective-options/)) RP also describes cross-cause prioritization tools that compare very different downstream priorities rather than making only narrow within-cause tweaks. ([Rethink Priorities 2025 results / 2026 plans](https://rethinkpriorities.org/2025-results/)) Coefficient Giving says it has helped Good Ventures give **over \$4 billion** historically and directed **over \$100 million** from non-Good-Ventures donors in 2024, with that number more than doubling in 2025 so far. ([Open Philanthropy Is Now Coefficient Giving](https://coefficientgiving.org/research/open-philanthropy-is-now-coefficient-giving/))

Taken together, that supports a model where the average influenced dollar gets materially better, but not one where every influenced dollar is pushed all the way to the current best opportunity.
:::

## 4. Why model broader strategic spillovers as a separate channel?

The direct philanthropic-allocation effect is the clearest measured channel, but it is not the whole story. Strong GPR also reshapes which problems talented people work on, which fields get early institution-building support, which policy agendas look worth pursuing, and which conceptual tools later decision-makers inherit. These are not obviously tiny relative to later grant reallocation — for some of the strongest GPR, they may be a large part of the point — so the category models them as a separate strategic channel ($k$) worth about **100%** of the direct philanthropic channel in the central case, with a plausible range of **0%-300%**.

The **100%** figure carries two qualifications:

- It does **not** claim spillovers exactly equal later philanthropic effects. It is a rough claim that, for frontier-style GPR, the broader strategic effects are plausibly of the **same order of magnitude** as the later grant-allocation effects — not a 10% or 25% footnote, and not several multiples larger either.
- It is meant **net of overlap** with the direct channel. There is real double-counting risk: a philanthropic reallocation may itself help create an institution that later attracts talent or shapes policy. So the multiple is a rough net addition after allowing for that overlap, not a fully independent effect stacked on top of every downstream grant. These spillovers are also harder to attribute cleanly than later grants, which is why the range runs all the way down to 0%.

:::details{title="Why the non-donation channel should not be set to zero"}
Rethink Priorities says its Worldview Investigations team works on **cross-cause prioritization** and creates tools and insights that guide **funders and key stakeholders**, including tools that compare movement-building strategies and work on digital minds and AI strategy that informs not only donors but also broader institutions. ([Rethink Priorities 2025 results / 2026 plans](https://rethinkpriorities.org/2025-results/)) Coefficient Giving's public framework similarly treats indirect effects on housing, innovation, and other structural variables as convertible into common welfare units rather than as outside the metric. ([Coefficient cost-effectiveness](https://coefficientgiving.org/research/cost-effectiveness/))

A cause-prioritization report that changes which field a donor backs can also change who later enters that field, which institutions get built around it, and which policy ideas become live options — effects that are real even though they are harder to attribute than a later grant.
:::

## 5. What number does this imply?

The central assumptions combine to about **\$5/QALY**. The two parameters justified above ($g$ = 40%, $B$ = \$400/QALY) set the direct channel; $k$ = 100% sets the strategic channel; the scale inputs ($C$ = \$2,000,000, $I$ = \$200,000,000) are inherited from the category page.

:::details{title="Worked calculation from the central parameters"}
The direct philanthropic effect is:

$$
Q_d = \dfrac{200{,}000{,}000 \times 0.4}{400} = 200{,}000 \text{ QALYs}
$$

The broader strategic channel is:

$$
Q_s = 1.0 \times 200{,}000 = 200{,}000 \text{ QALYs}
$$

So:

$$
\text{Total QALYs} = 200{,}000 + 200{,}000 = 400{,}000
$$

$$
\text{Cost per QALY} = \dfrac{2{,}000{,}000}{400{,}000} = 5
$$
:::

## 6. Main uncertainties

The most important uncertainties are:

1. whether the capital influenced by frontier GPR is really as far from the frontier as **\$400/QALY**
2. whether the average direct gain is closer to **15%**, **40%**, or **80%**
3. whether the broader strategic channel is closer to **0%**, **100%**, or **300%** of the direct philanthropic channel
4. how much overlap there really is between later philanthropic reallocation and the broader strategic channel
5. whether the public historical evidence overstates marginal future impact because it comes disproportionately from unusually successful cases
