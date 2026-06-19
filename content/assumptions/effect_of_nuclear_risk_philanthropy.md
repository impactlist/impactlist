---
id: effect-of-nuclear-risk-philanthropy
name: 'Effect of all previous nuclear-risk philanthropy'
---

## How much has existing nuclear-risk philanthropy reduced catastrophic nuclear-war risk?

This document analyzes one question:

> By how many percentage points has roughly **\$600 million** of nuclear-risk philanthropy over about **20 years** reduced the probability of a **>10 million-death nuclear catastrophe** over the next roughly **20 years**?

Let:

- $p_{\text{with}}$ = estimated probability of such a catastrophe in the actual world, with existing nuclear-risk philanthropy
- $p_{\text{without}}$ = estimated probability in a counterfactual world without that philanthropy
- $X = p_{\text{without}} - p_{\text{with}}$ in **percentage points**
- $Y, Z$ = lower and upper bounds of a {{PLAUSIBLE_RANGE}} for $X$

A reasonable summary is:

- **Best-guess:** $X \approx 0.025$ percentage points
- **Plausible range:** $Y \approx 0.002$ percentage points, $Z \approx 0.2$ percentage points

That is, roughly **\$600 million** of nuclear-risk philanthropy plausibly reduced 20-year catastrophic nuclear-war risk by about **0.025 percentage points**, with a plausible range of about **0.002–0.2 percentage points**.

This corresponds to about:

- **2.5 basis points** per \$600 million
- about **4.2 basis points per \$1 billion**
- about **\$2.4 million per microprobability**

The [Nuclear](/cause/nuclear) category does not plug this broad endpoint directly into its severe-nuclear-winter model. It applies an expected-severity bridge, treating roughly four broad >10-million-death catastrophe microprobabilities as one large-nuclear-winter-equivalent microprobability. That bridge is a category-level valuation step, not part of this assumption's risk-reduction estimate.

This is one of the most uncertain assumptions in the category. The evidence base is thin, the causal chains run through governments rather than direct service delivery, and historical successes are hard to translate into clean probability units.

---

## 1. Conceptual framing

The quantity of interest is:

$$
X = p_{\text{without}} - p_{\text{with}}
$$

measured in **percentage points**.

For example, if current nuclear-risk philanthropy has reduced 20-year catastrophe risk from **3.025%** to **3.000%**, then:

$$
X = 0.025 \text{ percentage points}
$$

This may sound tiny, but the whole point of the category is that tiny changes in the probability of an extremely bad event can have very large expected value.

Unlike in some near-term cause areas, we have no clean randomized or quasi-experimental literature on this question. So we combine four things:

1. evidence about the size of the relevant philanthropic field
2. evidence about the kinds of levers philanthropy can realistically move
3. historical examples showing that philanthropy sometimes does influence major nuclear institutions or policy
4. a calibration against ONN's estimate of how much a strong policy bundle could reduce catastrophe risk

---

## 2. What scale of philanthropy are we talking about?

Roughly **\$600 million** over **20 years**. [Founders Pledge's 2023 nuclear-risk guide](https://www.founderspledge.com/research/global-catastrophic-nuclear-risk-a-guide-for-philanthropists) says that after the MacArthur Foundation's exit, total philanthropic funding in the field fell to about **\$30 million per year**. Run that for **20 years** and you get roughly **\$600 million** — a reasonable order-of-magnitude anchor for the field whose effect we are trying to estimate.

:::details{title="Why $600M is a defensible order-of-magnitude anchor"}
$$
\$30 \text{M/year} \times 20 = \$600 \text{M}
$$

This is obviously a rough figure: annual spending has not been literally constant, some work in adjacent peace-and-security buckets partly overlaps with nuclear risk, and some grants buy field capacity or research rather than immediate policy wins.

The anchor does not rest on a single number, though. Older Open Philanthropy / GiveWell work on nuclear weapons policy similarly described foundation funding in the space as around **\$30 million per year**, mostly for policy research, education, advocacy, and track-II diplomacy. ([Coefficient Giving / Open Philanthropy 2015](https://coefficientgiving.org/research/nuclear-weapons-policy/))
:::

---

## 3. What kinds of things can philanthropy plausibly accomplish here?

This field is not mainly about buying direct risk reduction the way bednets buy fewer malaria deaths. The route is leverage. The question is not "can philanthropy itself halve nuclear risk?" (clearly not). It is whether a small field can sometimes generate better policy options, shift elite beliefs, build institutional capacity, and pressure governments toward specific risk-reduction measures. That leverage is hard to measure, but it is not fanciful — it is how most serious nuclear-policy philanthropy is already trying to work.

:::details{title="The leverage mechanisms philanthropy is trying to move"}
Founders Pledge argues that philanthropy can multiply its impact by:

- focusing on **great-power** nuclear risk
- focusing on **policy advocacy** that leverages much larger public resources
- prioritizing neglected **"right of boom"** work such as escalation control and war limitation
- actively shaping new projects rather than only funding off-the-shelf charities ([Founders Pledge 2023](https://www.founderspledge.com/research/global-catastrophic-nuclear-risk-a-guide-for-philanthropists))

So the specific channels through which a tiny field can matter are: generating or improving policy options, creating analysis that changes elite beliefs, building expert communities and institutional capacity, funding advocacy or diplomacy infrastructure that matters when policy windows open, and pressuring governments to adopt specific crisis-management or risk-reduction measures.
:::

---

## 4. Evidence that philanthropy can sometimes shape major nuclear institutions or policy

The strongest direct evidence is historical and case-based rather than statistical. Small nongovernmental organizations have repeatedly helped create institutions, reviews, and government actions far larger than their own budgets. These are self-described or interview-based attributions, not clean estimates of probability reduction. But they show the causal story is historically plausible rather than fanciful: small philanthropic investments can sometimes help produce large government-led risk-reduction outcomes.

:::details{title="The historical cases: NTI, Nunn-Lugar, New START, and foundational research"}
**NTI's track record.** NTI's public impact page claims a 25-year record that includes helping remove highly enriched uranium from a Serbian reactor and then catalyzing a **\$3+ billion** U.S. government program to remove or safeguard vulnerable HEU and plutonium globally; persuading the U.S. government to undertake an independent **fail-safe review** of the U.S. nuclear arsenal with emphasis on cyber vulnerabilities; establishing the world's first **low-enriched uranium bank**; and helping create the **World Institute for Nuclear Security (WINS)**. ([NTI Impact](https://www.nti.org/impact/)) These are self-described organizational achievements, so they are evidence about the **kind** of leverage small philanthropic institutions can have, not precise probability reductions.

**Cases cited by Open Philanthropy / GiveWell.** Open Philanthropy's earlier nuclear-weapons-policy investigation, drawing on interviews and historical material, argues philanthropy likely played an influential role in parts of the development of modern **deterrence theory**, the **Nunn-Lugar Cooperative Threat Reduction Program**, and support and public-pressure infrastructure around **New START**. ([Coefficient Giving / Open Philanthropy 2015](https://coefficientgiving.org/research/nuclear-weapons-policy/)) That page also quotes George Perkovich saying **preventing nuclear war** is the nuclear-policy area with the largest likely scope for philanthropy — informed expert opinion, though not decisive evidence.

**Foundational research as an output.** Philanthropy also funds the underlying evidence base. Open Philanthropy gave roughly **\$3 million** in 2017 and another **\$3 million** in 2020 to Rutgers University to support Alan Robock and collaborators' work on the climatological, ecological, and social effects of large nuclear conflicts. ([Open Philanthropy 2017](https://www.openphilanthropy.org/grants/rutgers-university-nuclear-conflict-climate-modeling/), [Open Philanthropy 2020](https://www.openphilanthropy.org/grants/rutgers-university-nuclear-conflict-climate-modeling-2020/)) This does not directly reduce catastrophe probability, but it is a good example of philanthropy buying public goods governments underprovide: better models, sharper prioritization, and more credible worst-case analysis.
:::

---

## 5. Bridging from ONN's policy bundle to philanthropy's share of effect

For our central estimate of **0.025 percentage points** to hold, a **\$600 million field over 20 years** needs to be responsible for only about **1–5%** of the effect of the best tractable policy bundle. It does not have to implement the bundle itself. It just has to be partly responsible for a small but nontrivial slice of the risk reduction better policy could achieve.

Our outside anchor for that bundle is ONN's 2024 expert-forecasting report. It found a median **5%** catastrophe probability by **2045** among domain experts, a median **1%** among superforecasters, and a belief that a **bundle of six tractable policies** could together **halve** the risk of a nuclear catastrophe. ([ONN 2024](https://opennuclear.org/en/open-nuclear-network/publication/can-humanity-achieve-century-nuclear-peace))

:::details{title="The bridge arithmetic and why 1–5% of the bundle is plausible"}
Halving the risk means the full policy bundle is worth:

- **0.5 percentage points** if the true baseline risk is **1%**
- **1.5 percentage points** using a rough blended anchor of **3%**
- **2.5 percentage points** if the true baseline risk is **5%**

Against those, the central estimate of $X = 0.025$ percentage points implies philanthropy buys only about **5%** of the full bundle effect at the **1%** baseline, about **1.7%** at **3%**, and **1%** at **5%**. This is our inference from the sources, not something directly measured in the ONN report.

That **1–5%** share seems plausible for three reasons:

1. The field is explicitly trying to influence **government policy and doctrine**, so large leverage relative to dollars spent is the whole model.
2. Historical case studies suggest philanthropy has sometimes helped generate or accelerate much larger public actions.
3. Founders Pledge argues some of the most promising interventions are both **neglected** and **policy-leveraged**, especially in escalation control and other "right of boom" areas.
:::

---

## 6. Why use 0.002–0.2 percentage points as the plausible range?

Our published plausible range is about **0.002–0.2 percentage points**. The two bridge parameters — the **baseline catastrophe risk** (which sets how much the policy bundle is worth) and **philanthropy's share** of that bundle effect — span only **0.005–0.12** even at their joint extremes. We publish a *wider* range than that, because the largest uncertainties are structural and sit outside those two parameters. Maybe philanthropy has essentially no counterfactual leverage — a share below the bridge's **1%** floor, pushing the effect toward zero. Maybe the fixed "halving" calibration does not hold. Maybe crediting a tiny field with a slice of government-led outcomes is the wrong model entirely. Those tails — especially the near-zero-leverage one — widen the plausible range beyond even the two-parameter corner.

:::details{title="Bridge sweep of the two parameters, and why the published range is wider"}
The mechanical bounds come from sweeping both parameters to their favorable and unfavorable extremes together. The full policy bundle is worth **0.5 percentage points** at a **1%** baseline, **1.5 percentage points** at a blended **3%**, and **2.5 percentage points** at a **5%** baseline; philanthropy's share runs from about **1%** to about **5%**.

**Pessimistic corner: 0.005 percentage points.** The underlying catastrophe risk is near the superforecasters' **1%** (bundle worth **0.5 percentage points**) and philanthropy claims only about a **1%** share — a world where many grants build capacity without yet changing decisions. That is 1% of 0.5 percentage points.

**Optimistic corner: 0.12 percentage points.** The risk is near the experts' **5%** (bundle worth **2.5 percentage points**) and philanthropy captures about a **4.8%** share by occasionally helping produce unusually leveraged doctrine, crisis-management, or institutional wins. That is 4.8% of 2.5 percentage points.

That **0.005–0.12** corner is a roughly 20x spread, and for two independent parameters it would *overstate* the input-driven plausible range — a worldview unusually pessimistic about how dangerous the world is need not also be pessimistic about philanthropy's leverage, and treating the two as independent would shrink the spread to roughly **0.008–0.08 percentage points**. But the published range is **wider** than the corner, not narrower, because the dominant uncertainties are not these two parameters at all: there is a real tail in which philanthropy's counterfactual share sits below the **1%** bridge floor and the effect is near zero (cost per microprobability far above the sweep), and a thinner tail in which it occasionally captures unusually leveraged wins. Carrying those structural tails gives a best-judgment plausible range of about **0.002–0.2 percentage points**, centered on the same **0.025**.
:::

---

## 7. A simple calibration check

As a sanity check, the central estimate of **0.025 percentage points** is **250 microprobabilities** spread over about **20 years**, or only about **12.5 microprobabilities per year** across the whole field. The claim is not that philanthropy makes nuclear catastrophe dramatically less likely — only that a small field operating at the level of policy, doctrine, analysis, and institutions might shave roughly **one part in eighty thousand per year** off catastrophe probability. For a field explicitly aimed at influencing the behavior of a few nuclear-armed states in a few very high-stakes situations, that does not look obviously extreme.

---

## 8. Why not go much higher or much lower?

The central **0.025 percentage-point** estimate is a middle ground between the very low and very high tractability views. On the low side, historical success stories are hard to attribute cleanly, and governments do most of the direct decision-making. On the high side, the field is tiny relative to the stakes, it is targeted at unusually high-leverage mechanisms, and multiple concrete cases show small organizations catalyzing much larger governmental actions.

:::details{title="The full case against each tail"}
Reasons not to go **much higher** by default:

- historical success stories are hard to attribute cleanly
- governments do most of the direct decision-making
- policy windows are lumpy, and some years of spending may mostly maintain capacity
- the field has real uncertainty about which interventions work best

Reasons not to go **much lower** by default:

- the field is tiny relative to the stakes
- it is targeted at unusually high-leverage mechanisms rather than direct service delivery
- there are multiple concrete historical examples of philanthropic organizations helping to catalyze much larger institutional or governmental actions
- ONN and Founders Pledge both point toward tractable policy levers rather than total helplessness
:::

# Internal Notes

_The following analysis was done on April 6th 2026 by GPT-5.4, with prompts from Impact List staff._
