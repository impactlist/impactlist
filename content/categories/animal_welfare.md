---
id: animal-welfare
name: 'Animal Welfare'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 15
    costPerQALY: 2.3
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High) and Claude Opus 4.6 (Max), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing; check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from donations to the best current animal-welfare charities. In practice, the clearest evidence base still comes from farmed-chicken corporate campaigns and accountability work, especially cage-free reforms for laying hens and Better Chicken Commitment (BCC) reforms for broilers. There are also increasingly promising aquatic-animal opportunities, especially shrimp welfare, but the cross-species conversion into human-equivalent QALYs is less mature there.

## Point Estimates

- **Cost per QALY:** \$2.3 (\$0.50–\$52)
- **Start time:** 1 year
- **Duration:** 15 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. The best current animal-welfare giving opportunities are concentrated in farmed-animal advocacy, especially chicken corporate campaigns/accountability, with aquatic-animal work as an important additional source of uncertainty and potential impact. ([Animal Charity Evaluators](https://animalcharityevaluators.org/charity-review/the-humane-league/), [Animal Charity Evaluators](https://animalcharityevaluators.org/charity-review/shrimp-welfare-project/))
2. ACE's 2025 review estimates that The Humane League's cage-free accountability work helps roughly 11 hens per dollar, its BCC accountability work helps about 46 broilers per dollar, and THL's overall scope is about 12 animals helped per dollar. We use the 11 hens per dollar figure as the baseline because it is current and has the cleanest path into QALYs. ([ACE THL Review](https://animalcharityevaluators.org/charity-review/the-humane-league/))
3. THL's own 2025 retrospective on its corporate cage-free campaigns found roughly 2 hens spared cages per dollar over 2015-2024. This lower benchmark likely reflects some combination of counterfactual deflection, attribution uncertainty, mixed spending across campaign stages, and the fact that later dollars go after harder targets. ([THL EA Forum Post](https://forum.effectivealtruism.org/posts/Fbx9hf2e6MaLfoNwD/cost-effectiveness-of-thl-s-corporate-cage-free-campaigns))
4. Welfare Footprint Institute's laying-hen analysis models the laying phase as lasting 40 to 60 weeks. Because the cage-to-aviary comparison applies to the laying phase, we use the midpoint, 50 weeks (0.96 years), as the central duration of direct hen welfare improvement. ([Welfare Footprint Institute](https://welfarefootprint.org/laying-hens/))
5. Rethink Priorities' sentience-adjusted median welfare range for chickens is 0.332 of a human's, and RP's later farmed-animal allocation tool uses 0.46 as a practical chicken default when sentience is handled separately. We use 0.33 as the central value and 0.1-0.46 as a practical sensitivity range. ([RP Welfare Range Estimates](https://rethinkpriorities.org/research-area/welfare-range-estimates/), [RP Farmed Animal Recipients Tool](https://rethinkpriorities.org/research-area/distributing-resources-across-farmed-animal-recipients/))
6. Moving a laying hen from conventional cages to aviaries creates about 0.0415 human-equivalent QALYs per hen-year, with a practical range of about 0.0125-0.0575. This is derived by combining RP's chicken welfare range with a symmetry assumption around neutral welfare and a 25%-of-negative-range estimate for the cage-to-aviary improvement. ([See detailed justification](/assumption/hen-cage-free-qaly-conversion))
7. Corporate commitments are not merely symbolic. Rethink Priorities' 2023 cross-country analysis found that one additional cage-free commitment increases the cage-free share of hen housing by 0.035 percentage points on average. ([RP Corporate Social Responsibility Paper](https://rethinkpriorities.org/research-area/corporate-social-responsibility/))
8. Broiler reforms likely add substantial value on top of the hen-based baseline. Welfare Footprint Institute finds that BCC/slower-growing reforms avert at least 33 hours of disabling pain and 79 hours of hurtful pain per broiler, and likely understate the total gains because several harms are omitted. ([Welfare Footprint Institute](https://welfarefootprint.org/broilers/))
9. ACE's 2025 review estimates that Shrimp Welfare Project's humane slaughter program averts about 48 SADs per dollar and its India water-quality program averts about 729 SADs per dollar. These are morally weighted welfare-time estimates rather than QALY estimates, so we use them only in the optimistic edge of the range rather than in the point estimate. ([ACE Shrimp Welfare Project Review](https://animalcharityevaluators.org/charity-review/shrimp-welfare-project/))
10. ACE defines one SAD as one day of disabling pain for one human, after adjustments for pain intensity, sentience probability, and welfare range. We therefore use a rough cross-walk of 365 SADs = 1 suffering-equivalent human year, while noting that this is not a literal QALY conversion: disabling pain does not necessarily imply a full QALY-day lost, and SADs capture suffering averted rather than total welfare change. ([ACE Evaluation Criteria](https://animalcharityevaluators.org/charity-reviews/evaluating-charities/2024-evaluation-criteria/))
11. Benefits begin about one year after donation because firms need time to change sourcing, facilities, and compliance systems. ([ACE THL Review](https://animalcharityevaluators.org/charity-review/the-humane-league/))
12. Reforms persist for around 15 years. Older RP corporate-campaign models used 4-36 years as the plausible range for mean years of impact, and more recent fulfillment data suggest that many commitments do in fact stick once implemented. ([Rethink Priorities 2019](https://rethinkpriorities.org/research-area/corporate-campaigns-affect-9-to-120-years-of-chicken-life-per-dollar-spent/), [THL 2025 Fulfillment Report](https://thehumaneleague.org/article/2025-cage-free-fulfillment-report))

## Details

### Cost per QALY

The point estimate uses a hen-QALY model because this is the cleanest current evidence chain from donor dollar to human-equivalent QALYs. The pessimistic end uses a pessimistic version of that same hen model. The optimistic end uses ACE's shrimp SAD model with the rough cross-walk from Assumption 11, because current best opportunities for the cause span both chicken and shrimp work.

### Central calculation

Using the current ACE benchmark of 11 hens helped per dollar (Assumption 2), 50 weeks of improved laying-life conditions per hen (Assumption 4), and 0.0415 QALYs per hen-year (Assumption 6):

$$\text{QALYs per } \$1 = 11 \times \dfrac{50}{52} \times 0.0415 \approx 0.44$$
$$\text{Cost per QALY} = \dfrac{\$1}{0.44} \approx \$2.28$$

This yields a central estimate of about \$2.3 per QALY.

Here, the 11 hens-per-dollar figure is treated as the total marginal impact of a donation, not as an annual rate that recurs throughout the 15-year window. In the model, `windowLength` determines how benefits are distributed through time for discounting and truncation, not how many times the core effect repeats.

### Hen-to-QALY conversion

Assumption 6 is the most model-dependent part of this estimate, so it has its own page. In brief, it combines RP's chicken welfare range with a symmetry assumption around neutral welfare and a 25%-of-negative-range estimate for moving from conventional cages to aviaries. ([See detailed justification](/assumption/hen-cage-free-qaly-conversion))

### Why we do not use the older 9-120 chicken-years/\$ model for the point estimate

RP's 2019 estimate that historical chicken corporate campaigns affected 9-120 chicken-years per dollar is still useful background evidence. For current marginal giving, ACE's current accountability benchmarks are more directly relevant.

### Counterfactuals and diminishing returns

The 11 hens-per-dollar figure should be read as a current program estimate, not as a law of constant returns. THL's lower 2 hens-per-dollar retrospective is informative partly because it already embeds attribution uncertainty, some counterfactual deflection, mixed spending across acquisition and accountability, and the fact that later dollars tend to face harder targets. That is one reason the range is much wider than the central formula.

At the same time, this estimate is meant to describe current marginal giving to top animal-welfare opportunities rather than an average over the entire cause. ACE currently estimates that THL can effectively absorb about $28.7 million per year in 2026 and 2027, and that SWP can effectively absorb about $3.6 million per year in 2026 and 2027. That makes it more plausible that additional dollars can still reach high-priority work rather than immediately spilling into much weaker opportunities. ([ACE THL Review](https://animalcharityevaluators.org/charity-review/the-humane-league/), [ACE Shrimp Welfare Project Review](https://animalcharityevaluators.org/charity-review/shrimp-welfare-project/))

### Broilers and shrimp

Broiler reforms and shrimp programs matter because the best current animal-welfare opportunities are not hens-only. WFI finds that BCC/slower-growing reforms avert large amounts of intense pain per bird, and ACE estimates THL's BCC accountability work helps about 46 broilers per dollar. ACE also estimates that Shrimp Welfare Project's humane slaughter and India water-quality programs avert about 48 and 729 SADs per dollar, respectively. These do not plug cleanly into the hen-QALY formula, but they do imply that a hens-only model does not capture the full uncertainty range for the cause as a whole.

### Why the range

The range is meant to reflect plausible current opportunities for top animal-welfare charities. The pessimistic end uses a hen-QALY model; the optimistic end uses a shrimp-SAD model. So the bounds are not just parameter variations on one formula; they reflect different high-impact intervention types inside the cause area.

**Pessimistic end:**

- 2 hens helped per dollar
- 40 weeks affected per hen
- 0.0125 QALYs per hen-year

$$\text{QALYs per } \$1 = 2 \times \dfrac{40}{52} \times 0.0125 \approx 0.019$$
$$\text{Cost per QALY} = \dfrac{\$1}{0.019} \approx \$52$$

**Optimistic end:**

- ACE's estimate of 729 SADs averted per dollar for Shrimp Welfare Project's India water-quality program
- A rough cross-walk of 365 SADs = 1 suffering-equivalent year

$$\text{QALY-equivalent years per } \$1 \approx \dfrac{729}{365} \approx 2.0$$
$$\text{Cost per QALY-equivalent} \approx \dfrac{\$1}{2.0} = \$0.50$$

This optimistic case uses ACE's own current shrimp estimate and an explicit SAD-to-QALY-equivalent cross-walk. It is less direct than the hen calculation, which is why it is used only for the optimistic edge of the range rather than for the point estimate.

### Start Time

The 1-year start time reflects the lag between donations and realized animal outcomes as companies change sourcing, infrastructure, and reporting/compliance systems (Assumption 11).

### Duration

The 15-year duration reflects the fact that implemented reforms affect multiple flock cycles and often persist for many years once supply chains change. It also sits comfortably inside RP's older 4-36 year range for years of impact and near the middle of the plausible durability range (Assumption 12).

{{CONTRIBUTION_NOTE}}

# Internal Notes
