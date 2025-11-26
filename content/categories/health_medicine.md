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

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking, cross-checked by Claude Sonnet 4.5 and Gemini Pro 2.5, and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing, but check the global assumptions for this value and other relevant parameters, such as the discount factor).

## Description of effect

This effect captures health gains from high-income-country opportunities in two categories: (1) biomedical research that accelerates new diagnostics, drugs, and care models; and (2) direct treatment/support programs such as smoking cessation, blood-pressure control, patient navigation, cataract care, and mental health services.

## Point Estimates

- **Cost per QALY:** \$25,000 (\$5,000–\$100,000)
- **Start time:** 5 years
- **Duration:** 40 years

## Assumptions

1. Team-based hypertension control achieves median \$16,309 per QALY in U.S. studies. ([CDC](https://www.cdc.gov/nccdphp/priorities/high-blood-pressure.html))
2. Smoking cessation programs achieve £3,145–\$7,500 per QALY depending on intervention type. ([eClinicalMedicine](https://www.thelancet.com/journals/eclinm/article/PIIS2589-5370%2823%2900005-6/fulltext), [J Gen Intern Med](https://link.springer.com/article/10.1007/s11606-021-07335-x))
3. Patient navigation for cancer achieves approximately \$19,312 per QALY for Medicare programs. ([Health Services Research](https://pmc.ncbi.nlm.nih.gov/articles/PMC4799903/))
4. Cataract surgery achieves \$245–\$22,000 per QALY (first-eye) depending on setting. ([Ophthalmology](https://files.givewell.org/files/DWDA%202009/Interventions/Cataract/LansinghCarterMartens-2007.pdf))
5. IAPT-style CBT mental health services achieve £16,857–£29,500 per QALY with substantial uncertainty. ([Br J Psychiatry](https://www.cambridge.org/core/journals/the-british-journal-of-psychiatry/article/costeffectiveness-of-an-improving-access-to-psychological-therapies-service/0C5F920997C998C76067B32032E4CABA))
6. Biomedical research has approximately 17-year lag from research to population health gains, with health IRRs of 7–9%. ([UKRI/RAND](https://www.ukri.org/wp-content/uploads/2022/02/MRC-030222-medical-research-whats-it-worth.pdf))
7. High-income health agencies accept incremental costs up to £20k–£30k/QALY (UK) or \$100k–\$150k/QALY (U.S.) as cost-effective. ([NICE](https://www.nice.org.uk/process/pmg36/resources/nice-health-technology-evaluations-the-manual-pdf-72286779244741), [ICER](https://icer.org/wp-content/uploads/2022/01/ICER_2020_2023_VAF_120821.pdf))

## Details

### Cost per QALY

The point estimate (\$25,000/QALY) and range (\$5,000–\$100,000/QALY) represent a blend of direct treatment programs and biomedical research in high-income countries.

**Direct treatment programs (best-in-class):**

The strongest direct interventions cluster from low-thousands to low-tens-of-thousands per QALY:
- Hypertension control: ~\$16,000/QALY (Assumption 1)
- Smoking cessation: ~\$3,000–\$7,500/QALY (Assumption 2)
- Patient navigation: ~\$19,000/QALY (Assumption 3)
- Cataract surgery: \$250–\$22,000/QALY (Assumption 4)
- Mental health (CBT): ~£17,000–£30,000/QALY (Assumption 5)

Independent cardiovascular models find intensive BP control in high-risk adults at approximately \$23,800/QALY. ([JAMA Cardiology](https://jamanetwork.com/journals/jamacardiology/fullarticle/2551983))

**Biomedical research:**

Research is hits-based: most projects have small impact, a few have very large impact. The UK's meta-evaluation finds ~17-year lags and health IRRs of 7–9% (Assumption 6). Open Philanthropy's hits-based approach reflects this skew and uncertainty. ([Open Philanthropy](https://www.openphilanthropy.org/research/how-we-use-back-of-the-envelope-calculations-in-our-grantmaking/))

**Combined estimate:**

Weighting toward research (typical for this cause area) but anchored by demonstrated direct-program cost-effectiveness yields a central estimate of \$25,000/QALY. The upper end (\$100,000) aligns with U.S. threshold practice (Assumption 7); the lower end (\$5,000) reflects best-in-class cessation and BP-control programs.

### Start Time

The 5-year start time reflects the delay between funding and realized health benefits—shorter for direct programs (months to years), longer for research (~17 years on average, per Assumption 6).

### Duration

The 40-year duration reflects that health improvements from successful treatments and research-enabled innovations persist across decades of patient lifespans.

---

_These estimates are approximate and we welcome contributions to improve them. Learn how you can help [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
