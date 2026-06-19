---
id: ai-existential-catastrophe-probability
name: 'Probability of AI-caused existential catastrophe'
---

## What is the probability of AI-caused existential catastrophe this century?

This document estimates the baseline probability that advanced AI will cause an **existential catastrophe** before 2100. Following Bostrom's standard framing, that means an outcome that either annihilates Earth-originating intelligent life or permanently and drastically curtails its potential. ([Bostrom 2002](https://nickbostrom.com/existential/risks))

In the AI context, the main cases are:

- literal human extinction
- irreversible human disempowerment by AI systems
- stable AI-enabled totalitarian lock-in or other global outcomes that permanently prevent humanity from determining its own future

**Summary:** We estimate the baseline probability of AI-caused existential catastrophe this century at approximately **14%**, with a {{PLAUSIBLE_RANGE}} of **3–35%**. We decompose that probability into the extinction probability plus the *incremental* probability of a non-extinction existential outcome:

$$P(\text{existential catastrophe}) = P(\text{extinction}) + P(\text{disempowerment or lock-in, no extinction})$$

The second term is the mass on irreversible disempowerment or stable lock-in in worlds where humanity is *not* literally wiped out — not disempowerment risk in general. Numerically, the estimate is roughly **10%** extinction risk plus **4 percentage points** of this non-extinction existential risk.

---

## 1. Extinction-only anchor: about 10%

We start from an **extinction-only** anchor. The site's dedicated extinction page lands on about **10%** as the best single estimate for AI-caused human extinction this century ([detailed justification](/assumption/ai-doom-probability)). That **10%** sits above the optimistic forecasting anchors and the 5% survey medians. It lines up with Toby Ord's roughly 10%, and runs below Grace et al.'s **14.4%** mean on the broader extinction-or-severe-disempowerment wording. That makes it a reasonable base to build on.

:::details{title="What the 10% extinction figure reflects"}
In brief:

- broad AI-researcher surveys clustering around **5%** medians for extremely bad outcomes, with substantial mass above 10%
- an AI-specific XPT domain-expert median of about **3%**, set against sharp disagreement between domain experts and superforecasters that keeps structured forecasting from dominating
- a cluster of researchers who have engaged seriously with alignment and racing dynamics landing around **10%** or above
- live technical arguments: misalignment, deceptive behavior, instrumental convergence, racing pressures, and no reliable way to verify robust control of highly capable systems
:::

---

## 2. Incremental non-extinction component: about +4 percentage points

Once the modeled event includes **irreversible disempowerment** and **stable totalitarian lock-in**, the probability should rise above the extinction-only anchor. The most directly relevant survey evidence is already broader than literal extinction. [Grace et al. (2024)](https://arxiv.org/abs/2401.02843) surveyed 2,778 researchers published in top-tier AI venues. They put a **14.4%** mean (5% median) on AI causing **human extinction or similarly permanent and severe disempowerment within 100 years** — several points above any extinction-only anchor.

:::details{title="The Grace et al. numbers, and the authoritarian-control finding"}
Three figures matter:

- On the broad long-run question about superhuman AI, the median probability assigned to **extremely bad outcomes** such as human extinction was **5%**, and the mean was **9%**.
- On a more specific question about future AI advances causing **human extinction or similarly permanent and severe disempowerment within 100 years**, the mean was **14.4%** and the median was **5%**.
- Between **38% and 51%** of respondents gave at least a **10%** chance to advanced AI leading to outcomes as bad as human extinction, depending on the exact wording.

So the survey puts nontrivial mass not just on everyone dying, but on the wider class of permanent disasters that end humanity's ability to determine its own future. Grace et al. also report that more than half of respondents thought "substantial" or "extreme" concern was warranted about several AI-related scenarios, including **authoritarian control**. That does not by itself imply existential catastrophe. But it strengthens the case that non-extinction political lock-in belongs inside the serious-risk discussion rather than outside it.
:::

---

## 3. Structured forecasting also points to a broader catastrophe class

The [Existential Risk Persuasion Tournament](https://forecastingresearch.org/s/XPT.pdf) separates different event definitions, and the pattern is consistent. Broader catastrophe definitions draw materially higher probabilities than extinction-only definitions. And even its lower-anchor forecasts do not force the broader catastrophe probability into the low single digits. XPT is a useful lower anchor, but not a reason to collapse the estimate to the extinction-only floor.

:::details{title="XPT medians by event definition"}
Its medians were approximately:

- **0.38%** for AI-caused extinction by 2100 among superforecasters
- **3%** for AI-caused extinction by 2100 among domain experts
- **2.13%** for AI catastrophe killing more than 10% of the population within five years among superforecasters
- **12%** for that same catastrophe definition among domain experts

These do not directly answer the exact question this site wants. A catastrophe that kills more than 10% of humanity within five years is broader than extinction, but narrower than the full existential-catastrophe concept used here. Still, the pattern is informative: broader definitions get higher probabilities, domain experts remain much more worried than superforecasters, and even the lower anchor stays above the low single digits.
:::

---

## 4. Why irreversible disempowerment and totalitarian lock-in should add real probability mass

Recent work makes it hard to treat extinction as the only relevant endpoint. The non-extinction pathways are concrete enough that their probability mass should not be rounded to zero. That literature does **not** show irreversible disempowerment or stable lock-in is likely.

:::details{title="The disempowerment and lock-in literature"}
Leonard Dung's paper [“The argument for near-term human disempowerment through AI”](https://link.springer.com/article/10.1007/s00146-024-01930-2) argues directly for the possibility that AI could permanently disempower humanity this century, with extinction as one especially severe case rather than the only case.

[Kulveit et al. (2025)](https://arxiv.org/abs/2501.16946) argue that even incremental AI development could lead to **gradual disempowerment**: an effectively irreversible loss of human influence over the economy, culture, and states. This matters because it provides a concrete pathway to existential catastrophe that does not require one sharp "everyone dies" event.

The political-lock-in pathway is also more concrete than a generic dystopia thought experiment. Work on AI-enabled repression and surveillance, including [Feldstein 2019](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3314162) and [Tokson 2025](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5182213), shows how AI can centralize power, expand surveillance, weaken checks on authority, and make authoritarian drift easier to sustain.
:::

We therefore add a central uplift of about **4 percentage points** for non-extinction existential outcomes — irreversible disempowerment plus stable lock-in. This is an estimate of that mass directly, not a mechanical fraction of any survey gap, and its size is bounded on both ends:

- **Not near zero**, because the disempowerment and authoritarianism literature describes concrete, live pathways, and because broader event definitions consistently draw higher probabilities — Grace et al.'s extinction-or-severe-disempowerment mean (**14.4%**) runs several points above the extinction-only anchor, and XPT's broader-catastrophe numbers run well above its extinction numbers.
- **Not much larger**, because many of these scenarios overlap with extinction rather than stacking on top of it, some survey respondents already fold disempowerment into their extinction-style answers, and our event definition excludes milder authoritarian or surveillance outcomes. (4 percentage points is still a meaningful absolute increment, not a rounding term.)

---

## 5. Combined point estimate: 14%

Combining the two pieces:

- extinction-only anchor: about **10%**
- additional non-extinction existential-catastrophe risk: about **4 percentage points**

gives a broader point estimate of about **14%**. This lands just below the **14.4%** mean from Grace et al.'s extinction-or-severe-disempowerment question — the closest direct survey analogue to the catastrophe definition used here. That convergence is a consistency check on the decomposition, not its source.

### Plausible range: 3–35%

- **3%** gives substantial weight to optimistic readings of the forecasting evidence, to skepticism that disempowerment or lock-in pathways are common, and to institutions adapting faster than pessimists expect.
- **35%** gives room for views on which extinction, gradual disempowerment, and lock-in are all serious channels and current AI governance stays weak relative to the stakes.

The range is wide because the disagreement is not about arithmetic but about deep questions: AI capabilities, alignment, institutional resilience, authoritarian dynamics, and whether civilization stays meaningfully in control.

---

## 6. Conclusion

The decomposition into roughly **10%** extinction risk plus **4 percentage points** of non-extinction existential risk is not exact, but it is the clearest way to see why the broader **14%** estimate exceeds extinction-only p(doom).

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on April 15th 2026 by GPT-5.4, with prompts from Impact List staff._
