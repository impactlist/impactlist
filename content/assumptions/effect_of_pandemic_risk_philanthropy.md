---
id: effect-of-pandemic-risk-philanthropy
name: 'Effect of previous pandemic-risk philanthropy'
---

_The following analysis was done on April 10th 2026 by GPT-5.4, with prompts from Impact List staff._

## How much has existing pandemic-risk philanthropy reduced global catastrophic pandemic risk?

This document analyzes the question:

> By how many percentage points has roughly **\$400 million** of pandemic-risk philanthropy over about **10 years** reduced the probability of a **>10%-death global pandemic** over the next roughly **20 years**?

Let:

- $p_{\text{with}}$ = estimated probability of such a catastrophe in the actual world, with existing pandemic-risk philanthropy
- $p_{\text{without}}$ = estimated probability in a counterfactual world without that philanthropy
- $X = p_{\text{without}} - p_{\text{with}}$ in **percentage points**
- $Y, Z$ = lower and upper bounds of a {{PLAUSIBLE_RANGE}} for $X$

A reasonable summary is:

- **Best-guess:** $X \approx 0.04$ percentage points
- **Plausible range:** $Y \approx 0.004$ percentage points, $Z \approx 0.27$ percentage points

That is, roughly **\$400 million** of pandemic-risk philanthropy plausibly reduced 20-year catastrophic-pandemic risk by about **0.04 percentage points**, with a plausible range of about **0.004–0.27 percentage points**.

This corresponds to about:

- **4 basis points** per \$400 million
- about **10 basis points per \$1 billion**
- about **\$1 million per microprobability**

This is one of the most uncertain assumptions in the category. The evidence base is thin, the causal chains often run through governments and institutions rather than direct service delivery, and many of the most important risks are still emerging.

---

## 1. Conceptual framing

The quantity of interest is:

$$
X = p_{\text{without}} - p_{\text{with}}
$$

measured in **percentage points**.

For example, if current pandemic-risk philanthropy has reduced 20-year catastrophe risk from **1.04%** to **1.00%**, then:

$$
X = 0.04 \text{ percentage points}
$$

This sounds tiny, but the category is explicitly about very small changes in the probability of an extremely bad event.

There is no clean empirical way to measure $X$ directly. So the right approach is to combine:

1. the scale of the relevant philanthropic field
2. the concrete levers that field is trying to move
3. evidence that those levers are genuinely tractable
4. a rough estimate of what fraction of the full defensible solution set philanthropy may already have bought

---

## 2. What scale of philanthropy are we talking about?

The most defensible order-of-magnitude estimate is that explicitly pandemic-risk-focused philanthropy to date is in the **mid hundreds of millions** — not tens of billions, and not the mere tens of millions. We therefore use **\$400 million over roughly 10 years** as a rough central anchor: a BOTEC for the field's size, not a precise figure.

:::details{title="The funding anchors behind that figure"}
The strongest public anchor is [Open Philanthropy's biosecurity and pandemic preparedness page](https://www.openphilanthropy.org/focus/biosecurity-pandemic-preparedness/), which as of 2026 reports **140+ grants**, **\$250+ million given**, and work in the field since **2015** — already most of the way to a mid-hundreds-of-millions estimate.

The [Founders Pledge GCBR report](https://dkqj4hmn5mktp.cloudfront.net/GCBR_Report_Founders_Pledge_7505b1ebe0.pdf) adds cross-checks: excluding direct response and HIV-related funding, relevant philanthropic funding still remains in the **tens of millions**; there were **no other funders on Open Philanthropy's scale as of mid-2023**; and its external review notes **Effective Giving** was allocating **more than \$10 million per year** toward global catastrophic biological risks at the time.
:::

---

## 3. Why think the problem is tractable at all?

The case for nonzero tractability is much stronger than "pandemics are bad, so preparedness must help." There are several concrete levers — synthesis-screening policy, international pandemic governance, faster medical countermeasures, and transmission-blocking infrastructure — and recent history shows they can actually move. The problem is hard, but the solution space is not mystical: there are recognizable bottlenecks and candidate defenses.

:::details{title="The concrete tractability levers"}
**Policy and governance.** The U.S. government's [2024 OSTP Framework for Nucleic Acid Synthesis Screening](https://aspr.hhs.gov/S3/Pages/OSTP-Framework-for-Nucleic-Acid-Synthesis-Screening.aspx) requires, as a condition of receiving federal life-sciences funding, that synthetic nucleic acids and benchtop synthesis devices come from providers that comply with screening requirements; the related [2023 HHS guidance](https://aspr.hhs.gov/S3/Pages/Synthetic-Nucleic-Acid-Screening.aspx) broadens screening toward sequences of concern. This shows a canonical pandemic-risk policy idea is not merely hypothetical — screening policy exists, can be improved, and advocacy or technical work can shape it. At the international level, the [WHO Pandemic Agreement](https://www.who.int/health-topics/pandemic-agreement) was adopted on **20 May 2025**, showing pandemic-governance infrastructure can move materially even after pandemic fatigue set in.

**Technical and public goods.** The most vivid example is CEPI's [100 Days Mission](https://cepi.net/100-days-mission): CEPI cites modeling that COVID vaccines available within 100 days of genome release could have averted about **8.3 million excess deaths**, nearly **\$1.4 trillion** in productivity losses, and more than **\$63 billion** in hospitalization costs. That is strong evidence preparedness can move outcomes by huge amounts, even in a pandemic far smaller than the modeled catastrophe. The [GCSP paper on catastrophic pandemics](https://www.gcsp.ch/sites/default/files/2024-12/securing-civilisation-against-catastrophic-pandemics-gp-31.pdf) argues current measures are inadequate against severe "wildfire" and "stealth" scenarios but identifies concrete defences: pandemic-proof PPE, healthy buildings, pathogen-agnostic early warning, and rapid countermeasures.
:::

---

## 4. How large is the baseline risk?

A defensible central view is about **0.5–1.5%** catastrophic-pandemic risk over the next **20 years**, anchored on the [Existential Risk Persuasion Tournament](https://forecastingresearch.org/s/XPT.pdf) and adjusted because the hazard is unlikely to be uniform through time. At that baseline, a reduction of **0.04 percentage points** is a relative risk reduction of only a **few percent** — not a claim that philanthropy has already solved the problem.

:::details{title="The XPT baseline numbers"}
In XPT postmortem medians for risk by **2100**:

- **Engineered-pathogen catastrophe:** about **3%** for domain experts and **0.8%** for superforecasters
- **Natural-pathogen catastrophe:** about **0.85%** for domain experts and **1%** for superforecasters

So total catastrophic-pandemic risk by 2100 is roughly **1.8%** leaning toward superforecasters or **3.85%** leaning toward domain experts. The next 20 years are only part of the century, but risk may rise as synthetic biology, AI-enabled design, and synthesis capacity diffuse further — which is why a **0.5–1.5%** 20-year view looks defensible.
:::

---

## 5. Bridging from the full solution set to philanthropy's share

A plausible "full bundle" against catastrophic pandemics would include some combination of:

- tighter governance of high-risk research
- much better synthesis screening and other anti-proliferation safeguards
- stronger early detection and biosurveillance
- faster platform countermeasures
- better transmission-blocking infrastructure such as healthier indoor air and stronger PPE

We do **not** have a direct estimate for how many percentage points such a bundle would reduce catastrophic-pandemic risk. But the source stack above strongly suggests the answer is not "almost zero." A bundle like this attacks multiple distinct failure modes.

The central estimate in this document is:

$$
X = 0.04 \text{ percentage points}
$$

For that to be true, historical philanthropy only needs to have bought a **small but nontrivial slice** of the total available progress. That seems plausible because:

1. The field is explicitly trying to move unusually leveraged public-goods and policy levers.
2. Pandemic-risk philanthropy is tiny relative to the stakes, so diminishing returns should be weaker than in crowded fields.
3. Concrete policy and technical progress has occurred on exactly the kinds of levers the field has emphasized.
4. The field includes a substantial amount of capacity building and agenda setting, so one should expect the realized effect to be meaningful but not enormous.

For example, if a mature full bundle of plausible defenses could eventually cut 20-year catastrophic-pandemic risk by something like **0.5-2 percentage points**, then **0.04 percentage points** would correspond to only about **2-8%** of that total. That seems like a demanding but not implausible amount of progress for a small field over roughly a decade.

The claim is therefore modest. It is **not** that philanthropy has made catastrophic pandemics unlikely. It is only that a field of this size may already have shaved a few parts in ten thousand off a very bad 20-year risk.

---

## 6. Why use 0.004–0.27 percentage points as the plausible range?

The biggest uncertainty here is not how to split a few scenario parameters — it is whether a small philanthropic field has any real counterfactual leverage over catastrophic-pandemic probability at all, and whether crediting it with a slice of government- and institution-led outcomes is even the right model. That structural uncertainty is what makes the range span almost two orders of magnitude.

### Lower bound: 0.004 percentage points

The dominant downside scenario is that philanthropy's counterfactual leverage is close to zero: the field mostly built capacity and produced research that has not yet changed any decision, public institutions remained the binding constraint, and the most technically promising interventions never translated into durable policy or deployment. In that world philanthropy bought only a few parts in a hundred thousand off the risk — far less than the few-percent-of-the-bundle slice the central estimate assumes.

### Upper bound: 0.27 percentage points

The dominant upside scenario is that engineered-risk pathways matter a lot, philanthropy-backed policy, field-building, and technical work have already meaningfully improved preparedness, early investments helped catalyze much larger public or multilateral actions, and some of the best pandemic-risk opportunities really are as leveraged as biosecurity advocates claim. That would put the field's contribution at roughly a tenth to a half of the full plausible defense bundle from section 5 — demanding, but not impossible for a neglected field shaping high-leverage public goods.

Both tails are about whether the causal model holds, not about tuning a parameter inside it, which is why the interval is wide and slightly skewed toward the low-leverage (high-cost) side.

---

## 7. Implied cost per basis point and per microprobability

With the central estimate $X = 0.04$ percentage points, \$400M buys **4 basis points** of risk reduction — about **\$100M per basis point**, or **400 microprobabilities** at **\$1M per microprobability**. The plausible bounds ($Y = 0.004$, $Z = 0.27$ percentage points) correspond to **40–2,700 microprobabilities**, a cost-per-microprobability range of roughly **\$150,000–\$10 million**. The pandemics category page carries that same range.

{{CONTRIBUTION_NOTE}}
