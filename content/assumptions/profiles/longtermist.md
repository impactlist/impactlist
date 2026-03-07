---
id: longtermist
name: 'Longtermist'
description: 'Extends the global time horizon to 10 billion years.'
sortOrder: 30
assumptions:
  globalParameters:
    timeLimit: 10000000000
---

This profile keeps the default assumptions structure but evaluates effects over the next
10 billion years instead of the default 100-year horizon.

It is meant for users who want the calculations to put very heavy weight on the far future.
