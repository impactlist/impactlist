---
id: science-tech
name: 'Science and Tech'
effects:
  - effectId: standard
    startTime: 5
    windowLength: 25
    costPerQALY: 60_000
---

# Justification of cost per life

_The following analysis was done on April 10th 2026 by Codex GPT-5, with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from **strong marginal science and technology philanthropy in wealthy countries**: research institutes, scientific fellowships, translational labs, research tools and infrastructure, and some open-knowledge or public-interest technology work. The core mechanism is that donations help create, preserve, or accelerate useful knowledge and capabilities that later improve human welfare.

We exclude areas that are modeled separately, especially direct health delivery, climate mitigation, pandemics, AI existential risk, AI capabilities, and longevity-specific philanthropy.

## Point Estimates

- **Cost per QALY:** \$60,000 (\$20,000-\$250,000)
- **Start time:** 5 years
- **Duration:** 25 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. Historical public and charitable **medical research** in the UK appears to have earned about **7%-10% per year** in health gains plus about **15%-18% per year** in GDP spillovers, for a total around **25% per year**. ([Grant & Buxton 2018](https://bmjopen.bmj.com/content/8/9/e022131))
2. Broader R&D evidence often points to even higher gross social returns. [Bloom, Schankerman, and Van Reenen](https://www.nber.org/papers/w13060) find that technology spillovers dominate business-stealing effects and imply social returns roughly twice private returns, while [Jones & Summers 2020](https://www.nber.org/system/files/working_papers/w27863/w27863.pdf) argue that even under conservative assumptions innovation efforts produce benefits that are many multiples of their costs. We therefore use **25% per year** as a conservative category-level **gross welfare-equivalent return** once benefits start.
3. Standard project grants are often far from fully additional. [Jacob & Lefgren 2011](https://www.nber.org/system/files/working_papers/w13519/w13519.pdf) find that receiving a roughly **\$1.7 million NIH R01** raised publication output by only about **7%** over five years for marginal applicants, consistent with substantial substitution to other funding sources.
4. Flexible philanthropy can do materially better than that low-additionality ordinary-grant benchmark. [Azoulay, Graff Zivin, and Manso](https://www.nber.org/papers/w15466) find that Howard Hughes Medical Institute investigators produced high-impact papers at a much higher rate than similarly accomplished NIH-funded scientists, suggesting that unusually flexible, risk-tolerant funding can unlock more exploratory and valuable work.
5. Science philanthropy is already large and not obviously neglected. [Shekhtman, Gates, and Barabási 2024](https://www.nature.com/articles/s41598-024-58367-2) find that philanthropic support to research institutions has reached about **\$30 billion per year**, rivals major federal agencies in scale, is strongly local, and is highly stable over time. That argues against assuming marginal donor dollars are close to **100% additional**.
6. A reasonable central **additionality / marginality factor** for strong science-and-tech philanthropy is about **25%**, with a practical range around **10%-40%**.
7. A money-metric value of a QALY in high-income policy settings is about **\$100,000**. That is near the lower end of ICER's benchmark range, and it is also broadly consistent with WELLBY-style conversions for non-health benefits: the UK Green Book supplementary guidance uses about **£13,000 per WELLBY**, and Frijters and Krekel suggest roughly **6 WELLBYs per QALY**, which lands in a similar order of magnitude. ([ICER 2023 Value Assessment Framework](https://icer.org/wp-content/uploads/2023/10/ICER_2023_2026_VAF_For-Publication_110425.pdf), [HMT Green Book 2021](https://www.gov.uk/government/publications/green-book-supplementary-guidance-wellbeing), [Frijters & Krekel 2021](https://eprints.lse.ac.uk/114605/1/Frijters_PR3.pdf))
8. **First meaningful benefits** often begin after about **5 years**. This is earlier than full mature diffusion because the site's `startTime` parameter marks when benefits begin, not when they peak. Scientific software, data resources, tools, fellowships, and early translational wins can start mattering within a few years even if the full long-run value takes much longer. ([Morris, Wooding, and Grant 2011](https://journals.sagepub.com/doi/full/10.1258/jrsm.2011.110180), [Hanney et al. 2015](https://health-policy-systems.biomedcentral.com/articles/10.1186/1478-4505-13-1), [Comin & Hobijn 2010](https://www.hbs.edu/faculty/Pages/item.aspx?num=30764))
9. Once a useful discovery, tool, or platform starts helping people, a **25-year** effective benefit window is a reasonable central estimate. Many benefits persist across multiple cohorts and product cycles, but they do not last forever because technologies are superseded, institutions change, and some research lines turn out to be dead ends.

## Details

### Cost per QALY

The cleanest way to model this category is:

$$
\text{Cost per QALY} = \dfrac{v}{r \times a \times d}
$$

Where:

- $v$ = money-metric value of a QALY
- $r$ = annual gross welfare-equivalent return per donated dollar once benefits start
- $a$ = additionality / marginality factor
- $d$ = duration of the benefit window in years

Using the central assumptions:

- $v$ = \$100,000
- $r$ = 0.25
- $a$ = 0.25
- $d$ = 25

So the expected welfare-equivalent dollars created per donated dollar are:

$$
r \times a \times d = 0.25 \times 0.25 \times 25 = 1.5625
$$

And therefore:

$$
\text{Cost per QALY} = \dfrac{100{,}000}{1.5625} = 64{,}000
$$

Rounded to the nearest **\$10,000**, that gives a point estimate of **\$60,000/QALY**.

#### Why use a 25% annual gross return?

This is meant to be conservative for a category called "Science and Tech."

The strongest direct empirical anchor is the UK medical-research returns literature, which lands around **25 pence per year of value for each £1 invested** when health gains and GDP spillovers are combined (Assumption 1). Broader R&D work often points higher than that: Bloom et al. estimate social returns around **55% annually**, and Jones & Summers argue that innovation investments likely generate benefits many times larger than their costs even after several conservative adjustments (Assumption 2). GDP-based return estimates also miss some real non-market welfare from technology adoption: [Brynjolfsson, Collis, and Eggers 2019](https://www.nber.org/system/files/working_papers/w25695/w25695.pdf) find very large consumer surplus from digital goods, which is another reason to treat **25%** as a conservative gross-return assumption rather than an aggressive one.

So if we were modeling only the very best philanthropic science opportunities, a number above **25%** could easily be defended. We use **25%** anyway because this category is broader than just the very best cases. It includes some general university science, basic research, and technology work whose path to human benefit is more indirect than the best translational or mission-driven opportunities. As a rough cross-check, combining **r = 25%** with **d = 25 years** implies about **6.25** gross welfare-equivalent dollars per dollar donated before the separate additionality discount, which is in the same ballpark as the **\$5-\$13** social-return range from Jones and Summers.

#### Why only 25% additionality?

This is the main reason the estimate is not dramatically lower than **\$60,000/QALY**.

The low-additionality case is real. Jacob and Lefgren show that marginal NIH project grants can have surprisingly small measured publication effects, consistent with researchers finding substitute funding or reshuffling projects. Shekhtman et al. show that science philanthropy is already huge, locally concentrated, and correlated with existing prestige funding. Those are all reasons to avoid assuming that a random extra donor dollar is close to fully decisive.

But the low-additionality case is also too pessimistic for **strong** philanthropy. Azoulay et al. show that flexible HHMI-style support can produce much more ambitious and higher-impact work than standard NIH-style project funding. Many science philanthropists explicitly try to fund people, tools, bottlenecks, and risky early-stage work that standard funders undersupply.

So **25% additionality** is a middle ground:

- much lower than assuming donors are funding empty fields with no substitute capital
- much higher than assuming all science funding behaves like a marginal NIH R01 near the funding cutoff

This factor should also be read as covering more than simple crowd-out. The empirical anchors are net-output measures, so the **25%** implicitly absorbs project failure, scientific dead ends, overhead, and other ways dollars can fail to turn into useful downstream results.

#### Range

The stated range is a practical sensitivity range, not a full confidence interval.

**Optimistic case**

- $r$ = 0.40
- $a$ = 0.40
- $d$ = 30

This gives:

$$
\dfrac{100{,}000}{0.40 \times 0.40 \times 30} \approx 20{,}800
$$

Rounded, that is about **\$20,000/QALY**.

**Pessimistic case**

- $r$ = 0.15
- $a$ = 0.10
- $d$ = 25

This gives:

$$
\dfrac{100{,}000}{0.15 \times 0.10 \times 25} \approx 266{,}700
$$

Rounded, that is about **\$250,000/QALY**.

So the practical range is **\$20,000-\$250,000/QALY**.

This still does **not** capture the full downside tail. Unrestricted gifts to already-rich universities, endowment accumulation, or prestige science with weak paths to human benefit can be worse than **\$250,000/QALY**. Conversely, unusually catalytic science philanthropy that funds neglected bottlenecks, open infrastructure, or genuinely breakthrough translational work can be much better than **\$20,000/QALY**.

### Start Time

The **5-year** start time means the first meaningful benefits begin about five years after donation.

That should not be read as "the average project is fully translated in five years." Much of the underlying science takes longer than that, especially in biomedicine. But the site's `startTime` parameter is about **when benefits start**, not when they peak. Some categories of science-and-tech philanthropy, such as software tools, datasets, instrumentation, fellowships, or narrowly targeted translational work, can start helping within a few years. Those faster channels pull the category average earlier than a pure biomedical-translation estimate would suggest.

### Duration

The **25-year** duration reflects that successful science and technology often generates value for many years once it begins to diffuse, but not indefinitely.

This should be longer than a one-off service intervention because discoveries and tools can keep helping future cohorts. But it should not be modeled as permanent, because:

- many tools are replaced by better tools
- some discoveries prove less useful than initially hoped
- philanthropic advantages often come from accelerating things that would eventually happen anyway

Twenty-five years is a reasonable compromise between "innovation has long tails" and "do not assume every funded project reshapes civilization forever."

## What Kinds of Charities Are We Modeling?

This estimate is best read as a model of **strong marginal science-and-tech philanthropy**, not the average unrestricted gift to any university or science-branded nonprofit.

Representative fits include:

- mission-driven research institutes and translational labs
- scientific fellowships and talent programs
- research tools, datasets, and open-science infrastructure
- public-interest technology or knowledge-preservation work with broad downstream use
- early-stage or risk-tolerant funding that lets unusually strong researchers try things standard funders would not back

Poor fits include:

- generic endowment gifts to already wealthy institutions
- buildings, prestige campaigns, or capital projects with weak links to useful output
- hobbyist or speculative technology projects with little credible path to broad welfare gains
- work that mainly belongs in other categories such as AI safety, AI capabilities, climate, pandemics, or longevity

## Key Uncertainties

1. **How additional the marginal dollar really is.** This is the single most important uncertainty. If most marginal donations mainly substitute for government, university, or other foundation funding, the category is much worse than **\$60,000/QALY**. If donors really are filling neglected bottlenecks, it is much better.

2. **How representative the strongest literature is of the actual tagged recipients.** The return estimates in the literature often come from relatively successful research ecosystems. Some specific recipients in this category are likely much better or much worse than the category default.

3. **How well dollar-valued productivity gains convert into QALY-like welfare.** Using **\$100,000/QALY** is a practical policy-style bridge, but some science benefits show up as time savings, knowledge, convenience, resilience, or consumer surplus rather than standard health utility.

4. **How much to credit acceleration versus eventual discovery.** Some philanthropy causes things to happen that otherwise would not happen; some mainly makes them happen earlier. The simple additionality factor compresses that distinction into one number.

5. **How much downside risk to assign to harmful or dual-use technology.** Some scientific and technical progress creates risks as well as benefits. This category is meant to capture the net expected value of strong philanthropy outside the separately modeled risk categories, but the netting is inevitably approximate.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- The main improvement in this rewrite is conceptual rather than numerical: the estimate is now built from an explicit annual-return model, so `costPerQALY` is no longer implicitly discounting the same diffusion delays that `startTime` is meant to represent.
- A future dedicated assumption page on **science-philanthropy additionality** could be useful if more recipient-specific overrides are added in this category.
