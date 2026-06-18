---
id: frontier-equivalent-share-of-ai-capabilities-philanthropy
name: 'Frontier-equivalent share of AI capabilities philanthropy'
---

## How much does a dollar to AI capabilities philanthropy accelerate the frontier?

This document asks:

> After accounting for crowd-out, public-interest work, and spillovers, how much of a marginal dollar in the **AGI Development / AI capabilities** cause should be modeled as if it were extra frontier-capabilities spending?

This quantity is not directly observable. It is an **inference** that combines evidence about where frontier progress happens, how much capital is already in the field, and what kinds of projects philanthropy in this area actually funds. The funding examples below are a **2025-early 2026 snapshot**; the frontier-lab and public-interest AI funding landscape changes quickly.

**Summary:** We use **30 cents of frontier-equivalent acceleration per donated dollar** as our point estimate, with a {{PLAUSIBLE_RANGE}} of **12–55 cents**.

This is **not** the same quantity as the ordinary-benefit additionality used in [AGI Development](/cause/ai-capabilities). That number asks how much extra welfare would fail to happen without the donation. This number asks how much the donation moves the technical frontier. A dollar can therefore have low ordinary additionality but higher frontier impact if frontier actors can quickly copy and absorb the output.

---

## 1. Why this number is not close to 100%

The frontier is now overwhelmingly driven by industry, so a philanthropic dollar enters an ecosystem already saturated with private capital and strong commercial incentives — in many cases the work would mostly happen anyway. It would therefore be clearly wrong to model a dollar here as **\$1 of fully additional frontier progress**.

:::details{title="The scale of private capital already in the field"}
- Stanford's 2025 AI Index reports that **nearly 90% of notable AI models in 2024 came from industry**. ([Stanford AI Index 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report))
- The same report says **global corporate AI investment reached \$252.3 billion in 2024**, including **\$33.9 billion of private investment in generative AI** alone. ([Stanford AI Index 2025, Economy chapter](https://hai.stanford.edu/ai-index/2025-ai-index-report/economy))
- OpenAI's Stargate project alone says it **intends to invest \$500 billion over four years** in AI infrastructure. ([OpenAI 2025](https://openai.com/index/announcing-the-stargate-project/))
- Epoch AI estimates that frontier AI labs have already **raised more than \$170 billion**, that training compute for frontier language models has been growing at about **5x/year since 2020**, and that training cost has been rising at about **3.5x/year**. ([Epoch AI](https://epoch.ai/trends))
:::

---

## 2. Why this number is not close to zero either

Even though private capital dominates, the frontier effect is not negligible. This cause area includes projects genuinely close to the frontier — direct frontier labs, university labs doing capability-relevant research, open-weight or open-infrastructure projects, and the datasets, benchmarks, tools, and research that quickly spill over into frontier practice. And open or academic work can accelerate the frontier even when it is not literally a frontier training run, so capability-relevant donations here can matter more for frontier progress than their budget line alone would suggest.

:::details{title="Spillovers from open work, and why public-interest giving still isn't zero-impact"}
**Open models are closing the gap fast.** Stanford's 2025 AI Index notes that the performance gap between open-weight and closed models fell from **8% to 1.7%** on some benchmarks in a single year. ([Stanford AI Index 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report)) That means donations to open models, academic labs, or broadly shared infrastructure can move the frontier more than their line item suggests.

**Public-interest giving exists, but its outputs still flow to the frontier.** Major initiatives in this space are not pure frontier scaling — Humanity AI is a **\$500 million, five-year** initiative focused on democracy, labor, education, culture, and security ([MacArthur 2025](https://www.macfound.org/press/press-releases/humanity-ai-commits-500-million-to-build-a-people-centered-future-for-ai)), and the Patrick J. McGovern Foundation announced **\$75.8 million** of 2025 grants focused on public institutions, community power, and human-welfare uses of AI ([PJMF 2025](https://www.mcgovern.org/2025-press-release/)). So not all philanthropy here is equivalent to buying more compute for OpenAI — but the frontier effect is not tiny either, because many outputs of public-interest and academic work are still usable by frontier actors.
:::

---

## 3. Our point estimate: 30 cents on the dollar

The field is too commercially crowded to give philanthropy anything close to full additionality, but it still includes many projects whose outputs are capability-relevant and spill quickly into frontier systems. The category is therefore much more frontier-relevant than generic "tech for good" philanthropy, but much less frontier-relevant than directly buying training compute for the top lab. Our best all-things-considered estimate is:

$$
a_{\text{frontier}} \approx 0.30
$$

That is, **\$1 donated here is best modeled as about \$0.30 of frontier-equivalent capability acceleration**.

### Plausible range

Our plausible range is **0.12–0.55**. Its width is driven by two largely independent axes of uncertainty: **where the marginal dollar lands** (loosely-tied public-interest work at one end, frontier-direct or open-model work at the other) and **how much of that work is crowded out versus absorbed by the frontier** (whether the private sector would have produced it anyway, or whether outputs spill quickly into frontier systems). The interval is wide because both axes are genuinely uncertain, they tend to move together with one's overall read of the cause, and the quantity itself is an unobservable inference rather than a measured figure.

We do not use values close to **1.0** because that would implicitly assume very little crowd-out from the now-enormous private AI sector. We do not use values close to **0.0** because that would ignore how much academic, open, and infrastructure work now spills over into frontier progress.

:::details{title="Scenario end-members behind the range"}
The bounds are tighter than the two extreme scenarios because those scenarios push both axes to their limits at once, whereas a typical marginal dollar is a blend:

- **0.10** if the marginal dollar mainly funds public-interest deployment, broad education, or research that is only loosely tied to the frontier — and little of even that work is absorbed by frontier actors.
- **0.60** if the marginal dollar goes to an open-model effort, a near-frontier university lab, or a recipient whose work is quickly incorporated into frontier systems.

Treating those two end-members as the published plausible range would overstate our confidence in the extremes: it would require both the destination of the dollar and the crowd-out/absorption rate to land at their favorable (or unfavorable) limits together. Pulling each end partway in from its scenario limit — while still widening well beyond what fully independent axes would give, because the two axes are positively correlated and the whole quantity carries heavy structural uncertainty — gives **0.12–0.55**.
:::

---

## 4. Why this assumption matters

This single parameter is doing important work in the AGI Development cause:

- It increases the **utopia** effect, because some donations really do help bring forward transformative AI.
- It also increases the **doom** effect, because the same acceleration can increase existential risk.

Users who think this cause is basically direct frontier acceleration should raise this number.
Users who think the relevant charities are mostly public-interest AI, with weak frontier spillovers, should lower it.

{{CONTRIBUTION_NOTE}}

# Internal Notes

_The following analysis was done on April 6th 2026 by GPT-5, with prompts from Impact List staff._
