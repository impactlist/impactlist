---
id: effect-of-top-conflict-mitigation-spending
name: 'Effect of top conflict-mitigation spending'
---

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

## How much conflict does top-tier conflict-mitigation spending avert?

This document analyzes the question:

> If a donor gives an additional **\$1 million** to a top conflict-mitigation organization such as the Centre for Humanitarian Dialogue (HD) or the International Crisis Group (ICG), what is the probability that this averts one **representative serious conflict-year**?

Let:

- $p$ = the probability that **\$1 million** of additional top-tier conflict-mitigation spending averts one representative serious conflict-year
- $Y, Z$ = lower and upper bounds of a practical positive range for $p$

A reasonable summary is:

- **Best-guess:**  
  $p \approx 0.1\%$
- **Practical positive range:**  
  $Y \approx 0.03\%$, $Z \approx 0.3\%$

That is, an additional **\$1 million** to a top-tier mediation / diplomacy / conflict-analysis organization plausibly has about a **0.1%** chance of averting one representative serious conflict-year, with a practical range of about **0.03–0.3%**.

This is the single most uncertain input in the category estimate, and reasonable people could easily land somewhat below or above the range used here.

---

## 1. Start from the system-level evidence

[Clayton and Dorussen 2022](https://doi.org/10.1177/0022343321990076) estimate that without conflict management there would have been about **20 additional intrastate conflicts**, equivalent to **123 additional conflict-years**, between **1946 and 2013**.

That implies a rough system-wide average of:

$$
\frac{123}{67} \approx 1.84
$$

additional conflict-years per year that were avoided by the combined conflict-management system.

This figure is useful, but it is not yet the number we want:

- it refers to the **whole system**, not philanthropy specifically
- it mixes mediation and peacekeeping rather than isolating NGOs
- it is based on observational evidence, so selection effects remain possible

Still, it gives us a concrete starting point.

One important caveat is that this is a **historical average over 1946-2013**, not a clean estimate of marginal effectiveness in the mid-2020s. Conflict patterns, international institutions, and the mediation ecosystem have all changed. That historical average could therefore overstate or understate current effectiveness.

---

## 2. What share of that system-wide effect should we assign to top-tier philanthropy?

The answer is clearly **far below 100%**. Coefficient / Open Philanthropy notes that private peacebuilding spending was probably only about **\$150–300 million** per year, while the UN alone spent about **\$6.8 billion** on peacebuilding projects in 2013 and another **\$8 billion** on peacekeeping operations, and the U.S. spent about **\$4.1 billion** per year in peacebuilding in countries where it was not actively involved. ([Coefficient Giving / Open Philanthropy 2022](https://coefficientgiving.org/research/civil-conflict-reduction/))

So if we looked only at raw spending shares, private philanthropy would seem to account for only a small fraction of the system.

But we should not simply assume **effect share = spending share**, because:

- peacekeeping is extremely expensive relative to NGO mediation and analysis
- the category is explicitly about **top-tier** organizations, not the average private dollar
- the literature suggests that **mediation** is one of the more important non-coercive tools for halting hostilities

So it is reasonable to give top-tier philanthropy a somewhat larger share of effect than its raw share of total spending.

A reasonable compromise is:

- **Lower bound:** top-tier philanthropy gets about **2%** of the system-wide effect
- **Upper bound:** top-tier philanthropy gets about **8%** of the system-wide effect
- **Central view:** about **5%**

This is still a fairly conservative allocation. It says that the organizations we are modeling are important, but remain only a small part of the total conflict-management ecosystem.

This is also the most opinion-dependent part of the derivation. A skeptic could argue for something more like **0.5–2%** if governments and the UN are doing almost all of the causal work. A more optimistic reader could argue for something more like **10–15%** if top mediation NGOs are much more leveraged per dollar than the rest of the system. The **2–8%** range is therefore best understood as a judgment call, not a tightly evidenced interval.

---

## 3. What budget should we divide by?

The category is trying to model donations to unusually strong mediation / diplomacy / conflict-analysis organizations. Two useful anchors are:

- HD reported **50 million Swiss francs (about \$62.5 million)** in contribution income in 2023 and more than **70 peacemaking projects**. ([HD Annual Report 2023](https://hdcentre.org/wp-content/uploads/2024/07/Annual-report-2023_English-Final_Web.pdf))
- ICG reported **\$23.5 million** in revenue in 2024. ([ProPublica 2024](https://projects.propublica.org/nonprofits/organizations/525170039))

Taken together, that implies combined annual budgets on the order of **\$80–90 million** for a pair of organizations that look close to the intended target of this category.

That does **not** mean the whole philanthropic peacebuilding space is only \$80–90 million. It means that the especially strong and clearly relevant slice of the space plausibly lives in roughly that budget neighborhood.

---

## 4. Implied effect per \$1 million

Putting the previous sections together:

- System-wide effect: about **1.84 conflict-years/year**
- Top-tier philanthropy share: about **2–8%**
- Budget denominator: about **\$80–90 million/year**

So the implied effect attributable to top-tier philanthropy is:

$$
1.84 \times 0.02 \approx 0.037
$$

to

$$
1.84 \times 0.08 \approx 0.147
$$

conflict-years averted per year across the relevant top-tier philanthropic portfolio.

Dividing by annual budgets gives:

$$
\frac{0.037}{90} \approx 0.00041
$$

to

$$
\frac{0.147}{80} \approx 0.00184
$$

conflict-years averted per **\$1 million**.

In percentage terms, that is about:

- **0.04%** at the lower end
- **0.18%** at the upper end

A natural central BOTEC is:

$$
\frac{1.84 \times 0.05}{85} \approx 0.00108
$$

which is about **0.11%** per **\$1 million**.

That is why the category uses **0.1%** as the point estimate. It is slightly below this direct midpoint.

This arithmetic also implicitly assumes that the conflicts these organizations engage with are of roughly **representative serious-conflict-year** size. That is a simplification. If top mediation organizations disproportionately work on very high-burden conflicts, the estimate could be conservative. If they often work on lower-burden or earlier-stage conflicts, it could be optimistic.

---

## 5. Why widen the practical range to 0.03–0.3%?

The direct BOTEC above gives something like **0.05–0.2%**. We widen that slightly to **0.03–0.3%** because there are several uncertainties that the simple arithmetic does not capture well:

- the NGO share of system-level effect could be below **2%** if governments and regional actors do more of the real causal work
- or above **8%** if top mediation NGOs are much more leveraged per dollar than average peacekeeping or state spending
- the budget denominator is a mix of averages, while marginal dollars may go to better or worse opportunities than the portfolio mean
- Clayton and Dorussen's estimate is itself uncertain and based on observational data

So **0.03–0.3%** is best read as a practical working range rather than a statistically derived interval.

---

## 6. Cross-check against Open Philanthropy's HD BOTEC

Coefficient Giving / Open Philanthropy gives a useful independent cross-check. Their BOTEC notes that HD's annual budget was about **\$42 million** across **23 conflict zones**, or about **\$2 million per country-year**, and argues that a marginal HD mediation-year would only need about a **0.52%** chance of ending a war one year sooner to clear a very high philanthropic-return bar. ([Coefficient Giving / Open Philanthropy 2022](https://coefficientgiving.org/research/civil-conflict-reduction/))

Our category estimate is more conservative than that BOTEC in two ways:

- it uses **0.1%**, not **0.52%**
- it values outcomes mainly through **health-weighted QALY losses**, not a broader welfare measure that also includes most income losses

So the central **0.1%** assumption does not look aggressive relative to existing cause-prioritization work.

---

## 7. Marginal vs. average and room for more funding

One legitimate concern is that the budget numbers above are **average** portfolio budgets, while a new donation buys the **marginal** project or expansion.

This could make the estimate too optimistic if:

- the best projects are already fully funded
- extra money mainly goes to lower-priority crises
- organizations face management or political bottlenecks rather than funding bottlenecks

On the other hand, HD's annual report explicitly says it is **expanding the scope of fundraising** and welcomes more **flexible funding** to remain agile and respond to new conflicts. That is weak but real evidence that room for more funding is not zero. ([HD Annual Report 2023](https://hdcentre.org/wp-content/uploads/2024/07/Annual-report-2023_English-Final_Web.pdf))

Overall, these considerations argue for using a **conservative central estimate** rather than the raw midpoint of the optimistic case.

---

## Bottom Line

A reasonable best guess is that:

$$
p \approx 0.1\%
$$

with a practical positive range of roughly:

$$
0.03\% \text{ to } 0.3\%
$$

for the probability that **\$1 million** of additional top-tier conflict-mitigation spending averts one representative serious conflict-year.

This is uncertain, but it is not arbitrary: it comes from a concrete chain of reasoning that starts with the best available system-level evidence, heavily discounts for attribution, and then divides by the budgets of the kinds of organizations the category is actually trying to model.
