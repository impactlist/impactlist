---
id: global-development
name: 'Global Development / Poverty'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 10
    costPerQALY: 230
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5, with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from donations to unusually effective charities that help people in extreme poverty become materially better off, especially through large unconditional cash transfers and related "big push" livelihood interventions. The main benefits are higher consumption, greater asset ownership, better food security, improved psychological wellbeing, and in some cases lower child mortality. We mostly leave interventions whose main value comes from preventing disease or death to the Global Health category, and we do not try to model broad economy-wide growth effects here.

## Point Estimates

- **Cost per QALY:** \$230 (\$120–\$600)
- **Start time:** 1 year
- **Duration:** 10 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. For directly donatable poverty programs today, the cleanest anchor is GiveDirectly's flagship Africa poverty-relief program: roughly \$1,000 one-off transfers to households living around or below the World Bank extreme-poverty line in Kenya, Malawi, Mozambique, Rwanda, and Uganda. ([GiveDirectly](https://www.givedirectly.org/programs/), [GiveWell GiveDirectly report](https://www.givewell.org/international/technical/programs/givedirectly-cash-for-poverty-relief-program-november-2024-version))
2. GiveWell's November 2025 benchmark is approximately 0.003 units of value per dollar, where 1 unit is defined as doubling one person's consumption for one year at the \$2.15/day 2017 PPP poverty line. GiveWell explicitly says this newer benchmark remains similar in value to its previous "cash" benchmark, preserving comparability, and now describes GiveDirectly's flagship program as roughly 3-4x the new benchmark. ([GiveWell cost-effectiveness analyses](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models), [GiveWell GiveDirectly report](https://www.givewell.org/international/technical/programs/givedirectly-cash-for-poverty-relief-program-november-2024-version))
3. GiveWell's current moral weights assign 1 unit to doubling consumption for one person for one year and 134 units to averting the death of a five-year-old child. ([GiveWell moral weights](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/moral-weights))
4. Treating the value of averting the death of a five-year-old child as roughly 60 remaining life-years implies about 0.45 QALYs per GiveWell consumption unit. This is an approximate conversion from GiveWell's moral weights into this site's QALY framework, not an independent empirical estimate. ([GiveWell moral weights](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/moral-weights), [World Bank](https://data.worldbank.org/indicator/SP.DYN.LE00.IN?locations=ZG))
5. The main quantified benefits of top cash-transfer programs are recipient consumption gains and positive spillovers to nearby non-recipients; mortality and morbidity effects are real but are probably secondary contributors to the headline poverty estimate. ([GiveWell GiveDirectly report](https://www.givewell.org/international/technical/programs/givedirectly-cash-for-poverty-relief-program-november-2024-version), [Egger et al. 2022](https://doi.org/10.3982/ECTA17945), [Walker et al. 2025](https://www.nber.org/papers/w34152))
6. The best evidence suggests gains are front-loaded but persist for years: GiveWell currently models roughly 10 years of fading consumption gains, while a 2025 Bayesian meta-analysis still finds strong positive average effects on consumption, income, food security, assets, and psychological wellbeing across unconditional-cash studies. ([GiveWell GiveDirectly report](https://www.givewell.org/international/technical/programs/givedirectly-cash-for-poverty-relief-program-november-2024-version), [Crosta et al. 2025](https://www.nber.org/papers/w32779))
7. Graduation / ultra-poor "big push" programs provide evidence that one-off asset-heavy interventions can sometimes sustain gains for 10+ years, but they are costlier and more implementation-sensitive than plain cash, so they are best treated here as supportive upside evidence rather than the main marginal-donation anchor. ([J-PAL Graduation](https://www.povertyactionlab.org/evidence-effect/graduation-approach?lang=en), [Banerjee, Duflo, and Sharma 2021](https://www.aeaweb.org/articles?id=10.1257/aeri.20200667&page=549), [Balboni et al. 2022](https://academic.oup.com/qje/article/137/2/785/6455333))
8. The World Bank updated the international extreme-poverty line from \$2.15/day in 2017 PPP to \$3.00/day in 2021 PPP in June 2025. GiveWell's benchmark still uses the older PPP vintage for continuity, while GiveDirectly's public materials now describe targeting around \$3/day. ([World Bank 2025](https://blogs.worldbank.org/en/opendata/the-world-bank-s-new-global-poverty-lines-in-2021-prices), [GiveWell cost-effectiveness analyses](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models), [GiveDirectly](https://www.givedirectly.org/programs/))

## Details

### Cost per QALY

The cleanest way to estimate this category is to start from GiveWell's latest cash-transfer benchmark rather than from an ad hoc mix of programs. GiveWell's November 2025 benchmark is about **0.003 units of value per dollar** (Assumption 2), and its 2024 reevaluation puts GiveDirectly's flagship poverty-relief program at roughly **3-4x** that benchmark. Taking the midpoint, **3.25x**, gives:

$$
\text{Units per } \$1 \approx 0.003 \times 3.25 = 0.00975
$$

Using Assumption 4 to convert those units into QALYs:

$$
\text{QALYs per } \$1 \approx 0.00975 \times \frac{60}{134} \approx 0.0044
$$

$$
\text{Cost per QALY} \approx \frac{1}{0.0044} \approx \$230
$$

So the point estimate is **\$230/QALY**.

We use this method for three reasons.

First, it is directly anchored to the best public charity-specific cost-effectiveness work available for poverty-focused giving. GiveWell's 2024 reevaluation explicitly incorporates transfer size, targeting, overhead, recipient consumption gains, spillovers to non-recipients, mortality effects, morbidity effects, and negative adjustments such as fraud or psychological spillovers. It is therefore already much closer to an all-things-considered estimate than a back-of-the-envelope cash-transfer calculation.

Second, it handles recent evidence better. In particular, [Walker et al. 2025](https://www.nber.org/papers/w34152) is a genuine positive update for cash transfers: in a very large Kenya experiment, one-time \$1,000 transfers led to **48% fewer infant deaths** and **45% fewer under-five deaths**. That makes the mortality channel more credible than when GiveWell was relying only on preliminary results. But the paper also finds that these mortality gains are highly timing-sensitive, concentrated near birth, and partly distinct from the main consumption channel. So this is a reason to move somewhat upward on cash transfers, not a reason to reclassify generic poverty giving as primarily a mortality intervention.

Third, it avoids overstating the case for graduation programs. The graduation literature is impressive. [Banerjee, Duflo, and Sharma 2021](https://www.aeaweb.org/articles?id=10.1257/aeri.20200667&page=549) find positive effects on consumption, food security, income, and health still present **10 years** later in India, and [Balboni et al. 2022](https://academic.oup.com/qje/article/137/2/785/6455333) provide unusually strong evidence for genuine poverty traps in Bangladesh. But those programs are more complex, harder to scale well, and more sensitive to local implementation quality than plain cash. For a generic category estimate aimed at strong marginal donations, GiveDirectly-style transfers are the safer central anchor, while graduation evidence supports the view that durable gains are possible.

The range **(\$120-\$600/QALY)** is best read as a practical sensitivity range, not a full confidence interval. The biggest levers are:

- how many multiples of GiveWell's benchmark the best marginal poverty program really achieves
- how much QALY-equivalent value we should assign to one GiveWell consumption unit

That second lever is not a purely empirical parameter. It inherits GiveWell's moral judgment about how valuable a consumption-doubling year is relative to averting the death of a young child. Someone who puts more or less value on consumption relative to life-saving would get a different conversion than **60/134 ≈ 0.45**, and therefore a different headline estimate.

For a pessimistic case, using roughly **1.5x benchmark** and **0.4 QALYs per unit** gives about **\$560/QALY**. For an optimistic case, using roughly **5x benchmark** and **0.55 QALYs per unit** gives about **\$120/QALY**. That is the basis for the stated range.

We intentionally do **not** use deworming as a core anchor for this page. Deworming may have long-run income effects, but its main identity is still a health intervention, and counting it here would blur the line between this category and Global Health.

### Start Time

GiveDirectly says its poverty-relief transfers are typically sent about a month after enrollment, so some benefits begin very quickly. We still use **1 year** as a conservative round number because this category is not only "cash arrives in someone's phone account," but the broader effect on living standards from donation through targeting, enrollment, delivery, and realized household spending. Graduation-style programs also take longer to ramp up, so one year is a reasonable portfolio average.

### Duration

A **10-year** duration fits the current evidence better than a **15-year** one for a category whose central anchor is GiveDirectly-style cash transfers. GiveWell's current model assumes roughly **10 years** of fading consumption gains, with a large initial spike and then gradual decay (Assumption 6).

The graduation literature is one reason not to go much shorter than 10 years, because some "big push" interventions really do seem to create durable changes in assets, occupation, and income. But because this site's model spreads benefits evenly across the duration window, and because cash-transfer benefits are front-loaded rather than flat, **10 years** is a better approximation than **15 years** of the actual timing of benefits.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- GiveWell's 3-4x figure maps to roughly \$200-\$250/QALY once converted into this site's QALY framework, which is why the point estimate is still in that neighborhood.
- The main substantive updates in this revision are structural: cash transfers are now the explicit central anchor, graduation is treated as an upside cross-check, deworming is removed as a core input, and duration is shortened from 15 to 10 years.
- If future editors want to move this estimate a lot, the most important levers are: (1) GiveWell's benchmark-relative estimate for the best marginal poverty programs, and (2) the conversion from GiveWell consumption units into QALYs.
- Keep an eye on future GiveWell updates prompted by the 2025-2026 mortality paper and by GiveDirectly's new maternal-health / district-scale pilots. Those could move the estimate meaningfully, but probably not by an order of magnitude unless the marginal program design changes substantially.
