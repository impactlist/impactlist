---
id: nuclear
name: 'Nuclear'
effects:
  - effectId: population
    startTime: 15
    windowLength: 30
    costPerMicroprobability: 2_400_000
    populationFractionAffected: 0.9
    qalyImprovementPerYear: 0.75
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

Unlike a typical cause area, donations to nuclear-risk charities are best modeled as slightly reducing the probability of a catastrophe rather than directly buying QALYs. We therefore estimate the cost of averting one **microprobability**: a one-in-a-million absolute reduction in the probability of a global catastrophic nuclear war.

## Description of effect

This effect captures welfare gains from reducing the probability of a **global catastrophic nuclear war**: a nuclear exchange severe enough to kill at least tens of millions directly and plausibly billions overall through nuclear-winter-driven famine, state failure, disease, and economic collapse. In practice, the main pathways are great-power crises or smaller nuclear conflicts that escalate far beyond the initial use of nuclear weapons.

We intentionally model a catastrophe that is worse than a limited regional exchange but narrower than literal human extinction. If you think nuclear war also carries substantial extinction or centuries-long civilizational-collapse risk, the true cost per microprobability would be lower than the estimate on this page.

## Point Estimates

- **Cost per microprobability:** \$2.4 million (\$0.5–\$12 million)
- **Population fraction affected:** 0.9 (0.7–1.0)
- **QALY improvement per affected person per year:** 0.75 (0.5–0.9)
- **Start time:** 15 years (~2041)
- **Duration:** 30 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. A large US-Russia nuclear war could kill on the order of **5 billion** people, mostly through famine rather than blast effects, and soot injections above **5 Tg** would already produce mass food shortages in almost all countries. ([Xia et al. 2022](https://www.nature.com/articles/s43016-022-00573-0))
2. Direct blast and radiation deaths from a US-Russia exchange are likely on the order of **tens of millions**; Rethink Priorities' central estimate is about **51 million** direct deaths. ([Rodriguez 2019](https://rethinkpriorities.org/research-area/how-many-people-would-be-killed-as-a-direct-result-of-a-us-russia-nuclear-exchange/))
3. Current nuclear risk is elevated. Open Nuclear Network's 2024 survey found median forecasts of **5%** from experts and **1%** from superforecasters for a >10 million-death nuclear catastrophe by **2045**, while SIPRI reports that all nine nuclear-armed states continued modernizing their arsenals in 2024 and that the expiry of **New START on February 5, 2026** raises the prospect of an unregulated arms buildup. ([ONN 2024](https://opennuclear.org/en/open-nuclear-network/publication/can-humanity-achieve-century-nuclear-peace), [SIPRI 2025 world nuclear forces](https://www.sipri.org/yearbook/2025/06), [SIPRI 2025 arms control](https://www.sipri.org/yearbook/2025/08))
4. Philanthropic funding specifically focused on nuclear risk reduction is only about **\$30 million per year** after the MacArthur Foundation's exit. ([Founders Pledge 2023](https://www.founderspledge.com/research/global-catastrophic-nuclear-risk-a-guide-for-philanthropists))
5. A mature but still tiny nuclear-philanthropy field spending roughly **\$600 million over 20 years** plausibly reduces 20-year catastrophe risk by about **0.025 percentage points**, with a practical positive range around **0.005–0.12 percentage points**. ([See detailed justification](/assumption/effect-of-nuclear-risk-philanthropy))
6. World population at the relevant horizon is about **10.3 billion**. ([UN 2024](https://population.un.org/wpp/assets/Files/WPP2024_Summary-of-Results.pdf))
7. Average human life-years are worth roughly **0.9 QALYs**, so catastrophe deaths removing roughly **40 years** of otherwise expected life cost on the order of **36 QALYs each**. ([WHO](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy), [Our World in Data](https://ourworldindata.org/life-expectancy))
8. Severe survivors of a global catastrophic nuclear war lose roughly **7 QALYs** on average through some combination of shortened life expectancy from famine, disease, and infrastructure collapse, plus years of much lower quality of life during recovery.

## Details

### Cost per Microprobability

The cleanest way to model this cause area is:

$$
\text{Cost per microprobability} = \dfrac{\text{cumulative field spending}}{\text{microprobabilities averted}}
$$

Using the central assumptions:

- Cumulative spending: \$30M/year × 20 years = **\$600M**
- Risk reduction achieved: **0.025 percentage points** = 0.00025
- Microprobabilities averted: 0.00025 / 10^-6 = **250**

So:

$$
\text{Cost per microprobability} = \dfrac{\$600{,}000{,}000}{250} = \$2{,}400{,}000
$$

So the point estimate is **\$2.4 million per microprobability**.

The load-bearing input here is Assumption 5. The dedicated assumption page argues that this central estimate corresponds to roughly **\$600 million** of philanthropy buying only a **small share** of the total effect of the best tractable policy bundle discussed by ONN, and calibrates that claim against historical cases where small philanthropic organizations appear to have helped catalyze much larger governmental or institutional actions. The short version is that **0.025 percentage points over 20 years** is small enough to be plausible if philanthropy has real leverage, but not so small that the field's existence becomes irrelevant.

**Range**

- **Pessimistic:** \$600M buys only **0.005 percentage points** = 50 microprobabilities -> **\$12 million** per microprobability
- **Optimistic:** \$600M buys **0.12 percentage points** = 1,200 microprobabilities -> **\$500,000** per microprobability

So the practical sensitivity range is **\$500,000–\$12 million per microprobability**.

This should be read as a practical sensitivity range, not a full uncertainty interval. The true uncertainty is wider. If one thought that current philanthropy has almost no leverage over great-power nuclear risk, the estimate would get worse quickly. If one thought philanthropy can occasionally unlock extremely leveraged crisis-management or doctrine wins, the estimate could get much better.

One reason not to be more optimistic than this by default is that nuclear philanthropy is trying to influence outcomes that are highly path-dependent, politically constrained, and hard to measure. One reason not to be much more pessimistic is that the field is extremely neglected and some of the relevant levers really are high leverage. A single avoided escalation pathway can matter enormously.

### Population Fraction Affected

The point estimate (0.9) and range (0.7–1.0) reflect that a catastrophe of the kind modeled here would affect nearly everyone through:

1. **Direct casualties:** Tens of millions or more die from blast, burns, radiation, and immediate healthcare collapse.
2. **Global famine:** Xia et al. find that soot injections above 5 Tg cause mass food shortages in almost all countries, and their US-Russia scenario leads to more than 5 billion deaths.
3. **Economic and institutional collapse:** Modern trade, fertilizer supply, shipping, finance, energy systems, and state capacity would fail well beyond the countries that were directly attacked.

So even people far from the detonations would often still face severe shortages of calories, medicine, and state protection. We stop short of **1.0** only because some remote communities and a minority of countries might avoid the worst direct harms.

### QALY Improvement per Affected Person per Year

The point estimate (0.75) and range (0.5–0.9) are derived by distributing total QALY losses across the affected population and duration.

Using a world population of **10.3 billion** and an affected fraction of **0.9**, the model implies about **9.27 billion affected people**.

A simple stylized decomposition, rounded for clarity, is:

- **~5.0 billion deaths** × **36 QALYs** each = **180 billion QALYs**
- **~4.0 billion severe survivors** × **7 QALYs** each = **28 billion QALYs**
- **remaining affected people** are rounded away in this decomposition and do not materially change the total
- **Total:** about **208 billion QALYs**

Affected person-years over a 30-year window are:

$$
10.3 \text{B} \times 0.9 \times 30 \approx 278 \text{ billion affected person-years}
$$

So:

$$
\dfrac{208 \text{B QALYs}}{278 \text{B affected person-years}} \approx 0.75
$$

So the point estimate is **0.75 QALYs per affected person per year**.

The **7 QALYs per severe survivor** should be read as a rough combined loss from shorter life expectancy plus much worse quality of life during a prolonged recovery period. It is not meant to imply exactly seven years in one specific health state.

Deaths dominate this calculation. Even if the survivor-loss term were cut materially, the answer would remain in the same broad range because losing billions of lives is already an enormous QALY loss.

At the central estimate, averting one microprobability saves about:

$$
10.3 \text{B} \times 0.9 \times 0.75 \times 30 \times 10^{-6} \approx 209{,}000 \text{ QALYs}
$$

So the implied cost-effectiveness is about:

$$
\dfrac{\$2.4 \text{M}}{209{,}000} \approx \$11.5 / \text{QALY}
$$

This is extremely good by ordinary global-health standards, but that is a general feature of catastrophe-risk models when both the stakes and tractability are nontrivial.

### Start Time

The 15-year start time means the main modeled risk arrives around **2041**.

This is not a claim that nuclear catastrophe is literally most likely in 2041. It is a modeling compromise between two facts:

1. The most salient risk drivers are near- to medium-term: eroding arms control, major-power rivalry, modernization, AI-related command-and-control concerns, and live flashpoints.
2. Nuclear risk is not confined to the next few years; it is spread across decades.

ONN's focal horizon of **2045** for expert catastrophe forecasts is a useful anchor here, and a 15-year start time places the effect in roughly that range without claiming an implausibly immediate catastrophe.

### Duration

The 30-year duration is an equivalent-impact window that balances three things:

1. **Acute climatic and food-system disruption** lasts roughly a decade in the nuclear-winter literature.
2. **Deaths destroy decades of future life**, not just the first decade after the war.
3. **Survivor harms** such as displacement, trauma, disease, and institutional collapse plausibly persist well beyond the peak famine years.

So 30 years should not be read as a forecast that recovery takes exactly 30 years. It is an accounting device that spreads the catastrophe's total welfare losses over a period long enough to reflect both the acute shock and the life-years destroyed by premature death.

## What Kinds of Charities Are We Modeling?

These estimates assume marginal donations go to **high-leverage nuclear-risk-reduction organizations**, not to the average anti-war or peacebuilding organization.

Representative activities include:

- crisis communications, escalation management, and war-limitation work
- policy research and advocacy on great-power nuclear stability, doctrine, and arms control
- track-II dialogue and analytical work in major nuclear flashpoints
- nonproliferation and nuclear-materials-security work that plausibly reduces catastrophic-use risk
- forecasting, monitoring, and decision-support work that helps leaders avoid nuclear escalation under uncertainty

We are **not** modeling:

- generic pacifist advocacy with no plausible route to changing high-stakes nuclear decisions
- ordinary post-conflict humanitarian relief
- nuclear energy philanthropy
- broad foreign-policy work with only weak relevance to catastrophic nuclear risk

## Key Uncertainties

1. **How severe nuclear winter would really be in the relevant scenarios.** Xia et al. is the best current quantitative anchor, but uncertainty remains about soot generation, adaptation, trade responses, and food substitution.

2. **How much weight to put on expert vs. superforecaster risk estimates.** ONN's 5% versus 1% by 2045 is a meaningful disagreement, and different views about the underlying risk will change how optimistic one should be about marginal work.

3. **How much leverage philanthropy really has.** The headline estimate turns heavily on whether a small field can still buy tiny but real reductions in catastrophe risk by changing policy, institutions, or crisis behavior.

4. **Whether the best marginal opportunities are left of boom or right of boom.** Founders Pledge argues that escalation-control and war-limitation work may be especially neglected, but the evidence base is still thin.

5. **Whether this category should include some extinction or very long-run civilizational-collapse risk.** This page intentionally does not. Including those tail harms would make the category look better.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- The key update here is replacing the previous benchmark-style microprobability estimate with a more explicit field-level BOTEC and a dedicated assumption page.
