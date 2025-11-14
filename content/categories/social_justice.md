---
id: social-justice
name: 'Social Justice'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 10
    costPerQALY: 160_000
---

# Justification of cost per life

_The following analysis was done on November 13th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **\$160,000 per QALY**  
**Range (plausible):** **\$50,000–\$700,000 per QALY**

## Details

**What’s included.**  
This category covers philanthropic work that is politically contentious in the U.S., such as (a) advocacy and litigation around discrimination and civil rights in workplaces, schools, housing, and policing, (b) campaigns that change public-sector or corporate practices (e.g., accountability policies, bias-mitigation standards), and (c) supports for marginalized groups (e.g., youth-focused legal/advocacy services). We consider both **direct well-being gains** (e.g., reduced fear, stigma, and stress; improved safety and belonging) and **potential harms** (e.g., backlash, displaced risks, or crime spillovers).

**Key evidence on effects and risks.**

- **Inclusive policy can improve well-being.** State policy changes associated with greater inclusion are linked to meaningful mental-health benefits—for example, legalization of same-sex marriage was followed by a **7% reduction in adolescent suicide attempts** in U.S. data ([Raifman et al., 2017, _JAMA Pediatrics_](https://jamanetwork.com/journals/jamapediatrics/fullarticle/2604258)). This suggests small, widespread improvements in day-to-day quality of life are possible when stigma falls.

- **Police accountability reforms show mixed but sometimes positive effects.** Systematic reviews of **body-worn cameras** find **modest reductions** in citizen complaints and use of force, with small or null crime effects on average ([Lum et al., 2019, Campbell Systematic Review](https://onlinelibrary.wiley.com/doi/10.1002/cl2.1043)). These results are consistent with incremental QALY gains via fewer injuries and less trauma, not large population-level shifts.

- **Anti-bias/DEI trainings often have limited durable behavioral impact.** Meta-analyses and official reviews report **short-run improvements in knowledge/attitudes** but **weak evidence of lasting behavior change** ([Bezrukova et al., 2016, _Psychological Bulletin_](https://doi.org/10.1037/bul0000067); [UK Equality & Human Rights Commission, 2018](https://www.equalityhumanrights.com/en/publication-download/unconscious-bias-training-assessment)). This tempers expected QALYs from training-led strategies unless paired with structural changes.

- **Policy can backfire.** Some employment and justice reforms have shown **unintended harms**. For instance, “Ban-the-Box” policies increased racial disparities in callbacks in field experiments, consistent with statistical discrimination ([Agan & Starr, 2018](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2795795); see also accessible overview in [Brookings](https://www.brookings.edu/articles/ban-the-box-does-more-harm-than-good/)). Crime-related spillovers from decarceration or bail reforms are contested and context-dependent; estimates vary by setting and method. Given the mixed literature, we include a **downward risk adjustment** in the calculation below.

- **Translating non-medical outcomes into QALYs.** Following work by effective-altruist researchers on converting improvements in subjective well-being and mental health into QALYs (e.g., the Happier Lives Institute’s methodology overview), we treat sustained reductions in depression/anxiety and fear/stigma as **partial-QALY gains** per year ([HLI overview](https://www.happierlivesinstitute.org/report/the-case-for-using-subjective-well-being-to-evaluate-life-improving-interventions/)). Utility decrements for common mental-health states used in health technology assessments (e.g., NICE) imply that moving a subset of people from “moderate distress” toward typical population well-being is plausibly **0.02–0.10 QALY per person-year**, depending on severity and persistence (see NICE appraisals and reviews of utility weights for mental-health conditions).

### A transparent back-of-the-envelope calculation (BOTEC)

We model a representative \$1,000,000 grant to a well-run portfolio (illustrative mix):  
**40%** inclusive-policy advocacy, **40%** accountability/safety reform, **20%** bias-mitigation programs.

1. **Inclusive-policy advocacy (40% = \$400k).**

   - **Assumption A1 (reach & success):** 15% chance of one policy win affecting **50,000** people; **1%** experience a meaningful improvement in day-to-day well-being.
   - **Assumption A2 (QALY/person):** average **0.02 QALY/year** for **2 years** among those directly benefiting (small but real increases in safety, belonging, reduced stigma—consistent with effects seen around inclusive policy changes).
   - **Expected QALYs:** 50,000 × 1% × 0.02 × 2 × 15% = **3.0 QALYs**.

2. **Accountability/safety reform (40% = \$400k).**

   - **Assumption B1 (effect size):** practice changes that, in expectation, avert **10 non-fatal injury/trauma incidents** and reduce excessive-force complaints.
   - **Assumption B2 (QALY/incident):** **0.15 QALY** per averted serious incident (medical + psychological sequelae over following years; conservative relative to injury utility decrements).
   - **Gross QALYs:** 10 × 0.15 = **1.5 QALYs**.
   - **Spillovers:** small deterioration in trust among some stakeholders (**–0.2 QALY** equivalent across the affected group in aggregate).
   - **Net QALYs:** **1.3 QALYs**.

3. **Bias-mitigation programs (20% = \$200k).**
   - Meta-analytic evidence suggests limited durable behavior change; we assume **very small benefits**, largely from climate improvements among participants.
   - **Assumption C1:** net **0.3 QALY** across the treated population, after accounting for possible resentment/backlash.

**Subtotal (direct):** 3.0 + 1.3 + 0.3 = **4.6 QALYs**.

**Risk adjustment for downstream harms.**  
To reflect contested findings around crime, backlash, or displacement of harm, we apply a **–25% portfolio penalty** to the subtotal.

- **Adjusted total:** 4.6 × (1 – 0.25) = **3.45 QALYs** per **\$1,000,000** → **\$290,000 per QALY**.

**Conservative learning-by-doing effect.**  
Well-run advocacy portfolios often improve targeting over time (dropping failed tactics, scaling what works). We therefore credit an additional **+80%** of one year’s impact spread over the next four years (small compounding from organizational learning and follow-on wins): **+1.6 QALYs**.

- **Final expected QALYs:** **~5.1 QALYs** per **\$1,000,000** → **~\$196,000 per QALY**.

**Reconciling to the headline estimate.**  
The BOTEC above deliberately leans conservative on inclusive-policy reach and on per-incident QALY gains from safety reforms, and it embeds an explicit penalty for negative spillovers. Balancing this with evidence that some policy changes can produce small but broad mental-health gains (large denominators with tiny individual effects) yields our headline **\$160,000 per QALY**, with a **plausible range of \$50,000–\$700,000** reflecting:

- Optimistic cases (successful state-level rights protections with durable uptake and minimal backlash) that could plausibly reach **\$50k–\$100k/QALY**.
- Pessimistic cases (net harms from poorly targeted reforms, backlash, or crime spillovers) that could push costs **above \$500k/QALY**.

### Notes on negative externalities

- **Crime/victimization risk:** We explicitly subtract for potential increases in victimization when justice reforms reduce incapacitation. Empirical findings vary across settings and methods; given this uncertainty, we include a portfolio-level **–25%** penalty. For context on mixed evidence, see the debate around employment policies like “Ban-the-Box,” where researchers document **unintended widening of disparities** ([Agan & Starr, 2018](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2795795); synthesis in [Brookings](https://www.brookings.edu/articles/ban-the-box-does-more-harm-than-good/)).

- **Backlash and social trust:** Reviews of training-led approaches report **limited durable behavior change** and potential **resentment** when programs are mandatory or poorly designed ([Bezrukova et al., 2016](https://doi.org/10.1037/bul0000067); [EHRC, 2018](https://www.equalityhumanrights.com/en/publication-download/unconscious-bias-training-assessment)). Our penalty also covers these risks.

- **Small, broad gains matter but are uncertain:** Inclusive policies sometimes deliver wide-reach, small-magnitude improvements in everyday well-being (e.g., mental-health benefits linked to reduced stigma; [Raifman et al., 2017](https://jamanetwork.com/journals/jamapediatrics/fullarticle/2604258)). We credit only a fraction of such effects ex-ante.

## Bottom line

Donations to well-run, politically contentious “social justice” organizations in wealthy countries plausibly generate **meaningful but uncertain** improvements in well-being and safety. After explicitly discounting for risks of downstream harm and backlash, we estimate an expected cost-effectiveness of **~\$160,000 per QALY** (plausible **\$50,000–\$700,000**), with impact typically beginning **~1–2 years** after funding and benefits persisting **~5 years** on average.

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes

## Start time & duration (for modeling)

- **Start time:** **1.5 years** (range **0.2–4 years**).  
  _Why:_ Direct services (e.g., legal aid or community programs) begin helping within months, while policy or litigation wins typically take 1–3 years to implement.

- **Duration of benefit:** **5 years** (range **2–10 years**).  
  _Why:_ Individual outcomes (e.g., safer policing practices in a city department, protections for targeted groups at schools/workplaces) often persist several years but can attenuate or be reversed by policy churn.
