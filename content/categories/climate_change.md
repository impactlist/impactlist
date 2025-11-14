---
id: climate-change
name: 'Climate Change'
effects:
  - effectId: standard
    startTime: 7
    windowLength: 80
    costPerQALY: 900
---

# Justification of cost per life

_The following analysis was done on November 12th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **\$900 per QALY**  
**Range (plausible):** **\$150–\$20,000 per QALY**

## Details

**How donations reduce emissions.**  
Independent evaluators argue that a handful of policy-focused charities can avert large amounts of CO₂e per dollar by shaping standards, incentives, and technology roadmaps. Founders Pledge reports that grants to its high-impact recommendations in 2023 **could avert ~47.9 MtCO₂e** on **\$6.9M** in grants—about **\$0.14 per ton** in expectation (highly uncertain) ([Founders Pledge impact 2023](https://impact.founderspledge.com/2023/climate-change)). Giving Green's 2025 overview suggests a practical benchmark of **~1 tCO₂e per \$1** for top nonprofits ([Giving Green](https://www.givinggreen.earth/post/eager-to-measure-the-impact-of-your-climate-donation-forget-offset-math-focus-on-systems-change)). Earlier Founders Pledge analyses of **Clean Air Task Force** and peers indicate **\$0.10–\$1 per tCO₂e** is plausible for advocacy wins, with large error bars ([CATF summary of FP estimate](https://www.catf.us/timeline/rated-top-climate-charity/); FP research hub [overview](https://www.founderspledge.com/research/climate-change-executive-summary)). These figures concern **systems change** rather than retail offsets; FP cautions that ultra-cheap offsets often lack additionality ([FP: climate & offsetting](https://www.founderspledge.com/research/climate-and-lifestyle-donations-and-offsetting)).

**From tons to health: the mortality link.**  
Two influential, empirically grounded papers translate **one ton of CO₂** into expected mortality:

- **Carleton et al. (QJE 2022)**: monetize mortality damages at **~\$36.6 per ton** (high-emissions case) and project large end-century mortality burdens without mitigation ([QJE paper](https://academic.oup.com/qje/article/137/4/2037/6571943); [EPIC summary](https://epic.uchicago.edu/research/valuing-the-global-mortality-consequences-of-climate-change-accounting-for-adaptation-costs-and-benefits/)).
- **Bressler (Nature Communications 2021)**: "mortality cost of carbon" (MCC) of **2.26 × 10⁻⁴ deaths per tCO₂** in 2020 (i.e., **~4,434 tCO₂ per expected life saved** over 2020–2100) ([Nature Communications](https://www.nature.com/articles/s41467-021-24487-w)).

To map deaths to **QALYs**, we draw on studies of **years of life lost (YLL)** in heat-related mortality—most climate-attributable deaths are among older adults, with nontrivial YLL but less than in child mortality. A multicity European study estimated **~23,750 YLL for ~2,200 heat deaths** before accounting for short-term “harvesting” (≈10.8 YLL/death) and **~5,907 YLL** after accounting for harvesting (≈**2.7 YLL/death**) ([Baccini et al., PLOS One 2013](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0069638)). Age-profiled analyses of recent European heat seasons confirm the **80+ group carries most heat-mortality**, consistent with fewer YLL per death than in under-5 mortality ([Nature Medicine 2023](https://www.nature.com/articles/s41591-023-02419-z)). For a simple, transparent conversion we therefore model **~5 QALYs lost per climate-attributable death** (range **2–10**), acknowledging that some climate pathways (e.g., food insecurity, vector-borne disease) can involve younger ages and higher YLL.

**Putting it together (back-of-the-envelope).**

- Mortality per ton: **2.26 × 10⁻⁴ deaths/tCO₂** (Bressler).
- QALYs per death (assumed): **5** (range **2–10**).
- So **QALYs per ton ≈ 2.26 × 10⁻⁴ × 5 = 0.00113**.
- A charity that averts **~1 tCO₂ per \$1** then yields **\$1 / 0.00113 ≈ \$885 per QALY**.
- Using a conservative advocacy cost of **\$1.5/tCO₂** gives **~\$1,300 per QALY** (our point estimate).
- Bounding the inputs—**\$0.3–\$10/tCO₂** and **2–10 QALYs/death**—spans **~\$150–\$20,000 per QALY**.

**Context and caveats.**

- These numbers reflect **temperature-related mortality** only. Many mitigation actions also cut **air pollution**, producing near-term health gains not fully captured here and likely improving cost-per-QALY further ([IPCC AR6 WGII, Ch. 7](https://www.ipcc.ch/report/ar6/wg2/chapter/chapter-7/); health fact sheet: [IPCC AR6 WGII](https://www.ipcc.ch/report/ar6/wg2/downloads/outreach/IPCC_AR6_WGII_FactSheet_Health.pdf)).
- Advocacy impacts are **risky and lumpy**: expected tons per dollar are uncertain and vary by policy window and geography (see FP’s own uncertainty notes and EA community critiques/discussions, e.g., [EA Forum discussion](https://forum.effectivealtruism.org/posts/NbWeRmEsBEknNHqZP/longterm-cost-effectiveness-of-founders-pledge-s-climate)).
- Climate impacts are **highly unequal** by region and age; the QALY mapping should be read as a global average simplification consistent with the major mortality studies’ global framing ([Carleton QJE 2022](https://academic.oup.com/qje/article/137/4/2037/6571943)).

**Bottom line.**
For donations to top, policy-oriented climate nonprofits, the best current evidence implies a cost per QALY on the order of **low thousands of dollars**, with a central estimate near **\$900–\$1,300 per QALY** and a wide but bounded range reflecting advocacy uncertainty and the age profile of climate-attributable deaths.

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes

GPT5:

## Start time & duration (for modeling)

- **Start time:** **3 years** (range **1–7 years**).  
  _Why:_ For top climate nonprofits focused on policy and technology advocacy, donations typically translate into policy wins or regulatory changes within a few budget/legislative cycles; emissions effects begin as rules take effect and projects build out (e.g., rapid post-policy scale-up observed in recent U.S./EU packages).

- **Duration of benefit:** **70 years** (range **40–80 years**).  
  _Why:_ Avoided CO₂ today reduces temperature-related health harms across the remainder of the century. Major climate-mortality studies quantify impacts on a 2020–2100 horizon, so benefits accrue over multiple decades.
