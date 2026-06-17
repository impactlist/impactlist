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

_The following analysis was done on April 10th 2026 by GPT-5, with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from **strong marginal science and technology philanthropy in wealthy countries**: research institutes, scientific fellowships, translational labs, research tools and infrastructure, and some open-knowledge or public-interest technology work. The core mechanism is that donations help create, preserve, or accelerate useful knowledge and capabilities that later improve human welfare.

We exclude areas that are modeled separately, especially direct health delivery, climate mitigation, pandemics, AI existential risk, AI capabilities, and longevity-specific philanthropy.

We estimate **\$60,000/QALY**. The driver is a simple present-value model: a donated dollar to strong science-and-tech philanthropy creates about **6.25 gross welfare-equivalent dollars** over its useful life, but only about **25%** of that value is truly additional at the margin. That produces about **1.5625 additional welfare-equivalent dollars** per donated dollar, which at a money-metric value of \$100,000 per QALY works out to roughly \$60,000/QALY. The two cruxes are **how additional the marginal dollar really is** and **how well dollar-valued productivity gains convert into QALY-equivalent welfare**; the range is kept wide because both are rough.

## What kinds of charities are we modeling?

This estimate is best read as a model of **strong marginal science-and-tech philanthropy** — mission-driven research institutes, fellowships, tools and open-science infrastructure, and risk-tolerant funding for strong researchers — not the average unrestricted gift to any university or science-branded nonprofit.

:::details{title="Representative good and poor fits"}
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
:::

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$60,000 (\$25,000-\$300,000)
- **Start time:** 5 years
- **Duration:** 25 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. Historical public and charitable **medical research** in the UK appears to have earned about **7%-10% per year** in health gains plus about **15%-18% per year** in GDP spillovers, for a total around **25% per year**. ([Grant & Buxton 2018](https://bmjopen.bmj.com/content/8/9/e022131))
2. Broader R&D evidence often points to even higher gross social returns. [Bloom, Schankerman, and Van Reenen](https://www.nber.org/papers/w13060) find that technology spillovers dominate business-stealing effects and imply social returns roughly twice private returns, while [Jones & Summers 2020](https://www.nber.org/system/files/working_papers/w27863/w27863.pdf) argue that even after several downside adjustments innovation efforts produce benefits that are many multiples of their costs. We therefore use a **6.25x total present-value gross welfare return per donated dollar** as the central category-level estimate, with a plausible range of roughly **2.25x-16x**. This is calibrated from the annual-return literature but should not be read as literally paying a fresh 25% return every year independent of the duration assumption.
3. Standard project grants are often far from fully additional. [Jacob & Lefgren 2011](https://www.nber.org/system/files/working_papers/w13519/w13519.pdf) find that receiving a roughly **\$1.7 million NIH R01** raised publication output by only about **7%** over five years for marginal applicants, consistent with substantial substitution to other funding sources.
4. Flexible philanthropy can do materially better than that low-additionality ordinary-grant benchmark. [Azoulay, Graff Zivin, and Manso](https://www.nber.org/papers/w15466) find that Howard Hughes Medical Institute investigators produced high-impact papers at a much higher rate than similarly accomplished NIH-funded scientists, suggesting that unusually flexible, risk-tolerant funding can unlock more exploratory and valuable work.
5. Science philanthropy is already large and not obviously neglected. [Shekhtman, Gates, and Barabási 2024](https://www.nature.com/articles/s41598-024-58367-2) find that philanthropic support to research institutions has reached about **\$30 billion per year**, rivals major federal agencies in scale, is strongly local, and is highly stable over time. That argues against assuming marginal donor dollars are close to **100% additional**.
6. A reasonable central **additionality / marginality factor** for strong science-and-tech philanthropy is about **25%**, with a plausible range around **10%-40%**.
7. A money-metric value of a QALY in high-income policy settings is about **\$100,000**. That is near the lower end of ICER's benchmark range, and it is also broadly consistent with WELLBY-style conversions for non-health benefits: the UK Green Book supplementary guidance uses about **£13,000 per WELLBY**, and Frijters and Krekel suggest roughly **6 WELLBYs per QALY**, which lands in a similar order of magnitude. ([ICER 2023 Value Assessment Framework](https://icer.org/wp-content/uploads/2023/10/ICER_2023_2026_VAF_For-Publication_110425.pdf), [HMT Green Book 2021](https://www.gov.uk/government/publications/green-book-supplementary-guidance-wellbeing), [Frijters & Krekel 2021](https://eprints.lse.ac.uk/114605/1/Frijters_PR3.pdf))
8. **First meaningful benefits** often begin after about **5 years**. This is earlier than full mature diffusion because the site's `startTime` parameter marks when benefits begin, not when they peak. Scientific software, data resources, tools, fellowships, and early translational wins can start mattering within a few years even if the full long-run value takes much longer. ([Morris, Wooding, and Grant 2011](https://journals.sagepub.com/doi/full/10.1258/jrsm.2011.110180), [Hanney et al. 2015](https://health-policy-systems.biomedcentral.com/articles/10.1186/1478-4505-13-1), [Comin & Hobijn 2010](https://www.hbs.edu/faculty/Pages/item.aspx?num=30764))
9. Once a useful discovery, tool, or platform starts helping people, a **25-year** effective benefit window is a reasonable central estimate, with a plausible range of about **15-40 years**. Many benefits persist across multiple cohorts and product cycles, but they do not last forever because technologies are superseded, institutions change, and some research lines turn out to be dead ends.

## Details

### Cost per QALY

We model the category as the money-metric value of a QALY divided by the additional present-value welfare-equivalent dollars a donated dollar creates:

$$
\text{Cost per QALY} = \dfrac{v}{G \times a}
$$

where $v$ is the money-metric value of a QALY, $G$ is the total present-value gross welfare return per donated dollar over the benefit window, and $a$ is the additionality / marginality factor. The central assumptions ($v$ = \$100,000, $G$ = 6.25, $a$ = 0.25) give about 1.5625 additional welfare-equivalent dollars per donated dollar and a cost of \$64,000/QALY, which we round to **\$60,000/QALY**.

:::details{title="Worked calculation"}
The expected welfare-equivalent dollars created per donated dollar are:

$$
G \times a = 6.25 \times 0.25 = 1.5625
$$

And therefore:

$$
\text{Cost per QALY} = \dfrac{100{,}000}{1.5625} = 64{,}000
$$

Rounded to the nearest **\$10,000**, that gives a point estimate of **\$60,000/QALY**.
:::

#### Why use a 6.25x gross present-value return?

This is meant to be a category-level central return, not a best-case science return: the strongest direct anchor (UK medical research) reports annualized social returns around 25% combining health gains and GDP spillovers (Assumption 1), and broader R&D work points higher. We use that literature to calibrate a **total present-value return** of about **6.25x** over the modeled benefit window, rather than treating the annualized return as a separate payment stream that can be multiplied without limit.

:::details{title="Anchors, and why we stay at 25% for a broad category"}
The strongest direct empirical anchor is the UK medical-research returns literature, which lands around **25 pence per year of value for each £1 invested** when health gains and GDP spillovers are combined (Assumption 1). Broader R&D work often points higher than that: Bloom et al. find that technology spillovers dominate business-stealing effects and imply social returns roughly twice private returns, while Jones & Summers argue that innovation investments likely generate benefits many times larger than their costs even after several downside adjustments (Assumption 2). GDP-based return estimates also miss some real non-market welfare from technology adoption: [Brynjolfsson, Collis, and Eggers 2019](https://www.nber.org/system/files/working_papers/w25695/w25695.pdf) find very large consumer surplus from digital goods, which is another reason to treat **25%** as a reasonable category-level gross-return assumption rather than a best-case number.

So if we were modeling only the very best philanthropic science opportunities, a number above **6.25x** could easily be defended. We use **6.25x** anyway because this category is broader than just the very best cases. It includes some general university science, basic research, and technology work whose path to human benefit is more indirect than the best translational or mission-driven opportunities. As a rough cross-check, **6.25** gross welfare-equivalent dollars per dollar donated before the separate additionality discount is in the same ballpark as the **\$5-\$13** social-return range from Jones and Summers.
:::

#### Why only 25% additionality?

This is the main reason the estimate is not dramatically lower than **\$60,000/QALY**. It is a middle ground: much lower than assuming donors fund empty fields with no substitute capital, but much higher than assuming all science funding behaves like a marginal NIH R01 near the funding cutoff. The factor also absorbs more than simple crowd-out — because the empirical anchors are net-output measures, the **25%** implicitly covers project failure, scientific dead ends, overhead, and other ways dollars fail to turn into useful downstream results.

:::details{title="The low- and high-additionality evidence"}
The low-additionality case is real. Jacob and Lefgren show that marginal NIH project grants can have surprisingly small measured publication effects, consistent with researchers finding substitute funding or reshuffling projects. Shekhtman et al. show that science philanthropy is already huge, locally concentrated, and correlated with existing prestige funding. Those are all reasons to avoid assuming that a random extra donor dollar is close to fully decisive.

But the low-additionality case is also too pessimistic for **strong** philanthropy. Azoulay et al. show that flexible HHMI-style support can produce much more ambitious and higher-impact work than standard NIH-style project funding. Many science philanthropists explicitly try to fund people, tools, bottlenecks, and risky early-stage work that standard funders undersupply.
:::

#### Range

The plausible range is **\$25,000-\$300,000/QALY**. The width reflects two multiplicative drivers — total gross return $G$ (2.25x-16x) and additionality $a$ (0.10-0.40) — plus model uncertainty the parameter sweep leaves out: the \$100,000/QALY conversion, dual-use downside risk, and how much of the credited value is genuine additionality rather than acceleration.

Pushing both parameters to their favorable extremes together (and likewise to their unfavorable extremes) gives an all-extremes figure of about **\$16,000-\$440,000/QALY**. We publish inside that span but still very wide — about **\$25,000-\$300,000** — because the parameters are positively correlated (an optimistic read of science philanthropy tends to lift both return and additionality) and because the listed parameters do not capture all the model uncertainty. The upper bound is pushed especially high because unrestricted gifts to already-rich universities, endowment accumulation, or prestige science with weak paths to human benefit populate a real upper tail; the lower bound stays well above the most favorable corner because the best case requires both return and additionality near their best at once.

:::details{title="Every parameter pushed to its edge at once"}
**Optimistic corner** (all favorable: $G = 16$, $a = 0.40$):

$$
\dfrac{100{,}000}{16 \times 0.40} \approx 15{,}600
$$

**Pessimistic corner** (all unfavorable: $G = 2.25$, $a = 0.10$):

$$
\dfrac{100{,}000}{2.25 \times 0.10} \approx 444{,}400
$$

These two extremes bracket about \$16,000-\$440,000/QALY. The published range is narrower than this corner, but it stays wide because the inputs are positively correlated and the sweep omits the conversion and dual-use uncertainties.
:::

### Start time

The **5-year** start time means the first meaningful benefits begin about five years after donation.

That should not be read as "the average project is fully translated in five years." Much of the underlying science takes longer than that, especially in biomedicine. But the site's `startTime` parameter is about **when benefits start**, not when they peak. Some categories of science-and-tech philanthropy, such as software tools, datasets, instrumentation, fellowships, or narrowly targeted translational work, can start helping within a few years. Those faster channels pull the category average earlier than a pure biomedical-translation estimate would suggest.

### Duration

The **25-year** duration reflects that successful science and technology often generates value for many years once it begins to diffuse, but not indefinitely.

This should be longer than a one-off service intervention because discoveries and tools can keep helping future cohorts. But it should not be modeled as permanent, because:

- many tools are replaced by better tools
- some discoveries prove less useful than initially hoped
- philanthropic advantages often come from accelerating things that would eventually happen anyway

Twenty-five years is a reasonable compromise between "innovation has long tails" and "do not assume every funded project reshapes civilization forever."

## Key uncertainties

1. **How additional the marginal dollar really is.** This is the single most important uncertainty. If most marginal donations mainly substitute for government, university, or other foundation funding, the category is much worse than **\$60,000/QALY**. If donors really are filling neglected bottlenecks, it is much better.

2. **How representative the strongest literature is of the actual tagged recipients.** The return estimates in the literature often come from relatively successful research ecosystems. Some specific recipients in this category are likely much better or much worse than the category default.

3. **How well dollar-valued productivity gains convert into QALY-equivalent welfare.** Using **\$100,000/QALY** is a practical policy-style bridge. Some science benefits show up as time savings, knowledge, convenience, resilience, or consumer surplus, so the hard part is pricing those channels well enough before converting them into QALYs.

4. **How much to credit acceleration versus eventual discovery.** Some philanthropy causes things to happen that otherwise would not happen; some mainly makes them happen earlier. The simple additionality factor compresses that distinction into one number.

5. **How much downside risk to assign to harmful or dual-use technology.** Some scientific and technical progress creates risks as well as benefits. This category is meant to capture the net expected value of strong philanthropy outside the separately modeled risk categories, but the netting is inevitably approximate.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- The main conceptual constraint is to keep the return model separate from diffusion timing, so `costPerQALY` does not implicitly discount the same delays that `startTime` is meant to represent.
- A future dedicated assumption page on **science-philanthropy additionality** could be useful if more recipient-specific overrides are added in this category.
