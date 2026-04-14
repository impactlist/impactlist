---
id: meta-theory-channel-model
name: 'Meta and Theory channel model'
---

_The following analysis was done on April 14th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

## How should Meta and Theory be modeled?

The category page for Meta and Theory uses a two-channel model:

1. **Direct money-moving and evaluator work**
2. **Career, movement-building, and worldview work**

The point of this page is to justify three judgment calls that are too important to leave implicit:

- the **40% / 60%** channel split
- the decision to use **\$100/QALY** for the direct channel and **\$150/QALY** for the broader channel
- the decision to treat GiveWell's operating-leverage numbers as only a loose cross-check rather than the same kind of multiplier as GWWC or The Life You Can Save

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

The site's own [Global Health](/category/global-health) page uses **\$90/QALY** as its point estimate for top GiveWell-style opportunities.

The direct channel here is only slightly worse: **\$100/QALY**. That small downgrade reflects three things:

1. not all influenced giving will land in the single best GiveWell-style opportunities
2. some money will go to slightly broader but still highly effective portfolios
3. the direct channel includes evaluators and effective-giving institutions whose output is not perfectly identical to donating straight to the current best global-health opportunity

So the direct channel should stay close to the site's top global-health estimate, but not automatically equal it.

## 4. Why is the broader channel benchmark \$150/QALY?

The broader career/worldview channel should not simply be assigned the same benchmark as the direct money-moving channel, but the reason is downstream portfolio mix, not that its effects are outside the metric.

The right question is what kinds of downstream opportunities this channel tends to steer people toward, expressed in all-things-considered QALY-equivalent terms. Those downstream targets are broad:

- institution building
- mixed cause portfolios
- longtermist and catastrophic-risk work
- talent pipelines whose eventual destination is uncertain
- theory or worldview shifts that improve judgment and later allocation

Under the site's current cause estimates, that opportunity set spans a very wide range: [Animal Welfare](/category/animal-welfare) is about **\$2.3/QALY**, [Global Priorities Research](/category/global-priorities) about **\$5/QALY**, [Global Health](/category/global-health) about **\$90/QALY**, [Global Development](/category/global-development) about **\$210/QALY**, [Conflict Mitigation](/category/conflict-mitigation) about **\$333/QALY**, and [Improving Institutions](/category/institutions) about **\$3,000/QALY**. The broader meta channel plausibly sends people toward a mix across this spread, and 80,000 Hours' current public materials suggest a particularly strong focus on AGI-related careers and catastrophic-risk reduction rather than only near-term global health. ([Donate to 80,000 Hours](https://80000hours.org/support-us/donate/), [80,000 Hours review: 2023 to mid-2025](https://80000hours.org/2025/09/80000-hours-review-2023-to-mid-2025/))

Some of that downstream mix likely points into [AI Existential Risk](/category/ai-risk), [Pandemics](/category/pandemics), and [Nuclear](/category/nuclear). Those pages do not currently use ordinary **\$/QALY** estimates, so they cannot simply be inserted into the weighted-average list above. The broader-channel benchmark therefore has to treat catastrophic-risk destinations as part of one all-things-considered QALY-equivalent portfolio rather than as directly observed on-site **\$/QALY** numbers.

If we used something close to **\$90-\$100/QALY** for this broader channel too, we would be implicitly assuming that its downstream opportunity mix is nearly as targeted as direct evaluator or money-moving work. That seems too optimistic.

If we used something like **\$300-\$1,000/QALY** centrally, we would be implicitly treating the broader channel as though its main downstream destinations were much weaker than top global health simply because they are broader, more strategic, or longer-run. That is not the right adjustment either.

So **\$150/QALY** is a compromise:

- at a slightly higher **\$/QALY** than the direct channel's **\$100/QALY** benchmark, because the downstream portfolio is more heterogeneous and includes both very strong and much weaker destinations
- below ordinary mixed-portfolio philanthropy, because many downstream wins still point toward very strong cause areas
- consistent with a world where some value runs through catastrophic-risk destinations that the site does not yet express in ordinary **\$/QALY** terms

## 5. Why not treat GiveWell's ratio as the same kind of multiplier as GWWC's 6x?

Because they are measuring different things.

Giving What We Can's published figure is close to what people ordinarily mean by a giving multiplier: how much extra high-impact giving is caused by the organization relative to the resources spent.

GiveWell's published metrics are more like **operational leverage**: dollars directed or influenced relative to operating expenses. That is still highly relevant evidence that evaluators can be very leveraged. But it is not the same as a counterfactual donation multiplier for several reasons:

- some of the money comes from very large donors
- some of those donors were already highly impact-motivated
- the causal claim is "influenced" or "directed," not necessarily "newly caused"
- marginal small-donor support for GiveWell operations is not guaranteed to scale in proportion to the average historical ratio

So GiveWell should raise confidence that the direct channel can be very strong, but it should not be plugged mechanically into the same slot as GWWC's 6x.

## 6. What number does this model imply?

Using the central assumptions from the category page:

- direct share: **40%**
- broader share: **60%**
- direct channel: **8x** on **\$100/QALY**
- broader channel: **4x** on **\$150/QALY**

Then:

$$
\text{QALYs per } \$1 = 0.4 \times \frac{8}{100} + 0.6 \times \frac{4}{150}
$$

$$
= 0.032 + 0.016 = 0.048
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

Those are the judgments most likely to move the category estimate materially.
