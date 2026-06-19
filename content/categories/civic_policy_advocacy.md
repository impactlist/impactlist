---
id: civic-policy-advocacy
name: 'Civic and Policy Advocacy'
effects:
  - effectId: standard
    startTime: 2
    windowLength: 10
    costPerQALY: 25_000
---

# Justification of cost per life

{{STANDARD_QALY_METHOD_NOTE}}

## Description of effect

We estimate **\$25,000/QALY** for tax-deductible civic and policy advocacy. This is not campaign giving. It is for charities that try to improve public policy or civic decision-making without backing candidates, parties, PACs, or campaign committees.

The simple model is that a **\$10 million** portfolio has a small chance of a major policy or civic win, a larger chance of a modest win, and a high chance of little counterfactual effect. That gives about **\$40 million** in expected welfare-equivalent value, or about **400 QALYs** at \$100,000/QALY.

This is a hits-based category. The best grants can be very good because a policy or administrative change can affect many people. Many grants do little because policy processes are crowded, attribution is weak, and public education often fails to change decisions.

## What kinds of charities are we modeling?

This category covers **tax-deductible, nonpartisan civic and policy work**: public education, policy research, legally limited lobbying, litigation, election administration, voting access, transparency, anti-corruption, and nonpartisan voter engagement.

A useful boundary test is: **could this gift normally be treated as a charitable donation if made in the U.S., and is its main path to impact improving policy or civic decision-making rather than helping one side win power?** If not, it should not be in this category.

:::details{title="Included and excluded activities"}
Included:

- nonpartisan policy research, public education, and advocacy with a plausible path to better law or administration
- legally limited lobbying by charities, including some work around legislation or ballot measures
- litigation, transparency, anti-corruption, and government-accountability work
- election administration, voting access, voter education, and nonpartisan voter registration or turnout
- nonpartisan candidate-pipeline or leadership-development work, if the recipient is charitable and does not support candidates or parties

Excluded:

- candidate campaigns, party committees, PACs, super PACs, 527s, inaugural committees, and campaign funds
- partisan voter mobilization or issue work whose practical aim is to help one party or candidate
- ballot-measure campaign committees, unless we are specifically modeling the charitable public-education or limited-lobbying component
- generic political media, commentary, or influencer work
- broad democracy or civic-culture work whose value is better modeled as [Improving Institutions](/cause/institutions)
- identity-based cultural or movement work whose value is better modeled as [Social Justice](/cause/social-justice)
:::

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$25,000 (\$4,000-\$500,000)
- **Start time:** 2 years
- **Duration:** 10 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. The category is limited to work that is compatible with charitable tax treatment. The IRS says 501(c)(3) organizations are eligible to receive tax-deductible contributions, cannot participate in campaigns for or against candidates, and cannot make lobbying a substantial part of their activities. ([IRS 501(c)(3) requirements](https://www.irs.gov/charities-non-profits/charitable-organizations/exemption-requirements-501c3-organizations), [IRS charities and politics](https://www.irs.gov/newsroom/charities-churches-and-politics))
2. Charitable policy work can still include some public-policy activity. The IRS says 501(c)(3) organizations may do some lobbying, that legislation includes referenda and ballot initiatives, and that charities may study or discuss public-policy issues educationally without that being lobbying. ([IRS lobbying guidance](https://www.irs.gov/charities-non-profits/lobbying))
3. A serious philanthropic push in this category costs about **\$10 million** over several years. That is enough to fund a meaningful policy, litigation, voting-access, or civic-administration effort, but not enough to assume control over the policy process.
4. A money-metric value of a QALY in high-income policy settings is approximately **\$100,000**, near the lower end of ICER's current \$100,000-\$150,000 benchmark range. ([ICER 2023 Value Assessment Framework](https://icer.org/wp-content/uploads/2023/10/ICER_2023_2026_VAF_For-Publication_110425.pdf))
5. **Limited-impact scenario:** 70% probability. The work creates about **\$2 million** of welfare-equivalent value. This is the common case: useful public education, a better policy process, or some voter/civic support, but little clear counterfactual change.
6. **Moderate-impact scenario:** 25% probability. The work creates about **\$70 million** of welfare-equivalent value by helping improve a local, state, or national policy process in a way that matters but remains bounded.
7. **Major-win scenario:** 5% probability. The work creates about **\$420 million** of welfare-equivalent value by helping produce a major policy, litigation, voting-access, or administrative win. This is large, but still small relative to many public-policy stakes: one federal budget line can move by billions, and mature public accountability institutions can affect tens of billions in financial benefits. ([KFF FY27 global health budget request](https://www.kff.org/global-health-policy/global-health-funding-in-the-fy-2027-presidents-budget-request/), [GAO FY 2025 financial benefits](https://www.gao.gov/press-release/gao-reports-62.7-billion-financial-benefits-fiscal-year-2025))
8. Nonpartisan civic participation can change behavior, but the effect size is usually modest. A large field-experiment review finds average complier effects around **2.54 percentage points** for door-to-door canvassing and smaller effects for calls and mail, while newer meta-analysis finds effects persist in high-salience elections but are attenuated. That is why civic participation work can matter, but does not by itself drive the estimate. ([Green, McGrath & Aronow 2013](https://cpb-us-e1.wpmucdn.com/sites.northwestern.edu/dist/b/3288/files/2019/10/2013-GMA-Field-Experiments-Turnout.pdf), [Mann & Haenschen 2024](https://research.voteamerica.org/a-meta-analysis-of-voter-mobilization-tactics-by-electoral-salience/))
9. Benefits begin about **2 years** after the donation because research, litigation, public education, and administrative work usually need at least one or two policy cycles before they change outcomes.
10. Benefits last about **10 years** on average. Some advocacy wins fade quickly; some legal, administrative, or civic-process wins last much longer.

## Details

### Cost per QALY

We use a scenario model because the category is hits-based. A \$10 million gift usually has little direct effect, sometimes helps produce a bounded policy or civic win, and occasionally helps unlock a major change.

The central inputs imply about **\$40 million** in expected welfare-equivalent value. At \$100,000 per QALY, that is about **400 QALYs**, so the point estimate is about **\$25,000/QALY**.

:::details{title="The scenario calculation"}
We model the expected welfare value as:

$$
\text{Expected welfare value} = p_L V_L + p_M V_M + p_H V_H
$$

Using the central assumptions:

- $C$ = \$10,000,000
- $p_L = 0.70$ and $V_L$ = \$2,000,000
- $p_M = 0.25$ and $V_M$ = \$70,000,000
- $p_H = 0.05$ and $V_H$ = \$420,000,000
- $v$ = \$100,000/QALY

So:

$$
\text{Expected welfare value} = 0.70 \times 2{,}000{,}000 + 0.25 \times 70{,}000{,}000 + 0.05 \times 420{,}000{,}000 = 39{,}900{,}000
$$

$$
\text{Expected QALYs} = \dfrac{39{,}900{,}000}{100{,}000} = 399
$$

$$
\text{Cost per QALY} = \dfrac{10{,}000{,}000}{399} \approx 25{,}063
$$

We round that to **\$25,000/QALY** because the scenario values are only rough.
:::

### Why this is not an election model

The old-looking intuition behind political giving is "money changes an election, the election changes policy." That is not the category here. A tax-deductible charity cannot back candidates or parties, and direct campaign committees are out of scope.

The model instead asks whether charitable civic and policy work can change public decisions directly: better evidence, better administration, litigation, policy design, public education, or nonpartisan civic participation. That pathway is less direct than campaign spending, but it can last longer and avoids much of the zero-sum candidate-election frame.

### Range

Our plausible range is **\$4,000-\$500,000/QALY**. The low end is for unusually well-targeted policy or civic work with a real chance of a major win. The high end is for work that is mostly useful but not very counterfactual, where the recipient educates, convenes, or comments on policy without changing much.

The main reasons the range is wide are the major-win probability, attribution, policy quality, and fit between the recipient and this category. The range also leaves room for a bad-policy or polarization tail: some tax-deductible advocacy could make policy worse or harden conflict. We do not make that the central case, but it is a real risk.

:::details{title="Optimistic and pessimistic checks"}
An optimistic case uses a **\$6 million** cost, **55% / 30% / 15%** scenario weights, and scenario values of **\$5M / \$150M / \$1.5B**. That gives about **\$2,200/QALY**.

A pessimistic case uses a **\$15 million** cost, **85% / 13% / 2%** scenario weights, and scenario values of **\$0 / \$20M / \$150M**. That gives about **\$270,000/QALY**.

The published range is narrower than the optimistic edge and wider than the pessimistic edge. The best inputs rarely all line up at once, so we do not publish the full optimistic corner. On the bad side, we widen beyond the sweep because the model can miss near-zero impact, bad-policy risk, or scope drift into vague civic branding.
:::

### Start time

The **2-year** start time reflects the lag from donation to real policy or civic effects. A charity can publish research or run programs sooner, but durable impact usually requires a policy cycle, a court process, an administrative adoption process, or repeated public education.

### Duration

The **10-year** duration reflects a middle ground. Some civic and advocacy work fades in a year or two. Some legal, administrative, or policy wins last for decades. Ten years is a reasonable expected duration for the mix.

## Key uncertainties

1. **Whether a charity is really causal.** Policy wins usually have many parents. The charity may be essential, helpful, or merely nearby.
2. **How often major wins happen.** The estimate is sensitive to the 5% major-win probability.
3. **Whether the policy direction is actually welfare-improving.** Nonpartisan and tax-deductible does not automatically mean good.
4. **How much civic work changes decisions rather than participation alone.** More participation is not automatically a welfare gain unless it improves choices, representation, legitimacy, or administrative quality.
5. **Category boundary mistakes.** If candidate campaigns, partisan mobilization, or campaign committees are included here, the estimate is no longer the right model.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on June 19th 2026 by GPT-5, with prompts from Impact List staff._

- The previous electoral-spending model should not be reused for this category unless the site adds a separate, non-charitable electoral-politics category.
