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

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from philanthropy that reduces the likelihood, intensity, or duration of violent conflict between large groups—including support for conflict analysis, quiet diplomacy, mediation, and policy advocacy. Top implementers include the International Crisis Group (ICG) and the Centre for Humanitarian Dialogue (HD).

## Point Estimates

- **Cost per QALY:** \$1,000 (\$200–\$20,000)
- **Start time:** 0 years
- **Duration:** 10 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. Conflict causes approximately 10 million DALYs/year directly, with indirect harms (healthcare disruption, displacement, famine) multiplying this by approximately 4×. ([Open Philanthropy](https://www.openphilanthropy.org/research/civil-conflict-reduction/))
2. A civil war causes approximately 0.10–0.14 life-years lost per resident per year in affected countries. ([Open Philanthropy](https://www.openphilanthropy.org/research/civil-conflict-reduction/))
3. Approximately 22% of people in conflict-affected settings meet criteria for depression/anxiety/PTSD, with substantial quality-of-life decrements. ([The Lancet 2019](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736%2819%2930934-1/fulltext))
4. The global economic impact of violence is approximately \$19–20 trillion/year (~12–14% of world GDP). ([Global Peace Index 2025](https://www.visionofhumanity.org/wp-content/uploads/2025/06/Global-Peace-Index-2025-web.pdf))
5. UN peacekeeping reduces civilian killings and battle deaths and is cost-effective compared with unilateral action—demonstrating that third-party intervention can materially lower violence. ([Hultman et al.](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1912556), [UN brief](https://peacekeeping.un.org/en/peacekeeping-is-cost-effective-must-adapt-to-new-reality))
6. Median civil conflict duration is approximately 5 years (mean ~7 years). ([Why Onset Matters 2024](https://journals.sagepub.com/doi/10.1177/00220027241293715))
7. Top conflict-mitigation NGOs can achieve approximately 0.2 percentage points (0.002) reduction in conflict probability or intensity across their portfolio.
8. Major grants to top conflict-mitigation NGOs (ICG, HD) are in the \$5–30 million range. ([ICG](https://www.crisisgroup.org/global/20m-grant-aims-combine-local-voices-and-global-expertise-reduce-human-suffering), [HD Centre](https://hdcentre.org/insights/making-peace-in-2023-and-evolving-with-new-conflict-realities/))

## Details

### Cost per QALY

The point estimate (\$1,000/QALY) and range (\$200–\$20,000/QALY) are derived from modeling the expected value of funding top-tier conflict mitigation NGOs.

**Model parameters:**

- $Q$ = QALYs at stake in a representative conflict:

  - Population: 10 million
  - Duration: 5 years (Assumption 6)
  - QALY loss per resident-year: 0.10 (conservative, below Open Phil's 0.14, per Assumption 2)
    $$Q = 0.10 \times 10{,}000{,}000 \times 5 = 5{,}000{,}000 \text{ QALYs}$$

- $p$ = Probability/intensity reduction from NGO work: 0.002 (Assumption 7)
- $C$ = Philanthropic cost: \$10 million (Assumption 8)

**Calculation:**

$$\mathbb{E}[\text{QALYs saved}] = p \times Q = 0.002 \times 5{,}000{,}000 = 10{,}000 \text{ QALYs}$$

$$\text{Cost per QALY} = \dfrac{C}{\mathbb{E}[\text{QALYs saved}]} = \dfrac{\$10{,}000{,}000}{10{,}000} = \$1{,}000$$

**Range:** Varying parameters ($Q$: 3–12 million QALYs; $p$: 0.05–0.5%; $C$: \$5–30 million) yields approximately \$200–\$20,000/QALY. The lower end corresponds to unusually tractable, time-critical wins; the upper end reflects years with limited traction or highly internationalized wars where NGO leverage is limited.

### Start Time

The 0-year start time reflects that impact typically comes from time-sensitive analysis, quiet diplomacy, and mediation around flashpoints—benefits begin as soon as violence is de-escalated or an agreement is reached.

### Duration

The 10-year duration reflects the typical persistence of conflict prevention benefits. Civil conflicts often last approximately 5 years (Assumption 6), and successful prevention or early de-escalation averts harms across that period plus potential downstream effects.

---

_These estimates are approximate and we welcome contributions to improve them. You can submit quick feedback with [this form](https://forms.gle/NEC6LNics3n6WVo47) or get more involved [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
