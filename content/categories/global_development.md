---
id: global-development
name: 'Global Development / Poverty'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 10
    costPerQALY: 210
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5, with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from donations to unusually effective charities that help people in extreme poverty become materially better off, especially through large unconditional cash transfers and related "big push" livelihood interventions. The main benefits are higher consumption, greater asset ownership, better food security, improved psychological wellbeing, and in some cases lower child mortality. We mostly leave interventions whose main value comes from preventing disease or death to the Global Health category, and we do not try to model broad economy-wide growth effects here.

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$210 (\$120–\$600)
- **Start time:** 1 year
- **Duration:** 10 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. For directly donatable poverty programs today, the cleanest anchor is GiveDirectly's flagship Africa poverty-relief program: roughly \$1,000 one-off transfers to households living around or below the World Bank extreme-poverty line in Kenya, Malawi, Mozambique, Rwanda, and Uganda. ([GiveDirectly](https://www.givedirectly.org/programs/), [GiveWell GiveDirectly report](https://www.givewell.org/international/technical/programs/givedirectly-cash-for-poverty-relief-program-november-2024-version))
2. GiveWell's November 2025 benchmark is approximately 0.003 units of value per dollar, where 1 unit is defined as doubling one person's consumption for one year at the \$2.15/day 2017 PPP poverty line. GiveWell explicitly says this newer benchmark remains similar in value to its previous "cash" benchmark, preserving comparability, and now describes GiveDirectly's flagship program as roughly 3-4x the new benchmark. ([GiveWell cost-effectiveness analyses](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models), [GiveWell GiveDirectly report](https://www.givewell.org/international/technical/programs/givedirectly-cash-for-poverty-relief-program-november-2024-version))
3. GiveWell's current moral weights assign 1 unit to doubling consumption for one person for one year and 134 units to averting the death of a five-year-old child. ([GiveWell moral weights](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/moral-weights))
4. Using a round figure of 60 remaining life-years for a five-year-old child implies about 0.45 QALYs per GiveWell consumption unit. Conditional life expectancy at age 5 is somewhat higher than that, so this slightly understates the conversion. This is an approximate translation from GiveWell's moral weights into this site's QALY framework, not an independent empirical estimate. ([GiveWell moral weights](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/moral-weights), [World Bank](https://data.worldbank.org/indicator/SP.DYN.LE00.IN?locations=ZG))
5. The main quantified benefits of top cash-transfer programs are recipient consumption gains and positive spillovers to nearby non-recipients; mortality and morbidity effects are real but are probably secondary contributors to the headline poverty estimate. ([GiveWell GiveDirectly report](https://www.givewell.org/international/technical/programs/givedirectly-cash-for-poverty-relief-program-november-2024-version), [Egger et al. 2022](https://doi.org/10.3982/ECTA17945), [Walker et al. 2025](https://www.nber.org/papers/w34152))
6. The best evidence suggests gains are front-loaded but persist for years: GiveWell currently models roughly 10 years of fading consumption gains, while a 2024 Bayesian meta-analysis, revised in 2025, still finds strong positive average effects on consumption, income, food security, assets, and psychological wellbeing across unconditional-cash studies. ([GiveWell GiveDirectly report](https://www.givewell.org/international/technical/programs/givedirectly-cash-for-poverty-relief-program-november-2024-version), [Crosta et al. 2024](https://www.nber.org/papers/w32779))
7. Graduation / ultra-poor "big push" programs provide evidence that one-off asset-heavy interventions can sometimes sustain gains for 10+ years, but they are costlier and more implementation-sensitive than plain cash, so they are best treated here as supportive upside evidence rather than the main marginal-donation anchor. ([J-PAL Graduation](https://www.povertyactionlab.org/evidence-effect/graduation-approach?lang=en), [Banerjee, Duflo, and Sharma 2021](https://www.aeaweb.org/articles?id=10.1257/aeri.20200667&page=549), [Balboni et al. 2022](https://academic.oup.com/qje/article/137/2/785/6455333))
8. The World Bank updated the international extreme-poverty line from \$2.15/day in 2017 PPP to \$3.00/day in 2021 PPP in June 2025. GiveWell's benchmark still uses the older PPP vintage for continuity, while GiveDirectly's public materials now describe targeting around \$3/day. ([World Bank 2025](https://blogs.worldbank.org/en/opendata/the-world-bank-s-new-global-poverty-lines-in-2021-prices), [GiveWell cost-effectiveness analyses](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models), [GiveDirectly](https://www.givedirectly.org/programs/))

## Details

### Cost per QALY

We anchor the category to GiveWell's latest cash-transfer benchmark rather than to an ad hoc mix of programs. The chain is short: GiveWell's November 2025 benchmark is about **0.003 units of value per dollar** (Assumption 2), its 2024 reevaluation puts GiveDirectly's flagship program at roughly **3-4x** that benchmark (midpoint **3.5x**), and Assumption 4 converts GiveWell units into QALYs at $\frac{60}{134} \approx 0.45$. Multiplying through gives about **0.0047 QALYs per dollar**, or **\$210/QALY**.

:::details{title="Worked derivation, and the pessimistic and optimistic cases"}
Starting from the benchmark and the 3.5x midpoint:

$$
\text{Units per } \$1 \approx 0.003 \times 3.5 = 0.0105
$$

Converting units into QALYs via Assumption 4:

$$
\text{QALYs per } \$1 \approx 0.0105 \times \frac{60}{134} \approx 0.0047
$$

$$
\text{Cost per QALY} \approx \frac{1}{0.0047} \approx \$210
$$

As an audit, pushing both levers to the same edge at once brackets roughly **\$120–\$560/QALY**: a pessimistic case using roughly **1.5x benchmark** and **0.4 QALYs per unit** gives about **\$560/QALY**, and an optimistic case using roughly **5x benchmark** and **0.55 QALYs per unit** gives about **\$120/QALY**. The two levers are fairly independent, so on their own this both-edges span is a bit wider than an 80% interval. We publish about this wide anyway — and round the upper bound out to **\$600** — because the swept bands do not capture all the uncertainty: the 0.4–0.55 conversion band is narrow relative to genuine disagreement about how to value a consumption-doubling year, and the whole estimate rests on the structural choice to anchor to GiveWell's GiveDirectly evaluation and trust its spillover and persistence modeling. That residual worldview and model uncertainty lives outside the two parameters and roughly offsets the narrowing their independence would otherwise allow.
:::

The plausible range is **\$120–\$600/QALY**. The two biggest levers are how many multiples of GiveWell's benchmark the best marginal poverty program really achieves, and how much QALY-equivalent value we assign to one GiveWell consumption unit. The second lever is not purely empirical: the $\frac{60}{134} \approx 0.45$ conversion inherits GiveWell's moral judgment about how a consumption-doubling year compares to averting a young child's death, so a reader who weights consumption differently would get a different headline estimate. The range stays wide because that worldview-laden conversion, together with the structural choice of anchor, carries more uncertainty than the parameter sweep alone shows.

:::details{title="Why anchor to GiveWell cash transfers, not graduation or deworming"}
**Best charity-specific data.** GiveWell's 2024 reevaluation already incorporates transfer size, targeting, overhead, recipient consumption gains, spillovers to non-recipients, mortality effects, morbidity effects, and negative adjustments such as fraud or psychological spillovers, so it is much closer to an all-things-considered estimate than a back-of-the-envelope cash calculation.

**Recent mortality evidence handled, not over-weighted.** [Walker et al. 2025](https://www.nber.org/papers/w34152) is a genuine positive update: in a very large Kenya experiment, one-time \$1,000 transfers led to **48% fewer infant deaths** and **45% fewer under-five deaths**. But those gains are highly timing-sensitive, concentrated near birth, and partly distinct from the consumption channel, so this nudges cash transfers upward without making poverty giving primarily a mortality intervention.

**Graduation as upside, not anchor.** [Banerjee, Duflo, and Sharma 2021](https://www.aeaweb.org/articles?id=10.1257/aeri.20200667&page=549) find positive effects on consumption, food security, income, and health still present **10 years** later in India, and [Balboni et al. 2022](https://academic.oup.com/qje/article/137/2/785/6455333) give unusually strong evidence for genuine poverty traps in Bangladesh. But graduation programs are more complex, harder to scale, and more implementation-sensitive than plain cash, so GiveDirectly-style transfers are the safer central anchor while graduation supports the view that durable gains are possible.

**Deworming excluded.** Deworming may have long-run income effects, but its main identity is a health intervention, and counting it here would blur the line with Global Health.
:::

### Start time

GiveDirectly says its poverty-relief transfers are typically sent about a month after enrollment, so some benefits begin very quickly. We still use **1 year** because this category is not only "cash arrives in someone's phone account," but the broader effect on living standards from donation through targeting, enrollment, delivery, and realized household spending. Graduation-style programs also take longer to ramp up, so one year is a reasonable portfolio average.

### Duration

A **10-year** duration fits the current evidence better than a **15-year** one for a category whose central anchor is GiveDirectly-style cash transfers. GiveWell's current model assumes roughly **10 years** of fading consumption gains, with a large initial spike and then gradual decay (Assumption 6).

The graduation literature is one reason not to go much shorter than 10 years, because some "big push" interventions really do seem to create durable changes in assets, occupation, and income. But because this site's model spreads benefits evenly across the duration window, and because cash-transfer benefits are front-loaded rather than flat, **10 years** is a better approximation than **15 years** of the actual timing of benefits.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- Using a literal midpoint of 3.5x together with the 60/134 conversion yields about \$210/QALY.
- The structural approach here is deliberate: cash transfers are the explicit central anchor because they have the cleanest per-dollar cost-effectiveness data, graduation is treated as an upside cross-check because it is costlier and more implementation-sensitive, and deworming is excluded because it belongs in Global Health.
- If future editors want to move this estimate a lot, the most important levers are: (1) GiveWell's benchmark-relative estimate for the best marginal poverty programs, and (2) the conversion from GiveWell consumption units into QALYs.
- Keep an eye on future GiveWell updates prompted by the 2025-2026 mortality paper and by GiveDirectly's new maternal-health / district-scale pilots. Those could move the estimate meaningfully, but probably not by an order of magnitude unless the marginal program design changes substantially.
