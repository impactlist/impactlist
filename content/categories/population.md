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

_The following analysis was done on November 13th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing, but check the global assumptions for this value and other relevant parameters, such as the discount factor).

## Description of effect

This effect captures welfare gains from charities that raise births in high-income countries via policy/advocacy for family benefits (child allowances, "baby bonuses"), IVF/infertility access programs, and regulatory/workplace changes that reduce barriers to family formation. We count both the new person's own wellbeing and positive externalities on others.

## Point Estimates

- **Cost per QALY:** \$600 (\$200–\$2,000)
- **Start time:** 2 years
- **Duration:** 80 years

## Assumptions

1. Cost per additional birth ranges from \$15,000 (Québec-style allowances) to \$86,000 (high-end Australian estimates); central estimate \$40,000. ([Milligan](https://childcarecanada.org/documents/research-policy-practice/02/03/qu%C3%A9becs-baby-bonus-can-public-policy-raise-fertility), [e61 Institute](https://e61.in/how-financial-incentives-shape-fertility-in-australia/), [Peipert 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9351254/))
2. High-income life expectancy is approximately 80 years with average quality-of-life weight 0.8–0.85, yielding ~65 QALYs per person (range 50–80). ([OECD 2024](https://www.oecd.org/en/publications/society-at-a-glance-2024_918d8db3-en/full-report/life-expectancy_37a61588.html))
3. Net fiscal externality per newborn is approximately £68,400 (UK) or A\$70,688 (Australia). ([OBR](https://obr.uk/box/intergenerational-fairness/), [Connolly et al. 2025](https://jheor.org/api/v1/articles/133796-estimating-the-fiscal-value-of-children-conceived-from-assisted-reproduction-technology-in-australia-applying-a-public-economic-perspective.pdf))
4. Innovation spillovers: ~0.1–0.2% chance of becoming a researcher, with social returns ~10× R&D spend, yielding ~1 QALY in expected externalities per birth. ([UNESCO/World Bank](https://data.worldbank.org/indicator/SP.POP.SCIE.RD.P6), [Jones 2020](https://www.nber.org/system/files/working_papers/w27863/w27863.pdf))
5. Agglomeration spillovers: doubling city size raises productivity 3–8%; we credit ~0.5 QALY per birth for diffuse gains. ([Melo et al. 2009](https://www.sciencedirect.com/science/article/pii/S0166046208001269))
6. GDP→QALY conversion: 1 WELLBY ≈ £13k, ~7 WELLBY ≈ 1 QALY, implying ~\$115k/QALY. ([HMT 2021](https://www.gov.uk/government/publications/green-book-supplementary-guidance-wellbeing))

## Details

### Cost per QALY

The point estimate (\$600/QALY) and range (\$200–\$2,000/QALY) are derived from combining cost per birth with QALYs per birth (own life + externalities).

**QALYs per additional birth:**

- Own life: ~65 QALYs (Assumption 2)
- Fiscal externality: ~0.7 QALYs (Assumptions 3, 6)
- Innovation spillovers: ~1.0 QALY (Assumption 4)
- Agglomeration spillovers: ~0.5 QALYs (Assumption 5)
- **Total:** ~67 QALYs (range 50–85)

**Calculation:**

$$\text{Cost per QALY} = \dfrac{\text{Cost per birth}}{\text{QALYs per birth}} = \dfrac{\$40{,}000}{67} \approx \$600$$

**Range:**
- Optimistic: \$15k cost / 80 QALYs ≈ \$190/QALY
- Pessimistic: \$86k cost / 50 QALYs ≈ \$1,700/QALY

The dominant benefit is the added person's lifetime wellbeing; GDP externalities improve cost-effectiveness further but are secondary.

### Start Time

The 2-year start time reflects the delay between policy implementation or IVF funding and births occurring, plus initial development.

### Duration

The 80-year duration reflects that benefits accrue across the new person's entire lifespan, which is approximately 80 years in high-income countries.

---

_These estimates are approximate and we welcome contributions to improve them. Learn how you can help [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
