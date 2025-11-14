---
id: conflict-mitigation
name: 'Conflict Mitigation'
effects:
  - effectId: standard
    startTime: 0
    windowLength: 10
    costPerQALY: 1_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **\$1,000 per QALY**  
**Range (plausible):** **\$200–\$20,000 per QALY**

## Details

**What’s in scope.**  
This category covers philanthropy that _reduces the likelihood, intensity, or duration of violent conflict between large groups_ (e.g., support for high-caliber conflict analysis, quiet diplomacy and mediation, and policy advocacy that helps avert escalation). Examples of top implementers include the **International Crisis Group (ICG)** and the **Centre for Humanitarian Dialogue (HD)**, both focused on preventing wars and brokering agreements. [ICG overview](https://www.crisisgroup.org/global/20m-grant-aims-combine-local-voices-and-global-expertise-reduce-human-suffering); [HD Centre](https://hdcentre.org/).

### Why conflict mitigation can be highly cost-effective (at the right margin)

1. **Large harms per conflict, beyond direct deaths.**  
   Open Philanthropy’s synthesis estimates **~10 million DALYs/year** directly from conflict worldwide and argues _indirect_ harms (healthcare disruption, displacement, famine) likely **multiply** this several-fold (they model **4×**). They translate the burden of a civil war to **~0.14 life-years lost per resident per year** in affected countries. [Open Philanthropy](https://www.openphilanthropy.org/research/civil-conflict-reduction/). Independent work likewise finds very large **indirect mortality**—tens of millions of civilian deaths over 1990–2017 attributable to wars, beyond battlefield deaths. [BMC Medicine 2020](https://bmcmedicine.biomedcentral.com/articles/10.1186/s12916-020-01708-5).

2. **Quality-of-life losses are substantial.**  
   In conflict-affected settings, **~22%** of people meet criteria for depression/anxiety/PTSD at any time (with ~9% moderate–severe disorders). These conditions carry sizeable health-related quality of life decrements. [The Lancet 2019](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736%2819%2930934-1/fulltext).

3. **Economic and societal externalities are massive.**  
   The **global economic impact of violence** is on the order of **\$19–20 trillion/year** (~**12–14% of world GDP**), with **GDP losses** a large share for armed conflict. [Global Peace Index 2025](https://www.visionofhumanity.org/wp-content/uploads/2025/06/Global-Peace-Index-2025-web.pdf). Open Phil’s back-of-the-envelope suggests **~\$1.2 trillion** total value from averting an _average_ civil war, with roughly **80%** from avoided income losses and **20%** from health (DALYs) impacts. [Open Philanthropy](https://www.openphilanthropy.org/research/civil-conflict-reduction/).

4. **There is evidence that targeted peace efforts reduce violence.**  
   Scholarly work finds **UN peacekeeping** reduces civilian killings and battle deaths and is **cost-effective** compared with unilateral action. [Hultman, Kathman & Shannon](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1912556); [Cambridge APSR](https://www.cambridge.org/core/journals/american-political-science-review/article/beyond-keeping-peace-united-nations-effectiveness-in-the-midst-of-fighting/46CFE142449D67731DF1E9FC37B46143); [UN peacekeeping cost-effectiveness brief](https://peacekeeping.un.org/en/peacekeeping-is-cost-effective-must-adapt-to-new-reality). While NGOs are not the UN, this literature shows _the causal lever exists_: timely third-party action can materially lower violence.

### Assumptions & calculation (explicit)

We model the expected value of funding a _top-tier conflict mitigation NGO_ (analysis + mediation + advocacy) that works across multiple flashpoints each year:

- **Representative conflict burden (Q):**  
  Assume a country of **10 million** residents faces a civil war lasting **5 years**. Using Open Phil’s **0.14 life-years lost per resident-year** as an anchor and rounding conservatively to **0.10 QALYs** lost per resident-year (to avoid double-counting or overestimating indirect harms), the total QALYs at stake if war fully unfolds are:

  $$
  Q = 0.10\ \text{QALY/person-year} \times 10{,}000{,}000\ \text{people} \times 5\ \text{years} = \mathbf{5{,}000{,}000\ QALYs}.
  $$

  _Notes:_ A 5-year horizon aligns with typical conflict durations (median ≈ **5 years**). [Why Onset Matters](https://journals.sagepub.com/doi/10.1177/00220027241293715). The 0.10 figure is below Open Phil’s **0.14** and implicitly includes health and quality-of-life components (e.g., elevated depression/anxiety/PTSD prevalence in conflict areas). [Open Philanthropy](https://www.openphilanthropy.org/research/civil-conflict-reduction/); [The Lancet 2019](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736%2819%2930934-1/fulltext).

- **Probability/intensity reduction (p):**  
  For a top NGO’s portfolio, assume it achieves a **0.2 percentage point** absolute reduction (**p = 0.002**) in either (i) the chance a specific high-risk episode escalates to civil war, or (ii) the expected “fraction of full war” (intensity × duration) across multiple flashpoints. This is a deliberately _small_ effect size consistent with hits-based policy/mediation work.

- **Philanthropic cost (C):**  
  Assume **\$10 million** of _incremental_ funding to the top NGO(s) over 1–2 years to staff regional experts, maintain on-the-ground contacts, and run high-leverage diplomacy. For scale: major grants to ICG/HD are in the multi-million to tens-of-millions range. [ICG grant context](https://www.crisisgroup.org/global/20m-grant-aims-combine-local-voices-and-global-expertise-reduce-human-suffering); [HD annuals](https://hdcentre.org/insights/making-peace-in-2023-and-evolving-with-new-conflict-realities/).

- **Expected QALYs saved and cost per QALY:**

  $$
  \mathbb{E}[\text{QALYs saved}] = p \times Q = 0.002 \times 5{,}000{,}000 = \mathbf{10{,}000\ QALYs}.
  $$

  $$
  \textbf{Cost per QALY} = \frac{C}{\mathbb{E}[\text{QALYs saved}]} = \frac{\$10{,}000{,}000}{10{,}000} = \mathbf{\$1{,}000\ per\ QALY}.
  $$

**Range and uncertainty.**  
Reality varies widely by country size, conflict type, tractability, and timing. A reasonable parameter sweep:

- $Q$ between **3–12 million QALYs** per “would-be” war (smaller/larger populations; shorter/longer durations; different quality-of-life losses).
- $p$ between **0.05%–0.5%** (0.0005–0.005) depending on leverage and luck.
- $C$ between **\$5–\$30 million** per “episode” of decisive work.

This yields a corridor of roughly **\$200–\$20,000 per QALY**. The lower end is consistent with unusually tractable, time-critical wins; the upper end reflects years with little traction or highly internationalized wars where NGO leverage is limited. The estimate is also directionally supported by macro evidence that preventing conflict averts extremely large **income** losses in addition to health losses. [Open Philanthropy](https://www.openphilanthropy.org/research/civil-conflict-reduction/); [Global Peace Index 2025](https://www.visionofhumanity.org/wp-content/uploads/2025/06/Global-Peace-Index-2025-web.pdf).

**Bottom line.**  
Because _small_ probabilities of averting or shortening a war translate into _large_ expected welfare gains, funding top conflict-mitigation organizations plausibly delivers **low-thousands of dollars per QALY** on average, with wide uncertainty. The point estimate of **\$1,000 per QALY** sits within a conservative parameterization and is intended for aggregation with other researchers’ estimates.

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes

## Start time & duration (for modeling)

- **Start time:** **0.5 years** (range **0–3 years**).  
  _Why:_ Impact typically comes from time-sensitive analysis, quiet diplomacy, and mediation around flashpoints or negotiations; when successful, benefits begin as soon as violence is de-escalated or an agreement is reached. See discussions of rapid de-escalation and mediation in Open Philanthropy’s review and case examples from top mediation NGOs. [Open Philanthropy](https://www.openphilanthropy.org/research/civil-conflict-reduction/); [HD Centre Annual Reports](https://hdcentre.org/insights/making-peace-in-2023-and-evolving-with-new-conflict-realities/).

- **Duration of benefit:** **5 years** (range **2–10 years**).  
  _Why:_ A representative civil conflict episode often lasts multiple years; meta-analyses and datasets report median durations around **~5 years** with wide variance. [Why Onset Matters (2024): mean 7.1y, median 5y](https://journals.sagepub.com/doi/10.1177/00220027241293715).
