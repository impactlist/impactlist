---
id: science-tech
name: 'Science and Tech'
effects:
  - effectId: standard
    startTime: 5
    windowLength: 25
    costPerQALY: 60_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures quality-of-life improvements from philanthropic funding of scientific and engineering research in wealthy nations—including university labs, research institutes, metascience infrastructure, and translational R&D. Benefits include not only health gains but also convenience, time-saving, access to information, connection, entertainment, and capability expansion. This excludes cause areas treated separately (AI safety, climate, pandemics, etc.).

## Point Estimates

- **Cost per QALY:** \$60,000 (\$20,000–\$250,000)
- **Start time:** 5 years
- **Duration:** 25 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. Each \$1 of R&D yields roughly \$5–\$13 in present-value economy-wide benefits after accounting for diffusion lags. ([Jones & Summers 2020](https://www.nber.org/system/files/working_papers/w27863/w27863.pdf))
2. Social returns to R&D are approximately 55% annually, compared to private returns of approximately 21%. ([Bloom, Schankerman & Van Reenen 2013](https://eprints.lse.ac.uk/46852/1/__lse.ac.uk_storage_LIBRARY_Secondary_libfile_shared_repository_Content_Schankerman%2C%20M_Identifying%20technology%20Econ_Schankerman_Identifying%20technology%20_Econ_2014.pdf))
3. Directly funding R&D produces large social returns but is on average less cost-effective than top global health/poverty interventions. ([Open Philanthropy 2022](https://www.openphilanthropy.org/research/social-returns-to-productivity-growth/))
4. The monetary value per WELLBY is approximately £13,000 (≈\$16,000), derived from income-to-wellbeing elasticities and QALY benchmarks. ([HMT Green Book 2021](https://www.gov.uk/government/publications/green-book-supplementary-guidance-wellbeing), [What Works Centre 2023](https://whatworkswellbeing.org/blog/converting-the-wellby/))
5. Approximately 6 WELLBYs ≈ 1 QALY, implying a money-metric value of roughly \$90,000–\$100,000 per QALY in high-income settings. ([Frijters & Krekel 2021](https://eprints.lse.ac.uk/114605/1/Frijters_PR3.pdf))
6. Digital innovations generate sizable consumer surplus beyond GDP, representing substantial non-health wellbeing improvements. ([Brynjolfsson, Collis & Eggers 2019](https://www.nber.org/system/files/working_papers/w25695/w25695.pdf))
7. Philanthropy receives credit for only a share of marginal R&D (approximately 25%) after accounting for crowd-out and project failure.
8. From basic/applied research to widespread use typically takes 5–20 years; medical/tech translation averages 14–17 years. ([Morris et al. 2011](https://pmc.ncbi.nlm.nih.gov/articles/PMC3241518/), [Hanney et al. 2015](https://health-policy-systems.biomedcentral.com/articles/10.1186/1478-4505-13-1), [Comin & Hobijn 2010](https://www.aeaweb.org/articles?id=10.1257%2Faer.100.5.2031))
9. Once research-enabled products take hold, benefits persist over product cycles and follow-on improvements for 15–40 years. ([Comin et al. 2013](https://www.nber.org/system/files/working_papers/w19010/w19010.pdf))

## Details

### Cost per QALY

The point estimate (\$60,000/QALY) and range (\$20,000–\$250,000/QALY) are derived from a three-step calculation converting R&D social returns into QALYs via the WELLBY framework.

**Step 1 — Social returns to R&D:**

Using a central social return of \$8 per \$1 donated (midpoint of \$5–\$13, per Assumption 1), combined with evidence of high spillover rates (Assumption 2), we establish that R&D funding generates substantial economy-wide welfare gains.

**Step 2 — Converting innovation benefits to QALYs:**

Many S&T benefits extend beyond health to include convenience, time-saving, connection, and entertainment. The WELLBY framework (Assumptions 4–5) provides a bridge: at approximately 6 WELLBYs per QALY and \$16,000 per WELLBY, the money-metric value is roughly \$100,000 per QALY in high-income settings—consistent with health-technology thresholds like [NICE £20k–£30k/QALY](https://www.nice.org.uk/process/pmg36/chapter/economic-evaluation-2) and [ICER \$100k–\$150k/QALY](https://icer.org/wp-content/uploads/2020/10/ICER_2020_2023_VAF_102220.pdf).

**Step 3 — Stylized calculation:**

$$\dfrac{\$100,000/\text{QALY}}{\$8 \text{ return per } \$1} \approx \$12,500/\text{QALY (raw)}$$

Adjusting for partial additionality (Assumption 7) and modest downside risks (tech externalities, field choice) with a ~5× multiplier yields approximately \$60,000/QALY.

**Sensitivity:** With returns of \$5–\$13 and attribution of 10–60%, implied costs span roughly \$20,000–\$250,000/QALY.

### Start Time

The 5-year start time reflects the typical delay from research funding to widespread use (Assumption 8). General-purpose technologies diffuse faster in rich countries but still require multi-year lags for translation and adoption.

### Duration

The 25-year duration reflects the persistence of research-enabled benefits over product cycles and follow-on improvements (Assumption 9). Diffusion literature shows long tails of impact from innovations in areas like imaging, semiconductors, and digital platforms.

---

{{CONTRIBUTION_NOTE}}

# Internal Notes
