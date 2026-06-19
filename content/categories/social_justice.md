---
id: social-justice
name: 'Social Justice'
effects:
  - effectId: standard
    startTime: 2
    windowLength: 10
    costPerQALY: 100_000
---

# Justification of cost per life

{{STANDARD_QALY_METHOD_NOTE}}

## Description of effect

We estimate **\$100,000/QALY** for broad social-justice philanthropy in rich democracies. This is a modest positive estimate with a real chance of net harm.

The category is weaker than direct reform work because much of what is called "social justice" is indirect: DEI training, cultural or narrative work, identity-based organizing, corporate pressure, and expressive activism. Some of this can improve institutions, reduce stigma, build leadership, or create the conditions for later policy wins. Some of it mainly expresses values, and some of it can create resentment or harden political opposition.

We do not use historic civil-rights victories to anchor this estimate. Direct work to secure basic legal rights, protect people from state abuse, or stop severe rights violations fits better under [Human Rights and Justice](/cause/human-rights), or under a recipient-specific override. Social Justice is the broader contemporary portfolio.

## What kinds of charities are we modeling?

These estimates cover the **broad contemporary social-justice ecosystem** in rich democracies: racial, gender, economic, and identity-based advocacy; DEI and inclusion work; workplace and corporate equity campaigns; movement infrastructure; and expressive activism with little direct policy or institutional effect.

They are not estimates for the strongest imaginable social-justice grant. They are also not estimates for direct civil-rights or human-rights work, which should usually be tagged elsewhere or modeled separately.

:::details{title="What is and isn't included"}
Included:

- DEI trainings, inclusion programs, and workplace-equity efforts
- racial-justice, gender-justice, economic-justice, and identity-based organizing
- broad movement infrastructure, regranting, narrative work, and leadership pipelines
- corporate pressure and institutional-equity campaigns
- expressive activism and culture-war-adjacent work, including work with little plausible direct effect
- some criminal-justice and access-to-rights reform when it is framed as broad institutional or equity work rather than direct protection from severe rights violations

Not included:

- direct anti-trafficking, anti-bonded-labour, violence-prevention, or rights-protection work better captured by [Human Rights and Justice](/cause/human-rights)
- direct civil-rights or civil-liberties litigation that should get a recipient-specific estimate rather than inherit this broad category default
- direct service programs better captured under [Health / Medicine](/cause/health-medicine), [Human Rights and Justice](/cause/human-rights), [Local Community](/cause/local-community), or [Housing](/cause/housing)
:::

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$100,000 (\$45,000/QALY to net harmful; about a 10% chance of net harm)
- **Start time:** 2 years
- **Duration:** 10 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. **Concrete institutional reform** is about **\$55,000/QALY**, with a plausible range from **\$20,000-\$200,000/QALY**. This bucket covers work such as criminal-justice reform and access-to-rights projects when they have a plausible path to changing actual institutional behavior. It excludes direct civil-rights litigation and severe-rights-violation work that should be modeled under [Human Rights and Justice](/cause/human-rights) or with a recipient-specific estimate.
2. **Movement and narrative work** is about **\$400,000/QALY**, with a plausible range from **\$100,000/QALY** to net harmful. This bucket includes racial-justice, gender-justice, economic-justice, and identity-based organizing; leadership pipelines; regranting; convening; communications; and culture-change work. Some of this helps create later reforms. Much of it is hard to attribute, and some of it increases polarization.
3. **DEI and workplace-equity work** is about **\$2 million/QALY**, with a plausible range from **\$400,000/QALY** to net harmful. Generic diversity training often changes awareness or attitudes more than durable behavior, though better-designed interventions can change hiring or management outcomes. ([Chang et al. 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6475398/), [Arslan et al. 2025](https://pubmed.ncbi.nlm.nih.gov/39847634/), [EHRC 2018](https://www.equalityhumanrights.com/en/publication-download/unconscious-bias-training-assessment))
4. **Expressive and culture-war-adjacent activism** is modeled as very weakly positive in the central case: about **one positive QALY per \$5 million spent**, with a plausible range from **one positive QALY per \$1 million spent** to **one negative QALY per \$500,000 spent**. This bucket includes work whose main effect is symbolic alignment, public pressure, public denunciation, identity-based mobilization, community-building, or stigma reduction, with little direct path to policy or institutional change.
5. The central dollar mix is **50% concrete institutional reform**, **35% movement and narrative work**, **10% DEI/workplace-equity work**, and **5% expressive activism**. Plausible mixes are roughly **30%-65% concrete reform**, **20%-50% movement/narrative work**, **5%-20% DEI/workplace-equity work**, and **0%-15% expressive activism**. This is a judgment about the current donation-weighted recipient universe. The largest tagged dollars are broad foundations and regrantors, not clean single-issue reform campaigns, but those broad vehicles plausibly put a large share of their social-justice dollars into concrete reform.
6. Benefits usually begin in about **2 years**. Advocacy, movement-building, workplace reform, and institutional reform usually need time before they change day-to-day welfare.
7. The category duration is **10 years**. Some institutional wins last longer, but narrative, workplace, and movement effects can fade, mutate, or be reversed.

## Details

### Cost per QALY

We model this as a four-bucket portfolio.

The central blend is:

- **50%** concrete institutional reform at **\$55,000/QALY**
- **35%** movement and narrative work at **\$400,000/QALY**
- **10%** DEI and workplace-equity work at **\$2 million/QALY**
- **5%** expressive activism at **one positive QALY per \$5 million spent**

That gives about **\$100,000/QALY**.

:::details{title="Four-bucket blend, worked out"}
The formula is:

$$
\text{Cost per QALY} = \dfrac{1}{\frac{i}{I} + \frac{m}{M} + \frac{d}{D} + \frac{e}{E}}
$$

Where:

- $i$ = share of dollars going to concrete institutional reform
- $I$ = cost per QALY for concrete institutional reform
- $m$ = share of dollars going to movement and narrative work
- $M$ = cost per QALY for movement and narrative work
- $d$ = share of dollars going to DEI and workplace-equity work
- $D$ = cost per QALY for DEI and workplace-equity work
- $e$ = share of dollars going to expressive activism
- $E$ = cost per QALY for expressive activism

Using the central assumptions:

$$
\text{QALYs per dollar} =
\frac{0.50}{55{,}000}
+ \frac{0.35}{400{,}000}
+ \frac{0.10}{2{,}000{,}000}
+ \frac{0.05}{5{,}000{,}000}
$$

$$
\text{QALYs per dollar} \approx 0.00001003
$$

$$
\text{Cost per QALY} \approx \dfrac{1}{0.00001003} \approx 99{,}700
$$

Rounded, that is **\$100,000/QALY**.
:::

The **50%** concrete-reform share is not a simple count of recipients. A donation-weighted scan of the current dataset puts most social-justice-tagged dollars in broad vehicles such as Yield Giving, Open Society Foundations, Pivotal Philanthropies, NoVo Foundation, Freedom Together, Arnold Ventures, Sherwood Foundation, and Schusterman Family Philanthropies. Some of that money plausibly reaches concrete reform. A lot of it is broader movement, narrative, gender-equity, racial-justice, or regranting work. That supports making concrete reform the largest bucket, but not letting it dominate the whole estimate.

The **\$55,000/QALY** concrete-reform bucket is still much weaker than [Improving Institutions](/cause/institutions). That is intentional. Institutions is anchored on unusually high-upside administrative, housing, and state-capacity bottlenecks. Concrete social-justice reform is often more crowded, more contested, and more likely to provoke backlash. But it should not be pushed up to the broad category average: if a grant really changes criminal-justice or access-to-rights policy, it has a shorter path to welfare than narrative work or generic DEI.

The headline is mostly a judgment about **concrete reform cost-effectiveness and share**. In the central model, concrete reform supplies about **91%** of the QALYs per dollar, movement and narrative work about **9%**, and DEI plus expressive activism less than **1%**. The latter buckets still matter: they explain why the broad default is worse than a pure concrete-reform recipient, and they drive much of the downside tail.

### Why the estimate is much weaker than direct rights work

The category should not inherit the value of historic civil-rights wins. Those wins can be enormously valuable, but they are not a good default model for contemporary social-justice giving as this category is used.

A dollar to a concrete criminal-justice or access-to-rights reform project is different from a dollar to a broad regrantor, a communications campaign, a DEI program, a leadership fellowship, or a protest-oriented organization. The latter work can matter, but the path is longer. It often runs through public opinion, institutional incentives, reputational pressure, and later political action. That makes attribution weak and backlash more important.

This is why the concrete reform bucket is **50%** of the central mix, while movement and narrative work still accounts for **35%**. The **\$100,000/QALY** default is a broad all-recipient average, not a residual after removing concrete reform.

### Backlash and polarization

Backlash is not a side note. It is one of the main cruxes.

The evidence cuts both ways. Wasow's civil-rights-protest evidence suggests nonviolent protest can increase attention to rights and move opinion in a favorable direction, while protester-initiated violence can shift attention toward order and repression. Reny and Newman find that the 2020 George Floyd protests moved liberals and low-prejudice Americans against police and toward seeing anti-Black discrimination, but did little durably among conservatives. That is not a simple "activism works" result. It is also a polarization result. ([Wasow 2020](https://doi.org/10.1017/S000305542000009X), [Reny & Newman 2021](https://doi.org/10.1017/S0003055421000460))

We handle this in three places:

- movement and narrative work has a wide range that runs to net harm
- DEI/workplace work has a wide range that runs to net harm
- expressive activism is weakly positive in the central model but has a serious net-harm tail

### Range

The plausible range is **\$45,000/QALY to net harmful**. We put about **10%** probability on the category being net negative, so the bad end of the 80% interval reaches the sign-flip tail rather than a finite positive cost-per-QALY number.

The good end is a world where the marginal dollar mostly funds concrete institutional reform, the movement work helps build durable wins, and DEI efforts change real behavior rather than just language or compliance rituals. That can land around **\$45,000-\$60,000/QALY**.

The bad end is not just "expensive but positive." If the marginal dollar mostly funds expressive activism, generic DEI, or polarizing narrative work, and if that work hardens opposition more than it changes institutions, the net effect can be negative. Conditional on staying positive, weak cases can easily land around **\$500,000-\$700,000/QALY**.

:::details{title="Range checks, not the full range"}
**Better case**

- concrete institutional reform: **\$30,000/QALY**
- movement and narrative work: **\$150,000/QALY**
- DEI/workplace-equity work: **\$500,000/QALY**
- expressive activism: **\$3 million/QALY** positive
- mix: **60% / 30% / 7% / 3%**

$$
\dfrac{1}{0.60/30{,}000 + 0.30/150{,}000 + 0.07/500{,}000 + 0.03/3{,}000{,}000} \approx 45{,}000
$$

**Weak but still positive case**

- concrete institutional reform: **\$180,000/QALY**
- movement and narrative work: **\$1.5 million/QALY**
- DEI/workplace-equity work: **one negative QALY per \$1.5 million spent**
- expressive activism: **one negative QALY per \$3 million spent**
- mix: **30% / 45% / 15% / 10%**

$$
\dfrac{1}{0.30/180{,}000 + 0.45/1{,}500{,}000 - 0.15/1{,}500{,}000 - 0.10/3{,}000{,}000} \approx 545{,}000
$$

If the concrete reform bucket is smaller or weaker than this, or if the DEI and expressive buckets are more harmful, the denominator crosses below zero and the category becomes net harmful.
:::

### Start time

We use a **2-year** start time because most work in this category is not direct service. Advocacy, institutional reform, workplace change, and movement-building usually need time before they change lived experience.

### Duration

We use a **10-year** duration. Some institutional reforms last longer. Some workplace, narrative, or movement effects fade within a few years. Some gains provoke counter-mobilization and are partly reversed. Ten years is a portfolio average, not the lifespan of any one reform.

## Key uncertainties

1. **Whether the marginal dollar funds concrete reform or expressive work.** This is the biggest crux. Concrete institutional reform can plausibly do good. Expressive activism can be weakly positive, close to zero, or harmful.

2. **Whether Social Justice is being used too broadly.** Some recipients tagged here may belong under [Human Rights and Justice](/cause/human-rights), [Civic and Policy Advocacy](/cause/civic-policy-advocacy), [Institutions](/cause/institutions), or [Local Community](/cause/local-community). If many recipients move out of the category, the Social Justice mix should be revisited.

3. **Backlash and polarization.** Some work shifts norms and protects vulnerable people. Some work hardens opposition, fuels resentment, or makes future policy worse.

4. **Additionality.** In high-salience social conflicts, other donors, parties, courts, media, and social trends matter a lot. Many grants help without being pivotal.

5. **DEI and workplace reform.** The best behaviorally designed interventions may be useful, but generic trainings and symbolic corporate campaigns look weak.

6. **Whether this category should be split.** `social-justice` may be too broad. Separate categories for civil rights, criminal-justice reform, racial justice, workplace inclusion, and expressive activism would probably produce cleaner estimates.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- June 2026 revision: broadened the Social Justice scope to include DEI, expressive activism, culture-war-adjacent work, and diffuse movement/narrative work. Direct civil-rights and human-rights work should usually be modeled elsewhere or with recipient-specific estimates.
- The estimate is deliberately not anchored on historic civil-rights wins. Those wins can be highly valuable, but letting them dominate this category would misrepresent how many current `social-justice` allocations are used in the dataset.
- Future improvement: split `social-justice` into narrower categories. Criminal-justice reform, racial-justice organizing, workplace inclusion, expressive activism, and direct civil-rights work probably should not share one category-level estimate forever.
