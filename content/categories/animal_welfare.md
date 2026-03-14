---
id: animal-welfare
name: 'Animal Welfare'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 15
    costPerQALY: 2
---

# Justification of cost per life

_The following analysis was updated on March 13th 2026, written by GPT 5.4 and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare improvements for farmed animals through corporate campaigns, primarily cage-free egg transitions and broiler chicken welfare reforms (Better Chicken Commitment, slower-growing breeds, lower stocking densities). We express animal welfare gains in human-equivalent QALYs using welfare-range estimates from the Rethink Priorities Moral Weight Project.

## Point Estimates

- **Cost per QALY:** \$2 (\$0.14–\$40)
- **Start time:** 1 year
- **Duration:** 15 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. Top animal-welfare charities (The Humane League, Mercy for Animals, Compassion in World Farming) achieve approximately 11 hens helped per dollar through cage-free accountability programs. ([ACE 2025](https://animalcharityevaluators.org/charity-review/the-humane-league/))
2. Historical estimates of corporate campaign effectiveness range from 2–120 chicken-years affected per dollar. ([THL 2025](https://forum.effectivealtruism.org/posts/Fbx9hf2e6MaLfoNwD/cost-effectiveness-of-thl-s-corporate-cage-free-campaigns), [Rethink Priorities 2019](https://rethinkpriorities.org/research-area/corporate-campaigns-affect-9-to-120-years-of-chicken-life-per-dollar-spent/), [Open Philanthropy 2016](https://www.openphilanthropy.org/research/initial-grants-to-support-corporate-cage-free-reforms/))
3. Rethink Priorities' welfare-range work puts chickens' sentience-adjusted welfare range at 0.332 of a human's at the median estimate, and RP's later farmed-animal allocation tool uses 0.46 as its default chicken welfare range when sentience is handled separately. Because this model uses a single all-things-considered multiplier rather than separate sentience and experience-rate parameters, we use approximately 0.33 as the baseline chicken welfare range and treat approximately 0.1-0.46 as the sensitivity range. ([RP Welfare Range Estimates](https://rethinkpriorities.org/publications/welfare-range-estimates), [RP Farmed Animal Tool](https://rethinkpriorities.org/research-area/distributing-resources-across-farmed-animal-recipients/))
4. Moving from conventional cages to aviaries improves hens' experienced welfare by approximately 25% of their negative range. Under the 0.332 baseline welfare range and a symmetry assumption (i.e. negative experiences make up half the total welfare range), that yields approximately 0.0415 human-equivalent QALYs per chicken-year: 0.332 x 0.5 x 0.25. Under the 0.1-0.46 sensitivity range from Assumption 3, that implies approximately 0.0125-0.0575 human-equivalent QALYs per chicken-year. ([Rethink Priorities](https://rethinkpriorities.org/research-area/welfare-range-estimates/))
5. Cage-free systems produce large reductions in time spent in disabling and hurtful pain compared to caged systems. ([Welfare Footprint Project](https://welfarefootprint.org/laying-hens/), [Our World in Data](https://ourworldindata.org/do-better-cages-or-cage-free-environments-really-improve-the-lives-of-hens))
6. Broiler reforms (slower-growing breeds) likely add further value on top of cage-free campaigns by reducing severe pain from lameness, contact dermatitis, and fast growth; we do not need to rely on those gains for the baseline estimate, which keeps the calculation conservative. ([Nature Food/SEI](https://www.sei.org/publications/animal-welfare-food-european-chicken-commitment/), [Vox](https://www.vox.com/future-perfect/461815/broiler-chicken-animal-welfare-footprint))
7. Once firms convert to cage-free systems, benefits recur across flock cycles for 5–15 years with lower backsliding risk than for minor reforms. ([ACE 2025](https://animalcharityevaluators.org/charity-review/the-humane-league/))

## Details

### Cost per QALY

The point estimate (\$2/QALY) and range (\$1-\$100/QALY) are derived from a cage-free baseline using RP's chicken welfare-range estimates.

### Hen-years approach

Using ACE's estimate of 11 hens helped per dollar (Assumption 1) and the updated welfare conversion of 0.0415 QALYs per hen-year (Assumptions 3-4):

$$\text{QALYs per } \$1 = 11 \times 0.0415 = 0.4565$$
$$\text{Cost per QALY} = \dfrac{\$1}{0.4565} \approx \$2.19 \rightarrow \$2$$

### Why use 0.33?

RP's welfare-range report gives 0.332 as its sentience-adjusted median estimate for chickens (Assumption 3).

RP's newer farmed-animal tool reports one useful comparison point:

- **0.46** as the default RP chicken welfare range when sentience is handled separately

Because this cause model does not separately model sentience probabilities or rates of experience, the cleanest single-number baseline is the 0.332 sentience-adjusted central estimate. It is somewhat conservative relative to RP's 0.46 default in the newer tool, while remaining close to RP's core published estimate.

### Why the range

The range follows directly from Assumptions 2-4.

**Pessimistic end:**

- 2 chicken-years affected per dollar
- 0.0125 QALYs per chicken-year

$$\text{QALYs per } \$1 = 2 \times 0.0125 = 0.025$$
$$\text{Cost per QALY} = \dfrac{\$1}{0.025} = \$40$$

**Optimistic end:**

- 120 chicken-years affected per dollar
- 0.0575 QALYs per chicken-year

$$\text{QALYs per } \$1 = 120 \times 0.0575 = 6.9$$
$$\text{Cost per QALY} = \dfrac{\$1}{6.9} \approx \$0.14$$

### Start Time

The 1-year start time reflects the delay between corporate policy wins and realized animal outcomes, as companies modify supply chains and facilities (Assumption 7).

### Duration

The 15-year duration reflects the persistence of welfare improvements once firms convert to cage-free systems or lock in husbandry changes (Assumption 7). Structural shifts like cage-free barns are more durable than minor reforms.

{{CONTRIBUTION_NOTE}}

# Internal Notes
