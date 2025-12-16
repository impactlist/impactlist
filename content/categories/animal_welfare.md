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

_The following analysis was done on November 13th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare improvements for farmed animals through corporate campaigns, primarily cage-free egg transitions and broiler chicken welfare reforms (Better Chicken Commitment, slower-growing breeds, lower stocking densities). We express animal welfare gains in human-equivalent QALYs using transparent moral-weight assumptions from the Rethink Priorities Moral Weight Project.

## Point Estimates

- **Cost per QALY:** \$8 (\$5–\$150)
- **Start time:** 1 year
- **Duration:** 15 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. Top animal-welfare charities (The Humane League, Mercy for Animals, Compassion in World Farming) achieve approximately 11 hens helped per dollar through cage-free accountability programs. ([ACE 2025](https://animalcharityevaluators.org/charity-review/the-humane-league/))
2. Historical estimates of corporate campaign effectiveness range from 2–120 chicken-years affected per dollar. ([THL 2025](https://forum.effectivealtruism.org/posts/Fbx9hf2e6MaLfoNwD/cost-effectiveness-of-thl-s-corporate-cage-free-campaigns), [Rethink Priorities 2019](https://rethinkpriorities.org/research-area/corporate-campaigns-affect-9-to-120-years-of-chicken-life-per-dollar-spent/), [Open Philanthropy 2016](https://www.openphilanthropy.org/research/initial-grants-to-support-corporate-cage-free-reforms/))
3. Chickens' welfare range is approximately 10% of humans', with the negative portion being half of that (5%). ([Rethink Priorities Moral Weight Project](https://rethinkpriorities.org/research-area/an-introduction-to-the-moral-weight-project/))
4. Moving from conventional cages to aviaries improves hens' experienced welfare by approximately 25% of their negative range, yielding ~0.0125 human-equivalent QALYs per chicken-year. ([Rethink Priorities](https://rethinkpriorities.org/research-area/welfare-range-estimates/))
5. Cage-free systems produce large reductions in time spent in disabling and hurtful pain compared to caged systems. ([Welfare Footprint Project](https://welfarefootprint.org/laying-hens/), [Our World in Data](https://ourworldindata.org/do-better-cages-or-cage-free-environments-really-improve-the-lives-of-hens))
6. Broiler reforms (slower-growing breeds) avert 15–100 hours of intense pain per bird at approximately \$1/kg higher production cost. ([Nature Food/SEI](https://www.sei.org/publications/animal-welfare-food-european-chicken-commitment/), [Vox](https://www.vox.com/future-perfect/461815/broiler-chicken-animal-welfare-footprint))
7. A day of intense animal pain represents approximately 0.5 QALY-days lost (range 0.3–0.7), consistent with severe pain valuations.
8. Once firms convert to cage-free systems, benefits recur across flock cycles for 5–15 years with lower backsliding risk than for minor reforms. ([ACE 2025](https://animalcharityevaluators.org/charity-review/the-humane-league/))

## Details

### Cost per QALY

The point estimate (\$8/QALY) and range (\$5–\$150/QALY) are derived from two converging methods.

**Method 1 — Hen-years approach:**

Using ACE's estimate of 11 hens helped per dollar (Assumption 1) and the Rethink Priorities moral weight conversion of 0.0125 QALYs per hen-year (Assumptions 3–4):

$$\text{QALYs per } \$1 = 11 \times 0.0125 = 0.1375$$
$$\text{Cost per QALY} = \dfrac{\$1}{0.1375} \approx \$7.30 \rightarrow \$8$$

**Method 2 — Pain-days approach:**

ACE estimates approximately 88 Suffering-Adjusted Days (SADs) of intense pain averted per dollar. Using 0.5 QALY-days lost per day of intense pain (Assumption 7):

$$\text{QALYs per } \$1 = \dfrac{88 \times 0.5}{365} \approx 0.12$$
$$\text{Cost per QALY} \approx \$8.30$$

Both methods converge on approximately \$8/QALY.

**Why the range:**

The wide range (\$5–\$150/QALY) reflects:

- Variation in animals affected per dollar (2–120 chicken-years historically, per Assumption 2)
- Uncertainty in moral weights (2%–15% welfare range for hens produces 0.0025–0.01875 QALYs per hen-year)
- Compliance and durability uncertainty (Assumption 8)

### Start Time

The 1-year start time reflects the delay between corporate policy wins and realized animal outcomes, as companies modify supply chains and facilities (Assumption 8).

### Duration

The 15-year duration reflects the persistence of welfare improvements once firms convert to cage-free systems or lock in husbandry changes (Assumption 8). Structural shifts like cage-free barns are more durable than minor reforms.

---

{{CONTRIBUTION_NOTE}}

# Internal Notes
