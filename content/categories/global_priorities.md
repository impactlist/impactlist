---
id: global-priorities
name: 'Global Priorities Research'
effects:
  - effectId: standard
    startTime: 5
    windowLength: 25
    costPerQALY: 10
---

# Justification of cost per life

_The following analysis was done on November 16th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from Global Priorities Research (GPR): systematic research into which global problems, interventions, and strategies are most important for altruistic actors to focus on. This includes work at institutions like the Global Priorities Institute, Open Philanthropy's Cause Prioritization team, and independent think tanks. GPR increases QALYs by improving where large pots of money and talent go. This excludes movement-building and public-facing outreach (covered under Meta and Theory).

## Point Estimates

- **Cost per QALY:** \$10 (\$1–\$500)
- **Start time:** 5 years
- **Duration:** 25 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. Governments and philanthropists spend tens of trillions of dollars annually on efforts aimed at the common good; even redirecting a tiny fraction to more effective causes could provide huge gains. ([80,000 Hours](https://80000hours.org/problem-profiles/global-priorities-research/))
2. Some causes are orders of magnitude more cost-effective than others—our estimates range from \$1.59/QALY (AI existential risk) to \$60,000/QALY (Science & Tech). ([80,000 Hours framework](https://80000hours.org/articles/problem-framework/))
3. Past GPR has led to major shifts: identifying AI existential risk, biosecurity, and animal welfare as top priorities, influencing billions in philanthropic commitments. ([GWWC](https://www.givingwhatwecan.org/effective-altruism-effective-giving/global-priorities), [Open Philanthropy](https://www.openphilanthropy.org/cause-selection/))
4. A 2% improvement in the cost-effectiveness of a \$10 billion philanthropic portfolio, achieved through \$20 million in GPR, would yield approximately 1 million extra QALYs at baseline \$200/QALY.
5. "Hit-based" GPR that shifts \$500 million from global health (\$90/QALY) to AI existential risk (\$1.59/QALY) could generate ~300 million extra QALYs, even with heavy discounting for attribution.
6. Research takes 1–3 years to conduct and publish, with an additional 1–3 years for major funders to absorb results and update strategies.
7. Once foundations decide a cause area deserves major investment, that judgment can persist for decades across specific grants. ([Open Philanthropy](https://www.openphilanthropy.org/notable-lessons/))

## Details

### Cost per QALY

The point estimate (\$10/QALY) and range (\$1–\$500/QALY) reflect GPR's role as a multiplier on large funding flows.

**Calculation 1 — Incremental portfolio improvement:**

Consider \$20 million in GPR that modestly improves decisions across a \$10 billion philanthropic portfolio (Assumption 4):

- If GPR improves average cost-effectiveness by 2%:

  - Extra "effective money": \$10B × 2% = \$200 million
  - At baseline \$200/QALY:
    $$Q_{\text{extra}} = \dfrac{\$200{,}000{,}000}{\$200} = 1{,}000{,}000 \text{ QALYs}$$
  - Cost per QALY: \$20M / 1M = **\$20/QALY**

- If the same GPR influences \$20 billion by 2%, cost per QALY falls to **\$10**.
- If it influences \$10 billion by only 1%, cost per QALY rises to **\$40**.

**Calculation 2 — Hit-based cause discovery:**

GPR can have outsized impact by identifying new priority causes (Assumption 5). If \$10 million in research shifts \$500 million from global health to AI existential risk:

- Without GPR: \$500M at \$90/QALY → 5.6 million QALYs
- With GPR: \$500M at \$1.59/QALY → 314 million QALYs
- Difference: ~308 million QALYs

Even attributing only 10% to this specific research yields 30.8 million extra QALYs, or approximately **\$0.30/QALY**. This extreme case illustrates why GPR is considered highly leveraged, though most projects have little impact.

**Combined estimate:**

Averaging across incremental improvements (\$20–50/QALY) and occasional hits (well under \$1/QALY), while accounting for many low-impact projects, yields a point estimate of \$10/QALY. The range (\$1–\$500) reflects scenarios from successful cause discovery to marginal tweaks of already-good portfolios.

### Start Time

The 5-year start time reflects the research-to-impact cycle (Assumption 6): 1–3 years to conduct research, plus 1–3 years for funders to update strategies and deploy capital.

### Duration

The 25-year duration reflects that foundation cause-area commitments can persist for decades once established (Assumption 7). Major EA cause prioritization shifts (AI safety, pandemics, animal welfare) have shown enduring influence over 10–15+ years.

---

{{CONTRIBUTION_NOTE}}

# Internal Notes
