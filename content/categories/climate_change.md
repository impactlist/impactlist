---
id: climate-change
name: 'Climate Change'
effects:
  - effectId: standard
    startTime: 5
    windowLength: 80
    costPerQALY: 590
---

# Justification of cost per life

_The following analysis was updated on April 6th 2026, written by GPT 5.4 and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures human-health benefits from donations to top climate charities that reduce greenhouse gas emissions through policy advocacy, innovation policy, market shaping, and related systems change. The core estimate models avoided climate mortality from reduced emissions. It largely excludes air-pollution co-benefits and most non-fatal climate harms, so it should be read as a partial health estimate for strong mitigation philanthropy rather than a full accounting of climate damages.

## Point Estimates

- **Cost per QALY:** \$590 (\$60–\$7,400)
- **Start time:** 5 years
- **Duration:** 80 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. Donations to high-impact climate nonprofits avert roughly 1.5 tCO₂e per \$1 in expectation, with a plausible range of roughly 0.3–7 tCO₂e/\$. Giving Green's current rule of thumb is ~1 tCO₂e/\$, Giving Green's detailed Evergreen model produced ~1.9 tCO₂e/\$ in its realistic case and ~2.4 tCO₂e/\$ at the median, and Founders Pledge's 2023 high-impact climate grants imply roughly 6.9 tCO₂e/\$ (derived from their reported 47.9 MtCO₂e averted on \$6.9M granted). Because climate-philanthropy results depend heavily on policy windows and tractable opportunities, we use 1.5 tCO₂e/\$ as a middle-of-the-road portfolio estimate rather than anchoring to either the roughest rule of thumb or the strongest historical year. ([Giving Green 2025](https://www.givinggreen.earth/post/eager-to-measure-the-impact-of-your-climate-donation-forget-offset-math-focus-on-systems-change), [Giving Green Evergreen CEA](https://www.givinggreen.earth/research/evergreen-collaborative-top-climate-nonprofit-evaluation), [Founders Pledge 2023 Impact](https://impact.founderspledge.com/2023/climate-change))
2. Each additional ton of CO₂ emitted today causes approximately 2.26 × 10⁻⁴ expected deaths between 2020 and 2100, i.e. one expected death per ~4,434 tons. This is broadly consistent with later work finding large mortality damages per additional ton emitted, especially in poorer and hotter regions. ([Bressler 2021](https://www.nature.com/articles/s41467-021-24487-w), [Carleton et al. 2022](https://academic.oup.com/qje/article/137/4/2037/6571943))
3. Each climate-attributable death corresponds to roughly 5 QALYs lost on average, with a plausible range of 2–10. A European heat-mortality study that explicitly adjusts for harvesting finds about 5,907 years of life lost from ~2,234 heat deaths per year, or about 2.6 years per death, in a relatively old population. But [Wilson et al. 2024](https://www.science.org/doi/10.1126/sciadv.adq3367) find that in Mexico, people under 35 account for 75% of heat-related deaths and 87% of heat-related lost life years, suggesting that in hotter settings heat mortality can fall much more heavily on younger people than the older European evidence implies. Because Wilson's lost-life-years measure is based on remaining life expectancy rather than harvesting-adjusted QALYs, we update the central estimate only modestly to 5 rather than much higher. ([Baccini et al. 2013](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0069638), [Wilson et al. 2024](https://www.science.org/doi/10.1126/sciadv.adq3367))
4. Treating avoided tCO₂e as roughly comparable to avoided tCO₂ is acceptable for a simple century-scale portfolio model, but this is imperfect. In particular, methane-heavy interventions likely produce faster temperature and ozone benefits than this model captures, so the approximation may understate some methane-focused work. ([Giving Green 2025](https://www.givinggreen.earth/post/eager-to-measure-the-impact-of-your-climate-donation-forget-offset-math-focus-on-systems-change), [IPCC AR6 WG1 Chapter 6](https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-6/))
5. It takes approximately 5 years for donations to translate into enacted policy, scaled deployment, or market shifts that meaningfully change emissions trajectories.
6. Benefits then accrue over the remainder of the century, which from a 2026 starting point is approximately 80 years. This matches the main mortality literature used here and the site's 100-year modeling horizon.

## Details

### Cost per QALY

The cleanest way to model climate-mitigation philanthropy is:

$$\text{Cost per QALY} = \dfrac{1}{E \times M \times L}$$

Where:

- $E$ = expected emissions averted per dollar
- $M$ = expected deaths averted per ton
- $L$ = QALYs lost per death

Using the central assumptions above:

- $E = 1.5$ tCO₂e/\$
- $M = 2.26 \times 10^{-4}$ deaths per ton
- $L = 5$ QALYs per death

So:

$$\text{QALYs per } \$1 = 1.5 \times 2.26 \times 10^{-4} \times 5 \approx 0.001695$$

$$\text{Cost per QALY} = \dfrac{\$1}{0.001695} \approx \$590$$

So the point estimate is **\$590/QALY**.

The most judgment-sensitive parameter here is $E$, the expected tons averted per dollar. Climate-philanthropy CEAs are lumpy and heavily dependent on policy windows. Published numbers span roughly 1 tCO₂e/\$ as a general donor heuristic, around 2 tCO₂e/\$ in Giving Green's detailed Evergreen model, and roughly 6.9 tCO₂e/\$ when one backs out Founders Pledge's 2023 portfolio-wide figures. Using 1.5 tCO₂e/\$ as the central estimate puts the point estimate above the rough rule of thumb but well below the strongest published historical result.

The other important judgment call is $L$, the QALYs lost per death. The older European evidence from Baccini suggests about 2.6 years lost per heat death after adjusting for harvesting, which is one reason not to push this number extremely high. But [Wilson et al. 2024](https://www.science.org/doi/10.1126/sciadv.adq3367) find that in Mexico, under-35s account for 75% of heat deaths and 87% of heat-related lost life years, plausibly due in part to outdoor work and other exposure patterns. That materially weakens the idea that climate deaths mostly fall on very old people. Because Wilson's lost-life-years measure is not directly a QALY estimate and is not harvesting-adjusted, we make only a modest update to **5 QALYs per death** rather than a much larger one.

**Range:**

- **Pessimistic:** 0.3 tCO₂e/\$ and 2 QALYs per death gives about \$7,400/QALY.
- **Optimistic:** 7 tCO₂e/\$ and 10 QALYs per death gives about \$60/QALY.

So the practical sensitivity range is **\$60-\$7,400/QALY**.

Both bounds hold $M$, the Bressler mortality figure, fixed at its central value. Letting that parameter vary as well would widen the range further, so this is better read as a practical sensitivity range than as a full uncertainty interval.

[IPCC AR6](https://www.ipcc.ch/report/ar6/wg3/chapter/chapter-3/) and [WHO 2025](https://www.who.int/publications/i/item/B09460) both emphasize that climate mitigation often creates large health gains from cleaner air, and that these gains typically arrive sooner than the avoided climate damages themselves. We mostly exclude those co-benefits from the headline number because they vary a lot by intervention mix and would be easy to overcount in a simple CO₂-based model.

### Start Time

The 5-year start time reflects the lag between a donation and observable emissions reductions. Systems-change climate charities usually need time to influence policy, regulation, supply chains, or innovation pathways, after which deployment still takes a few years. Some methane-focused or fossil-pollution-focused wins can generate benefits faster, but 5 years is a reasonable portfolio average.

### Duration

The 80-year duration reflects that the marginal climate-mortality literature used here models harms through 2100. Since this estimate is being made in 2026 and the site caps modeled effects at 100 years, using 80 years is a good approximation to "the rest of the century."

This is conservative in the narrow time-horizon sense: CO₂ persists in the atmosphere for centuries, and some climate impacts continue beyond 2100. We use 80 years anyway because the underlying mortality literature and the site's modeling horizon both mostly stop there. ([IPCC AR6 WG1 Technical Summary](https://www.ipcc.ch/report/ar6/wg1/chapter/technical-summary/))

{{CONTRIBUTION_NOTE}}

# Internal Notes

- [Wilson et al. 2024](https://www.science.org/doi/10.1126/sciadv.adq3367) is the main reason `L` moved from 4 to 5: it shows much younger heat mortality than the older European anchor suggests.
- For future editors: [Bressler's 2024 draft abstract](https://www.sipa.columbia.edu/sites/default/files/2024-10/The-Distributional-Mortality-and-Social-Cost-of-Carbon_Bressler_JMP_Abstract.pdf) reports a higher mortality-cost-of-carbon figure and stronger concentration of deaths in Southern/Central Asia and Sub-Saharan Africa, but it is still draft/JMP material and should not be used as a public citation without checking the final paper.
- A dedicated assumption page on climate-death age structure / QALYs per climate death could justify a further update to `L` if more cross-country age-specific evidence appears.
