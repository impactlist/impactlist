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

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing, but check the global assumptions for this value and other relevant parameters, such as the discount factor).

## Description of effect

This effect captures health gains from homelessness and housing programs in wealthy nations: temporary financial assistance/rapid rehousing, homelessness prevention, permanent supportive housing (Housing First), and hospital-to-home discharge teams. These interventions improve survival, reduce acute care use, and raise health-related quality of life.

## Point Estimates

- **Cost per QALY:** \$25,000 (\$20,000–\$60,000)
- **Start time:** 1 year
- **Duration:** 3 years

## Assumptions

1. VA Supportive Services for Veteran Families achieves \$22,676/QALY overall, \$19,114/QALY for rapid rehousing, and \$29,751/QALY for homelessness prevention over a 2-year horizon. ([JAMA Network Open 2024](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2825636))
2. Stable housing for homeless individuals with opioid use disorder achieves \$27,300/QALY (lifetime horizon), with sensitivity range \$20k–\$33k. ([JAMA Network Open 2025](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2835706))
3. UK hospital discharge teams for homeless individuals (Pathway model) achieve approximately £26,000/QALY (~\$30k). ([PubMed](https://pubmed.ncbi.nlm.nih.gov/27251910/))
4. Rental assistance for people with HIV achieves \$62,493/QALY, illustrating higher costs for intensive disease-specific support. ([AIDS & Behavior](https://pubmed.ncbi.nlm.nih.gov/22588529/))
5. Permanent Supportive Housing (Housing First) has median program cost of \$16,479/person-year with benefit-to-cost ratio ~1.8:1. ([CDC Community Guide](https://pmc.ncbi.nlm.nih.gov/articles/PMC8863642/))
6. High-income health agencies accept costs up to £20k–£30k/QALY (UK) as cost-effective. ([NICE](https://www.nice.org.uk/process/pmg36/resources/nice-health-technology-evaluations-the-manual-pdf-72286779244741))

## Details

### Cost per QALY

The point estimate (\$25,000/QALY) and range (\$20,000–\$60,000/QALY) are anchored on high-quality QALY studies of housing interventions in high-income settings.

**Direct evidence:**

- Rapid rehousing/TFA: \$19k–\$30k/QALY (Assumption 1)
- Housing for OUD: ~\$27k/QALY (Assumption 2)
- Hospital discharge teams: ~£26k/QALY (Assumption 3)

These cluster around \$20k–\$30k/QALY for the strongest programs. Programs serving particularly complex clinical needs (e.g., HIV) push costs toward \$60k/QALY (Assumption 4).

**Why the range:**

Cost-effectiveness varies with targeting (higher baseline risk → more QALYs gained), program type and intensity, time horizon (2-year vs lifetime modeling), and valuation perspective (some studies include large cost offsets from reduced emergency care). The \$20k–\$60k envelope captures this variation while aligning with UK decision benchmarks (Assumption 6).

### Start Time

The 1-year start time reflects the delay between program enrollment and realized health benefits, as housing stability takes time to translate into improved outcomes.

### Duration

The 3-year duration reflects that most housing program evaluations measure outcomes over 2–3 year horizons, capturing the initial period of housing stability and health improvement.

---

_These estimates are approximate and we welcome contributions to improve them. Learn how you can help [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
