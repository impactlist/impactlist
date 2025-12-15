---
id: local-community
name: 'Local Community'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 15
    costPerQALY: 12_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures health gains from community-level charities in rich countries that deliver direct, evidence-backed services: harm-reduction and overdose prevention, smoking-cessation outreach, primary-care-linked domestic-violence identification/referral, and fall-prevention for older adults. These are often run by local nonprofits in partnership with health and social-care providers.

## Point Estimates

- **Cost per QALY:** \$12,000 (\$2,000–\$60,000)
- **Start time:** 1 year
- **Duration:** 15 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. Community naloxone distribution achieves \$111–\$58,738/QALY depending on context; all studies conclude it is cost-effective, with better results in higher-risk populations. ([Cherrier et al. 2021](https://doi.org/10.1007/s41669-021-00309-z))
2. Smoking-cessation outreach with medication and counseling achieves approximately \$905/QALY (95% CI \$822–\$1,001) in real-world implementation. ([Mundt et al. 2024](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10922402/))
3. Domestic-violence identification and referral (IRIS model) produces QALY gains with net cost savings from a societal perspective over 10-year horizons. ([Devine et al. 2012](https://bmjopen.bmj.com/content/bmjopen/2/3/e001008.full.pdf), [Barbosa et al. 2018](https://bmjopen.bmj.com/content/bmjopen/8/8/e021256.full.pdf))
4. Home-safety assessment programs for falls prevention are the most cost-effective approach for community-dwelling older adults, commonly <\$40,000/QALY; medication-adjustment in care facilities achieves <\$13,000/QALY. ([Olij et al. 2018](https://shantysterke.nl/wp-content/uploads/2018/12/J-Am-Geriatr-Soc.pdf))

## Details

### Cost per QALY

The point estimate (\$12,000/QALY) and range (\$2,000–\$60,000/QALY) represent an average across well-evidenced community health programs.

**Intervention-specific estimates:**

- **Naloxone distribution:** ~\$5k–\$15k/QALY typical, with wide range by overdose prevalence (Assumption 1)
- **Smoking cessation outreach:** ~\$1k–\$5k/QALY (Assumption 2)
- **Domestic violence (IRIS):** Often cost-saving (Assumption 3)
- **Falls prevention:** ~\$20k–\$40k/QALY for home assessments (Assumption 4)

**Combined estimate:**

Averaging across these interventions for a representative "top charity" portfolio yields approximately \$12,000/QALY. The range (\$2k–\$60k) reflects variation in local epidemiology (overdose prevalence, smoking rates, age distribution), program design and intensity, and currency/year assumptions in source studies.

### Start Time

The 1-year start time reflects that community health programs typically deliver benefits within months of implementation as individuals receive services.

### Duration

The 15-year duration reflects that health gains from smoking cessation, overdose prevention, violence intervention, and fall prevention persist over participants' remaining lifespans, with some interventions producing benefits for decades.

---

_These estimates are approximate and we welcome contributions to improve them. You can submit quick feedback with [this form](https://forms.gle/NEC6LNics3n6WVo47) or get more involved [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
