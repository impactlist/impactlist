---
id: longevity
name: 'Longevity'
effects:
  - effectId: standard
    startTime: 8
    windowLength: 40
    costPerQALY: 6_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures health gains from translational geroscience that aims to slow or repair aging processes: biomarker validation, pivotal trials, regulatory science, and high-leverage seed grants. Implementers include AFAR (TAME trial), Impetus Grants, and the Longevity Escape Velocity Foundation.

## Point Estimates

- **Cost per QALY:** \$6,000 (\$2,000–\$60,000)
- **Start time:** 8 years
- **Duration:** 40 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. "Delayed aging" modeling suggests ~2.2 extra healthy years for average Americans if aging is slowed, indicating the scale of potential impact. ([Goldman et al. 2013](https://pubmed.ncbi.nlm.nih.gov/24101058/))
2. Early human trials show mTOR inhibition can improve vaccine responses in older adults and senolytics can improve physical function. ([Mannick et al.](https://pubmed.ncbi.nlm.nih.gov/25540326/), [Justice et al.](https://pubmed.ncbi.nlm.nih.gov/30616998/))
3. Private funding has been pivotal for field-enabling work (e.g., closing the \$75M TAME budget) that public funders might not prioritize. ([AFAR](https://www.afar.org/imported/2017_AFAR_Annual_Report_Web_copy.pdf), [Impetus Grants](https://impetusgrants.org/))
4. There are >60M people aged 65+ in the U.S. alone; ~22% of the EU is 65+. ([U.S. Census 2025](https://www.census.gov/newsroom/press-releases/2025/older-adults-outnumber-children.html), [Eurostat](https://ec.europa.eu/eurostat/statistics-explained/index.php/Population_structure_and_ageing))
5. First-generation geroprotectives might deliver ~1 QALY per person (a fraction of the full 2.2-year frontier).
6. A \$50M philanthropic program might raise the probability of validation and adoption by ~0.4 percentage points.

## Details

### Cost per QALY

The point estimate (\$6,000/QALY) and range (\$2,000–\$60,000/QALY) are derived from modeling donations that raise the probability of validating a first-generation geroprotective therapy.

**Model parameters:**

- $C$ = Philanthropic program cost: \$50 million
- $N$ = Conservative count of early adopters over 10 years: 2 million (Assumption 4)
- $q$ = QALYs per person: 1.05 (base 1.0 × 1.05 vitality uplift) (Assumption 5)
- $\delta$ = Probability increase attributable to philanthropy: 0.4% (Assumption 6)

**Calculation:**

$$\mathbb{E}[\text{QALYs}] = \delta \times N \times q = 0.004 \times 2{,}000{,}000 \times 1.05 = 8{,}400 \text{ QALYs}$$

$$\text{Cost per QALY} = \dfrac{C}{\mathbb{E}[\text{QALYs}]} = \dfrac{\$50{,}000{,}000}{8{,}400} \approx \$6{,}000$$

**Range:** Varying parameters ($N$: 0.5–5M; $q$: 0.3–1.65; $\delta$: 0.1–2.0%; $C$: \$25–150M) yields \$2,000–\$60,000/QALY. The low end corresponds to pivotal donations for widely adopted interventions; the high end reflects non-pivotal work, weak effects, or slow uptake.

### Start Time

The 8-year start time reflects the delay from philanthropic funding through trial completion, regulatory approval, and initial clinical adoption of geroprotective therapies.

### Duration

The 40-year duration reflects that once a geroprotective is validated and adopted, benefits accrue across the remaining lifespans of treated individuals, potentially spanning decades.

---

{{CONTRIBUTION_NOTE}}

# Internal Notes
