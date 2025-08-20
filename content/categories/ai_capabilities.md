---
id: ai-capabilities
name: 'AGI Development'
effects:
  - effectId: standard
    startTime: 2
    windowLength: 30
    costPerQALY: 60
  - effectId: population-early
    startTime: 50
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 200_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: -1.0
    validTimeInterval: [null, 2012]
  - effectId: population-late
    startTime: 10
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 200_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: -1.0
    validTimeInterval: [2013, null]
---

# Justification of cost per life

We've modeled two effects for this category: a standard effect where money spent on AI capabilities leads to improvements in the world via advancements in science and technology, and a population-level effect where capabilities improvements leads to existential risk from misaligned AI. For the second effect we use the negation of the cost per life of the of AI risk category.

This project hasn't officially launched yet and we're looking for help improving our cost per life estimates.
If you'd like to contribute, read about how you can do so [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md).

# Internal Notes

This section contains internal notes that shouldn't be displayed on the website.
