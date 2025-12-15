---
id: religious
name: 'Religious'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 10
    costPerQALY: 125_000
---

# Justification of cost per life

_The following analysis was done on November 26th 2025, written by Claude and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures health and wellbeing gains from charities that support religious organizations and institutions, enabling community participation through religious services, fellowship, and faith-based programming. Evidence suggests regular religious service attendance is associated with reduced mortality, lower rates of depression and suicide, improved social integration, and greater life satisfaction. Benefits flow primarily through social support networks, behavioral improvements (less substance use, more physical activity), and psychological resources including meaning, hope, and moral frameworks.

## Point Estimates

- **Cost per QALY:** \$125,000 (\$40,000–\$400,000)
- **Start time:** 1 year
- **Duration:** 10 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. Regular religious service attendance (weekly or more) is associated with 20–33% lower all-cause mortality compared to non-attendance, translating to approximately 7 additional years of life expectancy at age 20. ([Hummer et al. 1999](https://pubmed.ncbi.nlm.nih.gov/10332617/), [Li et al. 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC7825951/))
2. Weekly+ religious service attendance is associated with approximately 5-fold lower suicide rates (HR=0.16) and 68% lower rates of "deaths of despair" (suicide, drugs, alcohol) among women. ([VanderWeele et al. 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC7228478/))
3. Quasi-experimental evidence (using instrumental variables like blue law repeals) supports causal relationships between religious participation and reduced depression/suicide, though observational estimates may still be inflated by selection effects. ([VanderWeele, PMC12133908](https://pmc.ncbi.nlm.nih.gov/articles/PMC12133908/))
4. Average annual per-person church spending is approximately \$2,500, with roughly 10% directed to outreach. Most religious participation would occur without marginal charitable support. ([ChurchSalary 2023](https://www.churchsalary.com/content/articles/average-per-person-giving-in-church.html))

## Details

### Cost per QALY

The point estimate (\$125,000/QALY) and wide range (\$40,000–\$400,000/QALY) reflect the highly indirect pathway from charitable giving to health benefits, and substantial uncertainty about marginal impact.

**Benefit quantification:**

The strongest evidence concerns mortality reduction. A nationally representative US study found that people who never attend religious services have 1.87 times the mortality risk compared to those attending more than once per week, translating to approximately 7 years of additional life expectancy at age 20.

Distributing the 7-year benefit over ~40 years of regular adult attendance yields approximately 0.175 life-years per person-year. Adjusting for quality (older years lived at lower utility), this becomes approximately 0.12-0.15 QALYs/year from mortality reduction alone.

Additional benefits include:

- **Mental health:** Lower depression rates, with quasi-experimental evidence supporting causality
- **Suicide prevention:** 5-fold reduction in suicide rates for weekly+ attenders
- **Quality of life:** Greater life satisfaction (β ≈ 0.12 SD), purpose in life (β ≈ 0.25 SD), and social integration (β ≈ 0.26 SD)

These quality-of-life improvements add approximately 0.02-0.05 QALYs/year.

**Total estimated benefit: 0.15-0.20 QALYs per person-year of regular attendance** relative to non-attendance.

**Cost quantification:**

The key question is: what is the marginal cost to produce one additional person-year of regular religious attendance through charitable giving?

Average church budget per member is approximately \$2,500/year. However, most spending serves existing members through worship services, facilities, and pastoral care. Only approximately 10% of typical church budgets goes to outreach and evangelism.

More critically, most religious participation would occur without marginal charitable support—religious participation is primarily driven by intrinsic motivation, family tradition, and community ties rather than the marginal quality of institutional support. We estimate that 5-15% of person-years of attendance might be causally attributable to marginal charitable support (through preventing church closures, enabling outreach, or improving retention).

**Estimated cost per marginal person-year of attendance: \$15,000-\$50,000** (calculated as \$2,500 / 0.05-0.15 marginal attribution).

**Combined calculation:**

Cost per QALY = Cost per marginal person-year / QALYs per person-year
= \$15,000-\$50,000 / 0.15-0.20
= \$75,000-\$333,000/QALY

Central estimate: **\$125,000/QALY**

The wide range reflects deep uncertainty about:

- The degree to which observed health associations are causal vs. due to selection (healthier people choosing to attend)
- How effectively marginal charitable dollars translate to new or sustained attendance
- Variation across religious traditions, communities, and contexts

### Start Time

The 1-year start time reflects that benefits from religious participation begin accruing once individuals establish regular attendance patterns, which typically occurs within months of initial engagement.

### Duration

The 10-year duration reflects the period over which marginal charitable support has measurable impact on attendance patterns. While benefits of sustained religious participation persist for decades in longitudinal studies, the marginal impact of a given charitable contribution diminishes as habits become self-sustaining or as individuals' circumstances change.

---

_These estimates are approximate and we welcome contributions to improve them. You can submit quick feedback with [this form](https://forms.gle/NEC6LNics3n6WVo47) or get more involved [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes

**Key epistemic concerns:**

1. **Selection effects:** The observed 7-year life expectancy difference likely overstates the causal effect. Healthier, more socially connected, and more conscientious people may self-select into religious attendance. While quasi-experimental studies support causality for depression and suicide outcomes, the mortality estimates come primarily from observational studies with imperfect confounding control.

2. **Marginal attribution is highly uncertain:** The 5-15% estimate for marginal attribution is a rough guess. Religious participation may be highly inelastic to marginal institutional quality, meaning charitable dollars have limited impact on attendance.

3. **Heterogeneity:** Benefits may vary substantially across religious traditions, demographic groups, and cultural contexts. Most high-quality research has been conducted in US Christian populations.

4. **Comparison to alternatives:** At \$125,000/QALY, religious giving is substantially less cost-effective than direct health interventions (\$90/QALY for GiveWell-recommended charities) and comparable to or less cost-effective than education (\$40,000/QALY) or developed-world health interventions (\$25,000/QALY). This reflects the indirect pathway from dollars to health benefits.

5. **Non-health benefits:** This analysis focuses on health/mortality benefits. Religious organizations also provide meaning, community, charitable services, and other goods that are not fully captured in QALYs.
