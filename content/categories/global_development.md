---
id: global-development
name: 'Global Development / Poverty'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 50
    costPerQALY: 90
---

# Justification of cost per life

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking, cross-checked by Claude Sonnet 4.5 and Gemini Pro 2.5, and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **$87 per QALY**  
**Range (plausible):** **$60–$150 per QALY**

## Details

**What we model as “Global Development / Poverty.”**  
This category is anchored to the best-evidenced, large-scale opportunities typically funded by GiveWell’s Top Charities Fund: (1) seasonal malaria chemoprevention (Malaria Consortium), (2) insecticide-treated bednets (AMF), (3) vitamin A supplementation (Helen Keller Intl), and (4) cash incentives for routine childhood vaccination (New Incentives). GiveWell’s latest technical pages summarize **cost per death averted** as follows (location-dependent):

- **SMC:** **$2,000–$7,000** per death averted.  
  Source: [GiveWell SMC page](https://www.givewell.org/international/technical/programs/seasonal-malaria-chemoprevention).

- **ITNs:** **$3,000–$8,000** per death averted.  
  Source: [GiveWell ITN page](https://www.ggivewell.org/international/technical/programs/insecticide-treated-nets).

- **Vitamin A supplementation (VAS):** **$1,000–$8,500** per death averted.  
  Source: [GiveWell VAS page](https://www.givewell.org/international/technical/programs/vitamin-A).

- **New Incentives (vaccination incentives):** **$1,000–$5,000** per death averted.  
  Source: [GiveWell New Incentives (Apr 2024)](https://www.givewell.org/international/technical/programs/new-incentives/april-2024-version).

Taking the midpoint of each range and averaging across these four representative programs yields an unweighted portfolio average of **~$4,438 per under-5 death averted**.

**From lives saved to QALYs.**  
Open Philanthropy’s reading of GiveWell’s moral-weight framework implies **~51 DALYs (≈QALYs) per under-5 death averted**. Dividing the portfolio average **$4,438** by **51** gives **~$87 per QALY**.  
Source: [Open Philanthropy technical notes](https://www.openphilanthropy.org/research/technical-updates-to-our-global-health-and-wellbeing-cause-prioritization-framework/).

**Cross-checks outside the GiveWell models.**  
Independent economic evaluations of closely related child-survival programs land in the same ballpark on a DALY basis. For example, a 2025 Mozambique study of **SMC** estimated **$130 per DALY averted** (and **~$3,287 per death averted**), broadly consistent with the above conversion. Similar analyses from the Sahel report DALY costs in the low hundreds.  
Sources: [Malaria Journal 2025 (Mozambique SMC)](https://malariajournal.biomedcentral.com/articles/10.1186/s12936-025-05401-x); [Diawara 2021, Mali (SMC) via PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7934250/).

**Why the range.**  
Costs per death averted vary materially by country, year, and program (e.g., **$1,000–$8,500** across the four interventions above). The healthy-life-years mapping per under-5 death averted is also uncertain; a reasonable corridor is **~45–60** QALYs. Combining these uncertainties yields a plausible overall corridor of **$60–$150 per QALY**. As an additional sense-check, GiveWell’s public example for AMF nets (Guinea) historically implied about **$4,500 per life saved**, which, using ~51 QALYs per death, maps to **~$90 per QALY**—right in the middle of our estimate.  
Sources: ranges above; [GiveWell “How much does it cost to save a life?” example](https://www.givewell.org/how-much-does-it-cost-to-save-a-life/february-2024-version).

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes
