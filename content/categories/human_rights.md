---
id: human-rights
name: 'Human Rights and Justice'
effects:
  - effectId: standard
    startTime: 2
    windowLength: 20
    costPerQALY: 600
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per
[QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying
this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global
assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from donations to unusually effective, relatively non-ideological human-rights
charities that reduce severe rights violations with direct welfare consequences: especially preventing violence
against women and girls (VAWG), reducing bonded labour and trafficking, and related community-level protection and
empowerment work. It does **not** try to model the average human-rights NGO, nor broad expressive advocacy or
litigation with very unclear welfare effects per dollar.

## Point Estimates

- **Cost per QALY:** \$600 (\$100–\$5,000)
- **Start time:** 2 years
- **Duration:** 20 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of
this page and enter your own values.*

## Assumptions

1. The strongest direct cost-effectiveness evidence in this category comes from VAWG prevention. In a six-country
   trial-based cost-effectiveness analysis, the best research-setting intervention achieved about **\$222 per DALY
   averted**, while the broad cross-intervention range ran from **\$222** to **\$17,548**; for the particularly strong
   Ghana community intervention, the paper also reports about **\$52 per DALY for women only** and **\$360 per DALY**
   when both women and men are included. ([Ferrari et al. 2022](https://journals.plos.org/plosmedicine/article?id=10.1371%2Fjournal.pmed.1003827))
2. Those VAWG DALY figures likely understate full welfare gains, because the analysis used a **1-year horizon**,
   counted only a **subset of health consequences**, and assumed **no mortality impact** or post-intervention effects.
   ([Ferrari et al. 2022](https://journals.plos.org/plosmedicine/article?id=10.1371%2Fjournal.pmed.1003827))
3. For category-level marginal giving, it is appropriate to mark up the best trial-based VAWG results by several-fold
   for external-validity, scaling, and publication-bias risk rather than using them literally.
4. Community-based anti-bonded-labour programs in Freedom Fund's India hotspots appear promising but are supported by
   weaker evidence than the VAWG literature. A Freedom Fund evidence paper summarising external evaluations reports
   roughly **125,000 fewer individuals in bonded labour** across target villages after about **\$15.8 million** in
   spending across two India hotspots, while a Freedom Fund Tamil Nadu prevalence report based on participatory
   statistics reports bonded-labour prevalence falling from **56.1% to 11.1%** in intervention communities.
   ([Freedom Fund 2024 evidence paper](https://www.freedomfund.org/app/uploads/2024/03/Freedom-Fund-Evidence-in-Practice-Paper-Unlocking-what-works.pdf))
5. Labour exploitation typically lasts years, not weeks. One temporal study of modern-slavery cases estimated mean
   duration of **adult labour exploitation** at about **775 days**, or roughly **2.1 years**. ([Lightowlers et al. 2024](https://journals.sagepub.com/doi/10.1177/17488958221094988))
6. Trafficking and modern-slavery survivors experience substantial physical and psychological harm. Reviews find high
   prevalence of depression, anxiety, PTSD, CPTSD, and physical symptoms; one CPTSD review reports about **41%**
   prevalence among survivors, and an Indian study reports mean **EQ-5D utility of 0.731** among people with
   depression. ([Ottisova et al. 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC7137602/), [Evans et al. 2022](https://www.elsevier.es/en-revista-european-journal-psychiatry-431-avance-resumen-prevalence-complex-post-traumatic-stress-disorder-S0213616322000076), [Pathak et al. 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12331007/))
7. Taking the duration and health-burden evidence together, a rough portfolio assumption of **0.2–0.4 QALYs lost per
   year** while in bonded labour is reasonable. The idea is that exploitation plausibly lowers average health-related
   utility from something near **1.0** to roughly **0.6–0.8** once depression, PTSD, anxiety, pain, and restricted
   agency are combined, while also recognizing that the cited Indian EQ-5D paper is about general depression patients
   rather than bonded-labour victims specifically. So this should be read as a judgment call informed by the
   literature, not a directly measured estimate. Combining that with roughly **2–4 years** of exploitation avoided per
   person implies about **0.4–1.6 QALYs** gained per person freed.

## Details

### Cost per QALY

The cleanest way to estimate this category is to anchor on the two parts of the field that are most measurable:

1. **Well-evaluated VAWG prevention**
2. **Promising community-based anti-bonded-labour work**

This is intentionally narrower than "all human rights philanthropy." Much broader legal and advocacy work may still be
important, but the public evidence base is not strong enough to let it drive the point estimate.

**Approach 1 — VAWG prevention**

Ferrari et al. is the best public quantitative anchor we found for this category. The strongest scale-ready
interventions in that paper are community- or school-based prevention programs in low- and middle-income countries,
with the strongest general headline figure at about **\$222 per DALY averted** and one especially strong Ghana estimate
at **\$52 per DALY for women only**.

For a category page, it would be too optimistic to simply copy the best trial result into the headline number. A donor
today is not buying the average dollar inside a tightly studied RCT. To adjust for transportability, scaling, and
publication-bias risk, we multiply the stronger VAWG figures by roughly **2-4x**.

Using the strongest broadly stated research-setting result:

$$
\$222 \times 2 \approx \$444
$$

So a reasonable category-level central figure for top-tier VAWG prevention is about **\$450-\$500 per QALY**.

This is already conservative in one important way: we are treating **1 DALY as roughly 1 QALY** here rather than
adding an extra multiplier for autonomy, safety, dignity, social functioning, or longer-run downstream effects. Those
extra harms are real, but the public evidence is not strong enough to convert them cleanly into a further QALY uplift
without risking false precision or double counting. Since Ferrari et al. already excludes some downstream gains, a 1:1
conversion is best interpreted as a conservative simplification rather than as a claim that non-health harms are zero.

As an external validity check, this is directionally consistent with the broader VAWG evidence base. For example,
SASA!, a well-known community mobilisation intervention in Kampala, reduced continuation and onset of multiple forms of
abuse in a cluster randomised trial, supporting the idea that this class of intervention can produce real and durable
changes rather than being driven only by one-off measurement noise. ([Abramsky et al. 2016](https://pubmed.ncbi.nlm.nih.gov/26873948/))

**Approach 2 — bonded labour and trafficking**

The anti-slavery evidence base is weaker, but not empty. The most useful public anchor is the Freedom Fund India
hotspot work summarised by external evaluations. If roughly **\$15.8 million** led to about **125,000 fewer people in
bonded labour**, then the implied cost is about:

$$
\frac{\$15{,}800{,}000}{125{,}000} \approx \$126
$$

per fewer person in bondage.

To turn that into QALYs, we need a rough welfare-loss estimate per victim. Using Assumptions 5-7:

- **Central annual loss:** 0.3 QALYs
- **Central duration avoided:** 2.1 years

The 0.3 figure is a judgment call, not a direct measurement: it roughly corresponds to exploitation reducing average
utility from about **1.0** to about **0.7**, which is directionally consistent with the severe-mental-health evidence
above and with the Indian EQ-5D depression anchor, while still being conservative about harms that are hard to
quantify.

So:

$$
0.3 \times 2.1 = 0.63 \text{ QALYs per person}
$$

and:

$$
\frac{\$126}{0.63} \approx \$200 \text{ per QALY}
$$

That figure is too optimistic to use directly because the India hotspot evidence is not randomised, the interventions
are multi-component, and the prevalence decline may overstate durable marginal impact due to substitution, secular
change, or imperfect attribution. Applying a large penalty of about **4x** gives:

$$
\$200 \times 4 = \$800
$$

So **\$800/QALY** is a reasonable all-things-considered central figure for promising anti-bonded-labour work.

**Combined**

Modeling the category as roughly **70% VAWG prevention** at **\$500/QALY** and **30% anti-slavery work** at
**\$800/QALY** gives:

$$
\text{QALYs per } \$1 = \frac{0.7}{500} + \frac{0.3}{800} = 0.001775
$$

$$
\text{Cost per QALY} \approx \frac{1}{0.001775} \approx \$563
$$

Rounded to one significant digit, that gives a point estimate of **\$600/QALY**.

**Range**

The low end is around **\$100/QALY** if a donor accesses unusually strong VAWG opportunities close to the best
published results and anti-slavery work near the high end of the India hotspot interpretation.

The high end is around **\$5,000/QALY** if the donor funds weaker implementations, if anti-slavery effects are much
less durable or less attributable than they first appear, or if the portfolio leans toward broader justice and legal
work whose welfare effects are real but much harder to quantify.

So **\$100-\$5,000/QALY** is best read as a practical sensitivity range, not a formal confidence interval.

### Start Time

We use a **2-year** start time because these interventions usually need time for mobilisation, training, survivor
identification, and local institutional response before they translate into less violence or fewer people in
exploitative conditions. That is consistent with the fact that many of the key evaluations measure effects over roughly
**1-4 years**, not within a few months.

### Duration

We use a **20-year** duration. Preventing serious violence or removing someone from bonded labour can improve wellbeing
for much longer than the intervention period itself through better safety, mental health, education, work, and reduced
risk of revictimisation. But the evidence base is not strong enough to justify simply assigning a full lifetime to
every benefit.

So 20 years is a compromise:

- Long enough to reflect that these are not just one-year benefits
- Short enough to avoid assuming universal permanent gains or perfectly persistent institutional change

## What Kinds of Charities Are We Modeling?

These estimates are mainly for **high-impact human-rights charities with relatively direct welfare effects**, such as:

- Community-based programs that reduce violence against women and girls
- School-based programs that reduce sexual assault risk for girls
- Anti-bonded-labour and anti-trafficking organizations that combine community organising, legal support, survivor
  assistance, and pressure on employers or local authorities

They are **not** estimates for:

- The average general-purpose human-rights NGO
- Broad culture-war or expressive advocacy projects
- High-level litigation or legal reform work with very unclear counterfactual effects per dollar
- Generic criminal-justice reform philanthropy in rich countries

Those efforts may still matter morally and politically. They are just much harder to price in QALYs with any real
confidence.

## Key Uncertainties

1. **How much of the best VAWG evidence travels to new settings and implementers.** Strong RCT evidence exists, but the
   very best trial results may not be fully reproducible everywhere.
2. **How strong the anti-slavery hotspot evidence really is.** The reported prevalence reductions are impressive, but
   attribution, substitution, and persistence remain major uncertainties.
3. **How much extra welfare lies outside measured DALYs.** VAWG and bonded labour both involve autonomy, fear,
   humiliation, and reduced agency, much of which is only partially captured in health metrics.
4. **What the best marginal opportunities look like today.** This page is trying to model the strongest current
   donation opportunities, not the field average.
5. **How much to count broader legal and institutional work.** Some justice reforms could be extremely valuable, but
   the evidence is currently too thin for them to anchor the headline number.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- The biggest modeling choice here is to let **VAWG prevention** anchor the estimate and treat **anti-slavery work** as
  a secondary corroborating stream rather than pretending all of "human rights and justice" is equally measurable.
- The best candidate for a dedicated future assumption page is the **QALY loss from bonded labour / trafficking**. That
  is the shakiest quantitative bridge in the current file.
- If stronger public evidence appears on high-leverage legal empowerment or criminal-justice reform per dollar, this
  page may eventually justify a broader scope. Right now that would mostly add false precision.
