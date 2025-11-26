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

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

## Description of effect

This effect captures quality-of-life improvements from arts, culture, and heritage programs that increase direct participation or access—such as community choirs, dance programs, museum activities for older adults, and arts social prescribing. These activities produce observable gains in life satisfaction and mental health, along with benefits in meaning, connection, and identity. We model participatory programs in high-income countries rather than large capital builds.

## Point Estimates

- **Cost per QALY:** \$12,000 (\$3,000–\$30,000)
- **Start time:** 1 year
- **Duration:** 2 years

## Assumptions

1. Arts, culture, and heritage programs that increase direct participation produce observable gains in life satisfaction and mental health. ([WHO scoping review](https://www.ncch.org.uk/uploads/WHO-Scoping-Review-Arts-and-Health.pdf), [DCMS/Frontier 2024](https://www.frontier-economics.com/media/2lbntjpz/monetising-the-impact-of-culture-and-heritage-on-health-and-wellbeing.pdf))
2. Community singing RCTs show QALY gains of approximately 0.015 at 6 months for a 14-week program. ([Coulton et al. 2015](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/516558F0DDD7D4DD0197FDDEAD30ED85/S0007125000239159a.pdf/))
3. Arts social prescribing programs report cost per QALY ranging from £1,963 (Doncaster) to £20,100 (City & Hackney), reflecting setting and implementation variation. ([Doncaster evaluation](https://cpe.org.uk/wp-content/uploads/2017/02/Evaluation-of-Doncaster-Social-Prescribing-Service-December-2016.pdf), [social prescribing evidence review](https://socialprescribingacademy.org.uk/media/carfrp2e/evidence-review-economic-impact.pdf))
4. Typical high-quality arts participation produces an average life-satisfaction gain of approximately +0.2 points sustained for 6 months. ([Wang et al. 2020](https://bmcpublichealth.biomedcentral.com/articles/10.1186/s12889-019-8109-y), [Bone & Fancourt 2022](https://www.communities1st.org.uk/sites/default/files/2022-08/Bone%20Fancourt%202022%20-%20Arts%20Culture%20and%20the%20Brain.pdf))
5. The conversion between life satisfaction and QALYs is approximately 1 QALY ≈ 7 WELLBYs, where 1 WELLBY = +1 point on a 0–10 life-satisfaction scale for one person for one year. ([HMT Green Book guidance](https://assets.publishing.service.gov.uk/media/60fa9169d3bf7f0448719daf/Wellbeing_guidance_for_appraisal_-_supplementary_Green_Book_guidance.pdf), [What Works Wellbeing](https://whatworkswellbeing.org/blog/converting-the-wellby/))
6. Philanthropic cost for group arts programs is approximately \$250 per participant-year, covering sessions, venues, and coordination. ([Coulton et al. 2015, Table 3](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/516558F0DDD7D4DD0197FDDEAD30ED85/S0007125000239159a.pdf/))
7. Heritage benefits arrive primarily through engagement activities (museum visits, guided heritage activities) rather than preservation alone. ([DCMS/Frontier 2024](https://www.frontier-economics.com/media/2lbntjpz/monetising-the-impact-of-culture-and-heritage-on-health-and-wellbeing.pdf))
8. Program effects are clearest during and shortly after participation, with benefits persisting 1–2 years when engagement continues. ([Coulton et al. 2015](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/516558F0DDD7D4DD0197FDDEAD30ED85/S0007125000239159a.pdf/), [Bone & Fancourt 2022](https://www.communities1st.org.uk/sites/default/files/2022-08/Bone%20Fancourt%202022%20-%20Arts%20Culture%20and%20the%20Brain.pdf))

## Details

### Cost per QALY

The point estimate (\$12,000/QALY) and range (\$3,000–\$30,000/QALY) are derived from two complementary approaches: direct health-QALY measurements from trials, and wellbeing-to-QALY conversions for benefits beyond health restoration.

**Anchor A — Health-QALY evidence from trials:**

A community singing RCT for older adults found QALY gains of approximately 0.015 at 6 months for a 14-week program (Assumption 2). Extrapolating to a full year of comparable engagement yields approximately 0.03 QALYs per person-year. Using the estimated philanthropic cost of \$250 per participant-year (Assumption 6):

$$\dfrac{\$250}{0.03 \text{ QALYs}} \approx \$8,300/\text{QALY}$$

Arts social prescribing evaluations report a wide range from £1,963/QALY to £20,100/QALY (Assumption 3), reflecting variation in settings and implementation.

**Anchor B — Wellbeing (WELLBY) to QALY conversion:**

Many arts benefits extend beyond health restoration to include meaning, joy, and social connection. Using the UK Treasury's conversion framework (Assumption 5), a typical life-satisfaction gain of +0.2 points sustained for 6 months (Assumption 4) yields:

- Life-satisfaction effect: +0.2 for 0.5 years = 0.1 WELLBY per person
- Convert to QALY: 0.1 WELLBY ÷ 7 ≈ 0.014 QALYs
- Cost per QALY: \$250 / 0.014 ≈ \$17,900/QALY

**Combined estimate:**

Taking Anchor A (~\$8,000/QALY) and Anchor B (~\$18,000/QALY), and allowing for program heterogeneity evident in social prescribing data (Assumption 3), we place the central estimate at \$12,000/QALY. The wide range (\$3,000–\$30,000/QALY) reflects variation in per-participant costs, uncertainty in effect sizes across settings and populations, and the wellbeing-to-QALY mapping methodology.

### Start Time

The one-year start time reflects the typical delay between philanthropic grants and program delivery. While community arts programs can launch within months and measured benefits appear within 3–6 months (Assumption 2), we use one year to account for grant cycles and program establishment.

### Duration

The 2-year duration reflects the period over which program effects persist (Assumption 8). Benefits are clearest during and shortly after participation, with some evidence of longer-lived gains when engagement continues. This is shorter than health interventions because arts benefits depend more heavily on ongoing participation.

### Notes on heritage

Heritage benefits are modeled through engagement activities—museum visits, guided heritage programs—rather than preservation for its own sake (Assumption 7). The DCMS Culture & Heritage Capital program explicitly values these engagement-led health and wellbeing gains using QALYs and WELLBYs.

---

_These estimates are approximate and we welcome contributions to improve them. Learn how you can help [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
