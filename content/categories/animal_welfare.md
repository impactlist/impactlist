---
id: animal-welfare
name: 'Animal Welfare'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 15
    costPerQALY: 8
---

# Justification of cost per life

_The following analysis was done on November 13th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **\$8 per QALY**  
**Range (plausible):** **\$5–\$150 per QALY**

## Details

**What we model.**  
We anchor “top animal-welfare charities” to large, evidence-based corporate campaigns for **egg-laying hens (cage-free transitions)** and **broiler chickens (Better Chicken Commitment, slower-growing breeds, lower stocking densities)** run by organizations like The Humane League (THL), Mercy for Animals, Compassion in World Farming, and their Open Wing Alliance partners. These are among the best-measured animal interventions and affect very large numbers of animals at relatively low cost ([Open Philanthropy, 2016](https://www.openphilanthropy.org/research/initial-grants-to-support-corporate-cage-free-reforms/); [ACE 2025 THL review](https://animalcharityevaluators.org/charity-review/the-humane-league/)).

### Step 1 — How many animals are helped per dollar?

- **Cage-free hens per \$:** ACE's 2025 CEA for THL's cage-free accountability programs implies **~11 hens helped per dollar** and **~88 "Suffering-Adjusted Days" (SADs) of intense pain averted per dollar** (both highly uncertain) ([ACE 2025](https://animalcharityevaluators.org/charity-review/the-humane-league/)).
- **Cross-checks:**
  - THL's own 2015–2024 retrospective estimates **~2 hens spared from cages per dollar** for its cage-free corporate work (conservative because they count a binary "spared/not spared" rather than hen-years) ([THL 2025](https://forum.effectivealtruism.org/posts/Fbx9hf2e6MaLfoNwD/cost-effectiveness-of-thl-s-corporate-cage-free-campaigns)).
  - A meta-estimate covering 2005–2018 found **9–120 chicken-years affected per \$** across corporate cage-free and broiler campaigns ([Rethink Priorities, 2019](https://rethinkpriorities.org/research-area/corporate-campaigns-affect-9-to-120-years-of-chicken-life-per-dollar-spent/)).
  - Early Open Philanthropy BOTECs suggested very high leverage in the first wave (e.g., **~120 hen-years** per dollar), with the caveat that these were early-movement figures ([Open Philanthropy, 2016](https://www.openphilanthropy.org/research/initial-grants-to-support-corporate-cage-free-reforms/)).

For the _central_ calculation below, we use **11 hens per \$** (ACE) and treat each as **one hen-year** of improved conditions.

### Step 2 — How much welfare (in human-equivalent QALYs) is gained per hen-year?

Rethink Priorities’ **Moral Weight Project** shows how to convert animal welfare changes into human-equivalent DALY/QALY units using **welfare ranges**. Their illustrative chicken example assumes:

1. **Chickens’ welfare range ≈ 10% of humans’**,
2. the negative portion is half of that (5%), and
3. moving from conventional cages to aviaries improves hens’ experienced welfare by **25% of their negative range**.

Under those assumptions, the move confers **~0.0125 human-equivalent QALYs per chicken-year** (i.e., 1.25% of a human healthy year) ([Rethink Priorities, explainer with calculation](https://rethinkpriorities.org/research-area/an-introduction-to-the-moral-weight-project/); see also their [welfare range estimates](https://rethinkpriorities.org/research-area/welfare-range-estimates/)). This direction is supported by direct pain-hour measurements from the **Welfare Footprint Project**, which finds large reductions in time spent in disabling and hurtful pain when hens move to cage-free systems ([Welfare Footprint — Laying hens](https://welfarefootprint.org/laying-hens/); accessible summary in [Our World in Data](https://ourworldindata.org/do-better-cages-or-cage-free-environments-really-improve-the-lives-of-hens)).

> **Central conversion used here:** **0.0125 human-equivalent QALYs per hen-year** from cage-free vs. caged systems.

### Step 3 — QALYs per dollar and cost per QALY

Using the central inputs above:

- **QALYs per \$ = (hens helped per \$) × (QALYs per hen-year)**
  = **11 × 0.0125 = 0.1375 QALYs per \$**
- **Cost per QALY = \$1 / 0.1375 ≈ \$7.3 per QALY** → rounded conservatively to **\$8 per QALY**.

### Cross-check using pain-day (SAD) data

ACE's estimate of **~88 SADs averted per \$** for cage-free accountability can be mapped to QALYs with a judgment about the intensity of "intense pain." If we treat a day of intense pain as a **0.5 QALY-day loss** (range **0.3–0.7**, consistent with severe pain valuations), then:

- **QALYs per \$ ≈ 88 × 0.5 / 365 = 0.12 QALYs per \$**,
- **Cost per QALY ≈ \$8.3**, close to the hen-year method above ([ACE 2025](https://animalcharityevaluators.org/charity-review/the-humane-league/)).

### Why the range?

- **Animals affected per \$ varies** by campaign, region, and counterfactual assumptions (e.g., **~2 hens/\$** in THL's conservative look-back vs **~11 hens/\$** in ACE's modeling; historical ranges **9–120** hen-years/\$) ([THL 2025](https://forum.effectivealtruism.org/posts/Fbx9hf2e6MaLfoNwD/cost-effectiveness-of-thl-s-corporate-cage-free-campaigns); [ACE 2025](https://animalcharityevaluators.org/charity-review/the-humane-league/); [Rethink Priorities 2019](https://rethinkpriorities.org/research-area/corporate-campaigns-affect-9-to-120-years-of-chicken-life-per-dollar-spent/)).
- **Moral weights (welfare ranges) are uncertain.** RP's framework gives chickens substantial but uncertain fractions of human welfare range (we center on **10%** for hens). A **2%–15%** range for hens produces **0.0025–0.01875** QALYs per hen-year ([RP explainer/sequence](https://rethinkpriorities.org/research-area/an-introduction-to-the-moral-weight-project/); [welfare range overview](https://rethinkpriorities.org/research-area/welfare-range-estimates/)).
- **Intervention mix.** Broiler reforms likely avert dozens of hours of intense pain per bird at low cost (e.g., **15–100 hours per bird** for slower-growing breeds at ~**\$1/kg** higher cost in Europe), reinforcing the order of magnitude ([Nature Food commentary—news release](https://www.eurekalert.org/news-releases/1093806); summary: [SEI](https://www.sei.org/publications/animal-welfare-food-european-chicken-commitment/) and [Vox](https://www.vox.com/future-perfect/461815/broiler-chicken-animal-welfare-footprint)).
- **Compliance and durability.** Accountability can lag, and some commitments backslide, although structural shifts (e.g., cage-free barns) are more durable than "tweak" changes ([ACE 2025](https://animalcharityevaluators.org/charity-review/the-humane-league/)).

Putting these together yields a **plausible corridor of ~\$5–\$150 per QALY**, with most central combinations landing in the **single- to low-two-digit dollars per QALY**.

## Assumptions about species weights (relative to humans)

The point estimate above is driven by **chicken** interventions. For clarity:

- **Chickens (hens & broilers):** welfare range taken as **~10%** of humans in the central case (RP framework), giving **0.0125 QALYs per hen-year** for cage-free vs. caged as above ([RP explainer](https://rethinkpriorities.org/research-area/an-introduction-to-the-moral-weight-project/)).
- **Fish (for comparison, not in the central calc):** RP’s approach suggests non-negligible but likely **lower welfare ranges** than chickens; for sensitivity checks we consider **1–5%** of humans depending on species (see RP’s [welfare range estimates](https://rethinkpriorities.org/research-area/welfare-range-estimates/) and broader discussion on interspecies comparisons in [80,000 Hours interview with Bob Fischer](https://80000hours.org/podcast/episodes/bob-fischer-comparing-animal-welfare-moral-weight/)).

## Notes on what “top charities” typically do

- **Cage-free egg transitions:** Large pain-time reductions documented by the **Welfare Footprint Project** ([Laying hens](https://welfarefootprint.org/laying-hens/)); synthesized overview in [Our World in Data](https://ourworldindata.org/do-better-cages-or-cage-free-environments-really-improve-the-lives-of-hens).
- **Broiler chicken reforms:** Slower-growing breeds and better conditions cut disabling/excruciating pain substantially; see **Better Chicken Commitment** criteria and summaries ([Open Philanthropy—broiler welfare](https://www.openphilanthropy.org/focus/farm-animal-welfare/broiler-chicken-welfare/); [The Humane League UK](https://thehumaneleague.org.uk/article/state-of-the-chicken-industry-2022); [SEI/Nature Food summary](https://www.sei.org/publications/animal-welfare-food-european-chicken-commitment/)).

**Bottom line:** When we express animal welfare gains in a **human-equivalent QALY** currency using transparent moral-weight assumptions, the best-evidenced animal-welfare campaigns appear **extremely cost-effective**—commonly **single-digit dollars per QALY** in central scenarios, and still competitive with global development on conservative assumptions.

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes

## Start time & duration (for modeling)

- **Start time:** **1.5 years** (range **0.5–3 years**).  
  _Why:_ Corporate welfare commitments (e.g., cage-free eggs, higher-welfare broilers) typically begin to affect animals after companies modify supply chains and facilities; evaluators note a delay between policy wins and realized animal outcomes. See discussions of reporting lags and implementation timelines in [THL’s cage-free cost-effectiveness write-up](https://forum.effectivealtruism.org/posts/Fbx9hf2e6MaLfoNwD/cost-effectiveness-of-thl-s-corporate-cage-free-campaigns) and [ACE’s 2025 review of The Humane League](https://animalcharityevaluators.org/charity-review/the-humane-league/).

- **Duration of benefit:** **10 years** (range **5–15 years**).  
  _Why:_ Once firms convert to cage-free systems or lock in husbandry/slaughter changes, benefits recur across flock cycles and years; evaluators judge backsliding risk lower for barn-system shifts than for “tweak” reforms. See [ACE](https://animalcharityevaluators.org/charity-review/the-humane-league/) (notes on durability and backsliding risk).
