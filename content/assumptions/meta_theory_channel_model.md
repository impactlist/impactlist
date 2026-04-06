---
id: meta-theory-channel-model
name: 'Meta and Theory channel model'
---

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

## How should Meta and Theory be modeled?

The category page for Meta and Theory uses a two-channel model:

1. **Direct money-moving and evaluator work**
2. **Career, movement-building, and worldview work**

The point of this page is to justify three judgment calls that are too important to leave implicit:

- the **40% / 60%** channel split
- the decision to use **\$100/QALY** for the direct channel and **\$300/QALY** for the broader channel
- the decision to treat GiveWell's operating-leverage numbers as only a loose cross-check rather than the same kind of multiplier as GWWC or The Life You Can Save

## 1. Why split the category into two channels?

The public evidence is not all of one kind.

Some organizations in this space mainly **move money directly** or help donors choose better charities. That is the cleanest and easiest channel to quantify. Giving What We Can, The Life You Can Save, and GiveWell all publish some version of money moved, donations caused, or dollars directed.

Other organizations in this space mainly **change careers, institutions, worldviews, or research agendas**. Their impact is probably real, but it is harder to measure with direct donation metrics. 80,000 Hours is the clearest example, but parts of the category also include public-intellectual work, community infrastructure, and other interventions where the pathway from output to later QALYs is much longer and noisier.

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

## 4. Why is the broader channel benchmark \$300/QALY?

The broader career/worldview channel should be materially worse than the direct money-moving channel for the purposes of this site.

That is not because careers or worldview work are unimportant. It is because the category page is trying to translate everything back into **human-welfare QALYs**, and this broader channel often points to downstream effects that are harder to map into that unit:

- institution building
- mixed cause portfolios
- longtermist work
- talent pipelines whose eventual destination is uncertain
- theory or worldview shifts that improve judgment without immediately causing donations to top global-health charities

If we used something close to **\$90-\$100/QALY** for this broader channel too, we would be implicitly assuming that most of its downstream value looks almost as direct and as legible as GiveWell-style money moved. That seems too optimistic.

If we used something like **\$500-\$1,000/QALY** centrally, we would probably be going too far the other way, because some of this channel really does push substantial money and talent toward very strong opportunities.

So **\$300/QALY** is a compromise:

- clearly worse than direct effective-giving
- still much better than ordinary untargeted philanthropy
- consistent with the idea that many downstream wins are real but only partially legible in near-term human-welfare terms

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
- broader channel: **4x** on **\$300/QALY**

Then:

$$
\text{QALYs per } \$1 = 0.4 \times \frac{8}{100} + 0.6 \times \frac{4}{300}
$$

$$
= 0.032 + 0.008 = 0.04
$$

$$
\text{Cost per QALY} = \frac{1}{0.04} = \$25
$$

So the channel model implies **\$25/QALY**.

## 7. Main uncertainty

The biggest uncertainty is not the arithmetic. It is whether the broader career/worldview channel should be:

- given more or less weight than **60%**
- treated as closer to **\$200/QALY** or closer to **\$500/QALY**
- assigned a multiplier much above or below **4x**

Those are the judgments most likely to move the category estimate materially.
