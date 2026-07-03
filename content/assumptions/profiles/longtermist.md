---
id: longtermist
name: 'Longtermist (10 billion years)'
description: 'Extends the global time horizon to 10 billion years.'
sortOrder: 30
assumptions:
  globalParameters:
    timeLimit: 10000000000
    discountRate: 0
---

This profile keeps the standard assumptions but extends the global time limit so that
effects are evaluated over the next 10 billion years.

It also sets the discount rate to zero: future QALYs are not discounted just because they occur later.
