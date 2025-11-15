---
id: pandemics
name: 'Pandemics'
effects:
  - effectId: population
    startTime: 20
    windowLength: 10
    costPerMicroprobability: 1_000_000
    populationFractionAffected: 0.8
    qalyImprovementPerYear: 0.5
---

# Justification of cost per life

_The following analysis was done on November 15th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

Unlike a “normal” cause category where we estimate the cost per QALY (quality-adjusted life-year) for relatively frequent events, donations to pandemics charities in this category aim to avert a low probability but extremely serious event. Here we define such an event, estimate how many people it would affect and how much it would harm them, and then estimate the cost of reducing the probability of that event by one in a million.

---

### Headline estimates

- **Event definition:**  
  A global catastrophic pandemic (natural or engineered) that kills around 10% of the world’s population (roughly 1 billion people in a world of 10 billion) and causes long-lasting health and social damage to billions of survivors. This is similar in scale to the “global catastrophic biological risks” (GCBRs) discussed by the Johns Hopkins Center for Health Security and Founders Pledge, which they define as biological events that could cause “sudden, extraordinary, widespread disaster” and even threaten civilisation itself ([example report](https://dkqj4hmn5mktp.cloudfront.net/GCBR_Report_Founders_Pledge_7505b1ebe0.pdf)).

- **Cost per microprobability**  
  A _microprobability_ is a one-in-a-million absolute reduction in the chance that this event occurs (over roughly the next 100 years).

  - Point estimate: \$1 million per microprobability.
  - 80% subjective range: \$0.1 million–\$10 million per microprobability.

- **Fraction of world population affected if the event occurs ($f_{\text{aff}}$):**

  - Point estimate: 0.8
  - 80% range: 0.5–1.0

- **Average QALY improvement per affected person per year if the event is averted ($q_{\text{imp}}$):**

  - Point estimate: 0.5
  - 80% range: 0.3–0.8

- **Duration of the effect (how long individuals would otherwise be affected, $D$):**

  - Point estimate: 10 years
  - 80% range: 5–20 years

- **Expected “start time” of the averted event:**
  - Point estimate: 40 years from now (around 2065)
  - 80% range: 10–70 years

Using these central assumptions, and assuming a world population of about $N_{\text{world}} = 10^{10}$ (10 billion) at the time of catastrophe, a global catastrophic pandemic would destroy roughly

$$
Q_{\text{event}} \approx f_{\text{aff}} \times N_{\text{world}} \times q_{\text{imp}} \times D
= 0.8 \times 10^{10} \times 0.5 \times 10 \approx 4.0 \times 10^{10}
$$

QALYs (about **40 billion QALYs**) for people alive at that time.

A 1-in-1,000,000 reduction in the probability of this event therefore **saves about**

$$
Q_{\text{micro}} \approx Q_{\text{event}} \times 10^{-6} \approx 4.0 \times 10^{4}
$$

**expected QALYs** (around 40,000 QALYs).

Combining this with the cost per microprobability gives an approximate **cost per QALY** of:

- Central cost per microprobability: \$1 million

  $$
  \Rightarrow \text{cost per QALY} \approx \frac{\$1\ \text{million}}{4.0 \times 10^{4}} \approx \$25 \text{ per QALY.}
  $$

- 80% range on cost per QALY (from \$0.1 million–\$10 million per microprobability):
  - Low end: around \$2.5 per QALY.
  - High end: around \$250 per QALY.

---

### How likely and how severe is a catastrophic pandemic?

History shows that pandemics can be extraordinarily destructive.

- The 1918 influenza pandemic infected around a third of the world’s population and killed an estimated **50 million people** (possibly up to 100 million), with a case fatality rate over 2.5% when global population was about 1.8 billion ([CDC](https://archive.cdc.gov/www_cdc_gov/flu/pandemic-resources/1918-commemoration/1918-pandemic-history.htm), [Taubenberger & Morens](https://pmc.ncbi.nlm.nih.gov/articles/PMC3291398/)).
- COVID-19 has been far less severe than our “catastrophic pandemic” scenario but still killed roughly **15 million people** in excess deaths in 2020–2021 alone, according to WHO estimates ([WHO news release](https://www.who.int/news/item/05-05-2022-14.9-million-excess-deaths-were-associated-with-the-covid-19-pandemic-in-2020-and-2021), [analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC9812776/)). It also caused trillions of dollars in economic losses and profound social disruption.
- The Founders Pledge report on global catastrophic biological risks notes that future biological threats—especially those involving engineered pathogens—could kill “hundreds of millions or even billions of people” and potentially cause civilizational collapse ([Global Catastrophic Biological Risks: A Guide for Philanthropists](https://dkqj4hmn5mktp.cloudfront.net/GCBR_Report_Founders_Pledge_7505b1ebe0.pdf)).

Contemporary risk assessments support the idea that the chance of such a catastrophe this century is small but not negligible:

- In _The Precipice_, Toby Ord’s original estimates give a **1 in 30** (≈3.3%) chance that an existential catastrophe this century arises from pandemics (primarily engineered ones), and he maintains this as his best-guess in a 2024 update, [“The Precipice Revisited”](https://www.tobyord.com/writing/the-precipice-revisited).
- Gregory Lewis, in his full report for 80,000 Hours on [reducing global catastrophic biological risks](https://80000hours.org/problem-profiles/preventing-catastrophic-pandemics/full-report/), estimates that **anthropogenic GCBRs are around the 1% risk mark or greater this century**, with natural GCBRs somewhat less likely.
- Giving What We Can’s overview of [biosecurity and pandemic preparedness](https://www.givingwhatwecan.org/cause-areas/reducing-global-catastrophic-risks/biosecurity) highlights expert judgments suggesting non-trivial probabilities of pandemics that kill at least 1 billion people (roughly 10% of the current world population) by 2100.

Taken together, these sources suggest that:

- **Global catastrophic pandemics—especially engineered ones—are among the most serious global risks this century.**
- The probability in any given year is low, but aggregated over 100 years, the chance of at least one such event is large enough that small risk reductions can be very valuable.

Our model does **not** assume a particular probability for such a pandemic; instead, it asks: conditional on there being some baseline risk, how much QALY benefit do we get from a tiny absolute reduction in that risk, and how much might that reduction cost?

---

### Fraction of the world’s population affected

In a truly catastrophic pandemic, the effects go far beyond those who die or are infected.

Historical and modern evidence suggests that:

- A sufficiently transmissible and lethal pathogen can infect **a large share of the global population**, as in 1918 when about a third of humanity became sick ([CDC](https://archive.cdc.gov/www_cdc_gov/flu/pandemic-resources/1918-commemoration/1918-pandemic-history.htm)).
- Modern globalisation, dense urban centres, and fast international travel make it easier for such pathogens to spread rapidly worldwide, as seen in COVID-19.

Our event definition focuses on pandemics killing roughly 10% of the world’s population and causing long-term disruption:

- If 10% of the world die, many more are likely to experience serious illness, bereavement, economic shock, and social upheaval.
- Even people not directly infected may experience substantial reductions in quality of life due to economic collapse, overwhelmed health systems, political instability, and restrictions on movement and social contact.

Given this, we set:

- **Fraction of world population seriously affected ($f_{\text{aff}}$):**
  - Point estimate: 0.8 (80% of people experience large negative impacts—either death, serious illness, or major life-quality decline).
  - 80% range: 0.5–1.0, to allow for scenarios where some regions are partially insulated or, conversely, where disruption is effectively universal.

---

### QALY impact per affected person

To estimate the **QALY improvement per affected person per year** if the catastrophic pandemic is averted, we need to combine:

1. The QALYs lost through premature deaths.
2. The QALYs lost by survivors with long-term health and social harms.
3. The QALYs lost by people who are not infected but whose lives are severely disrupted.

#### Step 1: Death toll and QALYs lost from deaths

We assume:

- The catastrophic pandemic kills about **10% of the world’s population**, roughly **1 billion people** if the world population at that time is 10 billion (consistent with UN medium projections of a peak around 10.3 billion in the 2080s, e.g. [UN WPP 2024](https://population.un.org/wpp/assets/Files/WPP2024_Summary-of-Results.pdf), [summary](https://ourworldindata.org/un-population-2024-revision)).
- The **average remaining life expectancy** at the time of the pandemic is about **40 years** for those who die:
  - Global life expectancy in 2023 is already about 73 years ([Our World in Data](https://ourworldindata.org/life-expectancy)), and many pandemic victims will die in midlife rather than old age.

We also need a quality-of-life weight for those remaining years:

- WHO estimates global **healthy life expectancy (HALE)** at roughly 63–64 years versus 73 total years, implying that most years are lived in reasonably good health ([WHO life expectancy and HALE](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy)).
- We approximate **0.9 QALYs per year** for the average person’s remaining life, reflecting some illness and hardship but generally decent quality of life.

So each early death corresponds to roughly:

$$
\text{QALYs lost per death} \approx 40 \times 0.9 = 36.
$$

If 1 billion people die:

$$
Q_{\text{death}} \approx 10^{9} \times 36 = 3.6 \times 10^{10}
$$

QALYs lost from death alone (36 billion QALYs).

#### Step 2: QALYs lost by severely affected survivors

Many more people will be infected but survive, often with serious long-term consequences:

- Long-term organ damage, chronic fatigue, and similar sequelae, as observed after COVID-19.
- Lost income, education, and opportunities due to prolonged illness and caring responsibilities.
- Psychological trauma from mass death and societal breakdown.

As a stylised scenario, suppose:

- **3 billion people** survive infection but suffer **moderate long-term reductions** in quality of life:
  - Their quality of life is reduced by 0.2 QALYs per year for 10 years (e.g. from 0.9 to 0.7).
  - QALYs lost per survivor: $0.2 \times 10 = 2$.
  - Total QALY loss: $3 \times 10^{9} \times 2 = 6 \times 10^{9}$ (6 billion QALYs).

#### Step 3: QALYs lost by those “only” indirectly affected

Even those not infected may face:

- Severe economic recession or depression.
- Collapse in public services and healthcare access.
- Long periods of social isolation, travel restrictions, or conflict.

Suppose:

- **6 billion people** experience a modest but non-trivial quality-of-life reduction:
  - QALY weight falls by 0.05 (e.g. from 0.9 to 0.85) for 5 years.
  - QALYs lost per person: $0.05 \times 5 = 0.25$.
  - Total QALY loss: $6 \times 10^{9} \times 0.25 = 1.5 \times 10^{9}$ (1.5 billion QALYs).

#### Step 4: Total QALYs lost and simple parameterisation

Adding these components:

- Deaths: ≈ 36 billion QALYs.
- Severely affected survivors: ≈ 6 billion QALYs.
- Indirectly affected: ≈ 1.5 billion QALYs.

Total:

$$
Q_{\text{event}} \approx 36 + 6 + 1.5 \approx 43.5\ \text{billion QALYs}.
$$

For simplicity we round to **40 billion QALYs**.

To fit this into our simple model (constant QALY improvement per affected person per year over some duration $D$), we define:

- Affected population:  
  $f_{\text{aff}} \times N_{\text{world}} \approx 0.8 \times 10^{10} = 8 \times 10^{9}$ people.
- Duration: $D = 10$ years.
- QALY improvement per affected person per year: $q_{\text{imp}}$ such that:

  $$
  q_{\text{imp}} \times D \approx \frac{Q_{\text{event}}}{f_{\text{aff}} \times N_{\text{world}}}.
  $$

Solving:

$$
q_{\text{imp}} \approx \frac{4.0 \times 10^{10}}{8 \times 10^{9} \times 10}
= \frac{4.0 \times 10^{10}}{8 \times 10^{10}} = 0.5.
$$

So we use:

- **QALY improvement per affected person per year:** $q_{\text{imp}} = 0.5$ (80% range: 0.3–0.8).
- **Duration:** $D = 10$ years (80% range: 5–20 years).
- **Fraction affected:** $f_{\text{aff}} = 0.8$ (80% range: 0.5–1.0).

This corresponds to an “average” affected person losing about $0.5 \times 10 = 5$ QALYs—some lose far more (if they die early), others lose fewer, but the average across the 80% of humanity who are seriously impacted comes out in that range.

---

### Duration and timing of the averted event

The **duration** parameter $D$ represents how long people’s QALYs are significantly reduced by the catastrophic pandemic.

- For those who die, the loss stretches across decades, but for our simplified model we fold those long-term losses into an “equivalent” 10-year severe impact.
- For survivors, many of the worst effects (health, economic, institutional) are likely to be concentrated in the first 5–20 years after the outbreak.

We therefore use:

- **Duration (central):** 10 years
- **80% range:** 5–20 years

The **start time** parameter is mainly needed for discounting and comparisons across cause areas. We treat the risk as spread across this century, but with somewhat higher concern in the coming decades as biotechnology becomes more powerful and accessible.

- 80,000 Hours’ analysis suggests that anthropogenic GCBR risk is at least **1% this century** and rising with advances in genetic engineering ([Greg Lewis’s report](https://80000hours.org/problem-profiles/preventing-catastrophic-pandemics/full-report/)).
- The Founders Pledge GCBR report emphasises that advances in synthetic biology and AI are “creating a rapidly shifting threat landscape”, and that society is “underprepared for future pandemics”, especially engineered ones ([Founders Pledge GCBR guide](https://dkqj4hmn5mktp.cloudfront.net/GCBR_Report_Founders_Pledge_7505b1ebe0.pdf)).

As a simple summary, we assume:

- **Expected start time (conditional on the event occurring):** about 40 years from now (around 2065), with wide uncertainty (10–70 years).

This does not claim that 2065 is special; it is just a rough average over a century-scale risk.

---

### Cost per microprobability: reasoning from existing efforts

The hardest part of this analysis is the **cost per microprobability**:

> How much does it cost, in expectation, to reduce the probability of a global catastrophic pandemic by one part in a million?

We do not have direct, experimental evidence. Instead, we triangulate from two directions:

1. **Field-level estimates:** How much have governments and philanthropists already spent on GCBR-relevant work, and how much might that have reduced global catastrophic pandemic risk?
2. **Micro-level examples:** For specific high-risk activities (like gain-of-function research on virulent influenza), what is the expected harm per “lab-year”, and how much might it cost to reduce that risk?

We then combine these into a single, conservative estimate.

---

#### 1. Field-level estimates: what has targeted pandemic prevention probably bought us?

##### 1.1 How much is being spent on catastrophic pandemic prevention?

Before COVID-19, biosecurity and health security already received billions of dollars annually, but most of this was aimed at **ordinary infectious disease threats**, not truly global catastrophes.

- Giving What We Can notes that the US federal government alone spent around **\$3 billion per year on “biosecurity”** even before COVID-19, but that this includes many “non-catastrophic” programmes ([GWWC biosecurity overview](https://www.givingwhatwecan.org/cause-areas/reducing-global-catastrophic-risks/biosecurity)).
- The Founders Pledge GCBR report estimates that **less than 2%** of health security spending is directly relevant to preventing catastrophic or extinction-level biological events ([Founders Pledge GCBR guide](https://dkqj4hmn5mktp.cloudfront.net/GCBR_Report_Founders_Pledge_7505b1ebe0.pdf), section on neglectedness).
- The same report emphasises that philanthropic funding for GCBRs is tiny: Open Philanthropy’s biosecurity programme has directed over \$200 million, but smaller funders like Survival and Flourishing Fund and the now-defunct FTX Future Fund contribute only tens of millions in total ([GCBR report](https://dkqj4hmn5mktp.cloudfront.net/GCBR_Report_Founders_Pledge_7505b1ebe0.pdf), introduction and acknowledgements; [Open Philanthropy biosecurity page](https://www.openphilanthropy.org/focus/biosecurity-pandemic-preparedness/)).

Roughly speaking, if:

- Governments worldwide spend tens of billions per year on “health security” broadly defined, but
- Only on the order of **0.5–1 billion dollars per year** are **truly focused** on global catastrophic and extinction-level pandemics,

and if this type of targeted spending has been sustained (in some form) for a decade or so, then a crude central estimate is that:

- **Total targeted GCBR spending to date** (governments + philanthropy focused on worst-case pandemics):  
  $$\sim \$3$$ **billion** (plausible range: \$1–\$10 billion).

This is very approximate, but it reflects the qualitative picture: enormous generic health spending, but **only a small fraction** directly aimed at the most extreme biological threats.

##### 1.2 How much risk reduction might that have achieved?

Greg Lewis’s analysis for 80,000 Hours suggests that:

- **Anthropogenic GCBRs** (especially engineered pandemics) likely contribute around **1% or more total risk** of a global catastrophic biological event this century ([80,000 Hours report](https://80000hours.org/problem-profiles/preventing-catastrophic-pandemics/full-report/), “Some guesses on risk”).
- Natural GCBRs are probably significantly less likely, given our long history and the rarity of pathogen-driven species extinctions.

Suppose, very roughly, that:

- In a counterfactual world with **no targeted GCBR work** (no Biological Weapons Convention, no pandemic surveillance, no modern biosafety norms, no CEPI-style initiatives, etc.), the chance of a global catastrophic pandemic this century would be around **1.3%**.
- In our actual world, **existing GCBR-focused work** has reduced that to around **1.0%**.

This implies an **absolute risk reduction** of:

$$
\Delta P \approx 1.3\% - 1.0\% = 0.3\% = 3 \times 10^{-3}.
$$

This is meant to be **modest**: a 23% relative reduction in risk (from 1.3% to 1.0%) in exchange for decades of targeted spending and institutional building. Many experts would regard even this as optimistic.

If total targeted GCBR spending to date is around **\$3 billion**, then the cost per microprobability is:

- Absolute risk reduction: $\Delta P = 3 \times 10^{-3}$.
- Microprobabilities averted: $\Delta P / 10^{-6} = 3{,}000$.
- Cost per microprobability:

  $$
  \text{cost per microprobability} \approx \frac{\$3\ \text{billion}}{3{,}000} \approx \$1\ \text{million}.
  $$

If we instead assume:

- Total targeted GCBR spending is \$1 billion and it reduced risk by only 0.001 (1.1% to 1.0%), we again get:

  $$
  \frac{\$1\ \text{billion}}{1{,}000} = \$1\ \text{million per microprobability}.
  $$

If we are more pessimistic—say \$3 billion of spending only reduced risk by 0.0003 (0.03 percentage points)—then:

- Microprobabilities averted: $0.0003 / 10^{-6} = 300$.
- Cost per microprobability: \$3 billion / 300 ≈ **\$10 million**.

If we are more optimistic—say \$1 billion reduced risk by 0.003—then cost per microprobability is about **\$0.3 million**.

So a **field-level back-of-the-envelope** suggests a cost per microprobability on the order of:

- **Field-level central estimate:** \$1 million per microprobability.
- **Plausible range:** roughly \$0.3–\$10 million per microprobability.

This reflects both uncertainty about total targeted spending and about how much it has actually changed catastrophic pandemic risk.

---

#### 2. Micro-level examples: gain-of-function labs and expected deaths

We can also look at specific activities known to be risky and ask what it might cost to reduce their contribution to catastrophic pandemic risk.

One salient example is **gain-of-function (GoF) research** on virulent, transmissible influenza viruses. Marc Lipsitch and Thomas Inglesby analysed the risk of a global pandemic arising from such research in BSL-3 labs and concluded that:

- There might be a **0.01–0.1% probability per lab-year** of work on virulent, transmissible influenza leading to a pandemic that kills **2 million to 1.4 billion people**.
- This implies an **expected death toll of around 2,000 to 1.4 million per BSL-3 lab-year** ([Lipsitch & Inglesby, 2014](https://journals.asm.org/doi/10.1128/mbio.02366-14); summarised by Giving What We Can [here](https://www.givingwhatwecan.org/cause-areas/reducing-global-catastrophic-risks/biosecurity)).

Even if we take a conservative view—for example, focusing only on pandemics that kill **hundreds of millions** rather than any pandemic—this still implies that:

- Each year of such high-risk research carries a **small but non-trivial probability** of triggering a catastrophic pandemic by itself.
- Because the expected death toll per lab-year is so high, reducing even a handful of lab-years can avert enormous expected harm.

Imagine that:

- A targeted advocacy campaign costs **\$10–\$20 million** and successfully influences national and international policy to **restrict or halt certain categories of high-risk GoF research**, effectively reducing high-risk lab-years by, say, **10 lab-years** over a decade.
- For each lab-year we avoid, we reduce the absolute risk of a catastrophic pandemic (in our sense) by roughly $p_{\text{cat}}$, where $p_{\text{cat}}$ is a small fraction of Lipsitch & Inglesby’s estimated 0.01–0.1% per lab-year.

If we model:

- Probability per lab-year of a **truly catastrophic** pandemic (killing around 10% of humanity) as:

  $$
  p_{\text{cat}} \approx 3 \times 10^{-5},
  $$

  (i.e. 0.003%, taking the lower end of their range and focusing only on the most extreme outcomes),

then:

- Preventing 10 such lab-years reduces catastrophic pandemic risk by:

  $$
  \Delta P_{\text{lab}} \approx 10 \times 3 \times 10^{-5} = 3 \times 10^{-4},
  $$

  i.e. **0.03 percentage points**.

This is **300 microprobabilities** ($3 \times 10^{-4} / 10^{-6}$).

If the advocacy campaign costs \$20 million, the **cost per microprobability** from this specific intervention would be:

$$
\text{cost per microprobability} \approx \frac{\$20\ \text{million}}{300} \approx \$67{,}000.
$$

Even if we weaken these assumptions substantially—say the campaign costs \$50 million and yields only the equivalent of 5 high-risk lab-years prevented—the cost per microprobability might still be well under **\$1 million**.

This micro-level analysis therefore suggests that **some specific, high-leverage interventions** (e.g. reforming GOF policies, strengthening oversight of especially risky labs, or fortifying the Biological Weapons Convention) could reduce catastrophic pandemic risk at costs **comfortably below** \$1 million per microprobability.

Of course:

- Not all interventions will be this effective.
- Some advocacy campaigns will fail.
- Many pandemic-prevention activities (e.g. general surveillance, vaccine platform development) primarily **reduce the harm of more moderate pandemics**, not the extreme tail we are focusing on here.

Nonetheless, this line of reasoning provides a **lower-bound plausibility check**: it would be unsurprising if the very best pandemic-prevention charities can buy microprobabilities at **hundreds of thousands of dollars each or better**, at least at the current margin.

---

#### 3. Final parameter choice

We now have:

1. A **field-level estimate** based on total targeted GCBR spending and plausible risk reductions:

   - Central: about **\$1 million per microprobability**.
   - Plausible range: roughly **\$0.3–\$10 million** per microprobability.

2. A **micro-level example** (gain-of-function policy advocacy) suggesting that:
   - Some interventions might achieve **\$10,000–\$100,000** per microprobability.
   - Even pessimistic versions of that example often land below **\$1 million** per microprobability.

These are rough and highly uncertain, but the **key fact** is that both lines of reasoning are consistent with a cost per microprobability well below \$10 million, and potentially far lower for the best opportunities.

To avoid over-claiming based on optimistic case studies—and to keep our estimates comparable with other cause areas—we adopt a conservative compromise:

- **Point estimate:** \$1 million per microprobability.
- **80% range:** \$0.1 million–\$10 million per microprobability.

Plugging this into our QALY model:

- Each microprobability corresponds to about **40,000 expected QALYs saved**.
- A central cost of \$1 million per microprobability implies roughly **\$25 per QALY**.
- The 80% range on cost per microprobability translates to roughly **\$2.5–\$250 per QALY**.

These values are **not tied to any target from other cause areas**; they follow directly from:

- A specific, explicit model of how bad a catastrophic pandemic would be in QALY terms.
- Reasoned, order-of-magnitude estimates for how much current and plausible future work might reduce such risks.

---

### What kinds of charities are we implicitly modeling?

The cost per microprobability estimate is meant to apply to donations to **high-impact, GCBR-focused pandemic charities**, not generic health organisations or routine disease programmes. These include organisations that:

- Focus on **global catastrophic biological risks** (not just seasonal flu or local outbreaks).
- Work on **policy, norms, and technology** that shape the entire risk landscape, especially for **engineered pathogens**.
- Have a track record of influencing governments, international institutions, and leading labs.

Examples of the types of work we have in mind include:

- **Policy and governance for risky biological research**

  - Strengthening norms and regulations around gain-of-function and dual-use research.
  - Supporting reforms to reduce the risk of lab leaks, especially in BSL-3 and BSL-4 facilities.
  - Influencing guidelines from bodies like WHO on “dual use” science and pathogen research ([WHO guidance](https://www.who.int/publications/i/item/9789240023577)).

- **International agreements and norms**

  - Supporting the Biological Weapons Convention (which historically has had a tiny budget and very limited verification capacity, as noted by Giving What We Can [here](https://www.givingwhatwecan.org/cause-areas/reducing-global-catastrophic-risks/biosecurity)).
  - Funding organisations like the Nuclear Threat Initiative’s biosecurity programme, which explicitly aims to reduce global catastrophic biological risks ([Open Phil’s NTI GCBR grant](https://www.openphilanthropy.org/grants/nuclear-threat-initiative-projects-to-reduce-global-catastrophic-biological-risks/)).
  - Promoting international norms against state bioweapons programmes and catastrophic bioterrorism.

- **Pandemic preparedness that is robust to extreme threats**

  - Supporting the development of **“platform” vaccine technologies** and the “100 Days Mission” to develop vaccines against novel threats within 100 days; CEPI estimates that deploying effective COVID-19 vaccines in 100 days could have saved over **8 million lives** ([CEPI analysis](https://cepi.net/100-days-save-eight-million-lives), [Imperial College modelling](https://www.imperial.ac.uk/news/256938/imperial-modelling-shows-100-days-mission/)).
  - Investing in **broad-spectrum antivirals**, rapid diagnostics, and surveillance systems that can detect and contain novel pathogens, including engineered ones.
  - Supporting resilient health systems and stockpiles specifically designed for worst-case scenarios.

- **Field-building and talent pipelines**
  - Funding scholarships, fellowships, and early-career support for people who want to work on catastrophic bio-risk, such as Open Philanthropy’s [biosecurity scholarships](https://www.openphilanthropy.org/open-philanthropy-biosecurity-scholarships/).
  - Supporting research groups at institutions like the Johns Hopkins Center for Health Security ([overview](https://centerforhealthsecurity.org/)) that focus specifically on GCBRs.

This model is **not** intended to describe:

- General pandemic work that focuses only on typical influenza seasons or routine vaccination.
- Broad health system strengthening that is not particularly targeted at catastrophic pandemics.
- Interventions that primarily reduce the burden of ordinary infectious diseases without much impact on the most extreme tail risks.

---

### Key uncertainties

The numbers above are **order-of-magnitude estimates**, not precise measurements. Some of the main uncertainties include:

1. **Baseline probability of a global catastrophic pandemic.**  
   Different experts give very different probabilities. Toby Ord’s best-guess for existential catastrophe from pandemics is 1 in 30 this century ([“The Precipice Revisited”](https://www.tobyord.com/writing/the-precipice-revisited)). Gregory Lewis estimates anthropogenic GCBRs at around 1% this century ([80,000 Hours report](https://80000hours.org/problem-profiles/preventing-catastrophic-pandemics/full-report/)). If the true risk is much lower or higher, the value of a given microprobability reduction changes accordingly.

2. **Severity of the “typical” catastrophic pandemic.**  
   We use a stylised scenario with ~10% global mortality and major long-term damage. Some global catastrophic pandemics might be less severe (e.g. 3–5% mortality but worse long-term economic scars), others could approach existential risk. Our 40 billion QALY estimate is a rough middle of a very wide range.

3. **Effectiveness of past and future interventions.**  
   We assume that existing targeted GCBR work has already reduced risk by a modest but non-trivial amount, and that future top charities can continue to achieve meaningful marginal reductions. If most past spending has had little effect—or if future interventions become much harder politically—then the cost per microprobability could be higher than we estimate.

4. **How much of the value comes from extreme vs moderate pandemics.**  
   Many interventions (for example CEPI’s 100 Days Mission) reduce harm across **all** future pandemics, not just the worst ones. Our microprobability model only counts benefits in preventing **truly catastrophic** events. In reality, such interventions can also avert millions of deaths in “merely bad” pandemics like COVID-19, making their total QALY impact larger than we are counting here.

5. **Interactions with other global risks.**  
   A catastrophic pandemic could increase the risk of other disasters (for example by destabilising nuclear-armed states), and some interventions (like improved biosafety norms) may also reduce the chance of engineered pathogens being used in warfare. Our model does not explicitly account for these interactions.

6. **Non-human welfare and the long-run future.**  
   This analysis counts only **human QALYs for currently existing or near-future people**. It does not account for:
   - The value of preventing pandemics that could permanently derail human civilisation or cause extinction.
   - The wellbeing of non-human animals, which could be massively affected by changes in agriculture, ecosystems, or synthetic biology.
     Longtermist arguments, such as those developed by Nick Bostrom in [“Existential Risk Prevention as Global Priority”](https://www.globalpolicyjournal.com/articles/global-commons-and-environment/existential-risk-prevention-global-priority), suggest that the long-run stakes could be many orders of magnitude larger than the near-term QALYs considered here.

Given these uncertainties, our estimates should be treated as **tools for comparison, not precise forecasts**. They suggest that:

- Even when we **ignore** long-term future generations and focus only on people alive at the time of the event, **top pandemic-prevention charities plausibly deliver QALYs in the range of \$2.5–\$250 per QALY**, with a central estimate around **\$25 per QALY**.
- This makes them competitive with, and likely better than, many traditional global health and development interventions, especially given that they also reduce the risk of civilisation-level disruption.

For donors who want to reduce the risk that humanity suffers another pandemic far worse than COVID-19, **pandemic-prevention charities focused on global catastrophic biological risks appear to be a highly promising place to give**.

_Our current cost per life estimates are very approximate and we are looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
