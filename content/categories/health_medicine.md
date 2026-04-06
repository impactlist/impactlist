---
id: health-medicine
name: 'Health / Medicine'
effects:
  - effectId: standard
    startTime: 7
    windowLength: 40
    costPerQALY: 15_000
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures health gains from strong health and medicine philanthropy in high-income countries. The two main buckets are:

- direct prevention, treatment-access, and care-delivery programs such as smoking cessation, hypertension control, diabetes prevention, vaccination delivery, patient navigation, cataract care, and mental health treatment
- biomedical and translational research that helps create or speed up better prevention, diagnostics, drugs, and care models

This estimate excludes global-health programs in poorer countries, pandemic-risk reduction, and longevity moonshots, which are modeled separately.

## Point Estimates

- **Cost per QALY:** \$15,000 (\$6,000-\$50,000)
- **Start time:** 7 years
- **Duration:** 40 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. Strong direct health programs in high-income countries often land around \$4,000-\$20,000 per QALY, with especially strong examples around \$4,000-\$7,000/QALY. Recent anchors include team-based hypertension care with nonphysician titration at about \$4,400/QALY, 12-week varenicline monotherapy for smoking cessation at about \$4,579/QALY, and Diabetes Prevention Program-style lifestyle interventions with a median ICER of about \$6,212/QALY. ([Bryant et al. 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10987007/), [JAMA Network Open 2024](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2817927), [Zhou et al. 2020](https://pubmed.ncbi.nlm.nih.gov/33534726/))
2. Not all direct-service opportunities are that cheap; reasonable high-income-country anchors also extend into the teens or low tens of thousands per QALY. Examples include long-term collaborative care for depression at about GBP13,069-GBP16,123 per QALY and cataract surgery at about \$38,288/QALY even in a relatively low-expected-benefit subgroup. ([Bower et al. 2018](https://pubmed.ncbi.nlm.nih.gov/29761751/), [Salisbury et al. 2016](https://pubmed.ncbi.nlm.nih.gov/27855101/), [Busbee et al. 2006](https://pubmed.ncbi.nlm.nih.gov/17063129/))
3. Public-health interventions assessed by NICE are often very cost-effective: across 380 cost-utility estimates from 2005-2018, the median ICER was GBP1,986 per QALY, 21% were cost-saving, and 75% were cost-effective at GBP20,000/QALY. Strong philanthropic opportunities should usually do several times worse than this median because donors do not control the whole health system; a 4x-5x haircut would imply roughly GBP8,000-GBP10,000/QALY, or about \$10,000-\$13,000/QALY. ([Owen & Fischer 2019](https://pubmed.ncbi.nlm.nih.gov/30885422/))
4. Historical public/charitable biomedical research in the UK produced health-gain returns in the range of roughly 7%-10% per year, with typical lags of about 15-17 years between spending and health impact. ([Grant & Buxton 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC6144334/), [UKRI / RAND / HERG 2008](https://www.ukri.org/wp-content/uploads/2022/02/MRC-030222-medical-research-whats-it-worth.pdf))
5. Cancer research gives a useful concrete research anchor: UK public and charitable cancer research spending of about GBP15 billion was associated with 5.9 million QALYs from prioritized interventions, with 17% of those gains attributed to UK research and a 15-year lag. That implies a crude attributable research cost of roughly GBP15,000 per QALY before counting broader economic spillovers. ([Glover et al. 2014](https://pubmed.ncbi.nlm.nih.gov/24930803/))
6. A reasonable central model for this category is to split marginal dollars roughly 50/50 between research / translation and direct programs. A 40/60 or 60/40 split is also plausible. This is a judgment call rather than a directly observed statistic, so the details section treats it as an explicit sensitivity lever rather than a precise statistic.
7. Direct-program benefits usually start in about 1-2 years, while research benefits start much later, around 15-17 years.
8. Once a program or research breakthrough works, health benefits often persist for decades through beneficiaries' remaining lifetimes and through repeated use across future cohorts, so a 40-year duration is a reasonable central modeling choice.

## Details

### Cost per QALY

The cleanest way to model this category is as a two-bucket portfolio:

$$
\text{Cost per QALY} = \dfrac{1}{\frac{w_d}{c_d} + \frac{w_r}{c_r}}
$$

Where:

- $w_d$ = share of dollars going to direct programs
- $c_d$ = cost per QALY for direct programs
- $w_r$ = share of dollars going to research / translation
- $c_r$ = cost per QALY for research / translation

Using the central assumptions:

- $w_d$ = 0.5
- $c_d$ = \$10,000
- $w_r$ = 0.5
- $c_r$ = \$25,000

So:

$$
\text{QALYs per dollar} = \frac{0.5}{10000} + \frac{0.5}{25000} = 0.00007
$$

$$
\text{Cost per QALY} \approx \dfrac{1}{0.00007} \approx 14{,}300
$$

Rounded, that gives a point estimate of **\$15,000/QALY**.

#### Why \$10,000/QALY for the direct-program bucket?

The direct-program bucket should not be set only by the very best case studies. A better approach is to combine the strongest concrete examples with a broader portfolio cross-check.

The main concrete anchors are:

- hypertension team-based care: about **\$4,400/QALY**
- standard varenicline smoking cessation: about **\$4,579/QALY**
- DPP-style diabetes prevention: median about **\$6,212/QALY**
- depression collaborative care: roughly **GBP13,000-GBP16,000/QALY**
- cataract surgery: sometimes much better than this, but around **\$38,000/QALY** even in a pessimistic low-benefit subgroup

Taken literally, these studies suggest that unusually strong direct programs can land anywhere from the low thousands to the upper tens of thousands per QALY, with several credible examples below \$7,000 but plenty of room for weaker fit, lower additionality, or harder-to-reach populations.

Owen & Fischer provide the broadest cross-check. Their median NICE public-health ICER is **GBP1,986/QALY**. Philanthropic marginal dollars should usually do several times worse than that benchmark because donors rarely control full uptake, patient selection, or system-wide implementation. A **4x-5x** haircut implies roughly **GBP8,000-GBP10,000/QALY**, or about **\$10,000-\$13,000/QALY**.

Putting those two views together, **\$10,000/QALY** is a reasonable central estimate for strong direct health philanthropy in rich countries: above the best exemplars, below the middling or pessimistic cases, and close to the NICE-based cross-check after a substantial marginality discount.

#### Why \$25,000/QALY for the research bucket?

The most useful concrete anchor is the UK cancer-research returns paper. Very crudely:

- total public / charitable cancer research spend: about **GBP15 billion**
- total QALYs from prioritized interventions: about **5.9 million**
- attribution to UK research: **17%**

So attributed QALYs are approximately:

$$
5.9 \text{ million} \times 0.17 \approx 1.0 \text{ million}
$$

And the crude research cost per attributable QALY is:

$$
\dfrac{\text{GBP}15 \text{ billion}}{1.0 \text{ million QALYs}} \approx \text{GBP}15{,}000/\text{QALY}
$$

That is approximately **\$19,000-\$20,000/QALY**. We then move somewhat upward to **\$25,000/QALY** for the category-level research bucket because:

- the cancer estimate is historical and partly reflects unusually successful past research
- some current medical philanthropy goes to more speculative areas than mature cancer or cardiovascular research
- marginal philanthropic additionality in rich-country biomedical ecosystems is real, but not perfect

#### Sensitivity to the direct/research mix

The direct/research split is one of the most judgment-sensitive assumptions, so it should be shown explicitly rather than treated as precise. Holding the direct bucket at **\$10,000/QALY** and the research bucket at **\$25,000/QALY**:

- **60% direct / 40% research:** 1 / (0.6 / 10,000 + 0.4 / 25,000) ≈ **\$13,200/QALY**
- **50% direct / 50% research:** 1 / (0.5 / 10,000 + 0.5 / 25,000) ≈ **\$14,300/QALY**
- **40% direct / 60% research:** 1 / (0.4 / 10,000 + 0.6 / 25,000) = **\$15,625/QALY**

And with a somewhat less optimistic direct bucket of **\$12,000/QALY** plus a **50/50** mix:

$$
\dfrac{1}{0.5/12000 + 0.5/25000} \approx 16{,}200
$$

So the main takeaway is not that the mix is unimportant; it is that across a reasonable band, the category still lands in the mid-teens of thousands per QALY rather than near the upper end of rich-country payer-style thresholds.

#### Range

The stated range is a practical sensitivity range, not a full confidence interval.

**Optimistic case**

- direct bucket: **\$4,500/QALY**
- research bucket: **\$12,000/QALY**
- mix: **60% direct / 40% research**

This gives:

$$
\dfrac{1}{0.6/4500 + 0.4/12000} = 6{,}000
$$

**Pessimistic case**

- direct bucket: **\$20,000/QALY**
- research bucket: **\$80,000/QALY**
- mix: **20% direct / 80% research**

This gives:

$$
\dfrac{1}{0.2/20000 + 0.8/80000} = 50{,}000
$$

So the practical range is **\$6,000-\$50,000/QALY**.

### Start Time

Direct programs usually start generating health gains quickly, often in about **1-2 years**. Research typically takes much longer; the main returns-to-research literature points to lags around **15-17 years**.

Using the central portfolio model, the direct bucket produces more QALYs per dollar than the research bucket, so the QALY-weighted average start time is much earlier than a simple 50/50 dollar-weighted average. A 7-year start time is therefore a reasonable round estimate.

### Duration

A 40-year duration is a reasonable central estimate because:

- successful prevention or chronic-disease-control programs can improve health over long remaining lifetimes
- research-enabled interventions can keep benefiting new cohorts of patients for decades before being superseded
- the site's 100-year time cap already truncates very long tails of benefit

## What Kinds of Charities Are We Modeling?

This estimate is best read as a model of **strong marginal health / medicine philanthropy** in rich countries, not the average unrestricted donation to any hospital or medical school.

Representative fits include:

- evidence-based direct programs that improve prevention, treatment access, adherence, navigation, or care delivery
- disease-focused translational research and clinical research platforms
- catalytic field-building or data / infrastructure work that plausibly speeds up useful medical progress

This estimate is **not** a good model of generic hospital fundraising, prestige building projects, or low-additionality donations to already-rich academic medical centers. Those can easily be much worse than the category default and should ideally be estimated at the recipient level.

## Key Uncertainties

1. **How research-heavy the real marginal opportunity set is.** A 40/60 versus 60/40 direct/research split moves the estimate by a few thousand dollars per QALY. If the best marginal dollars are mostly direct programs, this category is better than \$15,000/QALY; if they are mostly research or institutional fundraising, it is worse.
2. **Where the direct-program bucket really sits.** The best cited examples are around \$4,400-\$6,200/QALY, but strong real-world opportunities could easily be higher once additionality, implementation friction, and recipient fit are accounted for.
3. **How well historical research returns extrapolate to today's marginal donations.** The UK returns literature is one of the best evidence bases available, but it is still backward-looking and partly based on major historical wins.
4. **Additionality in rich-country systems.** Some direct programs and research grants unlock value that governments or insurers would not otherwise fund; others mainly substitute for spending that would have happened anyway.
5. **How much of the recipient universe is actually "strong philanthropy" rather than generic healthcare fundraising.** This page intentionally models the stronger end of the category. Some specific recipients currently tagged to this category are probably worse than the category default.
6. **QALY measurement itself.** Mental-health gains, reproductive-health gains, diagnostic gains, and caregiver spillovers are all hard to convert into a single scalar measure, so some interventions may be understated or overstated.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- Owen & Fischer is doing two jobs here: showing that many high-income public-health interventions are far below payer thresholds, and providing a quantitative cross-check for the direct bucket after a substantial marginality haircut.
- A future dedicated assumption page on medical-research returns or on the direct/research mix could be useful if more recipient-specific overrides are added in this category.
