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

_The following analysis was done on April 6th 2026 by GPT-5.4 and Claude Opus 4.6, with prompts from Impact List staff._

{{STANDARD_QALY_METHOD_NOTE}}

## Description of effect

This effect captures human-health benefits from donations to top climate charities that reduce greenhouse gas emissions through policy advocacy, innovation policy, market shaping, and related systems change. We measure those reductions in **tCO₂e**: metric tons of **carbon-dioxide equivalent**, a standard unit that converts different greenhouse gases such as methane into a common warming-based scale. The core estimate models avoided climate mortality from reduced emissions. It largely excludes air-pollution co-benefits and most non-fatal climate harms, so it should be read as a partial health estimate for strong mitigation philanthropy rather than a full accounting of climate damages.

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$590 (\$40–\$15,000)
- **Start time:** 5 years
- **Duration:** 80 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. Donations to high-impact climate nonprofits avert roughly 1.5 tCO₂e per \$1 in expectation, with a plausible range of roughly 0.3–7 tCO₂e/\$. Here tCO₂e means "tons of carbon-dioxide equivalent": one shared unit for warming impact across gases such as CO₂ and methane. Giving Green's current rule of thumb is ~1 tCO₂e/\$, Giving Green's detailed Evergreen model produced ~1.9 tCO₂e/\$ in its realistic case and ~2.4 tCO₂e/\$ at the median, and Founders Pledge's 2023 high-impact climate grants imply roughly 6.9 tCO₂e/\$ (derived from their reported 47.9 MtCO₂e averted on \$6.9M granted). Because climate-philanthropy results depend heavily on policy windows and tractable opportunities, we use 1.5 tCO₂e/\$ as a middle-of-the-road portfolio estimate rather than anchoring to either the roughest rule of thumb or the strongest historical year. ([Giving Green 2025](https://www.givinggreen.earth/post/eager-to-measure-the-impact-of-your-climate-donation-forget-offset-math-focus-on-systems-change), [Giving Green Evergreen CEA](https://www.givinggreen.earth/research/evergreen-collaborative-top-climate-nonprofit-evaluation), [Founders Pledge 2023 Impact](https://impact.founderspledge.com/2023/climate-change))
2. Each additional ton of CO₂ emitted today causes approximately 2.26 × 10⁻⁴ expected deaths between 2020 and 2100, i.e. one expected death per ~4,425 tons. This estimate is stated per ton of **CO₂ itself**, not per tCO₂e, which is why Assumption 4 has to explain how we translate from a mixed greenhouse-gas portfolio into this mortality estimate. ([Bressler 2021](https://www.nature.com/articles/s41467-021-24487-w), [Carleton et al. 2022](https://academic.oup.com/qje/article/137/4/2037/6571943))
3. Each climate-attributable death corresponds to roughly 5 QALYs lost on average, with a plausible range of 2–10. A European heat-mortality study that explicitly adjusts for harvesting (short-term mortality displacement, where some heat deaths occur among people who would have died within days or weeks regardless) finds about 5,907 years of life lost from ~2,234 heat deaths per year, or about 2.6 years per death, in a relatively old population. But [Wilson et al. 2024](https://www.science.org/doi/10.1126/sciadv.adq3367) find that in Mexico, people under 35 account for 75% of heat-related deaths and 87% of heat-related lost life years, suggesting that in hotter settings heat mortality can fall much more heavily on younger people than the older European evidence implies. Because Wilson's lost-life-years measure is based on remaining life expectancy rather than harvesting-adjusted QALYs, we update the central estimate only modestly to 5 rather than much higher. ([Baccini et al. 2013](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0069638), [Wilson et al. 2024](https://www.science.org/doi/10.1126/sciadv.adq3367))
4. To combine Assumptions 1 and 2, we treat avoided tCO₂e as roughly comparable to avoided tCO₂ in a simple century-scale portfolio model. That is imperfect because tCO₂e is a warming-equivalent unit across gases, while the mortality estimate in Assumption 2 is written per ton of actual CO₂. In particular, methane-heavy interventions likely produce faster temperature and ozone benefits than this model captures, so the approximation may understate some methane-focused work; CO₂-heavy portfolios fit the mortality estimate more directly. The published range explicitly leaves room for this gas-mix/unit-conversion uncertainty. ([Giving Green 2025](https://www.givinggreen.earth/post/eager-to-measure-the-impact-of-your-climate-donation-forget-offset-math-focus-on-systems-change), [IPCC AR6 WG1 Chapter 6](https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-6/))
5. It takes approximately 5 years for donations to translate into enacted policy, scaled deployment, or market shifts that meaningfully change emissions trajectories.
6. Benefits are modeled over a window of 80 years, approximately matching the site's 100-year modeling horizon and the time span of the main mortality literature, while allowing some spillover beyond 2100.

## Details

### Cost per QALY

The cleanest way to model climate-mitigation philanthropy is:

$$\text{Cost per QALY} = \dfrac{1}{E \times M \times L}$$

Where:

- $E$ = expected emissions averted per dollar, measured in tCO₂e
- $M$ = expected deaths averted per ton of CO₂
- $L$ = QALYs lost per death

Using the central assumptions above:

- $E = 1.5$ tCO₂e/\$
- $M = 2.26 \times 10^{-4}$ deaths per ton
- $L = 5$ QALYs per death

So:

$$\text{QALYs per } \$1 = 1.5 \times 2.26 \times 10^{-4} \times 5 \approx 0.001695$$

$$\text{Cost per QALY} = \dfrac{\$1}{0.001695} \approx \$590$$

So the point estimate is **\$590/QALY**.

The result swings most on $E$ (tons averted per dollar) and, secondarily, $L$ (QALYs lost per death); $M$ is comparatively well-anchored. Published estimates of $E$ vary widely — roughly 1–7 tCO₂e/\$ across the sources in Assumption 1 — which is what drives our wide plausible range of roughly **\$40-\$15,000/QALY**.

We publish a range that is *wider* than what swinging the headline parameters produces, because the largest uncertainties here sit partly outside those parameters. Pushing $E$ and $L$ to their favorable and unfavorable edges together gives only about \$60-\$7,400/QALY, but that holds $M$ (the mortality cost of carbon) fixed even though the underlying social-cost-of-carbon literature disagrees substantially, ignores the rough tCO₂e-to-CO₂ approximation of Assumption 4, and — most importantly on the expensive side — assumes the systems-change mechanism works roughly as modeled. If much of the averted emissions would have happened anyway (a weak funding counterfactual), effective $E$ falls well below 0.3 and the cost per QALY climbs past the parameter sweep, which is why the upper bound sits at \$15,000 rather than \$7,400.

:::details{title="Input sweep vs. the published range"}
Sweeping the two headline inputs to their favorable extremes together, then their unfavorable extremes together, holding $M$ at the central Bressler figure:

- **Optimistic:** 7 tCO₂e/\$ and 10 QALYs per death gives about \$60/QALY.
- **Pessimistic:** 0.3 tCO₂e/\$ and 2 QALYs per death gives about \$7,400/QALY.

For two roughly independent inputs this \$60-\$7,400 span would, on its own, be wider than the final range: hitting both extremes at once is a fairly demanding joint scenario. But we widen rather than narrow, because the uncertainties the sweep leaves out are large and asymmetric: $M$ itself is contested in the mortality literature, the gas-mix/unit approximation of Assumption 4 adds error in both directions, and a weak counterfactual could push effective tons-per-dollar far below 0.3, fattening the expensive tail. Folding those in gives a published range of about **\$40-\$15,000/QALY**.
:::

[IPCC AR6](https://www.ipcc.ch/report/ar6/wg3/chapter/chapter-3/) and [WHO 2025](https://www.who.int/publications/i/item/B09460) both emphasize that climate mitigation often creates large health gains from cleaner air, and that these gains typically arrive sooner than the avoided climate damages themselves. We mostly exclude those co-benefits from the headline number because they vary a lot by intervention mix and would be easy to overcount in a simple CO₂-based model.

### Start time

The 5-year start time reflects the lag between a donation and observable emissions reductions. Systems-change climate charities usually need time to influence policy, regulation, supply chains, or innovation pathways, after which deployment still takes a few years. Some methane-focused or fossil-pollution-focused wins can generate benefits faster, but 5 years is a reasonable portfolio average.

### Duration

The 80-year duration reflects a compromise between the mortality literature and the site's modeling horizon. The main climate-mortality studies used here focus on harms through 2100, while this estimate is being made in 2026 with a 5-year start time and the site caps modeled effects at 100 years. So an 80-year duration roughly corresponds to benefits accruing from about 2031 to 2111: somewhat beyond 2100, but still within the site's overall modeling horizon.

This duration leaves out some longer-run effects: CO₂ persists in the atmosphere for centuries, and some climate impacts continue beyond 2100. We use 80 years because the underlying mortality literature and the site's modeling horizon both mostly stop there. ([IPCC AR6 WG1 Technical Summary](https://www.ipcc.ch/report/ar6/wg1/chapter/technical-summary/))

{{CONTRIBUTION_NOTE}}

# Internal Notes

- [Wilson et al. 2024](https://www.science.org/doi/10.1126/sciadv.adq3367) is the main reason `L` moved from 4 to 5: it shows much younger heat mortality than the older European anchor suggests.
- For future editors: [Bressler's 2024 draft abstract](https://www.sipa.columbia.edu/sites/default/files/2024-10/The-Distributional-Mortality-and-Social-Cost-of-Carbon_Bressler_JMP_Abstract.pdf) reports a higher mortality-cost-of-carbon figure and stronger concentration of deaths in Southern/Central Asia and Sub-Saharan Africa, but it is still draft/JMP material and should not be used as a public citation without checking the final paper.
- A dedicated assumption page on climate-death age structure / QALYs per climate death could justify a further update to `L` if more cross-country age-specific evidence appears.
