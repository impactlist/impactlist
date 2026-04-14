---
id: all-things-considered-conflict-year-burden
name: 'All-things-considered burden of a representative conflict-year'
---

_The following analysis was done on April 14th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

## How many QALY-equivalents are lost in a representative serious conflict-year?

The [Conflict Mitigation](/category/conflict-mitigation) page uses:

- $B$ = total all-things-considered QALY-equivalent loss from one representative serious conflict-year

A reasonable summary is:

- **Best-guess:** about **3,000,000 QALY-equivalents**
- **Practical range:** about **1,000,000-5,000,000 QALY-equivalents**

This is meant to capture the main welfare losses of civil conflict in one common unit. It includes direct deaths and injuries, displacement, disrupted healthcare, hunger, mental illness, lost income, governance deterioration, and long-run institutional damage, expressed in QALY-equivalent terms.

## 1. Start with the health component

The category already has a health-burden model:

- direct conflict and terrorism burden is about **10 million DALYs per year**
- once indirect deaths, displacement, healthcare disruption, food insecurity, and mental illness are included, total health burden is plausibly closer to **30-40 million QALYs per year**
- **2024** had **61 active state-based conflicts across 36 countries**, though many were small

If that annual health burden is mapped onto roughly **30-60 serious conflict settings**, the implied burden is about **0.5-1.3 million health QALYs** per representative serious conflict-year. The category uses **1 million** as the central health component. ([Coefficient Giving / Open Philanthropy 2022](https://coefficientgiving.org/research/civil-conflict-reduction/), [UNHCR Global Trends 2024](https://www.unhcr.org/global-trends-report-2024), [PRIO / UCDP 2025](https://www.prio.org/publications/14453), [The Lancet 2019](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736%2819%2930934-1/fulltext))

That is already a meaningful burden. The question is whether the estimate should stop there.

## 2. Why add a broader-welfare uplift?

It should not stop there. Civil conflict obviously destroys far more than direct and indirect health.

Coefficient / Open Philanthropy's civil-conflict BOTEC explicitly says that preventing an average civil war has roughly **20%** of its value from **DALYs** and **80%** from **lost income**. ([Coefficient Giving / Open Philanthropy 2022](https://coefficientgiving.org/research/civil-conflict-reduction/)) The World Bank likewise says high-intensity conflicts are typically followed by a cumulative drop of about **20% in GDP per capita after five years**, relative to pre-conflict projections. ([World Bank 2025](https://www.worldbank.org/en/research/publication/fragile-and-conflict-affected-situations-vulnerabilities)) And a recent NBER paper finds that conflict onset causes a large and persistent decline in democracy through channels such as **media censorship, judicial purges, curtailed civil liberties, irregular leadership turnover, and constitutional suspensions**. ([NBER 2026](https://www.nber.org/papers/w34734))

Those are not side notes. They are part of the welfare effect. If the model can express health harms in QALYs, it should also express income, governance, and institutional harms in QALY-equivalent terms rather than treating them as outside the estimate.

## 3. Why use a 200% uplift in the central case?

The evidence that non-health harms are large is strong. The evidence for an exact conversion is not.

So a reasonable way to handle this is:

$$
B = H \times (1 + m)
$$

Where:

- $H$ = health component of one representative serious conflict-year
- $m$ = broader-welfare uplift for lost income, governance deterioration, and institutional damage

Using:

- $H = 1{,}000{,}000$
- $m = 200\%$ in the central case
- practical range for $m$ of **0%-400%**

gives:

$$
B = 1{,}000{,}000 \times (1 + 2.0) = 3{,}000{,}000
$$

with a practical range from:

$$
1{,}000{,}000 \times (1 + 0) = 1{,}000{,}000
$$

to:

$$
1{,}000{,}000 \times (1 + 4.0) = 5{,}000{,}000
$$

Why use **400%** as the top of the practical range? Because Coefficient / Open Philanthropy's own BOTEC suggests a case where non-DALY harms are about **4x** the DALY component. So the upper end here is not inventing a new order of magnitude; it is allowing the broader-welfare component to be as large as one already-published conflict BOTEC suggests.

Why use **200%** rather than **400%** in the center? The **400%** figure comes from one broader BOTEC for an average civil war, and it likely reflects a mix of larger wars, very large income losses, and a stronger total-war framing than the category's representative serious conflict-year model. But the cited evidence still points clearly toward non-health harms being larger than the health component, not merely equal to it. A **200%** uplift says the broader-welfare component is about twice the health burden. That keeps the central estimate materially below the **4x** anchor while still treating lost income, governance deterioration, and institutional damage as the larger share of total welfare loss.

## 4. Bottom line

The cleanest summary is:

- health component: about **1,000,000 QALYs**
- broader-welfare uplift: about **200%**
- total representative conflict-year burden: about **3,000,000 QALY-equivalents**

with a practical range of about **1,000,000-5,000,000**.

This is not a precise number. But it is more faithful to an all-things-considered welfare estimate than stopping at health harms alone.
