---
id: cumulative-frontier-ai-spending-before-transformative-ai
name: 'Cumulative frontier AI spending before transformative AI'
---

## How much frontier AI spending happens before transformative AI arrives?

This document asks:

> Before transformative AI arrives, how much total **frontier or near-frontier capability spending** will the world plausibly do?

**Summary:** We use **\$5 trillion** as a central estimate, with a {{PLAUSIBLE_RANGE}} of **\$2–20 trillion**. The estimate is essentially one product — roughly **\$500 billion/year** of frontier-relevant spending, averaged over the **~10 years** until transformative AI ([timelines estimate](/assumption/timelines-to-agi)). Both factors are deeply uncertain, which is why the range is wide: a slower ramp or a sooner arrival points lower, a sustained capex boom and longer timelines point higher. The capex examples below are an **early-2026 snapshot** and should be refreshed periodically.

**What counts:** frontier and near-frontier capability spending — model training, frontier-lab R&D, and the compute, chip, and energy buildout that pushes the frontier — **not** all spending on "AI" in the broadest sense. Most enterprise software adoption, routine automation, and downstream app work is excluded.

:::details{title="The full inclusion list"}
We include:

- model training and inference infrastructure
- data centers, chips, and energy buildout
- frontier-lab research staff
- data, tooling, and algorithmic work that materially moves the frontier
- adjacent academic and open-model work that is close enough to count as frontier-relevant

We do **not** mean all spending on "AI" in the broadest sense. Most enterprise software adoption, routine automation, and downstream app work should not be counted in full here.
:::

---

## 1. Why the answer is in the trillions, but not the \$20–50 trillion naive extrapolation implies

Current frontier-relevant spending is already large enough that even a decade near today's scale lands well into the trillions. So a denominator like \$100 billion or even \$500 billion is too low. But exponential extrapolation out to \$20-50 trillion is also overconfident. The \$5T central estimate sits between these bounds.

:::details{title="The spending data that puts the floor in the trillions"}
- Stanford's 2025 AI Index reports **\$252.3 billion** of global corporate AI investment in 2024, including **\$33.9 billion** in private generative-AI investment. ([Stanford AI Index 2025, Economy chapter](https://hai.stanford.edu/ai-index/2025-ai-index-report/economy))
- OpenAI's Stargate project says it intends to invest **\$500 billion over four years** in AI infrastructure. ([OpenAI 2025](https://openai.com/index/announcing-the-stargate-project/))
- Epoch AI estimates frontier AI labs have already raised **more than \$170 billion**. ([Epoch AI](https://epoch.ai/trends))
- Epoch also reports that training compute for frontier language models has been growing at about **5x/year** since 2020 and training cost at about **3.5x/year**. ([Epoch AI](https://epoch.ai/trends))

If frontier-relevant spending stayed anywhere near current scale for even a decade, cumulative totals would already land well into the trillions. If current capex plans continue, totals could rise much faster. So a denominator like \$100 billion or even \$500 billion is now too low for most serious timing models.
:::

:::details{title="The four reasons it is not $20–50 trillion"}
We should not simply extrapolate current exponential growth forever:

1. **Not all AI investment is frontier investment.** A large share of current spending is adoption, applications, services, and ordinary enterprise tooling.
2. **Timelines may be shorter than a simple long-run capex trend suggests.** If transformative AI arrives in the mid-2030s, cumulative pre-transformative spending has less time to compound.
3. **Some bottlenecks are physical and institutional.** Power, permitting, chip supply, and geopolitics can all slow the rate at which money turns into effective frontier compute.
4. **Algorithmic progress substitutes for spending.** Better algorithms reduce the amount of physical spending needed to reach a given capability level.

So it would also be overconfident to assume frontier-relevant spending before transformative AI must be, say, \$20-50 trillion.
:::

---

## 2. The calculation: annual rate times timeline

We treat cumulative spending as one product:

$$
\text{Cumulative spend} \approx \text{average annual frontier-relevant spend} \times \text{years to transformative AI}
$$

Our [timelines estimate](/assumption/timelines-to-agi) puts AGI — and roughly with it, transformative AI — in the mid-2030s, on the order of **10 years** out. Frontier-relevant spending is already in the low hundreds of billions per year and ramping hard. So we take **\$500 billion/year** as a reasonable average over that horizon, giving $500\text{B} \times 10 = 5\text{T}$. This is a stylized estimate, not a forecast.

:::details{title="Why 500 billion/year is a reasonable average, and the timeline anchor"}
The ~10-year horizon is substantially sooner than the dated 50%-HLMI-by-2047 figure from the 2023 expert survey, whose definition also requires automating physical work.

Frontier-relevant spending — the model training, frontier-lab R&D, and the compute, chip, and energy buildout that actually pushes the frontier, **not** routine enterprise adoption or downstream apps — is already in the low hundreds of billions of dollars per year and ramping hard. Hyperscaler AI capex and projects like Stargate (≈\$125 billion/year on its own) are scaling quickly, and frontier training compute has been growing about 5x/year. Spending starts in the hundreds of billions today and rises toward \$1 trillion+/year as the buildout continues. So a \$500 billion/year average over the next ~10 years is a reasonable midpoint.
:::

---

## 3. Our point estimate: \$5 trillion

We use:

$$
S_{\text{total}} \approx \$5 \text{ trillion}
$$

as our central estimate of total frontier or near-frontier capability spending before transformative AI.

The estimate has just two uncertain inputs, and we treat each as a plausible range:

- **Average annual frontier-relevant spend:** central **\$500 billion/year**, plausible range **\$250 billion–\$1 trillion/year**. The low end is a world where only a fairly narrow slice of AI capex is truly frontier-relevant; the high end is a sustained capex boom averaging near \$1 trillion/year as today's hundreds-of-billions ramp continues.
- **Years to transformative AI:** central **~10 years**, plausible range **~4–24 years** (2030–2050), taken directly from the [timelines estimate](/assumption/timelines-to-agi).

Our published plausible range is **\$2–20 trillion**. It is wide because both inputs are deeply uncertain, and skewed upward because the two move together. A longer timeline is also the world in which the capex boom has more years to compound. So the high tail (long timeline _and_ a sustained boom) stretches further than a soonish, narrow-frontier low tail. The width reflects those two parameters plus structural uncertainty about where the "frontier-relevant" boundary really falls.

:::details{title="Both inputs at the same extreme, and why our range is narrower"}
Multiplying the extremes of the two ranges gives a mechanical corner of about **\$1 trillion** (4 years at \$250 billion/year) to **\$24 trillion** (24 years at \$1 trillion/year). That corner is wider than the plausible range: with only two independent inputs, pushing both to the same extreme together represents a more extreme joint case than either input's own range endpoint.

Treating the two as independent, the plausible range would be roughly the corner's log-width divided by $\sqrt{2}$, which gives about **\$1.6–15 trillion**. We then widen back toward the corner on the high side, for two reasons: the inputs are positively correlated (long timelines and a sustained boom tend to arrive together), and the frontier-relevant boundary adds structural uncertainty the two parameters do not capture. On the low side we hold the floor near \$2 trillion rather than \$1 trillion. A soon-arriving transformative AI means the window is dominated by today's already-large and rising capex (Stargate alone is ≈\$125 billion/year), so a very short horizon and a very low average rate cannot both hold at once. The result is our published **\$2–20 trillion**.
:::

- **\$2 trillion** if transformative AI arrives relatively soon, or if only a fairly narrow slice of future AI capex turns out to be truly frontier-relevant.
- **\$20 trillion** if timelines are longer, the capex boom continues, and a larger fraction of spending ends up mattering for the frontier.

---

## 4. Why this assumption matters

This denominator appears in both the upside and downside timing models for AGI Development.

- A **smaller** denominator means a marginal dollar moves timelines more, making both the very good transformative-AI upside and the AI-catastrophe downside in [AGI Development](/cause/ai-capabilities) stronger.
- A **larger** denominator means marginal funding matters less, making both effects weaker.

If you think transformative AI is coming soon and that current capex is highly frontier-relevant, use a lower number.
If you think timelines are longer, or that much future spending will be downstream and not frontier-moving, use a higher number.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on April 6th 2026 by GPT-5, with prompts from Impact List staff._

The \$5T central estimate now reflects a roughly \$500B/year average over a ~10-year horizon (see [timelines to AGI](/assumption/timelines-to-agi)). It could drift upward if frontier capex keeps rising — Stargate alone implies ~\$125B/year, and sustained hyperscaler spending could push the average annual rate well above \$500B — though the current \$2–20T range still covers that.

The \$2–20T published range is a best-judgment plausible range, not the mechanical corner. Inputs: average annual frontier-relevant spend \$250B–\$1T and years to transformative AI 4–24 (from the timelines page's 2030–2050). The two-input corner is ~\$1–24T; the independent-baseline plausible range (corner log-width / sqrt(2)) is ~\$1.6–15T; we widen the high side toward the corner for positive correlation between long timelines and sustained capex plus frontier-boundary structural uncertainty, and hold the low floor near \$2T because a short horizon locks in today's already-large capex. The years range here (4–24) is intentionally the full timelines plausible range, wider than the ~6–17 years a narrower central-window sweep would use. The \$5T central is unchanged; [ai-capabilities](/cause/ai-capabilities) consumes only that point estimate (Effect 2 Assumption 3 and Effect 3 Assumption 2), so this range change does not cascade.
