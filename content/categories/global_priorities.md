---
id: global-priorities
name: 'Global Priorities Research'
effects:
  - effectId: standard
    startTime: 5
    windowLength: 25
    costPerQALY: 5
---

# Justification of cost per life

_The following analysis was done on April 10th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from **global priorities research (GPR)**: research and decision tools that help major donors, institutions, and sometimes policymakers decide which problems, interventions, and strategies are most worth funding or staffing. Representative work includes cross-cause prioritization, identifying neglected but tractable problems, comparing interventions within a cause, building philanthropic decision tools, and foundational work that later changes how money, talent, institutional attention, and policy effort are allocated.

The main pathway is indirect: a dollar to GPR is valuable when it improves much larger later resource flows. The clearest quantified channel is later philanthropy, but the central model also includes a second strategic channel for talent, institution-building, and policy effects expressed in QALY-equivalent terms.

## Point Estimates

- **Cost per QALY:** \$5 (\$0.30–\$300)
- **Start time:** 5 years
- **Duration:** 25 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. A strong marginal GPR team can productively use around **\$2 million** of additional annual funding, with a rough plausible range of **\$1-3 million**. Recent public funding-need figures from Rethink Priorities put its Worldview Investigations team at **\$2 million** of room for more funding in 2026 and its Global Health & Development team at **\$1.785 million**. We use **\$2 million** as a representative scale for a serious but still fairly small GPR program. ([Rethink Priorities 2025 Results / 2026 Plans](https://rethinkpriorities.org/2025-results/))
2. A frontier GPR team serving major funders can plausibly influence around **\$200 million** of later philanthropic allocation decisions, with a practical range of about **\$50 million-\$300 million**. This is meant to describe unusually strong organizations with access to major funders, not the median GPR dollar. RP says its research supported donors whose program budgets total **hundreds of millions of dollars** and publicly reports one case where **\$8 million** was shifted toward a more cost-effective lead intervention. Coefficient Giving says it has helped Good Ventures give **over \$4 billion** historically and directed **over \$100 million** from non-Good-Ventures donors in 2024, with that figure more than doubling in 2025 so far. ([Rethink Priorities 2025 Results / 2026 Plans](https://rethinkpriorities.org/2025-results/), [Rethink Priorities impact page](https://rethinkpriorities.org/impact-area/improving-outcomes-shifting-funding-to-more-cost-effective-options/), [Open Philanthropy Is Now Coefficient Giving](https://coefficientgiving.org/research/open-philanthropy-is-now-coefficient-giving/))
3. Better prioritization increases the welfare output of the influenced capital by about **40%** on average through better grant selection, better across-cause allocation, and better timing, with a rough practical range of **15%-80%**. This is an all-things-considered QALY improvement, not a human-health-only improvement. ([See detailed justification](/assumption/global-priorities-channel-model))
4. The average counterfactual cost-effectiveness of the influenced capital is around **\$400/QALY**, with a rough practical range of **\$200-\$1,000/QALY**. This is meant to represent impact-motivated but non-frontier allocation across the kinds of causes major funders actually consider. ([See detailed justification](/assumption/global-priorities-channel-model))
5. A separate broader-strategic channel, covering talent reallocation, institution-building, and policy uptake, is worth about **100%** of the direct philanthropic-allocation channel in the central case, with a rough practical range of **0%-300%**. ([See detailed justification](/assumption/global-priorities-channel-model))
6. Applied GPR often takes **2-4 years** to change major funding decisions, while more foundational work can take longer. A **5-year** start time is a reasonable portfolio average. Recent examples include lead-exposure research commissioned in 2021 helping set up the Lead Exposure Action Fund in 2024, while deeper cause-selection bets at Open Philanthropy / Coefficient have shaped grantmaking over much longer periods. ([Rethink Priorities impact page](https://rethinkpriorities.org/impact-area/improving-outcomes-shifting-funding-to-more-cost-effective-options/), [Open Philanthropy Is Now Coefficient Giving](https://coefficientgiving.org/research/open-philanthropy-is-now-coefficient-giving/))
7. Once GPR changes how a major donor or institution thinks about a cause, that effect can persist for well over a decade through repeated grants, new funds, follow-on institutions, and later strategic decisions. A **25-year** window seems like a reasonable central estimate for the mix of shorter-lived applied work and rarer, longer-lived worldview or cause-selection shifts. ([Open Philanthropy Is Now Coefficient Giving](https://coefficientgiving.org/research/open-philanthropy-is-now-coefficient-giving/), [Rethink Priorities 2025 Results / 2026 Plans](https://rethinkpriorities.org/2025-results/))

## Details

### Cost per QALY

The cleanest model is to treat GPR as producing value through two channels:

1. better later philanthropic allocation
2. broader strategic spillovers on talent, institutions, and policy

$$
\text{Cost per QALY} = \dfrac{C}{Q_d + Q_s}
$$

Where:

- $C$ = cost of the GPR work
- $Q_d$ = direct QALYs created by improving later philanthropic allocation
- $Q_s$ = broader strategic-spillover QALYs

The direct channel is:

$$
Q_d = \dfrac{I \times g}{B}
$$

Where:

- $I$ = downstream philanthropic dollars influenced
- $g$ = direct proportional increase in the welfare output of that capital
- $B$ = counterfactual cost per QALY of that capital

The broader strategic channel is modeled as:

$$
Q_s = k \times Q_d
$$

Where:

- $k$ = the broader strategic channel relative to the direct philanthropic channel

Using the central assumptions above:

- $C$ = \$2,000,000
- $I$ = \$200,000,000
- $g$ = 40% = 0.4
- $B$ = \$400/QALY
- $k$ = 100% = 1.0

So:

$$
Q_d = \dfrac{200{,}000{,}000 \times 0.4}{400} = 200{,}000
$$

$$
Q_s = 1.0 \times 200{,}000 = 200{,}000
$$

$$
\text{Total extra QALYs} = 200{,}000 + 200{,}000 = 400{,}000
$$

$$
\text{Cost per QALY} = \dfrac{2{,}000{,}000}{400{,}000} = 5
$$

So the point estimate is **\$5/QALY**.

The key question is whether those assumptions are realistic.

The main empirical crux is the **influenced-capital ratio**. The central case assumes a 100:1 ratio: **\$2 million** of GPR spending eventually changes how **\$200 million** is allocated. That should be read as a frontier-org assumption, not a median-org assumption. The public evidence here comes mostly from the organizations themselves and is therefore vulnerable to selection effects. RP's public materials show access to donors with budgets in the hundreds of millions and at least one disclosed **\$8 million** reallocation. Coefficient / Open Philanthropy shows that a prioritization institution can shape a multi-billion-dollar portfolio, but much of that evidence comes from one unusually large partnership with Good Ventures. So the right takeaway is not "typical GPR dollars get 100:1 leverage"; it is that top teams working with very large funders plausibly can.

The **40% direct improvement** assumption should also be read carefully. It is an all-things-considered QALY uplift on the influenced capital, not a claim about only human-health grantmaking. The reasoning is that many strong GPR projects do not merely help donors choose a slightly better charity within one cause; they also improve **cause selection**, which can move money between portfolios with very different all-things-considered welfare output. The site's own cause estimates already span from the low single digits per QALY for [Animal Welfare](/category/animal-welfare) to the tens for [Meta and Theory](/category/meta-theory), the low hundreds for [Global Health](/category/global-health) and [Global Development](/category/global-development), and the low thousands for [Institutions](/category/institutions). That is enough spread for a **40%** average improvement to be meaningful without assuming that every influenced dollar is pushed all the way to the current frontier.

The **\$400/QALY baseline** is the next-biggest judgment call. We are intentionally not assuming that the counterfactual money would otherwise go to random low-impact philanthropy; the relevant donors are usually somewhat impact-motivated. But we are also not assuming they are already at the frontier. Coefficient says its own current bar is roughly a year of healthy life for every **\$50** spent, while the site's major cause pages span from about **\$2.3/QALY** for [Animal Welfare](/category/animal-welfare) to **\$3,000/QALY** for [Institutions](/category/institutions). A **\$400/QALY** counterfactual benchmark is therefore a reasonable middle position for serious but still materially improvable donors.

The **broader strategic channel** is meant to capture a further point: strong GPR often changes more than later grant ledgers. Better prioritization can also reshape where talented people work, which institutions get built, and which policy agendas get taken seriously. Those effects are harder to measure cleanly than later philanthropy, but they are still part of the welfare output of GPR. Treating them as their own channel, with a central value of the same order of magnitude as the direct channel, better reflects the full scope of frontier-style prioritization work than treating them as a small footnote.

**Range:**

- **Pessimistic:** \$2.5M cost, \$50M influenced, 15% direct improvement, \$1,000/QALY baseline, and no broader strategic channel gives about **\$330/QALY**.
- **Optimistic:** \$1.5M cost, \$300M influenced, 80% direct improvement, \$200/QALY baseline, and a broader strategic channel worth **300%** of the direct channel gives about **\$0.30/QALY**.

So the practical sensitivity range is **\$0.30-\$300/QALY**.

This is better read as a practical range than as a full uncertainty interval. The true distribution is probably very heavy-tailed: many projects have little impact, while a few meaningfully reshape very large funding decisions.

The optimistic tail is intentionally demanding. It implies a rare case where a small research team materially improves very large later decisions and where the broader talent / institution / policy effects are several times larger than the later-philanthropy channel itself. That is not meant to describe an ordinary good year for GPR; it is meant to describe an unusually successful frontier case.

The range is intentionally asymmetric. Relative to the **\$5/QALY** point estimate, the downside is much larger than the upside because public success stories likely overstate typical marginal impact, attribution can fail in many ways, and the point estimate is already calibrated to unusually strong GPR organizations rather than the median GPR dollar.

External discussions of GPR are broadly directionally consistent with this picture. For example, [80,000 Hours](https://80000hours.org/problem-profiles/global-priorities-research/) and [Giving What We Can](https://www.givingwhatwecan.org/effective-altruism-effective-giving/global-priorities) both describe GPR as highly neglected and potentially very high leverage. They are not direct **\$/QALY** estimates, but they fit the basic picture of GPR as a multiplier on very large later decisions.

### Start Time

The 5-year start time reflects the mix of two very different pathways.

Applied work for major donors can matter fairly fast. The clearest public example we found is RP's lead-exposure work: research commissioned in **2021** fed into concrete funding shifts by **2024**, including the launch of the Lead Exposure Action Fund and at least one publicly disclosed **\$8 million** reallocation.

But some of the most important GPR is more foundational. Academic work on moral uncertainty, worldview diversification, discounting, forecasting, and institutional decision-making may take much longer to influence practice. Because this category includes both kinds of work, **5 years** is a reasonable portfolio average.

### Duration

The 25-year duration reflects how long major prioritization shifts can keep mattering after the initial research is done.

Coefficient's current portfolio still reflects cause-selection work that began in the early 2010s. Once a funder decides that an area deserves serious, long-run support, that decision can persist through repeated grants, spinouts, follow-on funds, and capacity building. LEAF is a good recent example: a prioritization process turned a previously tiny area into a coordinated fund with nine-figure commitments and a plan to attract additional external funders.

At the same time, not every prioritization judgment remains live forever; some research becomes outdated as the world changes. A **25-year** window is therefore a compromise between short-lived applied reports and rarer, much longer-lived changes in worldviews or institutional strategy.

## What Kinds of Charities Are We Modeling?

These estimates assume marginal donations go to **high-quality, frontier-style GPR organizations** that do work such as:

- directly advising large donors on cause or intervention selection
- identifying neglected but tractable problems
- building cross-cause cost-effectiveness models or decision tools
- doing foundational work that later changes how institutions, talent, and policy attention are allocated

Representative examples include Rethink Priorities' worldview and prioritization work, Coefficient Giving's cause-selection research, and academic cause-prioritization programs.

We are **not** mainly modeling:

- mass outreach to create more donors
- career advice or broad movement building
- direct service delivery
- generic grant administration after priorities are already fixed

Those effects are better handled elsewhere, especially under Meta and Theory.

## Key Uncertainties

1. **Attribution.** Large donors usually have multiple inputs, not just one research organization. It is hard to know how much credit GPR really deserves for a major shift.
2. **Marginal versus average impact.** Public case studies may overrepresent unusually successful work, and much of the public evidence comes from a few organizations and one very large donor relationship. The next dollar could do less than the historical average.
3. **How crowded the field has become.** GPR was extraordinarily neglected a decade ago. It is still small, but the best opportunities may now be less neglected than many people still intuitively expect.
4. **How much spread remains among influenceable dollars.** If the relevant donors are already near the frontier, GPR adds less. If they still have big blind spots, it adds much more.
5. **How large the broader strategic channel really is.** The model treats talent, institution, and policy effects as a channel of the same order of magnitude as the direct philanthropic effect, but the true number could be materially lower or higher.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- If future editors want to move this estimate a lot, the most important levers are: (1) influenced capital per research dollar, (2) the direct improvement factor, and (3) the size of the broader strategic channel relative to the direct one.
- The dedicated assumption page currently covers the broad-benchmark / improvement / second-channel logic, but the influenced-capital ratio is still the single most decision-relevant empirical crux.
- As of April 2026, the Global Priorities Institute website reads partly like an archive / history site rather than an ordinary active institute page. If the recipient mapping continues to rely on GPI as a live default example, that may be worth reviewing separately.
