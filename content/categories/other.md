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

{{STANDARD_QALY_METHOD_NOTE}}

## Description of effect

This is a fallback bucket for donations that cannot yet be classified more precisely: donor-advised funds, prize awards to individuals, mixed-purpose foundations, civic or journalism organizations with diffuse benefits, local charities that do not fit the main categories cleanly, and genuinely unknown recipients.

We want the expected value of giving to this actual bucket of miscellaneous philanthropy. We model it as a three-bucket portfolio: **direct but uncategorized organizations**, **indirect vehicles / mixed foundations / prize-awardees**, and **unknown / opaque recipients**. That gives a central estimate of **\$75,000/QALY**. Two things drive it: the dollar split across the buckets, and how much worse than known direct giving the indirect and unknown slices really are.

## What kinds of recipients are we modeling?

This category is a fallback, not a recommendation. It is for recipients whose purpose is genuinely mixed, unknown, or mediated through another decision-maker: donor-advised funds, broad family foundations, prize-award vehicles, and named recipients where the final charitable use is not disclosed. A recipient with a clear substantive purpose belongs in the relevant category, or should get a recipient-specific override, rather than staying here.

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$75,000 (\$35,000-\$300,000)
- **Start time:** 1 year
- **Duration:** 10 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. The current Other bucket is mostly a mix of three things: **direct but hard-to-classify organizations**, **indirect vehicles / mixed foundations / prize-awardees**, and **genuinely opaque or unknown recipients**.
2. The **direct but uncategorized** bucket has a central cost-effectiveness of roughly **\$40,000/QALY**. A reasonable proxy is that these recipients are somewhat worse than [Local Community](/cause/local-community) at **\$29,000/QALY**, because they are often broader and less tightly tied to direct welfare gains. So we apply a modest worsening rather than a dramatic one.
3. The **indirect vehicles / mixed foundations / prize-awardees** bucket has a central cost-effectiveness of roughly **\$120,000/QALY**. These gifts often move through another decision-maker, another time period, or a broader mandate before reaching final beneficiaries. Still, they are not close to worthless: National Philanthropic Trust reports that donor-advised funds paid out **23.9%** of prior-year assets in 2023. ([NPT 2024 DAF Report](https://www.nptrust.org/reports/the-2024-daf-report/))
4. The **unknown / highly opaque** bucket has a central cost-effectiveness of roughly **\$250,000/QALY**. The point is not that unknown recipients do no good; it is that expected value should usually be materially worse when the recipient is too poorly specified to model well.
5. A reasonable central dollar split for this category is roughly **35% direct but uncategorized organizations**, **45% indirect vehicles / mixed foundations / prize-awardees**, and **20% unknown / opaque recipients**. This is a judgment call based on a rough scan of the current recipient set: the bucket clearly contains many vehicle / prize / mixed-foundation cases, but raw recipient counts overstate that share because several entries come from the same Bezos-award pattern.
6. Benefits begin within about **1 year** on average, and a **10-year duration** is a reasonable compromise for this mixed bucket.

## Details

### Cost per QALY

We model Other as a three-bucket portfolio whose cost per QALY is the reciprocal of the dollar-weighted QALYs per dollar:

$$
\text{Cost per QALY} = \dfrac{1}{\frac{d}{D} + \frac{v}{V} + \frac{u}{U}}
$$

Using the central assumptions ($d$ = 0.35, $D$ = \$40,000; $v$ = 0.45, $V$ = \$120,000; $u$ = 0.20, $U$ = \$250,000), this gives a point estimate of **\$75,000/QALY**.

:::details{title="Working the portfolio arithmetic"}
$$
\text{QALYs per dollar} = \frac{0.35}{40{,}000} + \frac{0.45}{120{,}000} + \frac{0.20}{250{,}000}
$$

$$
\text{QALYs per dollar} \approx 0.0000133
$$

$$
\text{Cost per QALY} \approx \dfrac{1}{0.0000133} \approx \$75{,}000
$$
:::

### Why the buckets look like this

The direct bucket starts from [Local Community](/cause/local-community) at **\$29,000/QALY** and worsens modestly to **\$40,000/QALY**. Each later bucket is a multiple of the previous one: **3x** to the indirect bucket for an extra intermediary step, then **2x** to the unknown bucket for sheer opacity.

The central 35% / 45% / 20% split comes from a rough launch audit of the current recipient set. Many entries are vehicles, broad foundations, or prize-award patterns. A smaller but still meaningful group are direct organizations that did not fit another category cleanly. A residual group is opaque enough that the final use is not publicly visible. This is not a stable empirical fact about philanthropy in general, so revisit it as recipient coverage changes.

:::details{title="Bucket-by-bucket reasoning"}
- **Direct organizations: \$40,000/QALY.** This is anchored on [Local Community](/cause/local-community) at **\$29,000/QALY** and moved upward modestly. The idea is that direct recipients in Other are often broader and less health-targeted than the local-community portfolio, but they are still real operating organizations doing concrete work.
- **Indirect vehicles and mixed foundations: \$120,000/QALY.** This is roughly **3x** the direct bucket. That is a reasonable central haircut for an extra intermediary step, slower deployment, and broader downstream allocation. The NPT payout rate is a useful check against going much lower: DAFs are diluted and slower, but not dormant.
- **Unknown recipients: \$250,000/QALY.** This is roughly **2x** the indirect bucket. The logic is simply that if a recipient is still too opaque to classify at all, expected value should usually be materially worse than for a known vehicle or mixed foundation whose mission and mechanism are at least partly visible.
:::

This estimate also passes a useful outside-view sanity check: **\$75,000/QALY** sits comfortably inside the broad **\$20,000-\$150,000/QALY** band often used by rich-country institutions such as NICE and ICER when evaluating interventions that are worthwhile but far from frontier global-health opportunities. ([NICE](https://www.nice.org.uk/news/blogs/should-nice-s-cost-effectiveness-thresholds-change-), [ICER](https://icer.org/our-approach/methods-process/))

### Range

The plausible range of **\$35,000-\$300,000/QALY** is wide. Most of that width comes from a single correlated worry, not three independent ones: if "indirect and opaque giving is worse than it looks" is true, it pushes the vehicle bucket, the unknown bucket, and the dollar split toward the unfavorable side together. So we set the bounds by moving every input to its favorable or unfavorable edge at once, rather than treating the inputs as independent and shrinking the range. The dominant uncertainty is structural: whether the three-bucket model and its QALY conversions are even right. That uncertainty lives largely outside the parameters.

The portfolio structure itself bounds the downside. That is why **\$300,000/QALY** sits near the pessimistic edge rather than far beyond it. Direct and indirect dollars keep producing QALYs, so the cost per QALY stays near **\$316,000** even if the opaque bucket is treated as essentially worthless under the pessimistic mix. The published upper bound is therefore a rounded pessimistic portfolio case, not an unbounded "unknown giving is worthless" tail.

:::details{title="Optimistic and pessimistic bound calculations"}
**Optimistic** — direct **\$25,000/QALY**, indirect **\$60,000/QALY**, unknown **\$120,000/QALY**, mix **50% / 40% / 10%**:

$$
\dfrac{1}{0.50/25{,}000 + 0.40/60{,}000 + 0.10/120{,}000} \approx \$36{,}000
$$

**Pessimistic** — direct **\$90,000/QALY**, indirect **\$300,000/QALY**, and the opaque bucket treated as nearly worthless (about **\$2,400,000/QALY**), mix **15% / 45% / 40%**:

$$
\dfrac{1}{0.15/90{,}000 + 0.45/300{,}000 + 0.40/2{,}400{,}000} \approx \$300{,}000
$$
:::

### Start time

The **1-year** start time reflects that some Other recipients can spend quickly, while others take longer to deploy funds or create downstream impact.

### Duration

The **10-year** duration reflects that this is a mixed bucket. Some effects are short-run, while others mediated through philanthropy, journalism, or institutions can persist for several years.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on April 6th 2026 by GPT-5.4 and Claude Opus 4.6, with prompts from Impact List staff._

- This category should stay an **actual expected-value estimate for miscellaneous philanthropy**.
- If recurring `Other` clusters become common enough, they should probably get dedicated categories or recipient-level overrides.
