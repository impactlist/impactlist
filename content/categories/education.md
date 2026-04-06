---
id: education
name: 'Education'
effects:
  - effectId: standard
    startTime: 2
    windowLength: 40
    costPerQALY: 25_000
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4, with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per
[QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and
multiplying this by our hardcoded value for how many years make up a life (80 at the time of this
writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures wellbeing gains from **effective education charities in high-income
countries**, especially two intervention families with unusually strong evidence: (1)
comprehensive programs that help lower-income students complete college degrees faster and at
higher rates, and (2) schoolwide anti-bullying and social-emotional programs that directly improve
students' quality of life. We do **not** assume that generic school spending, elite-university
endowments, or marginal gifts to already-rich institutions are equally effective. The goal is to
estimate the best marginal education philanthropy, not average education expenditure.

## Point Estimates

- **Cost per QALY:** \$25,000 (\$15,000–\$60,000)
- **Start time:** 2 years
- **Duration:** 40 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life
field at the top of this page and enter your own values.*

## Assumptions

1. CUNY's ACE program increased five-year bachelor's-degree completion by about 11.7 percentage
   points in a randomized evaluation. ([CUNY](https://www.cuny.edu/about/administration/offices/student-success-initiatives/asap/evaluation/))
2. In Table 1 of the ACE policy brief's midpoint persistence scenario, ACE has approximately
   \$12,374 in direct expenditures per participant and current-generation lifetime earnings gains of
   approximately \$51,986 in present value, yielding \$42,955 in net social benefits even before
   intergenerational effects.
   ([Scott-Clayton et al. 2025](https://www.nber.org/papers/w33956), [Columbia brief 2024](https://povertycenter.columbia.edu/sites/default/files/content/Publications/Net-Benefits-of-Raising-Bachelor-Degree-Completion-CPSP-BRIEF-2024.pdf))
3. A reasonable money-metric conversion in rich countries is roughly \$100,000-\$115,000 per
   QALY-equivalent. This is a wellbeing-based conversion: it maps non-health gains such as income
   into QALY-equivalent units, so it is conceptually broader than a pure health-state QALY.
   ([HM Treasury 2021](https://www.gov.uk/government/publications/green-book-supplementary-guidance-wellbeing), [Frijters and Krekel 2021](https://eprints.lse.ac.uk/114605/1/Frijters_PR3.pdf))
4. ASAP-type comprehensive college-support programs have replicated large impacts outside the
   original CUNY setting and now show observed labor-market gains: in Ohio, the program increased
   degree receipt by 15 percentage points after eight years and raised year-8 earnings by \$3,337,
   while the direct program cost was \$5,521 per participant over three years (\$8,030 including the
   added cost of educating students longer). ([MDRC 2025](https://www.mdrc.org/work/publications/learning-earning), [MDRC 2020](https://www.mdrc.org/sites/default/files/ASAP_OH_3yr_Impact_Report_1.pdf))
5. KiVa, a schoolwide anti-bullying program, was estimated at €13,823 per QALY in a
   decision-analytic model. ([Persson et al. 2018](https://link.springer.com/article/10.1007/s11121-018-0893-6))
6. A 2024 systematic review of universal primary-school social-emotional and mental-health
   interventions found that all but one comparable full economic evaluation judged interventions
   cost-effective, with QALY/DALY results ranging from cost-saving to about Int\$25,463 per QALY.
   ([Abou Jaoude et al. 2024](https://link.springer.com/article/10.1007/s12310-024-09642-0))
7. Some schoolwide social-emotional-learning programs are only marginally cost-effective or
   sensitive to costing assumptions: in the PATHS trial, the base-case estimate was about
   £16,800/QALY, but it was no longer cost-effective once teacher salary costs were treated as
   incremental. ([Turner et al. 2020](https://link.springer.com/article/10.1007/s40258-019-00498-z))
8. Associational evidence points toward health benefits from education, including a 2024 global
   meta-analysis finding roughly 1.9% lower adult mortality per additional year of education, but
   causal evidence from quasi-experiments is mixed. So the headline estimate should not rely mainly
   on mortality reductions from years of schooling.
   ([Lancet Public Health 2024](https://pubmed.ncbi.nlm.nih.gov/38278172/), [Galama et al. 2018](https://www.nber.org/papers/w24225), [Clark and Royer 2013](https://www.aeaweb.org/articles?id=10.1257/aer.103.6.2087))
9. School-climate benefits begin within the school year, while degree-completion benefits begin
    after students leave school and can persist for decades through earnings, employment, and
    related wellbeing channels.

## Details

### Cost per QALY

The right way to model this category is **not** to start from the claim that "education is good"
and then assume a generic education dollar inherits that value. The strongest evidence is narrower:
some education interventions create large, measurable gains in wellbeing, but many others do not.
The cleanest anchors are therefore interventions where we either have direct QALY evidence or
unusually strong long-run causal evidence on attainment and earnings.

**Pathway 1 — Degree-completion programs**

The strongest attainment anchor is now CUNY ACE. In Table 1 of the 2024 policy brief and the
corresponding midpoint scenario in the 2025 NBER working paper, the program generates
current-generation lifetime earnings gains of **\$51,986** per participant against direct
expenditures of **\$12,374** (Assumption 2).

Using the rich-country conversion benchmark in Assumption 3:

This step uses a wellbeing-economics bridge rather than a pure health-state QALY measure. The
underlying idea is that higher lifetime earnings create real welfare gains, and the WELLBY
literature provides a standard way to convert those gains into QALY-equivalent units for
non-health interventions.

$$
\text{QALYs from current-generation earnings} \approx \dfrac{\$51{,}986}{\$100{,}000\text{–}\$115{,}000}
\approx 0.45\text{–}0.52
$$

$$
\text{Cost per QALY} \approx \dfrac{\$12{,}374}{0.45\text{–}0.52}
\approx \$24{,}000\text{–}\$27{,}000
$$

That is already somewhat conservative, because the ACE authors explicitly do **not** include
several plausibly real current-generation benefits such as health, longevity, and reduced crime,
and also exclude child-generation benefits from the headline current-generation calculation.

The same paper's alternative persistence scenarios imply roughly:

- **Optimistic / permanent completion effect:** about \$15,000-\$17,000 per QALY
- **Pessimistic / acceleration-only:** about \$47,000-\$54,000 per QALY

So a reasonable practical range for the attainment pathway is roughly **\$15,000-\$55,000/QALY**.

This is not just one lucky program. ASAP-style comprehensive supports have now replicated across
settings. In Ohio, MDRC finds a **15 percentage point** increase in degree receipt after eight
years and a **\$3,337** earnings increase in year 8 alone (Assumption 4). That does not by itself
deliver a full lifetime QALY estimate, but it materially increases confidence that the ACE-based
calculation is not a fragile one-off.

**Pathway 2 — Direct school-wellbeing programs**

For school-climate and mental-health programs, the evidence is even cleaner in one sense because it
sometimes measures QALYs directly rather than inferring them from later-life earnings. The KiVa
anti-bullying program was estimated at **€13,823/QALY** (Assumption 5), which is a strong direct
anchor in the low-to-mid five figures.

The broader 2024 systematic review of universal primary-school social-emotional and mental-health
interventions is consistent with that anchor rather than contradicting it. The review finds that
almost all comparable full economic evaluations judged the interventions cost-effective, with
QALY/DALY results ranging from cost-saving to **Int\$25,463/QALY** (Assumption 6). But the review
also shows why some caution is warranted: results vary across programs, outcomes, costing methods,
and time horizons. The PATHS trial is a useful example because it landed in the same broad range in
its base case while becoming much less compelling under less favorable costing assumptions
(Assumption 7).

So the clean takeaway from this literature is not that every SEL or antibullying curriculum is a
home run. It is that **the better schoolwide wellbeing programs appear to land in roughly the same
low-to-mid five-figure \$/QALY range as the best degree-completion programs**.

**Combined estimate**

The two strongest literatures converge surprisingly well:

- **Degree completion / college support:** roughly \$25,000/QALY centrally, with plausible range
  from the mid-teens to the low \$50,000s depending on how persistent the completion effect is.
- **School wellbeing / anti-bullying:** roughly \$15,000-\$25,000/QALY in the better direct
  studies, with some weaker programs looking less attractive.

That convergence is the main reason the point estimate is **\$25,000/QALY** rather than something
much higher or lower. It is below what a mortality-only framing would suggest, because that
framing misses much of what education philanthropy actually buys. But it is also above the most
optimistic benefit-cost interpretations, because we want a category-level estimate that generalizes
across strong education charities rather than assuming every marginal dollar finds an ACE- or
KiVa-level opportunity.

The range **\$15,000-\$60,000/QALY** is meant as a practical uncertainty range rather than a full
confidence interval. The low end corresponds to unusually strong, persistent attainment effects or
the better direct school-wellbeing programs. The high end corresponds to cases where attainment
programs mainly accelerate completion rather than permanently raise it, or where implementation
quality is good but not exceptional.

We treat the education-health and education-mortality literature mainly as background context
rather than as the main quantitative engine. That literature matters, and it is one reason the
true value of education may be somewhat higher than a pure earnings-based estimate suggests. But
because the causal evidence is mixed (Assumption 8), it is better used as qualitative support than
as the core calculation. The 2024 Lancet Public Health meta-analysis is useful here: it suggests
that more education is associated with lower adult mortality, but the quasi-experimental evidence
is not solid enough to let that association carry the headline estimate on its own.

### Start Time

The 2-year start time is a compromise between the two main pathways in this category. School-climate
and anti-bullying interventions improve students' quality of life within the academic year, while
degree-completion programs usually begin paying off once students finish or accelerate through
college and start earning more. Two years is therefore a reasonable portfolio average.

### Duration

The 40-year duration reflects that the main attainment benefits of education accrue across a large
share of adult working life. Someone who completes a degree in their early 20s can experience
higher earnings, better employment stability, and related wellbeing improvements for several
decades. School-climate gains are shorter-lived on average, but some of them plausibly have lasting
effects through reduced victimization, better mental health, and better school persistence.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- This file now intentionally models **effective high-income education philanthropy**, not generic
  education spending. If we later want a separate category for ordinary university gifts or general
  K-12 subsidy, it should probably be worse than this baseline.
- The best near-term upgrade path is a cleaner direct comparison between ACE, ASAP, and other
  comprehensive-support programs using donor-cost rather than social-cost accounting, plus any new
  10-year labor-market follow-up results.
