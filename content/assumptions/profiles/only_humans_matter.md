---
id: only-humans-matter
name: 'Only Humans Matter (100 years)'
description: 'Disables the Animal Welfare cause, counting only effects on humans.'
sortOrder: 25
assumptions:
  categories:
    animal-welfare:
      effects:
        - effectId: standard
          disabled: true
---

Use this assumptions set if you assign no moral weight to non-human animals.

It turns off the [Animal Welfare](/cause/animal-welfare) cause entirely, so donations
to animal-welfare charities count for zero lives saved. Everything else stays at the
site defaults.
