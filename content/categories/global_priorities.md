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

_The following analysis was done on April 10th 2026 by GPT-5.4, with prompts from Impact List staff._

{{STANDARD_QALY_METHOD_NOTE}}

## Description of effect

This effect captures welfare gains from **global priorities research (GPR)**: research and decision tools that help major donors, institutions, and sometimes policymakers decide which problems, interventions, and strategies are most worth funding or staffing. Representative work includes cross-cause prioritization, identifying neglected but tractable problems, comparing interventions within a cause, building philanthropic decision tools, and foundational work that later changes how money, talent, institutional attention, and policy effort are allocated.

The main pathway is indirect: a dollar to GPR is valuable when it improves much larger later resource flows. The clearest quantified channel is later philanthropy, but the central model also includes a second strategic channel for talent, institution-building, and policy effects expressed in QALY-equivalent terms.

We estimate about **\$5/QALY**. The driver is leverage: one serious program-year of frontier GPR, costing roughly **\$2 million**, is modeled as improving how **\$200 million** of later philanthropy is allocated, raising the welfare output of that capital by about **40%**. The cruxes are all about that leverage chain — how much capital one research dollar really influences, how much credit the research deserves after other funders and advisors are counted, what the counterfactual allocation would have achieved, and how large the broader talent/institution/policy channel is. The range is wide and skewed toward worse outcomes, since the point estimate is calibrated to unusually strong organizations rather than the median GPR dollar.

## What kinds of charities are we modeling?

These estimates assume marginal donations go to **high-quality, frontier-style GPR organizations** that advise large donors on cause or intervention selection, surface neglected but tractable problems, build cross-cause decision tools, or do foundational work that later reshapes how institutions, talent, and policy attention are allocated. Representative examples include Rethink Priorities' worldview and prioritization work, Coefficient Giving's cause-selection research, and academic cause-prioritization programs.

:::details{title="What this category includes and excludes"}
**Included** — work whose value runs through improving much larger later decisions:

- directly advising large donors on cause or intervention selection
- identifying neglected but tractable problems
- building cross-cause cost-effectiveness models or decision tools
- foundational work that later changes how institutions, talent, and policy attention are allocated

**Not modeled here** — adjacent activities whose value runs through other pathways:

- mass outreach to create more donors
- career advice or broad movement building
- direct service delivery
- generic grant administration after priorities are already fixed

Those effects are better handled elsewhere, especially under Meta and Theory.
:::

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$5 (\$0.20–\$600)
- **Start time:** 5 years
- **Duration:** 25 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. A strong marginal GPR team can productively use around **\$2 million** for one additional serious program-year, with a rough plausible range of **\$1-3 million**. Recent public funding-need figures from Rethink Priorities put its Worldview Investigations team at **\$2 million** of room for more funding in 2026 and its Global Health & Development team at **\$1.785 million**. We use **\$2 million** as a representative annual tranche for a serious but still fairly small GPR program, not as a permanent total cost. ([Rethink Priorities 2025 Results / 2026 Plans](https://rethinkpriorities.org/2025-results/))
2. A frontier GPR team serving major funders can plausibly influence around **\$200 million** of later philanthropic allocation decisions, with a plausible range of about **\$50 million-\$300 million**. This is meant to describe unusually strong organizations with access to major funders, not the median GPR dollar, and it should be read as **counterfactually credited influenced capital** after a large attribution discount rather than the full budget touched by the research. RP says its research supported donors whose program budgets total **hundreds of millions of dollars** and publicly reports one case where **\$8 million** was shifted toward a more cost-effective lead intervention. Coefficient Giving says it has helped Good Ventures give **over \$4 billion** historically and directed **over \$100 million** from non-Good-Ventures donors in 2024, with that figure more than doubling in 2025 so far. ([Rethink Priorities 2025 Results / 2026 Plans](https://rethinkpriorities.org/2025-results/), [Rethink Priorities impact page](https://rethinkpriorities.org/impact-area/improving-outcomes-shifting-funding-to-more-cost-effective-options/), [Open Philanthropy Is Now Coefficient Giving](https://coefficientgiving.org/research/open-philanthropy-is-now-coefficient-giving/))
3. Better prioritization increases the welfare output of the influenced capital by about **40%** on average through better grant selection, better across-cause allocation, and better timing, with a rough plausible range of **15%-80%**. This is an all-things-considered QALY improvement, not a human-health-only improvement. ([See detailed justification](/assumption/global-priorities-channel-model))
4. The average counterfactual cost-effectiveness of the influenced capital is around **\$400/QALY**, with a rough plausible range of **\$200-\$1,000/QALY**. This is meant to represent impact-motivated but non-frontier allocation across the kinds of causes major funders actually consider. ([See detailed justification](/assumption/global-priorities-channel-model))
5. A separate broader-strategic channel, covering talent reallocation, institution-building, and policy uptake, is worth about **100%** of the direct philanthropic-allocation channel in the central case, with a rough plausible range of **0%-300%**. ([See detailed justification](/assumption/global-priorities-channel-model))
6. Applied GPR often takes **2-4 years** to change major funding decisions, while more foundational work can take longer. A **5-year** start time is a reasonable portfolio average. Recent examples include lead-exposure research commissioned in 2021 helping set up the Lead Exposure Action Fund in 2024, while deeper cause-selection bets at Open Philanthropy / Coefficient have shaped grantmaking over much longer periods. ([Rethink Priorities impact page](https://rethinkpriorities.org/impact-area/improving-outcomes-shifting-funding-to-more-cost-effective-options/), [Open Philanthropy Is Now Coefficient Giving](https://coefficientgiving.org/research/open-philanthropy-is-now-coefficient-giving/))
7. Once GPR changes how a major donor or institution thinks about a cause, that effect can persist for well over a decade through repeated grants, new funds, follow-on institutions, and later strategic decisions. A **25-year** window seems like a reasonable central estimate for the mix of shorter-lived applied work and rarer, longer-lived worldview or cause-selection shifts. ([Open Philanthropy Is Now Coefficient Giving](https://coefficientgiving.org/research/open-philanthropy-is-now-coefficient-giving/), [Rethink Priorities 2025 Results / 2026 Plans](https://rethinkpriorities.org/2025-results/))

## Details

### Cost per QALY

The model treats GPR as producing value through two channels: a direct channel (better later philanthropic allocation) and a broader strategic channel (spillovers on talent, institutions, and policy). With the central assumptions, the direct channel produces about **200,000** QALYs and the strategic channel adds roughly the same again, so **\$2 million** of GPR buys about **400,000** QALYs — a point estimate of **\$5/QALY**.

:::details{title="The two-channel model and worked calculation"}
Cost per QALY is total cost divided by QALYs from both channels:

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

The broader strategic channel is modeled as a multiple of the direct channel:

$$
Q_s = k \times Q_d
$$

Where $k$ is the size of the broader strategic channel relative to the direct philanthropic channel.

Using the central assumptions above ($C$ = \$2,000,000, $I$ = \$200,000,000, $g$ = 0.4, $B$ = \$400/QALY, $k$ = 1.0):

$$
Q_d = \dfrac{200{,}000{,}000 \times 0.4}{400} = 200{,}000
$$

$$
Q_s = 1.0 \times 200{,}000 = 200{,}000
$$

$$
\text{Cost per QALY} = \dfrac{2{,}000{,}000}{200{,}000 + 200{,}000} = 5
$$
:::

Whether **\$5/QALY** is right turns on whether those assumptions hold.

The main empirical crux is the **influenced-capital ratio**. The central case assumes a 100:1 ratio: **\$2 million** of GPR spending eventually gets counterfactual credit for improving how **\$200 million** is allocated. That should be read as a frontier-org assumption, not a median-org assumption, and as an attribution-discounted figure rather than the full value of all budgets the organization touches. The public evidence here comes mostly from the organizations themselves and is therefore vulnerable to selection effects. RP's public materials show access to donors with budgets in the hundreds of millions and at least one disclosed **\$8 million** reallocation. Coefficient / Open Philanthropy shows that a prioritization institution can shape a multi-billion-dollar portfolio, but much of that evidence comes from one unusually large partnership with Good Ventures. So the right takeaway is not "typical GPR dollars get 100:1 leverage"; it is that top teams working with very large funders plausibly can get some counterfactual credit on very large allocation decisions.

The **40% direct improvement** assumption should also be read carefully. It is an all-things-considered QALY uplift on the influenced capital, not a claim about only human-health grantmaking. The reasoning is that many strong GPR projects do not merely help donors choose a slightly better charity within one cause; they also improve **cause selection**, which can move money between portfolios with very different all-things-considered welfare output. The site's own cause estimates already span from the low single digits per QALY for [Animal Welfare](/cause/animal-welfare) to the tens for [Meta and Theory](/cause/meta-theory), the low hundreds for [Global Health](/cause/global-health) and [Global Development](/cause/global-development), and the low thousands for [Institutions](/cause/institutions). That is enough spread for a **40%** average improvement to be meaningful without assuming that every influenced dollar is pushed all the way to the current frontier.

The **\$400/QALY baseline** is the next-biggest judgment call. We are intentionally not assuming that the counterfactual money would otherwise go to random low-impact philanthropy; the relevant donors are usually somewhat impact-motivated. But we are also not assuming they are already at the frontier. Coefficient's 2021 framework update values a DALY at about **\$100,000**, so a 1000x bar corresponds to roughly one healthy life-year per **\$100** spent. The site's major cause pages span from about **\$2.3/QALY** for [Animal Welfare](/cause/animal-welfare) to **\$3,000/QALY** for [Institutions](/cause/institutions). A **\$400/QALY** counterfactual benchmark is therefore a reasonable middle position for serious but still materially improvable donors.

The **broader strategic channel** is meant to capture a further point: strong GPR often changes more than later grant ledgers. Better prioritization can also reshape where talented people work, which institutions get built, and which policy agendas get taken seriously. Those effects are harder to measure cleanly than later philanthropy, but they are still part of the welfare output of GPR. Treating them as their own channel, with a central value of the same order of magnitude as the direct channel, better reflects the full scope of frontier-style prioritization work than treating them as a small footnote.

**Why the range (\$0.20-\$600/QALY).** Pushing all five inputs to their favorable edges at once gives about **\$0.20/QALY**, and to their unfavorable edges at once about **\$400/QALY**. We publish *past* that span on the high-cost side — out to **\$600** — rather than pulling in, because the biggest uncertainties here sit *outside* the five parameters: whether marginal GPR causally moves large later allocations at all, how much credit it really deserves when big funders have many inputs, and whether future dollars resemble the selection-biased public success stories. Those structural risks are correlated — a skeptical read pulls the influenced capital, the improvement factor, and the strategic channel down together — so the all-edges span understates rather than overstates the plausible range. The range is asymmetric toward worse outcomes: relative to the **\$5/QALY** point estimate the downside is much larger than the upside, because the point estimate is already calibrated to unusually strong organizations rather than the median GPR dollar, and attribution can fail in many ways the parameters do not capture. The optimistic tail is correspondingly demanding — it describes a rare frontier case where a small team materially improves very large later decisions and the talent/institution/policy effects run several times the later-philanthropy channel, not an ordinary good year.

:::details{title="The all-edges sweep, and why we publish wider"}
- **Most favorable edges at once:** \$1M cost, \$300M influenced, 80% direct improvement, \$200/QALY baseline, and a broader strategic channel worth **300%** of the direct channel gives about **\$0.20/QALY**.
- **Most unfavorable edges at once:** \$3M cost, \$50M influenced, 15% direct improvement, \$1,000/QALY baseline, and no broader strategic channel gives about **\$400/QALY**.

For five roughly independent inputs, hitting every favorable (or every unfavorable) edge simultaneously would normally be rarer than one input landing at its range edge, so this all-edges span would *overstate* the input-driven plausible range. We publish past it on the high-cost side anyway — **\$0.20-\$600/QALY** — for two reasons. The inputs are positively correlated through one's overall read of GPR's leverage, which makes the joint extremes less rare than independence implies. And the model's largest uncertainties are structural and live outside these five parameters: whether marginal GPR is causally counterfactual to big later allocations, and whether future dollars match the selection-biased public track record. The heavier weight goes on the worse tail, since attribution can fail in many ways but the favorable cases are capped by how good the best opportunities actually are.
:::

External discussions of GPR are broadly directionally consistent with this picture. For example, [80,000 Hours](https://80000hours.org/problem-profiles/global-priorities-research/) and [Giving What We Can](https://www.givingwhatwecan.org/effective-altruism-effective-giving/global-priorities) both describe GPR as highly neglected and potentially very high leverage. They are not direct **\$/QALY** estimates, but they fit the basic picture of GPR as a multiplier on very large later decisions.

### Start time

The 5-year start time reflects the mix of two very different pathways.

Applied work for major donors can matter fairly fast. The clearest public example we found is RP's lead-exposure work: research commissioned in **2021** fed into concrete funding shifts by **2024**, including the launch of the Lead Exposure Action Fund and at least one publicly disclosed **\$8 million** reallocation.

But some of the most important GPR is more foundational. Academic work on moral uncertainty, worldview diversification, discounting, forecasting, and institutional decision-making may take much longer to influence practice. Because this category includes both kinds of work, **5 years** is a reasonable portfolio average.

### Duration

The 25-year duration reflects how long major prioritization shifts can keep mattering after the initial research is done.

Coefficient's current portfolio still reflects cause-selection work that began in the early 2010s. Once a funder decides that an area deserves serious, long-run support, that decision can persist through repeated grants, spinouts, follow-on funds, and capacity building. LEAF is a good recent example: a prioritization process turned a previously tiny area into a coordinated fund with nine-figure commitments and a plan to attract additional external funders.

At the same time, not every prioritization judgment remains live forever; some research becomes outdated as the world changes. A **25-year** window is therefore a compromise between short-lived applied reports and rarer, much longer-lived changes in worldviews or institutional strategy.

## Key uncertainties

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
