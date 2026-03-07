---
id: ai-risk-skeptic
name: 'AI Risk Skeptic'
description: 'Disables AI existential risk and removes the doom penalty from AGI Development.'
sortOrder: 10
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
---

This profile models a user who does not buy the case for AI existential risk.

It turns off the `AI Existential Risk` category entirely and also disables the `population-doom`
effect inside `AGI Development`, so AGI development is evaluated only on its direct upside.
