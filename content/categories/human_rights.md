---
id: human-rights
name: 'Human Rights and Justice'
effects:
  - effectId: standard
    startTime: 2
    windowLength: 25
    costPerQALY: 600
---

# Justification of cost per life

_The following analysis was done on November 12th 2025. It was written by GPT 5 Pro and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **$600 per QALY**  
**Plausible range (central 80%):** **$200 – $2,000 per QALY**

#### What is included in “Human Rights and Justice”?

For this cause area, we focus on charities that protect people from severe, widely-recognised rights violations where there is broad political support across mainstream viewpoints (for example, both major US parties would generally endorse the basic goals). Typical examples include:

- Preventing violence against women and girls (VAWG), especially in low- and middle-income countries
- Reducing modern slavery, trafficking, and bonded labour
- Strengthening the rule of law: access to fair trials, legal identity, and protection from arbitrary detention, torture or police abuse
- Evidence-based criminal justice reforms that reduce clearly excessive or wrongful incarceration while maintaining public safety

This category **does not** include more ideologically contentious projects (for example, sweeping changes to sentencing norms where support is strongly partisan); those are better grouped under a separate “Social Justice” heading.

### Why the cost per QALY is in the hundreds of dollars, not the tens of thousands

Human rights and justice interventions are often seen as “moral imperatives” rather than “health programmes”, so cost-effectiveness is less commonly quantified. However, several strands of evidence allow us to anchor a numerical estimate:

1. **Prevention of violence against women and girls (VAWG)**
2. **Ending modern slavery and bonded labour**
3. **Criminal justice and due process reforms**

Taken together, they suggest that **the best human-rights-focused charities can plausibly achieve impact in the same broad order of magnitude as good climate or environmental charities, but are usually less cost-effective than the very best global health charities.**

### 1. Violence against women and girls (VAWG)

An in-depth Effective Altruism Forum analysis of VAWG interventions reviewed randomised and quasi-randomised studies of prevention programmes such as **SASA!**, **Unite for a Better Life**, self-defence programmes like **No Means No Worldwide** and **Ujamaa**, and radio drama campaigns. It then built explicit cost-effectiveness models for several intervention types.  
[“What you can do to help stop violence against women and girls”, EA Forum, 2023](https://forum.effectivealtruism.org/posts/uH9akQzJkzpBD5Duw/what-you-can-do-to-help-stop-violence-against-women-and)

That work estimates (all numbers approximate, in USD):

- **Community activist social-empowerment programmes (e.g. SASA!)**

  - Cost ≈ **$180 per DALY averted**, or about **$150 for a woman to live a year free from violence**

- **Adding social empowerment to women’s economic programmes**

  - Cost ≈ **$180 per DALY**, or **$145 per woman-year free from violence**

- **Self-defence programmes (IMPower model)**

  - Cost ≈ **$260 per DALY**, or **$215 per woman-year free from violence**

- **Drama-style radio mass-media campaigns** (more speculative)
  - Under conservative assumptions, cost ≈ **$13 per DALY**, or **$11 per woman-year free from violence**

The same author’s earlier cause-area report on VAWG notes that preventing such violence appears **moderately to highly cost-effective** on health metrics and is substantially neglected relative to the scale of the problem.  
[“New cause area: Violence against women and girls”, EA Forum (2022)](https://forum.effectivealtruism.org/posts/majcwf7i8pW8eMJ3v/new-cause-area-violence-against-women-and-girls)

For context, GiveWell’s current top global health charities are estimated to save a life for roughly **$5,000**, which implies a cost per healthy life-year in the low hundreds of dollars.  
[Our World in Data summary of GiveWell’s estimates (2024)](https://ourworldindata.org/cost-effectiveness)

So purely on a _DALY_ basis, VAWG prevention can be in the same broad ballpark as very strong global health interventions.

#### Converting VAWG DALYs into QALYs

The EA Forum models above are expressed in DALYs. DALYs mostly capture _health_ impacts: physical injury, depression, anxiety, PTSD, HIV risk, and so on. But violence also directly affects:

- Freedom of movement and association
- Sense of safety at home and in public
- Ability to work, study, or maintain relationships
- Overall life satisfaction

These are exactly the kinds of “quality of life” elements that QALYs are designed to measure.

A simple, transparent assumption is:

- **DALYs capture about two-thirds of the total QALY impact**, and
- The remaining **one-third comes from non-health aspects** like autonomy, safety, and social functioning.

Under that assumption:

- **QALYs gained ≈ 1.5 × DALYs averted**
- **Cost per QALY ≈ cost per DALY ÷ 1.5**

Applying this to the estimates above:

- Community activist programmes:
  - $180 per DALY → about **$120 per QALY** (180 ÷ 1.5)
- Self-defence programmes:
  - $260 per DALY → about **$170 per QALY** (260 ÷ 1.5)
- Radio drama campaigns:
  - $13 per DALY → about **$9 per QALY** (13 ÷ 1.5), but with weaker evidence

These are _theoretical_ best-case figures from carefully implemented programmes and optimistic reading of the evidence. To be more cautious we can:

- **Double** these costs to allow for publication bias, weaker real-world implementation, and uncertainty in the DALY→QALY adjustment.

That gives **$200–$400 per QALY** as a reasonable working range for the most solidly-evidenced VAWG prevention charities.

This is the first major pillar of the Human Rights & Justice cause area.

### 2. Ending modern slavery and bonded labour

Modern slavery, including bonded labour, is another central human rights concern. The **Freedom Fund** has implemented a “hotspot” model in India, funding about 40 local NGOs to reduce bonded labour in roughly 1,100 villages.

An external summary of Freedom Fund’s India programmes reports that between 2015 and 2018:

- The share of households in bonded labour in the target villages fell from **56% to 11%**,
- This corresponded to about **125,000 fewer people in bondage**,
- Total spending across the two hotspots was about **$15.8 million**, implying roughly **$126 per person** no longer in bonded labour (15.8m ÷ 125k).

Freedom Fund’s own evidence-in-practice paper describes the same reductions and investment.  
Freedom Fund, [“Unlocking what works: How community-based interventions are ending bonded labour in India” (2019, PDF)](https://cdn.freedomfund.org/app/uploads/2024/03/Freedom-Fund-Evidence-in-Practice-Paper-Unlocking-what-works.pdf)

An effective-altruism-oriented cause report on human trafficking draws the same conclusion, while stressing the methodological limitations: there were no randomised control groups, and long-term sustainability is uncertain.  
[“Human Trafficking – Full Report”, Christians for Impact (2025)](https://www.christiansforimpact.org/full-reports/human-trafficking)

#### From people freed to QALYs

To translate these results into QALYs, we need to estimate:

1. **How bad is life in bonded labour?**
2. **How long do benefits last for someone who exits bondage?**

A cautious assumption is:

- Average loss of **0.5 DALYs per year** in bondage (similar to, or worse than, many severe chronic diseases), based on earlier exploratory estimates in the EA community that place slavery-like conditions in the **0.3–0.7 disability weight** range.
- Non-health harms to dignity and autonomy increase this to **about 0.65 QALYs lost per year** in bondage.
- A typical person freed avoids **2–4 extra years** of bondage, on average, before either re-entering exploitative labour or reaching roughly “normal” working conditions.

Under these assumptions:

- Each person freed gains **1.3–2.6 QALYs** (0.65 × 2 to 0.65 × 4).
- At **$126 per person**, the naive cost per QALY would be about **$50–$100 per QALY**.

However, given the lack of randomised controls, potential over-attribution of effects, and uncertainty about long-run sustainability, it is prudent to **inflate these costs by a factor of 3–4** to represent uncertainty.

That yields a more conservative central estimate of around **$300–$400 per QALY** for the most promising anti-slavery work, with a plausible wider range from **roughly $150 up to $800 per QALY**.

### 3. Criminal justice and due process reforms

The third pillar of this cause area is work that:

- Prevents unjust or unnecessary incarceration,
- Improves conditions and safety for people in detention, and
- Increases access to basic due process (e.g. legal representation, appeals against wrongful conviction).

The **Open Philanthropy** criminal justice reform strategy provides a clear anchor for how one major EA-aligned funder values reductions in incarceration. It explicitly says that each grant is evaluated using:

> Number of years averted × **$50,000** for prison or **$100,000** for jail [their valuation of a year of incarceration averted] ÷ **100** [their target 100× “return on investment”]  
> … minus various uncertainty discounts
>
> — Open Philanthropy, [“Criminal Justice Reform Strategy” (2019)](https://www.openphilanthropy.org/research/criminal-justice-reform-strategy/)

This implies a **funding bar of about $500–$1,000 per year of incarceration avoided** if the grant is to be competitive with Open Philanthropy’s other near-termist human-centric giving.

An independent EA Forum “red-team” review summarises this as:

- Open Philanthropy’s lower bound values are **$500–$1,000 per prison/jail year averted**,
- But realised cost-effectiveness for many grants likely falls below these optimistic back-of-the-envelope calculations.

[A Critical Review of Open Philanthropy’s Bet on Criminal Justice Reform, EA Forum (2022)](https://forum.effectivealtruism.org/posts/h2N9qEbvQ6RHABcae/a-critical-review-of-open-philanthropy-s-bet-on-criminal)

#### How many QALYs is a year in prison worth?

We can connect this to QALYs using evidence on the health and wellbeing of incarcerated people:

- A large PLOS One study of prisoners in Ethiopia using WHO’s quality-of-life instrument finds very poor scores across physical, psychological, social, and environmental domains; the mean composite score is just over 53/100.  
  Seifu et al., [“Health-related quality of life and associated factors among prisoners in Gondar city prison” (2023)](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0290626)

- Systematic reviews find that prisoners have **far higher rates of mental illness, infectious disease and chronic conditions** than the general population, and substantially worse overall health.  
  Example summary: [University of Oxford news release on prisoner health (2024)](https://www.psych.ox.ac.uk/news/people-in-prison-have-higher-rates-of-mental-illness-infectious-diseases-and-poor-physical-health-2013-new-study)

Health instruments only capture part of the burden; they typically under-weight:

- Loss of liberty and autonomy
- Separation from family and community
- Exposure to violence and degrading treatment
- Long-term stigma after release

Putting these together, a reasonable simplifying assumption is that **one year in prison reduces quality of life by about 0.3–0.7 QALYs**, with a central estimate of **0.5 QALYs lost per year** relative to living freely in the community.

If we then combine this with Open Philanthropy’s funding bar:

- **$500–$1,000 per year of incarceration avoided**,
- **0.5 QALYs gained per year of incarceration avoided**,

we get an implied cost per QALY of roughly **$1,000–$2,000 per QALY** for the _best_ criminal-justice-oriented interventions that meet this bar.

Given the critical review’s scepticism and the challenge of securing durable policy reforms, it is reasonable to widen this into a **broader range of about $1,000–$4,000 per QALY** for this slice of the Human Rights & Justice portfolio.

Note that to keep this category in line with broad bipartisan support, we focus on relatively uncontroversial reforms:

- Improving access to legal counsel and appeal in clear wrongful-conviction cases
- Reducing abuse and violence in detention
- Improving conditions in pre-trial detention (e.g. overcrowding, basic healthcare)

rather than polarising changes to sentencing norms or policing strategy.

### Aggregating across the Human Rights & Justice cause area

Across all three pillars:

- **VAWG prevention and modern slavery programmes**

  - Best-supported cost-effectiveness: roughly **$150–$400 per QALY** after adjusting DALY-based models upward to capture autonomy and dignity, and downward for implementation risk.
  - Sources: EA Forum analyses on VAWG, Freedom Fund evaluations, and Christians for Impact’s review of trafficking interventions.
    - [EA Forum, “What you can do to help stop violence against women and girls” (2023)](https://forum.effectivealtruism.org/posts/uH9akQzJkzpBD5Duw/what-you-can-do-to-help-stop-violence-against-women-and)
    - [Freedom Fund, “Unlocking what works” (2019)](https://cdn.freedomfund.org/app/uploads/2024/03/Freedom-Fund-Evidence-in-Practice-Paper-Unlocking-what-works.pdf)
    - [Christians for Impact, “Human Trafficking – Full Report” (2025)](https://www.christiansforimpact.org/full-reports/human-trafficking)

- **Criminal-justice and due-process work**
  - Best opportunities appear closer to **$1,000–$4,000 per QALY**, based on Open Philanthropy’s valuations of incarceration and external critiques of realised cost-effectiveness.
  - Sources: Open Philanthropy’s criminal justice strategy and EA Forum critical review.
    - [Open Philanthropy, “Criminal Justice Reform Strategy” (2019)](https://www.openphilanthropy.org/research/criminal-justice-reform-strategy/)
    - [EA Forum, “A Critical Review of Open Philanthropy’s Bet On Criminal Justice Reform” (2022)](https://forum.effectivealtruism.org/posts/h2N9qEbvQ6RHABcae/a-critical-review-of-open-philanthropy-s-bet-on-criminal)

A donor who aims to “buy” the **most QALYs per dollar within this cause area** would likely:

- Put most funding into **highly-evidenced VAWG prevention** and **anti-slavery** charities, and
- Allocate a smaller portion to particularly leveraged justice reforms (for example, fixing severe due-process failures).

A simple mental model is:

- Around **60–70%** of impact comes from the **VAWG + anti-slavery** cluster (typical **$150–$400 per QALY**), and
- Around **30–40%** comes from **justice and legal-system** interventions (typical **$1,000–$4,000 per QALY**).

Under those weights, a blended cost per QALY naturally lands in the **low hundreds of dollars**, but well above the cheapest global health interventions.

This is consistent with:

- A **point estimate of about $600 per QALY**
- A central plausible range of **$200–$2,000 per QALY**, capturing both upside (e.g. unusually scalable radio campaigns or especially impactful anti-slavery work) and downside (e.g. justice reforms that are less tractable than expected).

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes

**Typical timing of benefits**

- **Start time (when benefits begin):** ~**3 years** after the donation
  - Plausible range: **1–8 years**
- **Duration of benefits:** ~**10 years** after they begin
  - Plausible range: **4–25 years**

### Start time and duration of benefits

**Start time (benefits begin ~3 years after donation)**

Human Rights & Justice charities combine direct service delivery and slower-moving institutional change:

- Community-based VAWG prevention programmes, self-defence courses, and local legal aid typically start reaching beneficiaries **within 6–24 months** of funding, as documented in multiple VAWG programme evaluations and Freedom Fund’s India hotspot reports.

  - [EA Forum VAWG analysis (2023)](https://forum.effectivealtruism.org/posts/uH9akQzJkzpBD5Duw/what-you-can-do-to-help-stop-violence-against-women-and)
  - [Freedom Fund India evaluation (2019)](https://cdn.freedomfund.org/app/uploads/2024/03/Freedom-Fund-Evidence-in-Practice-Paper-Unlocking-what-works.pdf)

- System-level work (for example, improving bonded-labour enforcement or reforming justice procedures) often requires **several years** for legislation, training, and institutional change before tangible benefits for ordinary people appear.

Balancing these, a **central estimate of 3 years from donation to meaningful impact** is a reasonable average.

**Duration of benefits (~10 years)**

The duration of benefits varies by mechanism:

- **VAWG prevention**

  - RCTs of programmes such as SASA! and similar community-activist models often track outcomes for a few years after programme completion and find persistent reductions in violence, though effects are likely to decay over time. A conservative assumption is **3–10 years** of materially lower risk of violence for the average woman reached.

- **Exiting bonded labour or slavery**

  - Leaving bondage can alter someone’s entire life trajectory, but some people may relapse or face new exploitative conditions. Given this, it is reasonable to model an _average_ of **5–15 years** of substantially improved life circumstances across all beneficiaries.

- **Justice and legal-system reforms**
  - Changes in procedure (e.g. access to counsel, bail rules) and institutional practice can remain in place for many years before being superseded or rolled back. It is plausible that reforms will have meaningful effects for **a decade or more**, especially in jurisdictions where they become institutionalised.

Taking these together, a **central duration estimate of 10 years** (with a plausible range from **4 to 25 years**) reasonably reflects:

- Some shorter-lived behaviour changes,
- Some longer-lasting shifts in life circumstances (e.g. freedom from slavery), and
- Structural reforms that may affect many cohorts of people over time.
