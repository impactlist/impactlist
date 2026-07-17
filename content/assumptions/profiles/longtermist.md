---
id: longtermist
name: 'Longtermist (10 billion years)'
description: 'Extends the global time horizon to 10 billion years and uses a much larger future population.'
sortOrder: 30
assumptions:
  globalParameters:
    timeLimit: 10000000000
    discountRate: 0
    populationLimit: 1000000
---

This profile extends the global time limit so that effects are evaluated over the next 10 billion years.

It also sets the discount rate to zero: future QALYs are not discounted just because they occur later.

The population limit is one million times today's population. Across this time horizon, that represents about
$10^{24}$ future 80-year lives once population reaches the limit, close to the main estimate in
[Greaves and MacAskill's case for strong longtermism](https://academic.oup.com/book/60794/chapter/530063399).
This is an expected-value-equivalent population limit, not a literal demographic forecast.
