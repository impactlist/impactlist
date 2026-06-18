---
id: disaster-relief
name: 'Disaster Relief'
effects:
  - effectId: standard
    startTime: 0
    windowLength: 20
    costPerQALY: 4_000
---

# Justification of cost per life

{{STANDARD_QALY_METHOD_NOTE}}

## Description of effect

This effect captures welfare gains from **acute humanitarian response** after disasters, outbreaks, and sudden displacement crises: emergency health care, treatment of acute malnutrition, outbreak control, emergency WASH (water, sanitation, and hygiene), cash/basic-needs assistance, and related rapid relief for displaced or crisis-affected populations. It does **not** include long-run reconstruction, disaster-risk reduction, or anticipatory action.

## What kinds of charities are we modeling?

These estimates represent **strong acute-response charities** that can move resources quickly in emergencies — organizations focused on emergency health, nutrition, WASH, cash/basic-needs support, or coordinated field response. They are not meant to represent the very best disease-specific emergency-health opportunity, nor the average dollar spent across the whole humanitarian system.

:::details{title="What we exclude"}
We are **not** modeling:

- long-run reconstruction or resilience-building,
- disaster preparedness or anticipatory action,
- conflict prevention or peacebuilding,
- ordinary development aid delivered outside an acute crisis.

Recipients focused mainly on preparedness, resilience, or reconstruction should receive separate recipient-level modeling rather than inheriting this acute-response default.
:::

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$4,000 (\$400–\$40,000)
- **Start time:** 0 years
- **Duration:** 20 years

This category is best modeled as a **portfolio of emergency-response activities**, not a single intervention. A few emergency-health niches (acute-malnutrition treatment, reactive cholera vaccination in severe outbreaks) are excellent, but a real charity also spends on WASH, cash, primary care, logistics, and coordination, where the evidence is thinner and per-QALY costs are higher. The central estimate is the **geometric midpoint** of a plausibly optimistic \$800/QALY portfolio and a plausibly pessimistic \$20,000/QALY portfolio, $\sqrt{800 \times 20{,}000} = 4{,}000$ (Assumptions 10–11). The plausible range runs **wider** than those two anchors — down to \$400 and up to \$40,000 — because the humanitarian evidence base is unusually thin (Assumption 1) and the dominant uncertainties are structural, not parameter noise: marginal money could land on a much more tightly focused emergency-health charity than the optimistic anchor assumes, or on a much worse-timed portfolio than the pessimistic anchor — one whose dollars arrive late, into a lower-risk setting, or into an already-saturated, highly salient crisis (Assumption 9). The biggest swing factors are the **portfolio mix** (how much marginal money buys highly targeted health work versus broader assistance) and **crisis selection and timing**.

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. The evidence base for humanitarian cost-effectiveness is unusually thin. A 2020 systematic review found only 11 full economic evaluations of health-related humanitarian programmes in LMIC crises, and a 2017 review found 345 studies on public-health interventions in humanitarian crises but major quality gaps. ([Makhani et al. 2020](https://pubmed.ncbi.nlm.nih.gov/31697373/), [Blanchet et al. 2017](https://research.vu.nl/en/publications/evidence-on-public-health-interventions-in-humanitarian-crises))
2. Some targeted emergency health and nutrition interventions are very cost-effective. In conflict-affected northern Mali, decentralized acute-malnutrition treatment cost about \$53-\$60 per DALY averted, versus \$173 per DALY for facility-only care. ([Cichon et al. 2025](https://bmcpublichealth.biomedcentral.com/articles/10.1186/s12889-025-21411-5))
3. Reactive cholera vaccination can also be cost-effective in high-risk outbreak settings. A Malawi campaign cost about \$391-\$738 per DALY averted depending on whether indirect protection is counted. ([Ilboudo et al. 2021](https://resource-allocation.biomedcentral.com/articles/10.1186/s12962-021-00270-y))
4. Similar interventions can be much worse in lower-risk settings. A pre-emptive cholera campaign in a Thai refugee camp cost about \$69,892 per DALY in the base case and \$15,666 per DALY in a higher-incidence sensitivity case. ([Wallace et al. 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11598253/))
5. High-visibility international search-and-rescue is often one of the least cost-effective parts of disaster response. A BMJ review concludes that most earthquake rescues are local rather than international, and the IFRC's World Disasters Report notes that U.S. FEMA teams in Haiti in 2010 rescued 47 survivors at a cost of \$51 million. ([Rom & Kelman 2020](https://gh.bmj.com/content/5/12/e002398), [IFRC 2013](https://www.ifrc.org/sites/default/files/WDR-2013.pdf))
6. Cash-based humanitarian aid is often more administratively efficient than in-kind aid, but rigorous evidence on health outcomes remains limited and mixed. ([Doocy & Tappis 2017](https://journals.sagepub.com/doi/full/10.4073/csr.2017.17), [van Daalen et al. 2022](https://gh.bmj.com/content/7/1/e007902))
7. WASH interventions are central in humanitarian crises, but the evidence base remains limited; diarrheal disease is the most studied outcome and cholera outbreaks dominate much of the crisis-specific literature. ([Alareqi et al. 2024](https://publish.kne-publishing.com/index.php/ijph/article/view/14918))
8. The cited humanitarian CEAs mostly report **DALYs** rather than **QALYs**. For this level of precision, we treat them as roughly comparable because the emergency interventions used as anchors are dominated by deaths averted and short-lived morbidity, not by long-lived quality-of-life states.
9. Marginal donations to disaster relief are usually less cost-effective than the best intervention-level CEAs suggest, because emergency response is highly time-sensitive and capacity-constrained. WHO emphasizes flexible, upfront funding so life-saving activities can begin within 24-72 hours, while disaster donations are concentrated in a small minority of media-covered disasters and are weaker for less salient crises or for crises that follow closely on the heels of another major event that has already captured attention and funding. ([WHO 2026](https://cdn.who.int/media/docs/default-source/documents/emergencies/2026-appeals/who-health-emergency-appeal-snapshot-2026.pdf), [Jayaraman et al. 2023](https://academic.oup.com/oep/article/75/4/902/7236851))
10. A plausible **optimistic** charity-level portfolio bound is roughly \$800/QALY, not a few hundred dollars, because a general disaster-relief charity will only put part of its budget into the very best emergency-health niches and must also absorb logistics, coordination, and targeting losses (see Details section for justification).
11. A plausible **pessimistic** charity-level portfolio bound is roughly \$20,000/QALY for a broad acute-response portfolio with substantial spending on less directly mortality-reducing assistance and on hard-to-avoid response frictions (see Details section for justification).

## Details

### Cost per QALY

The published evidence ranges over two orders of magnitude depending on the activity, which is why we anchor to a portfolio rather than a single number. On a strict health basis, some parts of disaster relief look excellent and others look much worse:

- Acute-malnutrition treatment in crisis settings can be around **\$50-\$200 per DALY** (Assumption 2).
- Reactive cholera vaccination in a severe outbreak can be around **\$400-\$700 per DALY** (Assumption 3).
- Pre-emptive cholera vaccination in a lower-incidence refugee-camp setting came out at **\$15,666-\$69,892 per DALY** (Assumption 4).
- International urban search-and-rescue is expensive and often arrives too late to drive most live rescues (Assumption 5).

The hard part is everything in the middle: emergency WASH, cash/basic-needs assistance, primary care, logistics, and coordination. These activities are often genuinely important, and cash in particular is often cheaper to deliver than in-kind aid, but the literature does not support treating them like GiveWell-style child-survival interventions. Reviews consistently find that the evidence is thinner and noisier than in ordinary global health (Assumptions 1, 6, and 7).

There is also an important gap between **intervention-level** and **marginal donor-level** cost-effectiveness. WHO's 2026 emergency appeal describes a system under severe funding pressure, so the right claim is **not** that humanitarian response is universally flush with money. But marginal philanthropy still faces unusually strong timing and allocation frictions: some life-saving response has to begin within **24-72 hours**, logistics and coordination are binding constraints, and charitable giving is highly concentrated in a small number of salient disasters (Assumption 9). That pushes a charity-level estimate materially above the best published program-level CEAs.

We therefore anchor the central estimate to two **plausible portfolio scenarios** — an optimistic **\$800/QALY** and a pessimistic **\$20,000/QALY** — and take their geometric midpoint, $\sqrt{800 \times 20{,}000} = 4{,}000$, because uncertainty this wide is multiplicative rather than additive. The published plausible range is wider than these two anchors (\$400–\$40,000); the anchors locate the center, while the tails capture charities better-focused or worse-timed than either anchor assumes.

:::details{title="The two portfolio scenarios and the geometric midpoint"}
- **Optimistic portfolio:** about **\$800/QALY**. This already assumes an unusually strong charity concentrated toward the best emergency-health opportunities, but it is still several times worse than the very best program-level CEAs (Assumption 10).
- **Pessimistic portfolio:** about **\$20,000/QALY**. This is much better than the worst single published disaster-response components, but plausible for a broad or poorly timed relief portfolio where a lot of spending goes to less directly life-saving assistance or to hard logistics (Assumption 11).

Because the uncertainty spans orders of magnitude and is multiplicative rather than additive, the most sensible central estimate is the **geometric midpoint** of those two scenarios:

$$
\sqrt{800 \times 20{,}000} = 4{,}000
$$

So the portfolio-anchor method gives **\$4,000/QALY**.

The published plausible range, \$400–\$40,000, extends a factor of two beyond each anchor (keeping \$4,000 as its geometric center, $\sqrt{400 \times 40{,}000} = 4{,}000$). The extra width is not a sweep of independent parameters but room for the structural tails: a near-best charity that puts most marginal money into acute-malnutrition treatment or reactive cholera vaccination could approach the better end of the program-level evidence even after frictions (the \$50–\$700/DALY range in Assumptions 2–3 sits below \$400/QALY), while a portfolio whose dollars arrive late, into a lower-risk setting, or into an already-saturated salient crisis could exceed \$20,000 — individual components such as pre-emptive cholera vaccination (\$69,892/DALY, Assumption 4) and international search-and-rescue (Assumption 5) already run far higher.

These anchors rely mostly on studies reporting **cost per DALY averted** rather than **cost per QALY gained**. That is acceptable here: the anchors are mostly mortality-heavy interventions such as acute-malnutrition treatment and outbreak control, where the difference between DALYs averted and QALYs gained is small relative to the much larger uncertainty about targeting, timing, and portfolio mix (Assumption 8).
:::

A stylized component blend lands at about **\$3,900/QALY**, very close to the anchor estimate.

:::details{title="The component-blend cross-check"}
As a rough check, suppose a strong general disaster-relief charity looks like this:

- **Roughly 10%** of spending in very strong emergency health/nutrition niches at **\$800/QALY**
- **Roughly 25%** in reasonably targeted WASH, primary care, and outbreak-control work at **\$3,000/QALY**
- **Roughly 40%** in cash, shelter, and broad basic-needs support at **\$10,000/QALY**
- **Roughly 25%** in logistics, coordination, and lower-leverage response at **\$25,000/QALY**

Then overall portfolio cost-effectiveness is:

$$
\text{Cost per QALY} = \frac{1}{0.10/800 + 0.25/3{,}000 + 0.40/10{,}000 + 0.25/25{,}000} \approx \$3{,}900
$$

This is the weighted harmonic mean: we convert each component to QALYs per dollar, add them, and then invert, because cost-per-QALY ratios do not average linearly. This cross-check is only illustrative; the spending shares are not measured budget shares from a single organization. But it lands very close to the **\$4,000/QALY** anchor estimate, which is reassuring.
:::

### Start time

The 0-year start time reflects that good disaster relief works immediately or not at all. The main value comes from rapid response in the first hours, days, or months of a crisis.

### Duration

The 20-year duration is a compromise for a mixed portfolio. Some benefits are very short-run improvements in health and living conditions, while others are deaths averted among children and adults with decades of life ahead of them. A 20-year window is a reasonable middle ground for discounting purposes without pretending that all benefits either vanish within months or last a full child lifetime.

## Key uncertainties

1. **Portfolio mix.** The biggest question is what fraction of marginal funding buys highly targeted health interventions versus broader assistance, logistics, and coordination.
2. **Crisis selection, salience, and timing.** The same intervention can be excellent in a severe outbreak and much less effective when money arrives late, in a lower-risk setting, or into a highly salient crisis that is already attracting heavy funding.
3. **How to value non-health benefits.** Shelter, cash, and protection work often matter a lot to affected people, but their benefits are harder to convert into QALYs than mortality-focused health programmes.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on April 6th 2026 by GPT-5, with prompts from Impact List staff._

- The category as currently used in the repo covers a broader set of acute humanitarian-response recipients than the phrase "disaster relief" suggests, including outbreak and conflict-displacement response. The public description now reflects that broader usage.
- If the site later splits this into separate categories like `acute-humanitarian-health` and `general-disaster-relief`, the former would probably deserve a materially lower cost-per-QALY than this blended estimate.
