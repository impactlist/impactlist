---
id: human-rights
name: 'Human Rights and Justice'
effects:
  - effectId: standard
    startTime: 2
    windowLength: 20
    costPerQALY: 310
---

# Justification of cost per life

_The following analysis was done on April 14th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per
[QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying
this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global
assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from donations to unusually effective, relatively non-ideological human-rights
charities that reduce severe rights violations with direct welfare consequences: especially preventing violence
against women and girls (VAWG), reducing bonded labour and trafficking, and related community-level protection and
empowerment work. The model is meant to be **all-things-considered**: it includes safety, mental health, autonomy,
dignity, social functioning, and freedom from exploitation after converting those effects into **QALY-equivalent**
terms. It does **not** try to model the average human-rights NGO, nor use broad expressive advocacy or litigation to
anchor the headline estimate when the public evidence is still too thin.

## Point Estimates

- **Cost per QALY:** \$310 (\$100–\$4,000)
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
2. Those measured VAWG DALYs likely understate full welfare gains. A reasonable central conversion is that **1 DALY
   averted** in this literature corresponds to about **2.5 QALY-equivalent welfare gains** in total, with a practical
   range of about **1–4**, once omitted mortality risk, post-intervention persistence, safety, autonomy, dignity, and
   broader psychosocial harms are included. ([See detailed justification](/assumption/human-rights-welfare-conversion))
3. For category-level marginal giving, a reasonable central external-validity markup on the strongest VAWG trial
   results is about **3x**, with a practical range of **1.5x–5x**, to account for transportability, scaling, and
   publication-bias risk.
4. Community-based anti-bonded-labour programs in Freedom Fund's India hotspots appear promising but are supported by
   weaker evidence than the VAWG literature. A Freedom Fund evidence paper summarising external evaluations reports
   roughly **125,000 fewer individuals in bonded labour** across target villages after about **\$15.8 million** in
   spending across two India hotspots, implying roughly **\$126** per fewer person in bondage. ([Freedom Fund 2024 evidence paper](https://www.freedomfund.org/app/uploads/2024/03/Freedom-Fund-Evidence-in-Practice-Paper-Unlocking-what-works.pdf))
5. A typical person avoiding bonded labour or similar labour trafficking plausibly gains about **1.0 QALY-equivalent**
   in total, with a practical range of about **0.4–2.0**. This combines health-related quality-of-life loss,
   exploitation duration, fear, shame, worthlessness, restricted agency, and impaired daily functioning into one
   all-things-considered welfare estimate. ([See detailed justification](/assumption/human-rights-welfare-conversion))
6. For category-level marginal giving, the Freedom Fund-style anti-slavery evidence should be discounted by about
   **4x**, with a practical range of **2x–8x**, for attribution, substitution, durability, and multi-component-program
   uncertainty.
7. A reasonable central portfolio split for this category is about **70% VAWG prevention** and **30% anti-slavery /
   anti-trafficking work**. This is a modeling judgment about the strongest current direct-welfare human-rights
   opportunities rather than a literal budget breakdown of the whole field.

## Details

### Cost per QALY

The cleanest way to estimate this category is to anchor on the two parts of the field that are most measurable:

1. **Well-evaluated VAWG prevention**
2. **Promising community-based anti-bonded-labour work**

This anchor is narrower than "all human rights philanthropy" because the public evidence is strongest here. Much
broader legal and advocacy work may still be extremely important, but the public evidence base is not yet strong
enough to let it drive the point estimate.

**Approach 1 — VAWG prevention**

Ferrari et al. is the best public quantitative anchor we found for this category. The strongest scale-ready
interventions in that paper are community- or school-based prevention programs in low- and middle-income countries,
with the strongest general headline figure at about **\$222 per DALY averted** and one especially strong Ghana estimate
at **\$52 per DALY for women only**.

Ferrari et al. explicitly notes that the DALY analysis uses a **1-year horizon**, includes only a **subset of health
consequences**, assumes **no mortality impact**, and separately reports broader social and economic effects in impact
inventories. So the measured DALYs should not be treated as the full welfare effect. The dedicated assumption page
uses a central conversion of about **2.5 QALY-equivalent welfare gains per measured DALY averted** once those omitted
harms are brought back into the model. ([Ferrari et al. 2022](https://journals.plos.org/plosmedicine/article?id=10.1371%2Fjournal.pmed.1003827), [See detailed justification](/assumption/human-rights-welfare-conversion))

For a category page, simply copying the best trial result into the headline number would probably overstate the likely
value of a marginal donor dollar. A donor today is not buying the average dollar inside a tightly studied RCT. To
adjust for transportability, scaling, and publication-bias risk, we multiply the stronger VAWG figures by about **3x**.

Using the strongest broadly stated research-setting result:

$$
\$222 \times \frac{3}{2.5} \approx \$266
$$

So a reasonable category-level central figure for top-tier VAWG prevention is about **\$266/QALY-equivalent**.

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

To turn that into QALY-equivalents, we use the dedicated welfare-conversion assumption page. The central estimate is
about **1.0 QALY-equivalent per person** avoiding bonded labour. In rough terms, that corresponds to a little over
**2 years** of exploitation avoided at about **0.5 QALY-equivalents of annual welfare loss**, combining mental-health
and physical harm with fear, shame, restricted agency, and impaired daily functioning. In QALY-equivalent terms:

$$
\frac{\$126}{1.0} = \$126 \text{ per QALY-equivalent}
$$

That raw figure likely overstates category-level marginal impact because the India hotspot evidence is not randomised,
the interventions are multi-component, and the prevalence decline may overstate durable marginal impact due to
substitution, secular change, or imperfect attribution. Applying a central penalty of about **4x** gives:

$$
\$126 \times 4 = \$504
$$

So **about \$500/QALY-equivalent** is a reasonable all-things-considered central figure for promising anti-bonded-labour
work.

**Combined**

Modeling the category as roughly **70% VAWG prevention** at **\$266/QALY** and **30% anti-slavery work** at
**\$504/QALY** gives:

$$
\text{QALYs per } \$1 = \frac{0.7}{266} + \frac{0.3}{504} \approx 0.00322
$$

$$
\text{Cost per QALY} \approx \frac{1}{0.00322} \approx \$310
$$

That gives a point estimate of about **\$310/QALY**.

**Range**

The low end is around **\$100/QALY** if a donor accesses unusually strong VAWG opportunities near the best published
results and anti-slavery work near the optimistic end of the hotspot interpretation.

The high end is around **\$4,000/QALY** if the donor funds weaker implementations, if anti-slavery effects are much
less durable or less attributable than they first appear, or if the portfolio leans toward weaker direct-welfare
rights work than the category is trying to model.

So **\$100-\$4,000/QALY** is best read as a practical sensitivity range, not a formal confidence interval.

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
- High-level litigation or legal reform work whose public causal evidence is still too thin to anchor the headline
  estimate
- Generic criminal-justice reform philanthropy in rich countries

Those efforts may still matter a great deal. They are just not the best-evidenced anchors for the category's current
point estimate.

## Key Uncertainties

1. **How much of the best VAWG evidence travels to new settings and implementers.** Strong RCT evidence exists, but the
   very best trial results may not be fully reproducible everywhere.
2. **How strong the anti-slavery hotspot evidence really is.** The reported prevalence reductions are impressive, but
   attribution, substitution, and persistence remain major uncertainties.
3. **How large the broader-welfare uplift should be.** VAWG and bonded labour both involve autonomy, fear,
   humiliation, and reduced agency, and the hard question is how much additional QALY-equivalent value those effects
   add on top of measured health consequences.
4. **What the best marginal opportunities look like today.** This page is trying to model the strongest current
   donation opportunities, not the field average.
5. **How much to count broader legal and institutional work.** Some justice reforms could be extremely valuable, but
   the evidence is currently too thin for them to anchor the headline number yet.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- The biggest modeling choices are now: the **VAWG welfare uplift**, the **bonded-labour QALY-equivalent loss**, and
  the **70/30 portfolio split**.
- If stronger public evidence appears on high-leverage legal empowerment or criminal-justice reform per dollar, this
  page may eventually justify a broader scope. Right now the direct-welfare rights interventions still provide the
  clearest anchor.
