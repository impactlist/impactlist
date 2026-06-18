---
id: effect-of-all-ai-safety-spending-on-ai-existential-catastrophe
name: 'Effect of all previous AI safety spending on AI existential catastrophe'
---

## How much has existing AI safety spending reduced AI existential-catastrophe risk?

This document estimates the net effect of cumulative AI safety-related spending through 2025 on the probability of **AI-caused existential catastrophe** this century.

Here "AI-caused existential catastrophe" includes:

- literal human extinction
- irreversible human disempowerment
- stable totalitarian lock-in or other global outcomes that permanently and drastically curtail humanity's future

**Summary:** A reasonable best guess is that cumulative AI safety spending has reduced this broader catastrophe risk by about **0.2 percentage points**, with a {{PLAUSIBLE_RANGE}} of **0.008–0.8 percentage points**.

That corresponds to about **\$800,000 per microprobability** (the spending behind it is detailed in Section 1).

---

## 1. Effective safety spending is about \$1.6 billion

Two broad pools of money fund AI safety work, and they are not equally effective per dollar.

**Non-lab spending** — philanthropy, nonprofits, academia, and government safety institutes — is roughly **\$1.2 billion** cumulatively through 2025 (plausible range \$0.85–1.8 billion): about \$0.8B of catastrophic-risk philanthropy (Open Philanthropy / Coefficient Giving, the Survival and Flourishing Fund, the Long-Term Future Fund, and others — running under ~\$200M/year recently), plus roughly \$0.3B of government safety-institute funding (the UK AISI alone is ~\$127M) and ~\$0.1B of academic and other work.

**Frontier-lab internal safety spending** — the safety-labeled work inside OpenAI, Anthropic, Google DeepMind, and others (alignment, interpretability, evals, control, preparedness, safety systems, and RLHF-type work), plus the compute it uses — is roughly **\$1.4 billion** cumulatively (plausible range **\$0.8–2.5 billion**), on the order of **\$500 million per year** recently. So raw safety spending across all pools is about **\$2.6 billion**.

But a frontier-lab safety dollar buys **less** existential-risk reduction than a serious non-lab dollar — our best guess is about **0.3 as much** (plausible range 0.1–0.6) — because lab work is constrained by commercial and race incentives, is heavily entangled with capabilities and product/deployment, and includes a meaningful amount of safetywashing. Because this page exists to value **marginal donations to non-lab safety organizations**, we weight lab spending by that effectiveness factor:

$$\text{effective spending} = \$1.2\text{B} + 0.3 \times \$1.4\text{B} \approx \$1.6\text{B}$$

This **~\$1.6 billion of non-lab-equivalent spending** is the denominator behind the headline cost. For reference, the **raw historical average** — all \$2.6B divided by the reduction, counting every dollar equally — is about **\$1.3 million per microprobability**; the lower marginal figure below reflects that a serious non-lab dollar outperforms the washing-laden average. The \$1.2B non-lab figure, the \$1.4B lab figure, and the 0.3 weight are all uncertain judgments; their combined effect is carried in the plausible range and in caveat 4.

:::details{title="How the spending estimates are built"}
**Non-lab (~\$1.2B).** Catastrophic-risk philanthropy is the core: Open Philanthropy / Coefficient Giving has directed [over \$330M to AI existential-risk work](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation) and itself estimates total AI-catastrophic-risk philanthropy at **under \$200M/year** ([Coefficient Giving](https://coefficientgiving.org/research/ai-safety-and-security-need-more-funders/)), with the Survival and Flourishing Fund, the Long-Term Future Fund, the former FTX Future Fund, and others bringing the cumulative to roughly \$0.8B. Government **safety institutes** are a newer, growing bucket (UK AISI ~£100M/\$127M, plus US, EU, and others), ~\$0.3B, and academic/other work ~\$0.1B.

**Frontier-lab (~\$1.4B).** [McAleese](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation) counts lab safety _teams_ at only ~\$19–54M/year, and describes that staff-only tally as conservative because it excludes lab compute. Building up instead: a few hundred safety-labeled FTE across the major labs (DeepMind's AGI Safety & Alignment team alone is ~30–50 and growing ~37%/year, [per its summary](https://www.alignmentforum.org/posts/79BPxvSsjzBkiSyTq/agi-safety-and-alignment-at-google-deepmind-a-summary-of); OpenAI and Anthropic larger) at a fully-loaded ~\$0.75M each is ~\$300M/year, plus safety-relevant compute at a low-single-digit share of research compute (recall OpenAI's aspirational, undelivered 20%-to-Superalignment pledge, [OpenAI](https://openai.com/index/introducing-superalignment/)) of ~\$200M/year — about \$500M/year recently, ~\$1.4B integrated from near-zero before ~2020. This counts **safety-labeled work broadly**, not only narrow catastrophic-safety; that breadth is exactly why the effectiveness weight below is well under 1.
:::

:::details{title="Why a lab safety dollar is weighted at about 0.3"}
Frontier-lab safety work is genuinely valuable — mechanistic interpretability, dangerous-capability evaluations, and model-organisms-of-misalignment research need frontier-model access that only labs have — so the weight is well above zero. But several forces hold the average lab dollar below a serious non-lab dollar:

- **Commercial and race incentives:** safety is structurally subordinate to shipping, and labs will not pursue conclusions that imply slowing down.
- **Capabilities and product entanglement:** much "safety" work (RLHF, robustness, deployment evals, content safety) doubles as product improvement rather than x-risk reduction.
- **Safetywashing:** some lab-internal work functions as regulatory or reputational cover — witness OpenAI's undelivered Superalignment compute pledge and dissolved team ([Fortune](https://fortune.com/2024/05/21/openai-superalignment-20-compute-commitment-never-fulfilled-sutskever-leike-altman-brockman-murati/)), and the voluntary, largely unenforced status of responsible-scaling and preparedness frameworks.

Weighting the lab pool at about 0.3 (range 0.1–0.6) discounts this broad safety-labeled spending to its serious, x-risk-relevant equivalent. This is **not** a second penalty on top of the net-of-offsetting-channels reduction estimate (Sections 2–3): it is simply how the field's net achievement is attributed across pools of different productivity, so we can recover the non-lab figure.
:::

---

## 2. Why the broader event should be somewhat more tractable than extinction alone

The extinction-only version of this question put the risk reduction from historical safety spending at about **0.16 percentage points**. ([See the extinction-only version](/assumption/effect-of-all-ai-safety-spending)) Broadening the modeled event to include **irreversible disempowerment** and **stable lock-in** makes it about 1.4x larger (14% versus 10% on the category page), so the impact of safety work should rise — but **less than proportionally**, because the portfolio is somewhat less relevant to the extra pathways than to extinction. A simple relative-relevance model puts the uplift at about **1.3x**, and nearby multipliers stay live (see the sensitivity table in section 3).

The uplift is material rather than tiny because the extra risk mass is mainly irreversible loss of human control — with AI-enabled political lock-in a smaller but important component — and much of the historical AI safety portfolio bears on those pathways too.

:::details{title="The channels, the recent literature, and the relative-relevance arithmetic for 1.3x"}
Many historical AI-safety activities bear on the non-extinction pathways:

- **Technical evals, control, and alignment work** can reduce the probability that advanced systems behave deceptively, seize power, or become impossible to supervise.
- **Governance and standards work** can reduce reckless deployment pressure, preserve human oversight, and create stronger barriers to concentration of power.
- **Preparedness frameworks and safety institutes** help make dangerous capability thresholds legible before the systems are deeply embedded in state and corporate power.
- **Field-building** expands the pool of people who can work on alignment, governance, auditing, standards, and institutional safeguards.

Recent work makes these channels more concrete:

- [Kulveit et al. 2025](https://arxiv.org/abs/2501.16946) argue that gradual AI development can cause permanent disempowerment through economy-, culture-, and state-level dynamics.
- [Dung 2025](https://link.springer.com/article/10.1007/s00146-024-01930-2) argues directly that AI can permanently disempower humanity rather than merely posing extinction risk.
- [Tokson 2025](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5182213) and [Feldstein 2019](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3314162) show how AI surveillance and enforcement technologies can facilitate authoritarian drift and repression.

Those papers do not prove that historical AI safety funding has already bought large amounts of lock-in prevention, but they strengthen the case that governance, preparedness, and institutional work can reduce broader existential-catastrophe pathways, not just literal extinction.

**The arithmetic.** The percentages below are informed judgments, not empirical measurements; the model is meant to make the structure transparent and locate the multiplier in the right region, not to pin down a precise value. A reasonable decomposition of the extra 4 percentage points is:

- about **3 percentage points** from irreversible AI disempowerment or loss of human control
- about **1 percentage point** from stable AI-enabled totalitarian lock-in or comparable permanent political closure

Relative to extinction-prevention impact:

- Technical alignment, control, interpretability, and evals seem about **80%** as relevant to irreversible disempowerment as to extinction, but only about **30%** as relevant to political lock-in. Across the 3:1 split above, that gives 0.675 relative relevance to the extra non-extinction event mass.
- Governance, preparedness, standards, institutions, and field-building seem about **90%** as relevant to irreversible disempowerment and about **80%** as relevant to political lock-in. Across the same split, that gives 0.875 relative relevance.

If roughly **60%** of historical impact came through technical channels and **40%** through governance/institutional channels, the average relevance to the extra non-extinction mass is:

- $0.6 \times 0.675 + 0.4 \times 0.875 = 0.755$

So the uplift over the extinction-only estimate is:

- $1 + (4 / 10) \times 0.755 = 1.302$

Rounded, this supports an uplift of about **1.3x**.
:::

---

## 3. Converting that into numbers

Applying the **1.3x** partial-overlap uplift to the extinction-only anchor of about **0.16 percentage points** gives a broader existential-catastrophe estimate of about **0.2 percentage points** — a reasonable best guess. A full 1.4x uplift (matching the event-size increase) would be too high unless the historical portfolio were equally effective against extinction and non-extinction channels; the overlap is real but incomplete, so the uplift is material without matching the full increase.

### Sensitivity to the uplift

The multiplier is a judgment call, but moving it within a plausible band changes the estimate by only about 10% and does not change the order of magnitude.

:::details{title="Estimate at 1.2x, 1.3x, and 1.4x uplift"}

- 1.2x: 0.19 percentage points → about **\$840,000 per microprobability**
- 1.3x: 0.2 percentage points → about **\$800,000 per microprobability**
- 1.4x: 0.22 percentage points → about **\$730,000 per microprobability**
  :::

### Plausible range: 0.008–0.8 percentage points

We keep a wide plausible range — from **0.008** to **0.8 percentage points** — because the evidence is indirect: there is no clean experiment telling us what the world would look like without AI safety spending. The estimate is a synthesis of historical spending totals, x-risk cost-effectiveness benchmarks, and judgment about how much technical and governance work has mattered in practice. We derive this range the same way as the central estimate: by scaling the revised extinction-only range (about 0.006–0.6 percentage points) by the same partial-overlap multiplier — roughly 1.3x — rather than the full 1.4x event-size multiplier. Both endpoints are positive because the range is the middle 80% (10th–90th percentile) of our full net-effect distribution, and even the 10th-percentile estimate — 0.008 percentage points, a near-break-even outcome — is still slightly above zero. The genuine possibility that the net effect was near zero or negative hasn't gone away: it sits in the roughly 10% of the distribution below the published range, and we treat it as caveat 2 (capabilities spillovers, safetywashing, and safety teams that also make labs more durable race competitors).

:::details{title="What the lower and upper bounds represent"}

- **0.008 percentage points** corresponds to a near-break-even view where the field's gains were largely offset by its negative channels, helping only a little. Some mass sits below this, on a net effect at or below zero.
- **0.8 percentage points** corresponds to a strong view where the best historical spending had unusually high leverage on frontier-lab norms, preparedness, and governance.
  :::

---

## 4. Implied cost per microprobability

Dividing the **~\$1.6 billion** of effective safety spending (Section 1) by the microprobabilities each estimate implies gives roughly **\$800,000 per microprobability** at the central estimate. Once the uncertainty in both the reduction and the spending denominator is included, the plausible range is about **\$150,000** (upper-risk-reduction, lower-spending end) to about **\$30 million** (lower-risk-reduction, higher-spending end).

:::details{title="The conversion at the central, lower, and upper estimates"}
At the central estimate:

- $0.2 \text{ percentage points} = 0.002 \text{ probability} = 2{,}000 \text{ microprobabilities}$
- $$\$1.6\text{B} / 2{,}000 \approx \$800{,}000 \text{ per microprobability}$$

The reduction is the dominant uncertainty. At central spending, its plausible range alone spans $$\$1.6\text{B} / 8{,}000 \approx \$200{,}000 \text{ (at } 0.8 \text{ pp)} \quad\text{to}\quad \$1.6\text{B} / 80 \approx \$20 \text{ million (at } 0.008 \text{ pp)}.$$

Folding in the spending-and-weight uncertainty (effective spending plausibly \$0.9–3.3 billion) gives a published 80% interval of about **\$150,000–\$30 million**.
  :::

---

## 5. Caveats

Several caveats matter:

1. **This is not a direct measurement.**
   It is an inference from cost-effectiveness modeling, historical funding totals, and qualitative evidence about what the field has achieved.

2. **Some probability mass should still sit at zero or below outside the positive-effect plausible range.**
   Some safety work may have accelerated capabilities, increased deployment legitimacy, or mainly reshuffled people across roles. So a full probabilistic model should still assign some chance that net impact was minimal or negative, even though the positive-effect range above is positive.

3. **The best future dollar is not necessarily the historical average dollar.**
   The category page uses this estimate as a baseline anchor for marginal giving, not as proof that every additional donation buys the same amount of risk reduction.

4. **The spending denominator rests on three uncertain judgments.**
   The non-lab total (~\$1.2B), the raw frontier-lab total (~\$1.4B), and the 0.3 effectiveness weight on lab dollars (Section 1) are all estimates, not measurements — and the published range above already reflects their spread. The weight matters most: at λ → 0.6 the central cost rises toward \$1.0 million, at λ → 0.1 it falls toward \$670,000, and counting all lab spending at full effectiveness — the raw historical average — gives about \$1.3 million.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on April 15th 2026 by GPT-5.4, with prompts from Impact List staff._

- **June 2026 revision (Claude Opus 4.8).** Replaced the earlier flat ~\$1 billion spending denominator. Non-lab spending is ~\$1.2B (range \$0.85–1.8B: ~\$0.8B catastrophic-risk philanthropy at under \$200M/yr per Coefficient, ~\$0.3B government safety institutes, ~\$0.1B academic); raw frontier-lab safety-labeled spending is ~\$1.4B (range \$0.8–2.5B; staff + compute ramped from ~2020, since McAleese's \$19–54M/yr base is staff-only). Lab dollars are weighted at **λ ≈ 0.3** (range 0.1–0.6), giving **~\$1.6B non-lab-equivalent**. Cost is achievements-anchored (reduction held fixed; cost = effective spending ÷ reduction): central ~\$800k per microprobability, plausible range \$150k–\$30M (now includes denominator uncertainty). The non-lab, lab, and λ figures are all soft judgments; the raw historical average (all \$2.6B at full weight) is ~\$1.3M per microprobability. An earlier draft of this revision used \$0.85B non-lab / \$1.27B effective / \$794k; corrected after review flagged the non-lab figure (government safety institutes were omitted). The central risk-reduction estimate was then revised upward from 0.16pp to ~0.2pp after giving more weight to optimistic AGI-safety estimates, discounted for external validity.
