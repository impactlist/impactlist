---
id: effect-of-all-ai-safety-spending
name: 'Effect of all previous AI safety spending'
---

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High) and Claude Opus 4.6 (Max), with prompts from Impact List staff._

## How much has existing AI safety spending reduced AI extinction risk?

This document analyzes the question:

> By how many percentage points has roughly \$1 billion of AI safety-related spending to date reduced the probability of AI-caused human extinction this century?

Let:

- $p_{\text{with}}$ = estimated probability of AI-caused extinction this century **in the actual world**, with existing AI safety spending
- $p_{\text{without}}$ = estimated probability of AI-caused extinction this century in a **counterfactual world** where no such spending occurred
- $X = p_{\text{without}} - p_{\text{with}}$ in **percentage points**, i.e. absolute risk reduction
- $Y, Z$ = lower and upper bounds of a **{{PLAUSIBLE_RANGE}}** for $X$

For concreteness, suppose the current working estimate is:

- $p_{\text{with}} \approx 10\%$ probability of AI-caused extinction this century, reflecting a rough synthesis of expert surveys, forecasting tournaments, and public estimates. ([See detailed justification](/assumption/ai-doom-probability))

The goal is to estimate:

- A **best-guess** value for $X$
- A **plausible range** $Y$–$Z$

A reasonable summary is:

- **Best-guess:** $X \approx 0.125$ percentage points
- **Plausible range:** $Y \approx 0.01$ percentage points, $Z \approx 0.5$ percentage points

That is, cumulative AI safety-related spending to date has plausibly reduced AI-caused extinction risk this century by about **0.125 percentage points** (for example, from about 10.13% to 10.0%), with a wide range of **0.01–0.5 percentage points**.

This corresponds to about:

- **12.5 basis points per \$1 billion**
- **\$80 million per basis point**
- **\$800,000 per microprobability**

---

## 1. Conceptual framing

The central quantity of interest is:

$$
X = p_{\text{without}} - p_{\text{with}} \,,
$$

measured in **percentage points**.

For example, if $X = 0.125$ percentage points and $p_{\text{with}} = 10\%$:

- $p_{\text{without}} \approx 10.125\%$
- $p_{\text{with}} \approx 10.0\%$
- Relative risk reduction is about $0.125 / 10.125 \approx 1.2\%$

Most formal work does **not** estimate $X$ directly. Instead, it estimates cost-effectiveness in terms of:

> **Basis points of existential-risk reduction per \$1 billion spent**

Definitions:

- 1 **basis point** (bp) = 0.01 percentage points = 0.0001 in probability
- If an intervention achieves 3 bp per \$1B, that is a **0.03 percentage-point** reduction in risk per \$1B

To get $X$ from this style of modeling:

1. Infer a plausible value or range for "basis points per \$1B" from the literature and community reasoning
2. Apply that to the historical spending of roughly \$1B on AI safety-related activities

---

## 2. What the literature says about "basis points per \$1B"

### 2.1 Rethink Priorities' CURVE modeling

Rethink Priorities has modeled existential-risk interventions in terms of **basis points of risk reduction per \$1B** as part of its worldview investigations and portfolio tools.

Two particularly relevant pieces are:

- [Laura Duffy 2023, "Is x-risk the most cost-effective if we count only the next few generations?"](https://rethinkpriorities.org/research-area/is-x-risk-the-most-cost-effective-if-we-count-only-the-next-few-generations/)
- [Rethink Priorities 2024, "Exploring Key Cases with the Portfolio Builder"](https://rethinkpriorities.org/research-area/key-cases-with-the-portfolio-builder/)

Across these analyses, a rough **derived range** for generic x-risk interventions is about:

- **0.2–7 bp per \$1B**, corresponding to  
  **0.002–0.07 percentage points per \$1B**

Rethink also discusses cases where **1.5–7.2 bp per \$1B** is already enough to be competitive with strong near-term interventions such as some animal-welfare or health programs. Much larger values are treated as outliers or unusually optimistic scenarios rather than default assumptions.

This is a useful lower anchor, but not an AI-specific verdict:

- It is for **generic** existential-risk work
- It is not specifically about the very best AI safety opportunities
- It does not fully capture AI-specific channels such as frontier-lab governance and eval norms

### 2.2 EA community cost-effectiveness "bars"

Longtermist discussions often express cost-effectiveness as **dollars per basis point** of existential-risk reduction.

Two useful reference points are:

- Linch Zhang's post [“How many EA 2021 \$s would you trade off against a 0.01% chance of existential catastrophe?”](https://forum.effectivealtruism.org/posts/cKPkimztzKoCkZ75r/how-many-ea-2021-usds-would-you-trade-off-against-a-0-01), which treats **\$100M per bp** as a reasonable "good bet" bar  
  -> **10 bp per \$1B**  
  -> **0.1 percentage points per \$1B**
- Spencer Ericson's [“Thresholds #1: What does good look like for longtermism?”](https://forum.effectivealtruism.org/posts/bmrr8DFufz5Yh8yRC/thresholds-1-what-does-good-look-like-for-longtermism), which gives examples around:
  - **\$154M per bp** -> **6.5 bp per \$1B**
  - **\$34M per bp** -> **29 bp per \$1B**

These heuristics suggest that **highly cost-effective** x-risk opportunities can plausibly live around **10–30 bp per \$1B**, but those are best thought of as **good or very good opportunities**, not the average dollar spent in the whole historical field.

### 2.3 Other risk domains

Concrete cost-effectiveness models in other existential or global catastrophic risk areas provide additional benchmarks.

**Bio risk and super-PPE**

The EA Forum post [“Speedrun: Develop an affordable super PPE”](https://forum.effectivealtruism.org/posts/wAzYXjGxhJmrxunct/speedrun-develop-an-affordable-super-ppe) reports a median cost-effectiveness around **\$27M per bp**, which corresponds to roughly:

- **37 bp per \$1B**
- **0.37 percentage points per \$1B**

This is clearly more optimistic than generic Rethink-style anchors, but it shows that very strong x-risk interventions can in principle look much better than 10 bp/\$1B.

**Resilient foods vs. AGI safety**

Denkenberger et al. compare AGI safety and food-system resilience in [“Long term cost-effectiveness of resilient foods for global catastrophes compared to artificial general intelligence safety”](https://www.sciencedirect.com/science/article/abs/pii/S2212420922000176). One AGI-safety benchmark they discuss is on the order of **hundreds of bp per \$1B**; for example, **500 bp per \$1B** = **5 percentage points per \$1B**.

That benchmark should be interpreted as an **upper-tail optimistic AGI safety assumption**, not anything like a consensus or median estimate.

### 2.4 Takeaway from the literature

Putting the literature together:

- **Generic x-risk interventions:** about **0.2–7 bp per \$1B**
- **Good or very good x-risk opportunities:** about **10–30 bp per \$1B**
- **Exceptional upper-tail cases:** tens to hundreds of bp per \$1B

This suggests that if historical AI safety spending really achieved only **0.01 percentage points per \$1B** or less, it was relatively weak by longtermist standards; if it achieved **0.5+ percentage points per \$1B**, it was unusually strong.

---

## 3. AI-specific considerations

To turn these generic ranges into an estimate for the **realized impact of AI safety spending to date**, we need to ask:

1. What the roughly \$1B actually funded
2. How that spending plausibly affected AI-extinction risk
3. How much weight to place on positive vs. offsetting channels

### 3.1 What the \$1 billion has funded

Stephen McAleese's [overview of the AI safety funding situation](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation) remains the best public aggregation we found. Together with [Open Philanthropy's focus-area totals](https://www.openphilanthropy.org/focus/potential-risks-advanced-ai/), it supports the claim that cumulative AI safety-related spending is on the order of **\$1 billion**.

Very roughly, that spending has gone into:

- **Technical alignment and interpretability research**  
  e.g. work on model auditing, deceptive alignment, scalable oversight, mechanistic interpretability, control, and evals
- **AI governance, policy, and institutions**  
  e.g. CGAI, CSET, CSER, FLI, government-facing policy work, standards efforts, and AI safety institutes
- **Field-building and training**  
  e.g. SERI MATS, AI Safety Camp, fellowships, bootcamps, scholarships, and mentoring
- **Internal frontier-lab safety and risk-governance work**  
  e.g. preparedness teams, evals, red-teaming, deployment policies, and model-risk frameworks

### 3.2 Positive channels

There are several plausible ways this spending reduced extinction risk:

- It helped develop and normalize **frontier-model evals, red-teaming, and preparedness practices**
- It built a **talent pipeline** into safety, governance, and regulatory work
- It influenced **frontier-lab governance frameworks** such as Anthropic's [Responsible Scaling Policy](https://www.anthropic.com/responsible-scaling-policy) and OpenAI's [Preparedness Framework](https://openai.com/index/updating-our-preparedness-framework/)
- It contributed to **policy awareness and standards efforts**, including the [White House voluntary commitments](https://bidenwhitehouse.archives.gov/wp-content/uploads/2023/09/Voluntary-AI-Commitments-September-2023.pdf)

These are not proof of a large risk reduction, but they are clear evidence that the field has produced more than just abstract academic discussion.

### 3.3 Negative or offsetting channels

There are also important reasons not to assume every historical dollar was strongly beneficial:

- Some safety work also improves **capabilities, robustness, or deployment confidence**
- Some lab-internal safety work may function partly as **safetywashing**, increasing legitimacy without proportionate risk reduction
- Some efforts may mainly build institutions or talent that have **delayed impact**, which means realized effects so far may be smaller than eventual effects
- AI safety teams within frontier labs may reduce risk in one channel while also making those labs more durable competitors in the race

So the relevant quantity is the **net realized effect**, not the gross effect of the best parts of the portfolio.

### 3.4 Underinvestment relative to the stakes

The paper by Charles I. Jones, [“The AI Dilemma: Growth versus Existential Risk”](https://www.nber.org/papers/w33602), suggests that optimal spending on AI risk mitigation can be on the order of **1–5% of world GDP per year** under many parameterizations.

Given that:

- world GDP is roughly \$100 trillion per year, and
- historical AI safety spending is roughly \$1 billion total,

current spending is tiny relative to what such models say could be justified. This does **not** prove historical spending was highly effective, but it is strong evidence against the idea that the entire opportunity set has already been exhausted.

---

## 4. Converting the evidence into values for $X$, $Y$, and $Z$

### 4.1 Best-guess tractability

The literature and cross-checks above suggest:

- The **lower end** of plausible views for historical AI safety spending is around **1 bp per \$1B** = **0.01 percentage points per \$1B**
- The **upper end of clearly non-extreme views** is perhaps around **50 bp per \$1B** = **0.5 percentage points per \$1B**
- A reasonable **central estimate** for realized historical AI safety spending is around **12.5 bp per \$1B** = **0.125 percentage points per \$1B**

Why about 12.5 bp?

- **Higher than generic Rethink-style anchors:** AI safety is a particularly central and time-sensitive x-risk area, and some historical spending really did reach unusually leveraged labs, policy institutions, and training programs
- **Lower than the most optimistic bars:** historical spending includes field-building, mixed-effect work, and dollars that were not all cherry-picked home runs
- **Modestly better than the "good bet" bar:** at about \$80M per bp this is a bit stronger than Linch Zhang's \$100M-per-bp benchmark for "good longtermist spending" — appropriate for an unusually leveraged area, and consistent with a higher (~10%) baseline leaving more absolute risk for a given relative improvement to remove

### 4.2 Mapping to $X$, $Y$, and $Z$ for \$1B of spending

If cumulative AI safety-related spending to date is roughly \$1B, then:

- **Best-guess absolute reduction in AI-extinction risk this century:** $X \approx 0.125$ percentage points
- **Plausible range:** $Y \approx 0.01$ percentage points, $Z \approx 0.5$ percentage points

Under the working baseline $p_{\text{with}} = 10\%$:

- $p_{\text{without}} = p_{\text{with}} + X \approx 10.125\%$
- So $X = 0.125$ percentage points corresponds to a **relative risk reduction** of roughly:

$$
\frac{0.125}{10.125} \approx 1.2\%
$$

In words:

> A reasonable best guess is that AI safety-related spending to date has reduced AI-caused extinction risk this century by a bit over **one percent in relative terms**, for example from roughly 10.13% to 10.0%.

### 4.3 Implied cost per basis point and per microprobability

With the central estimate $X = 0.125$ percentage points:

- 0.125 percentage points = **12.5 bp**
- \$1B / 12.5 bp = **\$80M per bp**
- 0.00125 / 10^-6 = **1,250 microprobabilities**
- \$1B / 1,250 = **\$800k per microprobability**

Comparison:

- This is modestly better than Linch Zhang's "\$100M per bp" good-bet bar
- It is better than generic Rethink-style modeling
- It is worse than the super-PPE benchmark and far below extreme AGI-safety upper-tail assumptions

For the lower bound $Y = 0.01$ percentage points:

- 0.01 percentage points = **1 bp**
- \$1B / 1 bp = **\$1B per bp**
- \$10M per microprobability

For the upper bound $Z = 0.5$ percentage points:

- 0.5 percentage points = **50 bp**
- \$1B / 50 bp = **\$20M per bp**
- \$200k per microprobability

Overall, the central estimate and bounds are broadly consistent with:

- generic modeling for x-risk work
- longtermist "good bet" and "very good" bars
- concrete non-AI catastrophic-risk benchmarks
- the idea that AI safety can be unusually leveraged, but not automatically magical

---

## 5. Caveats and uncertainties

Several important caveats apply:

1. **These are model-based estimates, not empirical measurements.**  
   The values for $X$, $Y$, and $Z$ are inferred by combining formal cost-effectiveness models, community heuristics, and qualitative judgment about what the historical portfolio actually accomplished.

2. **Net impact may be near zero or negative.**  
   Because AI safety work can interact with capabilities, investment, and regulation in complicated ways, any full probabilistic model should assign **nontrivial probability mass to $X \leq 0$**, even if the **mean** estimate is positive.

3. **Much of the benefit may be delayed.**  
   A large share of past spending has gone into field-building, training, and institution-building. The main payoff of those investments may arrive later than the spending itself.

4. **Underinvestment implies that most tractable opportunity likely remains ahead.**  
   Jones-style models suggest current spending is tiny relative to the stakes, so even a meaningful historical effect would still leave most of the possible risk reduction unrealized.

5. **Extreme optimism should stay in the tail.**  
   Some published comparisons use AGI-safety assumptions that imply several percentage points of risk reduction per \$1B. Those are best treated as upper-tail scenarios, not as default working estimates.

6. **The denominator counts lab-internal spending only conservatively, and the headline number is a rate, not a measurement of a total.**  
   McAleese's aggregation counts for-profit frontier-lab safety teams at roughly \$19–54 million per year, which is likely well below actual frontier-lab safety investment in 2024–2025. Several of the positive channels above (responsible-scaling policies, preparedness frameworks, eval norms) were substantially funded by that largely uncounted internal investment, so attributing them fully to the counted ~\$1 billion overstates its per-dollar effect. Note also that the central estimate was derived from a relative-reduction-times-baseline judgment (about 12.5 bp per \$1B at the working baseline) rather than from independently measuring the total reduction achieved. The cost-per-microprobability conclusion therefore rests mainly on that rate judgment; the cumulative-spending total mostly scales the claimed total reduction, not the marginal cost.

---

## 6. Summary

Putting everything together:

- The **central estimate** for how much roughly \$1B of AI safety-related spending has reduced AI-caused extinction risk this century is:
  - $X \approx 0.125$ percentage points
- A **plausible range** for this reduction is:
  - $Y \approx 0.01$ percentage points
  - $Z \approx 0.5$ percentage points

In cost-effectiveness terms, this corresponds to:

- about **\$80M per basis point**
- about **\$800k per microprobability**

These figures:

- sit comfortably inside the literature rather than at its most optimistic edge
- reflect the fact that AI safety is unusually high leverage but not obviously miraculous
- leave room for both mixed effects and delayed benefits

From this perspective, it is reasonable to treat $X \approx 0.125$ percentage points, with a range of roughly 0.01–0.5, as a good working characterization of the realized effect of AI safety spending to date on AI-extinction risk this century.

{{CONTRIBUTION_NOTE}}
