---
id: pandemics
name: 'Pandemics'
effects:
  - effectId: population
    startTime: 10
    windowLength: 15
    costPerMicroprobability: 1_000_000
    populationFractionAffected: 0.9
    qalyImprovementPerYear: 0.35
---

# Justification of cost per life

_The following analysis was done on April 10th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

Unlike a typical cause area, donations to pandemic-risk charities are best modeled as slightly reducing the probability of a catastrophe rather than directly buying QALYs. We therefore estimate the cost of averting one **microprobability**: a one-in-a-million absolute reduction in the probability of a **global catastrophic pandemic**.

## Description of effect

This effect captures welfare gains from reducing the probability of a pandemic severe enough to kill **more than 10% of humanity within roughly five years** and leave lasting global health, economic, and institutional damage. This is intentionally worse than COVID-19 but narrower than literal human extinction or permanent civilizational collapse.

That event definition lines up reasonably well with catastrophe-style biosecurity forecasting, especially the [Existential Risk Persuasion Tournament](https://forecastingresearch.org/s/XPT.pdf), which separately asked about catastrophic outcomes from natural and engineered pathogens.

We intentionally model a catastrophe that is narrower than extinction. If you think catastrophic pandemics also carry substantial extinction risk or centuries-long civilizational-collapse risk, the true cost per microprobability would be lower than the estimate on this page.

## Point Estimates

- **Cost per microprobability:** \$1 million (\$250,000–\$4 million)
- **Population fraction affected:** 0.9 (0.75–1.0)
- **QALY improvement per affected person per year:** 0.35 (0.2–0.6)
- **Start time:** 10 years (~2036)
- **Duration:** 15 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. COVID-19 caused about **14.9 million excess deaths** in 2020 and 2021, showing that even a far-below-catastrophic pandemic can kill at enormous scale and seriously damage health systems and societies. ([WHO](https://www.who.int/news/item/05-05-2022-14.9-million-excess-deaths-were-associated-with-the-covid-19-pandemic-in-2020-and-2021))
2. In postmortem medians for risk by **2100**, the XPT found about **3%** catastrophic risk from engineered pathogens and **0.85%** from natural pathogens among domain experts, versus **0.8%** and **1%** among superforecasters. ([Forecasting Research Institute](https://forecastingresearch.org/s/XPT.pdf))
3. Worst-case engineered pandemics could kill hundreds of millions or billions, and ordinary pandemic defenses are not reliable against severe "wildfire" or "stealth" scenarios. ([Founders Pledge GCBR report](https://dkqj4hmn5mktp.cloudfront.net/GCBR_Report_Founders_Pledge_7505b1ebe0.pdf), [GCSP catastrophic-pandemics paper](https://www.gcsp.ch/sites/default/files/2024-12/securing-civilisation-against-catastrophic-pandemics-gp-31.pdf))
4. Pandemic-risk philanthropy remains small relative to the stakes. Open Philanthropy alone reports **140+ grants** and **\$250+ million** since 2015, while Founders Pledge argues that relevant philanthropic funding outside direct response still remains in the **tens of millions** and that there were no other funders on Open Philanthropy's scale as of mid-2023. ([Open Philanthropy](https://www.openphilanthropy.org/focus/biosecurity-pandemic-preparedness/), [Founders Pledge](https://dkqj4hmn5mktp.cloudfront.net/GCBR_Report_Founders_Pledge_7505b1ebe0.pdf))
5. A mature but still small pandemic-risk philanthropy field spending roughly **\$400 million over about 10 years** plausibly reduces 20-year catastrophic-pandemic risk by about **0.04 percentage points**, with a practical positive range around **0.01–0.16 percentage points**. ([See detailed justification](/assumption/effect-of-pandemic-risk-philanthropy))
6. Average world population over the modeled **2036-2051** window is about **9.9 billion** under the site's default population assumptions. This is broadly consistent with [UN 2024](https://population.un.org/wpp/assets/Files/WPP2024_Summary-of-Results.pdf).
7. Average human life-years are worth roughly **0.9 QALYs**, so catastrophe deaths removing about **40 years** of otherwise expected life cost around **36 QALYs each**. ([WHO](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy), [Our World in Data](https://ourworldindata.org/life-expectancy))
8. Severe survivors of a global catastrophic pandemic lose a few QALYs on average through some combination of long post-viral illness, organ damage, lost access to healthcare, bereavement, and years of lower quality of life.

## Details

### Cost per Microprobability

The cleanest way to model this cause area is:

$$
\text{Cost per microprobability} = \dfrac{\text{cumulative field spending}}{\text{microprobabilities averted}}
$$

Using the central assumptions:

- Cumulative spending: **\$400M**
- Risk reduction achieved: **0.04 percentage points** = 0.0004
- Microprobabilities averted: 0.0004 / 10^-6 = **400**

So:

$$
\text{Cost per microprobability} = \dfrac{\$400{,}000{,}000}{400} = \$1{,}000{,}000
$$

So the point estimate is **\$1 million per microprobability**.

The load-bearing input here is Assumption 5. The dedicated assumption page argues that the historical field is probably large enough to be measured in the **mid hundreds of millions of dollars**, small enough to still be very neglected, and concrete enough to have plausibly bought a few basis points of risk reduction through policy work, technical public goods, and capacity building. That central estimate corresponds to a field that has helped a little, not a field that has already solved the problem.

As a rough micro-level sanity check, some targeted opportunities plausibly beat the field average by a wide margin. For example, if a **\$20 million** policy effort prevented roughly **10 high-risk lab-years**, and if the relevant catastrophic-pandemic risk were on the order of **3 × 10^-5 per lab-year**, that would buy about **300 microprobabilities** at roughly **\$67,000 each**. This BOTEC should not be taken literally, but it does suggest that unusually strong interventions can plausibly do much better than the historical field average, which makes a **\$1 million** central estimate for the field as a whole look reasonable rather than aggressive. ([Lipsitch & Inglesby 2014](https://journals.asm.org/doi/10.1128/mbio.02366-14))

This is best read as a **historical field-average** estimate. The marginal cost per microprobability for a well-chosen donation to a top organization may be somewhat better, which is one reason the low end of the range is **\$250,000** rather than **\$1 million**, though diminishing returns are also a live concern.

Two considerations pull the estimate downward:

1. Pandemic-risk work has some unusually concrete levers, including synthesis screening, surveillance, platform countermeasures, indoor-air defenses, and better PPE.
2. CEPI's [100 Days Mission](https://cepi.net/100-days-mission) suggests that just one major preparedness capability could have saved **8.3 million lives** and nearly **\$1.4 trillion** in productivity losses in COVID-19.

Several considerations pull the estimate upward:

1. Many grants are still field-building or agenda-setting rather than immediate risk reduction.
2. The most important decisions still run through governments and international coordination.
3. The hardest scenarios may be exactly the ones where existing medical-countermeasure plans fail.

All things considered, **\$1 million per microprobability** still looks like a reasonable central estimate.

**Range**

- **Pessimistic:** \$400M buys only **0.01 percentage points** = 100 microprobabilities -> **\$4 million** per microprobability
- **Optimistic:** \$400M buys **0.16 percentage points** = 1,600 microprobabilities -> **\$250,000** per microprobability

So the practical sensitivity range is **\$250,000–\$4 million per microprobability**.

This should be read as a practical positive range, not a full uncertainty interval. The true uncertainty is wider. If one thought philanthropy has almost no leverage over catastrophic-pandemic risk, the estimate would get worse quickly. If one thought the best current interventions are unusually high-leverage and that historical field-building has already unlocked a lot of public action, it could get better.

### Population Fraction Affected

The point estimate (0.9) and range (0.75–1.0) reflect that a catastrophe of the kind modeled here would affect nearly everyone through:

1. **Mass death:** More than 10% of humanity dying already implies about **1 billion deaths** at current population levels.
2. **Systemic disruption:** A severe pandemic does not only kill directly; it also disrupts hospitals, trade, food systems, schooling, travel, and state capacity.
3. **Near-universal exposure to harm:** Even people who never become infected would still often face bereavement, lost care, shortages, fear, and years of damaged institutions.

The [GCSP catastrophic-pandemics paper](https://www.gcsp.ch/sites/default/files/2024-12/securing-civilisation-against-catastrophic-pandemics-gp-31.pdf) is a useful anchor here. Its "wildfire" scenario is explicitly about essential-service breakdown, while its "stealth" scenario is about a widely spread pathogen causing severe delayed harm. In both cases, the indirect effects go far beyond the directly infected.

We stop short of **1.0** only because some remote communities and unusually resilient areas might avoid the very worst consequences.

### QALY Improvement per Affected Person per Year

The point estimate (0.35) and range (0.2–0.6) are derived by distributing total QALY losses across the affected population and duration.

Using an average world population of **9.9 billion** over the modeled window and an affected fraction of **0.9**, the model implies about **8.9 billion affected people**.

One rough illustrative decomposition, rounded for clarity, is:

- **~1.0 billion deaths** × **36 QALYs** each = **36 billion QALYs** (using the floor of the ">10%" event definition)
- **~2.4 billion severe survivors** × **2.5 QALYs** each = **6.0 billion QALYs**
- **~5.5 billion moderately or indirectly affected people** × **0.8 QALYs** each = **4.4 billion QALYs**
- **Total:** about **46.0 billion QALYs**

These survivor buckets are not meant as precise epidemiological claims. They are only a way of showing that the total is not driven by deaths alone. Deaths still account for about **77%** of the modeled QALY loss, so the headline estimate is not very sensitive to how the nonfatal harms are split between "severe" and "moderate" survivors.

Affected person-years over a 15-year window are:

$$
9.9 \text{B} \times 0.9 \times 15 \approx 134 \text{ billion affected person-years}
$$

So:

$$
\dfrac{46.0 \text{B QALYs}}{134 \text{B affected person-years}} \approx 0.34
$$

That floor-case decomposition gives about **0.34**. We use **0.35** as the point estimate because the category is defined as **more than 10%** dead rather than exactly 10%, so a typical catastrophe in this class is plausibly somewhat worse than the floor case above.

The main driver is still death. But it would be a mistake to model a >10%-death pandemic as "just deaths." COVID-19, which was far milder than the catastrophe modeled here, still caused enormous indirect mortality, huge backlogs in care, large economic losses, and widespread chronic illness. In a much worse pandemic, a few QALYs lost among severe survivors and less than one QALY lost among the broader indirectly affected population look plausible.

At the central estimate, averting one microprobability saves about:

$$
9.9 \text{B} \times 0.9 \times 0.35 \times 15 \times 10^{-6} \approx 46{,}700 \text{ QALYs}
$$

So the implied cost-effectiveness is about:

$$
\dfrac{\$1 \text{M}}{46{,}700} \approx \$21.4 / \text{QALY}
$$

That is extremely good by ordinary global-health standards, but that is a general feature of catastrophe-risk models when the stakes are huge and tractability is nontrivial.

### Start Time

The 10-year start time means the main modeled risk arrives around **2036**.

This is not a claim that catastrophic pandemic risk is negligible before then. The risk is already live. But 10 years is a reasonable compromise between two facts:

1. Catastrophic biological risk is likely to **increase** as synthesis, automation, AI-enabled biological design, and diffusion of capabilities continue.
2. The main policy window is also **now**: governments are still updating preparedness and research-governance frameworks in the aftermath of COVID-19, including the [WHO Pandemic Agreement](https://www.who.int/health-topics/pandemic-agreement) adopted on **20 May 2025** and the U.S. synthesis-screening framework introduced in **2024**.

So a 10-year start time captures the view that the center of gravity of the risk is in the next couple of decades rather than the far future.

### Duration

The 15-year duration is an equivalent-impact window that balances three things:

1. **The acute pandemic phase** would probably be concentrated in the first few years.
2. **Deaths destroy decades of life**, not just the first years after the outbreak.
3. **Survivor harms** such as chronic illness, damaged care systems, educational disruption, economic scarring, and institutional weakness plausibly persist for a long time.

So 15 years should not be read as a literal forecast that recovery takes exactly 15 years. It is an accounting device that spreads a catastrophe's total welfare losses over a window long enough to reflect both the acute shock and the life-years destroyed by premature death.

## What Kinds of Charities Are We Modeling?

These estimates assume marginal donations go to **high-leverage pandemic-risk-reduction organizations**, not to the average public-health or medical charity.

Representative activities include:

- governance of high-risk biological research, synthesis screening, and other anti-proliferation safeguards
- pathogen-agnostic early detection, biosurveillance, and rapid warning systems
- platform technologies and institutions for faster medical countermeasures
- transmission-blocking infrastructure such as pandemic-proof PPE and healthier indoor air
- policy advocacy and field-building focused specifically on global catastrophic biological risks

We are **not** modeling:

- ordinary hospital charity or basic outbreak response
- generic global-health delivery
- broad medical research without a fairly direct route to catastrophic-pandemic risk reduction
- charities mainly focused on routine endemic disease burden rather than worst-case pandemics

## Key Uncertainties

1. **How much weight to put on expert versus superforecaster risk estimates.** The XPT gap is material, and the answer changes how optimistic one should be about marginal work.

2. **How much of the future risk comes from engineered versus natural pathogens.** If engineered threats dominate, policy and technology governance may be unusually leveraged. If nature dominates more, the best defenses may look somewhat different.

3. **How effective philanthropy really is at the margin.** The headline estimate turns heavily on whether a small field can still buy small but real reductions in catastrophe risk by shaping policy, institutions, and technical public goods.

4. **Whether current countermeasure plans would actually work against worst-case threats.** Rapid vaccines, diagnostics, and therapeutics matter a lot, but some severe scenarios may require much stronger transmission-blocking defenses than the world currently has.

5. **How much pandemic tail risk should include extinction or very long-run civilizational collapse.** This page intentionally does not include those extra tail harms. Including them would make the category look better.

6. **How fast the AI-bio nexus changes the risk landscape.** If AI sharply lowers the barrier to designing or optimizing dangerous biological systems, the risk may become both more severe and more front-loaded than this page assumes.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- Assumption 5 is the most decision-relevant input. If better public estimates of cumulative pandemic-risk philanthropy or its realized effects appear, update [effect_of_pandemic_risk_philanthropy.md](/Users/elliot/work/github/impactlist/content/assumptions/effect_of_pandemic_risk_philanthropy.md) first.
- The next dedicated assumption page, if needed, is probably the baseline probability of a catastrophic pandemic this century or over the next 20 years.
- The nonfatal-harm decomposition here is intentionally rough. Deaths dominate the estimate, so future edits should focus more on whether the catastrophe definition and tractability assumptions are right than on fine-tuning the survivor buckets.
