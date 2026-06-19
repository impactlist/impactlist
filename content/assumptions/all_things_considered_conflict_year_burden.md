---
id: all-things-considered-conflict-year-burden
name: 'All-things-considered burden of a representative conflict-year'
---

## How many QALY-equivalents are lost in a representative serious conflict-year?

The [Conflict Mitigation](/cause/conflict-mitigation) page uses:

- $B$ = total all-things-considered QALY-equivalent loss from one representative serious conflict-year

A reasonable summary is:

- **Best-guess:** about **3,000,000 QALY-equivalents**
- **{{PLAUSIBLE_RANGE_CAP}}:** about **700,000-6,500,000 QALY-equivalents**

This captures the main welfare losses of civil conflict in one common unit: direct deaths and injuries, displacement, disrupted healthcare, hunger, mental illness, lost income, governance deterioration, and long-run institutional damage, all expressed in QALY-equivalent terms. It is built as a health component times a broader-welfare uplift, $B = H \times (1 + m)$, with $H \approx$ **1,000,000** health QALYs and a central uplift of $m =$ **200%**. The uplift converts income, governance, and institutional harms into QALY-equivalents, carrying the estimate from health-only to all-things-considered. Its size is the main crux.

## The health component is about 1,000,000 QALYs

We use **1 million** as the central health component. Take the world's annual conflict health burden of about **30-40 million QALYs per year** and spread it across roughly **30-60 serious conflict settings**. That implies about **0.5-1.3 million health QALYs** per representative serious conflict-year. ([Coefficient Giving / Open Philanthropy 2022](https://coefficientgiving.org/research/civil-conflict-reduction/), [UNHCR Global Trends 2024](https://www.unhcr.org/global-trends-report-2024), [PRIO / UCDP 2025](https://www.prio.org/publications/14453), [The Lancet 2019](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736%2819%2930934-1/fulltext))

:::details{title="From the global conflict health burden to one conflict-year"}
The category already has a health-burden model:

- direct conflict and terrorism burden is about **10 million DALYs per year**
- once indirect deaths, displacement, healthcare disruption, food insecurity, and mental illness are included, total health burden is plausibly closer to **30-40 million QALYs per year**
- **2024** had **61 active state-based conflicts across 36 countries**, though many were small

Spread that annual health burden across roughly **30-60 serious conflict settings** and the implied burden is about **0.5-1.3 million health QALYs** per representative serious conflict-year. The category uses **1 million** as the central health component.
:::

## Non-health harms are larger than the health component

Health is only part of the welfare effect, and the cited evidence points to the rest being the larger part. Coefficient / Open Philanthropy's civil-conflict back-of-the-envelope estimate says preventing an average civil war has roughly **20%** of its value from **DALYs** and **80%** from **lost income**. ([Coefficient Giving / Open Philanthropy 2022](https://coefficientgiving.org/research/civil-conflict-reduction/)) The World Bank finds high-intensity conflicts are typically followed by a cumulative drop of about **20% in GDP per capita after five years**, relative to pre-conflict projections. ([World Bank 2025](https://www.worldbank.org/en/research/publication/fragile-and-conflict-affected-situations-vulnerabilities)) A recent NBER paper finds conflict onset causes a large and persistent decline in democracy through channels such as **media censorship, judicial purges, curtailed civil liberties, irregular leadership turnover, and constitutional suspensions**. ([NBER 2026](https://www.nber.org/papers/w34734)) If the model can express health harms in QALYs, it should express these income, governance, and institutional harms in QALY-equivalents too, instead of leaving them outside the estimate.

## The central uplift is 200%, with a plausible range of 0%-400%

The evidence that non-health harms are large is strong; the evidence for an exact conversion is not. We therefore apply a broader-welfare uplift $m$ to the health component $H$:

$$
B = H \times (1 + m)
$$

With $H = 1{,}000{,}000$ and a central $m =$ **200%** — meaning the broader-welfare component is about twice the health burden — the central burden is **3,000,000 QALY-equivalents**.

Our plausible range on the burden is **700,000-6,500,000 QALY-equivalents**. That is close to the full span the two inputs produce at their joint low and joint high: the health component $H$ (**0.5-1.3 million**, from mapping the global conflict health burden onto serious conflict settings) and the uplift $m$ (**0%-400%**). We keep it near that span rather than narrowing it, for two reasons. First, $H$ and $m$ are positively correlated: reading conflicts as larger and more total-war raises both at once. Second, the central crux is a structural uncertainty the two parameters do not capture — whether income, governance, and institutional harms convert to QALY-equivalents at the assumed rate at all.

:::details{title="Why 200% in the center, and how the range combines both inputs"}
The central arithmetic:

$$
B = 1{,}000{,}000 \times (1 + 2.0) = 3{,}000{,}000
$$

**From the all-extremes bound to the published range.** Pushing both inputs to the same extreme gives a bound of $500{,}000 \times 1.0 = 500{,}000$ at the low end and $1{,}300{,}000 \times 5.0 = 6{,}500{,}000$ at the high end. We publish **700,000-6,500,000**, essentially that bound: $H$ and $m$ are positively correlated (a reading of conflicts as larger and more total-war raises both at once), and the QALY-equivalence conversion carries structural uncertainty beyond the two parameters. The high end tracks the bound because one published estimate already implies a roughly **4x** non-health multiple. The low end sits a little above the bare extreme because a near-zero broader-welfare uplift is less plausible than a genuine 10% tail.

**Why 400% at the top of the uplift.** Coefficient / Open Philanthropy's own estimate suggests a case where non-DALY harms are about **4x** the DALY component. So the upper end is not inventing a new order of magnitude; it allows the broader-welfare component to be as large as one already-published conflict estimate suggests.

**Why 200% rather than 400% in the center.** The **400%** figure comes from one broader estimate for an average civil war, and it likely reflects a mix of larger wars, very large income losses, and a stronger total-war framing than the category's representative serious conflict-year model. But the cited evidence still points clearly toward non-health harms being larger than the health component, not merely equal to it. A **200%** uplift keeps the central estimate materially below the **4x** anchor while still treating lost income, governance deterioration, and institutional damage as the larger share of total welfare loss.
:::

# Internal Notes

_The following analysis was done on April 14th 2026 by GPT-5.4, with prompts from Impact List staff._
