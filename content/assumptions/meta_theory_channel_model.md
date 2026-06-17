---
id: meta-theory-channel-model
name: 'Meta and Theory channel model'
---

_The following analysis was done on April 14th 2026 by GPT-5.4, with prompts from Impact List staff._

## How should Meta and Theory be modeled?

The category page for Meta and Theory uses a two-channel model:

1. **Direct money-moving and evaluator work**
2. **Career, movement-building, and worldview work**

The point of this page is to justify three judgment calls that are too important to leave implicit:

- the **40% / 60%** channel split
- the decision to use **\$100/QALY** for the direct channel and **\$150/QALY** for the broader channel
- the decision to treat GiveWell's operating-leverage numbers as only a loose cross-check rather than the same kind of multiplier as GWWC or The Life You Can Save

Together these imply about **\$21/QALY** for the category, with a {{PLAUSIBLE_RANGE}} of roughly **\$6-\$300/QALY**: a **40% / 60%** split of an **8x**-leveraged direct channel at **\$100/QALY** and a **4x**-leveraged broader channel at **\$150/QALY**. The category page supplies the leverage ranges (**5x-12x** for the direct channel and **1x-8x** for the broader channel); this page justifies the split and the two downstream benchmarks, including the direct-channel range of **\$80-\$150/QALY** and broader-channel range of **\$50-\$500/QALY**. The high end extends beyond the parameter sweep because marginal opportunities can have much weaker attribution or a less favorable channel mix than the central model.

## 1. Why split the category into two channels?

The public evidence is not all of one kind.

Some organizations in this space mainly **move money directly** or help donors choose better charities. That is the cleanest and easiest channel to quantify. Giving What We Can, The Life You Can Save, and GiveWell all publish some version of money moved, donations caused, or dollars directed.

Other organizations in this space mainly **change careers, institutions, worldviews, or research agendas**. Their impact is probably real, but it is harder to measure with direct donation metrics. 80,000 Hours is the clearest example, but parts of the category also include public-intellectual work, community infrastructure, and other interventions where the pathway from output to later welfare gains is much longer and noisier.

Trying to force all of that into one multiplier hides too much structure. A two-channel model is a useful compromise between realism and simplicity.

## 2. Why use a 40% / 60% channel split?

The split is not meant as a literal accounting identity for all spending in the broad ecosystem. It is a modeling judgment about the kind of **marginal opportunities** this category is trying to represent.

Why not make the direct money-moving channel most of the category?

- Because the category is broader than GiveWell, GWWC, and TLYCS
- Because many important and representative meta organizations mainly shape careers, institutions, or ideas rather than moving money directly
- Because the recipient mapping in this project already includes several organizations that are not primarily direct money movers

Why not make the career/worldview channel almost all of the category?

- Because the strongest public evidence in the category comes from direct money-moving and evaluator organizations
- Because those organizations are highly representative of what many donors mean by "meta" giving
- Because a category estimate that barely counted them would understate the most measurable part of the space

So **40% direct / 60% broader** is meant as a middle position:

- large enough direct share to let the measured money-moving evidence matter
- large enough broader share to reflect that much of the category is less direct and less cleanly measurable

## 3. Why is the direct channel benchmark \$100/QALY?

The site's own [Global Health](/cause/global-health) page uses **\$105/QALY** as its point estimate for top GiveWell-style opportunities.

The direct channel here is close to that benchmark: **\$100/QALY**, with a plausible range of **\$80-\$150/QALY**. The small difference from the Global Health point estimate is not meant to be precise; it reflects three things:

1. not all influenced giving will land in the single best GiveWell-style opportunities
2. some money will go to slightly broader but still highly effective portfolios
3. the direct channel includes evaluators and effective-giving institutions whose output is not perfectly identical to donating straight to the current best global-health opportunity

So the direct channel should stay close to the site's top global-health estimate, but not automatically equal it.

## 4. Why is the broader channel benchmark \$150/QALY?

The broader career/worldview channel earns a different benchmark because of its downstream **portfolio mix**, not because its effects are outside the metric. It steers people across a very wide spread of destinations — from cheap cause areas like animal welfare (~\$2.3/QALY) and global priorities research (~\$5) up to expensive ones like institutions (~\$3,000), plus catastrophic-risk work the site does not express in ordinary cost-per-QALY terms at all.

**\$150/QALY** is the compromise: a little worse than the direct channel's \$100 because the portfolio is more heterogeneous, but well below ordinary mixed philanthropy because many downstream wins still land in very strong cause areas (80,000 Hours in particular skews toward AGI and catastrophic-risk careers). The internal category estimates used below are calibration examples, not independent evidence; the load-bearing claim is that the broader channel targets a mixed but still unusually impact-oriented downstream portfolio.

:::details{title="Bounding the broader-channel benchmark"}
As calibration examples, the full downstream spread under the site's current estimates includes [Animal Welfare](/cause/animal-welfare) ~\$2.3/QALY, [Global Priorities Research](/cause/global-priorities) ~\$5, [Global Health](/cause/global-health) ~\$105, [Global Development](/cause/global-development) ~\$210, [Conflict Mitigation](/cause/conflict-mitigation) ~\$333, [Improving Institutions](/cause/institutions) ~\$3,000 — plus targets like longtermist and catastrophic-risk work, talent pipelines with uncertain destinations, and worldview shifts that improve later allocation. Some of that points into [AI Existential Risk](/cause/ai-risk), [Pandemics](/cause/pandemics), and [Nuclear](/cause/nuclear), which do not use ordinary cost-per-QALY numbers, so the benchmark treats them as part of one all-things-considered QALY-equivalent portfolio. ([Donate to 80,000 Hours](https://80000hours.org/support-us/donate/), [80,000 Hours review: 2023 to mid-2025](https://80000hours.org/2025/09/80000-hours-review-2023-to-mid-2025/))

Using **\$90-\$100/QALY as the central benchmark** would assume the mix is nearly as targeted as direct evaluator work — too optimistic. Using **\$300-\$1,000/QALY** would treat its destinations as much weaker than top global health just for being broader or longer-run — not the right adjustment either. We therefore use **\$150/QALY** centrally, with a plausible range of **\$50-\$500/QALY**.
:::

## 5. Why not treat GiveWell's ratio as the same kind of multiplier as GWWC's 6x?

Because they measure different things. GWWC's figure is close to a true counterfactual giving multiplier (extra high-impact giving caused per dollar spent), whereas GiveWell's published metrics are **operational leverage** (dollars directed relative to operating expenses). The latter is strong evidence that evaluators can be highly leveraged, but it shouldn't be plugged mechanically into the same slot as GWWC's 6x — so we let it raise confidence in the direct channel without treating it as an identical multiplier.

:::details{title="Why operational leverage isn't a counterfactual multiplier"}
GiveWell's directed-dollars ratio differs from a counterfactual donation multiplier because:

- some of the money comes from very large donors
- some of those donors were already highly impact-motivated
- the causal claim is "influenced" or "directed," not necessarily "newly caused"
- marginal small-donor support for GiveWell operations is not guaranteed to scale in proportion to the average historical ratio
:::

## 6. What number does this model imply?

Combining the channel shares and benchmarks above:

$$
\text{QALYs per } \$1 = 0.4 \times \frac{8}{100} + 0.6 \times \frac{4}{150} = 0.032 + 0.016 = 0.048
$$

$$
\text{Cost per QALY} = \frac{1}{0.048} \approx \$20.8
$$

So the channel model implies about **\$21/QALY**.

## 7. Main uncertainty

The biggest uncertainty is not the arithmetic. It is whether the broader career/worldview channel should be:

- given more or less weight than **60%**
- treated as closer to **\$50/QALY** or closer to **\$500/QALY**
- assigned a multiplier much above or below **4x**

Those are the judgments most likely to move the category estimate materially. Combining the category page's leverage ranges with the benchmark ranges here gives the published category range of about **\$6-\$300/QALY**; the high-cost side extends beyond the fixed-split parameter table because a marginal opportunity can be more worldview-heavy than the central 40% / 60% split and because attribution can be weaker than the central model assumes.
