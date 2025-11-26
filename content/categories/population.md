---
id: population
name: 'Population'
effects:
  - effectId: standard
    startTime: 2
    windowLength: 80
    costPerQALY: 600
---

# Justification of cost per life

_The following analysis was done on November 13th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **\$600 per QALY**  
**Range (plausible):** **\$200–\$2,000 per QALY**

### What’s included

By “Population charities” we mean top opportunities that **raise births on the margin** in high-income countries via:

1. **Policy/advocacy** for family benefits (child allowances/“baby bonuses”),
2. **IVF/infertility access** (coverage mandates, philanthropic treatment funds), and
3. **Regulatory/workplace changes** that reduce barriers to family formation.

### Step 1 — Cost per additional birth (CPB)

We anchor CPB to revealed-effect policies and programs:

- **Baby bonuses / child allowances:**  
  • Québec’s allowance implied **> \$15,000 per additional birth** to the public purse ([Milligan/NIESR summary](https://obr.uk/box/intergenerational-fairness/) citing [Milligan]; also [childcarecanada brief](https://childcarecanada.org/documents/research-policy-practice/02/03/qu%C3%A9becs-baby-bonus-can-public-policy-raise-fertility)).  
  • Australia’s baby bonus has been estimated around **\$39,000 per extra child** (2000s AUD→USD-adj.) in one reappraisal ([Sinclair 2010](https://mpra.ub.uni-muenchen.de/27580/1/MPRA_paper_27580.pdf)) and **~\$50,000 (2004 AUD)** in later work (~**\$86k** in 2025 dollars) ([e61 Institute write-up](https://e61.in/how-financial-incentives-shape-fertility-in-australia/)).  
  • Hungary’s policy suite shows large fiscal outlays per marginal birth ([HÉTFA/OECD brief](https://hungary.representation.ec.europa.eu/system/files/2021-12/hetfa_fertilitymodels_20190913.pdf)).

- **IVF access:** A U.S. IVF cycle often costs **\$20–25k**, with the **cost per live birth exceeding ~\$60k** in some locations; coverage mandates change utilization and outcomes ([Peipert 2022 review](https://pmc.ncbi.nlm.nih.gov/articles/PMC9351254/); see also [Fertility & Sterility 2021](https://www.fertstert.org/article/S0015-0282%2821%2900924-9/fulltext)).

**Central CPB assumption used below:** **\$40,000 per additional birth** (range **\$15,000–\$86,000**), reflecting a weighted mix of policy and access routes.

### Step 2 — QALYs per additional birth (including externalities)

We explicitly separate (A) the **new person’s own wellbeing** and (B) **positive externalities on others via GDP**. Because many benefits are non-health, we use the UK Treasury’s wellbeing guidance as a bridge: **1 WELLBY = a 1-point life-satisfaction gain for 1 person-year** and is valued at **~£13,000** (2019 prices). That guidance maps **~7 WELLBY ≈ 1 QALY** (so **1 QALY ≈ £91,000**, roughly **\$110k–\$120k** today) ([HM Treasury 2021](https://www.gov.uk/government/publications/green-book-supplementary-guidance-wellbeing); accessible explainer: [What Works Wellbeing](https://whatworkswellbeing.org/blog/converting-the-wellby/)). We also draw on the income–wellbeing literature showing wellbeing rises with log income ([Killingsworth 2021](https://www.pnas.org/doi/10.1073/pnas.2016976118)).

**(A) QALYs from the added person’s own life**

- High-income life expectancy ≈ **80 years** ([OECD 2024](https://www.oecd.org/en/publications/society-at-a-glance-2024_918d8db3-en/full-report/life-expectancy_37a61588.html); [World Bank HIC series](https://fred.stlouisfed.org/series/SPDYNLE00INHIC)).
- Average quality-of-life weight (broad life quality, not just health): **0.8–0.9**.
- **Assumption:** **~65 QALYs** per additional person (80 × 0.82 ≈ 65), range **50–80**.

**(B) QALYs from GDP externalities on others** (three channels)

1. **Net fiscal externality (public goods financed by taxes):**  
   Generational accounting suggests newborns in rich countries make **positive net discounted contributions** to public finances.  
   • UK NIESR/OBR: **~£68,400** net to the Exchequer per newborn on current policy ([OBR box](https://obr.uk/box/intergenerational-fairness/)).  
   • Australia (ART cohort): **A\$70,688** lifetime net tax revenue per child ([Connolly et al. 2025](https://jheor.org/api/v1/articles/133796-estimating-the-fiscal-value-of-children-conceived-from-assisted-reproduction-technology-in-australia-applying-a-public-economic-perspective.pdf)).  
   **Convert to QALYs:** Treat these as consumption benefits to others; dividing by **~\$115k per QALY** ⇒ **~0.6–0.8 QALY** to others.

2. **Innovation/ideas spillovers (nonrival knowledge):**  
   The chance a random person becomes an R&D researcher is ~**0.1–0.2%** (≈**1,000–1,400 per million**) ([UNESCO/World Bank](https://data.worldbank.org/indicator/SP.POP.SCIE.RD.P6); [UN Stats 2024](https://unstats.un.org/sdgs/metadata/files/Metadata-09-05-02.pdf)).  
   Social returns to innovation are **very large**: a simple “top-down” calculation suggests **>\$10 of economy-wide benefit per \$1 of R&D** ([Jones 2020, NBER WP 27863](https://www.nber.org/system/files/working_papers/w27863/w27863.pdf)). With global R&D ≈ **\$3T** ([WIPO 2024](https://www.wipo.int/en/web/global-innovation-index/w/blogs/2024/end-of-year-edition)), spend per researcher-year is roughly **\$0.25–0.35M**; a **10:1** social benefit implies **~\$2.5–3.5M** in surplus per researcher-year. Multiplying by a **~30-year** career and by a **0.13%** probability of being a researcher yields **~\$0.1–0.2M** expected spillover to others **per birth**, i.e., **~1 QALY** (divide by ~\$115k/QALY).  
   _(This channel is highly uncertain; we cap it at 0.2–3 QALYs in the range.)_

3. **Scale/agglomeration spillovers (specialization, thicker markets):**  
   Meta-analyses find that **doubling city size raises productivity by ~3–8%** through knowledge sharing and specialization ([Melo et al. 2009](https://www.sciencedirect.com/science/article/pii/S0166046208001269); [OECD 2017 review](https://www.oecd.org/content/dam/oecd/en/publications/reports/2017/02/what-makes-cities-more-productive_5916f4ba/2ce4b893-en.pdf)). The marginal global effect of one additional person is tiny per year but persistent; we conservatively **credit ~0.5 QALY** over a lifetime for the diffuse gains this person enables for others (range **0–2 QALYs**).

**Putting (A) + (B) together (central):**

- **Own life:** ~**65 QALYs**
- **Externalities:** ~**0.7 (fiscal) + 1.0 (innovation) + 0.5 (agglomeration) ≈ 2.2 QALYs**
- **Total per additional birth:** **~67 QALYs** (range **50–85**).

### Step 3 — Cost per QALY

**Cost per QALY ≈ (Cost per additional birth) / (QALYs per birth) ≈ \$40,000 / 67 ≈ \$600 per QALY**

**Range rationale:**

- If CPB is **\$15k** (Québec-style) and benefits **80 QALYs**, cost ≈ **\$190/QALY**.
- If CPB is **\$86k** (high-end Australian estimate today) and benefits **50 QALYs**, cost ≈ **\$1,700/QALY**.
- **Externalities-only** (excluding the added person’s own QALYs): ~**2 QALYs/birth**, so with CPB **\$40k**, cost ≈ **\$20,000/QALY**; this shows the direct wellbeing of the new person dominates, while GDP spillovers **improve** cost-effectiveness further.

## Assumptions & conversions (explicit)

- **Counting new lives:** We count the added person’s life as positive QALYs (not just averting a death). Central **65 QALYs/person** comes from **~80-year life expectancy** in rich countries with an **average 0.8–0.85** quality weight ([OECD](https://www.oecd.org/en/publications/society-at-a-glance-2024_918d8db3-en/full-report/life-expectancy_37a61588.html)).
- **GDP→QALY bridge:** We convert income/GDP benefits to QALYs via **WELLBYs**, using **HM Treasury** guidance: **1 WELLBY ≈ £13k** and **~7 WELLBY ≈ 1 QALY** ([HMT 2021](https://www.gov.uk/government/publications/green-book-supplementary-guidance-wellbeing); [What Works Wellbeing](https://whatworkswellbeing.org/blog/converting-the-wellby/)).
- **Innovation channel:** Expected spillovers per birth = _(probability of becoming a researcher)_ × _(social surplus per researcher career)_, with **researchers ≈ 1,000–1,400 per million** ([World Bank/UNESCO](https://data.worldbank.org/indicator/SP.POP.SCIE.RD.P6)) and **social surplus ≈ 10× R&D spend** ([Jones 2020](https://www.nber.org/system/files/working_papers/w27863/w27863.pdf)).
- **Agglomeration channel:** We use meta-analytic elasticities (3–8% per city-size doubling) ([Melo 2009](https://www.sciencedirect.com/science/article/pii/S0166046208001269); [OECD 2017](https://www.oecd.org/content/dam/oecd/en/publications/reports/2017/02/what-makes-cities-more-productive_5916f4ba/2ce4b893-en.pdf)) to justify a small, persistent lifetime credit (**~0.5 QALY**) for others.

## Cross-checks and external anchors

- The **income→wellbeing** literature supports valuing broad prosperity gains (e.g., [Killingsworth 2021](https://www.pnas.org/doi/10.1073/pnas.2016976118)).
- **Social returns to innovation** appear very high by multiple approaches ([Jones & Williams 1998](https://academic.oup.com/qje/article-abstract/113/4/1119/1916988); [Bloom et al. 2020](https://www.aeaweb.org/articles?id=10.1257%2Faer.20180338); [Jones 2020](https://www.nber.org/system/files/working_papers/w27863/w27863.pdf)).
- **Policy CPB** numbers are plausibly large (tens of thousands per birth) across contexts ([Québec](https://childcarecanada.org/documents/research-policy-practice/02/03/qu%C3%A9becs-baby-bonus-can-public-policy-raise-fertility); [Australia](https://mpra.ub.uni-muenchen.de/27580/1/MPRA_paper_27580.pdf), [e61](https://e61.in/how-financial-incentives-shape-fertility-in-australia/); [Hungary/OECD](https://hungary.representation.ec.europa.eu/system/files/2021-12/hetfa_fertilitymodels_20190913.pdf)). Our CPB central value of **\$40k** sits inside that range and is similar to philanthropic IVF-access “cost per live birth” ([Peipert 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9351254/)).

**Bottom line:** Even **after** accounting for GDP externalities separately (fiscal, innovation, and agglomeration), the **dominant benefit** of pro-natalist charity is the added person’s lifetime wellbeing. With reasonable, evidence-anchored parameters, top Population charities plausibly deliver impact in the **low-hundreds to low-thousands of dollars per QALY**, with a central estimate of **~\$600 per QALY**.

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes
