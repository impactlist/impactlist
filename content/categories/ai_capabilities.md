---
id: ai-capabilities
name: 'AGI Development'
effects:
  - effectId: standard-mundane
    startTime: 3
    windowLength: 20
    costPerQALY: 104_000
  - effectId: standard-utopia
    startTime: 15
    windowLength: 5
    costPerQALY: 17_000
  - effectId: population-doom
    startTime: 15
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 208_000_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: -0.9
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High) and Claude Opus 4.6 (Max), with prompts from Impact List staff._

This cause covers philanthropic funding that makes frontier or near-frontier AI systems more capable, more widely available, or more widely deployed, without being primarily focused on safety or alignment. It includes entities like frontier labs, university AI labs, open-model efforts, and other projects whose main effect is to accelerate capabilities rather than reduce risk.

We model **three distinct effects**:

1. **standard-mundane**: ordinary welfare gains from better AI tools, higher productivity, and better products and services.
2. **standard-utopia**: gains from bringing forward a genuinely very good transformative-AI world.
3. **population-doom**: harm from slightly increasing the probability of AI-caused human extinction.

The key structural judgment in this writeup is that these effects operate through **different channels**:

- The mundane effect applies to the broad economic usefulness of AI capability work.
- The utopia and doom effects apply only to the share of donations that is best modeled as **frontier-equivalent acceleration**.

That distinction matters. A marginal dollar here can have real ordinary benefits while still pushing the frontier forward in ways that increase existential risk.

These are also **different notions of additionality**. Ordinary additionality asks how much extra welfare would fail to happen without the donation. Frontier-equivalent acceleration asks how much the donation pushes technical capability progress, even if similar consumer benefits would eventually have been produced by firms or rival labs anyway. A donation to an open model, a dataset, or a university lab can therefore have **low ordinary additionality but higher frontier impact**, because frontier actors can copy and absorb the output quickly.

---

## Effect 1: standard-mundane

This effect captures non-transformative gains from AI as a general-purpose technology: faster knowledge work, better software and services, scientific assistance, and other quality-of-life improvements before transformative AI dominates the picture.

### Point Estimates

- **Cost per QALY:** \$104,000 (\$40,000–\$800,000)
- **Start time:** 3 years
- **Duration:** 20 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

### Assumptions

1. Generative AI could add the equivalent of \$2.6-4.4 trillion annually across the 63 use cases McKinsey analyzed. ([McKinsey 2023](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier))
2. Penn Wharton estimates AI will raise productivity and GDP by about 1.5% by 2035, nearly 3% by 2055, and 3.7% by 2075. ([Penn Wharton 2025](https://budgetmodel.wharton.upenn.edu/issues/2025/9/8/projected-impact-of-generative-ai-on-future-productivity-growth))
3. In the best-known field experiment, AI assistance raised customer-support productivity by 14% on average and by roughly 35% for the least experienced workers. ([Brynjolfsson, Li, and Raymond 2025](https://academic.oup.com/qje/article/140/2/889/7990658))
4. By August 2025, 37.4% of U.S. workers reported using generative AI at work, 5.7% of work hours were AI-assisted, and self-reported time savings implied up to a 1.3% increase in labor productivity since ChatGPT's release. ([St. Louis Fed 2025](https://www.stlouisfed.org/on-the-economy/2025/nov/state-generative-ai-adoption-2025))
5. Social returns to innovation are typically several times larger than private returns; a reasonable all-things-considered benchmark is that a fully additional dollar of productive R&D creates roughly \$6-25 of ordinary social value. ([Open Philanthropy](https://www.openphilanthropy.org/research/social-returns-to-productivity-growth/), [Jones and Summers 2020](https://www.nber.org/system/files/working_papers/w27863/w27863.pdf))
6. One WELLBY is worth roughly £13,000, and about 6 WELLBYs is a reasonable conversion for 1 QALY, implying a money-metric value of roughly \$90,000-120,000 per QALY in rich-country settings. ([HM Treasury](https://www.gov.uk/government/publications/green-book-supplementary-guidance-wellbeing), [Frijters and Krekel 2021](https://eprints.lse.ac.uk/114605/1/Frijters_PR3.pdf))
7. AI is already heavily commercialized: global corporate AI investment reached \$252.3 billion in 2024, and private investment in generative AI alone reached \$33.9 billion. ([Stanford AI Index 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report/economy))
8. OpenAI's Stargate project alone intends to invest \$500 billion in AI infrastructure over four years. ([OpenAI 2025](https://openai.com/index/announcing-the-stargate-project/))
9. We therefore infer that only a modest share of a philanthropic dollar here creates additional ordinary welfare that would not have happened anyway: roughly 8% centrally, with a plausible range of 2-25%. This is an inference from the funding landscape, not a directly measured quantity.

### Details

#### Cost per QALY

We use a two-step model.

**Step 1 - Ordinary social value from fully additional AI capability work**

AI looks like a real general-purpose technology, not hype with zero substance. McKinsey, Penn Wharton, the St. Louis Fed, and field experiments all point in the same direction: useful AI capability work creates meaningful productivity and welfare gains.

We therefore use **\$12 of ordinary social value per fully additional dollar** as a central estimate, with a rough range of **\$6-25**.

This sits somewhat above Jones-Summers style central estimates for general R&D because AI has unusually low marginal replication costs and unusually broad applicability, but well below more optimistic technology-specific estimates.

**Step 2 - Additionality**

But most capability work would happen anyway. Private capital is enormous, frontier compute buildout is proceeding at extraordinary speed, and many apparently philanthropic dollars in this space mostly reshuffle who does the work rather than how much capability progress happens.

We therefore use **8% ordinary additionality** as the central estimate.

As a stylized anchor, if capabilities-relevant philanthropy is only on the order of a few hundred million dollars per year while corporate AI investment already exceeds \$250 billion per year, the philanthropic funding share is well below 1%. Even if philanthropic dollars are several times more additional than average because they target neglected niches, that still points to ordinary additionality in the single-digit percentage range.

**Calculation:**

$$
\text{Ordinary welfare per donated dollar} \approx 12 \times 0.08 = 0.96
$$

Using a \$100,000/QALY conversion benchmark:

$$
\text{Cost per QALY} \approx \dfrac{\$100{,}000}{0.96} \approx \$104{,}000
$$

So we use **\$104,000/QALY** as the point estimate.

That number should not be read as fully netting out every ordinary downside. Some measured economic gains show up as rents, convenience, or producer surplus rather than clean welfare gains, and AI also creates ordinary downsides we do not separately model here (job displacement, misinformation, surveillance, concentration of power). Those considerations are reasons to think the ordinary upside may be somewhat overstated, but we do not adjust the point estimate upward or downward without quantifying the adjustment.

It is also worth noting that the \$100,000/QALY conversion benchmark is mainly a rich-country benchmark. To the extent that AI capability gains substantially improve the lives of lower-income populations, the true cost per QALY would be somewhat lower than this estimate suggests.

#### Start Time

We use a 3-year start time because AI deployment is already happening, but philanthropic funding still usually needs time to turn into tools, products, model releases, adoption, and diffusion.

#### Duration

We use a 20-year duration because these ordinary gains plausibly persist for quite a while, but after a couple of decades the analysis is dominated less by mundane productivity effects and more by transformative-AI scenarios.

---

## Effect 2: standard-utopia

This effect captures the value of bringing forward a **genuinely very good** transformative-AI world: one where disease burden, extreme poverty, and a large fraction of drudgery are reduced much earlier than they otherwise would have been.

Importantly, this is **not** the probability that advanced AI is merely "on balance good." It is the probability that capability acceleration causes an earlier world that is so much better than the baseline that it is reasonable to model the gap as a large QALY gain.

### Point Estimates

- **Cost per QALY:** \$17,000 (\$5,000–\$150,000)
- **Start time:** 15 years
- **Duration:** 5 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

### Assumptions

1. In the 2023 AI Impacts survey, the aggregate forecast put a 50% chance on HLMI by 2047. ([Grace et al. 2024](https://aiimpacts.org/wp-content/uploads/2023/04/Thousands_of_AI_authors_on_the_future_of_AI.pdf))
2. We use a rough baseline of **20 years to transformative AI**, consistent with the above survey once we allow for large uncertainty and the distinction between HLMI and fully transformative deployment.
3. Total cumulative frontier or near-frontier AI spending before transformative AI is reached is roughly **\$5 trillion** centrally. ([See detailed justification](/assumption/cumulative-frontier-ai-spending-before-transformative-ai))
4. A marginal philanthropic dollar in this cause is best modeled as about **30 cents of frontier-equivalent capability acceleration**, after accounting for crowd-out and the fact that some funded work is not direct frontier training. ([See detailed justification](/assumption/frontier-equivalent-share-of-ai-capabilities-philanthropy))
5. Grace et al. (2024) report that respondents assigned about **10%** median probability and about **23%** mean probability to "extremely good" outcomes from HLMI. Because this effect is meant to capture only very good futures, we use **10%** as the central probability. ([Grace et al. 2024](https://aiimpacts.org/wp-content/uploads/2023/04/Thousands_of_AI_authors_on_the_future_of_AI.pdf))
6. In a genuinely very good transformative-AI world, welfare might improve by roughly **500 million QALYs per year** relative to baseline. This corresponds to about 0.05 extra QALYs per year for 10 billion people. That is smaller than today's gap between rich-country and poor-country life conditions for much of the world, and it still leaves room for major improvements in health, poverty, and drudgery reduction rather than assuming literal utopia. ([WHO](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy), [World Bank 2024](https://www.worldbank.org/en/publication/poverty-prosperity-and-planet), [Our World in Data](https://ourworldindata.org/working-hours))

### Details

#### Cost per QALY

We use a timing model:

$$
\text{QALYs per \$} \approx p_{\text{good}} \times \dfrac{a_{\text{frontier}}}{S_{\text{total}}} \times T \times \Delta Q_{\text{year}}
$$

Where:

- $p_{\text{good}}$ = probability of a genuinely very good transformative-AI outcome
- $a_{\text{frontier}}$ = frontier-equivalent acceleration per donated dollar
- $S_{\text{total}}$ = cumulative frontier spending before transformative AI
- $T$ = years until transformative AI
- $\Delta Q_{\text{year}}$ = annual QALY gain in the very good world relative to baseline

Using the central assumptions:

- $p_{\text{good}} = 0.10$
- $a_{\text{frontier}} = 0.30$
- $S_{\text{total}} = 5 \times 10^{12}$
- $T = 20$
- $\Delta Q_{\text{year}} = 5 \times 10^{8}$

This gives:

$$
\text{QALYs per \$} \approx 0.10 \times \dfrac{0.30}{5 \times 10^{12}} \times 20 \times 5 \times 10^{8}
\approx 6 \times 10^{-5}
$$

So:

$$
\text{Cost per QALY} \approx \dfrac{1}{6 \times 10^{-5}} \approx \$16{,}700
$$

So we use **\$17,000/QALY** as the point estimate.

Two points are worth emphasizing:

1. This number is **very sensitive** to worldview assumptions. If you think very good transformative-AI futures are much less likely, or much farther away, this effect gets much smaller.
2. This effect only captures the upside of earlier very good futures. It does **not** imply the overall cause is good, because the doom effect below is also material.

Because this timing model multiplies several uncertain terms, different plausible parameter bundles can land in the same order of magnitude. Readers should not over-interpret the exact point estimate.

As with the doom effect below, this timing model assumes that small marginal capability pushes translate roughly linearly into timeline acceleration. That assumption is obviously imperfect: real progress may involve thresholds, bottlenecks, and nonlinear race dynamics. We use linearity here as the cleanest tractable baseline.

#### Start Time

We use a 15-year start time because the point of this effect is not today's copilots or narrow models. It is earlier arrival of genuinely transformative systems, which still seems more likely to matter in the 2030s or 2040s than in the next few years.

#### Duration

We use a 5-year duration because this effect is about the window between "AI arrived earlier" and "AI would have arrived anyway." If the true acceleration is larger or smaller, users should adjust this themselves.

---

## Effect 3: population-doom

This effect captures the harm from AI capability work slightly increasing the probability of AI-caused human extinction.

Note: The QALY improvement per year is **-0.9** (negative), indicating this is a harmful effect.

### Point Estimates

- **Cost per microprobability (increase):** \$208 million (\$30 million–\$2 billion)
- **Population fraction affected:** 1.0
- **QALY improvement per affected person per year:** -0.9
- **Start time:** 15 years
- **Duration:** Defined by the global time limit parameter (default is 100 years)

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

### Assumptions

1. The baseline probability of AI-caused extinction this century is about **8%**. ([See detailed justification](/assumption/ai-doom-probability))
2. Total cumulative frontier or near-frontier AI spending before transformative AI is roughly **\$5 trillion**. ([See detailed justification](/assumption/cumulative-frontier-ai-spending-before-transformative-ai))
3. A marginal philanthropic dollar in this cause is best modeled as about **30 cents of frontier-equivalent capability acceleration**. ([See detailed justification](/assumption/frontier-equivalent-share-of-ai-capabilities-philanthropy))
4. As a first-pass model, small marginal accelerations of frontier capability progress increase extinction risk roughly in proportion to how much they speed up the race. This linearity assumption is obviously imperfect, but it is the cleanest tractable baseline.
5. World population is projected to peak at about **10.3 billion** in the 2080s. ([UN 2024](https://population.un.org/wpp/assets/Files/WPP2024_Summary-of-Results.pdf))
6. Average human quality of life is roughly **0.9 QALYs per year**. ([WHO](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy), [Our World in Data](https://ourworldindata.org/life-expectancy))

### Details

#### Cost per Microprobability

We use the same frontier-acceleration model as in Effect 2, but now apply it to extinction risk instead of upside:

$$
\Delta p_{\text{doom}} / \$ \approx p_{\text{doom}} \times \dfrac{a_{\text{frontier}}}{S_{\text{total}}}
$$

Using:

- $p_{\text{doom}} = 0.08$
- $a_{\text{frontier}} = 0.30$
- $S_{\text{total}} = 5 \times 10^{12}$

We get:

$$
\Delta p_{\text{doom}} / \$ \approx 0.08 \times \dfrac{0.30}{5 \times 10^{12}} \approx 4.8 \times 10^{-15}
$$

That is:

- About **0.0048 microprobabilities of extra extinction risk per \$1 million**
- Or about **\$208 million per +1 microprobability**

So we use **\$208 million** per +1 microprobability as the point estimate.

This is strongly negative on any worldview that gives substantial weight to future generations.

#### Population Fraction Affected

The point estimate is 1.0 because extinction kills everyone.

#### QALY Improvement per Affected Person per Year

The value is **-0.9** because this effect is harm, not benefit, and because the symmetric positive AI-risk category uses 0.9 QALYs per human life-year rather than 1.0.

With the default 100-year time limit, a world population of roughly 10 billion, and an average welfare level of about 0.9 QALYs/year:

- Total QALYs destroyed: **about 900 billion**
- QALYs destroyed per microprobability: **about 900,000**

So at the central estimate, **\$1 million** donated to AI capabilities increases expected losses by roughly:

$$
0.0048 \times 900{,}000 \approx 4{,}300 \text{ QALYs}
$$

This downside becomes much larger if you extend the time horizon beyond 100 years.

#### Start Time

We use a 15-year start time for the same reason as in Effect 2: the relevant risk is not from today's narrow uses alone, but from the period when highly capable systems plausibly become strategically decisive.

#### Duration

The duration is controlled by the global time limit parameter. Extinction has especially large long-run consequences, so users with longtermist views will see much larger harms than users who count only currently alive people or the next few generations.

---

## Worked Example at Default Settings

At the default 100-year time horizon and default 0% discount rate, the central estimates imply the following rough magnitudes per **\$1 million donated**:

- **standard-mundane:** about **9.6 QALYs gained** (\$1,000,000 / \$104,000)
- **standard-utopia:** about **58.8 QALYs gained** (\$1,000,000 / \$17,000)
- **population-doom:** about **4,327 QALYs destroyed** (0.0048 microprobabilities times about 900,000 QALYs per microprobability)

So at the default settings, the net effect is roughly:

$$
9.6 + 58.8 - 4{,}327 \approx -4{,}260 \text{ QALYs}
$$

This is the single most important takeaway from the default model: at ordinary time horizons, the existential-risk downside dominates the positive terms unless the user substantially changes the underlying assumptions.

---

## What Kinds of Projects Are We Modeling?

These estimates are meant for donations whose **main effect is to accelerate AI capabilities**, such as:

- Frontier or near-frontier model development
- University labs doing capability-relevant AI research
- Open-weight model efforts, datasets, evaluations, and tooling that make powerful AI more available
- Deployment and diffusion projects whose main effect is getting more capable AI used sooner and more widely

We are **not** modeling:

- AI safety and alignment work
- Governance projects whose main effect is slowing or constraining dangerous deployment
- Generic science funding with only weak AI relevance

Recipient-level multipliers matter a lot here. A dollar to OpenAI, Anthropic, or a near-frontier university lab should not be treated as identical.

## Key Uncertainties

These numbers are rough order-of-magnitude judgments. The biggest uncertainties are:

1. **How frontier-direct the marginal recipient is.** A dollar to a frontier lab, an open-model effort, and a public-interest AI institute do not have the same effect.
2. **How much capability acceleration markets would already have bought.** This is the central reason the ordinary-benefit estimate is weaker than it first appears.
3. **Whether transformative-AI acceleration is mostly good or mostly bad.** The upside and downside terms both depend heavily on worldview assumptions, and the upside and downside terms are partly correlated rather than fully independent.
4. **Whether marginal risk scales linearly.** Real systems may have thresholds, bottlenecks, or race dynamics that make the doom effect either much smaller or much larger than this simple model.
5. **Bad but non-extinction outcomes.** We do not separately model scenarios like authoritarian lock-in, severe inequality, AI-enabled bioweapons, or large nonhuman-animal effects. On balance, omitting these probably makes the category look somewhat too positive.

{{CONTRIBUTION_NOTE}}

# Internal Notes
