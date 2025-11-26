---
id: health-medicine
name: 'Health / Medicine'
effects:
  - effectId: standard
    startTime: 5
    windowLength: 40
    costPerQALY: 25_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking, cross-checked by Claude Sonnet 4.5 and Gemini Pro 2.5, and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **\$25,000 per QALY**  
**Range (plausible):** **\$5,000–\$100,000 per QALY**

## Details

**What’s in scope.**  
This category covers two kinds of high-income-country opportunities: (1) **biomedical research** that accelerates new diagnostics, drugs, and care models; and (2) **direct treatment/support programs** (e.g., smoking cessation, blood-pressure control, patient navigation, cataract care, and some mental-health services).

**Evidence from direct treatment in wealthy countries (illustrative best-in-class).**

- **Hypertension control (team-based care):** median **\$16,309 per QALY** (2023 USD) across U.S. studies, according to the CDC's evidence review.
  Source: [CDC summary](https://www.cdc.gov/nccdphp/priorities/high-blood-pressure.html).

- **Smoking cessation:** tailored behavioral support in the UK achieved **£3,145 per QALY** versus usual care; primary-care NRT sampling in the U.S. modeled at **~\$7,500 per QALY** (ignoring lifetime medical cost offsets).
  Sources: UK bespoke cessation intervention ([eClinicalMedicine](https://www.thelancet.com/journals/eclinm/article/PIIS2589-5370%2823%2900005-6/fulltext)); U.S. NRT sampling ([J Gen Intern Med](https://link.springer.com/article/10.1007/s11606-021-07335-x)).

- **Patient navigation (cancer):** lifetime **\$19,312 per QALY** for a Medicare navigation program.
  Source: [Health Services Research](https://pmc.ncbi.nlm.nih.gov/articles/PMC4799903/).

- **Cataract surgery (high-income settings):** **\$245–\$22,000 per QALY** (first-eye), depending on setting and assumptions.
  Source: systematic review/meta-evidence ([Ophthalmology](https://files.givewell.org/files/DWDA%202009/Interventions/Cataract/LansinghCarterMartens-2007.pdf)).

- **Mental health (IAPT-style CBT in the UK):** **£16,857–£29,500 per QALY** with substantial uncertainty.  
  Sources: [Br J Psychiatry](https://www.cambridge.org/core/journals/the-british-journal-of-psychiatry/article/costeffectiveness-of-an-improving-access-to-psychological-therapies-service/0C5F920997C998C76067B32032E4CABA); [PubMed summary](https://pubmed.ncbi.nlm.nih.gov/23307921/).

These point estimates cluster from **low-thousands to low-tens-of-thousands of dollars per QALY** for the strongest opportunities. Independent cardiovascular models likewise find intensive BP control in high-risk adults at **~\$23,800 per QALY** in the U.S.
Source: [JAMA Cardiology](https://jamanetwork.com/journals/jamacardiology/fullarticle/2551983).

**What to expect from medical research.**  
Unlike service delivery, research is “hits-based”: most projects have small impact, a few have very large impact. The UK’s flagship meta-evaluation attributes a **~17-year** lag from research to population health gains and estimates **health IRRs of ~7–9%** (cardiovascular ~9%; mental health ~7%) from the net value of QALYs produced—before adding GDP spillovers.  
Source: _Medical Research: What’s it worth?_ ([UKRI/RAND](https://www.ukri.org/wp-content/uploads/2022/02/MRC-030222-medical-research-whats-it-worth.pdf), pp. 26, 44–55). Open Philanthropy’s **hits-based** approach and BOTECs reflect this skew and uncertainty in biomedical funding.  
Source: [Open Philanthropy](https://www.openphilanthropy.org/research/how-we-use-back-of-the-envelope-calculations-in-our-grantmaking/).

**Cross-checks against health-system benchmarks.**
High-income health agencies generally accept incremental costs **up to ~£20k–£30k per QALY** (UK) or **\$100k–\$150k per QALY** (U.S.) when deciding whether to fund a therapy—useful external anchors for what additional QALYs typically "cost" at the margin of rich health systems.
Sources: **NICE** methods manual ([NICE](https://www.nice.org.uk/process/pmg36/resources/nice-health-technology-evaluations-the-manual-pdf-72286779244741)); **ICER** value assessment framework ([ICER](https://icer.org/wp-content/uploads/2022/01/ICER_2020_2023_VAF_120821.pdf)).

**Bringing the strands together.**
If we direct donations to **top** high-income opportunities:

- The **best direct programs** (cessation, hypertension, navigation, cataract) often deliver **\$5k–\$30k per QALY**.
- **Biomedical research** has a **wide distribution** of outcomes with long lags but can achieve excellent expected value when it accelerates widely used treatments.

Weighting toward research (as is typical for this cause area) but anchored by the demonstrated cost-per-QALY of top direct programs yields a **central estimate near \$25,000 per QALY** with a **plausible range of \$5,000–\$100,000 per QALY**. The upper end aligns with U.S. threshold practice (ICER), while the lower end is supported by best-in-class cessation and BP-control programs.

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes
