---
id: environmental
name: 'General Environmental'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 40
    costPerQALY: 700
---

# Justification of cost per life

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures health benefits from environmental interventions excluding climate mitigation: pollution control and environmental health (lead exposure elimination, air quality policy), toxic-site remediation, and habitat/greenspace protection where human health is a primary co-benefit.

## Point Estimates

- **Cost per QALY:** \$700 (\$20–\$30,000)
- **Start time:** 1 year
- **Duration:** 40 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. Lead exposure causes approximately 22 million DALYs annually, mostly in LMICs. ([Rethink Priorities 2021](https://rethinkpriorities.org/research-area/global-lead-exposure-report/))
2. The Lead Exposure Elimination Project (LEEP) achieves approximately \$4.49 per DALY-equivalent averted across programs. ([LEEP 2024](https://leadelimination.org/how-cost-effective-are-leeps-paint-programs/))
3. Lead hot-spot cleanups achieve \$392–\$3,238 per DALY. ([Ericson et al. 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC7007121/), [Pure Earth](https://www.pureearth.org/global-lead-program/research/))
4. Health benefits of air-pollution control strategies typically exceed their costs, driven by mortality and morbidity reductions. ([Wang et al. 2024](https://ghrp.biomedcentral.com/articles/10.1186/s41256-024-00373-y))
5. Sizable PM₂.₅ reductions can add months of life expectancy on average. ([Lin et al. 2025](https://www.nature.com/articles/s41612-025-00953-w))
6. Philanthropic funding for clean air remains highly neglected, increasing the odds that donor advocacy can be pivotal. ([Clean Air Fund 2025](https://www.cleanairfund.org/resource/air-quality-funding-2025/))
7. Hazardous-waste cleanups (e.g., Superfund) are linked to improved birth outcomes and child development. ([American University 2019](https://www.american.edu/spa/news/evidence-shows-costly-superfund-cleanup-worth-the-investment.cfm))
8. Habitat/greenspace interventions have a thinner QALY evidence base; program-level CEAs sometimes fail standard cost-effectiveness thresholds (e.g., ~£207,000/QALY for UK park renovation). ([Love-Koh et al. 2017](https://www.sciencedirect.com/science/article/abs/pii/S0140673617329963), [Raza et al. 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11594178/))

## Details

### Cost per QALY

The point estimate (\$700/QALY) and range (\$20–\$30,000/QALY) reflect a heavy-tailed distribution of environmental health opportunities.

**Lead exposure elimination (best-in-class):**

Top pollution-control charities like LEEP achieve single-digit dollars per DALY (Assumption 2). Hot-spot remediation ranges from \$400–\$3,200/DALY (Assumption 3). These represent the most cost-effective opportunities in this category.

**Clean air policy and enforcement:**

Air pollution control typically produces health benefits exceeding costs (Assumption 4), suggesting \$<1,000/QALY in favorable contexts, though transparent QALY-based CEAs remain scarce. High neglectedness (Assumption 6) increases philanthropic leverage.

**Toxic-site cleanup:**

Evidence links cleanups to improved birth outcomes and reduced neurotoxicity (Assumption 7), though cost-per-QALY estimates vary by site.

**Habitat/greenspace (upper end):**

Amenity-first projects can exceed \$20,000/QALY when measured strictly on health outcomes (Assumption 8), as the QALY evidence base is thinner and mixed.

**Combined estimate:**

Weighting toward the best-evidenced, health-first opportunities and down-weighting amenity-focused projects yields a point estimate of \$700/QALY. The very wide range (\$20–\$30,000) reflects the heavy-tailed distribution and uncertainties in policy attribution and durability.

### Start Time

The 1-year start time reflects the typical delay between funding environmental advocacy or remediation programs and realized health benefits.

### Duration

The 40-year duration reflects that pollution reduction and lead elimination produce health benefits persisting across decades of avoided exposure and reduced disease burden.

---

_These estimates are approximate and we welcome contributions to improve them. You can submit quick feedback with [this form](https://forms.gle/NEC6LNics3n6WVo47) or get more involved [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
