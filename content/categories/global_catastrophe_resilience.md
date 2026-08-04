---
id: global-catastrophe-resilience
name: 'Global Catastrophe Resilience'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 50
    costPerQALY: 37.6
  - effectId: population
    startTime: 51
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 15_600_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: 0.80
---

# Justification of cost per life

We model Global Catastrophe Resilience as having two independent effects, which we calculate separately and then combine into a single overall cost per life:

1. **standard:** reducing deaths and other harms during severe catastrophes over the next 50 years.
2. **population:** slightly reducing the probability that a catastrophe causes permanent global collapse or another irreversible loss of humanity's future.

This category is unusually uncertain. Neither effect has been measured directly, and the best quantitative outside evidence concerns resilient food rather than the full range of catastrophe-resilience work.

## What kinds of projects are we modeling?

This category covers work whose main purpose is to make civilization better able to **withstand, mitigate the consequences of, or recover from a global catastrophe across multiple hazards**. Examples include resilient food systems, continuity of critical infrastructure and government, cross-hazard contingency planning, and recovery capacity.

It does not include ordinary emergency relief, which belongs in [Disaster Relief](/cause/disaster-relief), or work primarily aimed at preventing one particular hazard, such as [AI Existential Risk](/cause/ai-risk), [Nuclear Risk](/cause/nuclear), or [Pandemics](/cause/pandemics). Broad research that compares global risks without building resilience belongs in [Global Priorities](/cause/global-priorities).

---

## Effect 1: standard

This effect captures expected QALYs gained because preparedness and recovery measures make global catastrophes less deadly and disruptive within the first 50 years after a donation.

### Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$37.6 (\$0.60-\$5,000)
- **Start time:** 1 year
- **Duration:** 50 years

_If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values._

### Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. **CEARCH's resilient-food policy campaign is a reasonable anchor for this category's standard effect.** Its [2024 assessment of resilience to nuclear and volcanic winter](https://forum.effectivealtruism.org/posts/tyo6v4ibrksbdArMj/resilience-to-nuclear-and-volcanic-winter) estimated that a targeted five-year campaign costing \$1 million would avert about **6,000 deaths in expectation**. Its fuller welfare estimate was approximately **24,000 DALYs per \$100,000**, or **\$4.17 per DALY**. We treat one averted DALY as approximately one gained QALY. {{CHALLENGE_ASSUMPTION:1:Effect 1: standard}}
2. **The campaign would produce about one-third as much impact as CEARCH's headline estimate.** A detailed critique estimated 12.4% as much impact after changing several assumptions; CEARCH's author agreed that expert forecasts of advocacy success were probably optimistic while defending other parts of the model. Nuclear-risk uncertainty cuts both ways: CEARCH's roughly 0.10% annual probability of a 100-plus-detonation conflict is lower than some expert estimates but higher than relevant superforecaster estimates over a similar period. The forecast endpoints differ, and soot production and famine severity remain disputed. CEARCH's modeled hazard mix also moved from over 95% nuclear in its [2023 pilot analysis](https://forum.effectivealtruism.org/posts/JxakgiGiJ3egodfb3/intermediate-report-on-abrupt-sunlight-reduction-scenarios) to volcano-dominated in 2024. The studies cover different scopes and interventions, but the shift shows the anchor's sensitivity to hazard modeling. ([See the Nuclear Risk discussion](/cause/nuclear)) This assumption raises the estimated cost per QALY by 3x, roughly midway on a logarithmic scale between CEARCH's headline result and the critique. {{CHALLENGE_ASSUMPTION:2:Effect 1: standard}}
3. **A marginal unrestricted donation to a resilient-food organization produces about two-thirds as many QALYs per dollar as the selected campaign.** A whole organization funds research, experiments, operational planning, and capacity as well as the campaign, although those activities can make later advocacy and deployment possible. As a cross-check, CEARCH's 2023 pilot analysis estimated about **\$10/DALY** for a \$23 million resilient-food pilot, but its uncertainty model gave the pilot only a 47% chance of outperforming a GiveWell top charity. This assumption raises the estimated cost per QALY by a further 1.5x and treats the right-tail-driven pilot estimate as supporting evidence rather than a second anchor. {{CHALLENGE_ASSUMPTION:3:Effect 1: standard}}
4. **Strong work across this broader category produces half as many QALYs per dollar as the resilient-food organization-level anchor.** Resilient food is the best-quantified intervention in this category and may be unusually promising. Other resilience work has less direct evidence and a less certain path from intermediate outputs to QALYs, although some interventions could be better. This assumption raises the estimated cost per QALY by 2x. {{CHALLENGE_ASSUMPTION:4:Effect 1: standard}}
5. **A donation begins producing benefits after 1 year, and those benefits last 50 years.** Plans and institutions can influence decisions quickly and remain useful for decades, but they require updating as technology, governments, and supply chains change. {{CHALLENGE_ASSUMPTION:5:Effect 1: standard}}

### Details

#### Cost per QALY

The central estimate applies the campaign-evidence, organization-transfer, and category-transfer adjustments in sequence:

$$
\$4.17 \times 3 \times 1.5 \times 2
= \$37.53 \text{ per QALY}
\approx \$37.6 \text{ per QALY}.
$$

The first two adjustments translate a selected policy campaign into a marginal donation to a resilient-food organization. The final 2x adjustment translates that anchor to strong work across this broader category. It should not be interpreted as evidence that every project labeled "resilience" is similarly effective.

CEARCH's two headline units describe the same modeled campaign differently. The mortality result is about **\$167 per expected death** before adjustments, while the DALY result implies about **40 DALYs per expected death**. The calculator uses the DALY result so that mortality and morbidity enter through the common QALY unit; any "cost per life" displayed using the site's 80-QALY standard is a comparison unit, not an assumption that each catastrophe death averts 80 lost healthy years.

The plausible range is **\$0.60-\$5,000/QALY**. It is wider than the recipient-level anchor because the category adds an uncertain transfer from resilient food to cross-hazard planning, infrastructure continuity, and recovery. The low end allows for non-food resilience work that outperforms the food anchor; the high end allows for projects whose intermediate outputs rarely change disaster outcomes. Most interventions in this category have not received an independent quantitative evaluation.

---

## Effect 2: population

This effect captures the possibility that better resilience slightly reduces the probability that a global catastrophe causes permanent civilizational collapse, irreversible technological or political lock-in, or human extinction.

### Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per microprobability (reduction):** \$15.6 million (\$100,000-\$5 billion)
- **Population fraction affected:** 1.0
- **QALY improvement per affected person per year:** 0.80
- **Start time:** 51 years
- **Duration:** Defined by the global time-limit parameter

_If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values._

### Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. **Buhl's resilient-food pilot model is a reasonable anchor for this category's population effect.** A [2023 Rethink Priorities speedrun by Marie Buhl](https://forum.effectivealtruism.org/posts/n52z7r8iH5pvWN2DE/speedrun-demonstrate-the-ability-to-rapidly-scale-food) estimated that the pilots would cost about **\$260 million per 0.01 percentage-point reduction in existential risk**. This is **\$2.6 million per microprobability**. Its rough reported 70% range spanned approximately \$22,000-\$27 million per microprobability. {{CHALLENGE_ASSUMPTION:1:Effect 2: population}}
2. **A marginal donation to a resilient-food organization produces about one-third as much risk reduction per dollar as Buhl's modeled pilot program.** Buhl spent about 10 hours on the initial analysis and another 5-10 hours revising it after feedback from ALLFED. The model covered a hypothetical \$10-\$100 million project rather than a current marginal donation. Additional hazards, research, and advocacy provide some omitted upside. This assumption raises the estimated cost per microprobability by 3x as one all-things-considered adjustment. {{CHALLENGE_ASSUMPTION:2:Effect 2: population}}
3. **Strong work across this broader category produces half as much risk reduction per dollar as the resilient-food organization-level anchor.** Resilient food is the only intervention in this category with a quantitative independent estimate of this pathway. Cross-hazard planning, infrastructure continuity, and recovery work have less direct evidence, although some interventions could be better. This assumption raises the estimated cost per microprobability by 2x. {{CHALLENGE_ASSUMPTION:3:Effect 2: population}}
4. **Preventing permanent collapse benefits the entire population by an average of 0.80 QALYs per person-year.** The 100% population share reflects the global nature of extinction or permanent collapse. The 0.80 value represents a mixture of extinction and permanent non-extinction catastrophes, rather than assuming that every failure of resilience literally causes extinction. {{CHALLENGE_ASSUMPTION:4:Effect 2: population}}
5. **The population effect starts in year 51 and continues to the global time limit.** This accounting boundary assigns years 1-50 to the standard effect and counts only persistent consequences after that point in the population effect. It is not a forecast that the catastrophe will occur in year 51. {{CHALLENGE_ASSUMPTION:5:Effect 2: population}}

### Details

#### Cost per microprobability

The central calculation is:

$$
\$2.6 \text{ million}
\times 3
\times 2
= \$15.6 \text{ million per microprobability}.
$$

Buhl's pathway runs from pilots, to credible government plans, to less famine and conflict during a food shock, and ultimately to a lower probability of permanent collapse. The analysis is useful because it makes that pathway explicit and was produced outside the evaluated organization. It is not a precise estimate: the author describes it as preliminary, reports an unstable model, and notes limited relevant scientific expertise.

Peer-reviewed models produced by researchers affiliated with the Alliance to Feed the Earth in Disasters find much larger long-term returns from [resilient-food work](https://ora.ox.ac.uk/objects/uuid%3Abbb5d910-a76d-46dc-82f3-86f619aa1330) and [preparation for loss of electricity or industry](https://ora.ox.ac.uk/objects/uuid%3A77905318-5c59-4236-9a05-16716be745af). Independent Unjournal reviews raised potentially conclusion-changing concerns about the comparator, deployment costs, market adaptation, parameter sourcing, and the affiliated survey respondents ([review 1](https://unjournal.pubpub.org/pub/eval1allfed/release/7), [review 2](https://unjournal.pubpub.org/pub/eval2allfed/release/4)). The papers support taking the pathway seriously, but their shared authorship, old spending assumptions, and very uncertain inputs make them correlated supporting evidence rather than an independent numerical anchor.

The plausible range is **\$100,000-\$5 billion per microprobability**. It is wider than ALLFED's range because the category adds an uncertain transfer from resilient-food pilots to other resilience interventions. The favorable end allows for cross-hazard work that is more durable or broadly useful than the food anchor. The unfavorable end allows for little additional adoption, substantial crowd-out, weak persistence, or almost no connection between recovery capacity and permanent global outcomes. There is also some probability outside the range that a marginal project has essentially no population effect.

#### Population fraction and QALY improvement

The population fraction is 1.0 because permanent global collapse or extinction is global by construction. The **0.80 QALY** improvement per person-year is slightly below a full healthy year: it allows for a mixture of extinction and irreversible but non-extinction outcomes.

#### Start time and duration

Separating the two effects at year 51 avoids crediting the same person-years twice. The standard effect counts lives and welfare within years 1-50. The population effect counts only the persistent loss after that period in the small set of scenarios where resilience changes whether civilization ultimately recovers.

The very large window-length parameter is only a ceiling so the calculator can accommodate long horizons. In practice, the user's global time-limit setting determines the end of the effect.

---

## Key uncertainties

The largest uncertainties are:

1. **Policy and operational additionality.** Research and plans matter only if they change what governments, companies, or communities actually do.
2. **Persistence.** Preparedness can decay as personnel, technology, and supply chains change.
3. **Deployment effectiveness.** A plan that looks feasible before a catastrophe may fail under wartime, infrastructure, or coordination constraints.
4. **The link from survival to permanent recovery.** Avoiding deaths is not the same as averting permanent collapse; the population effect depends on a much longer causal chain.
5. **Transfer beyond resilient food.** The category defaults are anchored on the best-studied intervention, while other resilience projects may be much better or worse.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on August 4th 2026 by GPT-5, with prompts from Impact List staff._

- The category is deliberately narrower than "global catastrophic risk." It is for cross-hazard consequence mitigation and recovery, not all research or prevention related to catastrophic risks.
- ALLFED is the only recipient assigned entirely to this category at launch. GCRI and CLTR have partial allocations for identifiable resilience work, but the default estimates remain heavily anchored on resilient food.
- The year-51 population-effect start is a non-overlap convention, not an empirical claim about catastrophe timing. Recipient overrides should preserve that boundary unless they also change or disable the standard effect.
- The 2x transfer adjustment is a calibrated central judgment about a broader and less-tested intervention class. The plausible ranges carry most of the uncertainty and should be revisited when an independent evaluation of non-food resilience work becomes available.
