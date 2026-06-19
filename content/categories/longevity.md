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

{{STANDARD_QALY_METHOD_NOTE}}

We model this as an expected-value calculation: a strong donor portfolio slightly raises the chance that one modest first-generation gerotherapeutic crosses translational bottlenecks. Three cruxes drive the result: how much the portfolio shifts the probability of success ($\delta$, Assumption 9), how many people the therapy reaches early (Assumption 8), and how big the per-person health gain is (Assumption 7). All three are judgment calls, which is why the range is wide.

## Description of effect

This effect captures health gains from **translational geroscience philanthropy**: work that tries to turn aging biology into clinically useful interventions by funding biomarkers and endpoints, proof-of-concept trials, regulatory science, and other bottlenecks between lab science and real patients.

Representative fits include [AFAR's TAME work](https://www.afar.org/tame-trial), [Impetus Grants](https://impetusgrants.org/), [LEV Foundation](https://www.levf.org/), biomarker-validation efforts, and other philanthropy that helps modest first-generation gerotherapeutics become testable, approvable, and adoptable.

## What kinds of charities are we modeling?

This estimate models **strong marginal longevity philanthropy** — the best serious translational opportunities — not the average donation to something branded as anti-aging. A recipient that mainly accumulates endowment or funds very indirect basic science should score below the category default.

:::details{title="What counts as a good fit vs. a poor fit"}
**Good fits:** translational geroscience grants; trial infrastructure and patient-recruitment platforms; biomarker and endpoint validation; regulatory-science work that makes aging-related indications easier to test; highly additional seed funding for neglected intervention classes.

**Poor fits:** supplement marketing; rich-person longevity clinics; generic wellness or "biohacking"; prestige fundraising for already wealthy institutes; basic science with a very weak plausible translation path.
:::

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$10,000 (\$1,000-\$1,000,000)
- **Start time:** 10 years
- **Duration:** 50 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. Targeting aging could generate unusually large health gains because it can delay multiple age-related diseases at once rather than treating them one by one. In Goldman's delayed-aging model, life expectancy at age 51 rises by about 2.2 years and most of that gain is spent in good health; Scott et al. estimate that slowing aging enough to raise life expectancy by 1 year would be worth about \$38 trillion in the United States alone. ([Goldman et al. 2013](https://pubmed.ncbi.nlm.nih.gov/24101058/), [Scott et al. 2021](https://www.nature.com/articles/s43587-021-00080-0))
2. There is a strong biological case for geroscience as a cause area because aging is a major upstream driver of many chronic diseases, frailty, and multimorbidity. ([Campisi et al. 2019](https://www.nature.com/articles/s41586-019-1365-2))
3. Human evidence is promising but still thin. Early mTOR-inhibitor trials showed encouraging immune and infection results in older adults, but flagship programs have also had important failures, including a phase 3 RTB101 trial that did not significantly reduce clinically symptomatic respiratory illness. Senolytic evidence in humans remains early and mostly signal-seeking rather than definitive. ([Mannick et al. 2018](https://pubmed.ncbi.nlm.nih.gov/29997249/), [Justice et al. 2019](https://pubmed.ncbi.nlm.nih.gov/30616998/), [Mannick et al. 2021](https://pubmed.ncbi.nlm.nih.gov/33977284/))
4. Biomarkers, endpoints, and trial design are central bottlenecks. Geroscience still lacks broadly accepted surrogate endpoints for "slowing aging," which makes trials longer, slower, and harder to finance. This is one of the clearest places where philanthropy can matter. ([Cummings et al. 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9768060/), [Biomarkers of Aging Consortium](https://www.agingconsortium.org/))
5. Some of the highest-value translational work has weak commercial incentives. TAME is the clearest example: it is a 3,000-participant, 6-year trial built around an inexpensive generic drug and still depends on philanthropy to launch. That is exactly the kind of bottleneck where donor funding can be unusually additional. ([AFAR TAME](https://www.afar.org/tame-trial))
6. The field is no longer tiny or wholly neglected. Hevolution alone says it plans to deploy up to \$1 billion annually for healthspan science, which means marginal philanthropy should be modeled as nudging specific bottlenecks rather than single-handedly determining whether geroscience succeeds. ([Hevolution 2024](https://www.hevolution.com/en/web/guest/w/igniting-a-new-era-in-global-health-hevolution-foundation-announces))
7. A reasonable central estimate for a **first-generation successful gerotherapeutic** is about **0.5 QALYs per treated person**. We mean a modest but clinically meaningful gain: several extra healthy months, or a modest delay in multiple major morbidities. This is a judgment call, not a directly observed figure. It is also much smaller than the full delayed-aging frontier in Assumption 1.
8. If a clinically meaningful intervention is validated, about **10 million** older adults plausibly receive it over roughly the first 10-20 years of uptake. WHO projects very large older populations globally, so read 10 million as an early-adopter central case, not a claim about eventual saturation. ([WHO Ageing](https://www.who.int/news-room/fact-sheets/detail/ageing-and-health))
9. A \$50 million high-leverage philanthropic portfolio could increase the probability of validation plus meaningful diffusion by about **0.1 percentage points**. This parameter has no direct empirical anchor. Read it as a best guess, not a measured statistic. ([See detailed justification](/assumption/effect-of-top-longevity-philanthropy))

## Details

### Cost per QALY

We model the category as expected value from helping a **modest first-generation gerotherapeutic** cross key translational bottlenecks:

$$
\text{Cost per QALY} = \dfrac{C}{\delta \times N \times q}
$$

with $C$ = portfolio cost, $\delta$ = absolute increase in the probability of validation plus meaningful diffusion, $N$ = people treated in the first adoption wave, and $q$ = QALYs gained per treated person. The central inputs ($C$ = \$50M, $\delta$ = 0.1%, $N$ = 10M, $q$ = 0.5) give 5,000 expected QALYs and a point estimate of **\$10,000/QALY**.

:::details{title="Worked central calculation"}
$$
\mathbb{E}[\text{QALYs}] = 0.001 \times 10{,}000{,}000 \times 0.5 = 5{,}000
$$

$$
\text{Cost per QALY} = \dfrac{50{,}000{,}000}{5{,}000} = 10{,}000
$$
:::

This puts the cause area **above generic rich-world medical research**, because successful aging-targeting affects many diseases at once. But it stays **short of** multi-order-of-magnitude superiority over GiveWell-style benchmarks. No intervention has yet clearly slowed human aging, the best human evidence is still small or mixed, the regulatory and biomarker path is hard, and the field now has far more money than a decade ago.

:::details{title="Why each parameter takes the value it does"}
**$q$ = 0.5 QALYs per treated person** (the most judgment-heavy parameter after $\delta$). The question is not what a mature anti-aging miracle would be worth, but what a *first* clinically validated gerotherapeutic might deliver. Goldman's delayed-aging scenario gives about 2.2 extra life-years, most of it in good health (Assumption 1). A first-generation success should be much weaker, so 0.5 credits only a fraction of that frontier — roughly, modestly delaying several morbidities or extending healthy survival a bit in selected older adults. If you think first-generation effects are smaller, the category moves up; if you think a platform quickly approaches a full healthy life-year, it moves down.

**$N$ = 10 million treated people** is an early-meaningful-adoption figure, not eventual total reach. It is a small slice of the plausible older-adult population but assumes more than a niche pilot or concierge product: gradual uptake starting in richer health systems and higher-risk older adults.

**$\delta$ = 0.1 percentage points** models the marginal effect skeptically. The relevant question is not whether philanthropy can "solve aging." It is whether a very strong donor portfolio can slightly raise the probability that one clinically meaningful intervention gets validated and diffuses. TAME illustrates the upside: if a multi-year, FDA-engaged trial around a cheap generic drug still needs philanthropy to happen at all, donor dollars can be highly additional. But the field is now sizable, so assuming tens of millions of dollars shift total success probability by full percentage points would be overconfident.
:::

#### Range

Our plausible range is **\$1,000-\$1,000,000/QALY**. The sweep below pushes cost, reach, and quality to their edges but holds $\delta$ in a central **0.05–0.12%** band — narrower than its full **0.01–0.3%** plausible range. That gives about \$1,700 at best and \$120,000 at worst. We publish *much wider* than that, because the dominant uncertainty is not how the four parameters jitter independently. It is whether the mechanism works at all. A skeptical worldview moves $\delta$, $N$, and $q$ down together. The most important tail is donor money mostly substituting for capital that would have arrived anyway, geroscience biomarkers never becoming decision-useful, or first-generation interventions barely working. That tail pushes $\delta$ below the sweep's band toward its **0.01%** floor and beyond, toward zero. This correlated, structural tail lives outside the sweep, so the high-cost side has to extend far past the parameter calculation. The low end likewise allows one or two bottlenecks proving much easier than they currently look.

:::details{title="Illustrative sweep (the effect size held in a central band)"}
**Optimistic** ($C$ = \$25M, $\delta$ = 0.12%, $N$ = 15M, $q$ = 0.8):

$$
\dfrac{25{,}000{,}000}{0.0012 \times 15{,}000{,}000 \times 0.8} \approx 1{,}700
$$

**Pessimistic** ($C$ = \$75M, $\delta$ = 0.05%, $N$ = 5M, $q$ = 0.25):

$$
\dfrac{75{,}000{,}000}{0.0005 \times 5{,}000{,}000 \times 0.25} = 120{,}000
$$
:::

### Start time

The **10-year** start time reflects how slow this field still is from donation to broad health benefit.

The current evidence base is not at the point where a donation today simply buys treatment next year. The central path is more like:

1. donor funding helps biomarkers, endpoints, trial design, or proof-of-concept studies
2. one or more trials establish clinically credible benefit
3. regulators, clinicians, and health systems become willing to use the intervention
4. uptake begins in real patient populations

Anything like a 3-5 year start time would be too short. TAME itself is a **6-year** trial once running, and the field still faces pre-trial and post-trial delays. Ten years is still optimistic enough to allow for some faster translational wins, while recognizing that this is not a mature delivery category.

### Duration

The **50-year** duration reflects that, once a gerotherapeutic really works, benefits can continue across many successive cohorts of older adults.

This should be longer than an ordinary one-off medical intervention because validated aging-targeting tools could be reused across decades of clinical practice. But it should not be modeled as essentially permanent, because:

- better interventions may replace early ones
- adoption could remain uneven across countries and health systems
- some gains may come from transient first-wave technologies rather than one dominant therapy lasting forever

Fifty years is a reasonable compromise between "this matters for decades" and "do not assume indefinite persistence."

## Key uncertainties

1. **Whether first-generation gerotherapeutics really deliver meaningful health gains.** The field has plenty of biological promise and some encouraging human signals, but still no clean, widely accepted proof that a therapy meaningfully slows human aging in practice.

2. **How much biomarkers and trial infrastructure matter at the margin.** If validated biomarkers dramatically shorten and cheapen trials, philanthropy that helps create them could be extremely leveraged. If biomarker progress is slower or less useful than hoped, the category weakens a lot.

3. **How additional current marginal donations really are.** TAME-like examples suggest strong additionality is possible, but Hevolution and other funders mean this is no longer an almost-empty field.

4. **How broad uptake would be after a success.** Some interventions might stay niche, expensive, or concentrated in rich countries for a long time; others could diffuse quickly if they are generic, safe, and easy to prescribe.

5. **How well this category matches actual recipients.** Some recipients tagged to longevity will be much closer to the modeled ideal than others, so individual recipients can diverge substantially from the category default.

6. **Whether the right frame is "probability of success" or "years of acceleration."** Real philanthropy may accelerate the field rather than changing a clean binary success probability. The simple expected-value model here is still useful, but it compresses that complexity into a single tractability parameter.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on April 6th 2026 by GPT-5.4, with prompts from Impact List staff._

- The main change in this rewrite was to make the outside view much more explicit: aging-targeting has huge upside, but the central estimate should pay a serious discount for mixed human evidence, endpoint problems, and the fact that the field is now meaningfully funded.
- If future editors want to improve this further, the most useful dedicated assumption page would probably be on the tractability parameter $\delta$: how much a marginal philanthropic portfolio really changes the probability or timing of clinically meaningful geroscience success.
