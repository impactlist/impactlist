---
id: animal-welfarist
name: 'Animal Welfarist + AI X-Risk Skeptic'
description: 'Treats animal welfare gains as equal in moral weight to human welfare and disables AI x-risk adjustments.'
sortOrder: 20
assumptions:
  categories:
    ai-risk:
      effects:
        - effectId: population
          disabled: true
    ai-capabilities:
      effects:
        - effectId: population-doom
          disabled: true
    animal-welfare:
      effects:
        - effectId: standard
          costPerQALY: 0.8
---

This profile removes the default chicken discount used in the
[Animal Welfare](/category/animal-welfare) category and also applies the same
AI X-risk skepticism as the AI X-Risk Skeptic profile.

The category writeup currently assumes chickens have about 10% of the welfare range of humans,
which makes the default `costPerQALY` about 10 times worse than a human-equal weighting would imply.
This profile sets the category to that human-equal version while also disabling
[AI Existential Risk](/category/ai-risk) and the `population-doom` effect in
[AGI Development](/category/ai-capabilities).
