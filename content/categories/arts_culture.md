---
id: arts-culture
name: 'Arts, Culture, Heritage'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 1
    costPerQALY: 23_000
---

# Justification of cost per life

_The following analysis was done on April 6th 2026 by GPT-5.4 (Extra High) and Claude Opus 4.6 (Max), with prompts from Impact List staff._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures charities that improve health and wellbeing by increasing direct participation in arts, culture, and heritage activities: arts-on-prescription programmes, community choirs, dance and creative workshops, and structured museum or heritage engagement. We model charities that pay for access, facilitation, and outreach to people with elevated loneliness, mild-to-moderate mental-health burden, or older age.

We do **not** model preservation, elite arts production, or broad subsidy to cultural institutions unless they clearly translate into direct, attributable participation gains. The evidence for those broader pathways is much weaker from a donor-effectiveness perspective.

## Point Estimates

- **Cost per QALY:** \$23,000 (\$9,000–\$60,000)
- **Start time:** 1 year
- **Duration:** 1 year

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

1. The strongest causal evidence is for structured participatory programmes and targeted access programmes, not for broad arts subsidy or heritage preservation in the abstract. ([WHO scoping review](https://www.ncch.org.uk/uploads/WHO-Scoping-Review-Arts-and-Health.pdf), [DCMS/Frontier 2024](https://worldheritageuk.org/wp-content/uploads/2025/01/DCMS-Frontier-Economics-Health-and-Wellbeing-Report-Nov-2024.pdf), [Jensen et al. 2024](https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2024.1412306/full))
2. A community singing RCT in older adults found that the intervention group gained 0.015 more QALYs over 6 months than controls. The authors concluded that the programme was marginally more cost-effective than usual activities, with a 64% probability of being cost-effective at a £30,000/QALY threshold. ([Coulton et al. 2015](https://www.cambridge.org/core/journals/the-british-journal-of-psychiatry/article/effectiveness-and-costeffectiveness-of-community-singing-on-mental-healthrelated-quality-of-life-of-older-people-randomised-controlled-trial/516558F0DDD7D4DD0197FDDEAD30ED85))
3. DCMS/Frontier's 2024 modelling of a weekly 12-week museum-based arts programme for older adults implies roughly 0.009-0.017 QALYs per participant, depending on persistence assumptions, based on the underlying RCT evidence. ([DCMS/Frontier 2024](https://worldheritageuk.org/wp-content/uploads/2025/01/DCMS-Frontier-Economics-Health-and-Wellbeing-Report-Nov-2024.pdf), [Beauchet et al. 2022](https://pubmed.ncbi.nlm.nih.gov/35578103/))
4. Real-world Arts on Prescription programmes appear to generate meaningful wellbeing gains: Jensen et al.'s 2024 meta-analysis found an average WEMWBS improvement of 5.82 points (95% CI 4.90-6.75). ([Jensen et al. 2024](https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2024.1412306/full))
5. Benefits are larger in programmes that reach people with elevated baseline need and maintain strong attendance. In the ArtGran museum programme for older adults, higher attendance was associated with significantly lower loneliness and better quality-of-life subscales. ([Mouriño-Ruiz et al. 2024](https://pubmed.ncbi.nlm.nih.gov/38552347/))
6. A reasonable central estimate for a completed participant-course is 0.015 QALYs, with a plausible range of 0.01-0.02 QALYs. The central figure is anchored on the Coulton RCT and corroborated by the DCMS/Frontier museum model, while the range allows for both weaker real-world implementation and stronger targeted programmes. ([Coulton et al. 2015](https://www.cambridge.org/core/journals/the-british-journal-of-psychiatry/article/effectiveness-and-costeffectiveness-of-community-singing-on-mental-healthrelated-quality-of-life-of-older-people-randomised-controlled-trial/516558F0DDD7D4DD0197FDDEAD30ED85), [DCMS/Frontier 2024](https://worldheritageuk.org/wp-content/uploads/2025/01/DCMS-Frontier-Economics-Health-and-Wellbeing-Report-Nov-2024.pdf))
7. Coulton reports total delivery cost of £176.84 per session. Table 3's participant-cost column sums to £18.88, which implies about £264 for a participant who completes a 14-session course. That trial costing already includes training, management, and administration. Allowing some additional room for outreach/access support, completion risk, and charity-level overhead gives a reasonable central donor cost of about \$350 per completed participant-course, with a plausible range of roughly \$175-\$600. Social prescribing economic reviews note that voluntary/community-sector and other direct non-medical costs are often omitted from published analyses. ([Coulton et al. 2015](https://www.cambridge.org/core/journals/the-british-journal-of-psychiatry/article/effectiveness-and-costeffectiveness-of-community-singing-on-mental-healthrelated-quality-of-life-of-older-people-randomised-controlled-trial/516558F0DDD7D4DD0197FDDEAD30ED85), [NASP economic review](https://socialprescribingacademy.org.uk/media/carfrp2e/evidence-review-economic-impact.pdf))
8. The best-supported benefits last for roughly 3-6 months after programme start, with some extension when people keep attending or form durable social ties. Evidence for benefits beyond a year is thin, so long-duration estimates should be heavily discounted. ([Coulton et al. 2015](https://www.cambridge.org/core/journals/the-british-journal-of-psychiatry/article/effectiveness-and-costeffectiveness-of-community-singing-on-mental-healthrelated-quality-of-life-of-older-people-randomised-controlled-trial/516558F0DDD7D4DD0197FDDEAD30ED85), [Sumner et al. 2021](https://pubmed.ncbi.nlm.nih.gov/33631514/), [DCMS/Frontier 2024](https://worldheritageuk.org/wp-content/uploads/2025/01/DCMS-Frontier-Economics-Health-and-Wellbeing-Report-Nov-2024.pdf))
9. Broad observational evidence linking cultural engagement to lower depression and dementia risk is suggestive, but not clean enough to drive the central estimate because selection effects remain substantial. ([Fancourt & Tymoszuk 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6758670/), [WHO scoping review](https://www.ncch.org.uk/uploads/WHO-Scoping-Review-Arts-and-Health.pdf), [DCMS/Frontier 2024](https://worldheritageuk.org/wp-content/uploads/2025/01/DCMS-Frontier-Economics-Health-and-Wellbeing-Report-Nov-2024.pdf))
10. Real-world social prescribing evaluations provide a useful but noisy cross-check. Doncaster reported £1,963 per QALY, while City and Hackney reported £20,100 per QALY. Both should be treated cautiously: Doncaster used a short horizon and a less rigorous evaluation design, while the City and Hackney estimate was based on only 59 participants, only 3 months of QALY measurement, and omitted voluntary/community-sector costs. ([Dayson & Bennett 2016](https://www4.shu.ac.uk/research/cresr/sites/shu.ac.uk/files/eval-doncaster-social-prescribing-service.pdf), [NASP 2023 briefing](https://socialprescribingacademy.org.uk/media/2uxfx40g/building-the-economic-case-for-social-prescribing-briefing-october-2023.pdf))
11. The economic evidence base is still thin. A 2023 systematic review of economic evaluations in older adults found only six eligible studies and concluded that the evidence was encouraging but still too limited to support very precise cost-effectiveness claims. ([Crealey et al. 2023](https://link.springer.com/article/10.1186/s12889-023-17369-x))

## Details

### Cost per QALY

The right way to model this category is **not** to start from the claim that "arts are good for people" and then assume that any arts donation inherits that benefit. The literature is strongest for a narrower claim: structured, donor-funded participation programmes can improve mental health and quality of life for specific groups, especially older adults and people with low baseline wellbeing.

So the estimate is built around charities that buy actual participation: artist-led group sessions, museum programmes, community choirs, and arts-on-prescription courses.

**Step 1: Estimate QALY gain per completed participant-course**

The cleanest direct QALY anchor is the community singing RCT. It found an incremental gain of **0.015 QALYs over 6 months** for the intervention group relative to controls (Assumption 2). That figure is useful because it is a direct QALY estimate rather than a chain of conversions from intermediate wellbeing measures. But it is still only one RCT, so it should be treated as an anchor rather than as a settled parameter.

That number is in the same ballpark as the DCMS/Frontier 2024 museum model. Using the underlying RCT on weekly museum-based arts activities for older adults, Frontier's HTA valuation implies roughly **0.009-0.017 QALYs per participant**, depending on whether one assumes a short or somewhat longer persistence of benefits (Assumption 3).

The broader Arts on Prescription literature is less causal, because many studies lack control groups, but it points in the same direction rather than contradicting the trials. Jensen et al.'s meta-analysis found a **5.82-point average WEMWBS improvement**, which suggests that the trial results are not just isolated statistical noise (Assumption 4).

The ArtGran results are also useful conceptually here. They suggest that benefits are larger when programmes reach people with elevated baseline need and sustain attendance, which is why this estimate is meant to represent targeted access programmes rather than average cultural participation (Assumption 5).

Putting those together, a reasonable central estimate is:

- **Central participant benefit:** 0.015 QALYs
- **Optimistic participant benefit:** 0.02 QALYs
- **Pessimistic participant benefit:** 0.01 QALYs

Both direct QALY anchors are from older-adult populations; QALY gains may differ for younger groups, though the broader Arts on Prescription wellbeing literature spans a wider age range (Assumption 4).

We intentionally do **not** use the more dramatic observational literature on lower depression or dementia risk from cultural attendance to push the estimate higher, because those studies are much more vulnerable to selection effects (Assumption 9).

**Step 2: Estimate donor cost per completed participant-course**

Here the literature is worse. We have some direct programme costing, but not enough to support false precision.

Coulton reports total delivery and training cost of **£176.84 per session** for the choir intervention. Table 3 also reports a participant-cost column that sums to **£18.88**. Taken together, that implies roughly **£264 per participant** for a full 14-session course. In other words: the trial micro-costing points to a direct programme cost in the low-to-mid **\$300s** per completed participant-course, not just a few dollars.

That makes a central donor cost of about **\$350 per completed participant-course** plausible (Assumption 7). The number is slightly above the direct trial micro-costing because a donor funds a whole operating charity rather than only delivery inside the room, and published social prescribing evaluations often omit some non-medical and voluntary-sector costs. The lower bound of **\$175** represents unusually lean delivery or lower-cost settings; the upper bound of **\$600** allows for higher support intensity, attrition, and broader overhead.

**Step 3: Combine the two**

Our point estimate is:

$$\text{Cost per QALY} = \dfrac{\$350}{0.015} \approx \$23{,}300/\text{QALY}$$

Illustrative bounds:

- **Optimistic:** \$175 / 0.02 = \$8,750/QALY
- **Pessimistic:** \$600 / 0.01 = \$60,000/QALY

That yields a point estimate of about **\$23,000/QALY** with a range of about **\$9,000-\$60,000/QALY**.

As a sanity check, this bottom-up estimate is in the same neighborhood as real-world UK social prescribing evaluations (Assumption 10). Doncaster's **£1,963/QALY** result is much better than the central estimate here, but it comes from a less rigorous evaluation and short-horizon extrapolation. City and Hackney's **£20,100/QALY** estimate is closer to the central estimate here, but it was based on only **59 participants**, only **3 months** of QALY measurement, and omitted some voluntary/community-sector costs. Those evaluations are too fragile to anchor the model by themselves, but they make a low-to-mid tens-of-thousands estimate look plausible rather than anomalous.

Another reason for the wide range is that the underlying economic literature is still small and heterogeneous. With only a handful of eligible cost-effectiveness studies and many non-randomized programme evaluations, publication bias and selective reporting remain live concerns even if the published evidence is generally encouraging (Assumption 11).

One factor not explicitly modeled above is the funding counterfactual: what fraction of participation would have happened without the donor's contribution? The RCT evidence already addresses the individual-level counterfactual by comparing participation against usual activities, but it does not answer the funding-fungibility question. For targeted charities serving people who lack easy alternative access, the counterfactual case is stronger than it would be for general arts institutions. But it is not zero, especially in high-income settings where programmes often combine philanthropic, public, and earned funding. That uncertainty is better thought of as one reason for the wide range than as a parameter that can currently be estimated with much precision.

We also do **not** separately credit NHS savings or productivity gains in the central figure, even though some studies and the DCMS report suggest they exist. That keeps the estimate focused on participant welfare and avoids double counting.

### Start Time

The 1-year start time reflects grant cycles, partnership-building, facilitator hiring, and participant recruitment. Once a programme is operating, benefits can begin within weeks, but the time from donation to a functioning referral or outreach pipeline is often several months.

### Duration

The 1-year duration reflects that the strongest evidence is for benefits that accrue during an 8-14 week programme and persist for some months afterward. Some participants continue informally, get re-referred, or retain new social ties, but the evidence for strong benefits beyond a year is weak. A 1-year window is a reasonable expected-value estimate across programmes.

### Notes on heritage

We only give heritage funding credit here when it changes participation or access: museum prescribing, guided heritage activities, or culturally meaningful group programmes. We do **not** assume that preservation, restoration, or general institutional subsidy has the same cost-effectiveness as direct participation programmes, because the causal link from marginal donor dollar to participant wellbeing is much less clear.

{{CONTRIBUTION_NOTE}}

# Internal Notes

- This category should be read as a model of the **best-supported participation charities in arts/culture**, not of generic arts philanthropy.
- The biggest uncertainties are real-world per-participant cost, the size of counterfactual participation gains from donor funding, and how fast benefits decay after the programme ends.
- If future evidence produces a credible multi-site RCT or pragmatic trial for arts-on-prescription with direct EQ-5D outcomes and real programme budgets, that should probably become the new primary anchor for this file.
