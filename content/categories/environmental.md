---
id: environmental
name: 'General Environmental'
effects:
  - effectId: standard
    startTime: 3
    windowLength: 60
    costPerQALY: 5000
---

# Justification of cost per life

{{STANDARD_QALY_METHOD_NOTE}}

## Description of effect

This effect captures the human-welfare benefits of donations to **non-climate environmental charities**, which in practice means **conservation**. When we reviewed the organizations donors actually fund in this category, most of the money goes to protecting and restoring land, oceans, freshwater, and wildlife habitat — rainforests, national parks, land trusts, marine reserves, and ocean and wildlife charities. Smaller shares go to parks and urban greenspace, academic environmental research, environmental advocacy and regranting, sustainable food and agriculture, and a small amount of pollution-reduction work.

We count the benefits conservation delivers to people: ecosystem services such as coastal flood protection, clean water, fisheries, and pollination; recreation and amenity; and the value people place on nature and species continuing to exist. We do not count climate mitigation or animal welfare, each of which has its own category ([climate change](/cause/climate-change), [animal welfare](/cause/animal-welfare)), nor the intrinsic worth some assign to ecosystems beyond the welfare they bring to people.

This is a real but **diffuse** effect. Per dollar it produces far fewer human QALYs than top health, poverty, or climate giving, which is why the estimate here is much more expensive than those categories.

## What kinds of charities are we modeling?

We model **conservation and biodiversity work whose benefits reach people** — habitat and land protection, ocean and freshwater conservation, wildlife charities, and greenspace, plus the smaller amounts of sustainable-food and pollution-reduction work that also sit in this category.

:::details{title="What is and is not modeled"}
Representative activities include:

- Land, forest, and wildlife-habitat protection and restoration (land trusts, national parks, protected-area support, rainforest conservation)
- Ocean and freshwater conservation (marine reserves, fisheries protection, watershed and wetland conservation)
- Parks, trails, and urban greenspace that people use directly
- Sustainable food and agriculture, and non-climate pollution reduction, as smaller sub-channels

We do **not** model here: climate mitigation ([climate change](/cause/climate-change)); animal welfare ([animal welfare](/cause/animal-welfare)); or the intrinsic worth of ecosystems beyond the welfare they bring to people.
:::

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$5,000 (\$400–\$150,000)
- **Start time:** 3 years
- **Duration:** 60 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. This category is dominated by conservation. Our dollar-weighted review of the recipients funded here puts roughly three-quarters of the money in land and ocean conservation, most of the rest in greenspace, research, advocacy, and sustainable food, and under a tenth in pollution reduction. Several large recipients fund a mix of work, so the exact split is uncertain. This is our own estimate, and the cost per QALY below follows it. {{CHALLENGE_ASSUMPTION:1}}
2. Conservation's clearest large human-welfare pathway is coastal and wetland protection. Menéndez et al. 2020 estimate that the world's mangroves reduce flood damage by more than **\$65 billion** a year and shield more than **15 million people** a year from flooding — a sense of how much human welfare coastal conservation defends. ([Menéndez et al. 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7064529/)) {{CHALLENGE_ASSUMPTION:2}}
3. Watershed and source-water protection is a second such pathway. The Nature Conservancy's Latin American water-funds portfolio conserves more than **7 million acres** of watershed and helps secure drinking water for nearly **50 million people** by protecting the upstream land that keeps it clean. ([The Nature Conservancy](https://www.nature.org/en-us/about-us/where-we-work/latin-america/stories-in-latin-america/water-funds-of-south-america/)) {{CHALLENGE_ASSUMPTION:3}}
4. Greenspace and amenity work, a common destination for this category, has only thin health evidence, and it is far weaker per dollar than top health giving: a 2024 systematic review found a single cost-per-DALY estimate, about **\$23,254 per DALY averted**, and judged the evidence too sparse to settle overall cost-effectiveness, though it found benefits generally exceeded costs. ([Jacob et al. 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11102847/)) {{CHALLENGE_ASSUMPTION:4}}
5. People place real value on nature and species continuing to exist, and this "non-use" value is a large part of why charismatic conservation is funded. Contingent-valuation studies consistently find people willing to pay real money — often tens of dollars per household per year — to protect biodiversity and endangered species, though the amounts vary widely by context. This is genuine welfare, but it is hard to translate into QALYs, so we treat it as support for a non-trivial estimate rather than a number we can plug in. ([Jacobsen & Hanley 2009](https://link.springer.com/article/10.1007/s10640-008-9226-8)) {{CHALLENGE_ASSUMPTION:5}}
6. Two forces widen the expensive tail: **additionality** — a large share of conservation dollars protect land or habitat under uncertain or low near-term threat, so the counterfactual gain can be small — and **reversal**, since protected areas are sometimes downgraded, downsized, or degazetted. ([PADDDtracker](https://www.padddtracker.org/)) {{CHALLENGE_ASSUMPTION:6}}

## Details

### Cost per QALY

There is no single clean dollar-to-QALY chain for conservation the way there is for cash transfers or carbon. So we triangulate across the human-welfare channels above and land on a point estimate of about **\$5,000/QALY**. Read that as an order of magnitude — several thousand dollars per QALY — not a precise figure.

The channels span a very wide efficiency band:

- **Strongest:** coastal, wetland, watershed, and fisheries protection, which can shield large and often poor populations (Assumptions 2–3). Where a marginal dollar buys additional, durable, genuinely counterfactual protection, this channel could be quite cost-effective — plausibly hundreds of dollars per QALY — but the public evidence shows the size of the benefit far more clearly than the marginal cost per QALY.
- **Middle and majority:** large-scale habitat and biodiversity protection, where the benefits to people are real but diffuse — regional ecosystem services plus the existence value of Assumption 5. This converts to QALYs expensively and uncertainly, plausibly many thousands of dollars per QALY.
- **Weakest:** rich-country amenity and greenspace projects, near the \$23,000-per-DALY greenspace anchor (Assumption 4) or worse where additionality is poor (Assumption 6).

Most of the category's dollars sit in that diffuse middle, with a minority in the stronger coastal, watershed, and fisheries channels. The channel figures above are best cases, though. What a typical marginal dollar buys is weaker, because much conservation money protects land that was not truly at risk, or that a government or another funder would have covered anyway (Assumption 6). Taking that into account, we judge the typical conservation dollar at about **\$5,000/QALY** — far more expensive than top health, poverty, or climate giving, because the benefits are thin per person and hard to attribute to any single gift.

**Range:** our plausible range is **\$400–\$150,000/QALY**, and it is very wide because the dominant uncertainty is not a single parameter — it is structural.

- **Optimistic (about \$400/QALY):** if conservation's ecosystem-service and existence benefits are larger and more attributable than the skeptical read assumes, and marginal dollars genuinely add durable, counterfactual protection in the strong coastal, watershed, and fisheries channels, the best of the category could approach top poverty giving. It stays well above zero because even strong conservation rarely matches direct health interventions on measurable human QALYs.
- **Pessimistic (about \$150,000/QALY):** if most dollars fund diffuse amenity and prestige work with weak additionality (Assumption 6), and we count only welfare people actually experience rather than the intrinsic value that motivates much conservation, the effective cost per QALY runs into six figures. The tail could extend further, and parts of the category — such as fortress conservation that displaces people — could even be net-negative for human welfare.

The width reflects how uncertainly diffuse ecosystem and existence benefits convert into QALYs, and how weak the counterfactual can be, rather than a sweep of one or two clean inputs.

### Start time

The 3-year start time is a portfolio average. Protecting habitat that already exists starts preserving its services and existence value almost immediately, but restoration — replanting mangroves or forests, rebuilding wetlands — takes years to mature, and land deals and reserve designations take time to close. Three years balances the fast-acting protection majority against the slower restoration share.

### Duration

Conservation benefits are long-lived: a protected forest, park, or marine reserve can keep delivering ecosystem services and the value people place on nature for generations. The 60-year window reflects that multi-decade persistence, while stopping short of treating protection as permanent — protected areas can be downgraded or degazetted (Assumption 6), and a changing climate can degrade the ecosystems themselves.

## Key uncertainties

1. **How diffuse ecosystem services and existence value convert into QALYs.** This is the biggest lever and the main reason the range spans three orders of magnitude.
2. **Additionality.** How much conservation funding changes outcomes at the margin, versus protecting land that was not really threatened or duplicating other funders.
3. **How much non-use value to count, and whose.** Existence value is real welfare, but it is stated rather than revealed, and rich-country valuations dominate the evidence.
4. **The category's true composition, and how it drifts.** The anchor depends on conservation staying the dominant destination; a large shift toward pollution or greenspace work would move the estimate.
5. **Sign risk.** Some conservation harms the people it displaces — "fortress" conservation that evicts communities from newly protected land — so parts of this category could be closer to zero or negative for human welfare than the point estimate implies.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done in July 2026 by Claude Fable 5, with prompts from Impact List staff._

- This page was rewritten to re-anchor the category on conservation after a review of the recipients tagged `environmental`. Attributed dollars are ~\$8B. Six conservation-dominated recipients account for roughly two-thirds (~69%) of the category and are documented as conservation portfolios in their own recipient-file internal notes: Hasso Plattner (Congo Basin), Donald Bren (open-space preservation), Minderoo/Forrest (oceans + plastics), Wyss (African Parks/TNC/Re:wild), Arcadia (the "Nature" grant bucket), and Fundación Carlos Slim (WWF alliance). Yield Giving is comparably large (~\$1.3B) but its environmental slice mixes conservation, greenspace, and environmental-justice advocacy, so it is not counted as cleanly conservation. The previous \$50/QALY figure was anchored on lead-source elimination (LEEP), which is essentially absent from the actual recipient set — there is no LEEP, Pure Earth, or Clean Air Fund among the ~470 recipients.
- Rough dollar-weighted sub-category split of the ~\$8B (editor reference): land/wildlife/biodiversity ~65%, marine/ocean ~14%, plastics/circular-economy ~6.5%, advocacy/regranting ~4%, academic research ~3.5%, greenspace ~3%, toxics/clean-air/EJ ~2%, sustainable food/ag ~1.5%. Classifying the mixed portfolios (Yield Giving, Minderoo's oceans-vs-plastics, Dalio, Schmidt) differently lands anywhere from ~68% to ~80% conservation, so the page says "roughly three-quarters" rather than a single precise figure.
- The \$5,000 point estimate is a judgment-based triangulation, not a formula. It deliberately sits near the geometric center of the \$400–\$150,000 range, tilted slightly toward the cheaper end because the largest recipients are charismatic, globally valued ecosystems (rainforest, reefs, megafauna, oceans) whose aggregate existence value is unusually large. Editors who think diffuse existence/ecosystem value is easier or harder to bank as QALYs should move the point within the range accordingly.
- `windowLength` is score-neutral at the current globals (0% discount, 100-year limit): with startTime 3 + window 60 inside the horizon, `qalysDeliveredFraction` and the average discount factor are both 1, so 40 and 60 give an identical score. It is set to 60 to represent the real multi-decade benefit spread under any nonzero discount rate, not to boost the score; persistence is carried by `costPerQALY`. See the public Duration section.
- No recipient overrides or multiplies the `environmental` effect, so this category number flows through to all 31 environmental-tagged recipients weighted by their `environmental` fraction. Changing it will substantially lower credited impact for conservation-heavy donors (Bren, Plattner, Forrest, Wyss, Rausing) — that is the intended correction.
- Pollution-health work (lead, clean air) is immaterial in the current data — about 2% of the category, all environmental-justice advocacy, with no dedicated lead/air recipients — so it is left inside this category rather than split out. If a material pollution-health recipient is added, model it with a recipient-level override or revisit a category split. Key Uncertainty 4.
