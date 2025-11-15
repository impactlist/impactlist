---
id: nuclear
name: 'Nuclear'
effects:
  - effectId: population
    startTime: 25
    windowLength: 30
    costPerMicroprobability: 2_500_000
    populationFractionAffected: 0.9
    qalyImprovementPerYear: 0.75
---

# Justification of cost per life

_The following analysis was done on November 13th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

Unlike a 'normal' cause category where we compute the cost per life by first estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), donations to this category aim to avert a low probability but catastrophic event. We therefore will define an event, determine what fraction of the global population this event would likely affect, determine how much this event would harm each person affected, and estimate the cost of reducing the likelihood of this event by one in a million.

### Headline estimates

- **Event definition:** An all-out nuclear war between major powers (for example the US and Russia) leading to large-scale nuclear winter and global famine.
- **Cost per microprobability (1-in-1,000,000 reduction in the probability of at least one such war over ~100 years):**
  - Point estimate: \$2.5 million per microprobability.
  - 80% subjective range: \$0.5 million–\$10 million per microprobability.
- **Fraction of world population affected if war occurs:**
  - Point estimate: 0.9
  - 80% range: 0.6–1.0
- **Average QALY improvement per affected person per year if the war is averted:**
  - Point estimate: 0.75
  - 80% range: 0.5–1.0
- **Duration of the effect (how long individuals would otherwise be affected):**
  - Point estimate: 30 years
  - 80% range: 20–50 years

Under these central assumptions, if the world population at the time of war is about 10 billion, a full-scale nuclear war would destroy roughly

$$
Q_{\text{event}} \approx f_{\text{aff}} \times N_{\text{world}} \times q_{\text{imp}} \times D
= 0.9 \times 10^{10} \times 0.75 \times 30 \approx 2.0 \times 10^{11}
$$

QALYs (about 200 billion QALYs).

A 1-in-1,000,000 reduction in the probability of such a war therefore **saves about 200,000 expected QALYs**. Combined with the cost estimates above, that implies an approximate cost per QALY in the range:

- \$2.5–\$50 per QALY, with a central estimate around \$12 per QALY.

All numbers are highly uncertain and based on simplified modeling, but they illustrate why many researchers regard nuclear-risk reduction as potentially extremely cost-effective.

---

### How likely and how severe is an all-out nuclear war?

Modern work on nuclear winter and global catastrophic risk suggests that a full-scale US–Russia nuclear exchange could kill **billions of people**, mostly through the knock-on effects on food systems rather than the immediate blasts.

- A 2022 study in _Nature Food_ by Xia et al. models several nuclear-war scenarios and finds that a US–Russia war could inject enough soot into the stratosphere to cut global calorie production by around 90%. They estimate that **more than 5 billion people** could die from famine in this scenario, on top of hundreds of millions of direct casualties from the war itself. See [Xia et al. (2022)](https://www.nature.com/articles/s43016-022-00573-0) and popular summaries from [Rutgers University](https://www.rutgers.edu/news/nuclear-war-would-cause-global-famine-and-kill-billions-rutgers-led-study-finds).
- Luisa Rodriguez’s work with Rethink Priorities reviews both direct deaths and nuclear-winter deaths from a US–Russia exchange and arrives at similar magnitudes, with a central estimate around **5–5.5 billion total deaths** in many “full-scale war” scenarios: see her series on the [severity of nuclear war](https://forum.effectivealtruism.org/posts/MCim4PoqmFPCcPy9m/updated-estimates-of-the-severity-of-a-nuclear-war).
- Shulman and Thornley (2025), summarizing this literature, treat a **full-scale nuclear war killing at least 5 billion people** as a “global catastrophe” and suggest that the probability of some such war over the next century is on the order of a few percent. Their numbers are broadly consistent with earlier estimates by Toby Ord in _The Precipice_, who suggests roughly a **5% chance of full-scale nuclear war over the next 100 years**.

These estimates are deeply uncertain, and reasonable experts disagree, especially on the severity of nuclear winter and the long-run effects on civilization. But the broad picture is that:

- A full-scale US–Russia (or similar great-power) nuclear war is:
  - Unlikely in any given year.
  - Plausibly **non-negligible** over a century (order of 1–10%).
  - Catastrophic enough that **expected harm per percentage point of risk is enormous**.

For this cause area we focus on the **worst-case “thermonuclear exchange” scenarios** — the wars that are big enough to threaten billions of lives and long-lasting global disruption.

---

### Fraction of the world’s population affected

Our “fraction affected” parameter is meant to capture everyone whose life expectancy or quality of life would be significantly worse because of the war, not just those killed in the initial blasts.

Several strands of evidence support taking this fraction to be **very large** for an all-out war:

1. **Direct casualties.** Major population centres in the US, Russia, Europe, and China are likely targets. Depending on targeting strategy, hundreds of millions could die in the first days to weeks of the war.

2. **Nuclear winter and food systems.** The Xia et al. modeling suggests that in a full US–Russia exchange, global calorie production could fall by around 90%, and more than 5 billion people could ultimately starve. This implies that **a majority of humanity, including many people in countries far from the initial conflict, would be directly affected** via famine and economic collapse.

3. **Globalized economies and infrastructure.** Modern supply chains are tightly coupled. A collapse in major economies and trade systems would propagate quickly, affecting food, medicine, energy, and governance nearly everywhere on Earth, even in regions that escape bombardment and the worst climatic shifts.

Putting this together, a reasonable central estimate is that **around 90% of the world’s population would be seriously affected** by an all-out nuclear war, with a wide uncertainty band of 60–100%. This is what we encode with:

- **Fraction of world population affected (point estimate):** 0.9
- **80% range:** 0.6–1.0

---

### QALY impact per affected person

To estimate the **QALY improvement per affected person per year** if the war is averted, we distinguish (crudely) between those who would die and those who would survive with severely reduced quality of life.

A stylized scenario for a full-scale war might look like this (assuming a world population of 10 billion at the time of war):

- **Around 5 billion people die** (mostly from famine), roughly in line with [Xia et al. (2022)](https://www.nature.com/articles/s43016-022-00573-0) and Rodriguez’s estimates.

  - Suppose their average remaining life expectancy at the time of war would have been about 40 years.
  - Suppose their average quality of life in those years would have been 0.9 QALYs per year (to reflect some normal level of illness and hardship).
  - Then each death corresponds to about $40 \times 0.9 = 36$ QALYs lost.

- **Around 4 billion people survive but undergo deep hardship**:

  - For example, 10 years of severe famine, economic collapse, and political instability.
  - Suppose their quality of life falls from 0.9 to 0.4 during the worst 10 years (a loss of 0.5 QALYs per year).
  - After that, conditions gradually improve; we approximate this as an additional 10 years with a 0.2 QALY per year loss.
  - This is roughly $10 \times 0.5 + 10 \times 0.2 = 7$ QALYs lost per surviving person.

- The remaining 1 billion people (in relatively spared regions) might still suffer economic disruption, psychological stress, and reduced access to services; we approximate this as a modest 1 QALY loss per person on average.

Adding this up:

- Deaths: $5\ \text{billion} \times 36 \approx 180\ \text{billion QALYs}$
- Severe survivors: $4\ \text{billion} \times 7 \approx 28\ \text{billion QALYs}$
- Mildly affected: $1\ \text{billion} \times 1 \approx 1\ \text{billion QALYs}$

Total QALY loss if such a war occurs is therefore very roughly **209 billion QALYs**, which is close to the 200 billion implied by our simpler parameterization.

To make this compatible with our model (where the QALY improvement per affected person is constant over some duration $D$), we:

- Define the **affected population** as 90% of humanity at the time, i.e. 9 billion people.
- Set a **duration** $D$ such that deaths and prolonged hardship are averaged over time:
  - We use **30 years** as a central estimate, reflecting a blend of:
    - Shorter but very intense suffering for survivors.
    - Longer life-years lost by those who die in the war or in the following famine.
- Choose a constant per-year improvement $q_{\text{imp}}$ for each affected person so that:

  $$
  q_{\text{imp}} \times D \approx \frac{209\ \text{billion QALYs}}{9\ \text{billion people}} \approx 23\ \text{QALYs per affected person}.
  $$

  For $D = 30$, this implies $q_{\text{imp}} \approx 23 / 30 \approx 0.75$.

This is the basis for our parameter choice:

- **QALY improvement per affected person per year (point estimate):** 0.75
- **80% range:** 0.5–1.0

An upper bound is 1.0, which corresponds to everyone who is affected dying immediately and losing a full year of life per calendar year of the duration. The lower bound of 0.5 allows for possibilities where:

- Fewer people die than in the Xia/ Rodriguez scenarios.
- Long-term institutional recovery is faster or more effective than we expect.
- Quality-of-life reductions are milder for many survivors.

Even at the low end, the QALY loss per affected person is large compared to typical health or poverty interventions.

---

### Duration of the averted event

As discussed above, we use **30 years** as the central duration over which affected individuals’ QALYs are significantly reduced. Intuitively, this is a rough compromise between:

- The **short-term devastation** (first 10–15 years) when famine, disease, and conflict are especially acute.
- The **longer-term loss of life expectancy** for those who die, whose unrealized life-years would have stretched over several decades.
- The possibility of **slow institutional and environmental recovery**: even if global food systems recover within a decade or two, social and economic scars could last much longer.

We therefore set:

- **Duration (point estimate):** 30 years
- **80% range:** 20–50 years

---

### Cost per microprobability: where does \$2.5 million come from?

The most speculative part of this analysis is the **cost per microprobability**: how much it costs, in expectation, to reduce the probability of a full-scale nuclear war by one part in a million.

There is no direct, consensus estimate for this quantity. However, several lines of reasoning from effective altruist and adjacent work help anchor a plausible range.

#### 1. Back-of-the-envelope from near-term lives saved

A simple calculation that has appeared in EA discussions (for example in [“The bare-bones case for caring about global catastrophic risk”](https://amarcusdavis.substack.com/p/the-bare-bones-case-for-caring-about)) goes roughly like this:

- Suppose there is a **40% chance** of a full-scale nuclear war this century.
- Suppose such a war would kill **5 billion people** (close to the Xia and Rodriguez estimates).
- Suppose an additional \$25 billion spent on the best nuclear-risk interventions could reduce the absolute probability of such a war by **1 percentage point** (from 40% to 39%).

Then:

- The expected number of deaths averted is  
  $5\ \text{billion} \times 0.01 \times 0.40 = 20\ \text{million}$.
- The cost per death averted is

  $$
  \frac{\$25\ \text{billion}}{20\ \text{million}} \approx \$1{,}250\ \text{per life}.
  $$

- If each life averted corresponds to roughly 30–40 QALYs, this implies **\$30–\$40 per QALY**.

This is already highly competitive with many health and poverty interventions, even before accounting for the value of preserving civilization’s long-term potential. Importantly for our microprobability parameter:

- A **1 percentage point** absolute risk reduction is **0.01 = 10,000 microprobabilities**.
- At \$25 billion for this reduction, the implied **cost per microprobability** is:

  $$
  \frac{\$25\ \text{billion}}{10{,}000} \approx \$2.5\ \text{million per microprobability}.
  $$

This aligns nicely with our central estimate of \$2.5 million per microprobability.

#### 2. Comparison to “last-dollar” existential-risk benchmarks

Longtermist funders such as Open Philanthropy have published internal benchmarks for what they consider an acceptable “last-dollar” cost-effectiveness threshold for reducing existential risk. One such benchmark, discussed in the context of climate-related x-risk, is roughly:

- Spending \$1 billion to reduce existential risk by **0.0005** (0.05 basis points).

This corresponds to:

- This corresponds to:

  $$
  \frac{\$1\ \text{billion}}{0.0005 / 10^{-6}} = \frac{\$1\ \text{billion}}{500\ \text{microprobabilities}} \approx \$2\ \text{million per microprobability}.
  $$

  So roughly **\$2 million per microprobability** of existential catastrophe.

Nuclear war is _less likely_ than AI-related existential risk to literally wipe out humanity, but it is **much better understood technically** and arguably **more tractable in the near term**, because it involves familiar state actors and institutions such as arms-control treaties, launch-on-warning protocols, and command-and-control systems. It does not seem unreasonable to believe that:

- High-leverage nuclear-risk work (for example as prioritized by [Founders Pledge](https://www.founderspledge.com/research/global-catastrophic-nuclear-risk-a-guide-for-philanthropists) and [Longview Philanthropy’s Nuclear Weapons Policy Fund](https://www.givingwhatwecan.org/charities/longview-philanthropy-nuclear-weapons-policy-fund)) could achieve **microprobability-level changes in war risk** at costs broadly comparable to or somewhat worse than these thresholds.

This again suggests a ballpark cost of **a few million dollars per microprobability** rather than hundreds of millions.

#### 3. Field size and plausible influence

Current philanthropic spending on nuclear-risk reduction is tiny compared to the stakes:

- Founders Pledge estimates that **philanthropic funding for nuclear security is only about \$30 million per year**, after some large foundations exited the field.
- By contrast, the governments of nuclear-armed states spend **hundreds of billions of dollars per year** maintaining and modernizing their arsenals.

Despite its small size, past philanthropic work is widely credited with influencing major arms-control milestones (e.g., the development of nuclear winter theory, supporting civil-society pressure for strategic arms reduction, and informing policymakers). If an additional \$1–\$10 billion of well-targeted funding over several decades can:

- Change the course of even one or two key policies (such as launch-on-warning postures, arms-control treaties, or crisis-management protocols), and
- These changes plausibly reduce the chance of all-out war by even **a few basis points** (0.01–0.1 percentage points),

then the implied costs per microprobability naturally fall in the **hundreds of thousands to tens of millions of dollars** range.

Given the large modeling uncertainties and the possibility that some interventions fail completely, we take a fairly conservative stance within this broad band.

#### Final parameter choice

Pulling these threads together, we use:

- **Point estimate:** \$2.5 million per microprobability.
- **80% range:** \$0.5 million–\$10 million per microprobability.

This range spans over an order of magnitude to reflect both:

- Uncertainty about how much additional philanthropy can actually influence nuclear policy and doctrine.
- Uncertainty about how much those policy changes would reduce the probability of the very worst war scenarios, as opposed to smaller conflicts.

---

### What kinds of charities are we implicitly modeling?

The cost per microprobability estimate assumes that marginal donations go to **high-leverage, policy-focused nuclear-risk organizations** — roughly the kind of work prioritized by:

- [Founders Pledge’s Global Catastrophic Risks Fund](https://www.founderspledge.com/research/global-catastrophic-nuclear-risk-a-guide-for-philanthropists), especially projects aimed at worst-case nuclear scenarios.
- [Longview Philanthropy’s Nuclear Weapons Policy Fund](https://www.givingwhatwecan.org/charities/longview-philanthropy-nuclear-weapons-policy-fund), which focuses on escalation control, arms-race dynamics among great powers, and other high-leverage policy interventions.
- Specialized research and advocacy groups working on nuclear winter modeling, crisis hotlines, launch-on-warning doctrine, arms-control negotiations, and de-escalation norms.

These organizations aim not primarily to eliminate all nuclear weapons, but to **reduce the probability and severity of great-power nuclear war**, especially through:

- Improving crisis-management and communication during high-tension periods.
- Strengthening arms-control and verification regimes.
- Reducing incentives for risky postures such as launch-on-warning and dangerous MIRV deployments.
- Refining our scientific understanding of nuclear winter, thereby improving decision-makers’ appreciation of the stakes.

The model here assumes that marginal funding will support **the best opportunities in this space**, as assessed by impact-focused evaluators, rather than generic peace or disarmament campaigns.

---

### Key uncertainties

The numbers above should be taken as **order-of-magnitude estimates**, not precise predictions. Major uncertainties include:

1. **Baseline risk of all-out war.** If the true probability over the next century is much lower than 5%, then each microprobability reduction is proportionally more valuable in “percentage of risk removed,” but there might be fewer tractable ways to change that risk. If the probability is much higher, the stakes of marginal risk reduction are even larger, but the problem may be more difficult or politically constrained.

2. **Severity of nuclear winter.** Some researchers are more skeptical of the most extreme nuclear-winter models; if the true climate impact is milder, total QALY losses might be closer to tens of billions than hundreds of billions. On the other hand, the models could be underestimating cascading failures in food, energy, and governance systems.

3. **Effectiveness of interventions.** It is very hard to map specific grants or advocacy campaigns to quantified changes in war probability. The cost per microprobability range (\$0.5–\$10 million) is largely an informed guess, anchored to other risk-reduction benchmarks rather than direct empirical data.

4. **Distributional and qualitative effects.** Nuclear war would not affect all populations equally. Some regions (for example parts of the southern hemisphere) might fare substantially better than others, while some groups (children, the poor, those in fragile states) might suffer disproportionately. Our “average QALY impact per affected person” smooths over these differences.

5. **Long-run societal impact.** These estimates do **not** explicitly include the potential loss of humanity’s long-term future (for example, if nuclear war caused permanent civilizational collapse). If such scenarios have even modest probability, the benefits of risk reduction would be much larger than the QALY numbers reported here.

Despite these uncertainties, the combination of:

- Enormous potential harm if an all-out nuclear war occurs, and
- Plausible pathways for philanthropy to influence nuclear policy,

makes nuclear-risk reduction a serious contender as a highly cost-effective cause area, even when evaluated solely in terms of QALYs for currently existing and near-future people.

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes
