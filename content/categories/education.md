---
id: education
name: 'Education'
effects:
  - effectId: standard
    startTime: 3
    windowLength: 40
    costPerQALY: 40_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing, but check the global assumptions for this value and other relevant parameters, such as the discount factor).

## Description of effect

This effect captures quality-of-life improvements from education charities in wealthy countries through two pathways: (1) programs that raise educational attainment (intensive advising, student supports that increase degree completion), and (2) programs that improve school climate and student wellbeing (evidence-based anti-bullying and social-emotional learning). These are the pathways most likely to yield measurable QALYs in rich countries.

## Point Estimates

- **Cost per QALY:** \$40,000 (\$15,000–\$120,000)
- **Start time:** 3 years
- **Duration:** 40 years

## Assumptions

1. KiVa anti-bullying program costs approximately €13,823 per QALY (≈\$15,000/QALY). ([Persson et al. 2018](https://pubmed.ncbi.nlm.nih.gov/29728796/))
2. Universal primary-school mental health programs show cost-effective or cost-saving results in some settings. ([Abou Jaoude et al. 2024](https://link.springer.com/article/10.1007/s12310-024-09642-0), [Bowes et al. 2024](https://www.cambridge.org/core/journals/psychological-medicine/article/effects-and-costs-of-an-antibullying-program-kiva-in-uk-primary-schools-a-multicenter-cluster-randomized-controlled-trial/68927DF33AAE39DADF559EE85EAA68F0))
3. Each additional year of education is associated with approximately 1.9% lower all-cause adult mortality. ([Lancet Public Health 2024](https://pubmed.ncbi.nlm.nih.gov/38278172/))
4. Causal evidence for education→health effects is mixed; some natural experiments find little or no impact on health or mortality. ([Davies et al. 2023](https://pubmed.ncbi.nlm.nih.gov/37463867/), [Clark & Royer 2013](https://www.aeaweb.org/articles?id=10.1257%2Faer.103.6.2087))
5. Conservative mapping: each additional year of schooling yields approximately 0.1–0.2 QALYs over the lifetime via longevity and morbidity changes.
6. CUNY ASAP (community-college student support) costs approximately \$4,600 per additional year of education. ([Azurdia & Galkin 2020](https://www.mdrc.org/sites/default/files/ASAP_Cost_Working_Paper_final.pdf))
7. Bottom Line (intensive advising for low-income students) costs approximately \$13,000 per additional year of education. ([Barr & Castleman 2021](https://edworkingpapers.com/sites/default/files/ai21-481.pdf))
8. School-based programs deliver quality-of-life gains within the school year, while attainment benefits begin once students enter adulthood.
9. Health and longevity effects associated with additional education persist across adult life. ([Lancet Public Health 2024](https://pubmed.ncbi.nlm.nih.gov/38278172/), [Sasson 2016](https://link.springer.com/article/10.1007/s13524-015-0453-7))

## Details

### Cost per QALY

The point estimate (\$40,000/QALY) and range (\$15,000–\$120,000/QALY) represent a portfolio of two intervention types: school-based wellbeing programs and attainment-boosting programs.

**School-based wellbeing programs:**

The KiVa anti-bullying program provides a direct QALY anchor at approximately \$15,000/QALY (Assumption 1). A UK cluster-RCT found small-to-moderate effects with documented program costs, supporting low-to-mid five-figure \$/QALY results (Assumption 2).

**Attainment programs:**

Added schooling is associated with lower adult mortality (Assumption 3), though causal evidence is mixed (Assumption 4). Using a conservative mapping of 0.1–0.2 QALYs per additional school-year (Assumption 5):

- **CUNY ASAP:** \$4,600 per year of education (Assumption 6)
  $$\dfrac{\$4,600}{0.1\text{–}0.2 \text{ QALYs}} \approx \$23,000\text{–}\$46,000/\text{QALY}$$

- **Bottom Line:** \$13,000 per year of education (Assumption 7)
  $$\dfrac{\$13,000}{0.1\text{–}0.2 \text{ QALYs}} \approx \$65,000\text{–}\$130,000/\text{QALY}$$

**Combined estimate:**

A portfolio mixing wellbeing programs (~\$15,000/QALY) with attainment-boosters (~\$25,000–\$130,000/QALY under conservative causal assumptions) yields a central estimate of \$40,000/QALY. This sits above direct medical charities in rich countries but below many health-system willingness-to-pay thresholds ([NICE ~£20k–£30k/QALY](https://www.nice.org.uk/process/pmg36/chapter/economic-evaluation-2); [ICER ~\$100k–\$150k/QALY](https://icer.org/wp-content/uploads/2020/10/ICER_2020_2023_VAF_102220.pdf)).

### Start Time

The 3-year start time reflects a blend of immediate and delayed benefits (Assumption 8). School-based programs deliver quality-of-life gains within the school year, while attainment-flowing benefits begin when students enter adulthood and persist thereafter.

### Duration

The 40-year duration reflects the persistence of health and longevity effects associated with additional education across adult life (Assumption 9). School climate/mental-health gains can also have long-run sequelae.

---

_These estimates are approximate and we welcome contributions to improve them. Learn how you can help [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
