---
id: education
name: 'Education'
effects:
  - effectId: standard
    startTime: 3
    windowLength: 40
    costPerQALY: 40_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **\$40,000 per QALY**  
**Range (plausible):** **\$15,000–\$120,000 per QALY**

## Details

**What’s included.**  
By “Education charities (wealthy countries)” we mean nonprofits that (a) **raise attainment** (e.g., intensive advising/coaching and student supports that increase degree completion) and/or (b) **improve school climate and student well-being** (e.g., evidence-based anti-bullying/SEL delivered in schools). These are the two pathways most likely to yield measurable QALYs in rich countries.

**Direct QALY evidence from school-based well-being programs.**  
A notable anchor is **KiVa**, an anti-bullying program evaluated in multiple countries. A Swedish decision-analytic model using trial data estimated **€13,823 per QALY** (≈ **\$15,000/QALY**)—well within common cost-effectiveness thresholds for high-income health systems ([Persson et al., 2018](https://pubmed.ncbi.nlm.nih.gov/29728796/); open PDF [here](https://d-nb.info/1162396679/34)). A recent multicenter UK cluster-RCT found small-to-moderate public-health-relevant effects with documented program costs, supporting the plausibility of low-to-mid five-figure \$/QALY results when modeled ([Bowes et al., 2024](https://www.cambridge.org/core/journals/psychological-medicine/article/effects-and-costs-of-an-antibullying-program-kiva-in-uk-primary-schools-a-multicenter-cluster-randomized-controlled-trial/68927DF33AAE39DADF559EE85EAA68F0)). A 2024 review of universal primary-school mental-health programs similarly reports cost-effective or cost-saving results in some settings ([Abou Jaoude et al., 2024](https://link.springer.com/article/10.1007/s12310-024-09642-0)).

**Attainment → health pathway (modeled).**  
Beyond immediate well-being, added schooling is associated with lower adult mortality. A global systematic review/meta-analysis finds **~1.9% lower all-cause adult mortality per additional year of education**—with stronger effects at younger adult ages ([Lancet Public Health 2024](https://pubmed.ncbi.nlm.nih.gov/38278172/)). Causal evidence is mixed: some natural-experiment/MR studies indicate beneficial effects, while others (e.g., Britain’s school-leaving-age reforms) find little or no impact on health or mortality ([Davies et al., 2023](https://pubmed.ncbi.nlm.nih.gov/37463867/); [Clark & Royer, 2013](https://www.aeaweb.org/articles?id=10.1257%2Faer.103.6.2087)). To avoid overstating effects, our conversion from “extra schooling” to QALYs uses a **conservative mapping**: we treat **each additional year of schooling as yielding ~0.1–0.2 QALYs** over the lifetime via longevity and morbidity changes—well below what a naïve application of the observational 1.9% figure would imply, and consistent with the mixed causal literature.

**What top attainment programs can deliver per dollar.**  
Two of the most rigorously studied student-success programs illustrate the cost to generate additional years of schooling:

- **CUNY ASAP** (community-college student support): MDRC's 8-year cost study estimates **~\$9,162 per additional associate degree**—roughly **\$4,600 per added year of education** (2-year degree) ([Azurdia & Galkin, 2020](https://www.mdrc.org/sites/default/files/ASAP_Cost_Working_Paper_final.pdf)).
- **Bottom Line** (intensive advising for low-income, college-ready students): a multi-site RCT finds **+7.6 percentage points** in BA attainment within 5 years ([Barr & Castleman, 2021](https://edworkingpapers.com/sites/default/files/ai21-481.pdf)). Program costs are about **\$4,000 per student** in practice, implying **~\$53,000 per additional BA** or **~\$13,000 per added year of education** on those induced to earn a BA ([Evidence-Based Policy: program brief](https://www.evidencebasedpolicy.org/newsletter/bottomlinecoaching)).

**From years of schooling to QALYs.**
Applying the conservative **0.1–0.2 QALYs per added school-year** mapping to the costs above yields:

- ASAP: **\$4,600 / (0.1–0.2) ≈ \$23,000–\$46,000 per QALY**.
- Bottom Line: **\$13,000 / (0.1–0.2) ≈ \$65,000–\$130,000 per QALY**.

**Bringing it together.**  
If donations are directed to a **portfolio** mixing (i) school-based well-being programs like KiVa (≈ **\$15k/QALY**) with (ii) high-evidence attainment-boosters (≈ **\$25k–\$130k/QALY** under conservative causal assumptions), a reasonable **central estimate** for Education charities in wealthy countries is **about \$40,000 per QALY**, with a **plausible range of \$15,000–\$120,000 per QALY**. This sits above our estimate for direct medical charities in rich countries, but below many health-system willingness-to-pay thresholds (e.g., NICE: ~£20k–£30k/QALY; ICER: ~\$100k–\$150k/QALY), reflecting that some school-based programs directly improve students' quality of life at modest cost, while attainment-focused programs can generate substantial lifetime health value—albeit with larger uncertainty about true causal effects.

**Key sources for readers**

- Attainment → mortality meta-analysis: [Lancet Public Health (2024)](https://pubmed.ncbi.nlm.nih.gov/38278172/).
- Causal evidence (mixed): [Davies et al. (2023)](https://pubmed.ncbi.nlm.nih.gov/37463867/); [Clark & Royer (2013)](https://www.aeaweb.org/articles?id=10.1257%2Faer.103.6.2087).
- Attainment programs: [MDRC ASAP cost study (2020)](https://www.mdrc.org/sites/default/files/ASAP_Cost_Working_Paper_final.pdf); [Bottom Line RCT (2021)](https://edworkingpapers.com/sites/default/files/ai21-481.pdf); cost context ([InsideTrack brief with costs](https://evidencebasedprograms.org/programs/insidetrack-college-coaching/)).
- School well-being programs with QALYs: [KiVa cost-utility (Persson et al., 2018)](https://pubmed.ncbi.nlm.nih.gov/29728796/); review of universal school MH economics ([Abou Jaoude et al., 2024](https://link.springer.com/article/10.1007/s12310-024-09642-0)).

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes

## Start time & duration (for modeling)

- **Start time:** **3 years** (range **0.5–10 years**).  
  _Why:_ School-based programs (e.g., anti-bullying) deliver quality-of-life gains within the school year, while benefits flowing through higher educational attainment (e.g., college completion) begin once students enter adulthood and accrue thereafter. See, e.g., rapid effects in school anti-bullying trials and cost-utility analyses, and longer-lag attainment effects.  
  Sources: KiVa anti-bullying trials and economic evaluations ([Bowes 2024](https://www.cambridge.org/core/journals/psychological-medicine/article/effects-and-costs-of-an-antibullying-program-kiva-in-uk-primary-schools-a-multicenter-cluster-randomized-controlled-trial/68927DF33AAE39DADF559EE85EAA68F0); [Persson et al. 2018](https://pubmed.ncbi.nlm.nih.gov/29728796/)).

- **Duration of benefit:** **40 years** (range **20–60 years**).  
  _Why:_ Health and longevity effects associated with additional education persist across adult life; school climate/mental-health gains can also have long-run sequelae.  
  Sources: Global meta-analysis linking years of schooling to adult mortality risk ([Lancet Public Health 2024](https://pubmed.ncbi.nlm.nih.gov/38278172/)); reviews on educational gradients in life expectancy (e.g., [Sasson 2016](https://link.springer.com/article/10.1007/s13524-015-0453-7)).
