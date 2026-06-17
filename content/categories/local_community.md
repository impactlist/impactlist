---
id: local-community
name: 'Local Community'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 10
    costPerQALY: 29_000
---

# Justification of cost per life

_The following analysis was done on April 14th 2026 by GPT-5.4, with prompts from Impact List staff._

{{STANDARD_QALY_METHOD_NOTE}}

## Description of effect

This effect captures welfare gains from **strong local-community philanthropy in wealthy countries**: local organizations that improve life in a particular city, county, or metro area through a mix of basic-needs support, targeted community health and safety services, caregiver and family support, and other neighborhood-level programs.

This category is necessarily broader and messier than categories such as [Homelessness and Housing](/cause/housing), [Health / Medicine](/cause/health-medicine), or [Social Justice](/cause/social-justice). Many local-community recipients are mixed-service institutions such as food banks, community action agencies, community foundations, caregiver organizations, or generalist community nonprofits. So the right model is not "the single best local health intervention"; it is a **portfolio average across the kinds of good local programs that generalist local charities actually fund**.

The estimate is meant to be **all-things-considered**. It counts hardship relief, stress reduction, caregiver respite, social-role functioning, social connection, and local safety in **QALY-equivalent** terms. The hard question is how much of that welfare strong local charities buy per dollar, not whether those effects sit outside the metric.

## What kinds of charities are we modeling?

This category is best read as a model of **strong local mixed-service charities in wealthy countries** — food banks and community action agencies, local harm-reduction and community-health organizations, caregiver and family-support groups, and mixed-service nonprofits that combine basic needs, referrals, and prevention — not the average unrestricted donation to any community institution.

:::details{title="Good fits vs. poor fits"}
Representative fits include:

- food banks and community action agencies that materially reduce hardship
- local harm-reduction, violence-response, or community-health organizations
- caregiver and family-support organizations
- mixed-service local nonprofits that combine basic needs, referrals, and prevention work

This estimate is **not** a good model of:

- generic local prestige philanthropy
- low-additionality community foundations that mainly regrant to ordinary local causes
- pure housing charities, which should usually be modeled under [Homelessness and Housing](/cause/housing)
- pure health charities, which should usually be modeled under [Health / Medicine](/cause/health-medicine)
- arts, religious, or political organizations, which belong in their own categories
:::

## Point estimates and {{PLAUSIBLE_RANGES}}

The category models a **three-bucket portfolio** of good local programs, with a central cost of about **\$29,000/QALY**. The broader community-support bucket pulls the average cost upward because it receives a large dollar share and is the least cost-effective bucket, while most modeled QALYs come from the targeted health/safety and basic-needs buckets. The plausible range is wide because both the bucket centrals and the real recipient mix are uncertain.

- **Cost per QALY:** \$29,000 (\$10,000–\$185,000)
- **Start time:** 1 year
- **Duration:** 10 years

*If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.*

## Assumptions

{{GLOBAL_ASSUMPTIONS_NOTE}}

1. The **targeted local health and safety** bucket has a central cost-effectiveness of roughly **\$12,000/QALY**, with a plausible range of about **\$2,000–\$50,000/QALY**. This is much worse than the very best examples, but still quite good by rich-country standards. Concrete anchors include proactive smoking-cessation outreach at about **\$905/QALY**, community naloxone distribution at roughly **\$111–\$58,738/QALY**, domestic-violence identification and referral through the IRIS model as likely cost-effective and possibly cost-saving, and home-assessment fall-prevention programs commonly below **\$40,000/QALY**. ([Mundt et al. 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC10922402/), [Cherrier et al. 2021](https://doi.org/10.1007/s41669-021-00309-z), [Devine et al. 2012](https://bmjopen.bmj.com/content/bmjopen/2/3/e001008), [Barbosa et al. 2018](https://bmjopen.bmj.com/content/bmjopen/8/8/e021256), [Olij et al. 2018](https://pubmed.ncbi.nlm.nih.gov/30325013/))
2. The **basic-needs and nutrition-support** bucket has a central cost-effectiveness of roughly **\$30,000/QALY**, with a plausible range of about **\$10,000–\$100,000/QALY**. The strongest "food is medicine" programs appear much better than this: a national produce-prescription model for U.S. adults with diabetes and food insecurity estimated roughly **\$18,100/QALY**, and a more recent state-level model found the intervention cost-saving in most states from the healthcare perspective. Separate utility evidence also suggests food insecurity is associated with large preference-based quality-of-life losses, with adjusted differences of roughly **0.11–0.21** and especially large hits to social-role functioning. So basic-needs support should not be modeled as creating only narrow medical effects. But ordinary local food-bank, pantry, and emergency-assistance philanthropy is usually broader, less medically integrated, and less tightly targeted than produce-prescription programs; the **\$30,000/QALY** central therefore deliberately worsens the best food-as-medicine anchors to approximate ordinary basic-needs charities rather than copying those stronger clinical programs. ([Wang et al. 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10492976/), [Wang et al. 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12451850/), [Hanmer et al. 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8175545/))
3. The **broader community-support** bucket has a central cost-effectiveness of roughly **\$80,000/QALY**, with a plausible range of about **\$40,000–\$500,000/QALY**. This bucket includes caregiver support, community programming, social connection, youth or family support, and broader neighborhood-level prevention work. Focused exemplars are mostly much better than **\$80,000/QALY**: community-based physical-activity interventions often fall around **\$14,000–\$69,000/QALY**, youth depression prevention has been estimated at about **\$24,558/QALY**, online CBT for dementia caregivers at about **£8,130/QALY**, and one multicomponent dementia-caregiver training program appears cost-saving. Separate utility evidence also suggests that these broader community effects belong inside the metric: social isolation is associated with about a **0.04** EQ-5D-5L disutility and loneliness with about **0.07**. But general local-community philanthropy often funds broader institutions with weaker targeting, smaller attributable effects per participant, and more spending on coordination and convening than the focused exemplars, so a category-level benchmark around **\$80,000/QALY** is a better central compromise. ([Roux et al. 2008](https://pubmed.ncbi.nlm.nih.gov/19000846/), [Lynch et al. 2019](https://pubmed.ncbi.nlm.nih.gov/30929618/), [Henderson et al. 2022](https://pubmed.ncbi.nlm.nih.gov/35395216/), [Birkenhäger-Gillesse et al. 2022](https://pubmed.ncbi.nlm.nih.gov/35774593/), [Wilson et al. 2009](https://pubmed.ncbi.nlm.nih.gov/19101921/), [König and Hajek 2024](https://pubmed.ncbi.nlm.nih.gov/39707414/))
4. A reasonable central dollar split for this category is roughly **20% targeted local health and safety**, **40% basic-needs and nutrition support**, and **40% broader community-support programs**. This is still a judgment call, but it is grounded in the actual recipient universe motivating the category. Obvious basic-needs fits include food banks and community action agencies; obvious community-support fits include caregiver organizations, community centers, municipalities, and general local institutions; only a minority of recipients look like tightly targeted local health/safety charities. That makes a 40/40 split between the latter two buckets more defensible than a more community-support-heavy mix.
5. The strongest local-community opportunities are usually **less cost-effective than the best rich-country health programs**, because mixed-service local institutions have looser targeting, broader beneficiary pools, and lower attributable welfare gains per dollar even after counting stress relief, dignity, social connection, and stability in QALY-equivalent terms.
6. Benefits usually begin within about **1 year**, because most local-community programs deliver services quickly once funded.
7. A **10-year duration** is a reasonable central modeling choice. Some benefits are short-lived, such as temporary food support or crisis stabilization, while others such as smoking cessation, violence prevention, fall prevention, and caregiver support can plausibly persist for many years.

## Details

### Cost per QALY

Combining the three buckets by their dollar shares gives about **\$28,600/QALY**, which we round to a point estimate of **\$29,000/QALY**.

:::details{title="The three-bucket portfolio formula and worked arithmetic"}
The cleanest model for this category is a three-bucket portfolio:

$$  
\text{Cost per QALY} = \dfrac{1}{\frac{h}{H} + \frac{b}{B} + \frac{s}{S}}
$$

Where:

- $h$ = share of dollars going to targeted local health and safety services
- $H$ = cost per QALY for that bucket
- $b$ = share of dollars going to basic-needs and nutrition support
- $B$ = cost per QALY for that bucket
- $s$ = share of dollars going to broader community-support programs
- $S$ = cost per QALY for that bucket

Using the central assumptions:

- $h$ = 0.20
- $H$ = \$12,000
- $b$ = 0.40
- $B$ = \$30,000
- $s$ = 0.40
- $S$ = \$80,000

So:

$$
\text{QALYs per dollar} = \frac{0.20}{12{,}000} + \frac{0.40}{30{,}000} + \frac{0.40}{80{,}000}
$$

$$
\text{QALYs per dollar} \approx 0.0000350
$$

$$
\text{Cost per QALY} \approx \dfrac{1}{0.0000350} \approx 28{,}600
$$
:::

Each bucket central is set as a substantial haircut from the best published exemplars, because ordinary local philanthropy has weaker targeting, broader beneficiary pools, and more spending on coordination than the trials that produce those exemplars.

:::details{title="Why each bucket central sits well above its best exemplars"}
**Targeted health/safety — \$12,000/QALY.** The best concrete exemplars are much cheaper: smoking-cessation outreach at about **\$905/QALY** is especially strong, and IRIS may be cost-saving. But the bucket also needs to cover more ordinary local harm-reduction, violence-response, and fall-prevention work, where targeting is less sharp than in published trials, referral pathways and take-up are imperfect, local nonprofits may lack the implementation quality of large health-system pilots, and some programs are valuable mainly because they reach hard-to-serve populations, which tends to worsen measured cost-effectiveness. So **\$12,000/QALY** is a substantial haircut from the very best interventions, not the average of the published best cases. That haircut is why this bucket can still plausibly beat the broader [Health / Medicine](/cause/health-medicine) average: it is a selected sub-bucket of especially tractable local interventions rather than a model of generic health philanthropy.

**Basic-needs and nutrition — \$30,000/QALY.** The best food-as-medicine evidence is extremely encouraging, and Hanmer et al. shows food insecurity is associated with large preference-based quality-of-life losses (adjusted utility differences of about **0.11-0.21**, with the biggest domain hit in ability to participate in social roles), so basic-needs support should not be read as producing only biomarker or hospitalization effects. But many local-community recipients are food banks, pantries, emergency-assistance programs, or community action organizations rather than clinically targeted nutrition programs for high-risk patients — broader beneficiary mixes, lighter-touch delivery, and weaker medical integration — so the right category-level number is still materially worse than the best produce-prescription estimates, and **\$30,000/QALY** is a reasonable compromise. ([Hanmer et al. 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8175545/))

**Broader community support — \$80,000/QALY.** This is the main reason the category is not close to [Health / Medicine](/cause/health-medicine). The better published exemplars mostly land well below **\$80,000/QALY**, and the loneliness / social-isolation utility evidence is a reminder that belonging, connection, and stress reduction belong inside the welfare total. But the actual recipient universe also includes community centers, civic institutions, caregiver organizations, municipalities, and other mixed-purpose local institutions with weaker targeting, smaller effects per participant, and more spending on coordination and convening than the better trials, so a number above the focused exemplars is warranted and **\$80,000/QALY** is a better central compromise than a harsher haircut that would treat these broader welfare gains as second-class. ([König and Hajek 2024](https://pubmed.ncbi.nlm.nih.gov/39707414/))
:::

The portfolio mix matters a lot: holding the bucket centrals fixed, shifting weight toward the cheaper health/safety and basic-needs buckets pulls the category to about **\$23,800/QALY**, while a community-support-heavy mix pushes it to about **\$38,700/QALY**. This is appropriate — a city-focused charity that mostly does food security and targeted support can be much better than a community foundation or civic umbrella that funds many diffuse projects.

:::details{title="Sensitivity to the portfolio mix"}
Holding the bucket-level estimates fixed at **\$12,000/QALY**, **\$30,000/QALY**, and **\$80,000/QALY**:

- **30% / 40% / 30%** across health/safety, basic-needs, and broader community support gives about **\$23,800/QALY**
- **20% / 40% / 40%** gives about **\$28,600/QALY**
- **10% / 30% / 60%** gives about **\$38,700/QALY**
:::

The plausible range of about **\$10,000-\$185,000/QALY** is kept deliberately wide, and we publish it near the case where every input is pushed to its favorable or unfavorable edge at once. That is appropriate here because the inputs are correlated and the biggest uncertainties sit outside them: a single "how much worse is ordinary local philanthropy than the best trials" worldview moves all three bucket centrals together, and the dominant uncertainties — how broad the real recipient mix is, and how much local charities add on top of what government and insurers would have funded anyway — are not captured by the four parameters at all, so the true tails plausibly run past these bounds rather than inside them.

:::details{title="Optimistic and pessimistic bound calculations"}
**Optimistic case**

- health/safety bucket: **\$5,000/QALY**
- basic-needs bucket: **\$15,000/QALY**
- broader community-support bucket: **\$50,000/QALY**
- mix: **30% / 45% / 25%**

This gives:

$$
\dfrac{1}{0.30/5000 + 0.45/15000 + 0.25/50000} \approx 10{,}500
$$

**Pessimistic case**

- health/safety bucket: **\$50,000/QALY**
- basic-needs bucket: **\$100,000/QALY**
- broader community-support bucket: **\$500,000/QALY**
- mix: **10% / 20% / 70%**

This gives:

$$
\dfrac{1}{0.10/50000 + 0.20/100000 + 0.70/500000} \approx 185{,}000
$$

Rounded, that gives a plausible range of about **\$10,000-\$185,000/QALY**.
:::

### Start time

The **1-year** start time reflects that local-community charities usually begin delivering benefits quickly. Food support, caregiver support, crisis response, smoking-cessation outreach, and neighborhood programs can all begin affecting participants within months, even if some downstream health gains show up later.

### Duration

The **10-year** duration reflects the fact that this is a mixed-service category rather than a pure long-tail health category:

- some benefits are brief, such as temporary food support or short-term stabilization
- some persist for several years, such as caregiver mental-health improvements or physical-activity changes
- some can last much longer, such as smoking cessation or avoided serious injury from violence or falls

So although a minority of the portfolio has very long downstream tails, much of it does not. A 10-year window is therefore a better central approximation for a mixed local-community portfolio than a duration anchored mainly on the longest-lived interventions.

## Key uncertainties

1. **How broad the real recipient mix is.** If the typical local-community recipient is closer to a food-and-health nonprofit than to a civic umbrella institution, the category is better than **\$29,000/QALY**. If it is mostly the latter, it is worse.

2. **How far to move the bucket centrals away from focused exemplars.** Produce prescriptions, smoking cessation, and some caregiver programs look very strong in clean evaluations. The main modeling question is how much worse ordinary local philanthropy is than those exemplars once weaker targeting, broader institutions, and more diffuse recipient mixes are brought into the model.

3. **Additionality.** Some local charities fill real gaps that government and insurers would not otherwise cover. Others mainly substitute for spending that would have happened anyway.

4. **How large the broader-welfare gains are in ordinary local programs.** Food insecurity, caregiver strain, loneliness, dignity, stability, and social-role functioning all belong in the welfare total. The hard question is how much benefit strong local charities create on those margins per dollar, especially in the broader community-support bucket.

5. **Overlap with other categories.** Some recipients tagged here probably deserve stronger recipient-level overrides or cleaner allocation to [Homelessness and Housing](/cause/housing), [Health / Medicine](/cause/health-medicine), or [Social Justice](/cause/social-justice).

{{CONTRIBUTION_NOTE}}

# Internal Notes

- The broadest modeling judgment is still the **community-support bucket**. It should be read as an all-things-considered QALY-equivalent benchmark, not as a health-only figure.
- Future editors should strongly consider recipient-level overrides for broad community foundations and civic umbrellas. Their effectiveness can vary by orders of magnitude depending on what they actually fund.
- If the site later adds a dedicated category for `food security` or `caregiver support`, this file could probably move downward a bit in uncertainty because two of the messiest buckets would become cleaner.
