---
id: ai-risk-skeptic
name: 'AI X-Risk Skeptic'
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

Use this assumptions set if you assign little or no weight to AI existential risk.

It turns off [AI Existential Risk](/cause/ai-risk) entirely and also disables
the `population-doom` effect inside [AGI Development](/cause/ai-capabilities).
That leaves AGI development judged only on its direct upside.
