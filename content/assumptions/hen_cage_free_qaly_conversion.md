---
id: hen-cage-free-qaly-conversion
name: 'QALY-equivalent hen welfare gain from cage-free reforms'
---

## How many human-equivalent QALYs does moving a laying hen from conventional cages to aviaries create per hen-year?

We estimate that moving a laying hen from conventional cages to aviaries creates about **0.0415 human-equivalent QALYs per hen-year**, with a {{PLAUSIBLE_RANGE}} of about **0.0075-0.08**.

This assumption bridges animal-welfare evidence and the QALY framework used throughout Impact List. No single study measures it directly. We build it from three components:

$$0.332 \times 0.5 \times 0.25 = 0.0415$$

- **0.332** = central estimate of a chicken's welfare range relative to a human's
- **0.5** = share of that welfare range that lies below a neutral point
- **0.25** = share of the negative range removed by moving from conventional cages to aviaries

The most uncertain component is the final one: how much of a hen's negative welfare range is removed by the reform. But the structure of the calculation is clear, and each term can be justified.

### 1. Chicken welfare range: 0.332 centrally

Rethink Priorities' Moral Weight Project estimated chickens' sentience-adjusted welfare range at **0.332** of a human's at the median, and we use that as the central value. For varying this term we use **0.1-0.46**, spanning a more skeptical lower bound up to RP's later, less-sentience-adjusted default. ([RP Welfare Range Estimates](https://rethinkpriorities.org/research-area/welfare-range-estimates/), [RP Farmed Animal Recipients Tool](https://rethinkpriorities.org/research-area/distributing-resources-across-farmed-animal-recipients/))

:::details{title="Why 0.332 rather than RP's 0.46 default"}
RP's later farmed-animal allocation tool uses **0.46** as a practical default when sentience is handled separately rather than folded into a single all-things-considered multiplier. Our model here does not separately represent sentience probability and experience intensity, so we use **0.332** as the single central number. The **0.46** figure sits near the top of the plausible range rather than at the center.
:::

### 2. Why use 0.5 for the negative share of the welfare range?

The 0.5 term assumes the welfare range is roughly symmetric around a neutral point, so the negative portion makes up half the total range. This is not a claim that hens spend literally half their lives below neutral. We need to map "fraction of negative welfare removed" into the total range, and nothing strongly suggests neutral sits far from the midpoint, so we split it evenly. If the negative portion were larger or smaller than half, the final QALY conversion would move proportionally.

### 3. Why use 25% for the cage-to-aviary improvement?

This is the key judgment call. Following Fischer's DALY-conversion framework, we express the reform as the share of a hen's negative welfare range that it removes. So the question is not whether aviaries are good in absolute terms. It is how much better they are than conventional cages. ([Fischer 2023](https://www.law.georgetown.edu/public-policy-journal/wp-content/uploads/sites/23/2024/02/Bob-Fischer.pdf))

We use **25% of the negative welfare range**. That is high enough to reflect the large pain reductions welfare science finds when hens leave cages, but low enough to reflect that aviaries are still far from ideal and do not eliminate the major welfare harms.

:::details{title="Welfare-science evidence behind the 25% estimate"}
Welfare Footprint Institute's laying-hen analysis shows aviaries are a large improvement over conventional cages. Relative to cages, aviaries avert at least **275 hours** of disabling pain, **2,313 hours** of hurtful pain, and **4,645 hours** of annoying pain — and WFI notes these estimates leave out several likely benefits. ([Welfare Footprint Institute](https://welfarefootprint.org/laying-hens/))

[Our World in Data](https://ourworldindata.org/do-better-cages-or-cage-free-environments-really-improve-the-lives-of-hens) gives an accessible summary of the same evidence. The basic picture: conventional cages are very bad, aviaries are substantially better, and aviaries are still far from ideal. A central estimate around the lower-middle of the range reflects both the large measured pain reductions and the harms that remain.
:::

### 4. Result and sensitivity

The central terms multiply to the headline figure: $0.332 \times 0.5 \times 0.25 = 0.0415$ human-equivalent QALYs per hen-year. Two of the three terms are genuinely uncertain and comparably important. The chicken welfare range (**0.1-0.46**) and the cage-to-aviary bridge (**15%-35%**) each move the conversion by a similar amount on their own. We get the published plausible range, **0.0075-0.08**, by varying both together rather than holding either fixed. It is wide enough to also cover residual uncertainty in the framework itself: the symmetry convention and the welfare-range methodology.

:::details{title="Parameter checks for the two uncertain terms"}
Varying the chicken welfare-range term alone (bridge held at 25%):

$$0.1 \times 0.5 \times 0.25 = 0.0125$$
$$0.46 \times 0.5 \times 0.25 = 0.0575$$

Varying the cage-to-aviary bridge term alone (welfare range held at 0.332):

$$0.332 \times 0.5 \times 0.15 = 0.0249$$
$$0.332 \times 0.5 \times 0.35 = 0.0581$$

Varying both together gives the published plausible range:

$$0.1 \times 0.5 \times 0.15 = 0.0075$$
$$0.46 \times 0.5 \times 0.35 \approx 0.08$$
:::

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on April 6th 2026 by GPT-5.4 and Claude Opus 4.6, with prompts from Impact List staff._
