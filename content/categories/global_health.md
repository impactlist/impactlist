---
id: global-health
name: 'Global Health'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 60
    costPerQALY: 90
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5, with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from donations to exceptionally cost-effective global-health charities, especially GiveWell-style programs that prevent child deaths from malaria, vitamin A deficiency, and vaccine-preventable disease. The estimate is meant to model the best currently donatable global-health opportunities, not the average global-health nonprofit. Because these programs mostly help very young children, the gains are dominated by many decades of additional life.

## Point Estimates

- **Cost per QALY:** \$90 (\$30–\$150)
- **Start time:** 1 year
- **Duration:** 60 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. GiveWell's current benchmark is still approximately **0.003 units of value per dollar**. ([GiveWell cost-effectiveness analyses](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models))
2. GiveWell's current public funding bar is **8x benchmark**. GiveWell's cost-effectiveness page still presents **8x** as the current bar, while noting that the threshold was last updated in **November 2025**. That is the cleanest public anchor for what a current marginal top-charity opportunity has to clear. ([GiveWell cost-effectiveness analyses](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models))
3. Averting the death of a young child is worth roughly **127-134 GiveWell units**; using **130** as a rounded central figure is reasonable for under-five child-survival interventions. ([GiveWell moral weights](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/moral-weights))
4. A child death averted through these programs is worth roughly **50-60 QALYs**, with **55** as a reasonable central estimate. Sub-Saharan African life expectancy at birth is about **62 years**, and WHO reports **56 healthy life-years** for the African region. Because these programs mostly avert deaths very early in life, 55 QALYs is a reasonable all-things-considered midpoint. ([World Bank](https://data.worldbank.org/indicator/SP.DYN.LE00.IN?locations=ZG), [WHO Africa](https://www.afro.who.int/news/healthy-life-expectancy-africa-rises-almost-ten-years))
5. GiveWell's current donor-facing top global-health charities are Malaria Consortium (seasonal malaria chemoprevention), Against Malaria Foundation (bed nets), Helen Keller Intl (vitamin A supplementation), and New Incentives (vaccination incentives). GiveWell says the funding it directed to these programs in 2022-2024 averaged roughly **\$3,500-\$5,500 per life saved** depending on the charity. ([GiveWell top charities](https://www.givewell.org/charities/top-charities))
6. Recent representative grant-specific CEAs span roughly **11x-25x benchmark**: AMF's June 2024 DRC grant was about **11x**, Malaria Consortium's June 2025 Chad expansion about **16x**, Helen Keller Intl's December 2024 VAS grant about **25x**, and New Incentives' December 2024 public CEA about **20x** overall. ([AMF DRC grant](https://www.givewell.org/research/grants/AMF-LLIN-DRC-June-2024), [Malaria Consortium Chad grant](https://www.givewell.org/research/grants/Malaria-Consortium-SMC-Expansion-in-Chad-June-2025), [Helen Keller Intl VAS grant](https://www.givewell.org/research/grants/Helen-Keller-Intl-Vitamin-A-Supplementation-December-2024), [New Incentives public CEA](https://docs.google.com/spreadsheets/d/1mTKQuZRyVMie-K_KUppeCq7eBbXX15Of3jV7uo3z-PM/edit?gid=1266854728))
7. Mortality reduction is the dominant benefit in these programs, but not the only one. GiveWell's models also include morbidity, treatment-cost, and later-life income effects, so converting cost per life saved into QALYs is a slightly conservative simplification.
8. Donations to GiveWell's Top Charities Fund are committed within **six months**, but many grants fund the next campaign or delivery year, so **1 year** is a reasonable portfolio-average start time. ([GiveWell Top Charities Fund](https://www.givewell.org/top-charities-fund), [AMF DRC grant](https://www.givewell.org/research/grants/AMF-LLIN-DRC-June-2024), [Malaria Consortium Chad grant](https://www.givewell.org/research/grants/Malaria-Consortium-SMC-Expansion-in-Chad-June-2025))
9. Benefits from deaths averted accrue over roughly the remaining lifetime of beneficiaries. Using **60 years** as the modeling window is reasonable for this under-five child-survival portfolio. ([World Bank](https://data.worldbank.org/indicator/SP.DYN.LE00.IN?locations=ZG))

## Details

### Cost per QALY

The cleanest way to estimate this category is to answer two distinct questions:

1. **What does a current marginal GiveWell-style global-health dollar probably buy?**
2. **Does that answer match the historical top-charity record we can see publicly?**

Those two anchors point to slightly different numbers, and averaging them is the cleanest way to get a cause-area estimate.

**Approach 1 — current marginal funding-bar estimate**

GiveWell's public benchmark is about **0.003 units of value per dollar** (Assumption 1), and its current public funding bar is **8x** that benchmark (Assumption 2). So a bar-clearing marginal opportunity produces:

$$
\text{Units per } \$ \approx 8 \times 0.003 = 0.024
$$

Using Assumptions 3 and 4 to translate those units into QALYs:

$$
\text{QALYs per } \$ \approx 0.024 \times \frac{55}{130} \approx 0.0102
$$

$$
\text{Cost per QALY} \approx \frac{1}{0.0102} \approx \$98
$$

So the funding-bar approach implies roughly **\$100/QALY**.

This is the cleanest anchor for the *marginal* donor dollar today, because GiveWell funds opportunities until they are near its bar rather than until they all have equal average cost-effectiveness.

**Approach 2 — historical top-charity average**

GiveWell's donor-facing top-charity page says that in 2022-2024 it directed funding at about:

- **\$4,000 per life saved** for Malaria Consortium
- **\$5,500 per life saved** for AMF
- **\$3,500 per life saved** for Helen Keller Intl
- **\$4,500 per life saved** for New Incentives

The simple average is:

$$
\frac{4000 + 5500 + 3500 + 4500}{4} = \$4{,}375 \text{ per life saved}
$$

Converting that using the central **55 QALYs per child death averted** from Assumption 4:

$$
\text{Cost per QALY} \approx \frac{\$4{,}375}{55} \approx \$80
$$

So the historical top-charity record implies roughly **\$80/QALY**.

This is a useful cross-check, but it is probably somewhat optimistic for a new marginal donor dollar because it averages over past grants, some of which were clearly better than GiveWell's current funding bar.

**Combined**

The bar-based approach gives about **\$100/QALY**. The historical-average approach gives about **\$80/QALY**. Taking the midpoint and rounding lightly gives **\$90/QALY**, which is the point estimate we use.

This is better than anchoring only on the strongest public grant or only on the current funding bar:

- Using only the strongest published grant would overstate the average current opportunity set.
- Using only the funding bar would understate the fact that GiveWell's actual top-charity portfolio has recently averaged somewhat better than that bar.

We also do **not** simply take GiveWell's full x-benchmark estimates and translate them directly into QALYs as the headline number, because those units include some non-health benefits such as reduced treatment costs or higher later-life income. For a category page whose output is framed in QALYs, translating through **cost per life saved** is easier to read and slightly more conservative.

**Range**

The low end is around **\$30/QALY** if a donation resembles especially strong published opportunities, such as very cost-effective VAS or vaccination opportunities near the top of GiveWell's public range, and if each child death averted corresponds to close to **60 QALYs**.

The high end is around **\$150/QALY** if marginal opportunities are closer to the funding bar, if the intervention mix tilts toward weaker countries or programs inside the top-charity set, or if each child death averted corresponds to closer to **45-50 QALYs**.

So the practical sensitivity range is **\$30-\$150/QALY**. This should be read as a practical range rather than a full confidence interval; GiveWell itself emphasizes that these models are rough and are used mainly for comparing grants rather than for precise cardinal measurement.

### Start Time

Some benefits begin almost immediately once children receive nets, preventive malaria medicine, supplements, or vaccines. But this site's start-time field is not asking when the first pill is swallowed; it is asking when a donation reliably turns into real-world impact.

GiveWell says donations to its Top Charities Fund are committed within **six months**. But many of the underlying grants fund the next campaign or delivery year rather than an intervention that begins the next week. For example:

- AMF's **June 2024** DRC grant supported campaigns in **2025 and 2026**.
- Malaria Consortium's **June 2025** Chad grant supported SMC in **2026 and 2027**.

So **1 year** is a reasonable round portfolio-average start time: slower than assuming instant impact, but not so slow that it misses the fact that these are direct-delivery interventions rather than long-policy-lag bets.

### Duration

We use a **60-year** duration because these programs mainly avert deaths among children under 5, so the benefits last for roughly the rest of those children's lives.

This is not the same thing as saying each death averted equals exactly **60 QALYs**. The duration field measures **how long** the benefit lasts, while the QALY estimate also adjusts for the fact that not every year is lived in perfect health. That is why the point estimate uses **55 QALYs per death averted** in the cost-effectiveness calculation but still keeps the duration at **60 years**.

Using 60 years is also not aggressive. Sub-Saharan African life expectancy at birth is already about **62 years**, and conditional life expectancy after surviving early childhood is higher than life expectancy at birth. So a 60-year modeling window is a reasonable round approximation for an under-five child-survival portfolio.

## What Kinds of Charities Are We Modeling?

These estimates are for **GiveWell-style child-survival philanthropy**: seasonal malaria chemoprevention, insecticide-treated bed nets, vitamin A supplementation, and vaccination incentives.

They are **not** estimates for:

- the average international health charity
- hospitals or clinics with broad service mixes
- health-system-strengthening organizations with diffuse impact
- biomedical R&D
- humanitarian medical relief during wars or disasters

Those causes can still be very valuable, but they are usually less tightly evidence-backed and less cost-effective than the narrow set of top child-survival opportunities modeled here.

## Key Uncertainties

1. **How close the next marginal donor dollar really is to GiveWell's current public 8x bar.** If the best current unfunded opportunities are materially better than the bar, the estimate is too pessimistic. If a donor funds weaker programs than GiveWell's current top set, it is too optimistic.
2. **How many QALYs a child death averted should count for.** The 55-QALY central estimate is reasonable, but different views about lifetime health, age-weighting, or life quality can move the number.
3. **How much non-mortality value to count.** Reduced illness, lower caregiver treatment costs, and higher later-life income are real benefits in GiveWell's models, but they do not map perfectly into a health QALY framework.
4. **How quickly the opportunity set changes.** Malaria burden, vaccine coverage, vitamin A deficiency prevalence, and the global funding landscape can all move the marginal estimate over time.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- The point estimate is deliberately anchored to two things: GiveWell's current marginal funding bar and GiveWell's recent public cost-per-life-saved history. Using both is clearer than relying on either one alone.
- The most important future levers are: (1) GiveWell's benchmark and funding bar, (2) the QALY conversion for an under-five death averted, and (3) whether the top-opportunity set changes materially beyond the current malaria / VAS / vaccination mix.
- For future editors: if GiveWell publishes a clearer public benchmark-to-QALY conversion or begins communicating top-charity cost-effectiveness directly in QALY-like units, that could replace part of the current bridge calculation.
