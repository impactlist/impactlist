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

This is not a normal cause area. The `Other` bucket exists mainly as a **conservative fallback** for donations that cannot yet be classified more precisely: mixed-purpose foundations, donor-advised funds, prize awards to individuals, civic or journalism organizations with diffuse benefits, local charities with thin evidence, and genuinely unknown recipients.

So this page is **not** trying to estimate "the best opportunity anywhere outside the named categories." It is trying to estimate the expected effectiveness of **uncategorized philanthropy after an uncertainty penalty**. If a recipient can reasonably be placed into a sharper category, that category should usually be used instead.

## Point Estimates

- **Cost per QALY:** \$75,000 (\$15,000-\$300,000)
- **Start time:** 1 year
- **Duration:** 10 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. The `Other` bucket is a fallback for heterogeneous and weakly specified philanthropy rather than a coherent intervention family. In the current data it includes things like donor-advised funds, prize awards, mixed foundations, local charities, and unknown recipients.
2. A reasonable lower anchor for strong but still plausibly uncategorized high-income social programs is around **\$25,000 per QALY-equivalent**, with a rough anchor range of about **\$15,000-\$60,000**. The cleanest quantitative example is CUNY ACE: the 2025 NBER paper reports about **\$12,374** in direct expenditures and **\$51,986** in current-generation lifetime earnings gains per participant. Using a rich-country conversion of **\$100,000-\$115,000 per QALY-equivalent**, that implies roughly **0.45-0.52 QALY-equivalents**, or about **\$24,000-\$27,000 per QALY-equivalent**. KiVa provides a direct health-style anchor at about **€13,823 per QALY**. Some structured arts / social-prescribing programs also appear to land in the same broad neighborhood, but that literature is thinner and should be treated as corroborative rather than load-bearing. ([Scott-Clayton et al. 2025](https://www.nber.org/papers/w33956), [CUNY ACE](https://www.cuny.edu/about/administration/offices/student-success-initiatives/asap/evaluation/), [HM Treasury 2021](https://www.gov.uk/government/publications/green-book-supplementary-guidance-wellbeing), [Frijters and Krekel 2021](https://eprints.lse.ac.uk/114605/1/Frijters_PR3.pdf), [Persson et al. 2018](https://link.springer.com/article/10.1007/s11121-018-0893-6), [Coulton et al. 2015](https://www.cambridge.org/core/journals/the-british-journal-of-psychiatry/article/effectiveness-and-costeffectiveness-of-community-singing-on-mental-healthrelated-quality-of-life-of-older-people-randomised-controlled-trial/516558F0DDD7D4DD0197FDDEAD30ED85))
3. Rich-country decision makers often treat approximately **£20,000-£30,000 per QALY** (NICE) or **\$100,000-\$150,000 per QALY** (ICER) as the relevant cost-effectiveness band. That is not a philanthropy estimate by itself, but it is a useful outside-view calibration for social spending whose benefits are real but not extremely tractable. ([NICE 2024](https://www.nice.org.uk/news/blogs/should-nice-s-cost-effectiveness-thresholds-change-), [ICER](https://icer.org/our-approach/methods-process/))
4. Because `Other` is used precisely when we **lack a sharper causal story**, recipients in this bucket should usually be worse than the strong-program anchor. A reasonable all-things-considered uncertainty penalty is roughly **3x** centrally. This is a judgment call, and probably the single most uncertain input on the page. Roughly speaking, we would be surprised if the typical penalty were **less than 2x** or **more than 5x**: less than 2x seems too generous for a bucket defined by heterogeneity and weak attribution, while more than 5x seems too harsh given that some entries are simply mixed or not yet classified cleanly.
5. Some `Other` recipients are donor-advised funds or other vehicles rather than operating nonprofits. DAF payout is still substantial rather than near-zero: National Philanthropic Trust reports a **23.9%** payout rate for 2023. So deployment delay is real, but this is better treated as one reason for a moderate uncertainty penalty than as a reason to make the category nearly worthless. ([NPT 2024 DAF Report](https://www.nptrust.org/reports/the-2024-daf-report/))
6. A 1-year start time is a reasonable compromise between direct-service charities that can spend quickly and pass-through vehicles or foundations that may take longer to deploy capital.
7. A 10-year duration is a reasonable compromise between short-lived service benefits and longer-lived civic or institutional effects, while avoiding overconfident multi-decade persistence assumptions for a bucket defined partly by uncertainty.

## Details

### Cost per QALY

The right starting point is **not** "What is the average charity in the world?" That would be too broad and would mix together all sorts of spending that this site is not trying to model. But it is also wrong to set `Other` equal to the better-specified cause areas, because the whole reason a donation ends up here is that we cannot defend a sharper quantitative story.

So the estimate should sit between:

- a **lower anchor** taken from the better evidence-backed high-income social programs that might plausibly have been left uncategorized, and
- a **conservative default** for vague, mixed, delayed, or weakly evidenced philanthropy.

**Lower anchor: evidence-backed direct programs**

The clearest outside-view anchor is the cluster of stronger high-income direct-program literatures. The most important calculation here is CUNY ACE. The 2025 NBER paper reports about **\$12,374** in direct expenditures and **\$51,986** in current-generation lifetime earnings gains per participant. Using the rich-country conversion in Assumption 2:

$$
\text{QALY-equivalents from earnings} \approx \dfrac{\$51{,}986}{\$100{,}000\text{–}\$115{,}000} \approx 0.45\text{–}0.52
$$

$$
\text{Cost per QALY-equivalent} \approx \dfrac{\$12{,}374}{0.45\text{–}0.52} \approx \$24{,}000\text{–}\$27{,}000
$$

KiVa anti-bullying was estimated at about **€13,823 per QALY**, which is a useful direct anchor in the same broad neighborhood. Some structured arts and social-prescribing programs also appear to land in the low-to-mid tens of thousands of dollars per QALY in the better studies, but that literature is much thinner and is only a corroborating signal here rather than part of the core derivation.

Taken together, **\$25,000 per QALY** is a reasonable anchor for the best part of the broad "uncategorized but still plausibly good" territory.

**Why `Other` should be materially worse than that anchor**

If a recipient really looked like CUNY ACE, KiVa, or a similarly well-supported direct program, it should usually not stay in `Other`. The fact that it remains here is itself evidence of lower expected tractability or lower model confidence.

Three things push the default estimate upward relative to the \$25,000 anchor:

1. **Category breadth.** `Other` mixes together several qualitatively different objects: unknown recipients, pass-through vehicles, mixed foundations, prizes, local charities, and civic/information organizations.
2. **Weaker attribution.** Many plausible `Other` recipients create real value, but the causal path from the donor's marginal dollar to QALYs is much less direct than in the best intervention-specific literatures.
3. **Opacity and delay.** Some entries are vehicles rather than operating charities, so part of the donor's effect comes later and with less confidence.

We do not have enough evidence to decompose those three factors into a precise formula, so the **3x** should be read as a rough judgment call rather than as a measured constant. The question is basically: what penalty would be unsurprising for a bucket defined by heterogeneity and model uncertainty? Less than **2x** seems too generous. More than **5x** as the central estimate seems too harsh, especially because some `Other` recipients are simply mixed or temporarily uncategorized rather than deeply ineffective. So **3x** is a reasonable middle judgment.

Applying that central penalty to the \$25,000 anchor gives:

$$
\$25{,}000 \times 3 = \$75{,}000
$$

So the point estimate is **\$75,000 per QALY**.

That number also looks reasonable from the outside view. It is clearly worse than the better evidence-backed high-income social programs, but still well inside the broader **roughly \$30,000-\$150,000/QALY** band that rich-country institutions often treat as decision-relevant (Assumption 3). That is roughly where a conservative default for "probably positive, but too heterogeneous and weakly specified to model tightly" ought to land.

The DAF payout evidence in Assumption 5 matters mainly as a sanity check on the upper end of the penalty. If DAFs and other vehicles were barely deploying money at all, a much harsher penalty would be easier to justify. But a 23.9% payout rate is substantial enough that "mixed or indirect" should not automatically be translated into "almost no impact."

### Why the range

The range is a practical uncertainty range, not a formal confidence interval.

**Optimistic end: \$15,000/QALY**

This corresponds to a recipient that is genuinely strong but simply has not yet been mapped into a more specific category. In other words, the optimistic edge assumes some **classification lag**: the recipient looks more like a KiVa-like or ACE-like opportunity than like a generic vague fallback case. That should be unusual, which is why this number is the optimistic edge rather than something close to the point estimate.

**Pessimistic end: \$300,000/QALY**

This corresponds roughly to taking the weak end of the anchor range and then applying a harsh uncertainty penalty:

$$
\$60{,}000 \times 5 = \$300{,}000
$$

That is meant to capture recipients whose benefits are real but hard to trace, delayed, or substantially diluted by vague mission, weak counterfactual leverage, or pass-through structure. We stop well short of saying such recipients are worthless, because many still do socially valuable things. But the uncertainty is large enough that a few-hundred-thousand-dollars-per-QALY figure is a plausible conservative edge.

### Start Time

The 1-year start time reflects that many `Other` donations can begin doing some good within months, but not always immediately. Grants need to be made, programs staffed, and in some cases funds first need to move through a donor-advised fund or other intermediary. One year is a reasonable compromise.

### Duration

The 10-year duration reflects mixed pathways. Some `Other` recipients produce benefits that are mostly short-run. Others, especially civic or institutional work, may plausibly have effects that last for years. Because this category is a fallback bucket defined partly by uncertainty, we should avoid very short windows that understate longer-lived work, but also avoid multi-decade windows that would overstate confidence.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- This category should stay **more conservative than any cause page that has a clean intervention-specific evidence chain**. Otherwise `Other` will over-credit vague or weakly specified donations.
- The key uncertainty is the **uncertainty penalty**, not the lower anchor. If future editors can identify a better empirical way to calibrate how much worse uncategorized philanthropy is than strong intervention-specific opportunities, that would be the highest-leverage improvement to this page.
- If a cluster of `Other` recipients becomes common enough, the right fix is usually to create a dedicated category or recipient-specific override rather than to make this bucket more precise than it can honestly be.
