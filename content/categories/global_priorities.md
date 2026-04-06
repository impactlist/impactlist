---
id: global-priorities
name: 'Global Priorities Research'
effects:
  - effectId: standard
    startTime: 5
    windowLength: 25
    costPerQALY: 20
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from **global priorities research (GPR)**: research that helps major donors and institutions decide which problems, interventions, and strategies are most worth funding. Representative work includes cross-cause prioritization, identifying neglected but tractable problems, comparing interventions within a cause, building philanthropic decision tools, and doing commissioned research for large funders.

The main pathway is indirect: a dollar to GPR is valuable when it causes much larger downstream sums to be allocated more effectively. We intentionally model only the part of that effect that flows through **later philanthropic spending on human welfare**, because that is the cleanest channel to express in QALYs. This means the estimate excludes most effects on talent allocation, government policy, animal welfare, and existential-risk reduction. Those exclusions make the estimate easier to defend, but probably conservative overall.

## Point Estimates

- **Cost per QALY:** \$20 (\$2–\$500)
- **Start time:** 5 years
- **Duration:** 25 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. A strong marginal GPR team can productively use around **\$2 million** of additional annual funding, with a rough plausible range of **\$1-3 million**. Recent public funding-need figures from Rethink Priorities put its Worldview Investigations team at **\$2 million** of room for more funding in 2026 and its Global Health & Development team at **\$1.785 million**. We use **\$2 million** as a representative scale for a serious but still fairly small GPR program. ([Rethink Priorities 2025 Results / 2026 Plans](https://rethinkpriorities.org/2025-results/))
2. A frontier GPR team serving major donors can plausibly influence around **\$200 million** of later philanthropic decisions, with a practical range of about **\$50 million-\$500 million**. This is meant to describe unusually strong organizations with access to major funders, not the median GPR dollar. The public evidence is also partly self-reported. RP says its GHD research supported donors whose program budgets total **hundreds of millions of dollars** and discloses one case where its work shifted **\$8 million** to a more cost-effective lead intervention. Coefficient Giving reports directing **over \$4 billion** since 2014, but its own history makes clear that this substantially reflects its Open Philanthropy period and its close partnership with Good Ventures, so it should be read as evidence about what a top-tier prioritization institution can shape, not about ordinary GPR organizations. ([Rethink Priorities 2025 Results / 2026 Plans](https://rethinkpriorities.org/2025-results/), [Rethink Priorities impact page](https://rethinkpriorities.org/impact-area/improving-outcomes-shifting-funding-to-more-cost-effective-options/), [Coefficient press release](https://coefficientgiving.org/research/press-release-open-philanthropy-becomes-coefficient-giving-expanding-work-with-multiple-donors/), [Coefficient Giving history](https://coefficientgiving.org/our-history/), [Coefficient partner page](https://coefficientgiving.org/about-us/partner-with-us))
3. Better prioritization increases the welfare output of the influenced philanthropic capital by about **25%** on average, with a rough practical range of **10%-40%**. Concretely, this means the same downstream dollars buy about **25% more QALYs** than they would have otherwise; that is the interpretation used in the formula below. This is meant to capture a portfolio-average gain from shifting money toward better causes, better interventions within a cause, better timing, and fewer weak grants, not a claim that GPR usually turns mediocre philanthropy into frontier giving. ([Strategic Cause Selection](https://coefficientgiving.org/research/strategic-cause-selection/))
4. The average baseline cost-effectiveness of the influenced capital is around **\$500/QALY**, with a rough practical range of **\$250-\$1,000/QALY**. This is intentionally much worse than the roughly **\$50 per healthy life-year** bar that Coefficient says it aims to clear for grants it actually chooses to fund, but still better than ordinary untargeted philanthropy. The idea is that the donors being influenced are often at least somewhat impact-motivated, yet not already allocating at the current frontier. ([Coefficient cost-effectiveness page](https://coefficientgiving.org/research/cost-effectiveness/), [GiveWell top charities](https://www.givewell.org/Our-Top-Charities))
5. Applied GPR often takes **2-4 years** to change major funding decisions, while more foundational academic work can take longer. A **5-year** start time is a reasonable portfolio average. Recent examples include lead-exposure research commissioned in 2021 helping set up the Lead Exposure Action Fund in 2024, while deeper cause-selection bets at Open Philanthropy / Coefficient have shaped grantmaking over much longer periods. ([Rethink Priorities impact page](https://rethinkpriorities.org/impact-area/improving-outcomes-shifting-funding-to-more-cost-effective-options/), [Announcing LEAF](https://coefficientgiving.org/research/announcing-the-lead-exposure-action-fund/), [Coefficient history](https://coefficientgiving.org/our-history/))
6. Once GPR changes how a major donor thinks about a cause, that effect can persist for well over a decade through repeated grants, new funds, and downstream institution-building. A **25-year** window seems like a reasonable central estimate for the mix of shorter-lived applied work and rarer, longer-lived worldview or cause-selection shifts. ([Coefficient history](https://coefficientgiving.org/our-history/), [Coefficient about us](https://coefficientgiving.org/about-us/))

## Details

### Cost per QALY

The cleanest conservative model is:

$$
\text{Cost per QALY} = \dfrac{C}{I \times G / B}
$$

Where:

- $C$ = cost of the GPR work
- $I$ = downstream philanthropic dollars influenced
- $G$ = proportional increase in welfare output from that downstream capital, relative to the baseline portfolio
- $B$ = baseline cost per QALY of the influenced capital

Using the central assumptions above:

- $C = \$2{,}000{,}000$
- $I = \$200{,}000{,}000$
- $G = 25\% = 0.25$
- $B = \$500/\text{QALY}$

So:

$$
\text{Extra QALYs} = \dfrac{\$200{,}000{,}000 \times 0.25}{\$500} = 100{,}000 \text{ QALYs}
$$

$$
\text{Cost per QALY} = \dfrac{\$2{,}000{,}000}{100{,}000} = \$20
$$

So the point estimate is **\$20/QALY**.

The key question is whether the assumptions behind this 100,000-QALY figure are realistic.

The main empirical crux is the **influenced-capital ratio**. The central case assumes a 100:1 ratio: **\$2 million** of GPR spending eventually changes how **\$200 million** is allocated. That should be read as a frontier-org assumption, not a median-org assumption. The public evidence here comes mostly from the organizations themselves and is therefore vulnerable to selection effects. RP's public materials show access to donors with budgets in the hundreds of millions and at least one disclosed **\$8 million** reallocation. Coefficient / Open Philanthropy shows that a prioritization institution can shape a multi-billion-dollar portfolio, but much of that evidence comes from one unusually large partnership with Good Ventures. So the right takeaway is not "typical GPR dollars get 100:1 leverage"; it is that top teams working with very large funders plausibly can.

The **25% improvement** assumption should also be read carefully. In this model it means **25% more welfare output from the same downstream capital**, relative to the counterfactual portfolio. That is a stronger and more precise claim than merely saying the portfolio gets "somewhat better." It seems plausible if GPR sometimes causes shifts across causes, within-cause intervention choice, timing, and grant selection, but it is still a major judgment call.

The **\$500/QALY baseline** is the next-biggest judgment call. We are intentionally not assuming that the counterfactual money would otherwise go to random low-impact philanthropy; the relevant donors are usually somewhat impact-motivated. But we are also not assuming they are already funding opportunities near the current frontier. Coefficient says its current grantmaking bar is roughly one healthy life-year per **\$50** spent. Using **\$500/QALY** as the counterfactual baseline therefore means assuming the capital being influenced is about an order of magnitude worse than Coefficient's current target opportunities, which seems like a reasonable middle ground for major donors who care about impact but have not yet been especially well optimized.

This model is conservative in one important respect: it only counts later **human-welfare philanthropy**. It does **not** explicitly count:

- talent moved into better priorities
- government policy shaped by research
- shifts toward animal-welfare opportunities
- shifts toward existential-risk reduction
- the long tail of academic idea influence

Those channels are real and may be large, but expressing them all in QALYs would require much shakier conversions and would risk overlap with other categories. Excluding them keeps the model cleaner.

**Range:**

- **Pessimistic:** \$2.5M cost, \$50M influenced, 10% improvement, and \$1,000/QALY baseline gives **\$500/QALY**.
- **Optimistic:** \$1.5M cost, \$500M influenced, 40% improvement, and \$250/QALY baseline gives about **\$2/QALY**.

So the practical sensitivity range is **\$2-\$500/QALY**.

This is better read as a practical range than as a full uncertainty interval. The true distribution is probably very heavy-tailed: many projects have little impact, while a few meaningfully reshape very large funding decisions.

The range is intentionally asymmetric. Relative to the **\$20/QALY** point estimate, the downside is **25x** worse while the upside is only **10x** better. That reflects three considerations: public success stories likely overstate typical marginal impact, attribution can fail in many ways, and the point estimate is already calibrated to unusually strong GPR organizations rather than the median GPR dollar. At the same time, the model omits some channels that could push in the optimistic direction, especially effects on talent allocation, policy, animal welfare, and existential risk.

External discussions of GPR are broadly directionally consistent with this picture. For example, [80,000 Hours](https://80000hours.org/problem-profiles/global-priorities-research/) and [Giving What We Can](https://www.givingwhatwecan.org/effective-altruism-effective-giving/global-priorities) both describe GPR as highly neglected and potentially very high leverage. But they do not provide directly comparable **\$/QALY** estimates, so they are more useful as qualitative cross-checks than as precise calibration targets.

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
- doing foundational work that later changes how institutions allocate resources

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
3. **How crowded the field has become.** GPR was extraordinarily neglected a decade ago. It is still small, but the best opportunities may now be less neglected than older discussions assumed.
4. **How much spread remains among influenceable dollars.** If the relevant donors are already near the frontier, GPR adds less. If they still have big blind spots, it adds much more.
5. **The omitted channels.** Excluding talent allocation, policy influence, animal welfare, and existential-risk effects probably makes this estimate conservative, but also means the headline number is incomplete.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- If future editors want to move this estimate a lot, the most important levers are: (1) influenced capital per research dollar, and (2) average percentage improvement in the influenced portfolio.
- A dedicated assumption page on the influenced-capital ratio could be worth creating later; it is the main empirical crux.
- As of April 2026, the Global Priorities Institute website reads partly like an archive / history site rather than an ordinary active institute page. If the recipient mapping continues to rely on GPI as a live default example, that may be worth reviewing separately.
