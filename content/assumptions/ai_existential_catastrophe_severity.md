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

**Summary:** A reasonable central estimate is **0.75 QALY-equivalents lost per affected person per year**, with a plausible range of **0.5–0.9**. This is a weighted average of roughly **0.9** for extinction and **0.45** for permanent non-extinction catastrophes, using the probability page's current `8% extinction + 4 percentage points non-extinction` decomposition. If that probability split changes, this weighted severity should be recalculated.

---

## 1. Structure of the estimate

We use:

- extinction severity: `S_e = 0.9`
- permanent non-extinction catastrophe severity: `S_n = 0.45`
- extinction probability component: `P_e = 8%`
- non-extinction probability component: `P_n = 4%`

So the central severity for the combined event class is:

- `S = (P_e x S_e + P_n x S_n) / (P_e + P_n)`
- `S = (0.08 x 0.9 + 0.04 x 0.45) / 0.12 = 0.75`

This is intentionally coupled to the probability decomposition. If the category later uses, for example, `8% + 8%` rather than `8% + 4%`, the central severity should not be left at `0.75` by default.

---

## 2. Extinction severity: about 0.9

For ordinary human life, a full life-year is not worth a perfect 1.0 QALY on average. Healthy-life-expectancy data suggest something closer to the high `0.8`s or about `0.9` as a rough all-things-considered benchmark. ([WHO](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy), [Our World in Data](https://ourworldindata.org/life-expectancy))

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

So `0.45` is a reasonable central value for the permanent non-extinction component: lower than extinction, but still an enormous welfare loss.

---

## 4. Plausible range: 0.5–0.9 for the combined event

The range applies to the **overall weighted-average catastrophe class**, not specifically to the non-extinction component by itself.

- **0.5** fits views where non-extinction pathways dominate more of the catastrophe class and preserve substantial everyday welfare even while permanently curtailing humanity's broader potential.
- **0.9** fits views where the main relevant mass is extinction or where permanent lock-in is treated as nearly as bad as extinction over the modeled horizon.

---

## 5. Conclusion

The best central estimate is:

- **Extinction severity:** about `0.9`
- **Permanent non-extinction catastrophe severity:** about `0.45`
- **Combined severity under the current probability split:** about `0.75`
- **Plausible combined range:** about `0.5–0.9`

This is the right order of magnitude once AI existential catastrophe is understood to include both extinction and permanent non-extinction outcomes such as irreversible disempowerment and totalitarian lock-in.

{{CONTRIBUTION_NOTE}}
