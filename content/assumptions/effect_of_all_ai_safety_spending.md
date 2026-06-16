---
id: effect-of-all-ai-safety-spending
name: 'Effect of all previous AI safety spending'
---

_The following analysis was done on April 6th 2026 by GPT-5.4 and Claude Opus 4.6, with prompts from Impact List staff._

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
- **Plausible range:** $Y \approx 0.005$ percentage points, $Z \approx 0.5$ percentage points

That is, cumulative AI safety-related spending to date has plausibly reduced AI-caused extinction risk this century by about **0.125 percentage points** (for example, from about 10.13% to 10.0%), with a wide range of **0.005–0.5 percentage points**. The range is wider at the bottom than the literature's effectiveness tiers alone would suggest, because the offsetting channels below (capabilities spillovers, safetywashing, safety teams that also make labs more durable race competitors) leave real mass on a net effect near zero — or, in the worst case, below it.

This corresponds to about:

- **12.5 basis points per \$1 billion**
- **\$80 million per basis point**
- **\$800,000 per microprobability**

---

## 1. Conceptual framing

The central quantity is $X = p_{\text{without}} - p_{\text{with}}$, measured in **percentage points**. At $X = 0.125$ percentage points and $p_{\text{with}} = 10\%$, that means $p_{\text{without}} \approx 10.125\%$ — a **relative** risk reduction of about $0.125 / 10.125 \approx 1.2\%$.

There is no clean empirical way to measure $X$ directly. Most formal work instead estimates cost-effectiveness in **basis points of existential-risk reduction per \$1 billion spent**, so we infer a plausible "bp per \$1B" rate from the literature (Section 2) and apply it to the roughly \$1B spent on AI safety to date (Section 3).

:::details{title="Basis points, and how they map to X"}
1 **basis point** (bp) = 0.01 percentage points = 0.0001 in probability. An intervention at 3 bp per \$1B delivers a **0.03 percentage-point** reduction per \$1B. Converting the literature's rate into $X$ is two steps: (1) infer a plausible value or range for "basis points per \$1B"; (2) apply it to the roughly \$1B of historical AI safety-related spending.
:::

---

## 2. What the literature says about "basis points per \$1B"

Existing cost-effectiveness work clusters into three tiers:

- **Generic x-risk interventions:** about **0.2–7 bp per \$1B**
- **Good or very good x-risk opportunities:** about **10–30 bp per \$1B**
- **Exceptional upper-tail cases:** tens to hundreds of bp per \$1B

So if historical AI safety spending achieved only **0.01 percentage points per \$1B** (1 bp) or less, it was relatively weak by longtermist standards; if it achieved **0.5+ percentage points per \$1B** (50+ bp), it was unusually strong. Those tiers anchor the body of the plausible range we adopt below; the published lower bound sits below this "weak" tier because the offsetting channels in Section 3 leave a real chance the net effect was close to zero.

:::details{title="The source-by-source benchmarks behind the three tiers"}
**Rethink Priorities' CURVE modeling (generic anchor).** Rethink models x-risk interventions in basis points of risk reduction per \$1B in its [Laura Duffy 2023 analysis](https://rethinkpriorities.org/research-area/is-x-risk-the-most-cost-effective-if-we-count-only-the-next-few-generations/) and [2024 Portfolio Builder](https://rethinkpriorities.org/research-area/key-cases-with-the-portfolio-builder/). The rough derived range for generic x-risk work is about **0.2–7 bp per \$1B** (0.002–0.07 percentage points), with **1.5–7.2 bp per \$1B** already enough to compete with strong animal-welfare or health programs. This is a useful lower anchor but not an AI-specific verdict: it is for generic work, not the best AI opportunities, and does not capture AI-specific channels like frontier-lab governance and eval norms.

**EA community "bars" (good/very-good opportunities).** Longtermist discussions often quote dollars per basis point. Linch Zhang's [post on trading EA dollars against existential risk](https://forum.effectivealtruism.org/posts/cKPkimztzKoCkZ75r/how-many-ea-2021-usds-would-you-trade-off-against-a-0-01) treats **\$100M per bp** (10 bp per \$1B, 0.1 percentage points) as a "good bet" bar. Spencer Ericson's [“Thresholds #1”](https://forum.effectivealtruism.org/posts/bmrr8DFufz5Yh8yRC/thresholds-1-what-does-good-look-like-for-longtermism) gives **\$154M per bp** (6.5 bp per \$1B) and **\$34M per bp** (29 bp per \$1B). These suggest highly cost-effective opportunities can live around **10–30 bp per \$1B** — good or very good opportunities, not the average historical dollar.

**Other risk domains (upper-tail cases).** The EA Forum [“Speedrun: super PPE”](https://forum.effectivealtruism.org/posts/wAzYXjGxhJmrxunct/speedrun-develop-an-affordable-super-ppe) post reports a median around **\$27M per bp** (37 bp per \$1B, 0.37 percentage points) — more optimistic than generic anchors, showing very strong x-risk work can beat 10 bp/\$1B. Denkenberger et al.'s [resilient-foods vs. AGI-safety comparison](https://www.sciencedirect.com/science/article/abs/pii/S2212420922000176) discusses an AGI-safety benchmark on the order of **hundreds of bp per \$1B** (e.g. 500 bp = 5 percentage points), which should be read as an upper-tail optimistic assumption, not a median.
:::

---

## 3. AI-specific considerations

Two facts shape where AI safety lands within those generic tiers. First, the relevant quantity is the **net realized effect** — the gross benefit of the best parts of the portfolio (eval and preparedness norms, a safety/governance talent pipeline, influence on frontier-lab frameworks) minus offsetting channels (capabilities spillovers, safetywashing, delayed-impact field-building, and safety teams that also make labs more durable race competitors). Second, the field is tiny relative to the stakes, so most tractable opportunity likely remains ahead rather than already spent.

That second point comes from Charles I. Jones, [“The AI Dilemma: Growth versus Existential Risk”](https://www.nber.org/papers/w33602), whose models imply optimal AI-risk spending on the order of **1–5% of world GDP per year** — against roughly \$100 trillion annual world GDP, versus roughly \$1 billion of historical AI safety spending total. This does not prove historical spending was highly effective, but it is strong evidence the opportunity set is far from exhausted.

:::details{title="What the billion dollars funded, and the positive vs. offsetting channels"}
**The spending total.** Stephen McAleese's [overview of the AI safety funding situation](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation), with [Open Philanthropy's focus-area totals](https://www.openphilanthropy.org/focus/potential-risks-advanced-ai/), supports a cumulative figure on the order of **\$1 billion**, spread across technical alignment and interpretability (auditing, deceptive alignment, scalable oversight, control, evals); governance, policy, and institutions (CGAI, CSET, CSER, FLI, standards efforts, AI safety institutes); field-building and training (SERI MATS, AI Safety Camp, fellowships, bootcamps); and internal frontier-lab safety work (preparedness teams, evals, red-teaming, deployment policies).

**Positive channels.** This spending plausibly helped normalize **frontier-model evals, red-teaming, and preparedness practices**; built a **talent pipeline** into safety, governance, and regulatory work; influenced **frontier-lab governance frameworks** like Anthropic's [Responsible Scaling Policy](https://www.anthropic.com/responsible-scaling-policy) and OpenAI's [Preparedness Framework](https://openai.com/index/updating-our-preparedness-framework/); and contributed to **policy and standards efforts** including the [White House voluntary commitments](https://bidenwhitehouse.archives.gov/wp-content/uploads/2023/09/Voluntary-AI-Commitments-September-2023.pdf). This is not proof of large risk reduction, but it shows the field produced more than abstract academic discussion.

**Offsetting channels.** Not every dollar was strongly beneficial: some safety work also improves **capabilities, robustness, or deployment confidence**; some lab-internal work may function partly as **safetywashing**; some efforts mainly build institutions or talent with **delayed impact**, so realized effects so far may be smaller than eventual effects; and lab safety teams may reduce risk in one channel while making their labs more durable race competitors.
:::

---

## 4. Converting the evidence into values for $X$, $Y$, and $Z$

For roughly \$1B of spending we place the central rate at about **12.5 bp per \$1B** = **0.125 percentage points** ($X$), with bounds of **0.5 bp per \$1B** ($Y = 0.005$ percentage points) at the low end — a near-break-even world where offsetting channels nearly cancel the gains — and **50 bp per \$1B** ($Z = 0.5$ percentage points) at the upper end of clearly non-extreme views. The lower bound is below the literature's weakest generic tier because the dominant uncertainty here is not which positive tier applies but whether the net effect was positive at all (caveat 2 below). The central figure sits just above the EA "good bet" bar for three reasons:

- **Higher than generic Rethink-style anchors:** AI safety is a particularly central and time-sensitive x-risk area, and some historical spending really did reach unusually leveraged labs, policy institutions, and training programs.
- **Lower than the most optimistic bars:** historical spending includes field-building, mixed-effect work, and dollars that were not all cherry-picked home runs.
- **Modestly better than the "good bet" bar:** at about \$80M per bp this is a bit stronger than Linch Zhang's \$100M-per-bp benchmark, appropriate for an unusually leveraged area and consistent with a higher (~10%) baseline leaving more absolute risk for a given relative improvement to remove.

At $X = 0.125$ percentage points the central estimate buys about **\$80M per basis point** and **\$800k per microprobability** — modestly better than the "good bet" bar and generic Rethink-style modeling, but worse than the super-PPE benchmark and far below extreme AGI-safety upper-tail assumptions. The bounds span **\$200k–\$20M per microprobability**.

:::details{title="Per-bound arithmetic and relative-reduction check"}
**Central ($X = 0.125$ percentage points = 12.5 bp).** $$\$1\text{B} / 12.5\text{ bp} = \$80\text{M per bp}$$; $0.00125 / 10^{-6} = 1{,}250$ microprobabilities, so $$\$1\text{B} / 1{,}250 = \$800\text{k per microprobability}$$. Under $p_{\text{with}} = 10\%$ this means $p_{\text{without}} \approx 10.125\%$ — a relative risk reduction of $0.125 / 10.125 \approx 1.2\%$, i.e. a bit over one percent in relative terms (for example, from roughly 10.13% to 10.0%).

**Lower bound ($Y = 0.005$ percentage points = 0.5 bp).** \$2B per bp; $0.00005 / 10^{-6} = 50$ microprobabilities, so **\$20M per microprobability**.

**Upper bound ($Z = 0.5$ percentage points = 50 bp).** $$\$1\text{B} / 50\text{ bp} = \$20\text{M per bp}$$; **\$200k per microprobability**.

These bounds are broadly consistent with generic x-risk modeling, longtermist "good bet" and "very good" bars, concrete non-AI catastrophic-risk benchmarks, and the idea that AI safety can be unusually leveraged but not automatically magical.
:::

---

## 5. Caveats and uncertainties

Four caveats matter most:

1. **These are model-based estimates, not empirical measurements.** $X$, $Y$, and $Z$ are inferred by combining formal cost-effectiveness models, community heuristics, and qualitative judgment about what the historical portfolio accomplished.

2. **Net impact may be near zero or negative.** Because safety work interacts with capabilities, investment, and regulation in complicated ways, a full probabilistic model should assign **nontrivial probability mass to $X \leq 0$**, even if the **mean** estimate is positive.

3. **Much of the benefit may be delayed.** A large share of past spending went into field-building, training, and institution-building, whose main payoff may arrive later than the spending itself.

4. **Extreme optimism should stay in the tail.** Some published comparisons use AGI-safety assumptions implying several percentage points of risk reduction per \$1B; those are upper-tail scenarios, not default working estimates.

A further subtlety: the headline figure is a **rate, not a measured total**, and the denominator counts lab-internal spending only conservatively — so the per-dollar effect of the counted spending is likely overstated, and the cost-per-microprobability conclusion rests mainly on the rate judgment rather than the spending total.

:::details{title="Why the denominator and the rate-based derivation overstate per-dollar effect"}
McAleese's aggregation counts for-profit frontier-lab safety teams at roughly \$19–54 million per year, likely well below actual frontier-lab safety investment in 2024–2025. Several of the positive channels above (responsible-scaling policies, preparedness frameworks, eval norms) were substantially funded by that largely uncounted internal investment, so attributing them fully to the counted ~\$1 billion overstates its per-dollar effect.

The central estimate was also derived from a relative-reduction-times-baseline judgment (about 12.5 bp per \$1B at the working baseline) rather than from independently measuring the total reduction achieved. So the cost-per-microprobability conclusion rests mainly on that rate judgment; the cumulative-spending total mostly scales the claimed total reduction, not the marginal cost.
:::

{{CONTRIBUTION_NOTE}}
