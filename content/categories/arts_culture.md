---
id: arts-culture
name: 'Arts, Culture, Heritage'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 10
    costPerQALY: 180_000
---

# Justification of cost per life

{{STANDARD_QALY_METHOD_NOTE}}

## Description of effect

This effect captures broad arts, culture, and heritage philanthropy: museums, libraries, opera and theater, orchestras, cultural centers, archives, art collections, arts education, community arts, cultural access programs, and heritage preservation or restoration.

These donations can create real welfare. They give people enjoyment, meaning, identity, social connection, education, and access to shared cultural goods. But most large gifts in this category support institutions, buildings, collections, endowments, or productions. Only a small share looks like the targeted participation programs with the strongest evidence.

## What kinds of charities are we modeling?

We model the average marginal donation to the broad category. That includes three kinds of giving:

- **Targeted participation and access programs:** arts-on-prescription, museum-based group activities, community choirs, dance and creative workshops, and subsidized access for people with elevated need.
- **Public cultural institutions:** museums, libraries, opera companies, theaters, orchestras, cultural centers, exhibitions, performances, public programming, and educational outreach.
- **Heritage, capital, and endowment-heavy gifts:** restoration projects, new buildings, collections, archives, monuments, institutional reserves, and prestige cultural assets.

The first bucket has the strongest causal evidence, but it is a small slice of the category default. The second and third buckets are still valuable, but their marginal effect is harder to trace: a gift may improve quality, keep admission lower, expand programming, preserve a collection, or bring a project forward rather than create a clearly new unit of wellbeing.

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$180,000 (\$40,000–\$2,000,000)
- **Start time:** 1 year
- **Duration:** 10 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. The broad category includes both highly targeted participation programs and general cultural philanthropy, including donations to operas, museums, theaters, libraries, archives, and heritage projects. The current recipient set tagged to this category includes examples such as San Francisco Opera, Lincoln Center, the New York Public Library, the Smithsonian, LACMA, MoMA, the Art Institute of Chicago, Notre-Dame reconstruction, and major arts foundations.
2. The strongest causal evidence is for structured participatory programs and targeted access programs. These include community singing, arts-on-prescription, and museum-based programs for older adults or people with elevated need. ([WHO scoping review](https://www.ncch.org.uk/uploads/WHO-Scoping-Review-Arts-and-Health.pdf), [DCMS/Frontier 2024](https://worldheritageuk.org/wp-content/uploads/2025/01/DCMS-Frontier-Economics-Health-and-Wellbeing-Report-Nov-2024.pdf), [Jensen et al. 2024](https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2024.1412306/full))
3. Targeted participation and access programs make up about **3%** of the average marginal dollar in this category, with a plausible range of **0%–15%**. We estimate these programs at about **\$15,000/QALY**, with a plausible range of **\$5,000–\$60,000/QALY**. This is based on the direct participation model: roughly \$225 per completed participant-course divided by about 0.015 QALYs gained. ([Coulton et al. 2015](https://www.cambridge.org/core/journals/the-british-journal-of-psychiatry/article/effectiveness-and-costeffectiveness-of-community-singing-on-mental-healthrelated-quality-of-life-of-older-people-randomised-controlled-trial/516558F0DDD7D4DD0197FDDEAD30ED85), [DCMS/Frontier 2024](https://worldheritageuk.org/wp-content/uploads/2025/01/DCMS-Frontier-Economics-Health-and-Wellbeing-Report-Nov-2024.pdf))
4. Public cultural institutions make up about **62%** of the average marginal dollar, with a plausible range of **45%–80%**. We estimate this bucket at about **\$200,000/QALY**, with a plausible range of **\$50,000–\$1,000,000/QALY**. This is a judgment anchor, not a direct empirical estimate. The benefits are real, but many gifts buy quality, affordability, institutional stability, or visitor experience rather than clearly new participation.
5. Heritage, capital, and endowment-heavy gifts make up about **35%** of the average marginal dollar, with a plausible range of **15%–60%**. We estimate this bucket at about **\$750,000/QALY**, with a plausible range of **\$100,000–\$5,000,000/QALY**. This is also a judgment anchor. These gifts can preserve valuable cultural assets for many people over many years, but the link from a marginal donor dollar to additional wellbeing is often indirect.
6. DCMS/Frontier's 2024 review supports the idea that general cultural engagement has wellbeing value, including attendance at museums, galleries, heritage sites, theatre, cinema, and concerts. It also notes that evidence is weaker for built historic environments, archives, digital assets, and intangible heritage, which is why the heritage/capital bucket is much less effective than targeted participation. ([DCMS/Frontier 2024](https://worldheritageuk.org/wp-content/uploads/2025/01/DCMS-Frontier-Economics-Health-and-Wellbeing-Report-Nov-2024.pdf))
7. Our central portfolio is therefore **3% targeted participation at \$15,000/QALY**, **62% public cultural institutions at \$200,000/QALY**, and **35% heritage/capital/endowment-heavy giving at \$750,000/QALY**. This gives about **\$180,000/QALY**.
8. The plausible range is **\$40,000–\$2,000,000/QALY**. The good end means a donor dollar buys unusually additional access or participation. The bad end means little or none of the money reaches targeted participation, and most of it funds capital, prestige, preservation, or higher-quality experiences for people who would otherwise get similar cultural benefits elsewhere.
9. We use a **1-year start time** because most grants affect programming, hiring, access, construction, or preservation only after a budget cycle.
10. We use a **10-year duration** because the broad category includes both short-run operating support and long-lived cultural assets. This is a timing assumption: the cost-per-QALY estimate already represents total discounted benefits from the donation, while the duration spreads those benefits over time in the model.

## Details

### Cost per QALY

The direct-participation estimate is useful, but only for one small slice of the category. A broad arts and heritage default needs to price in opera, museums, libraries, collections, buildings, restoration, and endowments.

We model the category as a portfolio:

$$
\text{QALYs per dollar} =
\frac{0.03}{\$15{,}000}
+ \frac{0.62}{\$200{,}000}
+ \frac{0.35}{\$750{,}000}
\approx 0.0000056
$$

$$
\text{Cost per QALY} =
\frac{1}{0.0000056}
\approx \$180{,}000/\text{QALY}
$$

We use **\$180,000/QALY**.

:::details{title="Why targeted participation stays much more effective than the category average"}
The direct participation evidence is the best part of the arts evidence base. Coulton's community singing RCT found an incremental gain of **0.015 QALYs over 6 months** for older adults, and DCMS/Frontier's museum-based program model is in the same broad range. If a charity spends about **\$225** to deliver a completed course, that gives:

$$
\frac{\$225}{0.015} = \$15{,}000/\text{QALY}
$$

That is not a good model for a typical opera, museum, library, restoration, or capital gift. Those gifts may still help many people, but the mechanism is less direct. A donor might subsidize existing programming, reduce ticket prices a little, improve artistic quality, preserve a building, or strengthen an institution's finances. Those are benefits, but they usually create fewer clearly attributable QALYs per dollar than a targeted program for lonely older adults or people with low baseline wellbeing.
:::

:::details{title="Why we use $200,000/QALY for public cultural institutions"}
The public-institution bucket covers museums, libraries, operas, theaters, orchestras, exhibitions, public programming, and similar organizations. We expect real welfare gains from enjoyment, meaning, learning, identity, and social connection.

The harder question is marginality. Many visitors or audience members would have attended anyway, paid more, gone to another cultural activity, or received similar benefits from an institution's existing public, earned, or philanthropic funding. A broad gift often improves the quality or stability of an institution rather than creating a clean new participant-course.

A rough way to read **\$200,000/QALY** is: each \$1 creates about 0.000005 QALYs, or about 2.6 quality-adjusted minutes. That can happen through many small experiences across many people: better performances, cheaper access, longer opening hours, educational programs, or keeping a public collection available.

This is not pinned down by a direct cost-effectiveness study. DCMS/Frontier supports the direction of the claim: broad cultural engagement has wellbeing value, but evidence is weaker and less intervention-like than the targeted participation evidence. We use a wide **\$50,000–\$1,000,000/QALY** plausible range because the same label covers free public libraries and museums on one end, and donor-supported elite cultural production on the other.
:::

:::details{title="Why we use $750,000/QALY for heritage, capital, and endowment-heavy gifts"}
The heritage/capital bucket covers restoration, new buildings, collections, archives, monuments, institutional reserves, and prestige assets. These gifts can have long-lived value: people may visit the asset, learn from it, feel pride or connection, or value the fact that it exists.

But this is the weakest part of the model. The donation may change timing or quality rather than whether the asset exists. Benefits are often spread thinly across many people, some projects mainly shift cultural spending from one venue to another, and the evidence is weaker for built historic environments, archives, and intangible heritage than for direct participation or regular cultural engagement.

We use **\$750,000/QALY** centrally, with a wide **\$100,000–\$5,000,000/QALY** plausible range. The good end covers genuinely additional preservation of a widely used asset. The bad end covers gifts that mostly buy naming, prestige, aesthetic quality, or financial slack for an institution that would have survived anyway.
:::

:::details{title="Range checks for the $40,000–$2,000,000 interval"}
The published plausible range is wider and more lopsided than a simple central calculation because the main uncertainty is whether the marginal dollar reaches targeted participation at all.

A favorable mix might be **15% targeted participation at \$10,000/QALY**, **70% public cultural institutions at \$75,000/QALY**, and **15% heritage/capital at \$250,000/QALY**:

$$
\frac{1}{\frac{0.15}{\$10{,}000} + \frac{0.70}{\$75{,}000} + \frac{0.15}{\$250{,}000}}
\approx \$40{,}000/\text{QALY}
$$

That is why the low end is around **\$40,000/QALY** rather than \$15,000/QALY: even a favorable broad-category donor mix is not usually all targeted participation.

A weak mix might have **0% targeted participation**, **40% public cultural institutions at \$1,000,000/QALY**, and **60% heritage/capital at \$5,000,000/QALY**:

$$
\frac{1}{\frac{0.40}{\$1{,}000{,}000} + \frac{0.60}{\$5{,}000{,}000}}
\approx \$1{,}900{,}000/\text{QALY}
$$

That supports a high end around **\$2,000,000/QALY**. The tail is large because many real recipients in this category are pure public-institution or heritage gifts. For those, the cheap targeted-participation bucket may not apply at all.
:::

### Start time

The 1-year start time reflects grant cycles, season planning, hiring, program design, capital planning, and restoration timelines. Some operating grants affect programming faster, while construction or preservation gifts can take several years to matter.

### Duration

The 10-year duration is a rough average over a mixed category. Direct programs mostly benefit participants within a year, while museums, libraries, archives, opera houses, buildings, and restored heritage assets can keep producing benefits for a long time. We do not use a very long duration because many gifts fund operating budgets, and even capital gifts often bring forward or improve projects rather than creating all future benefits from scratch.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was updated on June 19th 2026 by GPT-5, with prompts from Impact List staff._

- This file previously modeled only targeted participation and used \$15,000/QALY. That remains as the targeted-participation bucket, but the category scope is now broader and includes opera, museums, libraries, heritage, capital, and endowment-heavy gifts.
- The most load-bearing assumption is the targeted-participation share, because that cheap bucket contributes a large share of QALYs even when it receives little money. The \$200,000/QALY public-institution bucket is the next most important judgment anchor. If future donor coverage shows that category dollars are mostly direct participation, this estimate should move much better. If dollars are mostly capital/endowment/preservation for already-stable institutions, it should move worse.
- The recipient set currently tagged to this category looks broad enough that a direct-participation-only default would overstate the category.
