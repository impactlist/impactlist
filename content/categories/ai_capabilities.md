---
id: ai-capabilities
name: 'AI Capabilities / AGI Development'
effects:
  - effectId: standard-mundane
    startTime: 3
    windowLength: 20
    costPerQALY: 104_000
  - effectId: standard-utopia
    startTime: 10
    windowLength: 5
    costPerQALY: 33_000
  - effectId: population-doom
    startTime: 10
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 167_000_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: -0.9
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 and Claude Opus 4.6, with prompts from Impact List staff._

We model the AI Capabilities cause as having three independent effects on the world, which we calculate separately and then combine into a single overall cost per life.

For the first two effects, which we call "standard effects", we arrive at the cost per life by estimating the cost per {{QALY}} and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the [Assumptions page](/assumptions) for this and other parameters).

The third effect, which we call a "population effect", is modeled as slightly increasing the probability of a catastrophe rather than directly buying QALYs. We therefore estimate the cost of adding one microprobability: a one-in-a-million absolute increase in the probability of an AI-caused existential catastrophe.

This cause covers philanthropic funding that makes frontier or near-frontier AI systems more capable, more widely available, or more widely deployed, without being primarily focused on safety or alignment. It includes entities like frontier labs, university AI labs, open-model efforts, and other projects whose main effect is to accelerate capabilities rather than reduce risk.

The **three distinct effects** we model are:

1. **standard-mundane**: ordinary welfare gains from better AI tools, higher productivity, and better products and services.
2. **standard-utopia**: gains from bringing forward a genuinely very good transformative-AI world.
3. **population-doom**: harm from slightly increasing the probability of AI-caused human extinction.

The key structural judgment in this writeup is that these effects operate through **different channels**:

- The mundane effect applies to the broad economic usefulness of AI capability work.
- The utopia and doom effects apply only to the share of donations that is best modeled as **frontier-equivalent acceleration**.

That distinction matters. A marginal dollar here can have real ordinary benefits while still pushing the frontier forward in ways that increase existential risk.

These are also **different notions of additionality**. Ordinary additionality asks how much extra welfare would fail to happen without the donation. Frontier-equivalent acceleration asks how much the donation pushes technical capability progress, even if similar consumer benefits would eventually have been produced by firms or rival labs anyway. A donation to an open model, a dataset, or a university lab can therefore have **low ordinary additionality but higher frontier impact**, because frontier actors can copy and absorb the output quickly.

**Bottom line at default settings:** the two positive effects are small (about 9.6 and 30.3 QALYs per \$1 million donated) while the doom effect destroys about 7,200 QALYs per \$1 million, so the central model nets out around **-7,160 QALYs per \$1 million** — strongly negative. At ordinary time horizons the existential-risk downside dominates unless you substantially change the worldview assumptions (probability of doom, whether acceleration is net-good, whether the linear-risk model holds). The worked example near the end of this page carries the arithmetic.

## What kinds of projects are we modeling?

These estimates are for donations whose **main effect is to accelerate AI capabilities** — frontier and near-frontier model development, capability-relevant university AI research, open-weight models and the datasets, evaluations, and tooling that make powerful AI more available, and deployment projects that get capable AI used sooner and more widely. They are **not** estimates for AI safety and alignment work, governance work that mainly slows or constrains dangerous deployment, or generic science funding with only weak AI relevance.

Recipient-level multipliers matter a lot here: a dollar to OpenAI, Anthropic, or a near-frontier university lab should not be treated as identical.

---

## Effect 1: standard-mundane

This effect captures non-transformative gains from AI as a general-purpose technology: faster knowledge work, better software and services, scientific assistance, and other quality-of-life improvements before transformative AI dominates the picture.

### Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$104,000 (\$40,000–\$800,000)
- **Start time:** 3 years
- **Duration:** 20 years

_If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values._

### Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. Generative AI could add the equivalent of \$2.6-4.4 trillion annually across the 63 use cases McKinsey analyzed. ([McKinsey 2023](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier))
2. Penn Wharton estimates AI will raise productivity and GDP by about 1.5% by 2035, nearly 3% by 2055, and 3.7% by 2075. ([Penn Wharton 2025](https://budgetmodel.wharton.upenn.edu/issues/2025/9/8/projected-impact-of-generative-ai-on-future-productivity-growth))
3. In the best-known field experiment, AI assistance raised customer-support productivity by 14% on average and by roughly 34% for the least experienced workers. ([Brynjolfsson, Li, and Raymond 2025](https://academic.oup.com/qje/article/140/2/889/7990658))
4. By August 2025, 37.4% of U.S. workers reported using generative AI at work, 5.7% of work hours were AI-assisted, and self-reported time savings implied up to a 1.3% increase in labor productivity since ChatGPT's release. ([St. Louis Fed 2025](https://www.stlouisfed.org/on-the-economy/2025/nov/state-generative-ai-adoption-2025))
5. Social returns to innovation are typically several times larger than private returns; a reasonable all-things-considered benchmark is that a fully additional dollar of productive R&D creates roughly **\$12** of ordinary social value, with a plausible range of **\$6-25**. ([Coefficient Giving](https://coefficientgiving.org/research/social-returns-to-productivity-growth/), [Jones and Summers 2020](https://www.nber.org/system/files/working_papers/w27863/w27863.pdf))
6. One WELLBY is worth roughly £13,000, and about 6 WELLBYs is a reasonable conversion for 1 QALY, implying a money-metric value of roughly \$90,000-120,000 per QALY in rich-country settings. We use **\$100,000/QALY** as the central conversion. ([HM Treasury](https://www.gov.uk/government/publications/green-book-supplementary-guidance-wellbeing), [Frijters and Krekel 2021](https://eprints.lse.ac.uk/114605/1/Frijters_PR3.pdf))
7. AI is already heavily commercialized: global corporate AI investment reached \$252.3 billion in 2024, and private investment in generative AI alone reached \$33.9 billion. ([Stanford AI Index 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report/economy))
8. OpenAI's Stargate project alone intends to invest \$500 billion in AI infrastructure over four years. ([OpenAI 2025](https://openai.com/index/announcing-the-stargate-project/))
9. We therefore infer that only a modest share of a philanthropic dollar here creates additional ordinary welfare that would not have happened anyway: roughly 8% centrally, with a plausible range of 2-25%. This is an inference from the funding landscape, not a directly measured quantity.

### Details

#### Cost per QALY

A two-step model drives the **\$104,000/QALY** point estimate: each fully additional dollar of AI capability work generates about **\$12 of ordinary social value** (range \$6-25), but only about **8% of a philanthropic dollar here is additional** (Assumption 9), so each donated dollar produces only about **\$0.96** of ordinary social value (\$12 × 8%). At a \$100,000/QALY benchmark, that is about **\$104,000/QALY**.

:::details{title="The two steps: social value per dollar, and additionality"}
**Step 1 — ordinary social value from fully additional AI capability work.** AI looks like a real general-purpose technology, not hype with zero substance: McKinsey, Penn Wharton, the St. Louis Fed, and field experiments all point to meaningful productivity and welfare gains. The **\$12** central estimate (range **\$6-25**) sits somewhat above Jones-Summers style central estimates for general R&D, because AI has unusually low marginal replication costs and unusually broad applicability, but well below more optimistic technology-specific estimates.

**Step 2 — additionality.** Most capability work would happen anyway: private capital is enormous, frontier compute buildout is proceeding at extraordinary speed, and many apparently philanthropic dollars here mostly reshuffle who does the work rather than how much capability progress happens. As a stylized anchor, if capabilities-relevant philanthropy is only a few hundred million dollars per year while corporate AI investment already exceeds \$250 billion per year, the philanthropic funding share is well below 1%; even if philanthropic dollars are several times more additional than average because they target neglected niches, that still points to single-digit-percentage ordinary additionality, so we use **8%**.

Converting the resulting **\$0.96** of ordinary social value per donated dollar at the \$100,000/QALY benchmark:

$$\text{Cost per QALY} \approx \dfrac{\$100{,}000}{0.96} \approx \$104{,}000$$
:::

This number does not fully net out every ordinary downside. Some measured economic gains are rents, convenience, or producer surplus rather than clean welfare, and AI also creates downsides we do not separately model (job displacement, misinformation, surveillance, concentration of power) — reasons the ordinary upside may be somewhat overstated, though we do not adjust the point estimate without quantifying the adjustment. Conversely, the \$100,000/QALY conversion is mainly a rich-country benchmark, so to the extent AI capability gains substantially improve lower-income lives the true cost per QALY would be somewhat lower.

The plausible range (**\$40,000–\$800,000/QALY**) is deliberately asymmetric. The two main inputs — social value per additional dollar (\$6–25) and ordinary additionality (2–25%) — are roughly independent, so their unfavorable extremes rarely coincide; but we run the expensive end out to about \$800,000 (the low-value, low-additionality combination) rather than pulling it in, because the unmodeled downsides above are one-directional — they make the true cost per QALY higher, not lower. The cheap end (\$40,000) stays closer to the central figure than the favorable combination of the inputs alone would suggest, for the same reason: the corrections that would make this intervention look unusually good are weaker and fewer than the ones that would make it look worse.

#### Start time

We use a 3-year start time because AI deployment is already happening, but philanthropic funding still usually needs time to turn into tools, products, model releases, adoption, and diffusion.

#### Duration

We use a 20-year duration because these ordinary gains plausibly persist for quite a while, but after a couple of decades the analysis is dominated less by mundane productivity effects and more by transformative-AI scenarios.

---

## Effect 2: standard-utopia

This effect captures the value of bringing forward a **genuinely very good** transformative-AI world: one where disease burden, extreme poverty, and a large fraction of drudgery are reduced much earlier than they otherwise would have been.

Importantly, this is **not** the probability that advanced AI is merely "on balance good." It is the probability that capability acceleration causes an earlier world that is so much better than the baseline that it is reasonable to model the gap as a large QALY gain.

### Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$33,000 (\$10,000–\$1,000,000)
- **Start time:** 10 years
- **Duration:** 5 years

_If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values._

### Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. AGI — machines that can do any mental task better and more cheaply than humans — most likely arrives around 2036 (the broader physical-task HLMI bar is later). The 2023 AI Impacts survey put a 50% chance on HLMI by 2047, but that survey is dated and more recent aggregates are substantially shorter. ([Grace et al. 2024](https://aiimpacts.org/wp-content/uploads/2023/04/Thousands_of_AI_authors_on_the_future_of_AI.pdf), [timelines to AGI](/assumption/timelines-to-agi))
2. We use a baseline of about **10 years to transformative AI** (mid-2030s, ≈ the AGI date above), consistent with the [timelines estimate](/assumption/timelines-to-agi). The cumulative-spending denominator below is kept at \$5 trillion: the shorter horizon is offset by a higher average annual frontier-spend rate, reflecting the current capex ramp.
3. Total cumulative frontier or near-frontier AI spending before transformative AI is reached is roughly **\$5 trillion** centrally. ([See detailed justification](/assumption/cumulative-frontier-ai-spending-before-transformative-ai))
4. A marginal philanthropic dollar in this cause is best modeled as about **30 cents of frontier-equivalent capability acceleration**, after accounting for crowd-out and the fact that some funded work is not direct frontier training. ([See detailed justification](/assumption/frontier-equivalent-share-of-ai-capabilities-philanthropy))
5. Grace et al. (2024) report that respondents assigned about **10%** median probability and about **23%** mean probability to "extremely good" outcomes from HLMI. Because this effect is meant to capture only very good futures, we use **10%** as the central probability, with a rough plausible range of **3%-25%**. ([Grace et al. 2024](https://aiimpacts.org/wp-content/uploads/2023/04/Thousands_of_AI_authors_on_the_future_of_AI.pdf))
6. In a genuinely very good transformative-AI world, welfare might improve by roughly **500 million QALYs per year** relative to baseline, with a rough plausible range of **100 million-2 billion QALYs per year**. The central figure corresponds to about 0.05 extra QALYs per year for 10 billion people. That is smaller than today's gap between rich-country and poor-country life conditions for much of the world, and it still leaves room for major improvements in health, poverty, and drudgery reduction rather than assuming literal utopia. ([WHO](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy), [World Bank 2024](https://www.worldbank.org/en/publication/poverty-prosperity-and-planet), [Our World in Data](https://ourworldindata.org/working-hours))

### Details

#### Cost per QALY

The **\$33,000/QALY** point estimate comes from a timing model: a donation buys a tiny fraction of frontier acceleration ($a_{\text{frontier}}/S_{\text{total}}$), which brings forward a very good world (probability $p_{\text{good}}$) worth $\Delta Q_{\text{year}}$ extra QALYs per year for the $T$ years it arrives early. With the central assumptions this is about $3 \times 10^{-5}$ QALYs per dollar, i.e. roughly **\$33,000/QALY**.

:::details{title="The timing-model formula and parameter substitution"}

$$
\text{QALYs per \$} \approx p_{\text{good}} \times \dfrac{a_{\text{frontier}}}{S_{\text{total}}} \times T \times \Delta Q_{\text{year}}
$$

Where $p_{\text{good}}$ is the probability of a genuinely very good outcome (Assumption 5), $a_{\text{frontier}}$ the frontier-equivalent acceleration per donated dollar (Assumption 4), $S_{\text{total}}$ cumulative frontier spending before transformative AI (Assumption 3), $T$ the years until transformative AI (Assumption 2), and $\Delta Q_{\text{year}}$ the annual QALY gain in the very good world relative to baseline (Assumption 6).

Using $p_{\text{good}} = 0.10$, $a_{\text{frontier}} = 0.30$, $S_{\text{total}} = 5 \times 10^{12}$, $T = 10$, and $\Delta Q_{\text{year}} = 5 \times 10^{8}$:

$$
\text{QALYs per \$} \approx 0.10 \times \dfrac{0.30}{5 \times 10^{12}} \times 10 \times 5 \times 10^{8}
\approx 3 \times 10^{-5}
$$

$$
\text{Cost per QALY} \approx \dfrac{1}{3 \times 10^{-5}} \approx \$33{,}300
$$

:::

This number is **very sensitive** to worldview assumptions: if very good transformative-AI futures are much less likely or much farther away, this effect shrinks. The effect only captures the upside of earlier very good futures; it does **not** imply the overall cause is good, because the doom effect below is also material. Like the doom effect, it assumes small marginal capability pushes translate roughly linearly into timeline acceleration — imperfect, since real progress may involve thresholds, bottlenecks, and race dynamics, but the cleanest tractable baseline.

The plausible range (**\$10,000–\$1,000,000/QALY**) is wide and skewed toward the expensive (weak-effect) end. It is _narrower_ than what pushing all five terms to one edge at once would give, because some of the terms — the frontier-equivalent share, the spending denominator, and the timeline — are roughly independent, so they rarely all land at their favorable (or unfavorable) extreme together. But the weak-effect end still runs far out, because the largest uncertainties — whether very good futures are at all likely, how big the welfare gain would be, and whether a marginal dollar accelerates the timeline at all — are worldview judgments that move together, and the possibility that this effect is essentially negligible lives _outside_ any tidy combination of the parameters.

:::details{title="What the bounds represent"}
The point estimate multiplies five uncertain terms. Each carries a rough plausible range: the frontier-equivalent share (0.12–0.55), the spending denominator (\$2–20 trillion), the years to transformative AI (roughly 4–24), the very-good-future probability (3%-25%), and the annual welfare gain (100 million-2 billion QALYs). Pushing all five to their favorable edges together implies a cost of a few hundred dollars per QALY; pushing all five to their unfavorable edges implies well over \$10 million/QALY. That all-edges span is much wider than the published plausible range because several inputs would need to land at the same edge together.

- **\$10,000** is a coherently optimistic bundle: very good futures are somewhat more likely than the 10% central figure, acceleration is toward the high end, and the timeline is long enough for the early-arrival window to compound — but not every term at its limit.
- **\$1,000,000** carries the genuinely skeptical worldview, in which very good futures are rare, the annual gain is modest, and small capability pushes barely move the timeline. We run this end well beyond the roughly independent combination of the parameter ranges, because a correlated skeptical worldview and the chance that the linear-acceleration model simply does not hold both push this effect toward negligible — a tail the parameters alone understate.
  :::

#### Start time

We use a 10-year start time because the point of this effect is not today's copilots or narrow models. It is earlier arrival of genuinely transformative systems, which our [timelines estimate](/assumption/timelines-to-agi) places in the mid-2030s rather than the next few years.

#### Duration

We use a 5-year duration because this effect is about the window between "AI arrived earlier" and "AI would have arrived anyway." If the true acceleration is larger or smaller, users should adjust this themselves.

---

## Effect 3: population-doom

This effect captures the harm from AI capability work slightly increasing the probability of AI-caused human extinction.

It intentionally models literal extinction rather than every severe AI catastrophe. That keeps this category from double-counting the broader non-extinction catastrophe channels modeled under [AI Existential Risk](/cause/ai-risk), but it also means the AI-capabilities page is probably too favorable if capability acceleration materially raises the risk of irreversible disempowerment, lock-in, or other non-extinction catastrophes.

Note: The QALY improvement per year is **-0.9** (negative), indicating this is a harmful effect.

### Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per microprobability (increase):** \$167 million (\$25 million–\$5 billion)
- **Population fraction affected:** 1.0
- **QALY improvement per affected person per year:** -0.9
- **Start time:** 10 years
- **Duration:** Defined by the global time limit parameter (default is 100 years)

_If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values._

### Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. The baseline probability of AI-caused extinction this century is about **10%**. ([See detailed justification](/assumption/ai-doom-probability))
2. Total cumulative frontier or near-frontier AI spending before transformative AI is roughly **\$5 trillion**. ([See detailed justification](/assumption/cumulative-frontier-ai-spending-before-transformative-ai))
3. A marginal philanthropic dollar in this cause is best modeled as about **30 cents of frontier-equivalent capability acceleration**. ([See detailed justification](/assumption/frontier-equivalent-share-of-ai-capabilities-philanthropy))
4. As a first-pass model, small marginal accelerations of frontier capability progress increase extinction risk roughly in proportion to how much they speed up the race. This linearity assumption is obviously imperfect, but it is the cleanest tractable baseline.
5. Average human quality of life is roughly **0.9 QALYs per year**. ([WHO](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy), [Our World in Data](https://ourworldindata.org/life-expectancy))

### Details

#### Cost per microprobability

The same frontier-acceleration model as Effect 2, applied to extinction risk, gives a marginal dollar about $6.0 \times 10^{-15}$ of extra doom probability — roughly **0.006 microprobabilities per \$1 million**, or **\$167 million per +1 microprobability**. This is strongly negative on any worldview that gives substantial weight to future generations.

:::details{title="The acceleration formula and parameter substitution"}

$$
\Delta p_{\text{doom}} / \$ \approx p_{\text{doom}} \times \dfrac{a_{\text{frontier}}}{S_{\text{total}}}
$$

Using $p_{\text{doom}} = 0.10$ (Assumption 1), $a_{\text{frontier}} = 0.30$ (Assumption 3), and $S_{\text{total}} = 5 \times 10^{12}$ (Assumption 2):

$$
\Delta p_{\text{doom}} / \$ \approx 0.10 \times \dfrac{0.30}{5 \times 10^{12}} \approx 6.0 \times 10^{-15}
$$

:::

The plausible range (**\$25 million–\$5 billion per microprobability**) is wide and skewed toward the cheap (strong-harm) end being closer in than the expensive (weak-harm) end. The three inputs are roughly independent, so they rarely all reach their unfavorable extremes together; but the weak-harm end runs far out, because the chance that this effect is essentially negligible — markets would have bought the capability anyway, or marginal acceleration barely moves extinction risk — lives _outside_ the parameters and stretches the expensive, weak-harm tail well past what they alone would imply.

:::details{title="What the bounds represent"}
The estimate multiplies the extinction probability (3–30%), the frontier-equivalent share (0.12–0.55), and the spending denominator (\$2–20 trillion). Pushing all three to the strong-harm edge at once (high probability, high acceleration, low denominator) implies about **\$12 million** per microprobability; pushing all three to the weak-harm edge at once implies about **\$5.6 billion**. That all-edges span is wider than the published plausible range, since three roughly independent inputs seldom hit the same extreme together.

- **\$25 million** carries a worried but not extreme worldview — extinction risk and acceleration toward the high end, denominator toward the low end, but not every term at its limit.
- **\$5 billion** is near the weak-harm edge of the parameters, and we publish out to it rather than pulling in, because the structural possibility that frontier acceleration barely changes extinction risk — through crowd-out or through the linear model failing — pushes this effect toward harmless, a tail the parameter ranges understate.
  :::

The population fraction affected is 1.0 because extinction kills everyone.

#### QALY improvement per affected person per year

The value is **-0.9** because this effect is harm, not benefit, and because a lost ordinary human life-year is modeled as about 0.9 QALYs rather than 1.0. Combining the doom probability per dollar with the QALYs at stake, at the central estimate **\$1 million** donated to AI capabilities increases expected losses by roughly $0.006 \times 1{,}200{,}000 \approx 7{,}200$ QALYs. This downside becomes much larger if you extend the time horizon beyond 100 years.

:::details{title="QALYs at stake per microprobability at the default 100-year horizon"}
With the default 100-year time limit and the site's population model (about 8.3 billion people today growing at 1%/year), the effect window runs from year 10 to year 100 — roughly **1,335 billion person-years**. At about 0.9 QALYs per person-year:

- Total QALYs destroyed: **about 1,200 billion**
- QALYs destroyed per microprobability: **about 1,200,000**
  :::

#### Start time

We use a 10-year start time for the same reason as in Effect 2: the relevant risk is not from today's narrow uses alone, but from the period (mid-2030s) when highly capable systems plausibly become strategically decisive.

#### Duration

The very large `windowLength` in the YAML frontmatter is just a ceiling so the calculator can accommodate long horizons; in practice the effect is clamped by the user's chosen global time-limit parameter.

The duration is controlled by the global time limit parameter. Extinction has especially large long-run consequences, so users with longtermist views will see much larger harms than users who count only currently alive people or the next few generations.

---

## Worked example at default settings

At the default 100-year time horizon and default 0% discount rate, the central estimates imply the following rough magnitudes per **\$1 million donated**:

- **standard-mundane:** about **9.6 QALYs gained** (\$1,000,000 / \$104,000)
- **standard-utopia:** about **30.3 QALYs gained** (\$1,000,000 / \$33,000)
- **population-doom:** about **7,200 QALYs destroyed** (0.006 microprobabilities times about 1,200,000 QALYs per microprobability)

So at the default settings, the net effect is roughly:

$$
9.6 + 30.3 - 7{,}200 \approx -7{,}160 \text{ QALYs}
$$

At ordinary time horizons the existential-risk downside dominates the positive terms unless the underlying worldview assumptions change substantially.

---

## Key uncertainties

These numbers are rough order-of-magnitude judgments. The biggest uncertainties are:

1. **How frontier-direct the marginal recipient is.** A dollar to a frontier lab, an open-model effort, and a public-interest AI institute do not have the same effect.
2. **How much capability acceleration markets would already have bought.** This is the central reason the ordinary-benefit estimate is weaker than it first appears.
3. **Whether transformative-AI acceleration is mostly good or mostly bad.** The upside and downside terms both depend heavily on worldview assumptions, and the upside and downside terms are partly correlated rather than fully independent.
4. **Whether marginal risk scales linearly.** Real systems may have thresholds, bottlenecks, or race dynamics that make the doom effect either much smaller or much larger than this simple model.
5. **Bad but non-extinction outcomes.** We do not separately model scenarios like authoritarian lock-in, severe inequality, AI-enabled bioweapons, or large nonhuman-animal effects. On balance, omitting these probably makes the category look somewhat too positive.

{{CONTRIBUTION_NOTE}}

# Internal Notes
