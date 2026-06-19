---
id: nuclear
name: 'Nuclear'
effects:
  - effectId: population
    startTime: 15
    windowLength: 30
    costPerMicroprobability: 9_600_000
    populationFractionAffected: 0.9
    qalyImprovementPerYear: 0.75
---

# Justification of cost per life

Unlike a typical cause area, donations to nuclear-risk charities are best modeled as slightly reducing the probability of a catastrophe rather than directly buying {{QALYS}}. We therefore estimate the cost of averting one **microprobability**: a one-in-a-million absolute reduction in the probability of a global catastrophic nuclear war.

## Description of effect

This effect captures welfare gains from reducing the probability of a **global catastrophic nuclear war**: a nuclear exchange severe enough to kill at least tens of millions directly and plausibly billions overall through nuclear-winter-driven famine, state failure, disease, and economic collapse. In practice, the main pathways are great-power crises or smaller nuclear conflicts that escalate far beyond the initial use of nuclear weapons.

We intentionally model a catastrophe that is worse than a limited regional exchange but narrower than literal human extinction. If you think nuclear war also carries substantial extinction or centuries-long civilizational-collapse risk, the true cost per microprobability would be lower than the estimate on this page.

## What kinds of charities are we modeling?

These estimates assume marginal donations go to **high-leverage nuclear-risk-reduction organizations** — crisis-management, great-power-stability, arms-control, and nuclear-materials-security work — not to the average anti-war or peacebuilding organization.

:::details{title="What is and is not modeled"}
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
:::

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per microprobability:** \$9.6 million (\$1.2–\$120 million)
- **Population fraction affected:** 0.9 (0.7–1.0)
- **QALY improvement per affected person per year:** 0.75 (0.5–0.9)
- **Start time:** 15 years (~2041)
- **Duration:** 30 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. A large US-Russia nuclear war could kill on the order of **5 billion** people, mostly through famine rather than blast effects, and soot injections above **5 Tg** would already produce mass food shortages in almost all countries. ([Xia et al. 2022](https://www.nature.com/articles/s43016-022-00573-0))
2. Direct blast and radiation deaths from a US-Russia exchange are likely on the order of **tens of millions**; Rethink Priorities' central estimate is about **51 million** direct deaths. ([Rodriguez 2019](https://rethinkpriorities.org/research-area/how-many-people-would-be-killed-as-a-direct-result-of-a-us-russia-nuclear-exchange/))
3. Current nuclear risk is elevated. Open Nuclear Network's 2024 survey found median forecasts of **5%** from experts and **1%** from superforecasters for a >10 million-death nuclear catastrophe by **2045**, while SIPRI reports that all nine nuclear-armed states continued modernizing their arsenals in 2024 and that the expiry of **New START on February 5, 2026** raises the prospect of an unregulated arms buildup. ([ONN 2024](https://opennuclear.org/en/open-nuclear-network/publication/can-humanity-achieve-century-nuclear-peace), [SIPRI 2025 world nuclear forces](https://www.sipri.org/yearbook/2025/06), [SIPRI 2025 arms control](https://www.sipri.org/yearbook/2025/08))
4. Philanthropic funding specifically focused on nuclear risk reduction is only about **\$30 million per year** after the MacArthur Foundation's exit. ([Founders Pledge 2023](https://www.founderspledge.com/research/global-catastrophic-nuclear-risk-a-guide-for-philanthropists))
5. A mature but still tiny nuclear-philanthropy field spending roughly **\$600 million over 20 years** plausibly reduces broad >10-million-death nuclear-catastrophe risk by about **0.025 percentage points**, with a plausible range of about **0.002–0.2 percentage points**. ([See detailed justification](/assumption/effect-of-nuclear-risk-philanthropy))
6. The category model is more severe than that broad >10-million-death endpoint: it values a large nuclear-winter catastrophe, not every smaller nuclear catastrophe in the ONN-style risk forecast. We therefore convert broad risk reduction into large-nuclear-winter-equivalent risk reduction using an **expected-severity bridge**. The central bridge treats broad catastrophes as a mix of limited/regional or direct-casualty events, serious great-power or limited-winter events, and severe nuclear-winter events; the weighted average is about **25%** as severe as the large-winter scenario modeled here, so roughly four broad catastrophe microprobabilities count as one large-nuclear-winter-equivalent microprobability.
7. Average human life-years are worth roughly **0.9 QALYs**, so catastrophe deaths removing roughly **40 years** of otherwise expected life cost on the order of **36 QALYs each**. ([WHO](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy), [Our World in Data](https://ourworldindata.org/life-expectancy))
8. Severe survivors of a global catastrophic nuclear war lose roughly **7 QALYs** on average through some combination of shortened life expectancy from famine, disease, and infrastructure collapse, plus years of much lower quality of life during recovery.

## Details

### Cost per microprobability

We model this cause area as cumulative field spending divided by microprobabilities of catastrophe averted. We then add a severity adjustment: the risk-reduction evidence is for a broad >10-million-death nuclear catastrophe, while this page values a much larger nuclear-winter event. At the central assumptions, roughly **\$600 million** of philanthropy (\$30M/year for 20 years, Assumption 4) buying a **0.025 percentage-point** broad risk reduction (Assumption 5) averts **250 broad microprobabilities**. Applying the **25% large-nuclear-winter-equivalent severity bridge** in Assumption 6 gives about **62.5 modeled microprobabilities**, or **\$9.6 million per modeled microprobability**.

$$
\text{Cost per microprobability} = \dfrac{\$600{,}000{,}000}{250 \times 0.25} = \$9{,}600{,}000
$$

The load-bearing inputs are Assumption 5 and the severity bridge in Assumption 6. The [dedicated assumption page](/assumption/effect-of-nuclear-risk-philanthropy) argues that **0.025 percentage points over 20 years** is small enough to be plausible if philanthropy has real leverage, but not so small that the field's existence becomes irrelevant. Assumption 6 then prevents that broad >10-million-death endpoint from being valued as if every averted microprobability were a 5-billion-death nuclear-winter scenario.

The **25%** bridge is a compact expected-severity model, not an extra empirical measurement. A central decomposition is: about half of broad averted events look like limited/regional or mostly direct-casualty catastrophes worth roughly **5%** of the modeled winter scenario; about a third look like serious great-power or limited-winter events worth roughly **25%**; and about a sixth look like severe nuclear-winter events worth roughly **90%**. That gives $0.50 \times 0.05 + 0.35 \times 0.25 + 0.15 \times 0.90 \approx 0.25$.

The published **\$1.2–\$120 million** plausible range reflects uncertainty in both the broad risk reduction and this severity bridge. The full all-edges sweep is wider — roughly **\$600,000–\$300 million** if broad risk reduction and bridge severity are both pushed to favorable or unfavorable endpoints — but that would require several uncertain inputs to move to the same edge together. The published range stays inside that mechanical corner while still extending far beyond the central calculation.

:::details{title="Severity bridge and sensitivity"}
Central severity bridge:

- **Limited/regional or mostly direct-casualty catastrophe:** 50% of the broad endpoint x 5% severity = **2.5%** contribution
- **Serious great-power or limited-winter catastrophe:** 35% x 25% severity = **8.75%** contribution
- **Severe nuclear-winter catastrophe:** 15% x 90% severity = **13.5%** contribution

Total: about **25%** large-winter-equivalent severity.

Holding the central broad risk reduction fixed at **0.025 percentage points**:

- **50% bridge:** \$600M / (250 x 0.50) = **\$4.8 million** per modeled microprobability
- **25% bridge:** \$600M / (250 x 0.25) = **\$9.6 million**
- **10% bridge:** \$600M / (250 x 0.10) = **\$24 million**

Combining broad-risk and bridge uncertainty mechanically:

- **Favorable all-edges:** \$600M buys **0.2 percentage points** = 2,000 broad microprobabilities, with a **50%** bridge -> **\$600,000** per modeled microprobability
- **Unfavorable all-edges:** \$600M buys **0.002 percentage points** = 20 broad microprobabilities, with a **10%** bridge -> **\$300 million** per modeled microprobability
:::

One reason not to be more optimistic by default is that nuclear philanthropy is trying to influence outcomes that are highly path-dependent, politically constrained, and hard to measure. One reason not to be much more pessimistic is that the field is extremely neglected and some of the relevant levers really are high leverage — a single avoided escalation pathway can matter enormously.

### Population fraction affected

The point estimate (0.9) and range (0.7–1.0) reflect that a catastrophe of the kind modeled here would affect nearly everyone through:

1. **Direct casualties:** Tens of millions or more die from blast, burns, radiation, and immediate healthcare collapse.
2. **Global famine:** Xia et al. find that soot injections above 5 Tg cause mass food shortages in almost all countries, and their US-Russia scenario leads to more than 5 billion deaths.
3. **Economic and institutional collapse:** Modern trade, fertilizer supply, shipping, finance, energy systems, and state capacity would fail well beyond the countries that were directly attacked.

So even people far from the detonations would often still face severe shortages of calories, medicine, and state protection. We stop short of **1.0** only because some remote communities and a minority of countries might avoid the worst direct harms.

### QALY improvement per affected person per year

The point estimate (0.75) and range (0.5–0.9) come from spreading total QALY losses across the affected population over the 30-year window: about **208 billion QALYs** lost across roughly **278 billion affected person-years** gives **0.75 QALYs per affected person per year**. Deaths dominate the total, so even cutting the survivor-loss term materially leaves the answer in the same broad range — losing billions of lives is already an enormous QALY loss.

:::details{title="QALY-loss decomposition (about 208 billion QALYs)"}
Using a world population of **10.3 billion** and an affected fraction of **0.9**, the model implies about **9.27 billion affected people**. The population figure is broadly consistent with [UN 2024](https://population.un.org/wpp/assets/Files/WPP2024_Summary-of-Results.pdf). A simple stylized decomposition, rounded for clarity:

- **~5.0 billion deaths** × **36 QALYs** each (Assumption 7) = **180 billion QALYs**
- **~4.0 billion severe survivors** × **7 QALYs** each (Assumption 8) = **28 billion QALYs**
- **remaining affected people** are rounded away in this decomposition and do not materially change the total
- **Total:** about **208 billion QALYs**

Affected person-years over a 30-year window, and the resulting per-person-year rate:

$$
10.3 \text{B} \times 0.9 \times 30 \approx 278 \text{ billion affected person-years}
$$

$$
\dfrac{208 \text{B QALYs}}{278 \text{B affected person-years}} \approx 0.75
$$

The **7 QALYs per severe survivor** is a rough combined loss from shorter life expectancy plus much worse quality of life during a prolonged recovery; it does not imply exactly seven years in one specific health state.
:::

At the central estimate, averting one modeled microprobability saves about **209,000 QALYs**, implying roughly **\$46 per QALY** — extremely good by ordinary global-health standards, but a general feature of catastrophe-risk models when both the stakes and tractability are nontrivial.

:::details{title="Implied cost-effectiveness: about 46 dollars per QALY"}

$$
10.3 \text{B} \times 0.9 \times 0.75 \times 30 \times 10^{-6} \approx 209{,}000 \text{ QALYs}
$$

$$
\dfrac{\$9.6 \text{M}}{209{,}000} \approx \$46 / \text{QALY}
$$
:::

### Start time

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

So 30 years is not a forecast that recovery takes exactly 30 years. It is an accounting device. It spreads the catastrophe's total welfare losses over a period long enough to reflect both the acute shock and the life-years destroyed by premature death.

## Key uncertainties

1. **How severe nuclear winter would really be in the relevant scenarios.** Xia et al. is the best current quantitative anchor, but uncertainty remains about soot generation, adaptation, trade responses, and food substitution.

2. **How much weight to put on expert vs. superforecaster risk estimates.** ONN's 5% versus 1% by 2045 is a meaningful disagreement, and your view of the underlying risk changes how optimistic you should be about marginal work.

3. **How much leverage philanthropy really has.** The headline estimate turns heavily on whether a small field can still buy tiny but real reductions in catastrophe risk by changing policy, institutions, or crisis behavior.

4. **Whether the best marginal opportunities are left of boom or right of boom.** Founders Pledge argues that escalation-control and war-limitation work may be especially neglected, but the evidence base is still thin.

5. **Whether this category should include some extinction or very long-run civilizational-collapse risk.** This page intentionally does not. Including those tail harms would make the category look better.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on April 6th 2026 by GPT-5.4, with prompts from Impact List staff._

- The central field-level BOTEC and the dedicated assumption page need to stay aligned, especially on the endpoint distinction between broad nuclear catastrophe and severe nuclear winter.
