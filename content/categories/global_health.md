---
id: global-health
name: 'Global Health'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 60
    costPerQALY: 105
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5, with prompts from Impact List staff._

{{STANDARD_QALY_METHOD_NOTE}}

## Description of effect

This effect captures welfare gains from donations to exceptionally cost-effective global-health charities, especially GiveWell-style programs that prevent child deaths from malaria, vitamin A deficiency, and vaccine-preventable disease. The estimate is meant to model the best currently donatable global-health opportunities, not the average global-health nonprofit. Because these programs mostly help very young children, the gains are dominated by many decades of additional life.

## What kinds of charities are we modeling?

These estimates are for **GiveWell-style child-survival philanthropy**: seasonal malaria chemoprevention, insecticide-treated bed nets, vitamin A supplementation, and vaccination incentives — not the average international health charity.

:::details{title="What we exclude"}
They are **not** estimates for:

- the average international health charity
- hospitals or clinics with broad service mixes
- health-system-strengthening organizations with diffuse impact
- biomedical R&D
- humanitarian medical relief during wars or disasters

Those causes can still be very valuable, but they are usually less tightly evidence-backed and less cost-effective than the narrow set of top child-survival opportunities modeled here. Broad global-health recipients should therefore get recipient-level overrides rather than inheriting this default.
:::

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$105 (\$30–\$180)
- **Start time:** 1 year
- **Duration:** 60 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. GiveWell's current benchmark is still approximately **0.003 units of value per dollar**. ([GiveWell cost-effectiveness analyses](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models))
2. GiveWell's current public funding bar is **6x benchmark** as of its May 2026 cost-effectiveness update. That is the cleanest public anchor for what a current marginal top-charity opportunity has to clear. ([GiveWell cost-effectiveness analyses](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models))
3. Averting the death of a young child is worth roughly **127-134 GiveWell units**; using **130** as a rounded central figure is reasonable for under-five child-survival interventions. ([GiveWell moral weights](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/moral-weights))
4. A child death averted through these programs is worth roughly **50-60 QALYs**, with **55** as a reasonable central estimate. Sub-Saharan African life expectancy at birth is about **62 years**, and WHO reports **56 healthy life-years** for the African region. Because these programs mostly avert deaths very early in life, 55 QALYs is a reasonable all-things-considered midpoint. ([World Bank](https://data.worldbank.org/indicator/SP.DYN.LE00.IN?locations=ZG), [WHO Africa](https://www.afro.who.int/news/healthy-life-expectancy-africa-rises-almost-ten-years))
5. GiveWell's current donor-facing top global-health charities are Malaria Consortium (seasonal malaria chemoprevention), Against Malaria Foundation (bed nets), Helen Keller Intl (vitamin A supplementation), and New Incentives (vaccination incentives). GiveWell says the funding it directed to these programs in 2022-2024 averaged roughly **\$3,500-\$5,500 per life saved** depending on the charity. ([GiveWell top charities](https://www.givewell.org/charities/top-charities))
6. Recent representative grant-specific CEAs span roughly **11x-25x benchmark**: AMF's June 2024 DRC grant was about **11x**, Malaria Consortium's June 2025 Chad expansion about **16x**, Helen Keller Intl's December 2024 VAS grant about **25x**, and New Incentives' December 2024 public CEA about **20x** overall. ([AMF DRC grant](https://www.givewell.org/research/grants/AMF-LLIN-DRC-June-2024), [Malaria Consortium Chad grant](https://www.givewell.org/research/grants/Malaria-Consortium-SMC-Expansion-in-Chad-June-2025), [Helen Keller Intl VAS grant](https://www.givewell.org/research/grants/Helen-Keller-Intl-Vitamin-A-Supplementation-December-2024), [New Incentives public CEA](https://docs.google.com/spreadsheets/d/1mTKQuZRyVMie-K_KUppeCq7eBbXX15Of3jV7uo3z-PM/edit?gid=1266854728))
7. Mortality reduction is the dominant benefit in these programs, but not the only one. GiveWell's models also include morbidity, treatment-cost, and later-life income effects. The funding-bar approach includes those benefits insofar as they are part of GiveWell's benchmark-relative value; the historical cost-per-life-saved approach is a mortality-dominated cross-check. We do not add a separate non-mortality uplift because it would mostly duplicate the benchmark approach and is unlikely to move the estimate outside the stated range.
8. Donations to GiveWell's Top Charities Fund are committed within **six months**, but many grants fund the next campaign or delivery year, so **1 year** is a reasonable portfolio-average start time. ([GiveWell Top Charities Fund](https://www.givewell.org/top-charities-fund), [AMF DRC grant](https://www.givewell.org/research/grants/AMF-LLIN-DRC-June-2024), [Malaria Consortium Chad grant](https://www.givewell.org/research/grants/Malaria-Consortium-SMC-Expansion-in-Chad-June-2025))
9. Benefits from deaths averted accrue over roughly the remaining lifetime of beneficiaries. Using **60 years** as the modeling window is reasonable for this under-five child-survival portfolio. ([World Bank](https://data.worldbank.org/indicator/SP.DYN.LE00.IN?locations=ZG))

## Details

### Cost per QALY

We anchor on two questions — what a current marginal GiveWell-style dollar buys, and whether that matches the historical top-charity record — and take the midpoint:

- **Marginal funding-bar estimate:** about **\$130/QALY** (GiveWell's 6x funding bar, translated through its moral weights into QALYs).
- **Historical top-charity average:** about **\$80/QALY** (GiveWell's 2022-2024 record of ~\$4,375 per life saved, at 55 QALYs per child death averted).

Taking the midpoint gives about **\$105/QALY**. Averaging beats either anchor alone: the strongest single published grant would overstate the average current opportunity, while the funding bar alone understates the fact that GiveWell's recent top-charity portfolio has averaged somewhat better than the bar. The historical average is an unweighted cross-check across the four top charities, not a claim about GiveWell-directed funding weights; the funding-bar estimate is the cleaner marginal anchor. Non-mortality benefits (reduced illness, lower treatment costs, later-life income) are inside the QALY metric here — carried by the benchmark bridge rather than added separately.

:::details{title="The two anchor calculations"}
**Approach 1 — current marginal funding-bar estimate.** GiveWell's benchmark is about **0.003 units of value per dollar** (Assumption 1) and its current funding bar is **6x** that (Assumption 2); Assumptions 3 and 4 translate the resulting units into QALYs:

$$
\text{Units per } \$ \approx 6 \times 0.003 = 0.018
$$

$$
\text{QALYs per } \$ \approx 0.018 \times \frac{55}{130} \approx 0.0076
$$

$$
\text{Cost per QALY} \approx \frac{1}{0.0076} \approx \$131
$$

**Approach 2 — historical top-charity average.** GiveWell's 2022-2024 cost per life saved was about **\$4,000** (Malaria Consortium), **\$5,500** (AMF), **\$3,500** (Helen Keller Intl), and **\$4,500** (New Incentives):

$$
\frac{4000 + 5500 + 3500 + 4500}{4} = \$4{,}375 \text{ per life saved}
$$

$$
\text{Cost per QALY} \approx \frac{\$4{,}375}{55} \approx \$80
$$
:::

**Range**

The low end is around **\$30/QALY** if a donation resembles especially strong published opportunities, such as very cost-effective VAS or vaccination opportunities near the top of GiveWell's public range, and if each child death averted corresponds to close to **60 QALYs**.

The high end is around **\$180/QALY** if marginal opportunities are closer to the funding bar, if the intervention mix tilts toward weaker countries or programs inside the top-charity set, or if each child death averted corresponds to closer to **45-50 QALYs**.

So our plausible range is **\$30-\$180/QALY**, kept wide because these models are rough; GiveWell itself emphasizes that they are used mainly for comparing grants rather than for precise cardinal measurement.

### Start time

Some benefits begin almost immediately once children receive nets, preventive malaria medicine, supplements, or vaccines. But this site's start-time field is not asking when the first pill is swallowed; it is asking when a donation reliably turns into real-world impact.

GiveWell says donations to its Top Charities Fund are committed within **six months**. But many of the underlying grants fund the next campaign or delivery year rather than an intervention that begins the next week. For example:

- AMF's **June 2024** DRC grant supported campaigns in **2025 and 2026**.
- Malaria Consortium's **June 2025** Chad grant supported SMC in **2026 and 2027**.

So **1 year** is a reasonable round portfolio-average start time: slower than assuming instant impact, but not so slow that it misses the fact that these are direct-delivery interventions rather than long-policy-lag bets.

### Duration

We use a **60-year** duration because these programs mainly avert deaths among children under 5, so the benefits last for roughly the rest of those children's lives.

The duration field measures **how long** the benefit lasts, while the cost-effectiveness calculation separately uses **55 QALYs per death averted** to account for less-than-perfect health. A 60-year window is therefore a reasonable round approximation for an under-five child-survival portfolio.

## Key uncertainties

1. **How close the next marginal donor dollar really is to GiveWell's current public 6x bar.** If the best current unfunded opportunities are materially better than the bar, the estimate is too pessimistic. If a donor funds weaker programs than GiveWell's current top set, it is too optimistic.
2. **How many QALYs a child death averted should count for.** The 55-QALY central estimate is reasonable, but different views about lifetime health, age-weighting, or life quality can move the number.
3. **How much non-mortality value is embedded in the bridge.** Reduced illness, lower caregiver treatment costs, and higher later-life income are real QALY-equivalent benefits in GiveWell's models. The practical question is whether the simple **55 / 130** conversion captures them well enough for a category-level estimate.
4. **How quickly the opportunity set changes.** Malaria burden, vaccine coverage, vitamin A deficiency prevalence, and the global funding landscape can all move the marginal estimate over time.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- The point estimate is deliberately anchored to two things: GiveWell's current marginal funding bar and GiveWell's recent public cost-per-life-saved history. Using both is clearer than relying on either one alone.
- The most important future levers are: (1) GiveWell's benchmark and funding bar, (2) the QALY conversion for an under-five death averted, and (3) whether the top-opportunity set changes materially beyond the current malaria / VAS / vaccination mix.
- For future editors: if GiveWell publishes a clearer public benchmark-to-QALY conversion or begins communicating top-charity cost-effectiveness directly in QALY-equivalent units, that could replace part of the current bridge calculation.
