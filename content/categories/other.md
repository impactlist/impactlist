---
id: other
name: 'Other'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 10
    costPerQALY: 75_000
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High) and Claude Opus 4.6 (Max), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This is a fallback bucket for donations that cannot yet be classified more precisely: donor-advised funds, prize awards to individuals, mixed-purpose foundations, civic or journalism organizations with diffuse benefits, local charities that do not fit the main categories cleanly, and genuinely unknown recipients.

The goal is to estimate the expected value of giving to this actual bucket of miscellaneous philanthropy.

## Point Estimates

- **Cost per QALY:** \$75,000 (\$35,000-\$300,000)
- **Start time:** 1 year
- **Duration:** 10 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. The current `Other` bucket is mostly a mix of three things: **direct but hard-to-classify organizations**, **indirect vehicles / mixed foundations / prize-awardees**, and **genuinely opaque or unknown recipients**.
2. The **direct but uncategorized** bucket has a central cost-effectiveness of roughly **\$40,000/QALY**. A reasonable proxy is that these recipients are somewhat worse than [Local Community](/category/local-community) at **\$30,000/QALY**, because they are often broader and less tightly tied to direct welfare gains. So we apply a modest worsening rather than a dramatic one.
3. The **indirect vehicles / mixed foundations / prize-awardees** bucket has a central cost-effectiveness of roughly **\$120,000/QALY**. These gifts often move through another decision-maker, another time period, or a broader mandate before reaching final beneficiaries. Still, they are not close to worthless: National Philanthropic Trust reports that donor-advised funds paid out **23.9%** of prior-year assets in 2023. ([NPT 2024 DAF Report](https://www.nptrust.org/reports/the-2024-daf-report/))
4. The **unknown / highly opaque** bucket has a central cost-effectiveness of roughly **\$250,000/QALY**. The point is not that unknown recipients do no good; it is that expected value should usually be materially worse when the recipient is too poorly specified to model well.
5. A reasonable central dollar split for this category is roughly **35% direct but uncategorized organizations**, **45% indirect vehicles / mixed foundations / prize-awardees**, and **20% unknown / opaque recipients**. This is a judgment call based on a rough scan of the current recipient set: the bucket clearly contains many vehicle / prize / mixed-foundation cases, but raw recipient counts overstate that share because several entries come from the same Bezos-award pattern.
6. Benefits begin within about **1 year** on average, and a **10-year duration** is a reasonable compromise for this mixed bucket.

## Details

### Cost per QALY

We model `Other` as a three-bucket portfolio:

$$
\text{Cost per QALY} = \dfrac{1}{\frac{d}{D} + \frac{v}{V} + \frac{u}{U}}
$$

Using the central assumptions:

- $d$ = 0.35 and $D$ = \$40,000
- $v$ = 0.45 and $V$ = \$120,000
- $u$ = 0.20 and $U$ = \$250,000

So:

$$
\text{QALYs per dollar} = \frac{0.35}{40{,}000} + \frac{0.45}{120{,}000} + \frac{0.20}{250{,}000}
$$

$$
\text{QALYs per dollar} \approx 0.0000133
$$

$$
\text{Cost per QALY} \approx \dfrac{1}{0.0000133} \approx \$75{,}000
$$

That gives a point estimate of **\$75,000/QALY**.

### Why the buckets look like this

- **Direct organizations: \$40,000/QALY.** This is anchored on [Local Community](/category/local-community) at **\$30,000/QALY** and moved upward modestly. The idea is that `Other` direct recipients are often broader and less health-targeted than the local-community portfolio, but they are still real operating organizations doing concrete work.
- **Indirect vehicles and mixed foundations: \$120,000/QALY.** This is roughly **3x** the direct bucket. That is a reasonable central haircut for an extra intermediary step, slower deployment, and broader downstream allocation. The NPT payout rate is a useful check against going much lower: DAFs are diluted and slower, but not dormant.
- **Unknown recipients: \$250,000/QALY.** This is roughly **2x** the indirect bucket. The logic is simply that if a recipient is still too opaque to classify at all, expected value should usually be materially worse than for a known vehicle or mixed foundation whose mission and mechanism are at least partly visible.

This estimate also passes a useful outside-view sanity check: **\$75,000/QALY** sits comfortably inside the broad **\$20,000-\$150,000/QALY** band often used by rich-country institutions such as NICE and ICER when evaluating interventions that are worthwhile but far from frontier global-health opportunities. ([NICE](https://www.nice.org.uk/news/blogs/should-nice-s-cost-effectiveness-thresholds-change-), [ICER](https://icer.org/our-approach/methods-process/))

### Range

The range is a practical sensitivity range, not a formal confidence interval.

- **Optimistic:** stronger direct recipients, better downstream allocation, and fewer unknowns gives about **\$35,000/QALY**.
- **Pessimistic:** weaker direct recipients, more dilution through vehicles, and more opaque recipients gives about **\$300,000/QALY**.

### Start Time

The **1-year** start time reflects that some `Other` recipients can spend quickly, while others take longer to deploy funds or create downstream impact.

### Duration

The **10-year** duration reflects that this is a mixed bucket. Some effects are short-run, while others mediated through philanthropy, journalism, or institutions can persist for several years.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- This category should stay an **actual expected-value estimate for miscellaneous philanthropy**.
- If recurring `Other` clusters become common enough, they should probably get dedicated categories or recipient-level overrides.
