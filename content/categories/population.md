---
id: population
name: 'Population'
effects:
  - effectId: standard
    startTime: 2
    windowLength: 80
    costPerQALY: 600
---

# Justification of cost per life

_The following analysis was done on April 10th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures welfare gains from charities that increase the number of wanted births in rich countries through noncoercive means, such as family-policy research and advocacy, fertility-care access, and related policy work. Most of the value comes from the added person's own lifetime wellbeing. Smaller but still real benefits likely also accrue to parents who achieve their desired family size, and there are probably some positive broader spillovers from additional people in aging rich societies. The estimate therefore treats the added person's own life as the main driver while also including a modest explicit allowance for secondary effects.

## Point Estimates

- **Cost per QALY:** \$600 (\$240-\$2,000)
- **Start time:** 2 years
- **Duration:** 80 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

### 1. The relevant interventions are ones that increase completed fertility, not just birth timing

The strongest versions of this category are not generic "pro-population" advocacy. They are interventions that plausibly cause more people to have children they already want but are not having because of cost, infertility, work-family tradeoffs, or similar barriers.

This is a live problem in much of the rich world. OECD data shows total fertility around 1.5 across the OECD in 2022, with every OECD country except Israel below replacement fertility. That does not by itself prove that pronatalist philanthropy is effective, but it does show there is a large margin on which interventions could matter. A good population charity is trying to close the gap between desired and realized fertility, not to pressure people into unwanted births. ([OECD 2024](https://www.oecd.org/en/publications/society-at-a-glance-2024_918d8db3-en/full-report/fertility-trends-across-the-oecd-underlying-drivers-and-the-role-for-policy_770679b8.html))

### 2. There is credible evidence that policy and financial support can increase births

A useful anchor comes from direct pronatal policy evidence. The Quebec baby bonus studied by Milligan increased births substantially, and the implied cost per additional birth was roughly **C\$15,000**. More recent Australian evidence from the 2004 baby bonus suggests a higher but still finite cost: e61 reports the best estimates as implying roughly **A\$50,000** per additional birth in 2004 dollars, or about **A\$86,000** in 2025 dollars.

These studies are not direct evidence about philanthropy, and cash bonuses are not the only route. But they show that fertility is responsive enough that additional births can be bought at finite, policy-relevant prices rather than requiring implausibly huge spending. Review literature on family policy points in the same direction, especially for generous leave and work-family support. ([Milligan 2002](https://www.nber.org/papers/w8845), [e61 Institute](https://e61.in/how-financial-incentives-shape-fertility-in-australia/), [OECD, *Fertility, Employment and Family Policy*](https://www.oecd.org/en/publications/fertility-employment-and-family-policy_326844f0-en.html), [Bujard et al. 2022](https://www.nature.com/articles/s41599-022-01270-w))

### 3. Fertility-care access is another tractable route, and its economics are in the same broad range

Some population-oriented philanthropy may work through infertility treatment access, coverage, or evidence-building around fertility care. This matters because infertility is common: WHO estimates that around 1 in 6 people globally are affected, and a recent NBER paper notes that roughly 1 in 8 women experience primary infertility.

The same NBER work finds that when Sweden removed public IVF coverage at age 40, IVF initiation fell sharply and births among affected women fell in close proportion. That is strong evidence that financing fertility care changes whether births happen, not merely when they happen. A recent systematic review in *Human Reproduction* reports incremental costs per additional live birth in the rough neighborhood of \$38,000 to \$50,000 in several assisted-reproduction comparisons. That is not a direct estimate for every fertility charity, but it is a useful cross-check that "tens of thousands of dollars per additional birth" is a reasonable modeling range. ([WHO 2023](https://www.who.int/news/item/04-04-2023-1-in-6-people-globally-affected-by-infertility), [Agha, Chorniy, and Canaan 2024](https://www.nber.org/papers/w32445), [NBER Bulletin summary](https://www.nber.org/bh/20242/effects-insurance-coverage-infertility-treatments-childbearing-and-wellbeing), [Hoorens et al. 2024](https://academic.oup.com/humrep/article/39/5/981/7618943))

### 4. A reasonable central estimate is about \$45,000 per additional wanted birth

The family-policy evidence and the fertility-care evidence point to a similar order of magnitude. Some interventions may come in closer to \$20,000 per extra birth; weaker or less targeted interventions may be closer to \$100,000. For a category-level estimate, **\$45,000 per additional wanted birth** is a reasonable central number, with a broad practical range of **\$20,000-\$100,000**.

This should be interpreted as the cost of actually causing one more wanted birth, not the cost of serving one family or publishing one piece of research. For research and policy organizations, the crucial question is whether their indirect route to policy change beats or at least approaches the direct public-policy benchmarks above. Using those public-policy and fertility-care anchors is better than pretending there is a precise philanthropy-specific estimate. ([Milligan 2002](https://www.nber.org/papers/w8845), [e61 Institute](https://e61.in/how-financial-incentives-shape-fertility-in-australia/), [Agha, Chorniy, and Canaan 2024](https://www.nber.org/papers/w32445), [Hoorens et al. 2024](https://academic.oup.com/humrep/article/39/5/981/7618943))

### 5. The added person's own life is worth about 73 QALYs on average

In high-income countries, life expectancy is about **81 years**. If those years are valued at about 0.9 QALYs each on average, that gives roughly **73 QALYs** for the added person's own life. That is the core moral driver of this estimate.

This assumption is philosophically loaded, but it is also the cleanest way to model the category. If creating an additional person with a good life is usually beneficial, then population charities can be quite cost-effective. If that premise is rejected, the category will look much worse. Impact List already uses QALY-like reasoning across categories, so treating an additional good life as a large positive welfare gain is the most internally coherent approach. ([OECD 2024 life expectancy](https://www.oecd.org/en/publications/society-at-a-glance-2024_918d8db3-en/full-report/life-expectancy_37a61588.html))

### 6. Achieving desired family size probably creates modest but real parental wellbeing gains

Persistent infertility is not just an income or convenience problem. The latest revision of the NBER infertility paper finds that persistent infertility causes long-run deterioration of mental health and couple stability, and the NBER bulletin summary reports higher antidepressant or anti-anxiety use and higher divorce rates among women whose first conception after infertility treatment is unsuccessful. A 2023 longitudinal study of couples who had successful IVF finds that life satisfaction increased and stress and worry decreased through the first year after childbirth.

Because parenting also carries burdens, and because not every marginal birth in this category comes from severe infertility, a conservative category-level allowance is **1.5 QALYs** across the parents combined, with a rough range of **0.5-3**. ([Agha, Chorniy, and Canaan 2024](https://www.nber.org/papers/w32445), [NBER Bulletin summary](https://www.nber.org/bh/20242/effects-insurance-coverage-infertility-treatments-childbearing-and-wellbeing), [Kiesswetter et al. 2023](https://pubmed.ncbi.nlm.nih.gov/38108238/))

### 7. Broader social spillovers are likely positive, but small relative to the main effect

In aging rich countries, an additional wanted child likely creates some net fiscal value and probably some additional diffuse social spillovers. A 2025 Australian public-economic analysis of ART-conceived children estimates about **A\$70,688** in discounted lifetime net tax revenue per child. Converted roughly into U.S. dollars and then valued at about **\$100,000 per QALY**, the fiscal channel alone comes out to about **0.5 QALYs**. Using **0.5 QALYs** as the total allowance for broader spillovers, with a rough range of **0-1**, is therefore conservative and keeps these channels clearly secondary. ([Connolly et al. 2025](https://jheor.org/article/133796-estimating-the-fiscal-value-of-children-conceived-from-assisted-reproduction-technology-in-australia-applying-a-public-economic-perspective))

## Details

### Cost per QALY

The model is:

$$
\text{Cost per QALY} = \frac{\text{Cost per additional wanted birth}}{\text{QALYs from the added person's life} + \text{Parental wellbeing} + \text{Broader spillovers}}
$$

Using the central assumptions:

$$
\frac{\$45{,}000}{73 + 1.5 + 0.5} = \frac{\$45{,}000}{75 \text{ QALYs}} = \$600 \text{ per QALY}
$$

Rounded, that gives a headline estimate of **\$600/QALY**.

This estimate should be read as a category-level number for strong opportunities, not as a field average. A research or advocacy organization is less direct than handing out baby bonuses or paying for IVF cycles, so it would be too aggressive to anchor on only the very best direct-policy result. At the same time, if those organizations successfully influence public policy or coverage, their leverage can exceed direct-service economics. Using **\$45,000 per additional wanted birth** is a middle-ground way to capture that.

The estimate is still driven overwhelmingly by the added person's own life: **73 of the central 75 QALYs** come from that channel. But it is more accurate to include a modest allowance for parental wellbeing and broader spillovers than to set those terms to zero. Those secondary effects are likely positive on net, especially parental wellbeing from achieving desired family size, even if they are much smaller than the main effect.

The range comes from:

- **Optimistic:** \$20,000 per additional birth, 80 QALYs for the added person, 3 parental QALYs, and 1 broader-spillover QALY gives about **\$240/QALY**
- **Pessimistic:** \$100,000 per additional birth, 50 QALYs for the added person, 0.5 parental QALYs, and 0 broader-spillover QALYs gives about **\$2,000/QALY**

So the practical sensitivity range is **\$240-\$2,000/QALY**.

### Start Time

The **2-year** start time reflects delay from research or advocacy to uptake, from policy change or coverage change to household response, and then from conception to birth. Some direct fertility-care support could produce effects faster than this, but 2 years is a reasonable category-level average.

### Duration

The **80-year** duration is meant to capture the added person's lifetime stream of wellbeing, not an annualized policy effect. It is a rough proxy for the period over which the main welfare gains from an additional wanted life accrue.

## What Kinds of Charities Are We Modeling?

This category is meant for charities that plausibly increase wanted births through autonomy-respecting means, such as:

- research and advocacy on family policies that reduce barriers to desired childbearing
- fertility-care access, insurance coverage, or IVF affordability work
- population-wellbeing research centers that improve the evidence base for pronatal policy
- targeted work on housing, work-family balance, or similar constraints when there is a clear causal path to more wanted births

It is **not** meant for:

- coercive pronatalism
- efforts that reduce reproductive autonomy
- generic demography or academic work with no plausible path to changing births
- ordinary child welfare or family service charities whose main effects are better modeled in other categories

## Key Uncertainties

1. **The real philanthropic cost per additional wanted birth.** The public-policy and fertility-care evidence is useful, but the hardest question is whether research and advocacy organizations can cause births at similar or better cost.
2. **Timing versus completed fertility.** Some interventions mainly shift births earlier rather than increasing the total number of children people eventually have.
3. **Population ethics.** The estimate assumes that bringing an additional person with a good life into existence is a substantial welfare gain. Readers who reject that premise should assign a much lower value.
4. **The size of secondary effects on parents and society.** The model includes a small positive allowance for parental wellbeing and broader spillovers. The main uncertainty is how large those additions should be, not whether they are positive at all.
5. **Category scope.** The current category mixes somewhat different mechanisms, especially family-policy advocacy and fertility-care access. If the site eventually includes many charities here, it may make sense to split those apart.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- The estimate is still mainly driven by the added person's own life, but now includes a modest explicit allowance for parental wellbeing and broader spillovers so that the writeup better matches the site's stated principle of counting the main significant effects in QALY-equivalent terms.
- The best next improvement would probably be a dedicated assumption page on the cost of causing an additional wanted birth through philanthropy, especially for research-and-advocacy organizations like the [University of Texas Population Wellbeing Initiative](https://sites.utexas.edu/pwi/).
- If future editors want to make the category cleaner, a split between `family policy / pronatal advocacy` and `fertility-care access` may make sense once there are enough recipients to justify it.
