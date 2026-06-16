---
id: human-rights-welfare-conversion
name: 'Human rights welfare conversion model'
---

_The following analysis was done on April 14th 2026 by GPT-5.4, with prompts from Impact List staff._

## How should the Human Rights category convert rights harms into QALY-equivalent welfare?

The [Human Rights and Justice](/category/human-rights) page uses two especially important conversion assumptions:

1. Each measured **VAWG DALY averted** corresponds to about **2.5 QALY-equivalent welfare gains** in total.
2. Each person avoiding **bonded labour / labour trafficking** gains about **1.0 QALY-equivalent** in total.

These assumptions aim to express the main effects of severe rights violations in one common welfare unit.

## 1. Why treat 1 measured VAWG DALY as about 2.5 total QALY-equivalents?

The driver is that measured DALYs capture only roughly **40%** of the total welfare effect, so **1 measured DALY averted -> about 2.5 total QALY-equivalent gains**, with a {{PLAUSIBLE_RANGE}} of about **1–4 total QALY-equivalents** per measured DALY. The range is wide because the uplift is a single contested capture fraction: 1x is no uplift (DALYs already capture everything), 4x corresponds to DALYs capturing only about a quarter.

The uplift exists because [Ferrari et al. 2022](https://journals.plos.org/plosmedicine/article?id=10.1371%2Fjournal.pmed.1003827), the best public quantitative anchor in the category, is explicit that its DALY total omits mortality, post-intervention persistence beyond the study horizon, and broader social, safety, and psychosocial harms. The size of the uplift is bounded from above because Ferrari already includes some major mental-health sequelae that broader harms overlap with.

:::details{title="What the measured DALYs leave out, and why the uplift is bounded both ways"}
Ferrari et al. uses a **1-year horizon**, includes only a **subset of health consequences**, assumes **no mortality impact**, and reports broader social and economic outcomes separately in impact inventories rather than folding them into the DALY total. So the measured DALY figures should not be read as the full welfare effect of preventing violence. They omit or truncate several things that matter:

- mortality and severe injury risk
- post-intervention persistence beyond the study horizon
- safety, fear reduction, and freedom from coercion
- psychosocial harms such as economic hardship, concern for children, and broader damage to well-being

The psychosocial review by Wessells and Kostelny makes this broader point directly: IPV harms are not only clinical disorders such as PTSD or depression, but also non-clinical psychosocial impacts that cause extensive suffering and damage well-being. ([Wessells and Kostelny 2022](https://www.mdpi.com/1660-4601/19/21/14488))

So the question is not whether to count those omitted harms, but how much to add. We do not use a much larger number because Ferrari already includes some major mental-health sequelae, and some broader harms overlap with those measured health effects. We do not use zero uplift because the paper itself clearly says that mortality, persistence, and broader impacts are left out. A **2.5x** total conversion, with a plausible range of **1–4x**, is a reasonable summary.
:::

## 2. Why treat one person avoiding bonded labour as about 1.0 QALY-equivalent?

The conversion multiplies an annual all-things-considered welfare loss while exploited of about **0.5 QALY-equivalents** by a central duration avoided of about **2.1 years**:

$$
0.5 \times 2.1 \approx 1.05 \text{ QALY-equivalents}
$$

Rounded to a usable category-level central assumption, that is about **1.0 QALY-equivalent per person avoided**, with a plausible range of about **0.4–2.0**. The range varies both terms jointly: the low end is shorter duration and milder average utility loss, the high end is longer duration and more severe welfare losses.

:::details{title="Evidence behind the 0.5 annual loss and 2.1-year duration"}
The 0.5 annual loss is a shorthand for a bundle of harms — mental illness and trauma, pain and physical symptoms, fear and coercion, shame and worthlessness, and reduced freedom and daily functioning — not a precise figure. The public evidence supports three components:

1. **Duration.** Lightowlers et al. estimate mean adult labour exploitation duration at about **775 days**, roughly **2.1 years**. ([Lightowlers et al. 2024](https://journals.sagepub.com/doi/10.1177/17488958221094988))
2. **Health-related quality-of-life loss.** Reviews of trafficking survivors find high prevalence of depression, anxiety, PTSD, CPTSD, and physical symptoms. One CPTSD review reports about **41%** prevalence among survivors, and an Indian study reports mean **EQ-5D utility of 0.731** among people with depression. ([Ottisova et al. 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC7137602/), [Evans et al. 2022](https://www.elsevier.es/en-revista-european-journal-psychiatry-431-avance-resumen-prevalence-complex-post-traumatic-stress-disorder-S0213616322000076), [Pathak et al. 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12331007/))
3. **Broader non-health harms.** Human-trafficking survivors report shame, anger, worthlessness, betrayal, and impaired daily functioning. ([Williamson et al. 2024](https://pubmed.ncbi.nlm.nih.gov/39543768/))
:::

## 3. Why add an uplift at all?

Both conversions are uncertain, but adding an uplift is more faithful to an all-things-considered welfare estimate than treating autonomy, dignity, fear, and post-intervention persistence as real but effectively zero in the headline calculation.
