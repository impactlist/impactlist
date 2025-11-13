---
id: arts-culture
name: 'Arts, Culture, Heritage'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 2
    costPerQALY: 12_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **$12,000 per QALY**  
**Range (plausible):** **$3,000–$30,000 per QALY**

## Details

### What’s included

We model “Arts, Culture, Heritage” as funding that **increases direct participation or access** in high-income countries (e.g., community choirs/dance, museum programs for older adults, arts social prescribing) rather than large capital builds. These activities create **observable gains in life satisfaction and mental health**, in addition to meaning, connection, and identity. Evidence syntheses from WHO and the UK government’s Culture & Heritage Capital program find robust links between cultural engagement and improved health and wellbeing.  
Sources: [WHO scoping review (Fancourt & Finn, 2019)](https://www.ncch.org.uk/uploads/WHO-Scoping-Review-Arts-and-Health.pdf); [DCMS/Frontier Economics 2024](https://www.frontier-economics.com/media/2lbntjpz/monetising-the-impact-of-culture-and-heritage-on-health-and-wellbeing.pdf) and the programme overview on GOV.UK [here](https://www.gov.uk/guidance/culture-and-heritage-capital-research-and-outputs).

### How we translate effects into QALYs (two anchors)

**Anchor A — QALY evidence from trials/service evaluations**

- **Community singing RCT (older adults):** 14-week program; at 6 months, **ΔQALY ≈ 0.015** vs control (EQ-5D, area-under-curve). Reported session costs imply **low per-participant costs** for group delivery (Table 3). Probability of being cost-effective was 60–64% at the UK’s £20k–£30k/QALY thresholds.  
  Source: [Coulton et al., 2015](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/516558F0DDD7D4DD0197FDDEAD30ED85/S0007125000239159a.pdf/).

- **Arts social prescribing:** Real-world evaluations report **cost per QALY** as low as **£1,963/QALY** (Doncaster) and around **£20,100/QALY** (City & Hackney), reflecting setting/implementation variation.  
  Sources: [Doncaster evaluation](https://cpe.org.uk/wp-content/uploads/2017/02/Evaluation-of-Doncaster-Social-Prescribing-Service-December-2016.pdf), [summary of economic evidence](https://socialprescribingacademy.org.uk/media/carfrp2e/evidence-review-economic-impact.pdf).

**Quick calculation from Anchor A (illustrative):**  
If a program like the singing RCT yields **0.015 QALYs in 6 months**, then a **full year of comparable engagement** plausibly yields **≈0.03 QALYs/person-year**. If all-in philanthropic cost is **$250 per participant-year** (group sessions, venue, coordination), **cost per QALY ≈ $250 / 0.03 ≈ $8,300**.

**Anchor B — Wellbeing (WELLBY) → QALY conversion for “above-normal” life quality**

Many arts benefits are **beyond health restoration** (e.g., more meaning, joy, social connection). The UK Treasury’s Green Book wellbeing guidance and What Works Wellbeing provide a **conversion between life satisfaction and QALYs**: **about 1 QALY ≈ 7 WELLBYs**, where **1 WELLBY = +1 point on a 0–10 life-satisfaction scale for one person for one year**.  
Sources: [HMT Wellbeing Supplementary Guidance](https://assets.publishing.service.gov.uk/media/60fa9169d3bf7f0448719daf/Wellbeing_guidance_for_appraisal_-_supplementary_Green_Book_guidance.pdf), [What Works Wellbeing explainer](https://whatworkswellbeing.org/blog/converting-the-wellby/).

**Assumption (grounded by the literature):** typical high-quality arts participation produces an average **life-satisfaction gain of ~+0.2 points** sustained for **6 months** among participants (consistent with fixed-effects longitudinal findings and intervention studies).  
Sources: Longitudinal/fixed-effects evidence of positive LS changes with arts engagement: [Wang et al., 2020](https://bmcpublichealth.biomedcentral.com/articles/10.1186/s12889-019-8109-y); review of LS/flourishing effects: [Bone & Fancourt 2022](https://www.communities1st.org.uk/sites/default/files/2022-08/Bone%20Fancourt%202022%20-%20Arts%20Culture%20and%20the%20Brain.pdf); broader DCMS valuation models using QALYs/WELLBYs: [Frontier 2024](https://www.frontier-economics.com/media/2lbntjpz/monetising-the-impact-of-culture-and-heritage-on-health-and-wellbeing.pdf).

**Quick calculation from Anchor B (illustrative):**

- LS effect: **+0.2** for **0.5 years** ⇒ **0.1 WELLBY**/person.
- Convert to QALY: **0.1 WELLBY ÷ 7 ≈ 0.014 QALYs**.
- If philanthropic cost is **$250 per participant-year**, then **cost per QALY ≈ $250 / 0.014 ≈ $17,900**.

### Bringing the anchors together

Taking Anchor A (health-QALY based) **≈ $8k/QALY** and Anchor B (wellbeing→QALY) **≈ $18k/QALY**, and allowing for program heterogeneity (social prescribing spanning **~£2k–£20k per QALY**), we place a **central estimate at $12,000 per QALY** with a **range of $3,000–$30,000**. This range reflects:

- Variation in **per-participant costs** (group size, venues, facilitator pay, overheads). See cost tables in the RCT (e.g., facilitator/venue costs) for ballpark group economics.  
  Source: [Coulton et al., 2015, Table 3](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/516558F0DDD7D4DD0197FDDEAD30ED85/S0007125000239159a.pdf/).
- Uncertainty in **effect sizes** across settings and populations.  
  Evidence syntheses: [WHO 2019](https://www.ncbi.nlm.nih.gov/books/NBK553773/); [DCMS/Frontier 2024](https://www.frontier-economics.com/media/2lbntjpz/monetising-the-impact-of-culture-and-heritage-on-health-and-wellbeing.pdf).
- The **wellbeing→QALY mapping** (we used the UK Green Book/What Works Wellbeing crosswalk).  
  Sources: [HMT Wellbeing guidance](https://www.gov.uk/government/publications/green-book-supplementary-guidance-wellbeing), [What Works Wellbeing](https://whatworkswellbeing.org/blog/converting-the-wellby/).

### Notes on heritage

“Heritage” benefits often arrive via **engagement** (e.g., museum visits, guided heritage activities), not only preservation for its own sake. The DCMS Culture & Heritage Capital program explicitly values these engagement-led **health and wellbeing gains** using QALYs and WELLBYs, consistent with the approach above.  
Source: [DCMS/Frontier 2024](https://www.frontier-economics.com/media/2lbntjpz/monetising-the-impact-of-culture-and-heritage-on-health-and-wellbeing.pdf).

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes

## Start time & duration (for modeling)

- **Start time:** **0.25 years** (range **0.1–0.5 years**).  
  _Why:_ Philanthropic grants that fund community arts groups, museum programs, or arts-on-prescription typically launch within a few months; measured benefits in trials appear within 3–6 months. [Coulton et al., 2015 RCT of community singing](https://www.cambridge.org/core/journals/the-british-journal-of-psychiatry/article/effectiveness-and-costeffectiveness-of-community-singing-on-mental-healthrelated-quality-of-life-of-older-people-randomised-controlled-trial/516558F0DDD7D4DD0197FDDEAD30ED85).

- **Duration of benefit:** **1.0 year** (range **0.5–2.0 years**).  
  _Why:_ Program effects are clearest during and shortly after participation (3–6 months), with suggestive persistence when engagement continues; some cohorts show longer-lived gains in wellbeing. [Coulton et al., 2015](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/516558F0DDD7D4DD0197FDDEAD30ED85/S0007125000239159a.pdf/), [Bone & Fancourt 2022 review](https://www.communities1st.org.uk/sites/default/files/2022-08/Bone%20Fancourt%202022%20-%20Arts%20Culture%20and%20the%20Brain.pdf).
