---
id: longtermist
name: 'Longtermist'
description: 'Extends the global time horizon to 10 billion years.'
sortOrder: 30
assumptions:
  globalParameters:
    timeLimit: 10000000000
---

This assumptions set keeps the default assumptions structure but evaluates effects over the next
10 billion years instead of the default 100-year horizon.

We use a discount rate of zero, meaning the future is seen as equally valuable as the present.
