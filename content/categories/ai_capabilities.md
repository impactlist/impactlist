---
id: ai-capabilities
name: 'AGI Development'
effects:
  - effectId: standard
    startTime: 2
    windowLength: 30
    costPerQALY: 80_000
  - effectId: population-doom
    startTime: 10
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 50_000_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: -1.0
---

# Justification of cost per life

_The following analysis was done on November 15th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

This category covers **philanthropic funding for AI capabilities**—projects that make AI systems more capable, available, and widely deployed, without being primarily focused on safety or alignment. We model two distinct effects:

1. A **positive “Science & Technology–style” effect**, where better AI yields higher productivity, new tools, and broadly higher wellbeing. For this, we estimate a **cost per QALY**.
2. A **negative “population-level risk” effect**, where accelerating AI capabilities slightly **increases the chance of existential catastrophe from misaligned AI**, the same “AI doom” event modeled in the AI Existential Risk category. For this, we estimate a **cost per microprobability** (a 1-in-1,000,000 change in the chance of extinction).

The overall sign of the cause area depends on how these two components trade off. Here we keep them separate so that readers can apply their own values and risk assumptions.

---

## Part 1 – Positive effect: AI capabilities as a driver of wellbeing

### Headline estimates (benefit effect)

- **Cost per QALY (point estimate):**  
  **\$80,000 per QALY**

- **Plausible range:**  
  **\$25,000–\$400,000 per QALY**

As with other categories, the implied **cost per life** is this figure multiplied by 80 QALYs per life.

---

### Why AI capabilities can generate large QALY gains

Artificial intelligence is widely treated as a **general-purpose technology** — comparable to electrification or the internet in its potential breadth of impact. Macroeconomic and microeconomic studies suggest that:

- Generative AI could add **\$2.6–\$4.4 trillion per year** in economic value across a wide range of use cases, according to McKinsey’s 2023 report on the [economic potential of generative AI](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier). This would increase the impact of AI overall by **15–40%**.
- The Penn Wharton Budget Model estimates that AI will raise productivity and GDP by **1.5% by 2035, nearly 3% by 2055, and 3.7% by 2075**, with a permanent boost to annual productivity growth (though modest in percentage terms) over the long run ([PWBM 2025 briefing](https://budgetmodel.wharton.upenn.edu/issues/2025/9/8/projected-impact-of-generative-ai-on-future-productivity-growth)).
- At the firm level, randomized trials show substantial productivity gains for workers using generative AI tools. For example, a large study of 5,172 customer-support agents found that access to a generative AI assistant increased productivity by **14% on average**, and more than **30% for the least experienced workers** ([“Generative AI at Work”](https://academic.oup.com/qje/article/140/2/889/7990658)).
- Broader reviews (e.g. the OECD’s [“Impact of AI on productivity, distribution and growth”](https://www.oecd.org/en/publications/the-impact-of-artificial-intelligence-on-productivity-distribution-and-growth_8d900037-en.html)) emphasise AI’s potential to revive productivity growth and generate large welfare gains, while noting substantial uncertainty.

These gains are **not just health improvements**. They include:

- Better tools for work and creativity.
- Time savings and reduced drudgery.
- Improved information access and decision support.
- Higher-quality goods and services at lower cost.

All of these can be translated into QALYs via wellbeing-based frameworks (e.g. WELLBYs) that value “above-normal” life satisfaction, not just relief from illness or extreme poverty.

---

### From economic gains to QALYs

Our Science & Technology category uses a three-step framework:

1. **Social returns to R&D:**  
   Open Philanthropy’s report on [social returns to productivity growth](https://www.openphilanthropy.org/research/social-returns-to-productivity-growth/) concludes that marginal R&D spending has very high social returns but is usually worse than their top global health and poverty opportunities. A central estimate is that **\$1 of R&D yields roughly \$5–\$13** in present-value social benefits, with Open Philanthropy’s own modeling putting marginal R&D at about **45×** the value of direct cash transfers, but only **~4% as good** as their best global health bar.

2. **Converting money to QALYs:**  
   UK and international wellbeing work (e.g. HM Treasury’s [wellbeing supplement to the Green Book](https://www.gov.uk/government/publications/green-book-supplementary-guidance-wellbeing) and the What Works Centre’s [WELLBY guidance](https://whatworkswellbeing.org/blog/converting-the-wellby/)) suggests that:

   - One **WELLBY** (a +1 change in life satisfaction on a 0–10 scale for one person for one year) is worth about **£13,000** (≈ \$16,000).
   - Roughly **6 WELLBYs ≈ 1 QALY** in wellbeing terms (a year in full health typically raises life satisfaction by about 6 points).

   Together, these point to a **high-income benchmark of roughly \$90,000–\$120,000 per QALY** in money-metric terms, consistent with cost-effectiveness thresholds used by NICE and ICER.

3. **Adjusting for additionality and downside risks:**  
   For generic S&T, we assume **only part of philanthropic R&D is truly additional** (because governments and companies already fund much of it) and that some projects have negative externalities. The Science & Technology category therefore ended up with a central **\$60,000 per QALY**, with a **\$20,000–\$250,000** range.

For AI capabilities specifically, there are two countervailing factors:

- **Potentially higher social returns per dollar** than generic R&D, because AI is a general-purpose technology with especially large upside:

  - Several forecasters suggest that AI could add **1–4% to global GDP** over coming decades ([IMF blog](https://www.imf.org/en/blogs/articles/2024/01/14/ai-will-transform-the-global-economy-lets-make-sure-it-benefits-humanity), [McKinsey](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier), [PwC](https://www.pwc.com/gx/en/issues/analytics/assets/pwc-ai-analysis-sizing-the-prize-report.pdf)), which is huge in absolute terms.
  - AI tools already show large micro-level productivity gains, especially for less experienced workers, suggesting big wellbeing improvements for many people if deployed well ([Brynjolfsson et al.](https://academic.oup.com/qje/article/140/2/889/7990658); [Brookings “Machines of mind”](https://www.brookings.edu/articles/machines-of-mind-the-case-for-an-ai-powered-productivity-boom/)).

- **Much lower philanthropic additionality per dollar** than in generic R&D, because AI capabilities are **already being massively funded by the private sector and governments**:
  - The 2025 Stanford AI Index reports that **global corporate AI investment reached \$252.3 billion in 2024**, more than thirteen times higher than in 2014 ([AI Index 2025, economy chapter](https://hai.stanford.edu/ai-index/2025-ai-index-report/economy)).
  - Global AI market size was around **\$279 billion in 2024** and is projected to exceed **\$3.4 trillion by 2033**, growing at over 30% annually ([Grand View Research](https://www.grandviewresearch.com/industry-analysis/artificial-intelligence-ai-market)).
  - Citigroup now forecasts that big tech companies alone will spend **\$2.8 trillion on AI infrastructure by 2029** ([Reuters summary](https://www.reuters.com/world/china/citigroup-forecasts-big-techs-ai-spending-cross-28-trillion-by-2029-2025-09-30/)).

By contrast, philanthropic initiatives focused on AI capabilities, while growing, are tiny in comparison:

- The 2025 Humanity AI initiative is a **\$500 million** five-year fund to “build a people-centered future for AI” ([MacArthur Foundation](https://www.macfound.org/press/press-releases/humanity-ai-commits-500-million-to-build-a-people-centered-future-for-ai)).
- A recent coalition led by major philanthropies pledged **\$1 billion over 15 years** for AI tools to support frontline workers ([AP coverage](https://apnews.com/article/5c84fa707ba8275a7afb2bc5245c286d)).
- These sums are meaningful, but still **well under 1%** of annual corporate AI investment.

This suggests that **each additional philanthropic dollar has relatively low marginal additionality on AI capabilities**, because most of the big breakthroughs and deployment would likely happen anyway, driven by profit and government motives.

---

### A stylised BOTEC for AI capabilities

We can mirror the Science & Technology calculation, but with parameters tailored to AI:

1. **Raw social return from AI R&D**  
   Suppose that **\$1 of frontier AI capabilities R&D** yields about **\$10** in present-value global consumption-equivalent benefits (slightly higher than the \$5–\$13 range Open Phil uses for generic R&D, to reflect AI’s general-purpose nature).

   - **Central assumption:** \$10 per \$1 donated.
   - **Range:** \$5–\$30, to cover more pessimistic estimates like Daron Acemoglu’s relatively modest projections for AI-driven productivity gains ([MIT Sloan summary](https://mitsloan.mit.edu/ideas-made-to-matter/a-new-look-economics-ai)) and more optimistic scenarios like McKinsey’s trillions-per-year forecasts.

2. **Philanthropic additionality**  
   Because corporate and government investment is so large, we assume that each philanthropic dollar **only increases total AI capabilities R&D by a small fraction**:

   - Some grants truly fund work that wouldn’t exist otherwise (e.g. non-profit AI for public-good applications).
   - Others displace or crowd out corporate or public spending, or slightly change priorities rather than overall effort.

   As a central estimate:

   - **Additionality:** 10% (each \$1 donated effectively adds \$0.10 of net new AI capabilities R&D beyond what would have happened anyway).
   - **Range:** 5–30%, covering more pessimistic “almost all crowded out” views and more optimistic “philanthropy focuses on neglected directions” views.

   Under these central numbers, the **effective consumption-equivalent benefit per donated dollar** is:

   $$
   E_{\text{AI}} \approx 10 \times 0.1 = 1.
   $$

   That is, each philanthropic dollar produces about **\$1 of net extra consumption-equivalent welfare**, after adjusting for crowd-out.

3. **Converting consumption to QALYs**  
   Using the same **\$100,000 per QALY** benchmark as in Science & Technology (from the WELLBY/QALY work), the implied **cost per QALY** is roughly:

   $$
   \text{cost per QALY} \approx \frac{\$100{,}000}{E_{\text{AI}}}
   = \frac{\$100{,}000}{1}
   = \$100{,}000.
   $$

4. **Adjustments and range**  
   We then adjust this central figure to reflect:

   - The possibility that AI capabilities are **somewhat more socially valuable** than average R&D (e.g. R&D returns at the high end of \$30 per \$1, additionality at 30%), which would push costs down toward **\$25,000 per QALY**.
   - The possibility that AI capabilities are **less additional and more concentrated** in benefits than assumed (e.g. returns at \$5 per \$1 and additionality at 5%), which would push costs up to **\$400,000 per QALY** or more.
   - Residual negative externalities other than existential risk (e.g. job displacement, surveillance), which we do **not** explicitly model here but which would further reduce net benefits.

Putting this together:

- **Central estimate:** \$80,000 per QALY (a small discount from the raw \$100k to reflect the view that AI may be somewhat more powerful than average R&D and that philanthropic projects can steer AI toward more socially valuable applications).
- **Range:** \$25,000–\$400,000 per QALY, spanning optimistic “AI for global public goods” and pessimistic “heavily crowded out, mostly benefiting already-rich people” scenarios.

Even ignoring existential risk, this makes AI capabilities **less attractive than the very best global health or anti-poverty charities (at \$90/QALY)**, but still potentially competitive with many rich-country health and social programmes.

---

## Part 2 – Negative effect: AI capabilities increasing existential risk

### Headline parameters (risk effect)

Here we treat AI capabilities funding as **increasing the probability of the same AI doom event** that AI Existential Risk charities try to prevent: advanced AGI/ASI causing the extinction of humanity.

We adopt the same event definition and per-event QALY loss as in the AI Existential Risk category, but with a different cost per microprobability because:

- AI capabilities research is **heavily funded already** (corporate and government).
- AI safety research is comparatively **neglected** (tens or hundreds of millions per year).

**Event definition:**  
Creation of advanced AGI/ASI that ultimately destroys all human life on Earth (“AI doom”).

**Parameters (same event as AI Existential Risk):**

- **Fraction of world population affected ($f_{\text{aff}}$):**

  - 1.0 (everyone alive at the time dies).

- **Average QALY improvement per affected person per year if doom is averted ($q_{\text{imp}}$):**

  - 0.9 (people would otherwise have lived near-normal future lives).

- **Duration of effect ($D$):**

  - 40 years (average remaining lifespan lost per person).

- **World population at time of catastrophe ($N_{\text{world}}$):**
  - 10 billion (roughly the UN medium projection peak).

The implied QALY loss if doom occurs is:

$$
Q_{\text{event}} \approx f_{\text{aff}} \times N_{\text{world}} \times q_{\text{imp}} \times D
= 1.0 \times 10^{10} \times 0.9 \times 40 \approx 3.6 \times 10^{11}
$$

QALYs (about **360 billion QALYs**). A **microprobability change** in this event therefore corresponds to:

$$
Q_{\text{micro}} \approx Q_{\text{event}} \times 10^{-6}
\approx 3.6 \times 10^{5}
$$

**expected QALYs** (about 360,000 QALYs).

The difference from AI Existential Risk charities lies in how much a **marginal dollar of AI capabilities funding** changes the probability of this event.

---

### Cost per microprobability (risk effect)

We frame this as:

> If the world is on a trajectory that spends many trillions of dollars on AI capabilities over the next decades and faces a 10% chance of AI doom this century, how much does **one extra dollar** of AI capabilities funding contribute to that risk?

#### Step 1: How much AI capabilities spending will there be?

We approximate the **total global spending on AI capabilities** (private, public, and academic) over the run-up to transformative AI:

- The 2025 Stanford AI Index reports **\$252.3 billion** in global corporate AI investment in 2024 alone ([AI Index 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report/economy)).
- Citigroup forecasts **\$2.8 trillion** in AI-related infrastructure spending by big tech companies by 2029 ([Reuters summary](https://www.reuters.com/world/china/citigroup-forecasts-big-techs-ai-spending-cross-28-trillion-by-2029-2025-09-30/)).
- The global AI market (software, services, and hardware) was about **\$279 billion in 2024** and is projected to exceed **\$3.4 trillion by 2033** ([Grand View Research](https://www.grandviewresearch.com/industry-analysis/artificial-intelligence-ai-market)).
- Forecasts suggest AI investment will remain **a substantial share of global R&D and capital expenditure** well beyond 2030.

A central, round-number assumption is:

- **Total cumulative AI capabilities spending to the point where existential risk from AI is mostly resolved or realized:** about **\$10 trillion**, with a plausible range of **\$5–\$30 trillion**.

#### Step 2: Relating total spending to total risk

Following the AI Existential Risk justification, we take:

- **Total probability of AI-caused extinction this century:** about **10%**, echoing Toby Ord’s best guess in _The Precipice_ and consistent with expert surveys that place probabilities in the single-digit to double-digit percent range ([Ord’s summary](https://www.tobyord.com/writing/the-precipice-revisited); [AI Impacts 2022 survey](https://aiimpacts.org/2022-expert-survey-on-progress-in-ai/); [“Thousands of AI Authors on the Future of AI”](https://arxiv.org/abs/2401.02843)).

If we assume, very crudely, that **most of this risk scales with the overall intensity of AI capabilities investment**, then near the current trajectory the **marginal risk per dollar** of AI capabilities spending is roughly:

$$
\frac{dP}{dS} \approx \frac{P_{\text{doom}}}{S_{\text{total}}}.
$$

With:

- $P_{\text{doom}} = 0.1$ (10%),
- $S_{\text{total}} = 10^{13}$ (i.e. \$10 trillion),

we get:

$$
\frac{dP}{dS} \approx \frac{0.1}{10^{13}} = 10^{-14}\ \text{per dollar}.
$$

For **\$1 million** of _average_ AI capabilities spending:

$$
\Delta P_{\text{avg}} \approx 10^{-14} \times 10^{6} = 10^{-8}.
$$

Expressed in microprobabilities (where 1 microprobability = $10^{-6}$):

$$
\text{microprobs per \$1M (average)} \approx \frac{10^{-8}}{10^{-6}} = 0.01.
$$

So \$1 million of average AI capabilities spending might increase the chance of AI doom by about **0.01 microprobabilities**.

#### Step 3: Philanthropic AI capabilities vs average AI spending

Philanthropic AI capabilities funding is likely **more targeted** than average spending:

- Corporate AI budgets include many low-risk, low-impact projects (e.g. internal analytics, small features).
- Philanthropic AI capabilities grants may focus disproportionately on **frontier models, open-source foundational models, high-risk but high-reward research**, or capacity-building for ambitious AI labs.

To represent this, we introduce a **leverage factor $L$**:

- $L > 1$ means that a philanthropic dollar has more effect on existential risk per dollar than the average AI capabilities dollar.
- As a central guess, we take **$L = 3$**: philanthropic dollars are about **three times as “risk-intense”** as average AI dollars, and consider a wide range **$L = 0.5–5$** to reflect uncertainty.

Under this assumption:

$$
\Delta P_{\text{phil}} \approx L \times \Delta P_{\text{avg}}.
$$

For \$1 million of philanthropic AI capabilities funding:

- **Central case ($L=3$):**

  $$
  \Delta P_{\text{phil}} \approx 3 \times 10^{-8} \Rightarrow
  \text{microprobs per \$1M} \approx \frac{3 \times 10^{-8}}{10^{-6}} = 0.03.
  $$

- **Range:** roughly **0.005–0.2 microprobabilities per \$1M**, depending on $P_{\text{doom}}$, $S_{\text{total}}$, and $L$.

#### Step 4: Implied “cost per microprobability” (increase)

If \$1 million of philanthropic AI capabilities spending **increases** AI extinction risk by 0.03 microprobabilities, then:

- To increase risk by **one full microprobability**, we would need roughly:

  $$
  \frac{1\ \text{microprob}}{0.03\ \text{microprob per \$1M}} \approx \$33\ \text{million}.
  $$

This is the **harmful analogue** to the AI Existential Risk category’s **\$2 million per microprobability of risk reduction**: the same order of risk change, but in the opposite direction and with much less leverage per dollar because AI capabilities is far less neglected.

Taking into account parameter uncertainty, we arrive at:

- **Point estimate:** **\$50 million per microprobability (increase)**  
  (i.e., every additional \$50M of philanthropic AI capabilities funding increases AI doom risk by 1 in 1,000,000.)
- **80% range:** **\$5 million–\$200 million per microprobability (increase)**

In expected QALY terms, using $Q_{\text{micro}} \approx 360{,}000$ QALYs per microprobability:

- The **central case** implies that **\$1 million** of philanthropic AI capabilities funding increases expected QALY loss by about:

  $$
  0.02\ \text{microprobs per \$1M} \times 360{,}000\ \text{QALYs per microprob}
  \approx 7{,}200\ \text{QALYs lost per \$1M},
  $$

  or roughly **\$140 of philanthropic spending per expected QALY lost**, purely via existential-risk externalities.

This harmful effect is **not** counted in the “\$80,000 per QALY” benefit estimate; it is a separate component.

---

### Timing parameters for the risk effect

To align with the AI Existential Risk category, we set:

- **Start time of the averted (or worsened) event:**

  - Point estimate: **30–40 years from now** (around **2055–2065**), reflecting typical expert timelines to transformative AI as summarised in Open Philanthropy’s work on [transformative AI timelines](https://www.openphilanthropy.org/research/report-on-whether-ai-could-drive-explosive-economic-growth/) and surveys compiled by AI Impacts.

- **Duration of the effect:**
  - **40 years**, matching the AI Existential Risk category’s assumption about the average remaining lifespan lost in an extinction event.

These parameters mainly matter for temporal discounting and consistency across cause areas.

---

## Putting it together

For philanthropic funding that **increases AI capabilities** (without focusing on safety or alignment), this analysis suggests:

1. A **positive “innovation” effect** roughly comparable to, but somewhat worse than, general Science & Technology grants:

   - **\$80,000 per QALY** (range \$25,000–\$400,000) from productivity gains, convenience, and above-baseline quality-of-life improvements.

2. A **negative “existential risk” effect** that is small in probability per dollar but enormous in stakes:
   - Each **\$50 million** of additional philanthropic AI capabilities funding **increases** the chance of AI-driven extinction by about **one microprobability (1 in 1,000,000)** (range \$5–\$200 million).
   - Equivalently, in expectation, around **7,200 QALYs lost per \$1 million donated** in the central case, purely from AI doom risk.

Because the existential risk component scales with **hundreds of thousands of QALYs per microprobability**, even tiny changes in risk can dominate the direct benefits. Under the central values chosen here, the **expected harm from increased extinction risk outweighs the direct benefits** in QALYs, making generic AI capabilities funding look **net negative** relative to alternatives like global health, anti-poverty, or AI safety itself.

However, these results are extremely sensitive to:

- The true probability of AI doom.
- How strongly risk scales with total capabilities spending.
- The degree to which philanthropic AI capabilities funding is more or less “risk-intense” than average.

Donors considering this cause area should therefore think of it as **high variance**: potentially large near-term benefits, but also a meaningful contribution to tail risks that could end humanity.

_Our current cost per life estimates are very approximate and we are looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes

This section contains internal notes that shouldn't be displayed on the website.
