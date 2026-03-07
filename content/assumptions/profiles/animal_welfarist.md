---
id: animal-welfarist
name: 'Animal Welfarist'
description: 'Treats the welfare gains in Animal Welfare as equal in moral weight to human welfare.'
sortOrder: 20
assumptions:
  categories:
    animal-welfare:
      effects:
        - effectId: standard
          costPerQALY: 0.8
---

This profile removes the default chicken discount used in the `Animal Welfare` category.

The category writeup currently assumes chickens have about 10% of the welfare range of humans,
which makes the default `costPerQALY` about 10 times worse than a human-equal weighting would imply.
This profile sets the category to that human-equal version.
