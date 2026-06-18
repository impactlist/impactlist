---
id: effect-of-all-ai-safety-spending
name: 'Effect of all previous AI safety spending'
---

## How much has existing AI safety spending reduced AI extinction risk?

This document analyzes the question:

> By how many percentage points has AI safety-related spending to date reduced the probability of AI-caused human extinction this century?

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

- **Best-guess:** $X \approx 0.16$ percentage points
- **Plausible range:** $Y \approx 0.006$ percentage points, $Z \approx 0.6$ percentage points

That is, cumulative AI safety-related spending to date has plausibly reduced AI-caused extinction risk this century by about **0.16 percentage points** (for example, from about 10.16% to 10.0%), with a plausible range of **0.006–0.6 percentage points**. Both endpoints are positive because the range is the middle 80% (10th–90th percentile) of the full net-effect distribution and even the 10th-percentile estimate is still slightly above zero; the genuine possibility that offsetting channels (capabilities spillovers, safetywashing, safety teams that also make labs more durable race competitors) drove the net effect to around zero or below sits in the lower ~10% tail, below the published range.

Set against the effectiveness-weighted spending that produced it — about **\$1.6 billion** in serious, non-lab-equivalent dollars (Section 3) — that is about **\$1.0 million per microprobability** (plausible range \$200,000–\$35 million), or roughly **\$100 million per basis point** of extinction-risk reduction. (Counting all \$2.6 billion of raw spending equally, the raw historical average is about \$1.6 million per microprobability.)

---

## 1. Conceptual framing

The central quantity is $X = p_{\text{without}} - p_{\text{with}}$, measured in **percentage points**. At $X = 0.16$ percentage points and $p_{\text{with}} = 10\%$, that means $p_{\text{without}} \approx 10.16\%$ — a **relative** risk reduction of about $0.16 / 10.16 \approx 1.6\%$.

There is no clean empirical way to measure $X$ directly. We anchor it on what cost-effectiveness research implies good safety work achieves — expressed as **basis points of risk reduction per \$1 billion** (Section 2) — together with a direct judgment of what the historical portfolio plausibly accomplished. Dividing the resulting reduction into the effectiveness-weighted spending that produced it (Section 3) gives the cost per unit of risk reduction (Section 4).

:::details{title="Basis points, and how they map to X"}
1 **basis point** (bp) = 0.01 percentage points = 0.0001 in probability, so the central **0.16 percentage-point** reduction is **16 bp**. The literature (Section 2) reports cost-effectiveness as **basis points per \$1 billion of good spending**; we use those benchmarks as evidence for the size of reduction the historical portfolio plausibly achieved, then divide by the effectiveness-weighted spending (Section 3) to get a cost.
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

**EA community benchmarks (strong opportunities).** Longtermist discussions often quote dollars per basis point. Linch Zhang's [post on trading EA dollars against existential risk](https://forum.effectivealtruism.org/posts/cKPkimztzKoCkZ75r/how-many-ea-2021-usds-would-you-trade-off-against-a-0-01) gives **\$100M per bp** (10 bp per \$1B, 0.1 percentage points) as a level he would feel comfortable funding. Spencer Ericson's [“Thresholds #1”](https://forum.effectivealtruism.org/posts/bmrr8DFufz5Yh8yRC/thresholds-1-what-does-good-look-like-for-longtermism) gives **\$154M per bp** (6.5 bp per \$1B) and **\$34M per bp** (29 bp per \$1B). These suggest highly cost-effective opportunities can live around **10–30 bp per \$1B** — strong or very strong opportunities, not the average historical dollar.

**Other risk domains (upper-tail cases).** The EA Forum [“Speedrun: super PPE”](https://forum.effectivealtruism.org/posts/wAzYXjGxhJmrxunct/speedrun-develop-an-affordable-super-ppe) post reports a median around **\$27M per bp** (37 bp per \$1B, 0.37 percentage points) — more optimistic than generic anchors, showing very strong x-risk work can beat 10 bp/\$1B. Denkenberger et al.'s [resilient-foods vs. AGI-safety comparison](https://www.sciencedirect.com/science/article/abs/pii/S2212420922000176) discusses an AGI-safety benchmark on the order of **hundreds of bp per \$1B** (e.g. 500 bp = 5 percentage points), which should be read as an upper-tail optimistic assumption, not a median.
:::

---

## 3. AI-specific considerations

Two facts shape where AI safety lands within those generic tiers. First, the relevant quantity is the **net realized effect** — the gross benefit of the best parts of the portfolio (eval and preparedness norms, a safety/governance talent pipeline, influence on frontier-lab frameworks) minus offsetting channels (capabilities spillovers, safetywashing, delayed-impact field-building, and safety teams that also make labs more durable race competitors). Second, the field is tiny relative to the stakes, so most tractable opportunity likely remains ahead rather than already spent.

That second point comes from Charles I. Jones, [“The AI Dilemma: Growth versus Existential Risk”](https://www.nber.org/papers/w33602), whose models imply optimal AI-risk spending on the order of **1–5% of world GDP per year** — against roughly \$100 trillion annual world GDP, versus roughly \$2.6 billion of historical AI safety spending total. This does not prove historical spending was highly effective, but it is strong evidence the opportunity set is far from exhausted.

:::details{title="What the spending funded, and the positive vs. offsetting channels"}
**The spending total.** Two pools fund this work. **Non-lab spending** — philanthropy, government safety institutes, academia ([McAleese overview](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation), [Coefficient Giving](https://coefficientgiving.org/research/ai-safety-and-security-need-more-funders/)) — is roughly **\$1.2 billion** cumulatively (~\$0.8B catastrophic-risk philanthropy at under \$200M/year, ~\$0.3B government safety institutes like the UK AISI, ~\$0.1B academic), spread across technical alignment and interpretability; governance, policy, and institutions (CGAI, CSET, CSER, FLI, AI safety institutes); and field-building (SERI MATS, AI Safety Camp, fellowships). **Frontier-lab internal safety work** (preparedness, evals, alignment, interpretability, safety systems, plus compute) adds roughly **\$1.4 billion** more — far above McAleese's staff-only ~\$19–54M/year tally, which he describes as conservative because it excludes lab compute — for about **\$2.6 billion** raw. Because a frontier-lab safety dollar is only about **0.3** as effective as a serious non-lab dollar (commercial and race incentives, capabilities/product entanglement, safetywashing), and this estimate is for marginal non-lab giving, we weight the lab pool down to about **\$0.42 billion**, giving **\$1.6 billion of non-lab-equivalent spending** — the denominator behind the cost figures. ([Full derivation on the broader-event page](/assumption/effect-of-all-ai-safety-spending-on-ai-existential-catastrophe))

**Positive channels.** This spending plausibly helped normalize **frontier-model evals, red-teaming, and preparedness practices**; built a **talent pipeline** into safety, governance, and regulatory work; influenced **frontier-lab governance frameworks** like Anthropic's [Responsible Scaling Policy](https://www.anthropic.com/responsible-scaling-policy) and OpenAI's [Preparedness Framework](https://openai.com/index/updating-our-preparedness-framework/); and contributed to **policy and standards efforts** including the [White House voluntary commitments](https://bidenwhitehouse.archives.gov/wp-content/uploads/2023/09/Voluntary-AI-Commitments-September-2023.pdf). This is not proof of large risk reduction, but it shows the field produced more than abstract academic discussion.

**Offsetting channels.** Not every dollar was strongly beneficial: some safety work also improves **capabilities, robustness, or deployment confidence**; some lab-internal work may function partly as **safetywashing**; some efforts mainly build institutions or talent with **delayed impact**, so realized effects so far may be smaller than eventual effects; and lab safety teams may reduce risk in one channel while making their labs more durable race competitors.
:::

---

## 4. Converting the evidence into values for $X$, $Y$, and $Z$

We place the central extinction-risk reduction at about **0.16 percentage points** ($X$, 16 bp), with bounds of **0.006 percentage points** ($Y$, 0.6 bp) at the low end — a near-break-even world where offsetting channels nearly cancel the gains — and **0.6 percentage points** ($Z$, 60 bp) at the upper end of clearly non-extreme views. The lower bound is below the literature's weakest generic tier because the dominant uncertainty here is not which positive tier applies but whether the net effect was positive at all (caveat 2 below). This reduction is a **direct estimate of what the field achieved** — anchored on the relative-reduction judgment with the literature basis-point benchmarks as evidence for its magnitude — so it does not move when we recount the spending denominator; the denominator only shifts where the field lands relative to those benchmarks. Against the effectiveness-weighted spending, that lands near one commonly cited longtermist benchmark, around **\$100M per basis point**, for three reasons:

- **Higher than generic Rethink-style anchors:** AI safety is a particularly central and time-sensitive x-risk area, and some historical spending really did reach unusually leveraged labs, policy institutions, and training programs.
- **Heavy-tailed upside:** some published estimates imply very high leverage for unusually well-targeted AGI-safety work, and historical value could be dominated by a few wins. That supports putting the central estimate near a strong-opportunity benchmark and leaving substantial upside in the range.
- **Still discounted for external validity:** those estimates often model unusually well-targeted marginal opportunities rather than the realized historical portfolio, which included mixed-effect work, lab-internal work with conflicted incentives, and spending whose benefits are hard to attribute.

At $X = 0.16$ percentage points the central estimate is about **\$100M per basis point** and **\$1.0M per microprobability** — within the range often discussed for strong x-risk opportunities, better than generic Rethink-style modeling, and far cheaper than extreme AGI-safety upper-tail assumptions (though worse than the super-PPE benchmark). The published range spans **\$200k–\$35M per microprobability**, reflecting uncertainty in both the reduction and the spending denominator.

:::details{title="Per-bound arithmetic and relative-reduction check"}
**Central ($X = 0.16$ percentage points = 16 bp).** $$\$1.6\text{B} / 16\text{ bp} \approx \$100\text{M per bp}$$; $0.0016 / 10^{-6} = 1{,}600$ microprobabilities, so $$\$1.6\text{B} / 1{,}600 \approx \$1.0\text{M per microprobability}$$. Under $p_{\text{with}} = 10\%$ this means $p_{\text{without}} \approx 10.16\%$ — a relative risk reduction of $0.16 / 10.16 \approx 1.6\%$.

**Reduction bounds (at central spending).** At $Z = 0.6$ percentage points (60 bp), $$\$1.6\text{B} / 6{,}000 \approx \$267{,}000$$; at $Y = 0.006$ percentage points (0.6 bp), $$\$1.6\text{B} / 60 \approx \$27\text{ million}$$. Folding in the spending-and-weight uncertainty (effective spending plausibly \$0.9–3.3 billion) gives a published 80% interval of about **\$200k–\$35M**.

These figures are broadly consistent with generic x-risk modeling, longtermist benchmarks for strong x-risk opportunities, concrete non-AI catastrophic-risk benchmarks, and the idea that AI safety can be unusually leveraged but not automatically magical.
:::

---

## 5. Caveats and uncertainties

Four caveats matter most:

1. **These are model-based estimates, not empirical measurements.** $X$, $Y$, and $Z$ are inferred by combining formal cost-effectiveness models, community heuristics, and qualitative judgment about what the historical portfolio accomplished.

2. **Net impact may be near zero or negative outside the positive-effect plausible range.** Because safety work interacts with capabilities, investment, and regulation in complicated ways, a full probabilistic model should assign **material lower-tail probability mass to $X \leq 0$**. The positive cost-per-microprobability framing applies only conditional on the net effect being positive.

3. **Much of the benefit may be delayed.** A large share of past spending went into training, institution-building, and capacity that may pay off later than the spending itself.

4. **Very optimistic AGI-safety estimates have limited external validity for the realized portfolio.** Some comparisons imply several percentage points of risk reduction per \$1B. They are evidence that unusually well-targeted AGI-safety work can be extremely leveraged and that historical value may be heavy-tailed, with a few wins driving much of the benefit. But they often model unusually well-targeted marginal opportunities rather than the realized historical portfolio. That portfolio included direct technical and governance wins, lab-internal work with mixed incentives, capability-adjacent safety work, and spending whose benefits may be delayed or hard to attribute.

A further subtlety: the cost divides by **effectiveness-weighted spending**, and the non-lab total (~\$1.2B), the raw frontier-lab total (~\$1.4B), and the ~0.3 weight on lab dollars (Section 3) are all uncertain judgments. Treating lab dollars as near-worthless would lower the central cost toward \$750k per microprobability; counting them at full effectiveness — the raw historical average — would raise it toward \$1.6 million.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on April 6th 2026 by GPT-5.4 and Claude Opus 4.6, with prompts from Impact List staff._

- **June 2026 revision (Claude Opus 4.8).** Reframed from rate-anchored to achievements-anchored and updated the denominator to **~\$1.6B non-lab-equivalent spending** (~\$1.2B non-lab — incl. ~\$0.3B government safety institutes — plus λ ≈ 0.3 × ~\$1.4B raw frontier-lab; build-up on the [broader-event page](/assumption/effect-of-all-ai-safety-spending-on-ai-existential-catastrophe)). The reduction estimate is now 0.16pp (range 0.006–0.6pp), revised upward across the distribution after giving more weight to optimistic AGI-safety estimates, discounted for external validity. Central cost is now ~\$1.0M per microprobability (range \$200k–\$35M, including denominator uncertainty), versus the old \$800k. Raw historical average (all \$2.6B at full weight) ~\$1.6M. The literature basis-point benchmarks are a cross-check on the reduction, not a spending-independent rate.
