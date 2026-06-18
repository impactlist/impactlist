---
id: effect-of-all-ai-safety-spending-on-ai-existential-catastrophe
name: 'Effect of all previous AI safety spending on AI existential catastrophe'
---

## How much has existing AI safety spending reduced AI existential-catastrophe risk?

This document estimates the net effect of roughly **\$1 billion** of cumulative AI safety-related spending through 2025 on the probability of **AI-caused existential catastrophe** this century.

Here "AI-caused existential catastrophe" includes:

- literal human extinction
- irreversible human disempowerment
- stable totalitarian lock-in or other global outcomes that permanently and drastically curtail humanity's future

**Summary:** A reasonable best guess is that roughly \$1 billion of AI safety spending has reduced this broader catastrophe risk by about **0.16 percentage points**, with a {{PLAUSIBLE_RANGE}} of **0.007–0.65 percentage points**.

That corresponds to about **\$625,000 per microprobability**.

---

## 1. Historical spending is on the order of \$1 billion

Cumulative AI safety-related spending through 2025 is on the order of **\$1 billion**, probably in the high hundreds of millions to low single-digit billions.

:::details{title="Sources and what the money funded"}
The best public aggregation we found remains Stephen McAleese's [overview of the AI safety funding situation](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation), together with [Coefficient Giving's Navigating Transformative AI fund page](https://coefficientgiving.org/funds/navigating-transformative-ai). Both support approximately \$1 billion in spending.

Very roughly, that money has funded:

- technical alignment, control, interpretability, and evals
- AI governance and policy work
- field-building and training
- safety institutes, standards, and preparedness work
- internal frontier-lab safety and risk-governance efforts
  :::

---

## 2. Why the broader event should be somewhat more tractable than extinction alone

The extinction-only version of this question had a best guess of about **0.125 percentage points** of risk reduction per \$1 billion of historical spending. ([See the extinction-only version](/assumption/effect-of-all-ai-safety-spending)) Broadening the modeled event to include **irreversible disempowerment** and **stable lock-in** makes it about 1.4x larger (14% versus 10% on the category page), so the impact of safety work should rise — but **less than proportionally**, because the portfolio is somewhat less relevant to the extra pathways than to extinction. A simple relative-relevance model puts the uplift at about **1.3x**, and nearby multipliers stay live (see the sensitivity table in section 3).

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

Applying the **1.3x** partial-overlap uplift to the extinction-only anchor of about **0.125 percentage points** gives a broader existential-catastrophe estimate of about **0.16 percentage points** — a reasonable best guess. A full 1.4x uplift (matching the event-size increase) would be too high unless the historical portfolio were equally effective against extinction and non-extinction channels; the overlap is real but incomplete, so the uplift is material without matching the full increase.

### Sensitivity to the uplift

The multiplier is a judgment call, but moving it within a plausible band changes the estimate by only about 10% and does not change the order of magnitude.

:::details{title="Estimate at 1.2x, 1.3x, and 1.4x uplift"}

- 1.2x: 0.15 percentage points → about **\$667,000 per microprobability**
- 1.3x: 0.16 percentage points → about **\$625,000 per microprobability**
- 1.4x: 0.175 percentage points → about **\$571,000 per microprobability**
  :::

### Plausible range: 0.007–0.65 percentage points

We keep a wide plausible range — from **0.007** to **0.65 percentage points** — because the evidence is indirect: there is no clean experiment telling us what the world would look like without AI safety spending. The estimate is a synthesis of historical spending totals, x-risk cost-effectiveness bars, and judgment about how much technical and governance work has mattered in practice. We derive this range the same way as the central estimate: by scaling the extinction-only version's range (about 0.005–0.5 percentage points) by the same partial-overlap multiplier — roughly 1.3x — rather than the full 1.4x event-size multiplier. Both endpoints are positive because the range is the middle 80% (10th–90th percentile) of our full net-effect distribution, and even the 10th-percentile estimate — 0.007 percentage points, a near-break-even outcome — is still slightly above zero. The genuine possibility that the net effect was near zero or negative hasn't gone away: it sits in the roughly 10% of the distribution below the published range, and we treat it as caveat 2 (capabilities spillovers, safetywashing, and safety teams that also make labs more durable race competitors).

:::details{title="What the lower and upper bounds represent"}

- **0.007 percentage points** corresponds to a near-break-even view where the field's gains were largely offset by its negative channels, helping only a little. Some mass sits below this, on a net effect at or below zero.
- **0.65 percentage points** corresponds to a strong view where the best historical spending had unusually high leverage on frontier-lab norms, preparedness, and governance.
  :::

---

## 4. Implied cost per microprobability

Dividing \$1 billion by the microprobabilities each estimate implies gives roughly **\$625,000 per microprobability** at the central estimate, with a wide range from about **\$154,000** (upper-risk-reduction end) to about **\$14.3 million** (lower, near-break-even end) on the field-level approach alone.

:::details{title="The conversion at the central, lower, and upper estimates"}
At the central estimate:

- $0.16 \text{ percentage points} = 0.0016 \text{ probability}$
- $0.0016 / 10^{-6} = 1{,}600 \text{ microprobabilities}$
- $$\$1\text{B} / 1{,}600 \approx \$625{,}000 \text{ per microprobability}$$

At the lower end of the range:

- $0.007 \text{ percentage points} = 70 \text{ microprobabilities}$
- $$\$1\text{B} / 70 \approx \$14.3 \text{ million per microprobability}$$

At the upper end of the range:

- $0.65 \text{ percentage points} = 6{,}500 \text{ microprobabilities}$
- $$\$1\text{B} / 6{,}500 \approx \$154{,}000 \text{ per microprobability}$$
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

4. **The spending total and the credited achievements are not perfectly aligned.**  
   The roughly \$1 billion total counts frontier-lab internal safety work only at a conservative few tens of millions of dollars per year, while some of the clearest achievements in the positive-channels story (responsible-scaling policies, preparedness frameworks, frontier eval norms) were substantially produced by lab-internal investment beyond that. To the extent that is true, the per-dollar effect of the counted spending is overstated; including all lab-internal safety investment in the denominator would raise the cost per microprobability roughly proportionally.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on April 15th 2026 by GPT-5.4, with prompts from Impact List staff._
