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

{{STANDARD_QALY_METHOD_NOTE}}

## Description of effect

This effect captures welfare gains from donations to unusually effective, relatively non-ideological human-rights
charities that reduce severe rights violations with direct welfare consequences: especially preventing violence
against women and girls (VAWG), reducing bonded labour and trafficking, and related community-level protection and
empowerment work. The model is meant to be **all-things-considered**: it includes safety, mental health, autonomy,
dignity, social functioning, and freedom from exploitation after converting those effects into **QALY-equivalent**
terms. It does **not** try to model the average human-rights NGO, nor use broad expressive advocacy or litigation to
anchor the headline estimate when the public evidence is still too thin.

## What kinds of charities are we modeling?

These estimates are mainly for **high-impact human-rights charities with relatively direct welfare effects** — community-based programs that reduce violence against women and girls, school-based programs that reduce sexual assault risk for girls, and anti-bonded-labour/anti-trafficking organizations. They are **not** estimates for the average general-purpose human-rights NGO, broad culture-war or expressive advocacy, high-level litigation, or generic rich-country criminal-justice reform.

:::details{title="Specific inclusions and exclusions"}
Included:

- Community-based programs that reduce violence against women and girls
- School-based programs that reduce sexual assault risk for girls
- Anti-bonded-labour and anti-trafficking organizations that combine community organising, legal support, survivor
  assistance, and pressure on employers or local authorities

Not included:

- The average general-purpose human-rights NGO
- Broad culture-war or expressive advocacy projects
- High-level litigation or legal reform work whose public causal evidence is still too thin to anchor the headline
  estimate
- Generic criminal-justice reform philanthropy in rich countries

Those efforts may still matter a great deal. They are just not the best-evidenced anchors for the category's current
point estimate.
:::

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$310 (\$130–\$1,500)
- **Start time:** 2 years
- **Duration:** 20 years

The estimate is driven by a blend of two measurable anchors: top-tier VAWG prevention at about \$266/QALY-equivalent
(70% of the portfolio) and promising anti-bonded-labour work at about \$504/QALY-equivalent (30%). Both start from
trial-based dollars-per-DALY or dollars-per-person figures, then apply two cruxes — how much broader welfare a measured
DALY (or a person freed from bondage) really represents, and how much to discount the strongest evidence for marginal
category-level giving. The range is wide (\$130–\$1,500) because four conversion and discount parameters move together
under an optimistic or pessimistic reading, and because the anti-slavery evidence is not randomised.

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of
this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. The strongest direct cost-effectiveness evidence in this category comes from VAWG prevention. In a six-country
   trial-based cost-effectiveness analysis, the strongest research-setting intervention achieved about **\$222 per DALY
   averted**, while the broad cross-intervention range ran from **\$222** to **\$17,548**. We anchor the VAWG component on
   that strongest research-setting figure, then apply an external-validity markup before blending it with the
   anti-slavery component. ([Ferrari et al. 2022](https://journals.plos.org/plosmedicine/article?id=10.1371%2Fjournal.pmed.1003827))
2. Those measured VAWG DALYs likely understate full welfare gains. A reasonable central conversion is that **1 DALY
   averted** in this literature corresponds to about **2.5 QALY-equivalent welfare gains** in total, with a practical
   range of about **1–4**, once omitted mortality risk, post-intervention persistence, safety, autonomy, dignity, and
   broader psychosocial harms are included. ([See detailed justification](/assumption/human-rights-welfare-conversion))
3. For category-level marginal giving, a reasonable central external-validity markup on the strongest VAWG trial
   results is about **3x**, with a plausible range of **1.5x–5x**, to account for transportability, scaling, and
   publication-bias risk.
4. Community-based anti-bonded-labour programs in Freedom Fund's India hotspots appear promising but are supported by
   weaker evidence than the VAWG literature. A Freedom Fund evidence paper summarising external evaluations reports
   roughly **125,000 fewer individuals in bonded labour** across target villages after about **\$15.8 million** in
   spending across two India hotspots, implying roughly **\$126** per fewer person in bondage. ([Freedom Fund evidence paper](https://www.freedomfund.org/our-reports/unlocking-what-works-how-community-based-interventions-are-ending-bonded-labour-in-india/))
5. A typical person avoiding bonded labour or similar labour trafficking plausibly gains about **1.0 QALY-equivalent**
   in total, with a plausible range of about **0.4–2.0**. This combines health-related quality-of-life loss,
   exploitation duration, fear, shame, worthlessness, restricted agency, and impaired daily functioning into one
   all-things-considered welfare estimate. ([See detailed justification](/assumption/human-rights-welfare-conversion))
6. For category-level marginal giving, the Freedom Fund-style anti-slavery evidence should be discounted by about
   **4x**, with a plausible range of **2x–8x**, for attribution, substitution, durability, and multi-component-program
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

**Approach 1 — VAWG prevention: about \$266/QALY-equivalent.** Starting from the strongest research-setting
result in Ferrari et al. (\$222 per DALY averted), applying the 2.5x DALY-to-QALY welfare conversion (Assumption 2) and a
3x marginal external-validity discount (Assumption 3) gives $$\$222 \times \frac{3}{2.5} \approx \$266$$ per
QALY-equivalent.

:::details{title="VAWG derivation and external-validity check"}
Ferrari et al. is the best public quantitative anchor we found for this category. The strongest scale-ready
interventions in that paper are community- or school-based prevention programs in low- and middle-income countries,
with the strongest reported figure at about **\$222 per DALY averted**.

Ferrari et al. explicitly notes that the DALY analysis uses a **1-year horizon**, includes only a **subset of health
consequences**, assumes **no mortality impact**, and separately reports broader social and economic effects in impact
inventories. So the measured DALYs should not be treated as the full welfare effect. The dedicated assumption page
uses a central conversion of about **2.5 QALY-equivalent welfare gains per measured DALY averted** once those omitted
harms are brought back into the model. ([Ferrari et al. 2022](https://journals.plos.org/plosmedicine/article?id=10.1371%2Fjournal.pmed.1003827), [See detailed justification](/assumption/human-rights-welfare-conversion))

For a category page, simply copying the best trial result into the headline number would probably overstate the likely
value of a marginal donor dollar. A donor today is not buying the average dollar inside a tightly studied RCT. To
adjust for transportability, scaling, and publication-bias risk, we multiply the stronger VAWG figures by about **3x**.

Using the strongest research-setting result:

$$
\$222 \times \frac{3}{2.5} \approx \$266
$$

So a reasonable category-level central figure for top-tier VAWG prevention is about **\$266/QALY-equivalent**.

As an external validity check, this is directionally consistent with the broader VAWG evidence base. For example,
SASA!, a well-known community mobilisation intervention in Kampala, reduced continuation and onset of multiple forms of
abuse in a cluster randomised trial, supporting the idea that this class of intervention can produce real and durable
changes rather than being driven only by one-off measurement noise. ([Abramsky et al. 2016](https://pubmed.ncbi.nlm.nih.gov/26873948/))
:::

**Approach 2 — bonded labour and trafficking: about \$500/QALY-equivalent.** Freedom Fund's India hotspots imply roughly
\$126 per person freed from bondage; at about 1.0 QALY-equivalent per person (Assumption 5) that is \$126/QALY-equivalent,
and a 4x marginal discount (Assumption 6) for attribution, substitution, and durability gives $$\$126 \times 4 = \$504$$
per QALY-equivalent.

:::details{title="Anti-bonded-labour derivation"}
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
:::

**Combined: about \$310/QALY.** Modeling the category as roughly **70% VAWG prevention** at **\$266/QALY** and **30%
anti-slavery work** at **\$504/QALY** (Assumption 7) gives:

$$
\text{QALYs per } \$1 = \frac{0.7}{266} + \frac{0.3}{504} \approx 0.00322
$$

$$
\text{Cost per QALY} \approx \frac{1}{0.00322} \approx \$310
$$

**Range: \$130–\$1,500/QALY.** Four parameters drive the spread: the VAWG welfare uplift (Assumption 2), the VAWG
external-validity markup (Assumption 3), the bonded-labour welfare gain per person (Assumption 5), and the anti-slavery
marginal discount (Assumption 6). The interval is wider than a sweep of any single one because these four move together
under an optimistic or pessimistic reading of how much real welfare these interventions deliver, and the high end is
stretched further to absorb structural uncertainty the four parameters do not capture — chiefly that the anti-slavery
hotspot evidence is not randomised and that a real portfolio may lean toward weaker direct-welfare rights work than the
category is trying to model.

:::details{title="From the all-extremes bound to the published range"}
Pushing all four parameters to their favorable extremes together (Assumption 2 at 4, Assumption 3 at 1.5x, Assumption 5
at 2.0, Assumption 6 at 2x) gives about **\$93/QALY**; pushing all four to their unfavorable extremes (1, 5x, 0.4, 8x)
gives about **\$1,300/QALY**. That \$93–\$1,300 corner is an illustrative all-extremes sweep, not the published range:
it assumes every conversion and discount parameter moves to the same edge at once. A narrower combination would be
appropriate if the parameters were independent, but they are not: the same worldview that reads the welfare uplift as
large also tends to read the marginal discounts as small.

The published \$130–\$1,500 sits near that sweep but adds extra headroom on the high side for the non-randomised
anti-slavery evidence and possible scope drift toward weaker direct-welfare work. The
portfolio split (Assumption 7) is left out of the sweep because it has little leverage: moving it from 50/50 to 90/10
shifts the central figure only between about \$350 and \$280.
:::

### Start time

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

## Key uncertainties

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

_The following analysis was done on April 14th 2026 by GPT-5.4, with prompts from Impact List staff._

- The biggest modeling choices are now: the **VAWG welfare uplift**, the **bonded-labour QALY-equivalent loss**, and
  the **70/30 portfolio split**.
- If stronger public evidence appears on high-leverage legal empowerment or criminal-justice reform per dollar, this
  page may eventually justify a broader scope. Right now the direct-welfare rights interventions still provide the
  clearest anchor.
