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

{{STANDARD_QALY_METHOD_NOTE}}

## Description of effect

This effect captures welfare gains from donations to the best current animal-welfare charities. The clearest evidence base still comes from farmed-chicken corporate campaigns and accountability work, especially cage-free reforms for laying hens and Better Chicken Commitment (BCC) reforms for broilers. Aquatic-animal work, especially shrimp welfare, looks increasingly promising. But converting it into human-equivalent QALYs is less mature.

## What kinds of charities are we modeling?

These estimates are for **top farmed-animal and aquatic-animal welfare opportunities**: corporate campaigns, accountability work, humane-slaughter work, and other interventions with a direct path to reducing large amounts of animal suffering per dollar.

They are **not** meant for zoos, companion-animal shelters, wildlife conservation, or broad animal charities unless a recipient-specific model shows similar marginal welfare gains.

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$2.3 (\$0.50–\$87)
- **Start time:** 1 year
- **Duration:** 15 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. The best current animal-welfare giving opportunities are concentrated in farmed-animal advocacy, especially chicken corporate campaigns/accountability, with aquatic-animal work as an important additional source of uncertainty and potential impact. ([Animal Charity Evaluators](https://animalcharityevaluators.org/charity-review/the-humane-league/), [Animal Charity Evaluators](https://animalcharityevaluators.org/charity-review/shrimp-welfare-project/))
2. ACE's 2025 review estimates that The Humane League's cage-free accountability work helps roughly 11 hens per dollar, its BCC accountability work helps about 46 broilers per dollar, and THL's overall scope is about 12 animals helped per dollar. We use the 11 hens per dollar figure as the baseline because it is current and has the cleanest path into QALYs. ([ACE THL Review](https://animalcharityevaluators.org/charity-review/the-humane-league/))
3. THL's own 2025 retrospective on its corporate cage-free campaigns found roughly 2 hens spared cages per dollar over 2015-2024. This lower benchmark likely reflects some combination of counterfactual deflection, attribution uncertainty, mixed spending across campaign stages, and the fact that later dollars go after harder targets. ([THL EA Forum Post](https://forum.effectivealtruism.org/posts/Fbx9hf2e6MaLfoNwD/cost-effectiveness-of-thl-s-corporate-cage-free-campaigns))
4. Welfare Footprint Institute's laying-hen analysis models the laying phase as lasting 40 to 60 weeks. Because the cage-to-aviary comparison applies to the laying phase, we use the midpoint, 50 weeks (0.96 years), as the central duration of direct hen welfare improvement. ([Welfare Footprint Institute](https://welfarefootprint.org/laying-hens/))
5. Rethink Priorities' sentience-adjusted median welfare range for chickens is 0.332 of a human's, and RP's later farmed-animal allocation tool uses 0.46 as a practical chicken default when sentience is handled separately. We use 0.332 as the central value and 0.1-0.46 as our plausible range. ([RP Welfare Range Estimates](https://rethinkpriorities.org/research-area/welfare-range-estimates/), [RP Farmed Animal Recipients Tool](https://rethinkpriorities.org/research-area/distributing-resources-across-farmed-animal-recipients/))
6. Moving a laying hen from conventional cages to aviaries creates about 0.0415 human-equivalent QALYs per hen-year, with a plausible range of about 0.0075-0.08. This is derived by combining RP's chicken welfare range with a symmetry assumption around neutral welfare and a 25%-of-negative-range estimate for the cage-to-aviary improvement. ([See detailed justification](/assumption/hen-cage-free-qaly-conversion))
7. Corporate commitments are not merely symbolic. Rethink Priorities' 2023 cross-country analysis found that one additional cage-free commitment increases the cage-free share of hen housing by 0.035 percentage points on average. ([RP Corporate Social Responsibility Paper](https://rethinkpriorities.org/research-area/corporate-social-responsibility/))
8. Broiler reforms likely add substantial value on top of the hen-based baseline. Welfare Footprint Institute finds that BCC/slower-growing reforms avert at least 33 hours of disabling pain and 79 hours of hurtful pain per broiler, and likely understate the total gains because several harms are omitted. ([Welfare Footprint Institute](https://welfarefootprint.org/broilers/))
9. ACE's 2025 review estimates that Shrimp Welfare Project's humane slaughter program averts about 48 SADs per dollar and its India water-quality program averts about 729 SADs per dollar. These are morally weighted welfare-time estimates rather than QALY estimates, so we use them only in the optimistic edge of the range rather than in the point estimate. ([ACE Shrimp Welfare Project Review](https://animalcharityevaluators.org/charity-review/shrimp-welfare-project/))
10. ACE defines one SAD as one day of disabling pain for one human, after adjustments for pain intensity, sentience probability, and welfare range. We therefore use a rough cross-walk of 365 SADs = 1 suffering-equivalent human year only as an optimistic-edge check, while noting that this is not a literal QALY conversion: disabling pain does not necessarily imply a full QALY-day lost, and SADs capture suffering averted rather than total welfare change. ([ACE Evaluation Criteria](https://animalcharityevaluators.org/charity-reviews/evaluating-charities/2024-evaluation-criteria/))
11. Benefits begin about one year after donation because firms need time to change sourcing, facilities, and compliance systems. ([ACE THL Review](https://animalcharityevaluators.org/charity-review/the-humane-league/))
12. Reforms persist for around 15 years. Older RP corporate-campaign models used 4-36 years as the plausible range for mean years of impact, and more recent fulfillment data suggest that many commitments do in fact stick once implemented. ([Rethink Priorities 2019](https://rethinkpriorities.org/research-area/corporate-campaigns-affect-9-to-120-years-of-chicken-life-per-dollar-spent/), [THL 2025 Fulfillment Report](https://thehumaneleague.org/article/2025-cage-free-fulfillment-report))

## Details

### Cost per QALY

The point estimate uses a hen-QALY model because this is the cleanest current evidence chain from donor dollar to human-equivalent QALYs. The pessimistic end uses a pessimistic version of that same hen model. The optimistic end uses ACE's shrimp SAD model with the rough cross-walk from Assumption 10, because current best opportunities for the cause span both chicken and shrimp work.

### Central calculation

Using the current ACE benchmark of 11 hens helped per dollar (Assumption 2), 50 weeks of improved laying-life conditions per hen (Assumption 4), and 0.0415 QALYs per hen-year (Assumption 6):

$$\text{QALYs per } \$1 = 11 \times \dfrac{50}{52} \times 0.0415 \approx 0.44$$
$$\text{Cost per QALY} = \dfrac{\$1}{0.44} \approx \$2.28$$

This yields a central estimate of about \$2.3 per QALY.

Here, the 11 hens-per-dollar figure is treated as the total marginal impact of a donation, not as an annual rate that recurs throughout the 15-year duration. The duration affects how benefits are spread over time for discounting and truncation, not how many times the core effect repeats.

### Hen-to-QALY conversion

Assumption 6 is the most model-dependent part of this estimate, so it has its own page. In brief, it combines RP's chicken welfare range with a symmetry assumption around neutral welfare and a 25%-of-negative-range estimate for moving from conventional cages to aviaries. ([See detailed justification](/assumption/hen-cage-free-qaly-conversion))

The central estimate uses a hens-only model. Two things make the range wide. First, counterfactual and diminishing-returns uncertainty: THL's own retrospective implies ~2 hens/\$, not 11. Second, the broiler and shrimp opportunities the hen formula leaves out.

:::details{title="Counterfactuals, diminishing returns, and non-hen opportunities"}
**Why not the older 9-120 chicken-years/\$ model.** RP's 2019 estimate that historical chicken corporate campaigns affected 9-120 chicken-years per dollar is still useful background, but for current marginal giving ACE's current accountability benchmarks are more directly relevant.

**Counterfactuals and diminishing returns.** The 11 hens-per-dollar figure is a current program estimate, not a law of constant returns. THL's lower 2 hens-per-dollar retrospective already embeds attribution uncertainty, some counterfactual deflection, mixed spending across acquisition and accountability, and the fact that later dollars tend to face harder targets — one reason the range is much wider than the central formula. This estimate describes current marginal giving to top opportunities, not an average over the whole cause. ACE estimates THL can effectively absorb about \$28.7 million per year and SWP about \$3.6 million per year in 2026-2027, so additional dollars can still reach high-priority work. ([ACE THL Review](https://animalcharityevaluators.org/charity-review/the-humane-league/), [ACE Shrimp Welfare Project Review](https://animalcharityevaluators.org/charity-review/shrimp-welfare-project/))

**Broilers and shrimp.** The best current opportunities are not hens-only. WFI finds BCC/slower-growing reforms avert large amounts of intense pain per bird, and ACE estimates THL's BCC accountability work helps about 46 broilers per dollar; ACE also estimates Shrimp Welfare Project's humane-slaughter and India water-quality programs avert about 48 and 729 SADs per dollar. These need species-specific welfare bridges rather than the hen-QALY formula used for the point estimate, but they imply a hens-only model does not capture the cause's full uncertainty range.
:::

### Why the range

The range (**\$0.50–\$87/QALY**) reflects different high-impact intervention types, not just parameter variation on one formula. The pessimistic end is a pessimistic hen-QALY model (~**\$87**). The optimistic end is ACE's shrimp-SAD program with a SAD-to-QALY cross-walk (~**\$0.50**). The shrimp case is less direct than the hen calculation, which is why it anchors only the optimistic edge rather than the point estimate.

:::details{title="The pessimistic and optimistic calculations"}
**Pessimistic end** — 2 hens/\$, 40 weeks/hen, 0.0075 QALYs/hen-year (the low end of the cage-free conversion):

$$\text{QALYs per } \$1 = 2 \times \dfrac{40}{52} \times 0.0075 \approx 0.0115$$
$$\text{Cost per QALY} = \dfrac{\$1}{0.0115} \approx \$87$$

**Optimistic end** — ACE's 729 SADs/\$ for Shrimp Welfare Project's India water-quality program, at a rough cross-walk of 365 SADs = 1 suffering-equivalent year:

$$\text{QALY-equivalent years per } \$1 \approx \dfrac{729}{365} \approx 2.0$$
$$\text{Cost per QALY-equivalent} \approx \dfrac{\$1}{2.0} = \$0.50$$
:::

### Start time

The 1-year start time reflects the lag between donations and realized animal outcomes as companies change sourcing, infrastructure, and reporting/compliance systems (Assumption 11).

### Duration

Implemented reforms affect multiple flock cycles and often persist for many years once supply chains change, which is what the 15-year duration reflects. It sits inside RP's older 4-36 year range for years of impact and near the middle of the plausible durability range (Assumption 12).

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on April 6th 2026 by GPT-5.4 and Claude Opus 4.6, with prompts from Impact List staff._
