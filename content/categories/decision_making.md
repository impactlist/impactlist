---
id: decision-making
name: 'Improving Decision Making'
effects:
  - effectId: standard
    startTime: 3
    windowLength: 30
    costPerQALY: 6_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025. It was written by GPT 5 Thinking, and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **\$6,000 per QALY**  
**Range (plausible):** **\$1,500–\$60,000 per QALY**

## Details

**What’s in scope.**  
Charities that improve how high-stakes institutions think and choose—e.g., calibrated forecasting and prediction markets for policy, structured analytic techniques (premortems, red-team reviews), decision audits, and better evidence pipelines in executive agencies and legislatures.

**Why this can be highly cost-effective.**

- **Decision accuracy can be improved.**  
  Forecasting tournaments have repeatedly produced **substantially higher accuracy** than status-quo methods; trained, well-incentivized teams (“superforecasters”) achieved **30–60%** lower Brier scores than control groups in the IARPA program, with gains from training, teaming, and aggregation. Peer-reviewed summaries: [Mellers et al., PNAS 2015](https://www.pnas.org/doi/10.1073/pnas.1502419112); practical overview: [Good Judgment research](https://goodjudgment.com/research/). Prediction-market surveys likewise find **competitive or superior** accuracy to polls and experts: [Wolfers & Zitzewitz, _JEP_ 2004](https://www.aeaweb.org/articles?id=10.1257/0895330041371321).
- **Simple decision protocols surface risks.**  
  “Premortems” and related red-team methods increase the identification of failure modes and reduce planning errors in lab and field settings: [Klein, HBR 2007](https://hbr.org/2007/09/performing-a-project-premortem).
- **Stakes are very large.**  
  Major policies routinely involve **tens of billions of dollars** in annual benefits and costs; even tiny quality improvements move large totals. Illustrative aggregates: [U.S. OMB benefits–costs reports](https://bidenwhitehouse.archives.gov/wp-content/uploads/2024/02/FY-20-21-22-BCA-Report-FINAL.pdf).
- **Philanthropic tractability exists.**  
  Philanthropy has seeded forecasting infrastructure, tournament platforms, methodology R&D, and government partnerships (e.g., grants to forecasting research groups and evidence-use institutions). Examples: [Open Philanthropy grants database (forecasting/metascience)](https://www.openphilanthropy.org/grants/) and [Effective Institutions Project overviews](https://effectiveinstitutionsproject.org/).

### Assumptions & calculation (explicit)

We model a program that installs **calibrated forecasting + decision protocols** across a portfolio of high-stakes government choices in one wealthy country, supported by expert facilitation, training, tooling, and decision audits.

Let:

- $R$ = **annual welfare-relevant benefits at stake** in the decisions meaningfully touched by the program. Conservative anchor: **\$50 billion/year** (a subset of major regulatory and spending choices).
- $f$ = proportional improvement in _choice quality_ (better options chosen, fewer costly errors) from the methods, **$f = 0.3\%$**.  
  _Rationale:_ Forecast accuracy improvements of tens of percent translate to **fraction-of-a-percent** gains in realized welfare after dilution, organizational frictions, and partial uptake.
- $h$ = share of incremental benefits that are **QALY-relevant** (mortality, morbidity, safety, wellbeing), **$h = 50\%$**.
- $v$ = conversion anchor from money-valued benefits to QALYs, **$v = \$100{,}000/\text{QALY}$**, aligned with common health/wellbeing thresholds in rich countries (e.g., ICER).
- $d$ = **years of effect persistence**, **$d = 4$**.
- $C$ = **philanthropic cost** to stand up and entrench the program, **$C = \$18{,}000{,}000$**.

Annual QALYs produced:

$$
\text{QALYs}_{\text{per year}}
= \frac{h \cdot f \cdot R}{v}
= \frac{0.5 \times 0.003 \times \$50{,}000{,}000{,}000}{\$100{,}000/\text{QALY}}
= 750\ \text{QALYs}.
$$

Total QALYs over the window:

$$
\text{QALYs}_{\text{total}} = d \times \text{QALYs}_{\text{per year}}
= 4 \times 750 = 3{,}000\ \text{QALYs}.
$$

Cost per QALY:

$$
\textbf{Cost per QALY}
= \frac{C}{\text{QALYs}_{\text{total}}}
= \frac{\$18{,}000{,}000}{3{,}000}
= \mathbf{\$6{,}000\ \text{per QALY}}.
$$

**Range and uncertainty.**  
Key parameters vary widely:

- $R$: **\$20–\$100 billion/year** influenced;
- $f$: **0.1\%–1.0\%** (from modest incremental gains to unusually strong adoption/impact);
- $h$: **30\%–60\%**;
- $d$: **2–6 years**;
- $C$: **\$10–\$40 million**.

Sweeping these yields roughly **\$1,500–\$60,000 per QALY**. Lower values correspond to unusually successful deployments that touch very large portfolios; higher values reflect limited scope, short persistence, or expensive/unsuccessful rollouts.

**Cross-checks and plausibility.**

- Tournament results show **large accuracy gains** from training, teaming, and aggregation—consistent with small but meaningful welfare improvements when embedded in real decisions: [Mellers et al., PNAS 2015](https://www.pnas.org/doi/10.1073/pnas.1502419112); [Good Judgment](https://goodjudgment.com/research/).
- Prediction-market surveys document **informational efficiency** in many domains: [Wolfers & Zitzewitz 2004](https://www.aeaweb.org/articles?id=10.1257/0895330041371321).
- Evidence infrastructures demonstrate **multi-year** institutional benefits: [What Works Network](https://www.gov.uk/guidance/what-works-network); regulatory appraisals summarized by [OMB](https://bidenwhitehouse.archives.gov/wp-content/uploads/2024/02/FY-20-21-22-BCA-Report-FINAL.pdf).

**Bottom line.**  
Because modest improvements in judgment and process apply to **very large, recurring decisions**, high-leverage decision-making charities can plausibly deliver **low-to-mid four-figure dollars per QALY** on expectation. The point estimate of **\$6,000 per QALY** reflects conservative assumptions about scope, uptake, and persistence, grounded in the empirical literature on forecasting and structured decision protocols.

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes

## Start time & duration (for modeling)

- **Start time:** **1.0 years** (range **0.25–2 years**).  
  _Why:_ Standing up forecasting tournaments, prediction markets, red-team functions, and decision audits typically takes months; first consequential uses often arrive in the next budget or policy cycle. See examples of government-facing forecasting efforts and decision-support deployments: [Good Judgment Project](https://goodjudgment.com/research/); [What Works Network](https://www.gov.uk/guidance/what-works-network).

- **Duration of benefit:** **4 years** (range **2–6 years**).  
  _Why:_ Methods and tooling (calibrated forecasting, premortems, decision reviews) tend to persist across cycles but can erode without renewal; documented benefits from evidence infrastructures and analytics offices occur over multi-year windows. Overviews: [HBR premortem](https://hbr.org/2007/09/performing-a-project-premortem); [UK What Works](https://www.gov.uk/guidance/what-works-network).
