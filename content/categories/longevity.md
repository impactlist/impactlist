---
id: longevity
name: 'Longevity'
effects:
  - effectId: standard
    startTime: 10
    windowLength: 50
    costPerQALY: 10_000
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures health gains from **translational geroscience philanthropy**: work that tries to turn aging biology into clinically useful interventions by funding biomarkers and endpoints, proof-of-concept trials, regulatory science, and other bottlenecks between lab science and real patients.

Representative fits include [AFAR's TAME work](https://www.afar.org/tame-trial), [Impetus Grants](https://impetusgrants.org/), [LEV Foundation](https://www.levf.org/), biomarker-validation efforts, and other philanthropy that helps modest first-generation gerotherapeutics become testable, approvable, and adoptable.

We do **not** model supplements, concierge longevity medicine, generic wellness advice, or very open-ended basic biology with no plausible medium-term path to human benefit.

## Point Estimates

- **Cost per QALY:** \$10,000 (\$2,000-\$100,000)
- **Start time:** 10 years
- **Duration:** 50 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. Targeting aging could generate unusually large health gains because it can delay multiple age-related diseases at once rather than treating them one by one. In Goldman's delayed-aging model, life expectancy at age 51 rises by about 2.2 years and most of that gain is spent in good health; Scott et al. estimate that slowing aging enough to raise life expectancy by 1 year would be worth about \$38 trillion in the United States alone. ([Goldman et al. 2013](https://pubmed.ncbi.nlm.nih.gov/24101058/), [Scott et al. 2021](https://www.nature.com/articles/s43587-021-00080-0))
2. There is a strong biological case for geroscience as a cause area because aging is a major upstream driver of many chronic diseases, frailty, and multimorbidity. ([Campisi et al. 2019](https://www.nature.com/articles/s41586-019-1365-2))
3. Human evidence is promising but still thin. Early mTOR-inhibitor trials showed encouraging immune and infection results in older adults, but flagship programs have also had important failures, including a phase 3 RTB101 trial that did not significantly reduce clinically symptomatic respiratory illness. Senolytic evidence in humans remains early and mostly signal-seeking rather than definitive. ([Mannick et al. 2018](https://pubmed.ncbi.nlm.nih.gov/29997249/), [Justice et al. 2019](https://pubmed.ncbi.nlm.nih.gov/30616998/), [Mannick et al. 2021](https://pubmed.ncbi.nlm.nih.gov/33977284/))
4. Biomarkers, endpoints, and trial design are central bottlenecks. Geroscience still lacks broadly accepted surrogate endpoints for "slowing aging," which makes trials longer, slower, and harder to finance. This is one of the clearest places where philanthropy can matter. ([Cummings et al. 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9632660/), [Biomarkers of Aging Consortium](https://www.agingconsortium.org/))
5. Some of the highest-value translational work has weak commercial incentives. TAME is the clearest example: it is a 3,000-participant, 6-year trial built around an inexpensive generic drug and still depends on philanthropy to launch. That is exactly the kind of bottleneck where donor funding can be unusually additional. ([AFAR TAME](https://www.afar.org/tame-trial))
6. The field is no longer tiny or wholly neglected. Hevolution alone says it plans to deploy up to \$1 billion annually for healthspan science, which means marginal philanthropy should be modeled as nudging specific bottlenecks rather than single-handedly determining whether geroscience succeeds. ([Hevolution 2024](https://www.hevolution.com/en/web/guest/w/igniting-a-new-era-in-global-health-hevolution-foundation-announces))
7. A reasonable central estimate for a **first-generation successful gerotherapeutic** is about **0.5 QALYs per treated person**. This is a judgment call rather than a directly observed empirical estimate, and it is meant to represent a modest but clinically meaningful gain, such as several extra healthy months or a modest delay in multiple major morbidities. It is also much smaller than the full delayed-aging frontier in Assumption 1.
8. If a clinically meaningful intervention is validated, it is plausible that about **10 million** older adults receive it over roughly the first 10-20 years of meaningful uptake. WHO projects very large older populations globally, so 10 million is a conservative early-adopter figure rather than a claim about eventual saturation. ([WHO Ageing](https://www.who.int/news-room/fact-sheets/detail/ageing-and-health))
9. A \$50 million high-leverage philanthropic portfolio could increase the probability of validation plus meaningful diffusion by about **0.1 percentage points**. This is a judgment-heavy parameter with no direct empirical anchor, so it should be read as a best-guess estimate rather than a measured statistic. ([See detailed justification](/assumption/effect-of-top-longevity-philanthropy))

## Details

### Cost per QALY

The cleanest way to model this category is as expected value from helping a **modest first-generation gerotherapeutic** cross key translational bottlenecks:

$$
\text{Cost per QALY} = \dfrac{C}{\delta \times N \times q}
$$

Where:

- $C$ = cost of a high-leverage philanthropic portfolio
- $\delta$ = absolute increase in the probability of validation plus meaningful diffusion
- $N$ = number of treated people in the first meaningful adoption wave
- $q$ = QALYs gained per treated person

Using the central assumptions:

- $C$ = \$50,000,000
- $\delta$ = 0.1% = 0.001
- $N$ = 10,000,000
- $q$ = 0.5

So:

$$
\mathbb{E}[\text{QALYs}] = 0.001 \times 10{,}000{,}000 \times 0.5 = 5{,}000
$$

$$
\text{Cost per QALY} = \dfrac{50{,}000{,}000}{5{,}000} = 10{,}000
$$

So the point estimate is **\$10,000/QALY**.

#### Why this is not much lower

The upside of geroscience is enormous, but several things stop this estimate from falling into "obviously better than GiveWell by orders of magnitude" territory:

- no intervention has yet clearly shown that it slows human aging in the strong sense people usually mean
- some of the most encouraging human evidence is still small, preliminary, or mixed
- the regulatory and biomarker path is genuinely hard
- the field now has far more money than it did a decade ago, so generic marginal dollars are less neglected

That combination suggests a cause area that is probably **better than generic rich-world medical research**, because successful aging-targeting affects many diseases at once, but **not** one where we should casually assume multi-order-of-magnitude superiority.

#### Why 0.5 QALYs per treated person?

This is the most judgment-heavy parameter after $\delta$.

The right way to think about it is not "how much would a fully mature anti-aging miracle be worth?" It is "what might a first clinically validated gerotherapeutic actually deliver?"

Goldman's delayed-aging scenario gives about **2.2 extra life-years** with most of the gain in good health (Assumption 1). A first-generation success should be much weaker than that. A central estimate of **0.5 QALYs per treated person** therefore means we are crediting only a fraction of the full delayed-aging upside.

That seems roughly right for interventions that might modestly delay multiple morbidities, reduce frailty, or extend healthy survival a bit in selected older adults. If readers think first-generation gerotherapeutics will be much weaker than that, this category should move upward; if they think a successful platform will quickly yield benefits closer to a full healthy life-year, it should move downward.

#### Why 10 million treated people?

This is meant to be an **early meaningful adoption** figure, not an estimate of eventual total reach. Ten million treated people is only a small slice of the plausible older-adult population, but it already assumes something more than a niche pilot or concierge product. The intended picture is gradual uptake starting in richer health systems and higher-risk older adults before any broader diffusion.

#### Why only a 0.1 percentage-point probability increase?

Because the marginal effect should be modeled skeptically. In a field with such large theoretical upside, it is easy to overestimate tractability. A better model is:

- philanthropy can be pivotal for some bottlenecks
- but the field is scientifically hard
- the human evidence is not yet decisive
- and large funders now exist

So the relevant question is not whether philanthropy can "solve aging." It is whether a very strong donor portfolio can slightly increase the probability that one clinically meaningful intervention gets validated and diffuses. A **0.1 percentage-point** absolute increase is small enough to respect those difficulties, but not so small that it ignores obvious cases where donations really can move a program.

TAME is the clearest illustration. If a multi-year, FDA-engaged trial around a cheap generic drug still needs philanthropy to happen at all, then donor dollars can sometimes be highly additional. But given the field's current size, it would be overconfident to assume that tens of millions of dollars shift the total probability of success by full percentage points.

#### Range

The stated range is a practical sensitivity range, not a full uncertainty interval.

**Optimistic case**

- $C$ = \$25 million
- $\delta$ = 0.12%
- $N$ = 15 million
- $q$ = 0.8

This gives:

$$
\dfrac{25{,}000{,}000}{0.0012 \times 15{,}000{,}000 \times 0.8} \approx 1{,}700
$$

Rounded, that is about **\$2,000/QALY**.

**Pessimistic case**

- $C$ = \$75 million
- $\delta$ = 0.05%
- $N$ = 5 million
- $q$ = 0.25

This gives:

$$
\dfrac{75{,}000{,}000}{0.0005 \times 5{,}000{,}000 \times 0.25} = 120{,}000
$$

So the practical range is **\$2,000-\$100,000/QALY**.

That still does **not** capture the full downside tail. If geroscience biomarkers never become decision-useful, if first-generation interventions barely work, or if donor money mostly substitutes for funding that would have happened anyway, the true value could be worse than \$100,000/QALY. Conversely, if one or two bottlenecks prove much easier than they currently look, the true value could be much better than \$2,000/QALY.

### Start Time

The **10-year** start time reflects how slow this field still is from donation to broad health benefit.

The current evidence base is not at the point where a donation today simply buys treatment next year. The central path is more like:

1. donor funding helps biomarkers, endpoints, trial design, or proof-of-concept studies
2. one or more trials establish clinically credible benefit
3. regulators, clinicians, and health systems become willing to use the intervention
4. uptake begins in real patient populations

Because TAME itself is a **6-year** trial once running, and because the field still faces pre-trial and post-trial delays, anything like a 3-5 year start time would be too short. Ten years is still optimistic enough to allow for some faster translational wins, while recognizing that this is not a mature delivery category.

### Duration

The **50-year** duration reflects that, once a gerotherapeutic really works, benefits can continue across many successive cohorts of older adults.

This should be longer than an ordinary one-off medical intervention because validated aging-targeting tools could be reused across decades of clinical practice. But it should not be modeled as essentially permanent, because:

- better interventions may replace early ones
- adoption could remain uneven across countries and health systems
- some gains may come from transient first-wave technologies rather than one dominant therapy lasting forever

Fifty years is a reasonable compromise between "this matters for decades" and "do not assume indefinite persistence."

## What Kinds of Charities Are We Modeling?

This estimate is meant to model **strong marginal longevity philanthropy**, not the average donation to anything branded as anti-aging.

Representative fits include:

- translational geroscience grants
- trial infrastructure and patient-recruitment platforms
- biomarker and endpoint validation
- regulatory-science work that makes aging-related indications easier to test
- highly additional seed funding for neglected intervention classes

Poor fits include:

- supplement marketing
- rich-person longevity clinics
- generic wellness or "biohacking"
- prestige fundraising for already wealthy institutes
- basic science with very weak plausible translation path

So this category should be read as the estimate for the **best serious translational opportunities**, not for the average thing a donor might find under the word "longevity."

## Key Uncertainties

1. **Whether first-generation gerotherapeutics really deliver meaningful health gains.** The field has plenty of biological promise and some encouraging human signals, but still no clean, widely accepted proof that a therapy meaningfully slows human aging in practice.

2. **How much biomarkers and trial infrastructure matter at the margin.** If validated biomarkers dramatically shorten and cheapen trials, philanthropy that helps create them could be extremely leveraged. If biomarker progress is slower or less useful than hoped, the category weakens a lot.

3. **How additional current marginal donations really are.** TAME-like examples suggest strong additionality is possible, but Hevolution and other funders mean this is no longer an almost-empty field.

4. **How broad uptake would be after a success.** Some interventions might stay niche, expensive, or concentrated in rich countries for a long time; others could diffuse quickly if they are generic, safe, and easy to prescribe.

5. **How well this category matches actual recipients.** Some recipients tagged to longevity will be much closer to the modeled ideal than others. A recipient that mainly accumulates endowment or funds very indirect basic science should score below the category default.

6. **Whether the right frame is "probability of success" or "years of acceleration."** Real philanthropy may accelerate the field rather than changing a clean binary success probability. The simple expected-value model here is still useful, but it compresses that complexity into a single tractability parameter.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- The main change in this rewrite was to make the outside view much more explicit: aging-targeting has huge upside, but the central estimate should pay a serious discount for mixed human evidence, endpoint problems, and the fact that the field is now meaningfully funded.
- If future editors want to improve this further, the most useful dedicated assumption page would probably be on the tractability parameter $\delta$: how much a marginal philanthropic portfolio really changes the probability or timing of clinically meaningful geroscience success.
