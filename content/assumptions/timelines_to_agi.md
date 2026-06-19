---
id: timelines-to-agi
name: 'Timelines to AGI'
---

## When will AGI arrive?

This document estimates when **artificial general intelligence (AGI)** will arrive, defined here as the point at which **unaided machines can accomplish any cognitive (mental) task better and more cheaply than human workers** — reasoning, research, software, analysis, planning, and the like. It does **not** require physical embodiment or robotics: a system that matches or beats humans on every *mental* task counts even if humans still do manual labor.

This is a cognitive-automation bar. It is more demanding than passing a particular AGI benchmark, since it requires beating humans on essentially *every* mental task, and doing so more cheaply. But it is less demanding than full **high-level machine intelligence (HLMI)**, which additionally requires automating physical and embodied work. A system that beats all humans at all mental tasks is at the strong end of what people call AGI; some would call it a mild superintelligence. We use "AGI" because it is the term the forecasting evidence below is framed around.

**Summary:** We estimate a central arrival date of **around 2036** for AGI — roughly **10 years** out — with a {{PLAUSIBLE_RANGE}} of **2030–2050**. Because this bar excludes physical labor, it lands earlier than full HLMI; because it requires beating humans on *every* mental task more cheaply, it lands a little later than benchmark-style "AGI achieved" forecasts.

---

## 1. The broadest expert survey measures a later, physical-inclusive bar

The largest direct survey, [Grace et al. (2024)](https://arxiv.org/abs/2401.02843), put a 50% date of **2047** on **HLMI**. But that definition requires automating *every* task, including physical ones, so it is an upper anchor for the cognitive-only milestone we care about here.

Two further things matter about that number:

- **It was fielded in late 2023**, so it does not reflect the capability gains, or the timeline updates, of 2024–2026.
- **It sits on a downward trend.** The same survey program's aggregate moved from **2061** (2016) to **2059** (2022) to **2047** (2023), and the authors note respondents had repeatedly *underestimated* the pace of progress.

So 2047 is a stale upper bound, not a current best guess for cognitive AGI.

## 2. Capability trends point to fast, accelerating progress

[METR's time-horizon work](https://metr.org/blog/2026-1-29-time-horizon-1-1/) measures the length of task (in human-expert time) that frontier models can complete autonomously at 50% reliability — a direct read on the cognitive bar we care about. This horizon is growing exponentially **and accelerating**. As of early 2026 the best systems handle on the order of a **5-hour** task, and the doubling time has itself shrunk to roughly **89 days** for the most recent models. Extrapolating even the slower historical rate implies week- to month-long autonomous cognitive tasks within a few years. The recent rate implies it sooner.

:::details{title="The measured doubling rates"}
The horizon has roughly doubled every **196 days** across 2019–2025, every **131 days** restricted to models released since 2023, and every **89 days** for models since 2024.
:::

## 3. Forecasters and tournaments cluster in the early-to-mid 2030s

Independent forecasting communities asking AGI-style cognitive questions have moved sharply earlier. An early-2026 Metaculus snapshot cited by 80,000 Hours centered on a 50% date around **2033**. The Forecasting Research Institute's 2026 LEAP round put expert medians around **2030** (superforecasters ~2028). A February 2026 AI-safety survey clustered most respondents in **2030–2035**. We read these as bracketing the early-to-mid 2030s rather than pinning our exact milestone, since each uses a somewhat different bar.

:::details{title="The individual forecaster anchors"}
The three anchors don't measure quite the same thing, so each is an imperfect match for our bar:

- **Metaculus.** Beyond the ~2033 midpoint, the early-2026 snapshot put roughly **25% by 2029**, down from an aggregate median about 50 years out as recently as 2020 — though it ticked slightly *later* over the past year. Its AGI question also bundles in some physical/robotic criteria. ([80,000 Hours review](https://80000hours.org/2025/03/when-do-experts-expect-agi-to-arrive/))
- **Forecasting tournaments.** The LEAP median is for an AI matching expert humans at **multi-hour (8+ hour) software tasks** — much narrower than "every mental task." ([LEAP wave 8](https://forecastingresearch.substack.com/p/leap-wave-8-ai-timelines))
- **AI-safety researchers.** In the February 2026 survey, **73%** put their 50% date before 2035. ([survey](https://forum.effectivealtruism.org/posts/LxuKuQd69Qx5FKhNZ/survey-of-ai-safety-leaders-on-x-risk-agi-timelines-and))
:::

## 4. Where our milestone sits

Our bar does not nest cleanly inside any single anchor:

- Relative to **benchmark-AGI** forecasts such as Metaculus's ~2033, it is **more demanding in breadth and cost**. It requires beating humans on *every* mental task, and more cheaply, and the long tail of rare or poorly-specified cognitive work is where automation is slowest. But those benchmarks also bundle in some physical/robotic criteria that our bar drops, which cuts the other way.
- Relative to **full HLMI** (Grace's 2047), it is clearly **earlier**, because it does not require automating physical and embodied labor, which lags cognitive progress and adds years to that broader definition.

On balance these considerations leave our milestone in the same early-to-mid-2030s cluster as the cognitive anchors — toward their later end, and well before full HLMI.

## 5. Our estimate: around 2036

Weighing these together:

- benchmark-AGI aggregates center on the early 2030s (§3),
- capability trends are fast and accelerating (§2),
- and our cognitive bar is somewhat harder than benchmark-AGI but does not wait on robotics (§4).

We therefore use **2036** — about **10 years** out — as the central date for AGI in the sense defined here.

### Plausible range: 2030–2050

We treat **2030–2050** as the plausible range. It is wide and slightly right-skewed. The reason is that timeline uncertainty hinges on hard-to-forecast factors: algorithmic breakthroughs, compute scaling, and possible plateaus on the hard cognitive long tail.

- **2030** (10th percentile) if the post-2024 capability pace continues and the remaining gap is short.
- **2050** (90th percentile) if progress on the hardest, least-specified cognitive work stalls, or a compute/funding slowdown intervenes.

---

## 6. How this is used

This milestone is what the site's AI models key off, because it is roughly the point at which highly capable systems become economically and strategically decisive:

- On the [AI existential risk](/cause/ai-risk) page, it sets the **start time** at which catastrophic AI risk begins to bear on welfare (about 10 years out).
- On the [AGI Development](/cause/ai-capabilities) page and in the [cumulative frontier-spending denominator](/assumption/cumulative-frontier-ai-spending-before-transformative-ai), it sets the **years to transformative AI** used in the timing models.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on June 15th 2026 by Claude Opus 4.8, with prompts from Impact List staff._

- The central estimate (2036) and range (2030–2050) are an all-things-considered judgment, not a mechanical aggregate; the inputs use different definitions (cognitive AGI vs benchmark-AGI vs multi-hour software task vs full HLMI) that are not directly comparable.
- Term choice: we label the milestone "AGI." The definition (beats all humans on every *mental* task, more cheaply, no embodiment) is at the strong end of AGI usage; some would call it a mild ASI. We avoid "HLMI" because that standardly includes physical-task automation, which would push the date out several years.
- METR figures (196/131/89-day doublings; ~5h horizon) are from the 2026-01-29 TH1.1 update; refresh as new model measurements land.
- The Metaculus ~2033 AGI figure is an early-2026 snapshot read via the 80,000 Hours review (Metaculus blocks automated fetches); re-verify the live value by hand at publish time.
- Dependents keyed to this estimate (≈10 years / 2036): ai-risk start time (10 years); ai-capabilities standard-utopia and population-doom start times (10 years) and its "years to transformative AI" baseline (10); cumulative-frontier-ai-spending's "years to transformative AI" (10) feeding the \$5T denominator.
