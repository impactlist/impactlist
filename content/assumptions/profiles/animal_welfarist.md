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
          costPerQALY: 0.7
---

This assumptions set removes the default chicken discount used in the
[Animal Welfare](/cause/animal-welfare) cause and also applies the same
AI X-risk skepticism as the AI X-Risk Skeptic assumptions set.

The cause writeup currently assumes chickens have about one-third of the welfare range of humans,
based on Rethink Priorities' sentience-adjusted estimate.
That makes the default `costPerQALY` about 3x worse than a human-equal weighting would imply.
This assumptions set turns the cause into that human-equal version while also disabling
[AI Existential Risk](/cause/ai-risk) and the `population-doom` effect in
[AGI Development](/cause/ai-capabilities).
