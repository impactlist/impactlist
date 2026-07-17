---
id: longtermist
name: 'Longtermist (10 billion years)'
description: 'Counts the next 10 billion years with no pure time discounting; slow growth approximates travel-limited space settlement.'
sortOrder: 30
assumptions:
  globalParameters:
    timeLimit: 10000000000
    discountRate: 0
    populationGrowthRate: 2e-8
    populationLimit: 1000000
---

This profile extends the global time limit so that effects are evaluated over the next 10 billion years.

It also sets the discount rate to zero: future QALYs are not discounted just because they occur later.

Population grows at 0.000002% per year until reaching a limit one million times today's population. This effective
rate reaches the limit after about 690 million years, roughly representing travel-limited space settlement rather
than extrapolating near-term demographic growth. It is a long-run approximation: real settlement would expand
unevenly. ([Haqq-Misra and Fauchez 2022](https://arxiv.org/abs/2210.10656))

Across the full horizon, these settings represent about $10^{24}$ future 80-year lives, close to the main estimate in
[Greaves and MacAskill's case for strong longtermism](https://academic.oup.com/book/60794/chapter/530063399).
The population limit is an expected-value-equivalent cap, not a literal physical maximum.
