---
id: effect-of-top-conflict-mitigation-spending
name: 'Effect of top conflict-mitigation spending'
---

_The following analysis was done on April 14th 2026 by GPT-5.4, with prompts from Impact List staff._

## How much conflict does top-tier conflict-mitigation spending avert?

This document analyzes the question:

> If a donor gives an additional **\$1 million** to a top conflict-mitigation organization such as the Centre for Humanitarian Dialogue (HD) or the International Crisis Group (ICG), what is the probability that this averts one **representative serious conflict-year**?

Let:

- $p$ = the probability that **\$1 million** of additional top-tier conflict-mitigation spending averts one representative serious conflict-year
- $Y, Z$ = lower and upper bounds of a {{PLAUSIBLE_RANGE}} for $p$

A reasonable summary is:

- **Best-guess:** $p \approx 0.1\%$
- **Plausible range:** $Y \approx 0.03\%$, $Z \approx 0.3\%$

That is, an additional **\$1 million** to a top-tier mediation / diplomacy / conflict-analysis organization plausibly has about a **0.1%** chance of averting one representative serious conflict-year, with a plausible range of about **0.03–0.3%**.

This is the single most uncertain input in the category estimate, and reasonable people could easily land somewhat below or above the range used here.

---

## 1. Start from the system-level evidence

[Clayton and Dorussen 2022](https://doi.org/10.1177/0022343321990076) imply that the combined conflict-management system averted a rough system-wide average of **1.84 additional conflict-years per year** — about **123 additional conflict-years** between **1946 and 2013** that would otherwise have occurred. This is our concrete starting point, but it describes the whole system, not philanthropy, so it needs heavy discounting before it becomes the number we want.

:::details{title="The 1.84 figure and its caveats"}
Clayton and Dorussen estimate that without conflict management there would have been about **20 additional intrastate conflicts**, equivalent to **123 additional conflict-years**, between **1946 and 2013**. Over those 67 years that is:

$$
\frac{123}{67} \approx 1.84
$$

additional conflict-years per year avoided by the system.

That figure is not yet the number we want:

- it refers to the **whole system**, not philanthropy specifically
- it mixes mediation and peacekeeping rather than isolating NGOs
- it is based on observational evidence, so selection effects remain possible
- it is a **historical average over 1946-2013**, not a clean estimate of marginal effectiveness in the mid-2020s; conflict patterns, international institutions, and the mediation ecosystem have all changed, so it could overstate or understate current effectiveness
:::

---

## 2. What share of that system-wide effect should we assign to top-tier philanthropy?

We assign top-tier philanthropy about **2–8%** of the system-wide effect, with a **central view of 5%**. That is far below 100% — private peacebuilding is a small slice of total spending — but somewhat above its raw spending share, because the category targets unusually leveraged **top-tier** mediation organizations rather than the average private dollar. This is the most opinion-dependent step in the derivation and is best understood as a judgment call, not a tightly evidenced interval.

:::details{title="Why 2–8%, and how a skeptic or optimist would differ"}
Coefficient / Open Philanthropy notes that private peacebuilding spending was probably only about **\$150–300 million** per year, while the UN alone spent about **\$6.8 billion** on peacebuilding projects in 2013 and another **\$8 billion** on peacekeeping operations, and the U.S. spent about **\$4.1 billion** per year in peacebuilding in countries where it was not actively involved. ([Coefficient Giving / Open Philanthropy 2022](https://coefficientgiving.org/research/civil-conflict-reduction/)) On raw spending shares alone, private philanthropy would account for only a small fraction of the system.

But effect share need not equal spending share, because:

- peacekeeping is extremely expensive relative to NGO mediation and analysis
- the category is explicitly about **top-tier** organizations, not the average private dollar
- the literature suggests that **mediation** is one of the more important non-coercive tools for halting hostilities

So a somewhat larger effect share than spending share is reasonable, while still leaving top-tier philanthropy as only a small part of the total ecosystem.

A skeptic could argue for something more like **0.5–2%** if governments and the UN are doing almost all of the causal work. A more optimistic reader could argue for something more like **10–15%** if top mediation NGOs are much more leveraged per dollar than the rest of the system.
:::

---

## 3. What budget should we divide by?

We divide by combined annual budgets of about **\$80 million**, anchored on HD and ICG as a pair of organizations close to the intended target of this category. That is not the whole philanthropic peacebuilding space; it is the especially strong and clearly relevant slice the category is trying to model.

:::details{title="The HD and ICG budget anchors"}
- HD reported **50 million Swiss francs (about \$56 million)** in contribution income in 2023 and more than **70 peacemaking projects**. ([HD Annual Report 2023](https://hdcentre.org/wp-content/uploads/2024/07/Annual-report-2023_English-Final_Web.pdf))
- ICG reported **\$23.5 million** in revenue in 2024. ([ProPublica 2024](https://projects.propublica.org/nonprofits/organizations/525170039))

Taken together, those imply combined annual budgets of about **\$80 million**.
:::

---

## 4. Implied effect per \$1 million

Combining the three inputs — **1.84 conflict-years/year** system-wide, a **2–8%** top-tier share, and an **\$80 million** budget denominator — gives about **0.05% at the lower end** and **0.18% at the upper end** per **\$1 million**, with a central BOTEC of about **0.12%**. That central neighborhood is why the category uses a rounded **0.1%** as the point estimate.

:::details{title="The per-million-dollar arithmetic"}
The implied effect attributable to top-tier philanthropy is:

$$
1.84 \times 0.02 \approx 0.037
$$

to

$$
1.84 \times 0.08 \approx 0.147
$$

conflict-years averted per year across the relevant top-tier philanthropic portfolio. Dividing by annual budgets gives:

$$
\frac{0.037}{80} \approx 0.00046
$$

to

$$
\frac{0.147}{80} \approx 0.00184
$$

conflict-years averted per **\$1 million** — about **0.05%** at the lower end and **0.18%** at the upper end. The central BOTEC is:

$$
\frac{1.84 \times 0.05}{80} \approx 0.00115
$$

or about **0.12%** per **\$1 million**.

This arithmetic also implicitly assumes the conflicts these organizations engage with are of roughly **representative serious-conflict-year** size. If top mediation organizations disproportionately work on very high-burden conflicts, the estimate could understate their effect; if they often work on lower-burden or earlier-stage conflicts, it could overstate it.
:::

---

## 5. Why widen the plausible range to 0.03–0.3%?

The direct BOTEC gives **0.05–0.18%**, but that span only sweeps the headline share and budget parameters. We widen to **0.03–0.3%** to absorb structural uncertainty the arithmetic holds fixed:

- the NGO share of system-level effect could be below **2%** if governments and regional actors do more of the real causal work, or above **8%** if top mediation NGOs are much more leveraged per dollar than average peacekeeping or state spending
- the budget denominator is a mix of averages, while marginal dollars may go to better or worse opportunities than the portfolio mean
- Clayton and Dorussen's estimate is itself uncertain and based on observational data

---

## 6. Cross-check against Open Philanthropy's HD BOTEC

Coefficient Giving / Open Philanthropy's HD BOTEC argues that a marginal HD mediation-year would only need about a **0.52%** chance of ending a war one year sooner to clear a very high philanthropic-return bar. ([Coefficient Giving / Open Philanthropy 2022](https://coefficientgiving.org/research/civil-conflict-reduction/)) That **0.52%** is a break-even threshold in a different BOTEC, not an estimate of the true marginal probability, so it should not be compared one-for-one with the **0.1%** point estimate here — it remains the direct arithmetic in sections 1-4, not this figure, that drives our estimate.

:::details{title="The OpenPhil break-even setup, and what does drive our estimate"}
Their BOTEC notes that HD's annual budget was about **\$42 million** across **23 conflict zones**, or about **\$2 million per country-year**, and uses that to derive the **0.52%** break-even chance.

The main basis for the central tractability estimate on this page is instead the direct arithmetic above: **1.84** system-level conflict-years avoided per year, a **2–8%** top-tier philanthropic share, and about **\$80 million** of relevant budgets imply about **0.05–0.18%** per **\$1 million**, supporting a rounded best guess of **0.1%**.
:::

---

## 7. Marginal vs. average and room for more funding

The budget numbers above are **average** portfolio budgets, while a new donation buys the **marginal** project or expansion. This could make the estimate too optimistic if the best projects are already fully funded, if extra money mainly goes to lower-priority crises, or if organizations face management or political bottlenecks rather than funding bottlenecks. On the other hand, HD's annual report explicitly says it is **expanding the scope of fundraising** and welcomes more **flexible funding** to remain agile — weak but real evidence that room for more funding is not zero. ([HD Annual Report 2023](https://hdcentre.org/wp-content/uploads/2024/07/Annual-report-2023_English-Final_Web.pdf)) On balance, this supports a round central **0.1%** rather than treating the upper end of the BOTEC range as typical.

---

## Bottom line

The **0.1%** best guess (plausible range **0.03–0.3%**) is uncertain but not arbitrary: it comes from a concrete chain of reasoning that starts with the best available system-level evidence, heavily discounts for attribution, and then divides by the budgets of the kinds of organizations the category is actually trying to model.
