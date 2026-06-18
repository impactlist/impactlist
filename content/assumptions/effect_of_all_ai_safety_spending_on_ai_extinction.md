---
id: effect-of-all-ai-safety-spending-on-ai-extinction
name: 'Effect of all previous AI safety spending on AI extinction'
---

## How much has existing AI safety spending reduced AI extinction risk?

This document analyzes the question:

> By how many percentage points has AI safety-related spending to date reduced the probability of AI-caused human extinction this century?

We measure the effect as an **absolute risk reduction** in percentage points: the difference between extinction risk in the actual world, with existing AI safety spending, and extinction risk in a counterfactual world where that spending had not happened.

For concreteness, use the current working estimate that AI-caused extinction risk this century is about **10%** in the actual world, reflecting a rough synthesis of expert surveys, forecasting tournaments, and public estimates. ([See detailed justification](/assumption/ai-doom-probability))

A reasonable summary is:

- **Best guess:** about 0.10 percentage points
- **{{PLAUSIBLE_RANGE_CAP}}:** about -0.03 to 0.4 percentage points

That is, cumulative AI safety-related spending to date has plausibly reduced AI-caused extinction risk this century by about **0.10 percentage points** (for example, from about 10.10% to 10.0%), with a plausible range from **increasing risk by 0.03 percentage points** to **reducing risk by 0.4 percentage points**. The lower end is negative because capabilities spillovers, safetywashing, deployment acceleration, and safety teams that also make labs more durable race competitors could plausibly have outweighed the gains in a bad-but-not-remote part of the distribution.

A **basis point** (bp) is 0.01 percentage points, so the 0.10 percentage-point best guess is 10 bp. Set against the effectiveness-weighted spending that produced it — about **\$1.6 billion** in serious, non-lab-equivalent dollars (Section 3) — that is about **\$1.6 million per microprobability**, or roughly **\$160 million per basis point** of extinction-risk reduction. Conditional on the net effect being positive, the plausible cost range is roughly **\$250,000–\$80 million per microprobability**; the full distribution also includes net-harm cases rather than merely high-cost positive cases. (Counting all \$2.6 billion of raw spending equally, the raw historical average is about \$2.6 million per microprobability.)

---

## 1. Conceptual framing

The central estimate is a 0.10 percentage-point absolute reduction. If current AI extinction risk is about 10%, that means the counterfactual risk without past AI safety spending would be about 10.10% — a **relative** risk reduction of about $0.10 / 10.10 \approx 1.0\%$.

There is no clean empirical way to measure this directly. We anchor it on what cost-effectiveness research implies good safety work achieves — expressed as **basis points of risk reduction per \$1 billion** (Section 2) — together with a direct judgment of what the historical portfolio plausibly accomplished. Dividing the resulting reduction into the effectiveness-weighted spending that produced it (Section 3) gives the cost per unit of risk reduction (Section 4).

---

## 2. What the literature says about "basis points per \$1B"

Existing cost-effectiveness work clusters into three tiers:

- **Generic x-risk interventions:** about **0.2–7 bp per \$1B**
- **Good or very good x-risk opportunities:** about **10–30 bp per \$1B**
- **Exceptional upper-tail cases:** tens to hundreds of bp per \$1B

So if historical AI safety spending achieved only **0.01 percentage points per \$1B** (1 bp) or less, it was relatively weak by longtermist standards; if it achieved **0.5+ percentage points per \$1B** (50+ bp), it was unusually strong. Those tiers inform the estimate below, but they are not measurements of the realized historical portfolio, and the EA Forum benchmarks deserve somewhat reduced weight because they were written inside a community already unusually convinced of longtermist interventions.

:::details{title="The source-by-source benchmarks behind the three tiers"}
**Rethink Priorities' CURVE modeling (generic anchor).** Rethink models x-risk interventions in basis points of risk reduction per \$1B in its [Laura Duffy 2023 analysis](https://rethinkpriorities.org/research-area/is-x-risk-the-most-cost-effective-if-we-count-only-the-next-few-generations/) and [2024 Portfolio Builder](https://rethinkpriorities.org/research-area/key-cases-with-the-portfolio-builder/). The rough derived range for generic x-risk work is about **0.2–7 bp per \$1B** (0.002–0.07 percentage points), with **1.5–7.2 bp per \$1B** already enough to compete with strong animal-welfare or health programs. This is a useful lower anchor but not an AI-specific verdict: it is for generic work, not the best AI opportunities, and does not capture AI-specific channels like frontier-lab governance and eval norms.

**EA community benchmarks (strong opportunities).** Longtermist discussions often quote dollars per basis point. Linch Zhang's [post on trading EA dollars against existential risk](https://forum.effectivealtruism.org/posts/cKPkimztzKoCkZ75r/how-many-ea-2021-usds-would-you-trade-off-against-a-0-01) gives **\$100M per bp** (10 bp per \$1B, 0.1 percentage points) as a level he would feel comfortable funding. Spencer Ericson's [“Thresholds #1”](https://forum.effectivealtruism.org/posts/bmrr8DFufz5Yh8yRC/thresholds-1-what-does-good-look-like-for-longtermism) gives **\$154M per bp** (6.5 bp per \$1B) and **\$34M per bp** (29 bp per \$1B). These are useful evidence about what informed longtermists have considered plausible or fundable, but they are selected, partly normative benchmarks rather than independent measurements of what past AI safety spending achieved.

**Other risk domains (upper-tail cases).** The EA Forum [“Speedrun: super PPE”](https://forum.effectivealtruism.org/posts/wAzYXjGxhJmrxunct/speedrun-develop-an-affordable-super-ppe) post reports a median around **\$27M per bp** (37 bp per \$1B, 0.37 percentage points) — more optimistic than generic anchors, showing very strong x-risk work can beat 10 bp/\$1B. Denkenberger et al.'s [resilient-foods vs. AGI-safety comparison](https://www.sciencedirect.com/science/article/abs/pii/S2212420922000176) discusses an AGI-safety benchmark on the order of **hundreds of bp per \$1B** (e.g. 500 bp = 5 percentage points), which should be read as an upper-tail optimistic assumption, not a median.
:::

---

## 3. AI-specific considerations

Two facts shape where AI safety lands within those generic tiers. First, the relevant quantity is the **net realized effect** — the gross benefit of the best parts of the portfolio (eval and preparedness norms, a safety/governance talent pipeline, influence on frontier-lab frameworks) minus offsetting channels (capabilities spillovers, safetywashing, delayed benefits, and safety teams that also make labs more durable race competitors). Second, the field is tiny relative to the stakes, so most tractable opportunity likely remains ahead rather than already spent.

That second point comes from Charles I. Jones, [“The AI Dilemma: Growth versus Existential Risk”](https://www.nber.org/papers/w33602), whose models imply optimal AI-risk spending on the order of **1–5% of world GDP per year** — against roughly \$100 trillion annual world GDP, versus roughly \$2.6 billion of historical AI safety spending total. This does not prove historical spending was highly effective, but it is strong evidence the opportunity set is far from exhausted.

:::details{title="What the spending funded, and the positive vs. offsetting channels"}
**The spending total.** Two pools fund this work. **Non-lab spending** — philanthropy, government safety institutes, academia ([McAleese overview](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation), [Coefficient Giving](https://coefficientgiving.org/research/ai-safety-and-security-need-more-funders/)) — is roughly **\$1.2 billion** cumulatively (~\$0.8B catastrophic-risk philanthropy at under \$200M/year, ~\$0.3B government safety institutes like the UK AISI, ~\$0.1B academic), spread across technical alignment and interpretability; governance, policy, and institutions (CGAI, CSET, CSER, FLI, AI safety institutes); and field-building (SERI MATS, AI Safety Camp, fellowships). **Frontier-lab internal safety work** (preparedness, evals, alignment, interpretability, safety systems, plus compute) adds roughly **\$1.4 billion** more — far above McAleese's staff-only ~\$19–54M/year tally, which he describes as conservative because it excludes lab compute — for about **\$2.6 billion** raw. Because a frontier-lab safety dollar is only about **0.3** as effective as a serious non-lab dollar (commercial and race incentives, capabilities/product entanglement, safetywashing), and this estimate is for marginal non-lab giving, we weight the lab pool down to about **\$0.42 billion**, giving **\$1.6 billion of non-lab-equivalent spending** — the denominator behind the cost figures. ([Full derivation on the broader-event page](/assumption/effect-of-all-ai-safety-spending-on-ai-existential-catastrophe))

**Positive channels.** This spending plausibly helped normalize **frontier-model evals, red-teaming, and preparedness practices**; built a **talent pipeline** into safety, governance, and regulatory work; influenced **frontier-lab governance frameworks** like Anthropic's [Responsible Scaling Policy](https://www.anthropic.com/responsible-scaling-policy) and OpenAI's [Preparedness Framework](https://openai.com/index/updating-our-preparedness-framework/); and contributed to **policy and standards efforts** including the [White House voluntary commitments](https://bidenwhitehouse.archives.gov/wp-content/uploads/2023/09/Voluntary-AI-Commitments-September-2023.pdf). This is not proof of large risk reduction, but it shows the field produced more than abstract academic discussion.

**Offsetting channels.** Not every dollar was strongly beneficial: some safety work also improves **capabilities, robustness, or deployment confidence**; some lab-internal work may function partly as **safetywashing**; some efforts mainly build institutions or talent with **delayed impact**, so realized effects so far may be smaller than eventual effects; and lab safety teams may reduce risk in one channel while making their labs more durable race competitors.
:::

---

## 4. Estimate and range

We place the central extinction-risk reduction at about **0.10 percentage points** (10 bp), with a plausible range of **-0.03 to 0.4 percentage points** (-3 to 40 bp). The low end is a net-harm world where offsetting channels outweighed the gains. The high end is a strong but still non-extreme view of what the best historical safety work achieved.

The lower bound is below zero because the dominant uncertainty here is not which positive tier applies but whether the net effect was positive at all (caveat 2 below). This reduction is a **direct estimate of what the field achieved** — anchored on the relative-reduction judgment with the literature basis-point benchmarks as evidence for its magnitude — so it does not move when we recount the spending denominator; the denominator only shifts where the field lands relative to those benchmarks. Against the effectiveness-weighted spending, the central estimate is about **\$160M per basis point**, for three reasons:

- **Higher than generic Rethink-style anchors:** AI safety is a particularly central and time-sensitive x-risk area, and some historical spending really did reach unusually leveraged labs, policy institutions, and training programs.
- **Selected optimistic evidence still matters:** some published estimates imply very high leverage for unusually well-targeted AGI-safety work, and historical value could be dominated by a few wins.
- **But the realized portfolio was mixed:** the strongest benchmarks often model unusually good marginal opportunities rather than the historical average, which included lab-internal work with conflicted incentives, capability-adjacent safety work, and spending whose benefits are hard to attribute.

At 0.10 percentage points, the central estimate is about **\$160M per basis point** and **\$1.6M per microprobability** — still strong relative to generic Rethink-style modeling, but above the commonly cited \$100M-per-basis-point benchmark. Conditional on net benefit being positive, the cost range is roughly **\$250k–\$80M per microprobability**, reflecting uncertainty in both the reduction and the spending denominator.

---

## 5. Caveats and uncertainties

Five caveats matter most:

1. **These are model-based estimates, not empirical measurements.** The central estimate and plausible range are inferred by combining formal cost-effectiveness models, community heuristics, and qualitative judgment about what the historical portfolio accomplished.

2. **Net impact may be negative.** Because safety work interacts with capabilities, investment, and regulation in complicated ways, the plausible range itself includes a lower end where the net effect increased risk. The positive cost-per-microprobability framing applies only conditional on the net effect being positive.

3. **Much of the benefit may be delayed.** A large share of past spending went into training, institution-building, and capacity that may pay off later than the spending itself.

4. **Very optimistic AGI-safety estimates have limited external validity for the realized portfolio.** Some comparisons imply several percentage points of risk reduction per \$1B, and some EA Forum benchmarks imply around \$100M per basis point for strong opportunities. They are evidence that unusually well-targeted AGI-safety work can be extremely leveraged and that historical value may be heavy-tailed, with a few wins driving much of the benefit. But they often come from selected longtermist discussions or model unusually good marginal opportunities rather than the realized historical portfolio. That portfolio included direct technical and governance wins, lab-internal work with mixed incentives, capability-adjacent safety work, and spending whose benefits may be delayed or hard to attribute.

5. **The spending denominator rests on uncertain weights.** The cost divides by **effectiveness-weighted spending**, and the non-lab total (~\$1.2B), the raw frontier-lab total (~\$1.4B), and the ~0.3 weight on lab dollars (Section 3) are all uncertain judgments. Treating lab dollars as near-worthless would lower the central cost toward \$1.2 million per microprobability; counting them at full effectiveness — the raw historical average — would raise it toward \$2.6 million.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on April 6th 2026 by GPT-5.4 and Claude Opus 4.6, with prompts from Impact List staff._

- **June 2026 revision (Claude Opus 4.8).** Reframed from rate-anchored to achievements-anchored and updated the denominator to **~\$1.6B non-lab-equivalent spending** (~\$1.2B non-lab — incl. ~\$0.3B government safety institutes — plus λ ≈ 0.3 × ~\$1.4B raw frontier-lab; build-up on the [broader-event page](/assumption/effect-of-all-ai-safety-spending-on-ai-existential-catastrophe)). The reduction estimate is now 0.10pp (range -0.03 to 0.4pp), after reducing the weight on selected EA Forum / longtermist-threshold benchmarks and allowing the 10th-percentile endpoint to be net harmful. Central cost is now ~\$1.6M per microprobability (conditional positive-effect range \$250k–\$80M, including denominator uncertainty). Raw historical average (all \$2.6B at full weight) ~\$2.6M. The literature basis-point benchmarks are a cross-check on the reduction, not a spending-independent rate.
