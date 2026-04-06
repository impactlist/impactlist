---
id: frontier-equivalent-share-of-ai-capabilities-philanthropy
name: 'Frontier-equivalent share of AI capabilities philanthropy'
---

_The following analysis was done on April 6th 2026 by Codex (GPT-5) and edited by Impact List staff for clarity._

## How much does a dollar to AI capabilities philanthropy accelerate the frontier?

This document asks:

> After accounting for crowd-out, public-interest work, and spillovers, how much of a marginal dollar in the **AGI Development / AI capabilities** cause should be modeled as if it were extra frontier-capabilities spending?

This quantity is not directly observable. It is an **inference** that combines evidence about where frontier progress happens, how much capital is already in the field, and what kinds of projects philanthropy in this area actually funds.

**Summary:** We use **30 cents of frontier-equivalent acceleration per donated dollar** as our point estimate, with a plausible range of **10–60 cents**.

This is **not** the same quantity as the ordinary-benefit additionality used in [AGI Development](/cause/ai-capabilities). That number asks how much extra welfare would fail to happen without the donation. This number asks how much the donation moves the technical frontier. A dollar can therefore have low ordinary additionality but higher frontier impact if frontier actors can quickly copy and absorb the output.

---

## 1. Why This Number Is Not Close to 100%

The frontier is now overwhelmingly driven by industry.

- Stanford's 2025 AI Index reports that **nearly 90% of notable AI models in 2024 came from industry**. ([Stanford AI Index 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report))
- The same report says **global corporate AI investment reached \$252.3 billion in 2024**, including **\$33.9 billion of private investment in generative AI** alone. ([Stanford AI Index 2025, Economy chapter](https://hai.stanford.edu/ai-index/2025-ai-index-report/economy))
- OpenAI's Stargate project alone says it **intends to invest \$500 billion over four years** in AI infrastructure. ([OpenAI 2025](https://openai.com/index/announcing-the-stargate-project/))
- Epoch AI estimates that frontier AI labs have already **raised more than \$170 billion**, that training compute for frontier language models has been growing at about **5x/year since 2020**, and that training cost has been rising at about **3.5x/year**. ([Epoch AI](https://epoch.ai/trends))

Taken together, this means a random philanthropic dollar is entering an ecosystem that already has massive private funding and strong commercial incentives. In many cases, the work would mostly happen anyway.

So it would be clearly wrong to model a dollar here as **\$1 of fully additional frontier progress**.

---

## 2. Why This Number Is Not Close to Zero Either

Even though private capital dominates, it would also be wrong to model the frontier effect as negligible.

First, this cause area does include projects that are genuinely close to the frontier:

- direct frontier labs
- university labs doing capability-relevant research
- open-weight or open-infrastructure projects
- datasets, benchmarks, tools, and research that quickly spill over into frontier practice

Second, open work can accelerate the frontier even when it is not literally a frontier training run. Stanford's 2025 AI Index notes that the performance gap between open-weight and closed models fell from **8% to 1.7%** on some benchmarks in a single year. ([Stanford AI Index 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report))

That means capability-relevant donations to open models, academic labs, or broadly shared infrastructure can matter more for frontier progress than their budget line alone would suggest.

Third, philanthropy in this area is not only governance or social-impact work. But the existence of major public-interest initiatives does matter for calibration:

- Humanity AI is a **\$500 million, five-year** philanthropic initiative focused on democracy, labor, education, culture, and security rather than pure frontier scaling. ([MacArthur 2025](https://www.macfound.org/press/press-releases/humanity-ai-commits-500-million-to-build-a-people-centered-future-for-ai))
- The Patrick J. McGovern Foundation announced **\$75.8 million** of 2025 grants focused on public institutions, community power, and human-welfare uses of AI. ([PJMF 2025](https://www.mcgovern.org/2025-press-release/))

These examples show why we should not act as though all philanthropy in this space is equivalent to directly buying more compute for OpenAI. But they do not imply the frontier effect is tiny, because many of the outputs of public-interest and academic work are still usable by frontier actors.

---

## 3. Our Point Estimate: 30 Cents on the Dollar

Putting the above together:

- The field is too commercially crowded to give philanthropy anything close to full additionality.
- But this category still includes many projects whose outputs are capability-relevant and spill quickly into frontier systems.
- The category is therefore much more frontier-relevant than generic "tech for good" philanthropy, but much less frontier-relevant than directly buying training compute for the top lab.

Our best all-things-considered estimate is:

$$
a_{\text{frontier}} \approx 0.30
$$

That is, **\$1 donated here is best modeled as about \$0.30 of frontier-equivalent capability acceleration**.

### Plausible Range

- **0.10** if the marginal dollar mainly funds public-interest deployment, broad education, or research that is only loosely tied to the frontier.
- **0.60** if the marginal dollar goes to an open-model effort, a near-frontier university lab, or a recipient whose work is quickly incorporated into frontier systems.

We do not use values close to **1.0** as the default because that would implicitly assume very little crowd-out from the now-enormous private AI sector.

We do not use values close to **0.0** because that would ignore how much academic, open, and infrastructure work now spills over into frontier progress.

---

## 4. Why This Assumption Matters

This single parameter is doing important work in the AGI Development cause:

- It increases the **utopia** effect, because some donations really do help bring forward transformative AI.
- It also increases the **doom** effect, because the same acceleration can increase existential risk.

Users who think this cause is basically direct frontier acceleration should raise this number.
Users who think the relevant charities are mostly public-interest AI, with weak frontier spillovers, should lower it.

{{CONTRIBUTION_NOTE}}
