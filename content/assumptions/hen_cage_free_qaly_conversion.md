---
id: hen-cage-free-qaly-conversion
name: 'QALY-equivalent hen welfare gain from cage-free reforms'
---

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High) and Claude Opus 4.6 (Max), with prompts from Impact List staff._

## How many human-equivalent QALYs does moving a laying hen from conventional cages to aviaries create per hen-year?

We estimate that moving a laying hen from conventional cages to aviaries creates about **0.0415 human-equivalent QALYs per hen-year**, with a practical range of about **0.0125-0.0575**.

This assumption is the bridge between animal-welfare evidence and the QALY framework used throughout Impact List. It is not directly observed in a single study. Instead, it is constructed from three components:

$$0.332 \times 0.5 \times 0.25 = 0.0415$$

- **0.332** = central estimate of a chicken's welfare range relative to a human's
- **0.5** = share of that welfare range that lies below a neutral point
- **0.25** = share of the negative range removed by moving from conventional cages to aviaries

The most uncertain component is the final one: how much of a hen's negative welfare range is removed by the reform. But the structure of the calculation is clear, and each term can be justified.

### 1. Chicken welfare range: 0.332 centrally

Rethink Priorities' Moral Weight Project estimated chickens' sentience-adjusted welfare range at **0.332** of a human's at the median. RP's later farmed-animal allocation tool uses **0.46** as a practical default when sentience is handled separately rather than folded into a single all-things-considered multiplier. ([RP Welfare Range Estimates](https://rethinkpriorities.org/research-area/welfare-range-estimates/), [RP Farmed Animal Recipients Tool](https://rethinkpriorities.org/research-area/distributing-resources-across-farmed-animal-recipients/))

For the animal-welfare category, the cleanest single-number central estimate is **0.332**, because the model is not separately representing sentience probability and experience intensity. For sensitivity analysis, **0.1-0.46** is a practical range that spans a more skeptical lower bound and RP's later, less-sentience-adjusted default.

### 2. Why use 0.5 for the negative share of the welfare range?

The `0.5` term assumes the welfare range is roughly symmetric around a neutral point, so the negative portion makes up half the total range.

This is a modeling convention rather than a directly measured fact. The point is not that hens literally spend half their lives in negative welfare and half in positive welfare. The point is that once a total welfare range is specified, and there is no strong additional argument that neutral is far from the midpoint, a symmetric split is the cleanest default way to map "fraction of negative welfare removed" into the total welfare range.

If someone thought the negative portion of the range should be larger or smaller than half, the final QALY conversion would move proportionally.

### 3. Why use 25% for the cage-to-aviary improvement?

This is the key judgment call.

Fischer's DALY-conversion framework suggests expressing an animal-welfare reform as the share of an animal's negative welfare range that the reform removes. On that framing, the question is not whether aviaries are good in absolute terms, but how much better they are than conventional cages. ([Fischer 2023](https://www.law.georgetown.edu/public-policy-journal/wp-content/uploads/sites/23/2024/02/Bob-Fischer.pdf))

Welfare Footprint Institute's laying-hen analysis shows that aviaries are a large improvement over conventional cages. Relative to cages, aviaries avert at least:

- **275 hours** of disabling pain
- **2,313 hours** of hurtful pain
- **4,645 hours** of annoying pain

and WFI explicitly notes that these estimates leave out several likely benefits. ([Welfare Footprint Institute](https://welfarefootprint.org/laying-hens/))

[Our World in Data](https://ourworldindata.org/do-better-cages-or-cage-free-environments-really-improve-the-lives-of-hens) gives a good accessible summary of the same evidence. The basic picture is:

- Conventional cages are very bad
- Aviaries are substantially better
- Aviaries are still far from ideal

That makes **25% of the negative welfare range** a reasonable central estimate. It is high enough to reflect the large pain reductions found by WFI, but low enough to reflect that aviaries do not come close to eliminating all major welfare harms.

### 4. Result and sensitivity

Putting the central terms together:

$$0.332 \times 0.5 \times 0.25 = 0.0415 \text{ human-equivalent QALYs per hen-year}$$

The animal-welfare category currently uses **0.0125-0.0575** as a practical range, which comes from varying the chicken welfare-range term from **0.1 to 0.46** while holding the other terms fixed:

$$0.1 \times 0.5 \times 0.25 = 0.0125$$
$$0.46 \times 0.5 \times 0.25 = 0.0575$$

The `25%` bridge assumption is itself also important. Holding the other central inputs fixed, moving that term from **15% to 35%** would shift the conversion from about **0.0249** to **0.0581** QALYs per hen-year:

$$0.332 \times 0.5 \times 0.15 = 0.0249$$
$$0.332 \times 0.5 \times 0.35 = 0.0581$$

So the estimate is best understood as a structured approximation rather than a precise measurement. But given the current moral-weight literature and the current welfare-science evidence on cages versus aviaries, **0.0415 QALYs per hen-year** looks like a reasonable all-things-considered central value.

{{CONTRIBUTION_NOTE}}
