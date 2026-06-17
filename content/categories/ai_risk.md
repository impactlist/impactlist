---
id: ai-risk
name: 'AI Existential Risk'
effects:
  - effectId: population
    startTime: 10
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 625_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: 0.80
---

# Justification of cost per life

_The following analysis was done on April 15th 2026 by GPT-5.4 and Claude Opus 4.8, with prompts from Impact List staff._

Unlike a typical cause area, donations to AI existential-risk charities are best modeled as slightly reducing the probability of a catastrophe rather than directly buying QALYs. We therefore estimate the cost of averting one **microprobability**: a one-in-a-million absolute reduction in the probability of an **AI-caused existential catastrophe**.

## Description of effect

This effect captures welfare gains from reducing the probability that advanced AI causes an existential catastrophe: either **literal human extinction**, or a permanent global outcome such as **irreversible disempowerment** or **stable totalitarian lock-in** severe enough to permanently and drastically curtail humanity's future. This is the usual framing of existential risk: not just everyone dying, but any outcome that irreversibly and drastically reduces humanity's welfare.

## What kinds of charities are we modeling?

These estimates are for **explicitly existential-risk-focused AI safety charities**: technical alignment and control work, governance and standards work aimed at reducing catastrophic risk, and field-building that increases strong safety talent or institutional capacity.

They are **not** estimates for generic AI ethics, ordinary responsible-AI work focused mainly on bias or privacy, or projects that mainly make frontier systems more capable.

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per microprobability:** \$625,000 (\$154,000–\$14.3 million)
- **Population fraction affected:** 1.0 (the modeled event is global by construction)
- **QALY improvement per affected person per year:** 0.80 (0.65–0.9)
- **Start time:** 10 years (~2036)
- **Duration:** From the start time to the global time limit parameter (default 100 years, so a 90-year window by default), capped at a trillion years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. The baseline probability of AI-caused existential catastrophe this century is approximately 14%, with a plausible range around 3–35%. A useful decomposition is about 10% extinction risk plus about 4 percentage points of additional irreversible-disempowerment or lock-in risk. ([See detailed justification](/assumption/ai-existential-catastrophe-probability))
2. AGI — machines that can do any mental task better and more cheaply than humans — most likely arrives around 2036, with a plausible range of roughly 2030–2050. That is roughly when catastrophic AI risk becomes pressing. ([See detailed justification](/assumption/timelines-to-agi))
3. The welfare shortfall per affected person-year is about 0.9 QALY-equivalents for literal extinction and about 0.45 for permanent non-extinction catastrophes — irreversible disempowerment or stable totalitarian lock-in, which are less severe per year than extinction (people remain alive) but still globally catastrophic. ([WHO](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy), [Our World in Data](https://ourworldindata.org/life-expectancy))
4. Cumulative AI safety spending through 2025 is roughly \$1 billion, probably in the high hundreds of millions to low single-digit billions; frontier-lab internal safety work is counted only at a conservative few tens of millions of dollars per year. ([McAleese 2025 update](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation), [Coefficient Giving](https://coefficientgiving.org/funds/navigating-transformative-ai))
5. Roughly \$1 billion of historical AI safety spending has probably reduced AI-caused existential-catastrophe risk by about 0.16 percentage points, with a plausible range around 0.007–0.65 percentage points. ([See detailed justification](/assumption/effect-of-all-ai-safety-spending-on-ai-existential-catastrophe))

How these fit together: Assumptions 4 and 5 set the cost per microprobability. The global parameters and Assumption 3 set the QALYs at stake per microprobability. Assumption 2 informs the start time. Assumption 1 mainly constrains how much risk there is to reduce — the QALY value of a microprobability does not itself depend on the baseline probability (see Key Uncertainties).

## Details

### Cost per microprobability

The point estimate (\$625,000 per microprobability) and range (\$154,000–\$14.3 million) come from a field-level estimate of what historical AI safety spending has already achieved. Per Assumptions 4 and 5, roughly \$1 billion of spending has probably reduced AI-caused existential-catastrophe risk by about **0.16 percentage points**:

- Microprobabilities averted: $0.0016 / 10^{-6} = 1{,}600$
- Cost per microprobability: $$\$1\text{B} / 1{,}600 \approx \$625{,}000$$

The same calculation with weaker or stronger assumed effects gives the range: 0.007 percentage points → about **\$14.3 million** per microprobability, and 0.65 percentage points → about **\$154,000**. (The three significant figures in \$625,000 are an artifact of the round 0.16 input, not real precision.)

The range is wide because the estimate rests on a **single line of evidence** — the realized field-level effect of past spending — rather than a convergence of independent methods, so it reflects uncertainty _within_ that one estimate.

:::details{title="What this figure counts, and historical-average vs. marginal donations"}
This estimate is already meant to be net of positive and negative effects, because the underlying assumption page explicitly tries to account for both. It also includes more than just extinction-prevention channels: the same technical, governance, and institutional work can bear on irreversible disempowerment and lock-in as well, though probably not quite as strongly as they bear on literal extinction.

The field-level estimate is based on the historical average effect of AI safety spending to date, while this page models forward-looking marginal donations to strong charities. The best marginal opportunities may be better than the historical average dollar, but that is at least partly offset by diminishing returns and by the field becoming larger and more crowded, so we treat the historical estimate as a reasonable starting point rather than automatically adjusting it upward.

The positive range should also be read as conditional on safety spending being net helpful. The linked assumption page still assigns some lower-tail probability to near-zero or negative net impact from capabilities spillovers, safetywashing, or deployment acceleration; users who put substantial weight on that tail should weaken or disable this category.
:::

### Population fraction affected

The point estimate (1.0) reflects that the modeled event is global by construction.

In literal extinction, everyone dies. In irreversible disempowerment or stable lock-in, people may remain alive, but the catastrophe still affects the whole population. We therefore model the difference between extinction and non-extinction catastrophes through the **severity per person-year**, not by shrinking the affected population.

This is a simplifying convention. In real lock-in or disempowerment scenarios the intensity of harm could be uneven across people, but the model absorbs that heterogeneity into the severity term rather than trying to split the world into fully affected and partially affected sub-populations.

### QALY improvement per affected person per year

The point estimate is **0.80** QALY-equivalents lost per affected person per year — a weighted average of about **0.9** for literal extinction (a lost life-year averages about 0.9 QALY, not a perfect 1.0) and **0.45** for permanent non-extinction catastrophes, where people remain alive but humanity permanently loses the ability to choose and revise its own future.

The **0.45** is the most contestable input, and how you value it drives the whole severity term. Irreversible disempowerment or stable lock-in is far worse than ordinary authoritarianism but less severe per year than extinction: weight the lost agency lightly and you approach the ~0.1–0.3 that present-day happiness gaps alone would justify; treat lost self-determination as near-extinction and you approach 0.9. Given the extinction/non-extinction mix in Assumption 1, the plausible range for the overall event class is about **0.65–0.9**.

:::details{title="How the 0.80 is derived, and the case for 0.45"}
Across the whole baseline catastrophe class the average shortfall is about **0.77**, using the 10% + 4% extinction/non-extinction decomposition from Assumption 1:

$$\text{Severity} = \frac{0.10 \times 0.9 + 0.04 \times 0.45}{0.14} \approx 0.77$$

The point estimate is **0.80** rather than 0.77 because a donation does not buy a proportional slice of the baseline risk. Per Assumption 5, safety spending is somewhat more effective against extinction than against the non-extinction channels, so the averted risk is about **77% extinction** rather than the baseline 71%:

$$S_{\text{averted}} = (0.769 \times 0.9) + (0.231 \times 0.45) \approx 0.80$$

Readers who assume safety work reduces all channels proportionally should use 0.77 instead; the difference is about 4%. Both numbers are coupled to the probability split — if it changes, recompute rather than reusing 0.77 or 0.80.

The **0.45** itself is roughly a hedonic part plus a non-hedonic part. Day-to-day wellbeing gaps between the freest and least-free societies today are only about 1–3 points on a 0–10 scale, so a purely hedonic reading would give ~0.1–0.3 ([World Happiness Report](https://worldhappiness.report/)); the remainder reflects the permanent loss of agency, autonomy, and self-determination that makes this *existential* rather than merely a bad regime. ([Bostrom 2002](https://nickbostrom.com/existential/risks); on concrete AI-driven disempowerment and lock-in pathways, [Dung 2025](https://link.springer.com/article/10.1007/s00146-024-01930-2), [Kulveit et al. 2025](https://arxiv.org/abs/2501.16946), [Feldstein 2019](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3314162), [Tokson 2025](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5182213))
:::

**How total QALYs scale with the time limit:**

A microprobability is worth more the longer the horizon you count over. At the **default 100-year time limit** it is worth about **1.07 million QALYs**, which puts the cost at roughly **\$0.58 per QALY — about \$47 per life**. Because the population keeps growing until it hits the default cap, the QALYs at stake rise faster than linearly with the time limit, so the implied cost falls accordingly: about **\$195 per life** at a 40-year limit and about **\$1 per life** at a 1,000-year limit.

:::details{title="Worked examples at 40-, 100-, and 1,000-year time limits"}
These use the site's default global parameters and its actual population model, so they match what the site displays. The effect window always runs from year 10 to the time limit.

**Example 1 — Time limit = 40 years (30-year window)**

- Person-years in the window: about 321 billion
- QALYs at stake: $321\text{B} \times 0.80 \approx 257 \text{ billion}$
- QALYs saved per microprobability: $257\text{B} \times 10^{-6} = 257{,}000$
- Cost per QALY: $$\$625{,}000 / 257{,}000 \approx \$2.4/\text{QALY}$$ (about \$195 per life of 80 QALYs)

**Example 2 — Time limit = 100 years (the default; 90-year window)**

- Person-years in the window: about 1,335 billion
- QALYs at stake: $1{,}335\text{B} \times 0.80 \approx 1{,}070 \text{ billion}$
- QALYs saved per microprobability: $1{,}070\text{B} \times 10^{-6} = 1{,}070{,}000$
- Cost per QALY: $$\$625{,}000 / 1{,}070{,}000 \approx \$0.58/\text{QALY}$$ (about \$47 per life)

**Example 3 — Time limit = 1,000 years (990-year window)**

- The population reaches the default cap (10x today's) after about 230 years, so most of the window sits at the cap
- Person-years in the window: about 71,000 billion
- QALYs at stake: $71{,}000\text{B} \times 0.80 \approx 57{,}000 \text{ billion}$
- QALYs saved per microprobability: $57{,}000\text{B} \times 10^{-6} = 57 \text{ million}$
- Cost per QALY: $$\$625{,}000 / 57\text{M} \approx \$0.011/\text{QALY}$$ (about \$1 per life)

Because the default population curve grows at 1% per year until it hits the cap, the long-horizon numbers are dominated by the population growth and cap parameters — both of which users can edit.
:::

These implied cost-per-QALY figures are extremely low relative to GiveWell-style global-health benchmarks — a general feature of existential-risk expected-value models, which combine very large stakes with a nontrivial probability of catastrophe and at least modest tractability. Within the modeled range the headline comparison is robust: at the default time limit, the cost per microprobability would have to exceed roughly **\$67 million** — about five times the pessimistic end of our range — before this category looked worse than a \$5,000-per-life global-health benchmark. The decision-relevant cruxes are therefore whether marginal safety work is net-positive at all, and how much weight the time limit and discount rate place on the future.

### Start time

The 10-year start time means the main risk arrives around **2036**, which is our central [AGI estimate](/assumption/timelines-to-agi) — the point at which machines can outperform humans on any mental task and catastrophic risks become pressing. The window opens around when highly capable systems plausibly become strategically decisive.

Conceptually, the start time stands in for the expected date at which welfare losses would begin conditional on the catastrophe occurring — a single number approximating a distribution over arrival times. It is a second-order input: shifting it by a decade changes the QALYs at stake by roughly 8% at the default time limit, far less than the cost and severity assumptions move the result. Users who hold shorter or longer timelines should adjust it.

### Duration

The duration is controlled by the global "time limit" parameter, which defaults to 100 years. Combined with the 10-year start time, the default window covers years 10 through 100 — a 90-year window. The large `windowLength` in the frontmatter is only a ceiling; the effect is clamped by the global time-limit parameter.

Because the modeled catastrophe is permanent by construction, the value of this cause area is highly sensitive to how much weight you place on future people.

## Key uncertainties

1. **How high the underlying catastrophe risk really is.** The baseline probability constrains tractability rather than entering the QALY arithmetic directly: if AI existential catastrophe risk is closer to 3% than 14%, there is roughly a fifth as much risk to remove, and the achievable reduction per dollar plausibly scales down with it.

2. **How effective current interventions are at the margin.** This is the biggest empirical uncertainty. The best current interventions may be much better than the average dollar spent so far, or they may hit severe diminishing returns.

3. **Whether safety work partly accelerates capabilities.** Some "safety" work improves model robustness, usefulness, or legitimacy, which can have offsetting effects.

4. **Whether current safety techniques scale to genuinely superhuman systems.** Existing work may help a lot, help a little, or mostly buy time without solving the hard part.

5. **How severe non-extinction catastrophes are relative to extinction.** Permanent lock-in or disempowerment is not best modeled as ordinary bad policy, but it is also not literally identical to everyone dying.

6. **Timelines.** If transformative AI arrives very soon, there is less time for philanthropy to matter. If it arrives much later, today's work may need to be refreshed over decades. ([See timelines to AGI](/assumption/timelines-to-agi))

7. **Where to draw the boundary around the modeled event.** AI can worsen surveillance, repression, and concentration of power by many degrees. The hard question is which of those pathways are merely very bad and which are global, effectively irreversible, and severe enough to count as permanent curtailment of humanity's future.

8. **How much moral weight to put on future generations.** The default 100-year time limit puts much less weight on very distant future generations than fully longtermist views do. Users can adjust it.

{{CONTRIBUTION_NOTE}}

# Internal Notes
