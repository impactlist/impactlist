---
id: alliance-to-feed-the-earth-in-disasters
name: 'Alliance to Feed the Earth in Disasters'
categories:
  - id: global-catastrophe-resilience
    fraction: 1
    effects:
      - effectId: standard
        overrides:
          startTime: 1
          windowLength: 50
          costPerQALY: 18.8
      - effectId: population
        overrides:
          startTime: 51
          windowLength: 1_000_000_000_000
          costPerMicroprobability: 7_800_000
          populationFractionAffected: 1.0
          qalyImprovementPerYear: 0.80
---

# Justification of cost per life

We model two independent benefits from donations to the Alliance to Feed the Earth in Disasters (ALLFED), which the calculator combines:

1. **standard:** reducing deaths and other harms from severe food and industrial disruptions over the next 50 years, at an estimated **\$18.8 per QALY**.
2. **population:** slightly reducing the probability that a catastrophe causes permanent global collapse or another irreversible loss of humanity's future, at an estimated **\$7.8 million per microprobability**.

Both estimates are highly uncertain. ALLFED's effects depend on whether a catastrophe occurs, whether its work changes policy or operational preparedness, whether those changes remain useful until they are needed, and whether they work under extreme conditions.

## What kinds of work are we modeling?

ALLFED researches and promotes ways to keep people fed if conventional agriculture or industry is severely disrupted—for example after nuclear winter, a supervolcanic eruption, an extreme pandemic, or a prolonged loss of electricity. Its work includes research, experiments, government and industry engagement, response planning, and communications systems. See ALLFED's [2025-2026 strategy](https://allfed.info/images/pdfs/ALLFED%202025%20-%202026%20Organizational%20Strategy.pdf) and [2024 annual report](https://allfed.info/images/Annual-Reports/ALLFED-Annual-Report-2024.pdf).

We assign ALLFED entirely to [Global Catastrophe Resilience](/cause/global-catastrophe-resilience). Its work is preparedness and recovery across several hazards, rather than acute disaster response or prevention of one specific risk.

---

## Effect 1: standard

This effect captures expected QALYs gained because ALLFED's work makes severe food and industrial disruptions less deadly over the first 50 years after a donation.

### Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$18.8 (\$0.60-\$1,250)
- **Equivalent cost per 80-QALY life:** \$1,504 (\$48-\$100,000)
- **Start time:** 1 year
- **Duration:** 50 years

_If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values._

### Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. **CEARCH's policy-campaign model is a reasonable anchor for ALLFED's standard effect.** Its [2024 assessment of resilience to nuclear and volcanic winter](https://forum.effectivealtruism.org/posts/tyo6v4ibrksbdArMj/resilience-to-nuclear-and-volcanic-winter) estimated that a targeted five-year campaign costing \$1 million would avert about **6,000 deaths in expectation**. Its fuller welfare estimate was approximately **24,000 DALYs per \$100,000**, or **\$4.17 per DALY**. We treat one averted DALY as approximately one gained QALY. {{CHALLENGE_ASSUMPTION:1:Effect 1: standard}}
2. **The campaign would produce about one-third as much impact as CEARCH's headline estimate.** A detailed critique estimated 12.4% as much impact after changing several assumptions; CEARCH's author agreed that expert forecasts of advocacy success were probably optimistic while defending other parts of the model. Nuclear-risk uncertainty cuts both ways: CEARCH's roughly 0.10% annual probability of a 100-plus-detonation conflict is lower than some expert estimates but higher than relevant superforecaster estimates over a similar period. The forecast endpoints differ, and soot production and famine severity remain disputed. CEARCH's modeled hazard mix also moved from over 95% nuclear in its [2023 pilot analysis](https://forum.effectivealtruism.org/posts/JxakgiGiJ3egodfb3/intermediate-report-on-abrupt-sunlight-reduction-scenarios) to volcano-dominated in 2024. The studies cover different scopes and interventions, but the shift shows the anchor's sensitivity to hazard modeling. ([See the Nuclear Risk discussion](/cause/nuclear)) This assumption raises the estimated cost per QALY by 3x, roughly midway on a logarithmic scale between CEARCH's headline result and the critique. {{CHALLENGE_ASSUMPTION:2:Effect 1: standard}}
3. **A marginal unrestricted donation to ALLFED produces about two-thirds as many QALYs per dollar as the selected campaign.** ALLFED also funds research, experiments, operational planning, and capacity, although those activities can make later advocacy and deployment possible. As a cross-check, CEARCH's 2023 pilot analysis estimated about **\$10/DALY** for a \$23 million resilient-food pilot, but its uncertainty model gave the pilot only a 47% chance of outperforming a GiveWell top charity. This assumption raises the estimated cost per QALY by a further 1.5x; it is one net organization-level judgment, not a stack of separate penalties. {{CHALLENGE_ASSUMPTION:3:Effect 1: standard}}
4. **ALLFED's peer-reviewed estimates support the intervention's feasibility and upside, but are not independent numerical anchors.** A [2016 alternate-food model](https://link.springer.com/article/10.1007/s13753-016-0097-2) and later papers on [resilient foods](https://ora.ox.ac.uk/objects/uuid%3Abbb5d910-a76d-46dc-82f3-86f619aa1330) and [loss of electricity or industry](https://ora.ox.ac.uk/objects/uuid%3A77905318-5c59-4236-9a05-16716be745af) find potentially much larger returns. The papers share authors, methods, assumptions, and affiliations with ALLFED, so we do not average them with CEARCH's estimate. {{CHALLENGE_ASSUMPTION:4:Effect 1: standard}}
5. **A donation begins producing benefits after 1 year, and those benefits last 50 years.** Research and advocacy can influence decisions fairly quickly, and useful knowledge and institutions can persist for decades, although they require updating as technology, governments, and food systems change. {{CHALLENGE_ASSUMPTION:5:Effect 1: standard}}

### Details

#### Cost per QALY

CEARCH's fuller model estimated approximately **24,000 DALYs per \$100,000**, or **\$4.17 per DALY**. Applying the campaign-evidence adjustment and then the whole-organization adjustment gives:

$$
\$4.17 \times 3 \times 1.5
= \$18.765 \text{ per QALY}
\approx \$18.8 \text{ per QALY}.
$$

CEARCH's separate mortality headline was about **6,000 expected deaths averted per \$1 million**, or **\$167 per expected death** before adjustments. The DALY and mortality results together imply about **40 DALYs per expected death**. Applying the same 4.5x combined adjustment gives about **\$751 per CEARCH-defined expected death**.

At the site's 80-QALY years-per-life default, \$18.8/QALY is displayed as **\$1,504 per standardized life**. That is a comparison unit, not an assumption that each catastrophe death averts 80 lost healthy years. For estimating ALLFED, we use CEARCH's DALYs directly rather than replacing them with the site's 80-QALY display convention.

The 3x factor adjusts the evidence for the selected campaign itself. The 1.5x factor translates that adjusted estimate to a marginal unrestricted donation to ALLFED. Long-term population benefits are excluded from this calculation because they are modeled separately in Effect 2.

#### Translating from the campaign to ALLFED

Several considerations make unrestricted ALLFED funding less effective than CEARCH's modeled campaign. CEARCH selected targeted policy advocacy as the most promising marginal intervention, while ALLFED also funds research, experiments, planning, communications, and organizational capacity. ALLFED's 2024 US tax filing reports about [\$1.02 million in annual expenses and \$1.76 million in net assets](https://projects.propublica.org/nonprofits/organizations/831717756), so older assumptions about the return to the first small amounts of spending do not describe its current margin. ALLFED reports substantial research and policy activity, but not directly attributable deaths averted or enough completed policy adoption to estimate an observed success rate.

Other considerations push in the opposite direction. Research and experiments can make later advocacy credible and identify workable responses. ALLFED also addresses extreme pandemics and losses of electricity or industry, while CEARCH modeled only nuclear and volcanic winter. Those additional hazards may diversify the value of shared food-resilience capacity.

We combine these considerations into one **1.5x net adjustment**. The factor says that the disadvantages of moving from an unusually promising campaign to organization-level funding modestly outweigh the broader portfolio's supporting and cross-hazard benefits.

CEARCH's earlier pilot analysis provides a useful cross-check. Its **\$10/DALY** point estimate lies close to the policy estimate after our 3x evidence adjustment (**\$12.51/QALY**) and below the **\$18.8/QALY** whole-organization estimate. But CEARCH's probabilistic model found a 53% chance that the pilot was less cost-effective than a GiveWell top charity; the \$10/DALY headline was driven by a minority of very favorable outcomes. We therefore treat it as evidence that pilots can be valuable, not as a precise second estimate to average with the policy result.

#### Plausible range

The plausible range is **\$0.60-\$1,250/QALY**, equivalent to approximately **\$48-\$100,000 per 80-QALY life**.

The low end is plausible if advocacy succeeds near CEARCH's estimate, ALLFED's research improves those campaigns, and resilient-food plans work during a severe catastrophe. The high end is plausible if policy change is much harder than experts expect, plans decay or go unused, market adaptation would have solved much of the problem anyway, or marginal funding mainly maintains work that would otherwise happen. Outside the range, there is some chance of exceptionally large impact and some chance that the marginal standard effect is close to zero.

---

## Effect 2: population

This effect captures the possibility that ALLFED slightly reduces the probability that an extreme food or industrial shock causes permanent civilizational collapse, irreversible technological or political lock-in, or human extinction.

### Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per microprobability (reduction):** \$7.8 million (\$100,000-\$1 billion)
- **Population fraction affected:** 1.0
- **QALY improvement per affected person per year:** 0.80
- **Start time:** 51 years
- **Duration:** Defined by the global time-limit parameter

_If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values._

### Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. **Buhl's resilient-food pilot model is a reasonable anchor for ALLFED's population effect.** A [2023 Rethink Priorities speedrun by Marie Buhl](https://forum.effectivealtruism.org/posts/n52z7r8iH5pvWN2DE/speedrun-demonstrate-the-ability-to-rapidly-scale-food) estimated that the pilots would cost about **\$260 million per 0.01 percentage-point reduction in existential risk**. This is **\$2.6 million per microprobability**. Its rough reported 70% range spanned approximately \$22,000-\$27 million per microprobability. {{CHALLENGE_ASSUMPTION:1:Effect 2: population}}
2. **A marginal donation to ALLFED produces about one-third as much risk reduction per dollar as Buhl's modeled pilot program.** Buhl spent about 10 hours on the initial analysis and another 5-10 hours revising it after feedback from ALLFED. The model covered a hypothetical \$10-\$100 million project rather than a current marginal donation. It also omitted possible benefits from hazards other than nuclear winter and from ALLFED's research and advocacy. This assumption raises the estimated cost per microprobability by 3x as one all-things-considered adjustment. {{CHALLENGE_ASSUMPTION:2:Effect 2: population}}
3. **ALLFED's peer-reviewed models support the long-term causal pathway and favorable outcomes, but are not independent estimates of its present margin.** They rely on very uncertain inputs, a small survey with affiliated respondents, assumptions from when ALLFED and adjacent work had received much less funding, and an old \$3 billion total-spending comparison for AI safety. {{CHALLENGE_ASSUMPTION:3:Effect 2: population}}
4. **Preventing permanent collapse benefits the entire population by an average of 0.80 QALYs per person-year.** The 100% population share reflects the global nature of extinction or permanent collapse. The 0.80 value represents a mixture of extinction and permanent non-extinction catastrophes, rather than assuming that every failure of resilience literally causes extinction. {{CHALLENGE_ASSUMPTION:4:Effect 2: population}}
5. **The population effect starts in year 51 and continues to the global time limit.** This accounting boundary assigns years 1-50 to Effect 1 and counts only persistent consequences after that point in Effect 2. It is not a forecast that a catastrophe will occur in year 51. {{CHALLENGE_ASSUMPTION:5:Effect 2: population}}

### Details

#### Cost per microprobability

The central calculation is:

$$
\$2.6 \text{ million}
\times 3
= \$7.8 \text{ million per microprobability}.
$$

Buhl's pathway runs from resilient-food pilots, to credible government plans, to less famine and conflict during a food shock, and ultimately to a lower probability of permanent collapse. The estimate is the best independent quantitative anchor we found for ALLFED's long-term pathway. It is not a direct measurement: the author describes the analysis as preliminary, reports that the model was unstable, and notes limited relevant scientific expertise.

This is distinct from the CEARCH estimate used for Effect 1. CEARCH evaluates **policy advocacy** and reports expected deaths and DALYs; Buhl evaluates a proposed **\$10-\$100 million pilot program** and reports existential-risk reduction. We do not treat either estimate as direct evidence for the other's intervention or outcome.

The net 3x adjustment reflects several considerations at once. The evaluated project was a selected \$10-\$100 million series of demonstrations, not ALLFED's current marginal dollar; the path from a pilot to permanent-risk reduction is long; and ALLFED now operates at a larger funding scale than early evaluations assumed. In the other direction, shared resilient-food capacity can serve nuclear, volcanic, pandemic, and infrastructure-loss scenarios, and ALLFED's research and advocacy could help make pilots and government adoption possible.

#### Supporting evidence

The [peer-reviewed resilient-food analysis](https://allfed.info/images/pdfs/Long_term_cost_effectiveness_of_resilien.pdf) estimated a high probability that spending up to \$100 million on this work would outperform the authors' AI-safety comparator. The [loss-of-electricity-or-industry analysis](https://allfed.info/images/pdfs/Long-term%20cost-effectiveness%20of%20interventions%20for%20loss%20of%20electricity%20or%20industry.pdf) found similarly large potential returns for research, planning, and development.

These models are useful for identifying pathways: preventing conflict, preserving knowledge and institutions, shortening recovery, and reducing vulnerability to later risks. Their numerical conclusions receive less weight. The estimates use inputs with very wide uncertainty, largely share an author team, and were produced by researchers affiliated with ALLFED. Independent Unjournal reviews raised potentially conclusion-changing concerns about the comparator, deployment costs, market adaptation, parameter sourcing, and the affiliated survey respondents ([review 1](https://unjournal.pubpub.org/pub/eval1allfed/release/7), [review 2](https://unjournal.pubpub.org/pub/eval2allfed/release/4)). The resilient-food paper's survey went to 32 people, received eight responses, and included two paper authors among the respondents. Both papers also compare with assumptions about AI risk and AI-safety spending that have changed substantially since 2021.

[Nuño Sempere's 2021 shallow evaluation](https://forum.effectivealtruism.org/s/AbrRsXM2PrCrPShuZ/p/xmmqDdGqNZq5RELer) is mixed outside evidence. After replacing ALLFED's inputs with his own, he put the probability that marginal alternate-food funding was more cost-effective than AI-risk mitigation at about **50%**, rather than ALLFED's 95%. He nevertheless concluded that the case for an organization in the area was relatively solid; his remaining concern was ALLFED's execution. The review was explicitly shallow, non-expert, and produced no common-unit cost-effectiveness estimate, so it supports the cause area's plausibility without providing another numerical anchor.

#### Plausible range

The plausible range is **\$100,000-\$1 billion per microprobability**. It is wider than Buhl's reported interval because the estimate must transfer from a hypothetical pilot series to ALLFED's present marginal unrestricted dollar and because the structural uncertainty is not contained in the model's parameters.

The favorable end is plausible if several hazards share the same preparedness investments, plans are adopted and maintained, and avoiding famine and conflict materially raises the probability of recovery. The unfavorable end is plausible if adoption is weak, governments or markets would have developed similar responses anyway, the intervention fails under real catastrophe conditions, or survival has only a small effect on permanent recovery. There is also some probability outside the range that a marginal donation has essentially no population effect.

#### Population fraction and QALY improvement

The population fraction is 1.0 because permanent global collapse or extinction is global by construction. The **0.80 QALY** improvement per person-year is slightly below a full healthy year, allowing for a mixture of extinction and irreversible but non-extinction outcomes.

#### Start time and duration

Separating the two effects at year 51 prevents double counting. Effect 1 captures the expected health and survival benefit during years 1-50. Effect 2 counts only later person-years in the small set of scenarios where ALLFED changes whether civilization permanently recovers.

The very large window-length parameter is only a ceiling so the calculator can accommodate long horizons. In practice, the user's global time-limit setting determines the end of the effect.

---

## Key uncertainties

The largest uncertainties are:

1. **Policy and operational additionality.** Research and plans matter only if they change what governments, companies, or communities actually do.
2. **Persistence.** Food-production knowledge, plans, and institutions can decay as personnel, technology, and supply chains change.
3. **Deployment effectiveness.** Alternate-food systems that look feasible before a catastrophe may fail under wartime, infrastructure, financing, or coordination constraints.
4. **Portfolio and funding margin.** The best outside estimates concern selected projects, while an unrestricted donation supports ALLFED's full portfolio at its current scale.
5. **The link from survival to permanent recovery.** Preventing near-term deaths is not the same as averting permanent collapse; Effect 2 depends on a much longer causal chain.

The most decision-relevant new evidence would be independently documented policy changes, operational adoption, successful large-scale demonstrations, and funding-sensitive milestones causally connected to ALLFED's work.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was revised on August 4th 2026 by GPT-5, with prompts from Impact List staff._

- ALLFED is fully assigned to Global Catastrophe Resilience. Both recipient effects replace the category defaults.
- The 1.5x organization adjustment in the standard estimate deliberately excludes long-term resilience benefits because those are modeled separately in the population effect.
- The year-51 population-effect start is a non-overlap convention, not an empirical claim about catastrophe timing.
- At the default 100-year horizon and other default global parameters, the two effects are of similar magnitude. Extending the time horizon increases the relative importance of the population effect.
