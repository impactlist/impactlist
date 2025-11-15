---
id: ai-risk
name: 'AI Existential Risk'
effects:
  - effectId: population
    startTime: 15
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 2_000_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: 1.0
    validTimeInterval: [2022, null]
---

# Justification of cost per life

_The following analysis was done on November 15th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

Unlike a “normal” cause category where we estimate the cost per QALY (quality-adjusted life-year) for relatively frequent events, donations to AI existential risk charities aim to avert a **very low probability but truly catastrophic event**. Here we define such an event, estimate how many people it would affect and how much it would harm them, and then estimate the cost of reducing the probability of that event by one in a million.

In this category, the event is **extinction caused by misaligned artificial intelligence**.

---

### Headline estimates

- **Event definition:** Creation of advanced artificial general intelligence (AGI) or artificial superintelligence (ASI) that ultimately destroys all human life on Earth (“AI doom”).

- **Cost per microprobability**  
  A _microprobability_ is a one-in-a-million ($10^{-6}$) absolute reduction in the chance that this event ever occurs (over roughly the next 100 years).

  - Point estimate: \$2 million per microprobability.
  - 80% subjective range: \$0.2 million–\$20 million per microprobability.

- **Fraction of world population affected if doom occurs:**

  - Point estimate: 1.0
  - 80% range: 1.0–1.0  
    (By definition, this event kills everyone.)

- **Average QALY improvement per affected person per year if doom is averted:**

  - Point estimate: 0.9
  - 80% range: 0.7–1.0

- **Duration of the effect (how long individuals would otherwise be affected):**
  - Point estimate: 40 years
  - 80% range: 30–50 years

Using these central assumptions, and assuming a world population of about $N_{\text{world}} = 10^{10}$ (10 billion) at the time of catastrophe, a full AI-driven extinction would destroy roughly

$$
Q_{\text{event}} \approx f_{\text{aff}} \times N_{\text{world}} \times q_{\text{imp}} \times D
= 1.0 \times 10^{10} \times 0.9 \times 40 \approx 3.6 \times 10^{11}
$$

QALYs (about **360 billion QALYs**) for people alive at that time.

A 1-in-1,000,000 reduction in the probability of this event therefore **saves about**

$$
Q_{\text{micro}} \approx Q_{\text{event}} \times 10^{-6} \approx 3.6 \times 10^{5}
$$

**expected QALYs** (around 360,000 QALYs).

Combining this with the cost per microprobability gives an approximate **cost per QALY** of:

- Central cost per microprobability: \$2 million

  $$
  \Rightarrow \text{cost per QALY} \approx \frac{\$2\ \text{million}}{3.6 \times 10^{5}} \approx \$6 \text{ per QALY.}
  $$

- 80% range on cost per QALY (from \$0.2 million–\$20 million per microprobability):
  - Low end: around \$1 per QALY.
  - High end: around \$60 per QALY.

These numbers are extremely uncertain and depend on simple, stylised assumptions. But even on these conservative terms (which ignore almost all of the long-term future), AI existential risk charities look potentially **as cost-effective as the very best health and poverty charities**, and possibly substantially more so.

---

### How likely and how severe is AI-caused extinction?

The basic concern is that **sufficiently capable AI systems could become more powerful than humans and pursue goals that are not aligned with human values**, either because we fail to specify the right objectives or because systems develop unintended “instrumental” drives such as resource acquisition and self-preservation.

Several lines of evidence suggest that **experts take this risk seriously**:

- In _The Precipice_, philosopher Toby Ord gives his personal best-guess probability of an existential catastrophe from “unaligned AI” in the next 100 years as **1 in 10** (10%), higher than all other anthropogenic existential risks combined. He reiterates this assessment in his 2024 follow-up essay and talk, [“The Precipice Revisited”](https://www.tobyord.com/writing/the-precipice-revisited).
- The 2022 AI Impacts Expert Survey asked hundreds of machine learning researchers about “human extinction or similarly permanent and severe disempowerment” from future AI advances. Many respondents assigned several percent probability or more to such extreme outcomes. See the [2022 Expert Survey on Progress in AI](https://aiimpacts.org/2022-expert-survey-on-progress-in-ai/) and the detailed questionnaire PDF linked there.
- A 2024–2025 study, [“Thousands of AI Authors on the Future of AI”](https://arxiv.org/abs/2401.02843), surveyed 2,778 researchers who had published in top-tier AI venues. It found that between **38% and 51% of respondents gave at least a 10% chance** to advanced AI leading to outcomes as bad as human extinction, even though most also expected good outcomes to be more likely overall.
- High-profile AI scientists and leaders have publicly given non-trivial “p(doom)” numbers:
  - Geoffrey Hinton has said there is roughly a **20% chance** that AI leads to human extinction in the coming decades, as reported in outlets such as [The Guardian](https://www.theguardian.com/technology/2024/dec/27/godfather-of-ai-raises-odds-of-the-technology-wiping-out-humanity-over-next-30-years).
  - Anthropic CEO Dario Amodei has estimated around a **25% chance** that advanced AI leads to extremely bad outcomes including human extinction, for example in remarks summarised by [Axios](https://www.axios.com/2025/09/17/anthropic-dario-amodei-p-doom-25-percent).

At the same time, not all experts agree. Figures such as Yann LeCun and many mainstream ML researchers argue that these risks are exaggerated and that AI can be developed safely through incremental engineering and regulation; this perspective is summarised in the Wikipedia article on [existential risk from artificial intelligence](https://en.wikipedia.org/wiki/Existential_risk_from_artificial_intelligence).

It is beyond the scope of this page to resolve the debate. For our purposes, the key points are:

- **There is a live, mainstream scientific and policy discussion** about whether AGI/ASI could literally end human civilisation.
- Some careful assessments (such as Ord’s) and large expert surveys treat probabilities in the **single-digit to double-digit percent range** over the next century as live possibilities.
- Even if the true risk were “only” 1%, reducing that risk by even a tiny absolute amount (say 0.01%) could be extremely valuable in expectation.

In other words, **the event is very unlikely in any given year, but not negligible over a century**, and its severity—if it happens—is maximal: everyone dies.

---

### Fraction of the world’s population affected

For nuclear war, it made sense to talk about a _fraction_ of the world’s population being “seriously affected,” because some people might survive with only moderate long-term impacts. For AI doom, our event is explicitly defined as:

> “AGI or ASI destroys all life on Earth.”

Under that definition:

- **All humans** alive at the time of catastrophe die, regardless of where they live.
- There is no gradual recovery; there are **no surviving generations**.

So, for this event, the natural parameter choice is:

- **Fraction affected (point estimate):**

  $$
  f_{\text{aff}} = 1.0.
  $$

We also treat the 80% range as 1.0–1.0. In practice, there are conceivable scenarios where misaligned AI kills almost everyone but leaves a tiny number of humans alive in captivity; however, in those worlds survivors would likely have such low quality of life that their QALY balance is still near zero or worse. To keep the model simple and conservative, we treat extinction as affecting **100% of people** alive at the time.

Note that this modeling **only counts QALYs for humans**, not for non-human animals or any other forms of sentient life that might exist by the time AGI arrives. If advanced AI would also wipe out trillions of currently existing or near-future animals, that would further increase the true moral stakes but is not included in these numbers.

---

### QALY impact per affected person

To estimate the **QALY improvement per affected person per year** if doom is averted, we are essentially asking:

> If someone would otherwise be killed by misaligned AI, how many high-quality life-years are they losing?

We approximate this using global averages and simple assumptions.

#### Step 1: Remaining life expectancy

Global life expectancy at birth has risen to around **73 years** in recent years, according to [Our World in Data – Life Expectancy](https://ourworldindata.org/life-expectancy). Many people alive at mid-century will already be adults, but people in richer countries will live longer than those in poorer countries. A simple stylised assumption is that for the “average person” alive at the time of an AI catastrophe:

- **Expected remaining lifespan:** about **40 years**.

This roughly matches a world in which many people are in mid-life in middle-income countries, while others are younger or older.

#### Step 2: Quality of life while alive

The World Health Organization estimates global life expectancy at about 73 years, while **healthy life expectancy (HALE)** is roughly **63–64 years**, implying that people spend most of their lives in reasonably good health but with some years at lower quality. See the WHO data on [life expectancy and healthy life expectancy](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy).

This suggests an average quality-of-life weight somewhere around 0.85–0.9 over adult life. We approximate:

- **Average QALY weight if alive:** 0.9 QALYs per year.

We deliberately treat this as an _all-things-considered_ quality of life, not just physical health. It implicitly includes:

- Time spent in reasonably satisfying work and relationships.
- Psychological wellbeing, entertainment, culture, and other non-health goods.
- Some periods of illness, disability, unemployment, or hardship.

#### Step 3: QALYs lost per person

If someone dies instantly in an AI catastrophe instead of living out their remaining life, the QALYs lost are approximately:

$$
\text{QALYs lost per person} \approx 40 \times 0.9 = 36.
$$

In our simplified model, we encode this as:

- **QALY improvement per affected person per year if doom is averted:**

  $$
  q_{\text{imp}} = 0.9,
  $$

- **Duration of effect (years the person would otherwise have lived):**

  $$
  D = 40.
  $$

So each affected person gains roughly $q_{\text{imp}} \times D \approx 36$ QALYs if extinction is avoided.

#### Step 4: Total QALYs lost in the doom event

The UN’s 2024 revision of the World Population Prospects projects that the global population will peak at just under **10.3 billion** people in the 2080s; see the [World Population Prospects 2024 summary](https://population.un.org/wpp/publications/files/wpp2024_summary_of_results.pdf) and [Our World in Data’s overview of the 2024 revision](https://ourworldindata.org/un-population-2024-revision). For simplicity, we round this to 10 billion.

Assuming a world population of $N_{\text{world}} = 10^{10}$ (10 billion) at the time of catastrophe, and everyone dying:

$$
Q_{\text{event}} \approx f_{\text{aff}} \times N_{\text{world}} \times q_{\text{imp}} \times D
= 1.0 \times 10^{10} \times 0.9 \times 40 \approx 3.6 \times 10^{11}.
$$

So we estimate that an AI-driven extinction event would destroy roughly **360 billion QALYs** for the people who are alive at that time.

This is already larger than our nuclear-war estimate (about 200 billion QALYs), mainly because:

- Everyone dies, not just most people.
- We treat all deaths as “premature” by several decades.

Crucially, this **still ignores the vast number of future generations that would never exist if humanity goes extinct**. Those long-run effects are discussed briefly under “Key uncertainties” below.

---

### Duration of the averted event

For nuclear war we tried to blend together:

- Short-term devastation for survivors, and
- Longer-term life-years lost for those who die.

For AI doom there are no survivors, so the interpretation is simpler: **we are averaging over the remaining lifetime people would have had if not killed by AI**.

We therefore use:

- **Duration (central estimate):** 40 years
- **80% range:** 30–50 years

This captures uncertainty about:

- The age distribution of people at the time the catastrophe would have occurred.
- Future improvements in global life expectancy and health.
- Regional differences in mortality and quality of life.

In practice, these details matter less than the fact that **everyone loses multiple decades of good-quality life**.

---

### Cost per microprobability: reasoning from existing efforts

The most speculative part of this analysis is the **cost per microprobability**:

> How much does it cost, in expectation, to reduce the probability of AI-driven human extinction by one in a million?

There is no direct, consensus estimate of this figure, and we do not have controlled experiments. But we can at least try to **anchor our guesses to two concrete, first-principles calculations**:

1. What existing AI safety spending plausibly bought us in reduced risk.
2. How many “microdooms” (one-in-a-million risk reductions) a typical AI safety researcher might avert, combined with realistic salary and overhead costs.

We treat these as independent order-of-magnitude cross-checks and then combine them.

---

#### 1. What has existing AI safety spending probably bought us?

First we estimate **how much the world has already spent specifically on reducing existential risk from advanced AI**, and then make a cautious guess about how much risk reduction that has purchased.

##### 1.1 How much have we spent so far?

A 2023–2025 overview on the Effective Altruism Forum, [“An Overview of the AI Safety Funding Situation”](https://forum.effectivealtruism.org/posts/XdhwXppfqrpPL2YDX/an-overview-of-the-ai-safety-funding-situation), aggregates funding from major AI safety donors:

- **Open Philanthropy** has spent roughly \$300–\$350 million on AI safety grants up to 2023, according to that analysis, representing about 12% of its total grantmaking.
- A 2024 profile in _TIME_ on Open Philanthropy president Cari Tuna reports that, of the **\$3 billion** Open Philanthropy has donated, “roughly **\$400 million has been to AI**,” making it one of the largest philanthropic funders of AI safety. See [“Cari Tuna: The 100 Most Influential People in AI 2024”](https://time.com/7012763/cari-tuna/).
- **Survival and Flourishing Fund (SFF)** has donated about **\$53 million** to AI safety projects since 2019, according to the same EA Forum overview.
- The **FTX Future Fund** contributed an estimated **\$32 million** to AI safety projects between February and August 2022 before shutting down, again based on that overview.
- The **Long-Term Future Fund (LTFF)** has spent about **\$10 million** on AI safety over its lifetime.
- The EA Forum post also estimates that AI safety teams inside for-profit labs (OpenAI, Anthropic, DeepMind, Conjecture) represent roughly **\$32 million per year** in safety-focused costs, when you account for salaries and overhead. Over several years this easily reaches into the hundreds of millions.
- Government programs like the UK’s **Foundation Model Taskforce** and other public AI safety initiatives add further tens or hundreds of millions to the total.

Putting this together, a **cautious, round-number estimate** for _cumulative spending through around 2025_ specifically aimed at reducing existential or catastrophic risk from AI (including philanthropic grants, targeted corporate safety teams, and high-level government programmes) is on the order of:

- **Central estimate:** \$1 billion
- **Plausible range:** \$0.5–\$2 billion

##### 1.2 How much risk reduction might that have achieved?

We next ask: by **how much** might this \$1 billion of spending have reduced the probability of AI-driven extinction this century?

There is enormous uncertainty here, but we can reason in terms of **absolute probability reduction**:

- Let $P_0$ be the probability of AI doom this century in a hypothetical world with _no_ targeted AI safety field.
- Let $P_1$ be the probability in our actual world, with the existing AI safety efforts.

The **absolute risk reduction** achieved so far is $\Delta P = P_0 - P_1$.

Nobody knows $\Delta P$ exactly, but some qualitative observations:

- Many of the most visible AI safety ideas—“alignment”, “RLHF”, evaluations, red-teaming, the concept of “p(doom)”, and the framing of advanced AI as a global risk—were developed or amplified by the current AI safety community.
- These ideas clearly influence:
  - The internal practices of frontier labs (e.g. dedicated alignment teams, eval groups, and red-team exercises).
  - Public policy and regulation (e.g. AI safety institutes, model evaluation requirements).
  - The broader scientific community (e.g. debates captured in [“Thousands of AI Authors on the Future of AI”](https://arxiv.org/abs/2401.02843), where many researchers explicitly cite existential risk as a serious concern).

It would be overconfident to claim that this has already cut AI-doom risk by huge amounts; we haven’t yet built AGI, and many big decisions still lie ahead. On the other hand, it is also hard to believe that **decades of safety research, advocacy, and policy work have had literally zero effect** on how AI is being developed.

For this analysis, we choose a deliberately modest **best guess**:

- In a world with no AI safety field, the chance of AI-caused extinction this century might have been, say, around **10%**.
- Our current efforts might have reduced that by somewhere around **0.03–0.3 percentage points** (0.0003–0.003 absolute probability), with a central guess of **0.0003** (0.03 percentage points).

In symbols:

- **Central estimate:** $\Delta P \approx 3 \times 10^{-4}$
- **Plausible range:** $\Delta P \approx 3 \times 10^{-5}$ to $3 \times 10^{-3}$

This means that **all AI existential risk work worldwide so far** might have reduced the probability of AI-driven extinction this century by something like **0.003–0.3 percentage points**, with 0.03 percentage points as a central value. That is a very small change relative to the underlying risk (e.g. from 10.00% to 9.97%).

##### 1.3 Implied cost per microprobability

If cumulative spending is $C$ and the absolute risk reduction is $\Delta P$, then:

- The **number of microprobabilities averted** is $\Delta P / 10^{-6}$.
- The **cost per microprobability** is:

  $$
  \text{cost per microprobability} \approx \frac{C}{\Delta P / 10^{-6}}.
  $$

Using our central numbers:

- $$C \approx \$1 \text{ billion} = 10^{9}$$
- $\Delta P \approx 3 \times 10^{-4}$

Then:

$$
\text{cost per microprobability} \approx
\frac{10^{9}}{(3 \times 10^{-4}) / 10^{-6}}
= \frac{10^{9}}{3 \times 10^{2}} \approx 3.3 \times 10^{6},
$$

so roughly **\$3 million per microprobability**.

With more pessimistic assumptions (same spending but only $\Delta P = 3 \times 10^{-5}$), the cost per microprobability rises to around \$30 million. With more optimistic assumptions ($\Delta P = 3 \times 10^{-3}$ and total spending closer to \$0.5 billion), it could be as low as \$0.2 million.

So this “field-level” back-of-the-envelope suggests something like:

- **Field-level central estimate:** \$3 million per microprobability
- **Rough plausible band:** \$0.2–\$30 million per microprobability

This is a very wide range, but it gives us a concrete starting point grounded in actual spending and a conservative view of what it may have accomplished so far.

---

#### 2. Microdooms per AI safety career (salary-based analysis)

A second, more granular way to estimate the cost per microprobability is to ask:

> How many microprobabilities might a typical AI safety researcher avert over their career, and how much does such a career cost to fund?

Within the effective altruism community, a convenient unit is a **“microdoom”**: a one-in-a-million reduction in existential risk from AI (that is, a microprobability focused specifically on AI doom). Nikola Jurkovic’s 2023 article, [“Microdooms averted by working on AI Safety”](https://www.lesswrong.com/posts/mTtxJKN3Ew8CAEHGr/microdooms-averted-by-working-on-ai-safety), explores several simple models for how much risk reduction an additional AI safety professional might achieve.

Among the models discussed:

- A **linear-growth model** assumes that increasing the AI safety workforce from about 350 people to 10,000 people would reduce AI existential risk by **10 percentage points**, with the effect linear in the number of people. Under that model, one additional AI safety career averts about **10 microdooms**.
- A **diminishing returns model** with a larger ideal workforce and a 20% absolute risk reduction gives **~49 microdooms** per additional career at the current margin.
- A **Pareto model**—where 10% of people account for 90% of the impact—suggests that a typical (10th–90th percentile) AI safety professional might avert **10–270 microdooms**, with a higher mean but very skewed distribution.

Jurkovic’s own conclusion is that **one additional AI safety professional plausibly reduces AI existential risk by at least one microdoom**, and more likely by tens of microdooms, under these stylised assumptions.

To be cautious and concrete, we use:

- **Central estimate:** 10 microdooms averted per full AI safety career
- **Conservative range:** 1–50 microdooms averted per career

Now we convert this into a **cost per microdoom** by estimating the financial cost of an AI safety career.

##### 2.1 How much does a full AI safety career cost?

AI alignment and governance researchers tend to have skills comparable to senior machine learning scientists or research engineers. Public salary data suggests (in 2024–2025):

- Median salaries for AI research scientists in the US around **\$180,000–\$220,000** per year, with higher figures at top labs; see, for example, [Glassdoor’s AI Research Scientist salary data for the US](https://www.glassdoor.com/Salaries/ai-research-scientist-salary-SRCH_KO0%2C21.htm) and the 2024 Ephy analysis [“Who pays more? Microsoft vs Meta for AI Research Scientists”](https://www.ephy.io/post/who-pays-more-microsoft-vs-meta-for-ai-research-scientists).
- The EA Forum funding overview mentioned above notes that at non-profits like MIRI and Redwood Research, the **total cost per employee is around twice their gross salary**, once you include payroll taxes, health insurance, office space, compute, and other overheads.

If we assume:

- Gross salary for a strong AI safety researcher at a non-profit or lab: about **\$200,000–\$250,000 per year**.
- Total cost to the organisation (salary plus benefits, compute, overhead): about **2× salary**, i.e. **\$400,000–\$500,000 per year**.
- An effective AI safety career in the field lasts **20–30 years** (some may move in and out, or retire early, but others will stay for decades).

Then the **total cost per career** is roughly:

- Lower end: \$400,000 × 20 years = \$8 million
- Upper end: \$500,000 × 30 years = \$15 million

We therefore take:

- **Central estimate:** \$10 million per full AI safety career
- **Range:** \$5–\$20 million per career

##### 2.2 Implied cost per microprobability

If a typical AI safety professional:

- Averts **10 microdooms** over their career (central estimate), and
- Costs **\$10 million** to employ over that career (central estimate),

then the **central cost per microdoom** is:

$$
\frac{\$10\ \text{million}}{10} = \$1\ \text{million per microdoom}.
$$

Under the conservative range:

- Best case (low cost, high impact):  
  \$5 million / 50 microdooms = **\$0.1 million per microdoom**.
- Worst case (high cost, low impact):  
  \$20 million / 1 microdoom = **\$20 million per microdoom**.

So this “salary-based microdoom” calculation suggests something like:

- **Career-level central estimate:** \$1 million per microprobability
- **Rough plausible band:** \$0.1–\$20 million per microprobability

Importantly, this is **derived directly from a concrete model of workforce growth and a realistic salary range**, without appealing to any particular value of a human life or the long-run future. It is entirely about **dollars spent vs. estimated risk reduction**.

---

#### 3. Final parameter choice

We now have two semi-independent, first-principles estimates:

1. **Field-level estimate** (what existing spending has probably achieved):

   - Central: about **\$3 million per microprobability**
   - Plausible range: roughly **\$0.2–\$30 million**

2. **Career-level estimate** (microdooms per AI safety researcher):
   - Central: about **\$1 million per microprobability**
   - Plausible range: roughly **\$0.1–\$20 million**

These are crude, but the encouraging fact is that **they broadly agree on the order of magnitude**:

- Both suggest **“a few million dollars per microprobability”** as a sensible central ballpark.
- Both allow for at least one or two orders of magnitude of uncertainty in either direction.

To combine them, we:

- Take a **logarithmic middle ground** between \$1 million and \$3 million for the central estimate.
- Use a wide 80% subjective range that comfortably covers both calculations: \$0.2–\$20 million.

This yields:

- **Point estimate:** \$2 million per microprobability
- **80% range:** \$0.2 million–\$20 million per microprobability

Plugging back into the QALY model:

- Each microprobability averts about **360,000 expected QALYs**.
- Central cost per microprobability is **\$2 million**.
- So central cost per QALY is roughly **\$6 per QALY**, with an 80% range of **about \$1–\$60 per QALY**.

Given the many uncertainties, these figures should be interpreted as **order-of-magnitude estimates for comparison**, not precise measurements. But they strongly suggest that AI existential risk work is competitive with, and likely more cost-effective than, most conventional global health and development interventions, even when we **only count benefits to people currently alive or soon to be born**.

---

### What kinds of charities are we implicitly modeling?

These estimates assume that marginal donations go to **high-leverage, impact-focused AI existential risk charities**, rather than generic AI ethics projects or commercial R&D. Examples of the kinds of work we have in mind include:

- **Technical AI alignment and robustness research**

  - Understanding and preventing deceptive behaviour in advanced models.
  - Developing interpretability tools that help us see what models are “thinking”.
  - Designing training methods that reduce the chance of dangerous goal misgeneralisation.
  - Creating evaluation suites that stress-test models for catastrophic capabilities (e.g. autonomous bioweapon design, large-scale cyberattacks).

- **AI governance, policy, and standards**

  - Designing and advocating for safety standards for frontier models (e.g. testing requirements, red-team evaluations, compute thresholds).
  - Supporting government AI safety institutes, such as the UK’s AI Safety Institute, and related regulatory frameworks.
  - Working on international coordination to reduce “racing” dynamics where labs or states cut corners on safety to gain an edge.
  - Analysing and influencing corporate governance at leading AI labs to prioritise catastrophic-risk reduction.

  Open Philanthropy’s [“Request for Proposals: AI Governance”](https://www.openphilanthropy.org/request-for-proposals-ai-governance/) is a good example of the kind of work this analysis aims to capture.

- **Field-building and talent pipelines**
  - Training technically strong researchers who specialise in alignment and safety (e.g. through programs like SERI MATS, AI safety fellowships, or specialised PhDs).
  - Building career paths into AI governance and standards-setting roles in governments and international organisations.
  - Supporting research communities (e.g. interpretability workshops, AI safety conferences) that raise the overall level of attention to catastrophic risk.

We are _not_ trying to model:

- Generic “AI for social good” projects.
- Narrow AI ethics work focused only on issues like bias, privacy, or labour-market impacts.
- Investments that mainly speed up AI capabilities without substantially improving safety.

The **cost per microprobability** figure should be interpreted as applying to the **best marginal opportunities** in this space, as assessed by organisations like Open Philanthropy, Longview Philanthropy, Survival and Flourishing Fund, and similar evaluators.

---

### Key uncertainties

The numbers above are **order-of-magnitude guesses**, not precise forecasts. Some of the main uncertainties include:

1. **Baseline extinction risk from AI.**  
   Estimates of “p(doom)” vary widely—from well below 1% to well above 50%—even among experts. Our modeling does not depend on any single value, but the true risk heavily influences how valuable risk reduction is. The surveys by AI Impacts and the paper [“Thousands of AI Authors on the Future of AI”](https://arxiv.org/abs/2401.02843) suggest that many experts give at least a few percent to extremely bad outcomes, but these are still subjective judgments.

2. **Timing of transformative AI.**  
   If AGI/ASI arrives very soon, there may be little time for additional safety work to have an effect. If it arrives much later, there may be more time to prepare, but our current efforts may need to be sustained or updated over decades. Surveys of AI researchers, as summarised in AI Impacts’ [timeline survey overview](https://aiimpacts.org/2022-expert-survey-on-progress-in-ai/) and the arXiv paper above, generally suggest that **human-level or superhuman AI within this century is more likely than not**, but with very wide uncertainty on the exact date.

3. **Effectiveness of safety interventions.**  
   We do not yet know which combination of alignment research, evaluations, regulation, and industry self-governance will be effective at preventing catastrophe. It is quite possible that large parts of our current portfolio will have little marginal impact, and that only a subset of interventions will significantly move the needle. Our cost per microprobability range (\$0.2–\$20 million) is meant to capture both optimistic and pessimistic views on this.

4. **Interaction with other risks and benefits.**  
   AI safety work might also:

   - Reduce other catastrophic risks (e.g. AI-enabled bioterrorism or cyberwarfare).
   - Speed up beneficial AI applications that greatly improve health and wellbeing, effectively **raising QALYs per year** for billions of people.

   These co-benefits are not explicitly included in the numbers above, which focus only on avoiding the worst-case “everyone dies” scenario.

5. **The long-run future.**  
   Our QALY calculations **only include people who are alive at the time a catastrophe would occur**, plus their remaining natural lifespan. They do **not** count the potentially vast number of future people who would never exist if humanity goes extinct. Longtermist analyses often argue that the value of preserving humanity’s long-run potential—centuries or millennia of civilisation, possible space settlement, and perhaps trillions or more future lives—dominates the calculus. For more on this, see Nick Bostrom’s [“Existential Risk Prevention as Global Priority”](https://www.globalpolicyjournal.com/articles/global-commons-and-environment/existential-risk-prevention-global-priority) and the Global Priorities Institute working paper [“The Case for Strong Longtermism”](https://www.globalprioritiesinstitute.org/wp-content/uploads/The-Case-for-Strong-Longtermism-GPI-Working-Paper-June-2021-2-2.pdf).

6. **Non-human welfare.**  
   If misaligned AI destroys not only humans but most or all animal life, the welfare losses for non-human animals could be enormous. On the flip side, aligned AI might help vastly reduce wild-animal suffering or improve the lives of farmed animals. Our QALY framework here is human-centric and does not attempt to quantify these effects.

Given all of these uncertainties, we view the estimates on this page as **rough tools for comparison**, not definitive answers. They suggest that:

- Even under conservative, near-term, human-only assumptions, **top AI existential risk charities plausibly achieve something like \$1–\$60 per QALY**, with a central estimate around **\$6 per QALY**.
- This is in the same ballpark—or better—than our estimates for the best global health and poverty charities.
- If we also care about future generations and non-human animals, the case for AI existential risk work becomes even stronger.

For donors who are comfortable with large uncertainties but concerned about the possibility that AI could literally end the story of humanity, **AI existential risk charities appear to be one of the most promising places to give**.

_Our current cost per life estimates are very approximate and we are looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes

https://80000hours.org/articles/existential-risks/ argues the cost is about \$1000, but maybe \$100, counting existing people

We've already spent between 600 million and a billion dollars on AI safety. Assume we've reduced xrisk by 1%. Assume the marginal value of the next billion is the same.

So 1 billion --> 1% chance of saving 8 billion people --> 80 million lives in EV... but each person's life is already half over, so 40 million lives for a billion, or \$25 per life.

Note that this assumes that in a good AI future our longevity is not increased at all -- everyone just lives a normally long life, of equal quality to their life now.
But in reality a good AGI outcome would likely significantly extend our lives, possibly up to a trillion years or more.

If people lived a million years on average after a good AGI outcome, then that multiplies the lives by 12500, \$25/12500 = \$0.002

Each person lives a billion years --> \$0.000002
