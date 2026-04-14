---
id: human-rights-welfare-conversion
name: 'Human rights welfare conversion model'
---

_The following analysis was done on April 14th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

## How should the Human Rights category convert rights harms into QALY-equivalent welfare?

The [Human Rights and Justice](/category/human-rights) page uses two especially important conversion assumptions:

1. Each measured **VAWG DALY averted** corresponds to about **2.5 QALY-equivalent welfare gains** in total.
2. Each person avoiding **bonded labour / labour trafficking** gains about **1.0 QALY-equivalent** in total.

These assumptions aim to express the main effects of severe rights violations in one common welfare unit.

## 1. Why treat 1 measured VAWG DALY as about 2.5 total QALY-equivalents?

Ferrari et al. is the best public quantitative anchor in the category, but the paper is explicit about what it leaves
out. The analysis uses a **1-year horizon**, includes only a **subset of health consequences**, assumes **no mortality
impact**, and reports broader social and economic outcomes separately in impact inventories rather than folding them
into the DALY total. ([Ferrari et al. 2022](https://journals.plos.org/plosmedicine/article?id=10.1371%2Fjournal.pmed.1003827))

That means the measured DALY figures should not be read as the full welfare effect of preventing violence. They omit
or truncate several things that matter:

- mortality and severe injury risk
- post-intervention persistence beyond the study horizon
- safety, fear reduction, and freedom from coercion
- psychosocial harms such as economic hardship, concern for children, and broader damage to well-being

The psychosocial review by Wessells and Kostelny makes this broader point directly: IPV harms are not only clinical
disorders such as PTSD or depression, but also non-clinical psychosocial impacts that cause extensive suffering and
damage well-being. ([Wessells and Kostelny 2022](https://www.mdpi.com/1660-4601/19/21/14488))

So the question is not whether to count those omitted harms. It is how much to add for them.

A reasonable practical summary is:

- **Central:** measured DALYs capture roughly **40%** of the total welfare effect
- **Equivalent statement:** **1 measured DALY averted -> about 2.5 total QALY-equivalent gains**
- **Practical range:** about **1–4 total QALY-equivalents** per measured DALY

Why not use a much larger number? Because Ferrari already includes some major mental-health sequelae, and some broader
harms overlap with those measured health effects. Why not use no uplift at all? Because the paper itself clearly says
that mortality, persistence, and broader impacts are left out.

So a **2.5x** total conversion, with a practical range of **1–4x**, is a reasonable summary.

## 2. Why treat one person avoiding bonded labour as about 1.0 QALY-equivalent?

The anti-slavery part of the category first estimates the cost per fewer person in bondage. The next step is to
convert that into welfare.

The public evidence supports three components:

1. **Duration.** Lightowlers et al. estimate mean adult labour exploitation duration at about **775 days**, roughly
   **2.1 years**. ([Lightowlers et al. 2024](https://journals.sagepub.com/doi/10.1177/17488958221094988))
2. **Health-related quality-of-life loss.** Reviews of trafficking survivors find high prevalence of depression,
   anxiety, PTSD, CPTSD, and physical symptoms. One CPTSD review reports about **41%** prevalence among survivors, and
   an Indian study reports mean **EQ-5D utility of 0.731** among people with depression. ([Ottisova et al. 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC7137602/), [Evans et al. 2022](https://www.elsevier.es/en-revista-european-journal-psychiatry-431-avance-resumen-prevalence-complex-post-traumatic-stress-disorder-S0213616322000076), [Pathak et al. 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12331007/))
3. **Broader non-health harms.** Human-trafficking survivors report shame, anger, worthlessness, betrayal, and
   impaired daily functioning. ([Williamson et al. 2024](https://pubmed.ncbi.nlm.nih.gov/39543768/))

The cleanest way to summarize this is:

- annual all-things-considered welfare loss while exploited: about **0.5 QALY-equivalents**
- central duration avoided: about **2.1 years**

So:

$$
0.5 \times 2.1 \approx 1.05 \text{ QALY-equivalents}
$$

Rounded to a usable category-level central assumption, that is about **1.0 QALY-equivalent per person**.

That central figure should not be read as precise. It is a shorthand for a bundle of harms:

- mental illness and trauma
- pain and physical symptoms
- fear and coercion
- shame and worthlessness
- reduced freedom and daily functioning

A practical range of about **0.4–2.0 QALY-equivalents** per person avoided is reasonable. The low end corresponds to
shorter duration and milder average utility loss; the high end corresponds to longer duration and more severe welfare
losses.

## 3. Bottom line

The category's welfare conversions are:

- **VAWG:** **1 measured DALY averted -> about 2.5 total QALY-equivalent gains**, with a practical range of **1–4**
- **Bonded labour:** **about 1.0 QALY-equivalent per person avoided**, with a practical range of **0.4–2.0**

These are uncertain, but they are more faithful to an all-things-considered welfare estimate than treating autonomy,
dignity, fear, and post-intervention persistence as real but effectively zero in the headline calculation.
