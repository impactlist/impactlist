---
id: effect-of-all-ai-safety-spending
name: 'Effect of all previous AI safety spending'
---

_The following analysis was done on November 26th 2025 by GPT 5.1 Thinking._

## How much has existing AI safety spending reduced AI extinction risk?

This document analyzes the question:

> By how many percentage points has roughly \$1 billion of AI safety–related spending to date reduced the probability of AI-caused human extinction this century?

Let:

- $p_{\text{with}}$ = estimated probability of AI-caused extinction this century **in the actual world**, with existing AI safety spending.
- $p_{\text{without}}$ = estimated probability of AI-caused extinction this century in a **counterfactual world** where no such spending occurred.
- $X = p_{\text{without}} - p_{\text{with}}$ in **percentage points**, i.e., absolute risk reduction.
- $Y, Z$ = lower and upper bounds of a **plausible range** for $X$.

For concreteness, suppose the “baseline” current estimate (with spending) is:

- $p_{\text{with}} \approx 8\%$ probability of AI-caused extinction this century, reflecting a rough synthesis of expert surveys and public estimates such as:
  - Toby Ord’s updated piece, [“The Precipice Revisited”](https://www.tobyord.com/writing/the-precipice-revisited).
  - The [2022 Expert Survey on Progress in AI](https://aiimpacts.org/2022-expert-survey-on-progress-in-ai/) by AI Impacts (also summarized on their [wiki](https://wiki.aiimpacts.org/ai_timelines/predictions_of_human-level_ai_timelines/ai_timeline_surveys/2022_expert_survey_on_progress_in_ai)).
  - Grace et al. (2024), “Thousands of AI Authors on the Future of AI,” on arXiv: [html](https://arxiv.org/html/2401.02843v3) / [PDF](https://arxiv.org/pdf/2401.02843).
  - Geoffrey Hinton’s public comments as reported in the Guardian article [“‘Godfather of AI’ shortens odds of the technology wiping out humanity over next 30 years”](https://www.theguardian.com/technology/2024/dec/27/godfather-of-ai-raises-odds-of-the-technology-wiping-out-humanity-over-next-30-years).
  - Dario Amodei’s publicly stated “25% p(doom)” in the Axios piece [“Amodei on AI: ‘There’s a 25% chance that things go really, really badly’”](https://www.axios.com/2025/09/17/anthropic-dario-amodei-p-doom-25-percent).

The goal is to estimate:

- A **best-guess** value for $X$.
- A **plausible range** $Y$–$Z$.

A reasonable summary is:

- **Best-guess**:  
  $X \approx 0.2$ percentage points.
- **Plausible range**:  
  $Y \approx 0.01$ percentage points, $Z \approx 1$ percentage point.

That is, cumulative AI safety–related spending to date (roughly \$1 billion) has plausibly reduced AI-caused extinction risk this century by about **0.2 percentage points** (from, say, 8.2% to 8.0%), with a wide uncertainty range of **0.01–1 percentage points**.

---

## 1. Conceptual Framing

The central quantity of interest is:

$$
X = p_{\text{without}} - p_{\text{with}} \,,
$$

measured in **percentage points**.

For example, if $X = 0.2$ percentage points and $p_{\text{with}} = 8\%$:

- $p_{\text{without}} \approx 8.2\%$
- $p_{\text{with}} \approx 8.0\%$
- Relative risk reduction is about $0.2 / 8.2 \approx 2$–$3\%$.

Most formal work does **not** try to estimate $X$ directly. Instead, it estimates **cost-effectiveness** in terms of:

> **Basis points of existential risk reduction per \$1 billion spent.**

Definitions:

- 1 **basis point** (bp) $= 0.01$ percentage points $= 0.0001$ in probability.
- If an intervention achieves 3 bp per \$1B, that is a **0.03 percentage-point** reduction in risk per \$1B.

To get $X$ from this style of modeling:

1. Infer a plausible value (or distribution) for “basis points per \$1B” for x-risk reduction from the literature and community reasoning.
2. Apply this to the historical spending of roughly \$1B on AI safety–related activities.

---

## 2. What the Literature Says About “Basis Points per \$1B”

### 2.1 Rethink Priorities’ CURVE Modeling

Rethink Priorities has modeled existential risk interventions in terms of **basis points of risk reduction per \$1B** as part of its worldview investigations and portfolio tools.

Two particularly relevant pieces:

- [“Is x-risk the most cost-effective if we count only the next few generations?”](https://rethinkpriorities.org/research-area/is-x-risk-the-most-cost-effective-if-we-count-only-the-next-few-generations/) (Laura Duffy, 2023).
- [“Exploring Key Cases with the Portfolio Builder”](https://rethinkpriorities.org/research-area/key-cases-with-the-portfolio-builder/) (2024).

These draw on scenario analyses where generic existential risk interventions are assigned cost-effectiveness in basis points per \$1B. A key result from the “few generations” piece is:

- **Scenarios that reduce between about 1.5 and 7.2 basis points per \$1B** are cost-competitive with strong near-term interventions (like some animal welfare or health interventions).

In more detail (across several scenarios and decision-theoretic framings), the **“plausible” region** for generic x-risk interventions is roughly:

- **$\sim 0.2$–$7$ bp per \$1B**, corresponding to  
  **0.002–0.07 percentage points per \$1B.**

A smaller number of scenarios explore **very optimistic** cases in which interventions reduce tens to hundreds of bp per \$1B (0.5–5+ percentage points per \$1B), but these are explicitly treated as **outliers** or “implausible” for typical x-risk work.

If one naively applied this 0.002–0.07 percentage-point-per-\$1B range to the **entire historical \$1B of AI safety spending**, one would get:

- **Total risk reduction $\sim 0.002$–$0.07$ percentage points.**

That would be tiny. However, these estimates are:

- For **generic** existential risk interventions.
- For a **single** hypothetical project, not necessarily the best x-risk opportunities available at scale.
- Not tailored specifically to AI.

So they should be considered a **conservative anchor**, not an AI-specific verdict.

### 2.2 EA Community Cost-Effectiveness “Bars” (Cost per Basis Point)

Effective altruism (EA) and longtermist discussions often express cost-effectiveness in terms of **\$/bp of existential risk reduction** and propose **thresholds** for what counts as a good opportunity.

A few illustrative sources:

- Linch Zhang’s EA Forum post [“How many EA 2021 \$s would you trade off against a 0.01% chance of existential catastrophe?”](https://forum.effectivealtruism.org/posts/cKPkimztzKoCkZ75r/how-many-ea-2021-usds-would-you-trade-off-against-a-0-01) argues that it is reasonable to feel “bullish” about funding interventions that reduce existential risk by **0.01 percentage points (1 bp) for around \$100M**.
  - This implies a **“good bet” bar** of about **\$100M per bp**, i.e.,
    - **10 bp per \$1B**
    - $\Rightarrow$ **0.1 percentage points per \$1B.**
- Spencer R. (Ericson) in [“Thresholds #1: What does good look like for longtermism?”](https://forum.effectivealtruism.org/posts/bmrr8DFufz5Yh8yRC/thresholds-1-what-does-good-look-like-for-longtermism) discusses similar thresholds, with examples around:
  - \$154M per bp (≈ 6.5 bp per \$1B ⇒ 0.065 percentage points per \$1B).
  - \$34M per bp (≈ 29 bp per \$1B ⇒ 0.29 percentage points per \$1B), used as an illustrative “very good” case.

These heuristics suggest that:

- **A highly cost-effective x-risk project** might plausibly achieve something like **$\sim 10$–$30$ bp per \$1B**, i.e.,
  - **0.1–0.3 percentage points per \$1B.**

This is noticeably more optimistic than the conservative Rethink Priorities scenarios (0.002–0.07 percentage points per \$1B), but it is intended as a bar for **cherry-picked, high-quality opportunities**, not generic ones.

### 2.3 Other Risk Domains: Bio Risk and Resilient Foods

Concrete cost-effectiveness models for other existential or global catastrophic risks provide additional benchmarks.

**Bio risk and super-PPE**

The EA Forum post [“Speedrun: Develop an affordable super PPE”](https://forum.effectivealtruism.org/posts/wAzYXjGxhJmrxunct/speedrun-develop-an-affordable-super-ppe) by Buhl uses a Guesstimate model to estimate the cost per bp of x-risk reduction for an intervention aimed at massively improving personal protective equipment for pandemics.

- The model reports a median cost-effectiveness of roughly **\$27M per bp** (with wide uncertainty).
- That corresponds to about:
  - $\frac{1\text{B}}{27\text{M}} \approx 37$ bp per \$1B,
  - $\Rightarrow$ roughly **0.37 percentage points per \$1B.**

This is in the same ballpark as the more optimistic EA community thresholds for x-risk work.

**Resilient foods vs AGI safety**

David Denkenberger et al. compare AGI safety and food-system resilience in [“Long term cost-effectiveness of resilient foods for global catastrophes compared to artificial general intelligence safety”](https://www.sciencedirect.com/science/article/abs/pii/S2212420922000176) (open version via ALLFED [here](https://allfed.info/research/publications-and-reports/peer-reviewed/long-term-cost-effectiveness-of-resilient-foods-for-global-catastrophes-compared-to-artificial-general-intelligence-safety) and [PDF](https://allfed.info/images/pdfs/Long_term_cost_effectiveness_of_resilien.pdf)).

- One AGI safety cost-effectiveness estimate they cite implies **several hundred basis points per \$1B**, i.e., **several percentage points of risk reduction per \$1B**.
- They argue that resilient foods are even more cost-effective than this AGI safety benchmark, but their use of **500 bp per \$1B (5 percentage points per \$1B)** is clearly positioned as a **very optimistic** AGI safety figure rather than a consensus.

This shows that some published work has entertained **very large** risk reductions per \$1B for AGI safety, but those numbers should be treated cautiously as upper-tail cases.

### 2.4 Additional Rethink Priorities Work on Basis Points

Several other Rethink Priorities outputs explicitly model **bp per \$1B** in various contexts:

- [“How Can Risk Aversion Affect Your Cause Prioritization?”](https://rethinkpriorities.org/wp-content/uploads/2023/10/How-Can-Risk-Aversion-Affect-Your-Cause-Prioritization.pdf) discusses how different risk-aversion assumptions interact with distributions over “basis points per \$1B” for x-risk interventions.
- The CRAFT sequence and related tools (e.g. the [Portfolio Builder](https://rethinkpriorities.org/research-area/resource-allocation-a-research-agenda/)) explore distributions over cost-effectiveness where much of the mass for generic x-risk projects lies in the **low-single-digit bp per \$1B range**, with tails that extend higher for especially promising interventions.

Taken together, this work reinforces the picture that:

- **Generic x-risk interventions**:  
  reasonably modeled at **$\sim 0.2$–$7$ bp per \$1B** (0.002–0.07 percentage points per \$1B).
- **Best-guess / high-quality opportunities**:  
  might plausibly reach **$\sim 10$–$40$ bp per \$1B** (0.1–0.4 percentage points per \$1B).
- **Extreme AGI-specific assumptions**:  
  can be as high as **hundreds of bp per \$1B** (1–5 percentage points per \$1B), but are clearly outliers.

---

## 3. AI-Specific Considerations

To turn these generic ranges into an estimate for the **realized impact of AI safety spending to date**, we need to consider:

1. What the roughly \$1B has actually funded.
2. How that might affect AI-extinction risk, positively and negatively.
3. How far current spending is from what economic models suggest would be optimal.

### 3.1 What the \$1 Billion Has Funded

Stephen McAleese’s EA Forum post [“An Overview of the AI Safety Funding Situation”](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation) estimates that cumulative AI safety–related funding (up to around 2023–24) is on the order of \$1 billion, drawing on:

- Public grant databases and reports from [Open Philanthropy](https://www.openphilanthropy.org), the Survival and Flourishing Fund (SFF), the Long-Term Future Fund (LTFF), the FTX Future Fund (before its collapse), and others.
- Estimates of safety-related spending by AI labs.
- Emerging government programs (e.g. AI Safety Institutes, standards efforts).

A TIME profile of Cari Tuna, [“Cari Tuna: The 100 Most Influential People in AI 2024”](https://time.com/7012763/cari-tuna/), likewise notes that Open Philanthropy has donated hundreds of millions of dollars to AI safety research, making it one of the largest philanthropic funders in this area.

Very roughly, this money has gone into:

- **Technical alignment and interpretability research**  
  (e.g. MIRI, CHAI, Redwood Research, ARC, various academic groups, and safety teams within DeepMind, OpenAI, Anthropic, etc.).
- **AI governance, policy, and institutions**  
  (e.g. the Centre for the Governance of AI, CSET, CSER, FLI, and multiple university-based centers).
- **Field-building and training**  
  (e.g. SERI MATS, AI Safety Camp, technical bootcamps and fellowships, scholarships).
- **Internal lab safety and risk governance**  
  (e.g. model evals, red-teaming, internal safety organizations and procedures).

There are multiple plausible **channels for positive impact**:

- Influencing early **AI regulation and standards**, including the creation of AI safety institutes and risk-based regulatory frameworks.
- Developing and deploying **evals, red-teaming techniques, and interpretability tools** that may reduce certain classes of catastrophic failure.
- Building a **talent pipeline** that will staff future safety, governance, and regulatory work.
- Helping establish **norms and awareness** about AI existential risks among researchers and policymakers.

However, there are also plausible **channels for negative or offsetting impact**:

- Safety research (e.g. reinforcement learning from human feedback, better tooling) that also **improves capabilities and accelerates deployment**, increasing upstream risk.
- “Safetywashing” where **weak or cosmetic safety efforts** increase public and regulatory trust in rapid deployment of powerful systems without adequately reducing existential risk.
- AI safety teams within powerful labs that **boost those labs’ legitimacy, attract more funding and talent**, and thereby accelerate the overall capabilities race.

Because of these mixed mechanisms, the **net realized impact** of the average AI safety dollar so far is highly uncertain. Any estimate of $X$ should be understood as an **expected net effect** that averages over both positive and negative pathways.

### 3.2 Underinvestment Relative to Optimal Spending

Economic models suggest that society is likely **massively underinvesting** in reducing AI-related existential risk.

The paper by Charles I. Jones, [“The AI Dilemma: Growth versus Existential Risk”](https://web.stanford.edu/~chadj/existentialrisk.pdf) (also circulated as NBER working paper [w33602](https://www.nber.org/system/files/working_papers/w33602/w33602.pdf) and SSRN working paper [“How Much Should We Spend to Reduce A.I.’s Existential Risk?”](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5190789)), analyzes optimal investment in AI safety under various assumptions. Across a range of simulations, Jones finds:

- Optimal spending on AI risk mitigation can be on the order of **1–5% of world GDP per year for a decade or more**, depending on details of the model and assumptions about risk and the value of the future.

Given that:

- World GDP is on the order of \$100 trillion per year, and
- AI safety spending to date is on the order of \$1 billion in total,

current spending is **several orders of magnitude below** what these models suggest would be optimal. In a public talk, Jones has similarly remarked that current AI safety spending may be a factor of **100x too low** relative to what would be reasonable.

This implies:

- The **theoretical potential** for further risk reduction is very large.
- Most of that potential is still untapped.
- It would be surprising if the existing \$1B had already reduced AI-extinction risk by, say, 5–10 percentage points; such a result would imply **extraordinary tractability per dollar**, far beyond what is assumed in these optimal control models.

This underinvestment consideration is a key reason to treat **multi-percentage-point reductions per \$1B** as **upper-tail** possibilities rather than central estimates.

---

## 4. Converting the Evidence into Values for $X$, $Y$, and $Z$

### 4.1 Synthesizing “Risk Reduction per \$1B” for AI Safety

Collecting the benchmarks:

- **Conservative generic x-risk (Rethink Priorities)**  
  [Duffy 2023](https://rethinkpriorities.org/research-area/is-x-risk-the-most-cost-effective-if-we-count-only-the-next-few-generations/) and [Portfolio Builder analysis](https://rethinkpriorities.org/research-area/key-cases-with-the-portfolio-builder/) suggest:
  - $\sim 0.2$–$7$ bp per \$1B → **0.002–0.07 percentage points per \$1B**.
- **EA community thresholds and best-guess opportunities**  
  From Linch Zhang’s post [“How many EA 2021 \$s…”](https://forum.effectivealtruism.org/posts/cKPkimztzKoCkZ75r/how-many-ea-2021-usds-would-you-trade-off-against-a-0-01) and Spencer’s [“Thresholds #1”](https://forum.effectivealtruism.org/posts/bmrr8DFufz5Yh8yRC/thresholds-1-what-does-good-look-like-for-longtermism):
  - Roughly **\$100M per bp** as a “good bet” bar → **10 bp per \$1B** → **0.1 percentage points per \$1B**.
  - More optimistic examples up to **\$34M per bp** → ~29 bp per \$1B → **0.29 percentage points per \$1B**.
- **Concrete non-AI project (super PPE)**  
  [“Speedrun: Develop an affordable super PPE”](https://forum.effectivealtruism.org/posts/wAzYXjGxhJmrxunct/speedrun-develop-an-affordable-super-ppe) finds a median around **\$27M per bp**:
  - $\frac{1\text{B}}{27\text{M}} \approx 37$ bp per \$1B → **0.37 percentage points per \$1B**.
- **Very optimistic AGI safety benchmarks**  
  Denkenberger et al. in [“Long term cost-effectiveness of resilient foods…”](https://www.sciencedirect.com/science/article/abs/pii/S2212420922000176) use a comparison case where AGI safety yields **hundreds of bp per \$1B** (e.g. 500 bp per \$1B → **5 percentage points per \$1B**) as a benchmark to be surpassed by resilient foods. This is clearly intended as an **optimistic AGI safety assumption**, not a consensus figure.

On a log scale, a large share of reasonable views about **good x-risk interventions** cluster around:

- **$\sim 0.05$–$0.3$ percentage points per \$1B.**

For AI safety specifically, there are reasons to think:

- On the one hand, AI is an **especially central and time-sensitive x-risk**, potentially making good opportunities **more tractable**.
- On the other hand, AI safety work is particularly prone to **mixed effects and capability externalities**, which may reduce net effectiveness.

Balancing these, a reasonable **central estimate** for **realized** AI safety spending is:

- **Central effective rate**:  
  $\sim 0.2$ percentage points per \$1B.

Given the large uncertainties, it is also appropriate to maintain a **wide plausible range**, such as:

- **Plausible effective rate range**:  
  **0.01–1 percentage points per \$1B.**

This range:

- Allows for outcomes that are **an order of magnitude worse** than the “good bet” bar (0.01 percentage points per \$1B), e.g., if acceleration and safetywashing effects substantially offset direct benefits.
- Allows for outcomes that are **several times better** than the bar (1 percentage point per \$1B), e.g., if some interventions were unusually pivotal.
- Stops short of the **most extreme 5 percentage points per \$1B** figures, which appear too optimistic to serve as central estimates.

### 4.2 Mapping to $X$, $Y$, and $Z$ for \$1B of Spending

If cumulative AI safety–related spending to date is roughly \$1B, then:

- **Best-guess absolute reduction in AI-extinction risk this century**:
  - $X \approx 0.2$ percentage points.
- **Plausible range**:
  - $Y \approx 0.01$ percentage points,
  - $Z \approx 1$ percentage point.

Under the illustrative baseline $p_{\text{with}} = 8\%$:

- $p_{\text{without}} = p_{\text{with}} + X \approx 8.2\%$ (best guess).
- So $X = 0.2$ percentage points corresponds to a **relative risk reduction** of:
  $$
  \frac{0.2}{8.2} \approx 2\% \text{–} 3\% \,.
  $$

In words:

> A reasonable best-guess is that AI safety–related spending to date has reduced AI-caused extinction risk this century by something like **a few percent in relative terms**, e.g., from roughly 8.2% to 8%, with a plausible absolute range of about 0.01–1 percentage points.

### 4.3 Implied Cost per Basis Point

It is useful to check whether these values sit comfortably within the ranges implied by the literature.

Recall:

- 1 bp $=$ 0.01 percentage points.

With the central estimate $X = 0.2$ percentage points:

- $0.2$ percentage points = 20 bp.
- \$1B / 20 bp = **\$50M per bp**.

Comparison:

- This is **better** (more cost-effective) than the \$100M/bp “good bet” bar proposed by Linch Zhang.
- It is somewhat **worse** (less cost-effective) than the median from the super-PPE analysis (\$27M/bp).
- It is clearly **less extreme** than the 500 bp per \$1B (2M/bp) AGI safety benchmark used by Denkenberger et al. as a foil.

For the lower bound $Y = 0.01$ percentage points:

- 0.01 percentage points = 1 bp.
- \$1B / 1 bp = **\$1B per bp**.

This corresponds to interventions that are **10× less cost-effective** than the \$100M/bp bar. Such a realization would be a disappointment relative to optimistic expectations but could still be worth funding given the enormous stakes of extinction risk.

For the upper bound $Z = 1$ percentage point:

- 1 percentage point = 100 bp.
- \$1B / 100 bp = **\$10M per bp**.

This would be:

- Around **10× more cost-effective** than the \$100M/bp bar.
- More cost-effective than the super-PPE median (\$27M/bp).
- Still considerably **less extreme** than the 2M/bp implied by the 500 bp/\$1B AGI safety assumption.

Overall, the central estimate and bounds are broadly consistent with:

- The conservative Rethink Priorities modeling for generic x-risk projects.
- EA community thresholds for good x-risk opportunities.
- Concrete non-AI x-risk models like the super-PPE analysis.
- The upper-tail AGI safety assumptions used in resilient-foods comparisons.

---

## 5. Caveats and Uncertainties

Several important caveats apply:

1. **These are model-based estimates, not empirical measurements.**  
   The values for $X$, $Y$, and $Z$ are inferred by combining:

   - Formal cost-effectiveness models (Rethink Priorities, Denkenberger et al., Jones).
   - Community heuristics about what counts as a good x-risk opportunity.
   - A qualitative assessment of the history and structure of AI safety funding.

2. **Net impact may be near zero or negative.**  
   Because AI safety work interacts with capabilities, investment, and regulation, it is plausible that:

   - Some activities primarily _increase_ risk (e.g., by accelerating risky systems).
   - Some “safety” work functions more as **legitimization** of rapid scaling than as genuine risk reduction.
     Any full probabilistic model should allocate nontrivial probability mass to $X \leq 0$, even if the **mean** of $X$ is positive.

3. **Much of the benefit is likely in the future.**  
   A large fraction of past spending has gone into **field-building** (training people, building institutions, setting norms). The main payoff may come from how these investments affect **future** decisions, funding, and policy. Treating that expected future impact as part of $X$ is a modeling choice that folds expected downstream benefits into the current estimate.

4. **Underinvestment implies that most risk reduction potential remains.**  
   Economic models like Jones’s [“The AI Dilemma: Growth versus Existential Risk”](https://web.stanford.edu/~chadj/existentialrisk.pdf) suggest that optimal spending on AI safety is orders of magnitude larger than current levels. This supports:

   - Treating the realized $X$ as **small relative to the potential reductions** still available.
   - Being cautious about assigning multi-percentage-point reductions per \$1B as central estimates.

5. **Extreme optimism is possible but should be treated as tail risk.**  
   Some AGI-specific assumptions (e.g., 5 percentage points per \$1B) appear in the literature, particularly in comparisons where AGI safety is used as a demanding benchmark. These are best understood as **optimistic tail scenarios**, not as typical or median expectations.

---

## 6. Summary

Putting everything together:

- The **central estimate** for how much roughly \$1B of AI safety–related spending has reduced AI-caused extinction risk this century is:
  - $X \approx 0.2$ percentage points.
- A **plausible range** for this reduction is:
  - $Y \approx 0.01$ percentage points,
  - $Z \approx 1$ percentage point.

In cost-effectiveness terms, this corresponds to:

- A central realized cost-effectiveness of about **\$50M per basis point** of extinction-risk reduction, with a plausible range spanning **\$10M–\$1B per basis point**.

These figures:

- Are broadly compatible with conservative modeling from Rethink Priorities, community “good bet” bars, and concrete analyses in other risk domains.
- Allow for substantial uncertainty, including the possibility of relatively weak realized impact so far and the possibility (though less likely) of very strong returns.
- Reflect the fact that current AI safety spending is **tiny relative to what economic models suggest would be optimal**, implying that most of the tractable risk-reduction potential remains ahead rather than behind.

From this perspective, it is reasonable to treat $X \approx 0.2$ percentage points (with $Y$–$Z \approx 0.01$–$1$) as a **working quantitative characterization** of the realized effect of AI safety spending to date on AI-extinction risk this century.

---

_These estimates are approximate and we welcome contributions to improve them. You can submit quick feedback with [this form](https://forms.gle/NEC6LNics3n6WVo47) or get more involved [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._
