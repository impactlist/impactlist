---
id: ai-existential-catastrophe-severity
name: 'Severity of AI-caused existential catastrophe'
---

_The following analysis was done on April 15th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

## How severe should AI-caused existential catastrophe be modeled per affected person per year?

This document estimates the average welfare shortfall, in QALY-equivalents, conditional on an **AI-caused existential catastrophe** occurring.

The category page models a broader event than extinction alone. It includes:

- literal human extinction
- irreversible human disempowerment by AI systems
- stable totalitarian lock-in or other permanent global conditions that drastically curtail humanity's future

**Summary:** A reasonable central estimate for the baseline catastrophe class is **0.77 QALY-equivalents lost per affected person per year**, with a plausible range of **0.5–0.9**. This is a weighted average of roughly **0.9** for extinction and **0.45** for permanent non-extinction catastrophes, using the probability page's current decomposition (10% extinction plus 4 percentage points non-extinction). If that probability split changes, this weighted severity should be recalculated. For the category page's cost-effectiveness model, the relevant severity is that of the **averted** risk rather than the baseline class; because safety spending skews toward extinction prevention, that works out slightly higher, at about **0.80** (see Section 4).

---

## 1. Structure of the estimate

We use:

- extinction severity: $S_e = 0.9$
- permanent non-extinction catastrophe severity: $S_n = 0.45$
- extinction probability component: $P_e = 10\%$
- non-extinction probability component: $P_n = 4\%$

So the central severity for the combined event class is:

$$S = \frac{P_e \times S_e + P_n \times S_n}{P_e + P_n} = \frac{0.10 \times 0.9 + 0.04 \times 0.45}{0.14} = 0.77$$

This is intentionally coupled to the probability decomposition. If the category later uses, for example, $10\% + 8\%$ rather than $10\% + 4\%$, the central severity should not be left at 0.77 by default.

---

## 2. Extinction severity: about 0.9

For ordinary human life, a full life-year is not worth a perfect 1.0 QALY on average. Healthy-life-expectancy data suggest something closer to the high 0.8s or about 0.9 as a rough all-things-considered benchmark. ([WHO](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy), [Our World in Data](https://ourworldindata.org/life-expectancy))

So if the catastrophe is literal extinction, the welfare loss per affected person-year is near the top of the range, around **0.9**.

That anchor applies most directly to **death** or full loss of ordinary human life-years. It should not simply be copied over to permanent non-extinction catastrophes, where people remain alive under drastically worse civilizational conditions.

---

## 3. Non-extinction severity: about 0.45

The harder question is how to treat **irreversible disempowerment** and **stable totalitarian lock-in**.

These are not just "bad policy" or "ordinary authoritarianism." The modeled event is a permanent global condition in which humanity loses the ability to choose its own future. That is why it belongs under the existential-risk umbrella in the first place. ([Bostrom 2002](https://nickbostrom.com/existential/risks))

Recent work supports treating those outcomes as severe in their own right:

- [Dung 2025](https://link.springer.com/article/10.1007/s00146-024-01930-2) argues that AI could permanently disempower humanity even when extinction is not the immediate mechanism.
- [Kulveit et al. 2025](https://arxiv.org/abs/2501.16946) argues that gradual AI development could create an effectively irreversible loss of human influence over crucial societal systems.
- [Tokson 2025](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5182213) and [Feldstein 2019](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3314162) show how AI can facilitate surveillance, repression, and concentration of power, making lock-in more technologically plausible.

A central non-extinction severity of **0.45** means that nearly half the value of ordinary human life-years is lost for as long as the lock-in or disempowerment lasts.

That is a large loss, but still meaningfully below extinction:

- people may still have relationships, pleasures, projects, health, and some residual freedom
- not every lock-in scenario implies constant suffering or total deprivation
- some everyday welfare could remain even if humanity permanently loses control over its future

It is also much larger than an ordinary political or economic setback:

- agency and self-direction are sharply reduced
- political freedom, pluralism, and open inquiry may be permanently lost
- civilization can no longer reliably revise institutions or recover from the lock-in
- culture, ambition, and collective self-authorship are badly damaged

So 0.45 is a reasonable central value for the permanent non-extinction component: lower than extinction, but still an enormous welfare loss.

It helps to be explicit about what 0.45 is made of. Measured day-to-day wellbeing differences between the freest and most repressive societies today are real but bounded: cross-country life-satisfaction gaps are on the order of 1–3 points on a 0–10 scale even between very free and very unfree countries. ([World Happiness Report](https://worldhappiness.report/)) A purely hedonic reading of permanent lock-in might therefore justify something more like 0.1–0.3. The remainder of the 0.45 reflects the non-hedonic losses that make this an *existential* catastrophe rather than merely a bad regime: the permanent loss of agency, autonomy, and humanity's ability to choose and revise its own future. Readers who give little weight to those non-hedonic components should use a lower value; readers who treat permanent loss of human self-determination as nearly extinction-equivalent should use a higher one.

---

## 4. Severity of the averted risk: about 0.80

The weighted average above describes the baseline catastrophe class. But the category page does not value the baseline class directly — it values the risk that marginal safety spending actually removes, and that is not a proportional slice of the baseline.

The [spending-effect page](/assumption/effect-of-all-ai-safety-spending-on-ai-existential-catastrophe) estimates that historical safety work has been only about 75% as relevant to the non-extinction channels as to extinction. Under its model, the averted risk decomposes into roughly 0.10 percentage points of extinction and 0.030 percentage points of non-extinction catastrophe — about **77% extinction**, versus 71% in the baseline class. The severity of the averted mix is therefore:

$$S_{\text{averted}} = (0.769 \times 0.9) + (0.231 \times 0.45) \approx 0.80$$

The category page uses **0.80** for this reason. Readers who reject that relevance model and assume safety work reduces all channels proportionally should use **0.77** instead; the difference is small (about 4%).

---

## 5. Plausible range: 0.5–0.9 for the combined event

The range applies to the **overall weighted-average catastrophe class**, not specifically to the non-extinction component by itself.

- **0.5** fits views where non-extinction pathways dominate more of the catastrophe class and preserve substantial everyday welfare even while permanently curtailing humanity's broader potential.
- **0.9** fits views where the main relevant mass is extinction or where permanent lock-in is treated as nearly as bad as extinction over the modeled horizon.

---

## 6. Conclusion

The best central estimate is:

- **Extinction severity:** about 0.9
- **Permanent non-extinction catastrophe severity:** about 0.45
- **Combined severity of the baseline catastrophe class:** about 0.77
- **Severity of the averted risk (used by the category page):** about 0.80
- **Plausible combined range:** about 0.5–0.9

This is the right order of magnitude once AI existential catastrophe is understood to include both extinction and permanent non-extinction outcomes such as irreversible disempowerment and totalitarian lock-in.

{{CONTRIBUTION_NOTE}}
