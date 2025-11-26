---
id: climate-change
name: 'Climate Change'
effects:
  - effectId: standard
    startTime: 7
    windowLength: 80
    costPerQALY: 900
---

# Justification of cost per life

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures health benefits from donations to top policy-focused climate charities that reduce CO₂ emissions through systems change—shaping standards, incentives, and technology roadmaps. Benefits are primarily from reduced temperature-related mortality, though many mitigation actions also cut air pollution for additional near-term health gains not fully captured here.

## Point Estimates

- **Cost per QALY:** \$900 (\$150–\$20,000)
- **Start time:** 7 years
- **Duration:** 80 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. Top climate nonprofits can avert approximately 1 tCO₂e per \$1 through policy advocacy and systems change. ([Giving Green 2025](https://www.givinggreen.earth/post/eager-to-measure-the-impact-of-your-climate-donation-forget-offset-math-focus-on-systems-change), [Founders Pledge](https://www.founderspledge.com/research/climate-change-executive-summary))
2. Founders Pledge 2023 grants could avert ~47.9 MtCO₂e on \$6.9M—approximately \$0.14 per ton in expectation (highly uncertain). ([Founders Pledge 2023](https://impact.founderspledge.com/2023/climate-change))
3. Each ton of CO₂ causes approximately 2.26 × 10⁻⁴ expected deaths over 2020–2100 (i.e., ~4,434 tCO₂ per life saved). ([Bressler 2021](https://www.nature.com/articles/s41467-021-24487-w))
4. Mortality damages from CO₂ are valued at approximately \$36.6 per ton in high-emissions scenarios. ([Carleton et al. 2022](https://academic.oup.com/qje/article/137/4/2037/6571943))
5. Climate-attributable deaths (primarily heat-related among older adults) represent approximately 5 QALYs lost per death (range 2–10), based on years of life lost data. ([Baccini et al. 2013](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0069638), [Nature Medicine 2023](https://www.nature.com/articles/s41591-023-02419-z))
6. Ultra-cheap carbon offsets often lack additionality; systems-change advocacy is more reliable. ([Founders Pledge](https://www.founderspledge.com/research/climate-and-lifestyle-donations-and-offsetting))
7. Avoided CO₂ today reduces temperature-related health harms across the remainder of the century (2020–2100).

## Details

### Cost per QALY

The point estimate (\$900/QALY) and range (\$150–\$20,000/QALY) are derived from combining emissions-reduction costs with mortality-to-QALY conversions.

**Step 1 — Emissions reduction per dollar:**

Top climate nonprofits achieve approximately \$0.30–\$1.50 per tCO₂e averted through policy advocacy (Assumptions 1–2), with some analyses suggesting even lower costs for high-leverage grants.

**Step 2 — Mortality per ton:**

Using Bressler's mortality cost of carbon (Assumption 3):

- Deaths per ton: 2.26 × 10⁻⁴
- QALYs per death: 5 (Assumption 5)
- QALYs per ton: 2.26 × 10⁻⁴ × 5 = 0.00113

**Step 3 — Cost per QALY:**

At \$1 per tCO₂e averted:
$$\text{Cost per QALY} = \dfrac{\$1}{0.00113} \approx \$885$$

Using a more conservative \$1.50/tCO₂e yields approximately \$1,300/QALY. We use \$900 as the point estimate.

**Range:** Bounding inputs at \$0.30–\$10/tCO₂e and 2–10 QALYs/death spans approximately \$150–\$20,000/QALY.

**Caveats:**

- These numbers reflect temperature-related mortality only. Many mitigation actions also reduce air pollution, producing additional near-term health gains. ([IPCC AR6](https://www.ipcc.ch/report/ar6/wg2/chapter/chapter-7/))
- Advocacy impacts are risky and lumpy—expected tons per dollar are uncertain and vary by policy window. ([EA Forum discussion](https://forum.effectivealtruism.org/posts/NbWeRmEsBEknNHqZP/longterm-cost-effectiveness-of-founders-pledge-s-climate))

### Start Time

The 7-year start time reflects the delay between policy wins and realized emissions reductions. Donations translate into regulatory changes within a few legislative cycles, with emissions effects beginning as rules take effect and projects build out.

### Duration

The 80-year duration reflects that avoided CO₂ today reduces temperature-related health harms across the remainder of the century (Assumption 7). Major climate-mortality studies quantify impacts on a 2020–2100 horizon.

---

_These estimates are approximate and we welcome contributions to improve them. Learn how you can help [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)._

# Internal Notes
