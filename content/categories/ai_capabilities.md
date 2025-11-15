---
id: ai-capabilities
name: 'AGI Development'
effects:
  - effectId: standard-mundane
    startTime: 3
    windowLength: 20
    costPerQALY: 42_000
  - effectId: standard-utopia
    startTime: 15
    windowLength: 5
    costPerQALY: 40_000
  - effectId: population-doom
    startTime: 15
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 50_000_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: -1.0
---

# Justification of cost per life

_The following analysis was done on November 16th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

This category covers **philanthropic funding for AI capabilities**—projects that make AI systems more capable, available, and widely deployed, without being primarily focused on safety or alignment.

We model **three distinct effects**:

1. A **positive “Science & Technology–style” effect**, where better AI yields higher productivity, new tools, and broadly higher wellbeing. For this, we estimate a **cost per QALY**.
2. A **negative “population-level risk” effect**, where accelerating AI capabilities slightly **increases the chance of existential catastrophe from misaligned AI**, the same “AI doom” event modeled in the AI Existential Risk category. For this, we estimate a **cost per microprobability** (a 1-in-1,000,000 change in the chance of extinction).
3. A **positive “earlier good-AGI” effect**, where faster capabilities may **bring forward the arrival of a beneficial AGI/ASI world** (conditional on things going well), giving people extra years of much higher quality of life before we would otherwise have got there. For this, we again use a **cost per QALY**.

These three effects are conceptually separate. The **overall sign** of this cause area depends on how they trade off given your assumptions about AI timelines and the probability of good vs bad outcomes.

---

## Part 1 – Positive effect: AI capabilities as a driver of “mundane” wellbeing

### Headline estimates (mundane benefit effect)

- **Cost per QALY (point estimate):**  
  **\$42,000 per QALY**

- **Plausible range:**  
  **\$15,000–\$250,000 per QALY**

As with other categories, the implied **cost per life** is this figure multiplied by 80 QALYs per life.

---

### Why AI capabilities can generate large QALY gains

Artificial intelligence is widely viewed as a **general-purpose technology**, comparable to electrification or the internet in its potential breadth of impact. Macroeconomic and microeconomic studies suggest that the _average_ AI deployment is already producing substantial gains:

- McKinsey’s 2023 report on the [economic potential of generative AI](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier) estimates that generative AI alone could add **\$2.6–\$4.4 trillion per year** across use cases, increasing the total impact of AI by **15–40%**.
- The Penn Wharton Budget Model projects that AI will raise productivity and GDP by about **1.5% by 2035, nearly 3% by 2055, and 3.7% by 2075**, implying a persistent boost to annual productivity growth ([PWBM 2025 briefing](https://budgetmodel.wharton.upenn.edu/issues/2025/9/8/projected-impact-of-generative-ai-on-future-productivity-growth)).
- At the firm level, randomized trials show large productivity gains from AI tools. A study of 5,172 customer-support agents found that access to a generative AI assistant increased productivity by **14% on average** and more than **30% for the least experienced workers** ([“Generative AI at Work”](https://academic.oup.com/qje/article/140/2/889/7990658)).
- The OECD’s report on [“The impact of artificial intelligence on productivity, distribution and growth”](https://www.oecd.org/en/publications/the-impact-of-artificial-intelligence-on-productivity-distribution-and-growth_8d900037-en.html) emphasises AI’s potential to revive productivity and generate large welfare gains, while noting distributional and governance challenges.

These benefits are **not just medical**. They include:

- Better tools for work and creativity.
- Time savings and reduced drudgery.
- Improved information access and decision support.
- Higher-quality goods and services at lower cost.

All of these can be translated into QALYs by treating them as **above-baseline wellbeing gains**—increases in life satisfaction and life options, not just reductions in disease.

---

### From economic gains to QALYs (revisited)

Our Science & Technology category uses a three-step framework:

1. **Social returns to R&D**  
   Open Philanthropy’s report on [social returns to productivity growth](https://www.openphilanthropy.org/research/social-returns-to-productivity-growth/) concludes that marginal R&D spending has very high social returns but is usually worse than their very best global health and poverty opportunities. Their central estimates suggest that **\$1 of R&D yields roughly \$5–\$13** in present-value social benefits, with marginal R&D at around **4% as good** as their top global health bar.

2. **Converting money to wellbeing and QALYs**  
   UK wellbeing guidance (e.g. HM Treasury’s [wellbeing supplement to the Green Book](https://www.gov.uk/government/publications/green-book-supplementary-guidance-wellbeing) and the What Works Centre’s [WELLBY guidance](https://whatworkswellbeing.org/blog/converting-the-wellby/)) suggests that:

   - One **WELLBY** (a +1 change on a 0–10 life-satisfaction scale for one person for one year) is worth about **£13,000** (≈ \$16,000).
   - Roughly **6 WELLBYs ≈ 1 QALY** in wellbeing terms.

   This implies a money-metric value of around **\$90,000–\$120,000 per QALY** in high-income settings, consistent with health-technology thresholds from NICE and ICER.

3. **Adjusting for additionality and externalities**  
   For generic S&T, we assume:

   - Philanthropy gets credit for only a **fraction of marginal R&D**, because public and private funders would have done some of it anyway.
   - Some projects have negative externalities (e.g. accidents, environmental harms).

   This led to the S&T central estimate of **\$60,000 per QALY** with a **\$20,000–\$250,000** range.

For **AI capabilities**, we revisit two key parameters:

- **Raw social return per dollar of AI R&D**  
  Because AI is a particularly powerful general-purpose technology, it is plausible that the **social return per marginal dollar** is somewhat higher than for generic R&D:

  - Productivity and welfare gains from AI show up quickly and widely, as the firm-level studies above suggest.
  - AI services can be replicated and scaled at near-zero marginal cost, making spillovers especially strong.

  As a central case, we assume:

  - **\$12 of global consumption-equivalent benefit per \$1** of AI capabilities R&D, with a plausible range of **\$6–\$30**.

- **Philanthropic additionality in AI capabilities**  
  At the same time, AI capabilities attract **enormous corporate and government spending**:

  - Global corporate AI investment reached **\$252.3 billion in 2024**, according to the [Stanford AI Index 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report/economy).
  - The global AI market (software, services, hardware) was about **\$279 billion in 2024** and is projected to exceed **\$3.4 trillion by 2033**, growing over 30% annually ([Grand View Research](https://www.grandviewresearch.com/industry-analysis/artificial-intelligence-ai-market)).
  - Citigroup forecasts that big tech companies alone will spend **\$2.8 trillion on AI infrastructure by 2029** ([Reuters](https://www.reuters.com/world/china/citigroup-forecasts-big-techs-ai-spending-cross-28-trillion-by-2029-2025-09-30/)).

  Philanthropic AI capabilities spending, while growing, is tiny by comparison:

  - The Humanity AI initiative is a **\$500 million** five-year fund to support a “people-centered future for AI” ([MacArthur Foundation](https://www.macfound.org/press/press-releases/humanity-ai-commits-500-million-to-build-a-people-centered-future-for-ai)).
  - Other announced funds—for AI tools in education, health, and public-interest applications—are typically in the **hundreds of millions**, not hundreds of billions.

  This suggests that philanthropy has **low but non-zero additionality** in capabilities:

  - Some grants support research or deployment that simply would not be prioritized by profit-driven actors (e.g. AI for low-income countries, open models for under-served languages).
  - Others mostly reshape the direction of an already-large investment stream.

  As a central case, we assume:

  - **Additionality of 15–20%**: each philanthropic dollar effectively adds **\$0.15–\$0.20** of net new AI capabilities R&D.

Putting these together:

- Raw return: \$12 per \$1.
- Additionality: 0.2 (20%).

Then the **effective consumption-equivalent benefit per donated dollar** is:

$$
E_{\text{AI, mundane}} \approx 12 \times 0.2 = 2.4.
$$

Using the \$100,000 per QALY benchmark:

$$
\text{raw cost per QALY} \approx \frac{\$100{,}000}{2.4} \approx \$42{,}000.
$$

We estimate a plausible range of **\$15,000–\$250,000 per QALY**.

---

### Timing parameters (mundane effect)

- **Start time:** We treat most mundane AI benefits from marginal philanthropic capabilities funding as accruing **over the next 5–20 years**, as current systems are developed, deployed, and integrated into workflows.
- **Duration:** A central modeling choice is **20 years**, reflecting a window in which current generations experience most of the incremental productivity and convenience gains before further transformative changes (including AGI) dominate.

These parameters mainly matter for comparing timing across cause areas and for any temporal discounting you may apply.

---

## Part 2 – Negative effect: AI capabilities increasing existential risk

Here we treat AI capabilities funding as **increasing the probability of the same AI doom event** that AI Existential Risk charities try to prevent: advanced AGI/ASI causing the extinction of humanity.

We reuse the event definition and per-event QALY loss from the AI Existential Risk category, but estimate a different cost per microprobability because:

- AI capabilities research is **heavily funded already** by companies and states.
- AI safety research is comparatively **neglected**.

### Headline parameters (risk effect)

**Event definition:**  
Creation of advanced AGI/ASI that ultimately destroys all human life on Earth (“AI doom”).

**Parameters (same as AI Existential Risk):**

- **Fraction of world population affected ($f_{\text{aff}}$):** 1.0 (everyone alive at the time dies).
- **Average QALY improvement per affected person per year if doom is averted ($q_{\text{imp}}$):** 0.9 (people would otherwise have lived near-normal future lives).
- **Duration of effect ($D$):** 40 years (average remaining lifespan lost per person).
- **World population at time of catastrophe ($N_{\text{world}}$):** 10 billion (roughly the UN medium projection peak).

The implied QALY loss if doom occurs is:

$$
Q_{\text{event}} \approx f_{\text{aff}} \times N_{\text{world}} \times q_{\text{imp}} \times D
= 1.0 \times 10^{10} \times 0.9 \times 40 \approx 3.6 \times 10^{11}.
$$

A **microprobability change** (1 in a million) in this event therefore corresponds to:

$$
Q_{\text{micro}} \approx Q_{\text{event}} \times 10^{-6} \approx 3.6 \times 10^{5}
$$

expected QALYs (about 360,000 QALYs).

---

### Cost per microprobability (risk effect)

We ask:

> If the world is on a trajectory that spends many trillions of dollars on AI capabilities over the next decades and faces a 10% chance of AI doom this century, how much does **one extra dollar** of AI capabilities funding contribute to that risk?

#### Step 1: Total AI capabilities spending

We approximate **total global spending on AI capabilities** up to the point where existential risk from AI is largely resolved (either by safe systems or by catastrophe):

- Corporate AI investment was **\$252.3 billion in 2024** ([Stanford AI Index 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report/economy)).
- AI infrastructure spending by big tech alone is forecast to reach **\$2.8 trillion by 2029** ([Reuters](https://www.reuters.com/world/china/citigroup-forecasts-big-techs-ai-spending-cross-28-trillion-by-2029-2025-09-30/)).
- The global AI market is projected to exceed **\$3.4 trillion by 2033** ([Grand View Research](https://www.grandviewresearch.com/industry-analysis/artificial-intelligence-ai-market)).

A central, round-number assumption is:

- **Total cumulative AI capabilities spending:** about **\$10 trillion**, with a plausible range of **\$5–\$30 trillion**.

#### Step 2: Relating total spending to doom risk

Following the AI Existential Risk category, we adopt:

- **Total probability of AI-caused extinction this century:** about **10%**, echoing Toby Ord’s best guess in _The Precipice_ and supported by multiple expert surveys.

If we assume, very crudely, that **doom risk scales with overall capabilities effort** near the current trajectory, then the **marginal risk per dollar** is:

$$
\frac{dP}{dS} \approx \frac{P_{\text{doom}}}{S_{\text{total}}}.
$$

With $P_{\text{doom}} = 0.1$ and $S_{\text{total}} = 10^{13}$ (\$10 trillion):

$$
\frac{dP}{dS} \approx \frac{0.1}{10^{13}} = 10^{-14}\ \text{per dollar}.
$$

For **\$1 million** of _average_ AI capabilities spending:

$$
\Delta P_{\text{avg}} \approx 10^{-14} \times 10^{6} = 10^{-8}
\Rightarrow \text{microprobs per \$1M} \approx 0.01.
$$

So \$1 million of average AI capabilities spending might increase the chance of AI doom by about **0.01 microprobabilities**.

#### Step 3: Philanthropic AI capabilities vs average AI spending

Philanthropic capabilities funding is likely **more concentrated on frontier research** than the average dollar:

- Corporate AI budgets include routine analytics, modest features, and low-risk automation.
- Philanthropic AI capabilities grants may target **frontier models, open-source foundational models, compute access, or high-risk/high-reward research directions**.

Let $L$ be a **leverage factor** comparing risk-impact per philanthropic dollar vs an average AI dollar:

- $L > 1$ means philanthropy is “risk-intense”.
- As a central guess, we take **$L = 3$** and a range **0.5–5** to reflect uncertainty.

Then for **\$1 million** of philanthropic AI capabilities funding:

$$
\Delta P_{\text{phil}} \approx L \times \Delta P_{\text{avg}}.
$$

In the central case:

$$
\Delta P_{\text{phil}} \approx 3 \times 10^{-8}
\Rightarrow \text{microprobs per \$1M} \approx 0.03.
$$

#### Step 4: “Cost per microprobability” (increase)

If \$1 million of philanthropic AI capabilities funding **increases** extinction risk by 0.03 microprobabilities, then:

$$
\text{Dollars per +1 microprobability} \approx
\frac{1}{0.03} \times \$1\ \text{million} \approx \$33\ \text{million}.
$$

Allowing for parameter uncertainty (total spending, $P_{\text{doom}}$, $L$), we round to:

- **Point estimate:** **\$50 million per microprobability (increase)**
- **80% range:** **\$5 million–\$200 million per microprobability (increase)**

In expected QALY terms, using $Q_{\text{micro}} \approx 360{,}000$:

- Central case: **\$1 million** of philanthropic AI capabilities funding increases expected QALY loss by roughly:

  $$
  0.02\ \text{microprobs per \$1M} \times 360{,}000
  \approx 7{,}200\ \text{QALYs lost per \$1M},
  $$

  or about **\$140 of spending per expected QALY lost**, via existential risk alone.

This harmful effect is **not** counted in the “mundane” QALY estimate above or in the timing effect below; it is a separate negative component.

---

### Timing parameters (risk effect)

To stay consistent with AI Existential Risk:

- **Start time of the event:** We model AI doom, if it occurs, as most likely around **30–40 years from now** (mid-2050s to mid-2060s), reflecting typical expert timelines to transformative AI.
- **Duration of effect:** **40 years**, representing the average remaining lifespan that people alive at the time would have lost.

These numbers are primarily for temporal comparison and discounting.

---

## Part 3 – Positive effect: bringing a beneficial AGI world forward

So far we have:

- A **mundane benefit channel** (Part 1): AI makes current and near-future life better.
- A **doom risk channel** (Part 2): AI makes extinction slightly more likely.

Many people also believe that:

> Conditional on us **eventually** succeeding at building beneficial AGI/ASI, bringing that success **forward in time** could be enormously valuable: we might get extra years of dramatically higher wellbeing for billions of people.

We model this as a **third, separate positive effect**.

### Intuition

Under this channel, philanthropic AI capabilities funding:

- **Does not create good AGI from scratch**.
- Instead, **slightly accelerates** the arrival of a scenario that would have happened anyway:
  - A “good AGI world” where:
    - Most diseases are curable.
    - Extreme poverty is eliminated.
    - Work is much less drudgerous.
    - Many people enjoy significantly higher, above-baseline wellbeing.

During the time window where AGI arrives **earlier** than it otherwise would have, the world enjoys a **higher QALY flow per year** than in the baseline. Only that window is counted here; we do not count the indefinite long-run post-AGI future, which is more in the domain of longtermism.

---

### Headline estimates (timing effect)

- **Cost per QALY (point estimate):**  
  **\$40,000 per QALY**

- **Plausible range:**  
  **\$10,000–\$150,000 per QALY**

This is an **additional** benefit channel, separate from mundane improvements and separate from risk.

---

### A stylised timing model

We adopt a simple “expected QALYs per dollar” model:

1. **Baseline AGI arrival:**

   - Suppose AGI (or similarly powerful systems) would arrive in about **35 years**, around **2060**, without the marginal philanthropic funding.

2. **Total AGI-relevant capabilities spending:**

   - As in Part 2, assume **\$10 trillion** in cumulative AI capabilities spending up to AGI (central), with a plausible \$5–\$30 trillion range.

3. **Effect of philanthropy on arrival time:**

   - Let **$a_{\text{cap}}$** be the additionality of philanthropic capabilities funding for _AGI-relevant research_ (net of crowd-out).
   - Suppose each philanthropic dollar effectively adds **\$0.05 of extra AGI-accelerating R&D** (i.e. $a_{\text{cap}} = 5\%$), a conservative assumption given how much AI R&D is already funded by private industry.
   - If total required AGI effort is roughly proportional to cumulative spend, then:  
     A **1% increase** in total AGI R&D might **reduce time to AGI by ~1%**.
   - A marginal donation $d$ implies an **effective share** $d_{\text{eff}} / S_{\text{total}}$ and a **time gain**:

     $$
     \Delta T \approx \frac{d_{\text{eff}}}{S_{\text{total}}} \times T_{\text{horiz}}
     = \frac{a_{\text{cap}} d}{S_{\text{total}}} \times T_{\text{horiz}}.
     $$

   - With the central parameters (e.g. \$10 trillion total, 35 years), a \$10M philanthropic grant might only pull AGI forward by **minutes** or **hours** in expectation. The key is that even tiny shifts in timing applied to billions of people can yield large QALY changes.

4. **Extra QALYs per year in a good AGI world:**

   - Let $Q_{\text{base}}$ be total QALYs per year without AGI:  
     about **9 billion QALYs/year** if 10 billion people live at an average of 0.9 QALYs/year.
   - Let $Q_{\text{post}}$ be QALYs per year in a “good AGI world” within our horizon:
     - For example, average QALY weights might rise to 0.95–1.0 as health improves, extreme poverty vanishes, and work becomes more fulfilling.
   - For a central case:

     $$
     \Delta Q_{\text{year}} = Q_{\text{post}} - Q_{\text{base}} \approx 5 \times 10^{8}\ \text{QALYs/year},
     $$

     i.e. **500 million extra QALYs per year** globally compared to the no-AGI-yet baseline.

5. **Probability that we actually get a good AGI world:**
   - Let $p_{\text{good}}$ be the probability that, when AGI arrives, we get a **non-doom, non-dystopian, high-wellbeing outcome** within our modeling horizon.
   - If one believes, for example:
     - 10% chance of doom,
     - some probability of bad but non-extinction futures,
     - and a substantial probability of genuinely good outcomes,
       then $p_{\text{good}}$ might be around **30–50%**.
   - We use a central **$p_{\text{good}} = 0.3$** for this channel.

Putting this together, the **QALYs per dollar from timing**, in expectation, are approximately:

$$
\text{QALYs per \$} \approx
p_{\text{good}} \times \frac{a_{\text{cap}}}{S_{\text{total}}} \times T_{\text{horiz}} \times \Delta Q_{\text{year}}.
$$

Using central values:

- $p_{\text{good}} = 0.3$
- $a_{\text{cap}} = 0.05$
- $S_{\text{total}} = 10^{13}$ (i.e. \$10 trillion)
- $T_{\text{horiz}} = 35$ years
- $\Delta Q_{\text{year}} = 5 \times 10^{8}$ QALYs/year

we get:

- QALYs per \$ ≈ **2.6 × 10⁻⁵**, i.e. about 0.000026 QALYs per dollar.
- That corresponds to a **raw cost per QALY** of around **\$38,000**.

Given the deep uncertainties (on all parameters) and the risk of double-counting some benefits already included in the “mundane” channel, we round this up and take:

- **Point estimate:** **\$40,000 per QALY** for the timing effect.
- **Range:** **\$10,000–\$150,000 per QALY**, covering more optimistic (higher $\Delta Q_{\text{year}}$ and $p_{\text{good}}$) and more pessimistic (lower additionality, smaller uplift) views.

This is **separate** from:

- The **mundane** pre-AGI productivity and wellbeing gains (Part 1).
- The **risk** of doom (Part 2).

In worlds where AGI turns out well, this channel captures **extra years of “AGI-grade” life** enjoyed by current and near-future generations, brought forward from when they would otherwise have started.

---

### Timing parameters (timing effect)

For the “earlier good-AGI” channel, we use:

- **Start time:** around **2060** (roughly **35 years from now**), representing the baseline AGI arrival date in the absence of the marginal philanthropic funding.
- **Duration:** **10 years** (central), representing a window in which AGI’s transformative benefits are clearly above the baseline and where “being earlier” matters most for people now alive. A plausible range might be **5–20 years**.

The QALY cost-effectiveness figure already folds the tiny expected shift in arrival time into the per-dollar estimate; these timing parameters mainly matter for temporal comparisons and discounting.

---

## Putting the three effects together

For philanthropic funding that **increases AI capabilities** (without focusing on safety or alignment), we now have three conceptually separate channels:

1. **Mundane benefit (normal QALY effect)**

   - **\$42,000 per QALY** (range \$15,000–\$250,000).
   - Gains from higher productivity, better tools, and above-baseline wellbeing over the next couple of decades.

2. **Existential risk (population/microprobability effect)**

   - **\$50 million per microprobability (increase)** (range \$5–\$200 million).
   - Each \$1M of philanthropic AI capabilities spending increases expected QALY loss by ~7,200 QALYs via a tiny increase in the chance of extinction.

3. **Earlier good-AGI (normal QALY effect)**
   - **\$40,000 per QALY** (range \$10,000–\$150,000).
   - Gains from bringing forward a beneficial AGI world by a tiny amount of time, conditional on such a world existing at all.

Depending on how much weight one places on:

- The chance of **doom vs good AGI**, and
- The size of the uplift in a good AGI world,

the third channel can be very important or almost negligible. The framework above lets you keep these moving parts explicit:

- The **mundane effect** reflects AI’s impact if you think of it as “just” a powerful productivity technology.
- The **risk effect** reflects worries that more capabilities make extinction more likely.
- The **timing effect** reflects hopes that faster progress brings forward a much better world for billions of people.

Under many plausible parameter choices, the **risk channel dominates the others in expectation**, making generic AI capabilities funding look **net negative** compared with safer opportunities (global health, poverty alleviation, AI safety). But for people who:

- Assign a high probability to **good AGI** and
- Believe our current AGI trajectory is too slow rather than too fast,

the timing channel can significantly increase the perceived benefits of AI capabilities work.

_Our current cost per life estimates are very approximate and we are looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes

This section contains internal notes that shouldn't be displayed on the website.
