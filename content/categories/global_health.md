---
id: global-health
name: 'Global Health'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 50
    costPerQALY: 90
---

# Justification of cost per life

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking, cross-checked by Claude Sonnet 4.5 and Gemini Pro 2.5, and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate (cost per QALY):** **$90 per QALY**  
**Uncertainty range (80% confidence):** **$30–$200 per QALY**

## How we derived the numbers

1. **Base metric.** We aim to report **cost per QALY**. Because EA charity evaluators (especially GiveWell) often publish **cost per death averted** or **DALYs/QALYs per $** embedded in CEAs, we convert when needed:

   - When given **cost per death averted** for under-5s, we multiply deaths averted by **remaining life expectancy** to approximate QALYs (no discounting, per your instructions).
   - We treat **DALYs averted** and **QALYs gained** as roughly comparable for these specific infectious-disease child-survival programs.

2. **Life-years gained assumption.** For under-5 deaths averted in sub-Saharan Africa, we use a round **~60 remaining life-years**. Latest World Bank data show life expectancy in sub-Saharan Africa around **~62–63 years**; starting from early childhood, ~60 years remaining is a reasonable, conservative round figure without discounting.  
   Sources: World Bank life expectancy data for sub-Saharan Africa (most recent ~63 years):  
   [WDI Sub-Saharan Africa — life expectancy](https://data.worldbank.org/indicator/SP.DYN.LE00.IN?locations=ZG), and aggregated view showing **63** in 2023: [WDI summary](https://data.worldbank.org/indicator/SP.DYN.LE00.IN).

3. **Combining interventions.** The point estimate (**$90/QALY**) and range (**$30–$200/QALY**) summarize the cluster formed by AMF, Malaria Consortium (SMC), Helen Keller (VAS), and New Incentives. These four account for a large share of _effective-altruism-vetted_ global health funding and represent the current “best buys.”  
   Pointers to GiveWell models & updates:
   - [GiveWell cost-effectiveness models hub](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models)
   - Recent AMF grant with inputs (e.g., **1.5** “years of coverage” per net cohort): [DRC grant, June 2024](https://www.givewell.org/research/grants/AMF-LLIN-DRC-June-2024)
   - SMC expansion decision (June 2025): [Chad expansion](https://www.givewell.org/research/grants/Malaria-Consortium-SMC-Expansion-in-Chad-June-2025)

## Notes and caveats

- These figures are **location-weighted** impressions from current GiveWell write-ups and recent analyses; actual cost-effectiveness varies by country, insecticide resistance patterns, baseline mortality, program execution, and counterfactual funding flows.
- For readers who want to inspect the underlying models and assumptions, start here: [GiveWell cost-effectiveness models](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models).

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes
