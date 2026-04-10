---
id: effect-of-pandemic-risk-philanthropy
name: 'Effect of previous pandemic-risk philanthropy'
---

_The following analysis was done on April 10th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

## How much has existing pandemic-risk philanthropy reduced global catastrophic pandemic risk?

This document analyzes the question:

> By how many percentage points has roughly **\$400 million** of pandemic-risk philanthropy over about **10 years** reduced the probability of a **>10%-death global pandemic** over the next roughly **20 years**?

Let:

- $p_{\text{with}}$ = estimated probability of such a catastrophe in the actual world, with existing pandemic-risk philanthropy
- $p_{\text{without}}$ = estimated probability in a counterfactual world without that philanthropy
- $X = p_{\text{without}} - p_{\text{with}}$ in **percentage points**
- $Y, Z$ = lower and upper bounds of a practical positive range for $X$

A reasonable summary is:

- **Best-guess:**  
  $X \approx 0.04$ percentage points
- **Practical positive range:**  
  $Y \approx 0.01$ percentage points, $Z \approx 0.16$ percentage points

That is, roughly **\$400 million** of pandemic-risk philanthropy plausibly reduced 20-year catastrophic-pandemic risk by about **0.04 percentage points**, with a practical positive range of about **0.01–0.16 percentage points**.

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

The strongest public anchor is [Open Philanthropy's biosecurity and pandemic preparedness page](https://www.openphilanthropy.org/focus/biosecurity-pandemic-preparedness/), which as of 2026 reports:

- **140+ grants**
- **\$250+ million given**
- work in the field since **2015**

That already gets us most of the way to a mid-hundreds-of-millions estimate.

The [Founders Pledge GCBR report](https://dkqj4hmn5mktp.cloudfront.net/GCBR_Report_Founders_Pledge_7505b1ebe0.pdf) provides two important cross-checks:

- It notes that, excluding direct response funding and HIV-related pandemic funding, relevant philanthropic funding still remains in the **tens of millions**
- It says there were **no other funders working on the scale of Open Philanthropy as of mid-2023**
- Its external review notes that **Effective Giving** was allocating **more than \$10 million per year** toward mitigating global catastrophic biological risks at the time ([Founders Pledge GCBR report](https://dkqj4hmn5mktp.cloudfront.net/GCBR_Report_Founders_Pledge_7505b1ebe0.pdf))

Putting that together, the most defensible order-of-magnitude estimate is that explicitly pandemic-risk-focused philanthropy to date is in the **mid hundreds of millions**, not in the tens of billions and not in the mere tens of millions.

We therefore use:

$$
\$400 \text{ million over roughly 10 years}
$$

as a rough central anchor.

This is not meant to be precise. It is a BOTEC for the size of the field whose effect we are trying to estimate.

---

## 3. Why think the problem is tractable at all?

The case for nonzero tractability is much stronger than "pandemics are bad, so preparedness must help." There are several concrete levers.

### 3.1 Policy and governance levers

The U.S. government's [2024 OSTP Framework for Nucleic Acid Synthesis Screening](https://aspr.hhs.gov/S3/Pages/OSTP-Framework-for-Nucleic-Acid-Synthesis-Screening.aspx) requires, as a condition of receiving federal life-sciences funding, that synthetic nucleic acids and benchtop synthesis devices be procured from providers that comply with screening requirements. The related [2023 HHS guidance](https://aspr.hhs.gov/S3/Pages/Synthetic-Nucleic-Acid-Screening.aspx) explicitly broadens screening toward sequences of concern and recommends stronger customer and transfer verification.

That matters because it shows that one of the canonical pandemic-risk policy ideas is not merely hypothetical. Screening policy exists, it can be improved, and advocacy or technical work can help shape it.

At the international level, the [WHO Pandemic Agreement](https://www.who.int/health-topics/pandemic-agreement) was adopted on **20 May 2025**. That does not prove large risk reduction, but it does show that pandemic-governance infrastructure can move materially even after pandemic fatigue set in.

### 3.2 Technical and public-goods levers

The most vivid recent example is CEPI's [100 Days Mission](https://cepi.net/100-days-mission). CEPI cites modeling finding that if COVID vaccines had been available within 100 days of the viral genome release, the world could have averted about:

- **8.3 million excess deaths**
- nearly **\$1.4 trillion** in productivity losses
- more than **\$63 billion** in hospitalization costs

This does **not** directly tell us the probability reduction for a much worse pandemic. But it is strong evidence that preparedness investments can move outcomes by huge amounts even in a pandemic far smaller than the catastrophe modeled in the main category.

Similarly, the [GCSP paper on catastrophic pandemics](https://www.gcsp.ch/sites/default/files/2024-12/securing-civilisation-against-catastrophic-pandemics-gp-31.pdf) argues that current measures are inadequate against severe "wildfire" and "stealth" scenarios, but also identifies concrete defences: pandemic-proof PPE, healthy buildings, pathogen-agnostic early warning, and rapid countermeasures.

So the relevant solution space is not mystical. The problem is hard, but there are recognizable bottlenecks and candidate defenses.

---

## 4. How large is the baseline risk?

The [Existential Risk Persuasion Tournament](https://forecastingresearch.org/s/XPT.pdf) provides useful outside anchors. In postmortem medians for risk by **2100**:

- **Engineered-pathogen catastrophe:** about **3%** for domain experts and **0.8%** for superforecasters
- **Natural-pathogen catastrophe:** about **0.85%** for domain experts and **1%** for superforecasters

So the total catastrophic-pandemic risk by 2100 looks roughly like:

- **1.8%** if one leans toward superforecasters
- **3.85%** if one leans toward domain experts

The next **20 years** are not the whole century, but the hazard is also unlikely to be uniform through time. Risk may rise as synthetic biology, AI-enabled design, and synthesis capacity diffuse further. So a rough central view like:

- about **0.5–1.5%** catastrophic-pandemic risk over the next **20 years**

looks defensible.

That means a reduction of **0.04 percentage points** corresponds to a relative risk reduction on the order of only a **few percent**, not a dramatic claim that philanthropy has already solved the problem.

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

## 6. Why use 0.01–0.16 percentage points as the practical range?

### Lower bound: 0.01 percentage points

This lower bound corresponds to a world where:

- the underlying catastrophe risk is closer to the low end of the plausible range
- many philanthropic grants mostly built capacity rather than changed outcomes yet
- public institutions remained the main bottleneck
- some technically promising interventions did not translate into durable policy or deployment wins

That still gives philanthropy **some** credit, but only limited credit.

### Upper bound: 0.16 percentage points

This upper bound corresponds to a world where:

- engineered-risk pathways matter a lot
- philanthropy-backed policy, field-building, and technical work have already meaningfully improved preparedness
- early investments helped catalyze larger public or multilateral actions
- some of the best pandemic-risk opportunities really are as leveraged as biosecurity advocates claim

This is clearly optimistic, which is why it is an upper bound rather than the point estimate.

---

## 7. Implied cost per basis point and per microprobability

With the central estimate $X = 0.04$ percentage points:

- 0.04 percentage points = **4 basis points**
- \$400M / 4 bp = **\$100M per basis point**
- 0.0004 / 10^-6 = **400 microprobabilities**
- \$400M / 400 = **\$1M per microprobability**

For the lower bound $Y = 0.01$ percentage points:

- **100 microprobabilities**
- **\$4 million per microprobability**

For the upper bound $Z = 0.16$ percentage points:

- **1,600 microprobabilities**
- **\$250,000 per microprobability**

So the practical positive range is:

- **\$250,000–\$4 million per microprobability**

---

## 8. Summary

- **Central estimate:** roughly **\$400 million** of pandemic-risk philanthropy has reduced 20-year catastrophic-pandemic risk by about **0.04 percentage points**
- **Practical positive range:** about **0.01–0.16 percentage points**
- **Implied cost-effectiveness:** about **\$100M per basis point** or **\$1M per microprobability**

{{CONTRIBUTION_NOTE}}
