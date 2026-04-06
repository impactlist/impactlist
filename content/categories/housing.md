---
id: housing
name: 'Homelessness and Housing'
effects:
  - effectId: standard
    startTime: 0
    windowLength: 2
    costPerQALY: 30_000
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures health gains from strong **direct homelessness and housing interventions in wealthy countries**, especially:

- eviction prevention / temporary financial assistance
- rapid rehousing
- permanent supportive housing / Housing First
- hospital-discharge and step-down services for people leaving hospitals into homelessness

The main benefit is not that housing restores recipients to perfect health. It is that moving people from homelessness or severe housing instability into stable housing usually improves quality of life, reduces crisis-service use, and in some especially high-risk subgroups also reduces overdose, infection, or mortality risk.

This does not cover broad housing-supply reform, zoning reform, or generic affordable-housing construction.

## Point Estimates

- **Cost per QALY:** \$30,000 (\$15,000-\$80,000)
- **Start time:** 0 years
- **Duration:** 2 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. In the VA Supportive Services for Veteran Families study, temporary financial assistance / rapid rehousing / homelessness prevention cost about **\$22,676/QALY overall**, with **\$19,114/QALY** for rapid rehousing and **\$29,751/QALY** for prevention over a 2-year horizon. That study also found about **90 extra days in stable housing** over 2 years, but it treated stable housing as utility **1.0**, which likely makes its QALY estimate somewhat optimistic. ([JAMA Network Open 2024](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2825636))
2. A recent model of stable housing for homeless adults with opioid use disorder found cost-effectiveness around **\$26,800-\$28,500/QALY** in its main scenarios and **\$27,300/QALY** in a conservative scenario. ([JAMA Network Open 2025](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2835706))
3. In the Canadian At Home / Chez Soi trial, Housing First with assertive community treatment cost about **Can\$41.73 per additional day of stable housing**. A related JAMA Network Open analysis of Housing First with intensive case management estimated about **Can\$56.08 per additional day of stable housing**. Both papers report these figures directly, and both use **2016 Canadian dollars**. These are useful because they let us convert observed housing gains into QALYs without assuming that housed participants jump all the way to perfect health. ([Psychiatric Services 2020](https://pubmed.ncbi.nlm.nih.gov/32838679/), [JAMA Network Open 2019](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2748596))
4. Rajan and Tsai estimated the average utility value associated with homelessness at **0.434** using a standard-gamble survey of **6,607** middle- and low-income US adults. This is a survey average, not a clinical estimate for one specific homeless subgroup. ([Medical Care 2021](https://pubmed.ncbi.nlm.nih.gov/34629422/))
5. A reasonable utility for a stably housed but still high-needs recipient is roughly **0.75-0.85**, not **1.0**. That is above the OUD model's housed-state utilities around **0.668-0.721**, because this category is broader than active OUD alone, but well below perfect health because these clients still have heavy medical, psychiatric, and substance-use burdens. ([JAMA Network Open 2025](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2835706))
6. Hospital discharge / step-down services for homeless patients appear to span a wide cost-effectiveness range. An older randomized Pathway trial reported about **GBP26,000/QALY**, while a later NIHR evaluation of three service configurations found approximately **GBP4,743/QALY**, **GBP14,515/QALY**, and **GBP55,602/QALY**. ([Pathway RCT](https://pmc.ncbi.nlm.nih.gov/articles/PMC5922699/), [NIHR / NCBI Bookshelf](https://www.ncbi.nlm.nih.gov/books/NBK574250/))
7. Housing services for homeless or unstably housed people with HIV were estimated at about **\$62,493/QALY**, which is a useful upper-end anchor for intensive, medically specific housing support. ([AIDS and Behavior 2013](https://pubmed.ncbi.nlm.nih.gov/22588529/))
8. The Community Guide's systematic review of Housing First found large improvements in housing stability and homelessness outcomes and modest quality-of-life gains, and concluded that economic benefits likely exceed costs. But it also noted evidence gaps around direct cost-effectiveness and long-run health effects. ([Community Guide](https://www.thecommunityguide.org/findings/social-determinants-health-housing-first-programs.html))
9. Housing interventions should not be modeled as automatically producing large mortality gains across all populations. In a 2025 secondary analysis of the 5-city Canadian Housing First trial among homeless adults with mental illness, the adjusted hazard ratio for mortality was **0.83** with a **95% CI of 0.43-1.22**, so the mortality effect was not clearly established. ([JAMA Network Open 2025](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2839942))
10. A reasonable category-level portfolio is tilted toward the stronger short-term / targeted bucket rather than the broader supportive-housing bucket, because eviction prevention, temporary financial assistance, rapid rehousing, and targeted discharge support are usually easier to fund at the margin than adding many new permanent supportive-housing placements in supply-constrained local markets. We model this as roughly a **60% / 40%** split.

## Details

### Cost per QALY

The cleanest estimate here uses **two anchors**:

1. direct cost-utility studies of specific housing interventions
2. an independent conversion from "cost per additional day housed" into QALYs using a realistic housed-vs-unhoused utility gap

That second anchor matters because some published housing CEAs become materially more favorable when they implicitly assume that a stably housed person has utility **1.0**.

**Anchor 1 - direct cost-utility evidence**

The best direct CUA evidence is not all over the place. Most of it lands in the **tens of thousands of dollars per QALY**:

- SSVF temporary financial assistance / rapid rehousing / prevention: about **\$19,000-\$30,000/QALY** (Assumption 1)
- stable housing for homeless adults with OUD: about **\$27,000/QALY** (Assumption 2)
- hospital discharge / step-down services: from the **low tens of thousands of pounds per QALY** up to about **GBP55,600/QALY** depending on service design (Assumption 6)
- HIV-specific housing support: about **\$62,500/QALY** (Assumption 7)

So the direct literature suggests that strong housing interventions are usually well below common high-income-country payer thresholds like \$100,000/QALY, but still mostly in the mid- or high-tens-of-thousands-per-QALY range.

**Anchor 2 - convert observed housing gains into QALYs**

The Housing First ACT and ICM trials give results in **cost per extra day of stable housing** rather than cost per QALY. That is useful because we can combine those data with a homelessness utility estimate.

Using:

- unhoused utility $u_u = 0.434$ (Assumption 4)
- housed utility $u_h = 0.75-0.85$ (Assumption 5)

each additional day of stable housing generates approximately:

$$
\frac{u_h - u_u}{365} = \frac{0.316 \text{ to } 0.416}{365} \approx 0.00087 \text{ to } 0.00114 \text{ QALYs}
$$

So:

$$
\text{Cost per QALY} \approx \frac{\text{cost per extra day housed}}{(u_h-u_u)/365}
$$

Applying that to the Canadian trials, and using approximately **US\$0.74 per Can\$1** for rough comparability:

- **ACT:** Can\$41.73/day -> roughly **Can\$36,600-Can\$48,200/QALY**, or about **US\$27,000-US\$36,000/QALY**
- **ICM:** Can\$56.08/day -> roughly **Can\$49,200-Can\$64,800/QALY**, or about **US\$36,000-US\$48,000/QALY**

This is an important cross-check. It suggests that once we stop equating "housed" with "perfect health," the broader Housing First / supportive-housing literature is better described as **mid-tens-of-thousands per QALY**.

The same logic also suggests some upward bias in the SSVF ICERs, because that study likewise assigns utility **1.0** to stable housing. Re-expressing its extra stable-housing days with a more realistic utility gap moves the implied cost per QALY upward, even though the intervention still looks strong.

**Combined portfolio estimate**

The category should not be modeled on the single strongest rapid-rehousing paper. A better category-level model is a mix of:

- a **short-term / strongly targeted bucket** around **\$25,000/QALY**
- a **broader supportive-housing bucket** around **\$45,000/QALY**

The first bucket is anchored by SSVF, OUD-targeted housing, and the better hospital-discharge models. The second bucket is anchored by the Housing First day-housed conversions, the HIV housing estimate, and the fact that recent mortality evidence does **not** support assuming large mortality gains for every supportive-housing program.

The **60% / 40%** tilt toward the first bucket is a judgment call, but a reasonable one. The strongest marginal opportunities are more likely to be prevention, temporary assistance, rapid rehousing, or targeted discharge support than large numbers of new permanent supportive-housing slots, because the former are usually cheaper, faster to deploy, and less bottlenecked by local housing supply.

If we use that **60% / 40%** split, then:

$$
\text{QALYs per dollar} = \frac{0.6}{25{,}000} + \frac{0.4}{45{,}000} \approx 0.0000329
$$

$$
\text{Cost per QALY} \approx \frac{1}{0.0000329} \approx \$30{,}400
$$

Rounded, that gives a point estimate of **\$30,000/QALY**.

**Range**

The stated **\$15,000-\$80,000/QALY** range is a practical sensitivity range, not a full confidence interval.

The low end corresponds to unusually strong targeting: rapid-rehousing / prevention programs, especially good hospital-discharge models, or other interventions that mostly buy cheap housing stability for very high-risk clients.

The high end corresponds to a mix tilted toward more intensive supportive-housing programs, weaker health spillovers, lower persistence after services end, or more capital-heavy / medically complex service models.

### Start Time

We use a **0-year** start time because the main mechanism here is fast. Rent-arrears assistance, move-in support, rapid rehousing, and hospital discharge services typically affect housing status within weeks or months, not after a multiyear lag.

Some downstream health gains accumulate more gradually, but this field is mostly about services that change living conditions almost immediately. Since the site's start-time parameter is measured in whole years, **0** is a better approximation than **1**.

### Duration

We use a **2-year** duration because that is where the direct evidence base is strongest:

- the SSVF CUA uses a **2-year** horizon
- the main Canadian Housing First trials followed people for about **24 months**
- some discharge-service evaluations focus on about **1 year**

Some specific interventions may have longer tails than 2 years, and the OUD model uses a lifetime horizon. But category-level estimates should be anchored to directly observed persistence, not to the most optimistic extrapolation. The Community Guide also notes that long-run health effects remain under-studied, which argues for keeping the default duration fairly conservative.

## What Kinds of Charities Are We Modeling?

This estimate is best read as a model of **strong direct-service homelessness / housing philanthropy** in high-income settings.

Good fits include:

- eviction prevention and emergency financial assistance
- rapid rehousing programs
- permanent supportive housing with strong service targeting
- hospital-discharge teams or step-down housing for homeless patients
- housing interventions aimed at especially high-risk medical subgroups

Poor fits include:

- generic affordable-housing development projects with weak evidence on health gains
- unrestricted fundraising for large housing nonprofits without a strong evidence base
- broad land-use or zoning reform, which should usually be modeled as an institutional-reform bet instead
- shelters or service providers that mainly offer temporary relief without much durable housing placement

## Key Uncertainties

1. **What the marginal intervention mix really is.** The category looks much better if marginal dollars mostly fund prevention, rapid rehousing, or strong hospital-discharge models, and worse if they mostly fund expensive permanent-supportive-housing slots.
2. **How large the housed-vs-unhoused utility gap really is.** This is one of the biggest drivers of the estimate. Treating housed clients as utility 1.0 is too optimistic, but there is still real uncertainty about the right value.
3. **How durable the gains are after services end.** Some households remain stably housed after short interventions; others cycle back into homelessness.
4. **How much mortality and medical benefit generalizes beyond special subgroups.** Housing may save lives for some especially high-risk populations, but the evidence does not support assuming large mortality gains across the board.
5. **How additional a donation really is in tight local housing markets.** If a charity mostly shifts access to scarce units without increasing total housing availability or retention, the true marginal impact can be lower than program-level results suggest.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- The key update here is methodological, not just numerical: the page now treats "days stably housed" plus a realistic utility gap as a serious cross-check on published ICERs.
- If this category gets more recipient-level overrides, a dedicated assumption page on the housed-vs-unhoused utility gap could become worthwhile.
- A future editor could also split this category into two cleaner subcategories: direct homelessness services vs broader housing / affordability work.
