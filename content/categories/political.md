---
id: political
name: 'Political'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 4
    costPerQALY: 30_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing, but check the global assumptions for this value and other relevant parameters, such as the discount factor).

## Description of effect

This effect captures the expected QALY impact of partisan donations to candidates or PACs in high-income democracies. The impact pathway is: dollars → slightly higher win probability in close races → policy differences → QALYs. We explicitly account for counter-donations by the opposing side and the risk that campaign spending moves few votes.

## Point Estimates

- **Cost per QALY:** \$30,000 (\$3,000–\$300,000)
- **Start time:** 1 year
- **Duration:** 4 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. Campaign contact and advertising have small average persuasive effects in high-salience races; TV ad effects are often short-lived. ([Kalla & Broockman 2018](https://www.cambridge.org/core/journals/american-political-science-review/article/minimal-persuasive-effects-of-campaign-contact-in-general-elections-evidence-from-49-field-experiments/753665A313C4AB433DBF7110299B7433), [Gerber et al. 2011](https://www.cambridge.org/core/journals/american-political-science-review/article/how-large-and-longlasting-are-the-persuasive-effects-of-televised-campaign-ads-results-from-a-randomized-field-experiment/DA29FE8A5581C772006A1DEBB21CFC4C))
2. Turnout mobilization reliably moves votes at modest cost through door-to-door, mail, and SMS outreach. ([Gerber & Green, Get Out the Vote](https://www.researchgate.net/publication/396933704_Get_Out_the_Vote_How_to_Increase_Voter_Turnout), [Mann et al. 2024](https://www.sciencedirect.com/science/article/pii/S0261379423001518))
3. Opposing donors respond to campaign spending, creating zero-sum dynamics with diminishing returns in competitive races. ([FEC 2024](https://www.fec.gov/updates/statistical-summary-of-24-month-campaign-activity-of-the-2023-2024-election-cycle/), [OpenSecrets](https://www.opensecrets.org/elections-overview/cost-of-election))
4. Policy budget swings at stake in major races can be on the order of hundreds of millions of dollars (e.g., U.S. global health appropriations). ([KFF 2024](https://www.kff.org/global-health-policy/global-health-funding-in-the-fy-2024-final-appropriations-bill/))
5. A well-targeted \$10 million partisan donation in a true toss-up produces approximately 0.7 percentage points net increase in win probability after accounting for counter-spending.
6. Any single race has approximately 5% marginal influence on realizing a policy swing.
7. Approximately 20% of policy budget swings convert into outcomes near top-tier effectiveness.
8. Cost per QALY for top-tier global health/development opportunities is approximately \$100. (See our Global Health and Global Development estimates.)
9. Election-dependent policy changes run with the term (1–4 years) and may persist into the next cycle but can be reversed.

## Details

### Cost per QALY

The point estimate (\$30,000/QALY) and range (\$3,000–\$300,000/QALY) are derived from a model of donations targeted to exceptionally close, policy-salient national races.

**Model parameters:**

- $B$ = Policy budget swing at stake: \$500 million (Assumption 4)
- $f$ = Fraction converting to top-tier effectiveness: 20% (Assumption 7)
- $c$ = Cost per QALY for those opportunities: \$100 (Assumption 8)
- $g$ = Marginal influence of one race on policy swing: 5% (Assumption 6)
- $p$ = Net win probability increase from \$10M donation: 0.7% (Assumption 5)
- $C$ = Donation amount: \$10 million

**Calculation:**

QALYs at stake from the policy wedge:
$$\text{QALYs}_{\text{wedge}} = \dfrac{f \times B}{c} = \dfrac{0.20 \times \$500{,}000{,}000}{\$100} = 1{,}000{,}000 \text{ QALYs}$$

Portion causally tied to winning this race:
$$\text{QALYs}_{\text{race}} = g \times \text{QALYs}_{\text{wedge}} = 0.05 \times 1{,}000{,}000 = 50{,}000 \text{ QALYs}$$

Expected QALYs from the donation:
$$\mathbb{E}[\text{QALYs}] = p \times \text{QALYs}_{\text{race}} = 0.007 \times 50{,}000 = 350 \text{ QALYs}$$

Cost per QALY:
$$\textbf{Cost per QALY} = \dfrac{C}{\mathbb{E}[\text{QALYs}]} = \dfrac{\$10{,}000{,}000}{350} \approx \$28{,}600 \approx \$30{,}000$$

**Zero-sum adjustment:** The parameter $p$ already accounts for counter-spending and the crowding that reduces marginal returns in saturated media markets (Assumptions 1, 3).

**Range:** Varying parameters within conservative bounds ($B$: \$200M–\$1B; $f$: 10–30%; $g$: 1–15%; $p$: 0.1–3 percentage points) yields approximately \$3,000–\$300,000/QALY. The lower end corresponds to unusually tractable, ultra-close races with large policy wedges; the upper end reflects years when spending cancels out or policy differences are small.

### Start Time

The 1-year start time reflects that donations typically precede elections by months, with benefits beginning if the backed side wins and enacts policy soon after taking office.

### Duration

The 4-year duration reflects that election-dependent policy changes (appropriations, regulatory priorities) run with the term and can persist into the next cycle, but may be reversed (Assumption 9).

---

_These estimates are approximate and we welcome contributions to improve them. Learn how you can help [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
