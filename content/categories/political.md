---
id: political
name: 'Political'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 4
    costPerQALY: 20_000
---

# Justification of cost per life

_The following analysis was done on April 10th 2026 by GPT-5.4 (Extra High), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures the expected welfare gains from **unusually well-targeted political spending in high-income democracies**, especially close elections, ballot initiatives, and political organizations that can modestly change who holds power for the next governing term. The main causal chain is:

$$
\text{dollars} \to \text{votes / win probability} \to \text{policy difference} \to \text{QALYs}
$$

The estimate is **not** for the average partisan donation. Most political dollars are probably much worse than this, because many races are not close, many policy differences are small, and much spending lands in saturated or low-leverage channels. The goal here is to model the best currently donatable opportunities where an additional dollar still has a plausible path to changing an outcome with real policy consequences.

We also intentionally leave out the most speculative benefits and harms of politics, such as broad effects on national identity, civic culture, or very long-run ideological trajectories. Those channels may matter a lot, but they are too easy to manipulate with storytelling. This page instead tries to anchor on the narrower question: **how much near-term welfare can strong political giving buy through changing election-linked policy?**

## Point Estimates

- **Cost per QALY:** \$20,000 (\$3,000–\$300,000)
- **Start time:** 1 year
- **Duration:** 4 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. The average persuasive effect of campaign contact in general elections is very small and may often be near zero, especially in high-salience national races. That is an important reason not to treat every political dollar as highly effective by default. ([Kalla & Broockman 2018](https://www.cambridge.org/core/journals/american-political-science-review/article/minimal-persuasive-effects-of-campaign-contact-in-general-elections-evidence-from-49-field-experiments/753665A313C4AB433DBF7110299B7433))
2. Turnout mobilization effects are more robust than persuasion effects. A large review of field experiments finds average complier effects around **2.54 percentage points** for door-to-door canvassing, about **0.98 percentage points** for live commercial phone calls, and about **0.16 percentage points per conventional mailing**, while social-pressure mail can do much more. Newer meta-analysis finds that these tactics still work in high-salience elections but are attenuated relative to low-salience contests. ([Green, McGrath & Aronow 2013](https://cpb-us-e1.wpmucdn.com/sites.northwestern.edu/dist/b/3288/files/2019/10/2013-GMA-Field-Experiments-Turnout.pdf), [Mann & Haenschen 2024](https://research.voteamerica.org/a-meta-analysis-of-voter-mobilization-tactics-by-electoral-salience/))
3. Large modern campaigns can still alter outcomes at scale. Enos and Fowler estimate that the 2012 presidential campaigns **combined** increased turnout in highly targeted states by **7-8 percentage points** on average, largely through ground campaigning, and found no evidence of diminishing marginal returns to ground campaigning at that scale. ([Enos & Fowler 2018](https://www.cambridge.org/core/journals/political-science-research-and-methods/article/aggregate-effects-of-largescale-campaigns-on-voter-turnout/20C500B0DE62227873FD24CB3555F779))
4. Broadcast advertising also matters, especially down-ballot. Sides, Vavreck, and Warshaw find television ad effects are **2-4x larger** in gubernatorial, House, and Senate races than in presidential races, and Hewitt et al. use a **\$200 per vote** benchmark for TV advertising when modeling campaign persuasion. ([Sides, Vavreck & Warshaw 2022](https://www.cambridge.org/core/journals/american-political-science-review/article/effect-of-television-advertising-in-united-states-elections/29ED18D9FB4B7AA52F6404ECF15F4114), [Hewitt et al. 2024](https://doi.org/10.1017/S0003055423001387))
5. After heavily discounting for counter-spending, saturation, imperfect targeting, and the fact that many dollars do not land in the very best tactical opportunities, a well-targeted **\$10 million** political donation is assumed to raise win probability by about **1 percentage point** in a true toss-up, with a practical range around **0.5-1.5 percentage points** for the sensitivity analysis below.
6. A single electoral cycle can easily put at least the low billions of clearly welfare-relevant policy at stake. The clearest narrow anchor is U.S. global health appropriations: KFF reports that the **FY 2027 President's Budget Request released on April 3, 2026** proposed the main Global Health Programs account at **\$5.1 billion**, versus **\$9.4 billion in FY 2026**, a **\$4.3 billion** gap. Using a **\$1.5 billion** welfare-relevant policy wedge over one term is therefore a narrowly scoped working estimate rather than a claim about the full stakes of major races. ([KFF FY27 Budget Request](https://www.kff.org/global-health-policy/global-health-funding-in-the-fy-2027-presidents-budget-request/))
7. Because Assumption 6 is specifically anchored to global-health appropriations, the most relevant outside view for converting that wedge into QALYs is the global-health aid and LMIC health-spending literature rather than rich-country technology-appraisal thresholds. Bendavid et al. report median ICERs around **\$8.2**, **\$9.7**, **\$48.9**, and **\$67.7 per DALY averted** for TB, malaria, HIV, and maternal, newborn, and child health in aid-recipient settings; Fan et al. 2024 also find that **61%** of recent health-aid projects mention interventions on a Disease Control Priorities-style list of highly cost-effective interventions. At the other end, Daroudi et al. estimate **cost per DALY averted** of around **\$998** in low-HDI countries and **\$6,522** in medium-HDI countries. Since this is a mortality-heavy global-health context, treating DALYs and QALYs as approximately interchangeable is good enough for this parameter. A political appropriation dollar should land well above the direct-intervention frontier because it passes through legislation, agencies, and mixed portfolios before reaching beneficiaries, so **\$1,500/QALY** is a reasonable middle estimate for the global-health slice of the policy wedge. ([Bendavid et al. 2015](https://pubmed.ncbi.nlm.nih.gov/26153314/), [Fan et al. 2024](https://www.cgdev.org/publication/cost-effectiveness-health-aid-exploratory-quantitative-analysis), [Daroudi et al. 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC7863358/))
8. A single close race, ballot measure, or candidate-selection contest is assumed to have about **5% marginal influence** on whether the modeled policy wedge is realized. This is meant to average across many cases where one contest matters little and a smaller number of cases where chamber control, veto power, agenda control, or a closely divided legislature makes one outcome highly consequential. As a rough empirical anchor, Cook Political Report's December 19, 2024 post-election review said **a little less than 10% of House races were truly competitive**, which is roughly **40 of 435 seats**. ([Cook Political Report 2024 House review](https://www.cookpolitical.com/analysis/house/house-overview/twelve-things-we-learned-2024-house-elections))
9. Benefits begin about **1 year** after the donation because funding must first affect an election, then officeholders need time to take power and influence the first budget or policy cycle. Benefits are modeled over **4 years** because the central case is one governing term, and many election-dependent gains are at least partly reversible in the next cycle.

## Details

### Cost per QALY

The cleanest way to estimate this category is:

$$
\text{Expected QALYs} = p \times g \times \frac{B}{e}
$$

$$
\text{Cost per QALY} = \frac{C}{\text{Expected QALYs}}
$$

Where:

- $C$ = donation amount
- $p$ = net increase in win probability from the donation
- $g$ = marginal influence of the contest on a welfare-relevant policy wedge
- $B$ = total welfare-relevant policy wedge over the term
- $e$ = effective cost per QALY of that wedge

Using the central assumptions:

- $C$ = \$10,000,000
- $p$ = 0.01
- $g$ = 0.05
- $B$ = \$1,500,000,000
- $e$ = \$1,500/QALY

So:

$$
\dfrac{B}{e} = \dfrac{1{,}500{,}000{,}000}{1{,}500} = 1{,}000{,}000 \text{ QALYs}
$$

$$
g \times \dfrac{B}{e} = 0.05 \times 1{,}000{,}000 = 50{,}000 \text{ QALYs}
$$

$$
p \times g \times \dfrac{B}{e} = 0.01 \times 50{,}000 = 500 \text{ QALYs}
$$

$$
\text{Cost per QALY} = \dfrac{10{,}000{,}000}{500} = 20{,}000
$$

So the point estimate is **\$20,000/QALY**.

This estimate should be read as a **best-opportunity political giving** number, not a field average. Three key modeling choices matter for interpreting it:

1. It does **not** assume every campaign dollar persuades voters; the literature on general-election persuasion is one major reason the estimate is not much lower.
2. It counts only a **narrow, relatively measurable** policy wedge rather than broad claims about changing history.
3. It uses an effective policy conversion of **\$1,500/QALY**, which is far worse than the current frontier for direct global-health or poverty giving.

### Why the 1% win-probability assumption is reasonable

At first glance, **1 percentage point of win probability for \$10 million** may look aggressive. But taken against the campaign literature, it is a defensible central estimate.

The most important negative update is Kalla and Broockman: average persuasive effects of campaign contact in general elections often look extremely small. That rules out naive models where every ad or canvass directly flips lots of votes.

But that is not the whole picture. The turnout literature shows that live, personalized contact reliably moves participation, and Enos and Fowler show that full presidential battleground campaigns changed turnout in targeted states by **7-8 points** overall. Meanwhile, Sides, Vavreck, and Warshaw show that down-ballot TV advertising is more potent than presidential advertising, and Hewitt et al.'s modeling uses a **\$200 per vote** benchmark for TV ads before adding gains from experimentation.

Taking those studies literally would often imply much more than a 1-point win-probability shift from a well-placed \$10 million in a close contest. We do **not** do that. Instead, we heavily haircut for the facts that:

- both sides may spend more in response
- late-cycle markets are crowded
- donors do not get perfectly targeted access to the highest-return tactics
- some organizations are funding candidate recruitment, coalition building, or slower political infrastructure rather than immediate vote movement

So the **1%** figure should be read as a practical after-all-haircuts estimate for an unusually well-targeted gift, not as a literal extrapolation from the strongest GOTV or ad studies.

### Why the policy wedge is \$1.5 billion

The right way to think about political donations is not that they directly buy QALYs. They buy a slightly different probability distribution over policy outcomes. The main question is therefore: **how much clearly welfare-relevant policy can plausibly sit on the margin of one important contest?**

The public budget evidence says the answer is at least in the low billions even before counting many hard-to-measure channels.

The most defensible narrow example is U.S. global health appropriations. KFF's FY 2027 budget summary shows a **\$4.3 billion** gap between the President's proposed **\$5.1 billion** for the main Global Health Programs account and **\$9.4 billion** in FY 2026. Earlier House FY 2025 proposals were already about **\$1.43 billion** below FY 2024 enacted levels when one combines the main SFOPS global-health-programs gap (about **\$1.3 billion**) with the Labor-HHS reduction to CDC global health (about **\$129 million**). So the **\$1.5 billion** central wedge is not meant to stand for all policy consequences of a major race; it is a concrete working figure for one narrow family of programs. It excludes:

- domestic health-insurance expansions or contractions
- climate policy differences
- safety-net policy differences
- criminal-justice and rights policy
- longer-run institutional consequences

That is why **\$1.5 billion** is best read as a narrowly scoped central number for one term of policy.

### Why the wedge is converted at \$1,500 per QALY

The KFF anchor above is specifically about **global-health appropriations**, so the most relevant outside view here is the aid-effectiveness literature on government global-health dollars.

Bendavid et al.'s review of aid-recipient settings reports median ICERs around **\$8.2**, **\$9.7**, **\$48.9**, and **\$67.7 per DALY averted** for TB, malaria, HIV, and maternal, newborn, and child health. Fan et al.'s 2024 exploratory analysis then finds that **61%** of 2019-2021 health-aid projects mention interventions on a Disease Control Priorities-style list of highly cost-effective interventions. So the underlying global-health opportunities financed through aid channels often look very good. Since this is a mortality-heavy global-health context, treating DALYs and QALYs as approximately interchangeable is good enough for this bridge calculation. ([Fan et al. 2024](https://www.cgdev.org/publication/cost-effectiveness-health-aid-exploratory-quantitative-analysis))

But a **political appropriation dollar** should still be materially worse than those direct-intervention figures. It has to pass through legislation, agencies, procurement, country allocation, absorptive constraints, and a mixed portfolio before reaching final beneficiaries. That means the right parameter is not the frontier cost-effectiveness of the best malaria or TB program.

At the other end, Daroudi et al. estimate **cost per DALY averted** of around **\$998** in low-HDI countries and **\$6,522** in medium-HDI countries. That is a useful outside-view check for what a more system-level health dollar can look like once one moves away from handpicked top interventions.

If we used only the site's current direct-giving estimates, the political category would look much stronger than **\$20,000/QALY**. For example:

- [Global Health](/category/global-health) is currently **\$90/QALY**
- [Global Development](/category/global-development) is currently **\$210/QALY**
- [Climate Change](/category/climate-change) is currently **\$590/QALY**

But it would be too optimistic to pretend that a welfare-relevant political wedge is just a pile of perfectly targeted GiveWell grants or best-in-class climate opportunities. Much of what politics changes is less efficient than that: broader health systems, insurance design, tax credits, enforcement, administration, and mixed-quality public programs.

So **\$1,500/QALY** is best read as a working value for the global-health slice of the policy wedge:

- much worse than the site's frontier direct-giving categories
- inside the broad range suggested by the most relevant aid and LMIC-spending literature
- plausible for a political dollar that first has to survive legislation, agencies, and mixed program allocation

This assumption is one of the most judgment-sensitive inputs in the whole file.

### Why the 5% pivotality assumption is reasonable

The **5%** figure is a judgment call about how often one targeted contest is genuinely important for realizing the policy wedge.

Cook Political Report's review of the 2024 U.S. House cycle says a little less than **10%** of House races were truly competitive, meaning the serious battleground is only a few dozen seats. Pivotality is not the same thing as competitiveness, but that small battleground is part of why it is plausible for targeted political money to focus on contests where one result really matters.

If a donor backs a race that turns out not to matter for chamber control, veto power, or a key ballot measure, the true pivotality can be near zero. But if the donor is funding unusually high-leverage opportunities, that should not be the average case. In a narrowly divided legislature or a closely fought statewide race, one contest can matter a lot:

- it may help determine which party controls a chamber
- it may affect whether a governor can sign or veto a bill
- it may determine whether a ballot measure passes
- it may change committee leadership, agenda control, or budget bargaining power

Using **5%** says: most high-leverage political donations will not decide history, but some meaningful fraction are attached to contests where the policy stakes really are material.

### Range

The practical sensitivity range is wide because all four main parameters can move a lot.

- **Pessimistic:** 0.5% win-probability shift, 3% pivotality, \$750 million policy wedge, and \$3,000/QALY conversion gives about **\$270,000/QALY**.
- **Optimistic:** 1.5% win-probability shift, 8% pivotality, \$2 billion policy wedge, and \$750/QALY conversion gives about **\$3,100/QALY**.

Rounded, that gives a practical range of about **\$3,000-\$300,000/QALY**.

That range is deliberately wide, because political spending really does have a lumpy, hits-based structure:

- many donations probably do very little
- some help win contests with modest policy consequences
- a small number may land in unusually pivotal races or ballot fights

The point estimate is therefore best interpreted as a central all-things-considered guess for **strong** political opportunities, not as a claim that the category is tightly measured.

### Start Time

The **1-year** start time reflects the lag from donation to election to governing action. A donation may be spent within weeks, but the benefits only begin if the backed side wins and then influences a budget, law, or executive action. One year is therefore a reasonable round estimate for the first meaningful welfare effects.

### Duration

The **4-year** duration reflects one governing term. Some policy gains clearly last longer than that, while others are reversed faster. We use 4 years because it fits the central story of election-dependent appropriations and regulatory priorities without assuming that every political win becomes permanently locked in.

This is a deliberately term-level duration. A good ballot initiative or a durable statutory reform can matter for much longer than 4 years, but pushing the duration much higher would bundle in persistence assumptions that the rest of the model does not explicitly estimate.

## What Kinds of Charities Are We Modeling?

These estimates are mainly for:

- partisan committees, PACs, and electoral organizations targeting unusually close, policy-salient races
- turnout and voter-contact organizations with real empirical grounding
- ballot-initiative campaigns with concrete policy consequences
- political organizations that improve candidate supply or campaign execution in ways that plausibly feed into the same election-to-policy pathway

They are **not** estimates for:

- the average ideological nonprofit
- generic political media or commentary
- prestige donations to campaigns that are already safely won or lost
- broad democracy or civic-culture work whose value comes mainly through slower institutional channels

Those activities may still matter, but they should either be modeled much worse than this or placed in a different category.

## Key Uncertainties

1. **How much marginal money still changes outcomes in saturated, polarized elections.** The literature clearly rejects "money does nothing," but it also rejects simplistic models where every contact or ad works well.
2. **How often donors are genuinely marginal.** Some extra spending is partly offset by other donors, parties, or super PACs.
3. **How large the welfare-relevant policy wedge really is.** This is the biggest source of disagreement after the campaign-effectiveness question.
4. **How broad the category should be.** The current category mixes close-race spending, ballot campaigns, and slower political capacity-building. Those are related, but not identical.
5. **How much long-run value is omitted.** We deliberately exclude broad claims about democratic resilience, movement-building, and ideological drift. That keeps the estimate cleaner, but may understate some top opportunities.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- This version intentionally models only the **narrower, more defensible election-to-policy pathway**. It does not try to capture all value from politics.
- The key move relative to the previous version is to anchor campaign effectiveness more directly in the empirical literature and to anchor policy stakes in **actual appropriations differences** rather than a vague "hundreds of millions" intuition.
- If future editors want to improve this page further, the best next step may be to split `political` into something like `electoral politics` versus `democracy / institutional politics`, because those probably deserve different models.
