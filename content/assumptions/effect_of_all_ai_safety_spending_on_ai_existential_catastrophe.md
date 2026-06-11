---
id: effect-of-all-ai-safety-spending-on-ai-existential-catastrophe
name: 'Effect of all previous AI safety spending on AI existential catastrophe'
---

_The following analysis was done on April 15th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

## How much has existing AI safety spending reduced AI existential-catastrophe risk?

This document estimates the net effect of roughly **\$1 billion** of cumulative AI safety-related spending through 2025 on the probability of **AI-caused existential catastrophe** this century.

Here "AI-caused existential catastrophe" includes:

- literal human extinction
- irreversible human disempowerment
- stable totalitarian lock-in or other global outcomes that permanently and drastically curtail humanity's future

**Summary:** A reasonable best guess is that roughly \$1 billion of AI safety spending has reduced this broader catastrophe risk by about **0.14 percentage points**, with a plausible positive range of **0.014–0.70 percentage points**.

That corresponds to about:

- **14 basis points per \$1 billion**
- **\$71.4 million per basis point**
- **\$714,000 per microprobability**

---

## 1. Historical spending is still on the order of \$1 billion

The best public aggregation we found remains Stephen McAleese's [overview of the AI safety funding situation](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation), together with [Open Philanthropy's advanced-AI grantmaking pages](https://www.openphilanthropy.org/focus/potential-risks-advanced-ai/).

Those sources support the claim that cumulative AI safety-related spending through 2025 is on the order of **\$1 billion**, probably in the high hundreds of millions to low single-digit billions.

Very roughly, that money has funded:

- technical alignment, control, interpretability, and evals
- AI governance and policy work
- field-building and training
- safety institutes, standards, and preparedness work
- internal frontier-lab safety and risk-governance efforts

---

## 2. Why the broader event should be somewhat more tractable than extinction alone

The extinction-only version of this question already had a reasonable best guess of about **0.1 percentage points** of risk reduction per \$1 billion of historical spending. ([See the extinction-only version](/assumption/effect-of-all-ai-safety-spending)) That remains a useful anchor. But once the modeled event is broadened to include **irreversible disempowerment** and **stable lock-in**, the impact of safety work should rise somewhat rather than stay frozen.

That is because many historical AI-safety activities bear on those non-extinction pathways too:

- **Technical evals, control, and alignment work** can reduce the probability that advanced systems behave deceptively, seize power, or become impossible to supervise.
- **Governance and standards work** can reduce reckless deployment pressure, preserve human oversight, and create stronger barriers to concentration of power.
- **Preparedness frameworks and safety institutes** help make dangerous capability thresholds legible before the systems are deeply embedded in state and corporate power.
- **Field-building** expands the pool of people who can work on alignment, governance, auditing, standards, and institutional safeguards.

Recent work makes these channels more concrete:

- [Kulveit et al. 2025](https://arxiv.org/abs/2501.16946) argue that gradual AI development can cause permanent disempowerment through economy-, culture-, and state-level dynamics.
- [Dung 2025](https://link.springer.com/article/10.1007/s00146-024-01930-2) argues directly that AI can permanently disempower humanity rather than merely posing extinction risk.
- [Tokson 2025](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5182213) and [Feldstein 2019](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3314162) show how AI surveillance and enforcement technologies can facilitate authoritarian drift and repression.

Those papers do not prove that historical AI safety funding has already bought large amounts of lock-in prevention. But they do strengthen the case that governance, preparedness, and institutional work can reduce broader existential-catastrophe pathways, not just literal extinction.

The key point is that the uplift should probably be **less than proportional** to the increase in event size, but not much smaller than proportional. The broader event on the category page is about 1.5x larger than the extinction-only event (12% versus 8%). The extra risk mass is not mostly generic bad AI governance; it is mainly irreversible loss of human control, with AI-enabled political lock-in as a smaller but important component. Much of the historical AI safety portfolio is relevant to those pathways.

We use a simple relative-relevance model. The percentages below are informed judgments, not empirical measurements; the model is meant to make the structure of the argument transparent and locate the multiplier in the right region, not to pin down a precise value. The exact split is uncertain, but a reasonable decomposition of the extra 4 percentage points is:

- about **3 percentage points** from irreversible AI disempowerment or loss of human control
- about **1 percentage point** from stable AI-enabled totalitarian lock-in or comparable permanent political closure

Relative to extinction-prevention impact:

- Technical alignment, control, interpretability, and evals seem about **80%** as relevant to irreversible disempowerment as to extinction, but only about **30%** as relevant to political lock-in. Across the 3:1 split above, that gives 0.675 relative relevance to the extra non-extinction event mass.
- Governance, preparedness, standards, institutions, and field-building seem about **90%** as relevant to irreversible disempowerment and about **80%** as relevant to political lock-in. Across the same split, that gives 0.875 relative relevance.

If roughly **60%** of historical impact came through technical channels and **40%** through governance/institutional channels, the average relevance to the extra non-extinction mass is:

- $0.6 \times 0.675 + 0.4 \times 0.875 = 0.755$

So the uplift over the extinction-only estimate is:

- $1 + (4 / 8) \times 0.755 = 1.3775$

Rounded, this supports an uplift of about **1.4x** over the extinction-only spending-effect estimate. The sensitivity table below is therefore important: nearby multipliers remain live, even though 1.4x is the best single estimate.

---

## 3. Converting that into numbers

The broader probability estimate used on the category page is about **12%**, compared with an extinction-only anchor of about **8%**. That is about a **1.5x** increase in the size of the modeled event.

As argued above, a full 1.5x tractability uplift would be too high unless we thought the historical portfolio was equally effective against extinction and non-extinction catastrophe channels. The relative-relevance model gives a **partial-overlap uplift** of about **1.4x**:

- extinction-only anchor: about **0.1 percentage points**
- broader existential-catastrophe estimate: about **0.14 percentage points**

That is directionally supported by three facts:

- the broader event is larger than extinction alone
- many of the same interventions act on both extinction and non-extinction catastrophe channels
- the overlap is real but incomplete, so the uplift should be material without simply matching the full 1.5x event-size increase

So **0.14 percentage points** is a reasonable best guess.

### Sensitivity to the uplift

The exact multiplier is still a judgment call. Nearby values move the estimate as follows:

- 1.2x: 0.12 percentage points → about **\$833,000 per microprobability**
- 1.4x: 0.14 percentage points → about **\$714,000 per microprobability**
- 1.5x: 0.15 percentage points → about **\$667,000 per microprobability**

This sensitivity is meaningful, but it does not change the order of magnitude.

### Plausible positive range: 0.014–0.70 percentage points

We keep a wide positive range:

- **0.014 percentage points** corresponds to a pessimistic-but-still-positive view where the field helped a bit, but far less than advocates hoped.
- **0.70 percentage points** corresponds to a strong view where the best historical spending had unusually high leverage on frontier-lab norms, preparedness, and governance.

This range is deliberately wide because the evidence is indirect. There is no clean experiment telling us what the world would look like without AI safety spending. The estimate is a synthesis of historical spending totals, x-risk cost-effectiveness bars, and judgment about how much technical and governance work has mattered in practice.

---

## 4. Implied cost per microprobability

At the central estimate:

- $0.14 \text{ percentage points} = 0.0014 \text{ probability}$
- $0.0014 / 10^{-6} = 1{,}400 \text{ microprobabilities}$
- $$\$1\text{B} / 1{,}400 \approx \$714{,}000 \text{ per microprobability}$$

At the lower end of the range:

- $0.014 \text{ percentage points} = 140 \text{ microprobabilities}$
- $$\$1\text{B} / 140 \approx \$7.1 \text{ million per microprobability}$$

At the upper end of the range:

- $0.70 \text{ percentage points} = 7{,}000 \text{ microprobabilities}$
- $$\$1\text{B} / 7{,}000 \approx \$143{,}000 \text{ per microprobability}$$

So the best single estimate is roughly **\$714,000 per microprobability**, with a wide positive range from about **\$143,000** to about **\$7.1 million** on the field-level approach alone.

---

## 5. Caveats

Several caveats matter:

1. **This is not a direct measurement.**  
   It is an inference from cost-effectiveness modeling, historical funding totals, and qualitative evidence about what the field has achieved.

2. **Some probability mass should still sit at zero or below.**  
   Some safety work may have accelerated capabilities, increased deployment legitimacy, or mainly reshuffled people across roles. So a full probabilistic model should still assign some chance that net impact was minimal or negative.

3. **The best future dollar is not necessarily the historical average dollar.**  
   The category page uses this estimate as a baseline anchor for marginal giving, not as proof that every additional donation buys the same amount of risk reduction.

4. **The spending total and the credited achievements are not perfectly aligned.**  
   The roughly \$1 billion total counts frontier-lab internal safety work only at a conservative few tens of millions of dollars per year, while some of the clearest achievements in the positive-channels story (responsible-scaling policies, preparedness frameworks, frontier eval norms) were substantially produced by lab-internal investment beyond that. To the extent that is true, the per-dollar effect of the counted spending is overstated; including all lab-internal safety investment in the denominator would raise the cost per microprobability roughly proportionally.

---

## 6. Conclusion

The best single estimate is:

- **Risk reduction from roughly \$1B of AI safety spending:** about **0.14 percentage points**
- **Plausible positive range:** about **0.014–0.70 percentage points**

In cost-effectiveness terms, that implies about **\$714,000 per microprobability** of reducing AI-caused existential catastrophe risk.

{{CONTRIBUTION_NOTE}}
