---
id: alliance-to-feed-the-earth-in-disasters
name: 'Alliance to Feed the Earth in Disasters'
categories:
  - id: disaster-relief
    fraction: 1
    effects:
      - effectId: standard
        overrides:
          startTime: 1
          windowLength: 50
          costPerQALY: 17
---

# Justification of cost per life

We assign the Alliance to Feed the Earth in Disasters (ALLFED) a **cost per QALY of \$17**, equivalent to **\$1,360 per 80-QALY life**. We start from an independent estimate of a targeted food-resilience policy campaign, adjust it for uncertainty within that estimate, and then adjust from the modeled campaign to a marginal unrestricted donation to ALLFED.

This estimate is unusually uncertain. Its expected impact depends on whether a catastrophe occurs, whether research changes policy or preparedness, whether those changes survive until they are needed, and how many deaths they avert. There is no direct empirical estimate of ALLFED's cost per life saved.

## Description of effect

ALLFED researches and promotes ways to keep people fed if conventional agriculture or industry is severely disrupted—for example after nuclear winter, a supervolcanic eruption, an extreme pandemic, or a prolonged loss of electricity. Its current work includes research, experiments, government and industry engagement, response planning, and communications systems. See ALLFED's [2025–2026 strategy](https://allfed.info/images/pdfs/ALLFED%202025%20-%202026%20Organizational%20Strategy.pdf) and [2024 annual report](https://allfed.info/images/Annual-Reports/ALLFED-Annual-Report-2024.pdf).

We model the benefit as future QALYs saved by making severe food and industrial disruptions less deadly.

## What kinds of work are we modeling?

We apply this estimate to ALLFED as a whole, including research, policy advocacy, experiments, operational planning, and organizational capacity. We list ALLFED under [Disaster Relief](/cause/disaster-relief) because it aims to reduce the human consequences of disasters. Unlike that category's baseline, however, ALLFED focuses on preparedness and resilience before catastrophes occur rather than acute humanitarian response afterward. This recipient-specific estimate therefore fully replaces the Disaster Relief default.

ALLFED is also not AI-safety work. A resilient civilization might be less vulnerable to later risks, including risks involving advanced AI, but that is a possible secondary benefit rather than ALLFED's primary mechanism.

The distinction between the whole organization and a restricted policy grant matters. The best independent estimate we found evaluates a particularly promising policy campaign, while an unrestricted donation can support ALLFED's broader portfolio.

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$17 (\$0.60-\$1,250)
- **Equivalent cost per 80-QALY life:** \$1,360 (\$50-\$100,000)
- **Start time:** 1 year
- **Duration:** 50 years

_If you disagree with this estimate after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values._

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. **Independent policy-campaign anchor:** [CEARCH's 2024 assessment of resilience to nuclear and volcanic winter](https://forum.effectivealtruism.org/posts/tyo6v4ibrksbdArMj/resilience-to-nuclear-and-volcanic-winter) implies approximately **\$333 per 80-QALY life** for a five-year policy campaign in a promising country. We use its DALY result rather than the lower cost per death because the site compares interventions in QALYs. {{CHALLENGE_ASSUMPTION:1}}

2. **3x campaign-evidence adjustment:** CEARCH's result depends heavily on expert estimates of advocacy success, policy quality, and persistence. A detailed critique estimated only 12.4% as much impact after changing several assumptions. CEARCH's author agreed that domain experts were likely to overestimate advocacy success, while defending other parts of the model. We multiply the cost by **3x**, roughly midway on a logarithmic scale between accepting CEARCH's headline result and accepting the critique in full. {{CHALLENGE_ASSUMPTION:2}}

3. **1.36x whole-organization adjustment:** We estimate that a marginal unrestricted donation to ALLFED produces about 74% as many QALYs per dollar as CEARCH's adjusted policy campaign. This is one net judgment, not a product of independent multipliers. ALLFED's broader portfolio and current funding scale push expected effectiveness down; research that supports advocacy, coverage of additional catastrophes, and possible long-term resilience benefits push it up. The factor is the numerical expression of a roughly three-quarters judgment, not a measurement precise to two decimal places. {{CHALLENGE_ASSUMPTION:3}}

4. **ALLFED's own papers are supporting but correlated evidence:** A [2016 peer-reviewed model](https://link.springer.com/article/10.1007/s13753-016-0097-2) estimated potentially very high cost-effectiveness for alternate-food planning, research, and development. Later papers on [resilient foods](https://ora.ox.ac.uk/objects/uuid%3Abbb5d910-a76d-46dc-82f3-86f619aa1330) and [loss of electricity or industry](https://ora.ox.ac.uk/objects/uuid%3A77905318-5c59-4236-9a05-16716be745af) argue for large possible long-term benefits. These papers share authors, methods, and assumptions, and their authors disclose affiliations with ALLFED. We treat them as evidence that a large benefit is plausible, but not as independent measurements to average with CEARCH's estimate. {{CHALLENGE_ASSUMPTION:4}}

5. **Benefits begin after one year and are spread over 50 years:** Research and advocacy can start influencing decisions fairly quickly, but most expected QALYs are realized only if a rare catastrophe later occurs. Useful knowledge and institutions can persist for decades, although they require updating as technology, governments, and food systems change. {{CHALLENGE_ASSUMPTION:5}}

## Details

### Central calculation

CEARCH estimated that a five-year policy campaign costing \$1 million would avert about 6,000 expected deaths. Its fuller model estimated about **24,000 DALYs per \$100,000**, or **\$4.17 per DALY**. Treating one averted DALY as comparable to one gained QALY gives approximately **\$333 per 80-QALY life**.

We apply the 3x campaign-evidence adjustment and the 1.36x whole-organization adjustment:

$$
\$333 \times 3 \times 1.36
= \$1{,}359 \text{ per 80-QALY life}
\approx \$17 \text{ per QALY}.
$$

The 3x factor adjusts CEARCH's estimate of the policy campaign itself. The 1.36x factor then translates that adjusted campaign estimate to a marginal unrestricted donation to ALLFED. Keeping these as two stages avoids treating related concerns about fungibility, portfolio composition, scale, and execution as independent penalties.

### Translating from a policy campaign to ALLFED

Several considerations make unrestricted ALLFED funding less effective than CEARCH's modeled campaign. CEARCH selected targeted policy advocacy as the most promising marginal intervention, while ALLFED also funds research, experiments, planning, communications, and organizational capacity. ALLFED's 2024 US tax filing reports about [\$1.02 million in annual expenses and \$1.76 million in net assets](https://projects.propublica.org/nonprofits/organizations/831717756), so the large returns to highly neglected early work assumed in older models are unlikely to describe its current margin. ALLFED reports substantial research and policy activity, but not directly attributable deaths averted or enough completed policy adoption to estimate an observed success rate.

Other considerations push in the opposite direction. Research and experiments can make later advocacy credible and identify workable responses. ALLFED also addresses extreme pandemics and losses of electricity or industry, while CEARCH modeled only nuclear and volcanic winter. Better resilience might also reduce political instability, technological regression, or the time humanity remains exposed to other existential risks.

We combine these correlated considerations into one **1.36x net adjustment**. This is equivalent to estimating that unrestricted ALLFED funding produces about 74% as many QALYs per dollar as the adjusted policy campaign. The number is a judgment call: it says that the disadvantages of moving from an unusually promising campaign to organization-level funding modestly outweigh the omitted benefits.

### How much weight should ALLFED's papers receive?

The 2016 alternate-food model reported 95% intervals of roughly \$0.3-\$300 per expected death averted for planning, \$0.3-\$400 for research, \$0.2-\$400 for development, and \$200-\$700,000 for training. Its results were dominated by assumptions including a 0.3%-3% annual probability of a global food shortfall of at least 10%, 20 million-2 billion deaths without an alternate-food response, and large but uncertain increases in intervention success.

The later long-term papers do not directly estimate present-day ALLFED donations in QALYs. Independent Unjournal reviews found the research direction valuable but raised potentially conclusion-changing concerns about the comparator, deployment costs, market adaptation, parameter sourcing, and assumed returns to additional funding ([review 1](https://unjournal.pubpub.org/pub/eval1allfed/release/7), [review 2](https://unjournal.pubpub.org/pub/eval2allfed/release/4)). This evidence moves us toward believing ALLFED could be highly effective, but its correlation and limited external validation prevent it from carrying the central estimate.

### Plausible range

The plausible range is **\$0.60-\$1,250/QALY**, equivalent to roughly **\$50-\$100,000 per 80-QALY life**.

The low end would be plausible if advocacy succeeds near CEARCH's estimate, ALLFED's research improves those campaigns, and resilient-food plans work during a severe catastrophe. The high end would be plausible if policy change is much harder than experts expect, plans decay or go unused, market adaptation would have solved much of the problem anyway, or marginal funding mainly maintains work that would otherwise happen. Outside the range, there is some chance of exceptionally large impact and some chance that marginal funding has little or no effect.

The most decision-relevant new evidence would be independently documented policy changes, operational adoption, and funding-sensitive milestones causally connected to ALLFED's work.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_This analysis was revised on July 25th 2026 by GPT-5, with prompts from Impact List staff._

- `Disaster Relief` is the closest available user-facing category even though its baseline models acute response and explicitly excludes preparedness. ALLFED's override replaces cost per QALY, start time, and duration, so the category default is numerically inert. If more catastrophic-resilience organizations are added, create a dedicated category.
- The standard QALY effect is deliberate. The main outside estimate reports expected deaths and DALYs per dollar after combining catastrophe, policy-success, and impact probabilities. A population effect would require an unsupported cost per microprobability of a precisely defined outcome and would blur the period in which a catastrophe might occur with the duration of its consequences.
- The 50-year standard effect remains sensitive to the global time limit until its full window is included. Nuclear and Pandemics also have finite effect windows; only AI Existential Risk currently has an effectively unbounded population-effect window.
- Possible long-term trajectory benefits are folded qualitatively into the 1.36x whole-organization adjustment rather than modeled as a separate population effect. Revisit this if independent evidence supports a distinct long-term pathway.
- The 1.36x factor should be read as approximately 1.4x. Its second decimal keeps the calculation consistent with the published \$17/QALY point estimate; it does not represent corresponding evidentiary precision.
