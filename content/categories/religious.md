---
id: religious
name: 'Religious'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 10
    costPerQALY: 130_000
---

# Justification of cost per life

_The following analysis was done on April 10th 2026 by GPT-5, with prompts from Impact List staff._

## Description of effect

This effect captures welfare gains from charities that support **organized religious participation**: congregations, ministries, and similar institutions whose main product is worship, fellowship, pastoral support, and religious community life.

The central question is not whether religion is true, nor whether religion has any value in some ultimate theological sense. The question is narrower and more empirical: **how much human welfare do marginal donations buy by helping willing participants take part in organized religion?**

The main benefits here appear to come from community, meaning, social support, lower substance abuse, and modest improvements in mental health and possibly mortality. We do **not** give separate central credit for the direct food-bank, housing, disaster-relief, or medical work done by some religious organizations, because those outputs are better modeled in other categories and ordinary congregations spend only a small share of their budgets directly on social services.

## What kinds of charities are we modeling?

This estimate represents charities whose main output is **organized religious participation itself** — local congregations, parish support, campus and youth ministries, and organizations funding worship, pastoral care, small groups, or spiritual community for willing participants. It is **not** a good model of religious direct-service charities (food, housing, healthcare, disaster relief), religious schools, political organizations, or coercive groups.

:::details{title="What is and isn't included"}
This estimate is meant to represent charities whose main output is **organized religious participation itself**:

- local congregations and parish support funds
- campus ministries, youth ministries, and fellowship organizations
- ministries that fund worship, pastoral care, small groups, or spiritual community for willing participants

This estimate is **not** a good model of:

- direct-service religious charities whose main output is food aid, housing, healthcare, or disaster relief
- religious schools or universities, which are better modeled under education
- explicitly political or culture-war organizations
- coercive, abusive, or highly exclusionary groups

If a religiously affiliated recipient is mainly providing a standard social service, the relevant social-service category is usually the better estimate.
:::

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$130,000 (\$25,000–\$1,200,000)
- **Start time:** 1 year
- **Duration:** 10 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. For ordinary congregational giving, the main thing the donor is buying is **religious participation itself**, not direct charitable service delivery. In the 2018-19 National Congregations Study, 79.6% of congregations reported doing some social-service activity, but the median congregation spent only **\$2,640** directly on such work, about **2%** of the median budget. ([National Congregations Study 2021 report](https://www.nationalcongregationsstudy.org/s/NCSIV-report.pdf))
2. The best observational literature suggests that regular religious-service attendance is associated with materially better outcomes, including roughly **26-33% lower mortality** and lower subsequent depression, smoking, and heavy drinking. But those estimates are not fully causal and likely overstate the true effect. ([Li et al. 2016](https://pubmed.ncbi.nlm.nih.gov/27183175/), [Chen, Kim & VanderWeele 2020](https://academic.oup.com/ije/article/49/6/2030/5734641), [Li et al. 2016 depression study](https://pubmed.ncbi.nlm.nih.gov/27439076/))
3. Better-identified evidence suggests the true causal effect is positive but much smaller than the headline observational associations: longitudinal meta-analysis, blue-law natural experiments, sibling fixed-effects work, and recent European panel studies point to at most a modest average protective effect. ([Garssen, Visser & Pool 2021](https://doi.org/10.1080/10508619.2020.1729570), [Gruber & Hungerman 2008](https://www.nber.org/papers/w12410), [Giles, Hungerman & Oostrom 2023](https://www.nber.org/papers/w30840), [Jokela 2022](https://academic.oup.com/aje/article-abstract/191/4/584/6429428), [Prati 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11365415/), [Eriksson et al. 2022](https://www.cambridge.org/core/journals/bjpsych-open/article/religiosity-and-mental-health-a-contribution-to-understanding-the-heterogeneity-of-research-findings/1F885CB6F6C336954B77D2C3AA34A12B))
4. Taking the strongest observational mortality literature roughly at face value would imply about **0.12-0.15 QALYs per participant-year**, but the better-identified literature suggests only a minority of that effect is likely causal. For the central estimate we therefore use roughly **10%** of that upper-bound effect, i.e. **0.015 QALYs** per additional sustained participant-year, with a plausible range of roughly **0.005-0.04**. ([Hummer et al. 1999](https://pubmed.ncbi.nlm.nih.gov/10332617/))
5. U.S. congregational budgets imply raw spending of roughly **\$1,250-\$1,430 per regular participant per year**. The median congregation had **70 regular participants** and a **\$100,000** annual budget, while the average attendee worshipped in a congregation with **360 regular participants** and a **\$450,000** budget. ([National Congregations Study 2021 report](https://www.nationalcongregationsstudy.org/s/NCSIV-report.pdf))
6. The effective donor cost of causing or sustaining one additional participant-year is somewhat higher than raw budget per participant-year, because congregations are substantially self-financed by members and many donations mostly support people who would have participated anyway. A reasonable central estimate is **\$2,000 per effective participant-year**, with a plausible range of roughly **\$1,000-\$6,000**. One way to read the central figure is raw spending of about **\$1,250-\$1,430** per regular participant-year divided by an approximate **60%-70% marginal effectiveness factor** for crowdout and inframarginal attendance support.
7. Benefits begin within about **1 year**, since donations usually affect current programming, staffing, and community support fairly quickly.
8. A **10-year** duration is a reasonable central estimate because some benefits are tied only to current operations, but some social ties, habits, and identity effects persist for years.

## Details

### Cost per QALY

The cleanest model for this category is:

$$
\text{Cost per QALY} = \dfrac{\text{Effective donor cost per sustained participant-year}}{\text{QALYs gained per participant-year}}
$$

Using the central assumptions:

- effective donor cost per sustained participant-year = **\$2,000**
- QALYs gained per participant-year = **0.015**

So:

$$
\text{Cost per QALY} = \dfrac{2000}{0.015} \approx \$133{,}000
$$

Rounded, that gives a point estimate of about **\$130,000/QALY**.

The two inputs are derived below: the **0.015 QALYs** benefit is roughly **10%** of an observational upper bound, after a large haircut for selection bias, and the **\$2,000** effective donor cost adds an additionality penalty on top of raw budget-per-participant.

#### The participant-year benefit is 0.015 QALYs: ~10% of an observational upper bound

If one took the strongest observational mortality studies at face value, organized religion would look dramatically better than this. [Li et al. 2016](https://pubmed.ncbi.nlm.nih.gov/27183175/) found that women attending services more than once per week had about **33% lower mortality** than non-attenders over 16 years, and [Chen, Kim & VanderWeele 2020](https://academic.oup.com/ije/article/49/6/2030/5734641) found similarly favorable patterns across three large cohorts. But the better-identified literature points to a much smaller causal effect, so we take an observational upper bound of about **0.12-0.15 QALYs/year** and apply a roughly **90% haircut**, landing at **0.015 QALYs per participant-year** (about **5.5 full-health-equivalent days per year**). The plausible range runs from **0.005** (mostly selection) to **0.03-0.04** (much of the literature genuinely causal, charities reaching isolated or at-risk people).

:::details{title="Deriving the 0.015 QALY benefit and its range"}
The strongest observational studies look dramatically more favorable than 0.015. [Chen, Kim & VanderWeele 2020](https://academic.oup.com/ije/article/49/6/2030/5734641) found favorable patterns across three large cohorts for mortality, smoking, heavy drinking, social integration, purpose in life, and other wellbeing outcomes.

But it would be a mistake to read those estimates literally as the causal effect of donor-funded religion. People who attend services regularly differ from non-attenders in many ways that are hard to control away completely: family stability, conscientiousness, existing social support, and baseline health among them. The better quasi-experimental and family-based literature points to a real effect, but a noticeably smaller one:

- [Garssen, Visser & Pool 2021](https://doi.org/10.1080/10508619.2020.1729570) meta-analyze 48 longitudinal studies and find a small positive overall effect, with public religious activity one of the few religion measures that consistently predicts better later mental health.
- [Gruber & Hungerman 2008](https://www.nber.org/papers/w12410) use blue-law repeals as a natural experiment and find about a **5% decline in attendance** after repeal, plus increases in heavy drinking and drug use among the initially religious individuals affected by the policy change.
- [Giles, Hungerman & Oostrom 2023](https://www.nber.org/papers/w30840) find that religion decline is associated with higher **deaths of despair**, with both the participation decline and the mortality increase driven mainly by middle-aged white Americans.
- [Jokela 2022](https://academic.oup.com/aje/article-abstract/191/4/584/6429428) shows that when one compares siblings, the link between attendance and psychological distress is materially attenuated, though not eliminated.
- [Prati 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11365415/) finds almost no evidence in German panel data of lagged effects of religion on mental health.
- [Eriksson et al. 2022](https://www.cambridge.org/core/journals/bjpsych-open/article/religiosity-and-mental-health-a-contribution-to-understanding-the-heterogeneity-of-research-findings/1F885CB6F6C336954B77D2C3AA34A12B) similarly finds no robust protective association in a British birth cohort once confounding is handled carefully.

A useful quantitative anchor comes from [Hummer et al. 1999](https://pubmed.ncbi.nlm.nih.gov/10332617/), which reported a roughly **7-year** life-expectancy gap at age 20 between never-attenders and people attending more than once per week. Spread over about **40 adult years** of participation, that implies about:

$$
\dfrac{7}{40} \approx 0.175
$$

life-years per participant-year. Adjusting downward because additional years of life are not perfect-health years gives a rough observational upper bound of about **0.12-0.15 QALYs per participant-year**.

The central estimate then applies a roughly **90% haircut** to that upper bound:

$$
0.15 \times 0.10 = 0.015
$$

This is a large discount, but it is the right direction given the attenuation in sibling and within-person designs, the mixed European evidence, and the fact that the strongest positive results come from U.S. Christian samples. A value of **0.015 QALYs per participant-year** corresponds to about **5.5 full-health-equivalent days per year** — a reasonable order of magnitude for a real but moderate benefit from extra community, meaning, and behavioral protection.

The plausible range is wide:

- **Optimistic:** **0.03-0.04 QALYs/year** if a meaningful share of the observational mortality and depression literature is genuinely causal, and if the relevant charities mostly help people who are isolated or at elevated risk.
- **Pessimistic:** **0.005 QALYs/year** if most of the apparent benefit is selection and only a small residual effect remains after better identification.
:::

#### The effective donor cost is \$2,000 per participant-year: raw budget plus an additionality penalty

U.S. congregational budgets imply raw spending of about **\$1,250-\$1,430 per regular participant-year** (median congregation: **70** participants, **\$100,000** budget; the average attendee's congregation: **360** participants, **\$450,000** budget). Because congregations are mostly self-financed by members, many gifts support people who would have attended anyway, and congregations rarely close outright (roughly **1%** annually in older U.S. data, [Duke Today summary of Anderson & Chaves 2008](https://www.today.duke.edu/2008/06/religious_congregation.html)), we apply a moderate additionality haircut.

Numerically, the central estimate is:

$$
\frac{\$1{,}300 \text{ raw cost per participant-year}}{0.65 \text{ marginal effectiveness}} \approx \$2{,}000
$$

The 0.65 factor is a judgment call: it says a marginal donor dollar is less than fully causal for attendance, but not mostly wasted. The lower end of the range corresponds to unusually marginal, participation-focused ministries; the upper end corresponds to gifts that mostly support existing attendees, facilities, or institutions that would have continued anyway.

#### Range: \$25,000-\$1,200,000/QALY

Cost per QALY is driven by just two uncertain inputs — the participant-year benefit (**0.005-0.04**, Assumption 4) and the effective donor cost (**\$1,000-\$6,000**, Assumption 6). Our published plausible range is about **\$25,000-\$1,200,000/QALY** — essentially the full span those two inputs can produce. Its width is dominated by the benefit: how much of the observational mortality and mental-health literature is genuinely causal is by far the largest source of uncertainty (Key uncertainty 1), and that question moves the two inputs together — a reading on which religion's marginal value is high tends to pair a high benefit with more-additional dollars, and a skeptical reading pairs a low benefit with more crowdout. We keep the range at the full input span rather than narrowing it, because that causal question is structural and large enough that the full span is a reasonable plausible range rather than a merely mechanical corner.

That **\$25,000-\$1,200,000** is the full corner of the two parameter ranges, both at their joint best and then their joint worst. For two independent inputs the corner would overstate a narrower independent-input range, but here we publish close to it, for the correlation and structural reasons above.

:::details{title="Mechanical sweep: pairing both inputs at their extremes"}
**Optimistic corner** — low cost paired with high benefit:

$$
\dfrac{1000}{0.04} = 25{,}000
$$

**Pessimistic corner** — high cost paired with low benefit:

$$
\dfrac{6000}{0.005} = 1{,}200{,}000
$$

This \$25,000-\$1,200,000 spread is the full corner of the two parameter ranges. Treating the two inputs as independent and combining their uncertainties (rather than forcing both to an extreme at once) would instead give roughly \$40,000-\$615,000 — but we do **not** use that narrower interval, because the inputs are positively correlated through one's overall read of religion's causal value and because the model carries structural uncertainty (the causal haircut, the additionality penalty, and generalizability beyond U.S. Christianity) beyond what the two parameters capture. The published **\$25,000-\$1,200,000** range therefore tracks the full corner.
:::

### Start time

The **1-year** start time reflects that donations to congregations or ministries usually affect current staffing, facilities, small-group programming, and pastoral support fairly quickly. Benefits to participants can begin within months, but a 1-year estimate is a reasonable average once one includes budgeting and program cycles.

### Duration

The **10-year** duration reflects a mixed picture:

- some donor effects are short-lived operating support
- some effects persist only while a program or congregation remains well-resourced
- but some effects on social ties, habits, identity, and continued attendance can last for years

So a 10-year window is a reasonable middle ground between treating the donation as purely one-year support and treating it as if it permanently changed a life course.

## Key uncertainties

1. **How much of the observational literature is causal.** This is the biggest issue. If the large mortality and depression estimates are mostly causal, the category is much better than **\$130,000/QALY**. If they are mostly selection, it is much worse.

2. **How generalizable the evidence is outside U.S. Christianity.** Much of the strongest positive evidence comes from U.S. Christian samples. European panel evidence is weaker.

3. **Additionality of donor dollars.** Some donations really do sustain institutions and participation; others mostly support people who would have participated anyway.

4. **Heterogeneity across congregations.** Supportive, prosocial, community-rich congregations may be clearly beneficial. Dysfunctional or exclusionary environments may be neutral or harmful.

5. **How much credit to give direct social-service work done by congregations.** We mostly exclude it here to avoid double counting, but that choice matters for some recipients.

6. **Supernatural claims are not modeled.** If one believes religious giving affects salvation or afterlife outcomes, that could dominate the estimate, but there is no intersubjectively checkable way to assign that a public-facing cost-per-QALY figure.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- The main change here is conceptual: the file now models **organized religious participation as the output**, rather than taking large observational mortality correlations at face value and then applying an arbitrary large marginal-attribution penalty.
- The National Congregations Study is doing a lot of work in this version. It helps justify excluding most direct social-service credit and gives a cleaner cost anchor than generic church-giving blog posts.
- Future editors should look especially for better evidence on the marginal cost of creating or sustaining an additional participant-year in ministries that explicitly optimize for that, such as campus ministries or church-planting networks.
- Recipient-level overrides are especially important here. Religious organizations vary a lot more than this category average can capture.
