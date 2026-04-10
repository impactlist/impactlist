---
id: social-justice
name: 'Social Justice'
effects:
  - effectId: standard
    startTime: 2
    windowLength: 15
    costPerQALY: 20_000
---

# Justification of cost per life

_The following analysis was done on April 10th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from **domestic social-justice philanthropy in rich democracies**, especially:

- civil-rights and reproductive-rights policy advocacy and litigation
- broader movement infrastructure and leadership pipelines for historically marginalized groups
- some corporate and workplace reform aimed at reducing discrimination and exclusion

This is a messy, upstream category. The strongest opportunities here can be genuinely valuable because a successful rights expansion can improve the lives of many people at once for years. But a large share of real-world "social justice" philanthropy is several steps removed from outcomes, and some common activities, especially generic workplace DEI programming, have weak durable evidence. So the right model is **not** "the best measured civil-rights win," but a portfolio average across the kinds of social-justice work that strong charities in this category actually fund.

## Point Estimates

- **Cost per QALY:** \$20,000 (\$8,000–\$200,000)
- **Start time:** 2 years
- **Duration:** 15 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. A serious state-level social-justice campaign or litigation push can easily absorb **low- to mid-eight figures**. Human Rights Campaign Foundation reported about **\$28.6 million** of revenue for the fiscal year ending March 2025, the related 501(c)(4) Human Rights Campaign Inc. reported about **\$50.1 million** in the same filing year, Planned Parenthood Action Fund reported about **\$40.5 million** in 2024, and the Center for Reproductive Rights reported about **\$65.4 million** in 2024. Ballot-measure and rights-defense campaigns also commonly raise or spend amounts in the **high seven to low eight figures**. So modeling one substantial push as roughly **\$15 million** is reasonable. ([Human Rights Campaign Foundation via ProPublica](https://projects.propublica.org/nonprofits/organizations/521481896), [Human Rights Campaign Inc. via ProPublica](https://projects.propublica.org/nonprofits/organizations/521243457), [Planned Parenthood Action Fund via ProPublica](https://projects.propublica.org/nonprofits/organizations/133539048), [Center for Reproductive Rights via ProPublica](https://projects.propublica.org/nonprofits/organizations/133669731), [HRC 2012 marriage-ballot spending](https://www.hrc.org/press-releases/hrc-commits-additional-1-million-to-state-marriage-ballot-measures))
2. Rights-expanding policy wins can improve welfare through multiple channels, not just mental health. Same-sex marriage legalization was associated with a **0.6 percentage point reduction in suicide attempts among all high-school students** and a **4.0 percentage point reduction among sexual-minority students**. Other evidence finds that same-sex marriage legalization improved the mental health of sexual minorities, increased marriage take-up, improved health insurance and access to care for men in same-sex households, and increased home ownership and relationship investment for same-sex couples. ([Raifman et al. 2017](https://jamanetwork.com/journals/jamapediatrics/fullarticle/2604258), [Chen & van Ours 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9293432/), [Carpenter et al. 2018](https://www.nber.org/papers/w24651), [Hamermesh & Delhommer 2020](https://www.nber.org/papers/w26875))
3. Reproductive-rights losses also have meaningful welfare costs across health, safety, autonomy, and household economics. A state-level study found that restrictive abortion policies were associated with a **5.81% increase in suicide among women ages 20-34**. The Turnaway Study found that abortion denial worsened physical health, increased financial distress, kept some women exposed longer to violent partners, and increased poverty for existing children. ([Zandberg et al. 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC9857811/), [Ralph et al. 2019](https://pubmed.ncbi.nlm.nih.gov/31181576/), [Miller et al. 2020](https://www.nber.org/papers/w26662), [Roberts et al. 2014](https://pmc.ncbi.nlm.nih.gov/articles/PMC4182793/), [Foster et al. 2019](https://pubmed.ncbi.nlm.nih.gov/30389101/))
4. For a meaningful state-level rights win, modeling about **100,000 directly affected people** with an average benefit around **0.01 QALY per person-year** for **8 years** is conservative. This **0.01** figure is meant to capture total welfare-equivalent gains across mental health, economic security, bodily autonomy, family stability, legal protection, and dignity, not just health effects. The **8-year** duration is shorter than the legal lifespan of many successful rights wins and is best read as an attribution window for the most directly campaign-caused benefits rather than as a literal claim that the policy itself lasts only eight years. Many rights wins affect far more people than that, but using 100,000 keeps the model anchored to the subset whose lives are materially changed rather than everyone who experiences only a diffuse expressive benefit.
5. A reasonable central success probability for one serious rights-oriented push is about **30%**. That is lower than the success rate of selectively remembered marquee campaigns and is meant to already reflect the fact that donors usually fund a portfolio of attempts, many of which do not clearly win.
6. A **20% penalty** for backlash, reversals, crowding, and offsetting harms is appropriate even in the stronger rights bucket. Some reforms provoke countermobilization, some legal wins are later narrowed, and some funding is not very additional.
7. Broader movement infrastructure, leadership pipelines, narrative work, and representation-building are probably **several-fold less cost-effective** than direct rights wins, because the causal chain from grant to welfare outcome is longer and noisier. We use **\$120,000/QALY** as a central estimate for this bucket. That figure is mostly a **judgment call**, not something directly identified by the cited papers: the idea is that broad capacity-building should be materially worse than a clean rights win because many grants never cash out in measurable policy change, but still much better than generic symbolic activism because some of this work is exactly what later durable wins are made of. Evidence that representation can matter downstream is one reason not to push this bucket far higher than that. ([Bhalotra et al. 2022 / 2023](https://www.nber.org/papers/w30103), [Chattopadhyay & Duflo 2004](https://gap.hks.harvard.edu/women-policy-makers-evidence-randomized-policy-experiment-india))
8. Corporate and workplace reform is probably weaker still on average. Large reviews find that generic diversity training often improves knowledge or attitudes more than durable behavior, though more targeted behaviorally designed interventions can improve hiring outcomes. We therefore use **\$400,000/QALY** as a central estimate for this bucket rather than treating it as either worthless or highly effective. ([Chang et al. 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6475398/), [Arslan et al. 2025](https://pubmed.ncbi.nlm.nih.gov/39847634/), [EHRC 2018](https://www.equalityhumanrights.com/en/publication-download/unconscious-bias-training-assessment))
9. A reasonable central dollar split for this category is roughly **35% direct rights-expanding policy/litigation**, **50% broader movement infrastructure and leadership work**, and **15% corporate/workplace reform**. This is grounded in the actual recipient universe currently tagged into the category. There are some clear direct-rights fits, such as **No on Proposition 8** and the bucket of **women's-rights organizations**. There are also many broad movement and regranting vehicles, such as **New Venture Fund**, **The Tides Center**, **NoVo Foundation**, **Open Society Foundations**, **Yield Giving**, **Think of Us**, and **Vote Mama Foundation**. By contrast, the explicitly corporate-accountability / workplace-reform slice appears narrower, with **JUST Capital** the clearest example. So the central mix should be somewhat more rights-heavy than before, but still movement-heavy rather than mostly litigation.
10. Benefits usually begin in about **2 years**. Some litigation or direct defense work matters sooner, but major policy, movement, and organizational wins usually take time to translate into materially better lived experience.
11. A **15-year duration** is a reasonable central estimate. Some rights wins last decades, some corporate or cultural gains fade much faster, and some movement wins are partly reversed. Fifteen years is a middle ground between transient program effects and permanent social transformation.

## Details

### Cost per QALY

The cleanest way to model this category is as a three-bucket portfolio:

$$
\text{Cost per QALY} = \dfrac{1}{\frac{r}{R} + \frac{m}{M} + \frac{c}{C}}
$$

Where:

- $r$ = share of dollars going to direct rights-expanding policy and litigation
- $R$ = cost per QALY for that bucket
- $m$ = share of dollars going to movement infrastructure, leadership, and representation work
- $M$ = cost per QALY for that bucket
- $c$ = share of dollars going to corporate and workplace reform
- $C$ = cost per QALY for that bucket

Using the central assumptions:

- $r$ = 0.35
- $R$ = \$7,800
- $m$ = 0.50
- $M$ = \$120,000
- $c$ = 0.15
- $C$ = \$400,000

So:

$$
\text{QALYs per dollar} = \frac{0.35}{7{,}800} + \frac{0.50}{120{,}000} + \frac{0.15}{400{,}000}
$$

$$
\text{QALYs per dollar} \approx 0.0000494
$$

$$
\text{Cost per QALY} \approx \dfrac{1}{0.0000494} \approx 20{,}300
$$

Rounded to one significant digit, that gives a point estimate of **\$20,000/QALY**.

### Why the rights bucket is about \$7,800/QALY

The strongest measurable part of this category is the direct policy and litigation bucket: civil-rights and reproductive-rights wins that clearly change the lived environment of a large group of people.

The simplest central model is:

$$
\text{Expected QALYs} = \text{success probability} \times \text{people helped} \times \text{QALY gain per person-year} \times \text{years} \times \text{net retention}
$$

Using the central assumptions:

- serious push cost = **\$15 million**
- success probability = **30%**
- directly affected people = **100,000**
- annual welfare gain per affected person = **0.01 QALY**
- duration = **8 years**
- net retention after backlash / reversals = **80%**

So:

$$
\text{Expected QALYs} = 0.30 \times 100{,}000 \times 0.01 \times 8 \times 0.80 = 1{,}920
$$

$$
\text{Cost per QALY} = \dfrac{15{,}000{,}000}{1{,}920} \approx 7{,}800
$$

That gives about **\$7,800/QALY**.

This is deliberately conservative in several ways:

- **100,000 materially affected people** is small relative to the population touched by many state-level rights wins.
- **0.01 QALY per person-year** is meant to represent a fairly small all-things-considered welfare gain per year rather than a pure health effect.
- **8 years** is shorter than the real legal lifespan of many successful rights wins and should be read as a campaign-attribution window rather than a claim that the win itself usually disappears after one or two election cycles.
- the model already includes a **20% penalty** for backlash, reversal, and imperfect additionality.

The key point is that the **0.01** figure is not meant to be read as "just the mental-health effect." It is meant to bundle the main welfare channels that a meaningful rights win plausibly changes for the people most directly affected: lower distress and suicide risk, better insurance and household investment, reduced financial distress, greater safety from violent partners, more control over family formation, and the dignitary value of having one's relationships or bodily autonomy legally respected.

At the same time, it avoids the common mistake of assigning large benefits to everyone in a jurisdiction. Most residents of a state may experience only weak expressive effects from a policy win; the model is meant to capture the smaller group whose wellbeing actually moves a lot.

### Why the movement bucket is \$120,000/QALY

This bucket includes organizations that build activist capacity, leadership pipelines, local or identity-based organizing networks, legal-defense ecosystems, and broader movement infrastructure.

Some of this work is essential. It is often what makes later policy wins possible. But it is usually **farther from measured outcomes** than a clean rights campaign:

- many grants fund general operating support, convening, communications, or coalition maintenance
- some capacity-building succeeds only through later policy wins that may or may not happen
- the best downstream outcomes are real but hard to attribute to one donor or one organization

That is why we use a central estimate that is much worse than the direct-rights bucket rather than pretending the two are equally measurable. The exact **\$120,000/QALY** figure is best read as a judgment-based markup for indirectness and attribution risk, not as a number tightly estimated from the cited literature.

### Why the corporate bucket is \$400,000/QALY

This bucket covers workplace-equity initiatives, shareholder and corporate-accountability pressure, inclusion programs, and related corporate-practice reform.

The evidence base here is mixed:

- broad diversity-training literature often finds larger effects on awareness and attitudes than on durable behavior
- some more carefully designed interventions do seem able to change hiring outcomes
- the real-world category includes many lower-leverage projects that are less cleanly designed than the best studies

So this bucket should not be treated as zero. But it also should not be allowed to dominate the category estimate.

### Range

The stated range is a practical sensitivity range, not a formal confidence interval.

**Optimistic case**

- rights bucket: **\$4,000/QALY**
- movement bucket: **\$40,000/QALY**
- corporate bucket: **\$120,000/QALY**
- mix: **45% / 40% / 15%**

This gives:

$$
\dfrac{1}{0.45/4000 + 0.40/40000 + 0.15/120000} \approx 8{,}100
$$

Rounded, that is about **\$8,000/QALY**.

**Pessimistic case**

- rights bucket: **\$60,000/QALY**
- movement bucket: **\$300,000/QALY**
- corporate bucket: **\$1.5 million/QALY**
- mix: **20% / 60% / 20%**

This gives:

$$
\dfrac{1}{0.20/60000 + 0.60/300000 + 0.20/1500000} \approx 183{,}000
$$

Rounded, that gives a practical upper range near **\$200,000/QALY**.

So the practical range is **\$8,000-\$200,000/QALY**.

### Start Time

The **2-year** start time reflects that most important wins in this category are not direct-service interventions. Litigation, legislative advocacy, ballot campaigns, coalition building, and organizational infrastructure all typically need some time before they change people's actual day-to-day lives.

### Duration

The **15-year** duration is a compromise across very different pathways:

- some corporate or training effects fade within a few years
- some legal wins persist until courts or legislatures reverse them
- some norm and movement gains persist much longer than the original campaign

So 15 years is best read as an expected-value average across a mixed portfolio rather than as the literal lifespan of any one reform.

## What Kinds of Charities Are We Modeling?

These estimates are mainly for **strong social-justice charities in rich democracies** that do things like:

- defend or expand civil rights and reproductive rights through litigation, ballot campaigns, or policy advocacy
- build durable movement capacity for women, LGBTQ people, racial minorities, immigrants, or other historically marginalized groups
- push institutions or large employers toward more inclusive practices when there is a credible path to real behavior change

They are **not** estimates for:

- generic culture-war donations
- purely expressive activism with little plausible policy or institutional effect
- average DEI consulting or generic one-off workplace trainings
- direct service programs whose effects are better captured under another category such as [Health / Medicine](/category/health-medicine), [Human Rights and Justice](/category/human-rights), [Political](/category/political), or [Local Community](/category/local-community)

## Key Uncertainties

1. **How much of the category is really in the strong rights bucket.** If the typical marginal dollar is mostly funding ballot and litigation work near the front lines of civil-rights or reproductive-rights defense, the category is better than **\$20,000/QALY**. If it is mostly diffuse movement maintenance or corporate reform, it is worse.

2. **How large the true welfare gain from rights wins is.** Same-sex marriage and abortion-access evidence clearly point in the positive direction, but converting those changes into QALYs still requires judgment.

3. **Backlash and reversibility.** Some wins trigger countermobilization or later legal reversals. Others entrench new norms and institutions. The current estimate partly handles this with explicit haircuts, but uncertainty remains large.

4. **Additionality.** In high-salience social-justice campaigns, other donors and broader political trends matter a lot. A grant can be pivotal, helpful, or mostly substitutive.

5. **How much to count corporate reform.** The best behaviorally designed interventions may be materially stronger than the generic diversity-training literature suggests, but the average real-world opportunity probably is not.

6. **Whether the category should eventually be split.** `social-justice` may be doing too much work right now. Separate categories for `reproductive rights`, `LGBTQ rights`, `racial justice / accountability`, or `representation / movement building` could eventually produce cleaner estimates.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- The biggest conceptual change here is that `social-justice` is now treated as a **mixed upstream portfolio** rather than as a rough \$1M toy model with body cameras and bias training doing most of the work.
- The current estimate is intentionally anchored to the **best publicly measurable substream**: rights-expanding policy and litigation. The broader movement and corporate buckets are included because the recipient mix clearly includes them, but they are heavily marked down.
- The rights bucket now uses an **8-year attribution window** rather than a 4-year duration. Future editors should resist reading that as the literal lifespan of a win; it is meant to reflect attribution rather than legal duration.
- If future editors want to improve this further, the best next step is probably a dedicated assumption page on the **QALY impact of major domestic rights wins**, especially using newer post-Dobbs reproductive-rights evidence.
