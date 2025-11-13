---
id: housing
name: 'Homelessness and Housing'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 3
    costPerQALY: 25_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **$25,000 per QALY**  
**Range (plausible):** **$20,000–$60,000 per QALY**

## Details

**What’s included.**  
“Homelessness & Housing” in wealthy nations covers programs like **temporary financial assistance/rapid rehousing**, **homelessness prevention**, **permanent supportive housing (Housing First)**, and **hospital–to–home discharge teams**. These interventions improve survival, reduce acute care use, and raise health-related quality of life, which together translate into QALYs.

**Direct cost-per-QALY evidence (high-quality, recent).**

- **Temporary Financial Assistance (TFA) / Rapid Rehousing (U.S. Veterans):** A 2024 economic evaluation of the VA’s Supportive Services for Veteran Families program found **$22,676 per QALY** overall, **$19,114 per QALY** for rapid rehousing, and **$29,751 per QALY** for homelessness prevention over a 2-year horizon ([JAMA Network Open](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2825636); open access summary: [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11539017/)).

- **Stable housing for people experiencing homelessness with opioid use disorder:** A 2025 model estimated **$27,300 per QALY** (lifetime horizon), with sensitivity analyses in the **$20k–$33k** range ([JAMA Network Open](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2835706)).

- **Hospital discharge teams for people who are homeless (UK “Pathway” model):** A randomized trial reported a **£26,000 per QALY** cost-effectiveness ratio (approx. low-$30k at typical exchange rates) and improved post-discharge quality of life ([PubMed abstract](https://pubmed.ncbi.nlm.nih.gov/27251910/); trial materials: [Oxford ORA PDF](https://ora.ox.ac.uk/objects/uuid%3A55c8cf85-151e-455e-9910-fddec47dc6c1/files/mea6cc822f9884567130a55bd13a9c2db)).

- **Rental assistance for people living with HIV (U.S.):** Earlier cost-utility work estimated **$62,493 per QALY** ([AIDS & Behavior](https://pubmed.ncbi.nlm.nih.gov/22588529/)), illustrating that costs rise in populations needing intensive, disease-specific support.

**Economic cross-checks (not QALY-based).**  
A CDC/Community Guide systematic economic review of **Permanent Supportive Housing (Housing First)** found a median U.S. **program cost of $16,479/person-year** and a **benefit-to-cost ratio ~1.8:1** (societal perspective), indicating substantial **cost offsets** even before valuing QALYs ([AJPM review via PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8863642/); summary PDF: [The Community Guide](https://thecommunityguide.org/media/pdf/he-ajpm-ecrev-housing-first.pdf)). While not a QALY result, these offsets help explain why several QALY-based studies above land in the low tens of thousands per QALY.

**How the estimate was formed.**  
Anchoring on the strongest QALY studies in high-income settings—**$19k–$30k per QALY** for rapid rehousing/TFA and for housing with OUD—yields a central tendency around **$25k per QALY**. Including programs serving particularly complex clinical needs (e.g., HIV) pushes the upper tail toward **$60k per QALY**. This corridor aligns with independent hospital-discharge team evidence (~**£26k/QALY**). It also sits comfortably within commonly used high-income decision benchmarks (e.g., **£20k–£30k per QALY** in the UK; see [NICE manual](https://www.nice.org.uk/process/pmg36/resources/nice-health-technology-evaluations-the-manual-pdf-72286779244741)).

**Why the range.**  
Cost-effectiveness varies with (i) **targeting** (higher baseline risk → more QALYs gained), (ii) **program type and intensity** (prevention vs rehousing vs permanent supportive housing), (iii) **time horizon** (2-year vs lifetime modeling), and (iv) **valuation perspective** (some studies include large cost offsets from reduced emergency care and justice involvement). Taken together, these factors produce a defensible **$20k–$60k per QALY** envelope around a **$25k** point estimate.

**Bottom line.**  
When directed to highly effective homelessness/housing programs in rich countries—especially rapid rehousing/temporary financial assistance, well-run Housing First/PSH, and hospital-discharge teams—the best current evidence suggests **health gains at roughly $25,000 per QALY**, with credible variation across populations and models.

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes

## Start time & duration (for modeling)

- **Start time:** **0.25 years** (range **0.05–0.75 years**).  
  _Why:_ Leading programs (e.g., rapid rehousing, temporary financial assistance, hospital discharge teams) typically place or stabilize clients within weeks to a few months of enrollment. See U.S. HUD guidance indicating rapid rehousing assistance begins immediately and can cover move-in costs and early rent support ([HUD Exchange, RRH](https://www.hudexchange.info/homelessness-assistance/coc-esg-virtual-binders/coc-program-components/permanent-housing/rapid-re-housing/)).

- **Duration of benefit:** **2 years** (range **1–5 years**).  
  _Why:_ Rapid rehousing and prevention supports are commonly time-limited to **3–24 months** ([24 CFR §576.106](https://www.ecfr.gov/current/title-24/subtitle-B/chapter-V/subchapter-C/part-576#576.106)), with health and housing stability effects often measured over 1–2 years in cost-utility models. Permanent supportive housing can be indefinite ([HUD PSH overview](https://www.hudexchange.info/homelessness-assistance/coc-esg-virtual-binders/coc-program-components/permanent-housing/permanent-supportive-housing/)), but philanthropic dollars frequently purchase 1–2 years of services; we model a conservative 2-year effect window.
