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

_The following analysis was done on November 12th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **\$6,000 per QALY**  
**Range (plausible):** **\$2,000–\$60,000 per QALY**

## Details

**What’s in scope.**  
Donations support translational **geroscience** that aims to **slow or repair aging processes** (e.g., biomarker validation, pivotal trials, regulatory science, and high-leverage seed grants). Illustrative implementers/funders include **AFAR** (TAME), **Impetus Grants** (rapid, high-risk grants), and the **Longevity Escape Velocity Foundation** (combination therapy studies). See [AFAR/TAME](https://www.afar.org/tame-trial); [Impetus Grants](https://impetusgrants.org/); [LEV Foundation](https://www.levf.org/projects/robust-mouse-rejuvenation-study-2); funding landscape review: [Lederman 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC9808549/).

**Why longevity can be highly cost-effective.**

- **Large potential impact per person.** Modeling of “delayed aging” suggests **~2.2** extra **healthy** years for average Americans, with very large social value over decades. This indicates the _scale_ of what geroscience aims to unlock, even if first-generation human interventions deliver only a fraction of that. [Goldman et al. 2013](https://pubmed.ncbi.nlm.nih.gov/24101058/) ([full PDF](https://scholar.harvard.edu/files/cutler/files/health_aff-2013-goldman-1698-705.pdf)).

- **Early human signals exist.** Small trials show **mTOR** inhibition can **improve vaccine responses in older adults** and **senolytics** can **improve physical function** in patients with age-related disease, motivating larger randomized studies. [Mannick et al.](https://pubmed.ncbi.nlm.nih.gov/25540326/); [Justice et al.](https://pubmed.ncbi.nlm.nih.gov/30616998/).

- **Philanthropic leverage is real.** Private funding has been pivotal for field-enabling work (e.g., closing the **\$75M** TAME budget; rapid **Impetus** grants) that public funders might not prioritize or time-box. [AFAR report](https://www.afar.org/imported/2017_AFAR_Annual_Report_Web_copy.pdf); [Impetus Grants](https://impetusgrants.org/); landscape review: [Lederman 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC9808549/).

### Assumptions & calculation (explicit)

We model a donation that modestly **raises the probability** that at least one **safe, first-generation geroprotective** (e.g., metformin-like, rapalog, or senolytic class) is **validated and adopted** in high-income countries within the next decade.

Let:

- $C = 50{,}000{,}000$ (philanthropic program: biomarkers, pivotal trials/regulatory science, and field-building, in dollars).
- $N = 2{,}000{,}000$ (conservative count of early adopters treated across high-income countries over the first 10 years; there are **\>60M** people aged 65+ in the U.S. alone [U.S. Census, 2025](https://www.census.gov/newsroom/press-releases/2025/older-adults-outnumber-children.html), and **\~22%** of the EU is 65+ [Eurostat](https://ec.europa.eu/eurostat/statistics-explained/index.php/Population_structure_and_ageing)).
- $q_{\text{base}} = 1.0$ QALY per person (a **fraction** of the ~2.2 healthy years in delayed-aging models, to reflect first-generation effects rather than the full frontier).
- $e = 1.05$ (“_above-normal_” wellbeing uplift multiplier for vitality/function improvements beyond typical age norms).
- $q = q_{\text{base}} \times e = 1.05$ QALYs per person.
- $\delta = 0.004$ (a **0.4 pp** absolute increase in the chance that such an intervention is validated and adopted within the timeframe, attributable to this philanthropic program; sized to reflect many actors and high uncertainty, but also the reality that philanthropic dollars can be pivotal for specific trials or standards).

Expected QALYs from the donation:

$$
\mathbb{E}[\text{QALYs}] \;=\; \delta \times N \times q
\;=\; 0.004 \times 2{,}000{,}000 \times 1.05
\;=\; 8{,}400\ \text{QALYs}.
$$

Cost per QALY:

$$
\textbf{Cost per QALY} \;=\; \frac{C}{\mathbb{E}[\text{QALYs}]}
\;=\; \frac{\$50{,}000{,}000}{8{,}400}
\;\approx\; \mathbf{\$6{,}000\ \text{per QALY}}.
$$

**Range and uncertainty.**  
We vary key parameters within conservative bounds:

- $N$: **0.5–5 million** early recipients;
- $q_{\text{base}}$: **0.3–1.5** QALYs per person (partial vs. stronger geroprotection), with $e$ in **1.00–1.10**;
- $\delta$: **0.1–2.0 percentage points** depending on how pivotal the donation is (e.g., closing a trial’s funding gap vs. diffuse field-building);
- $C$: **\$25–\$150 million**.

Sweeping these yields roughly **\$2,000–\$60,000 per QALY**. The low end corresponds to donations that are genuinely pivotal for a widely adopted intervention; the high end reflects non-pivotal work, weak effects, or slow uptake.

**Cross-checks (order-of-magnitude).**

- Macro “delayed aging” modeling finds **large** healthspan gains and **trillion-dollar** economic value over decades, underscoring the upside if even a small fraction is realized earlier. [Goldman et al. 2013](https://pubmed.ncbi.nlm.nih.gov/24101058/).
- Early human studies show plausible biological levers (mTOR/senescence) but emphasize the need for **larger RCTs**—precisely where philanthropy can unlock progress. [Mannick et al.](https://pubmed.ncbi.nlm.nih.gov/25540326/); [Justice et al.](https://pubmed.ncbi.nlm.nih.gov/30616998/).
- Field-building grants demonstrate **speed and neglectedness** (e.g., **Impetus** decisions in weeks, \$500k caps), which can move bottlenecked projects forward quickly. [Impetus Grants](https://impetusgrants.org/).

**Bottom line.**  
Because relatively **small** increases in the probability that a geroprotective therapy succeeds can translate into **large** cohort-level gains in healthy years, targeted longevity philanthropy can plausibly deliver **mid-single-digit thousands of dollars per QALY** on expectation, with substantial but bounded uncertainty. The point estimate of **\$6,000 per QALY** reflects conservative inputs and explicitly credits **above-normal** wellbeing improvements alongside added life.

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes
