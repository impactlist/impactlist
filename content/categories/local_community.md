---
id: local-community
name: 'Local Community'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 15
    costPerQALY: 12_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **\$12,000 per QALY**  
**Range (plausible):** **\$2,000–\$60,000 per QALY**

## Details

**What we include as “Local Community.”**  
This category covers community-level charities in rich countries that deliver direct, evidence-backed services to local residents—e.g., harm-reduction and overdose prevention, smoking-cessation outreach, primary-care-linked domestic-violence identification/referral, and fall-prevention for older adults. These are often run by local nonprofits in partnership with health and social-care providers.

**Representative top-tier interventions and their cost-per-QALY evidence**

- **Community naloxone distribution (harm reduction).**  
  A systematic review of economic evaluations found **all studies** concluded community naloxone distribution is cost-effective, with **ICURs ranging from \$111–\$58,738 per QALY** (2020 USD). Cost-effectiveness improves with higher overdose risk and bystander willingness to intervene.  
  Source: [Cherrier et al., 2021, _PharmacoEconomics – Open_](https://doi.org/10.1007/s41669-021-00309-z). See also policy-relevant modeling and reviews on overdose-prevention centers and statewide distribution efforts: [Behrends et al., 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11069439/); [Zang et al., 2024](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2819204).

- **Smoking-cessation outreach and treatment (community/primary-care linked).**  
  A recent US implementation study reported **\$905 per QALY** (95% CI \$822–\$1,001) for a comprehensive outreach + medication + counseling program in real-world clinics; other proactive quitline/outreach models typically report **low-thousands \$ per QALY**.  
  Sources: [Mundt et al., 2023/2024](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10922402/); [Thao et al., 2019](https://onlinelibrary.wiley.com/doi/10.1111/add.14752); summary slide deck with the same ICER: [Mundt 2024](https://ctri.wisc.edu/wp-content/uploads/sites/240/2024/08/Mundt_CostEffectiveness_2024_Slides.pdf). Background on long-run health gains from quitting: [US Surgeon General, 2020](https://www.hhs.gov/sites/default/files/2020-cessation-sgr-full-report.pdf).

- **Domestic-violence identification and referral (IRIS model).**  
  UK evaluations of the IRIS program find **QALY gains with net cost savings** (dominant vs. usual care) from a societal perspective; the updated IRIS+ model remained cost-effective and often cost-saving over a 10-year horizon.  
  Sources: [Devine et al., 2012, _BMJ Open_](https://bmjopen.bmj.com/content/bmjopen/2/3/e001008.full.pdf); [Barbosa et al., 2018, _BMJ Open_](https://bmjopen.bmj.com/content/bmjopen/8/8/e021256.full.pdf); [Cochrane et al., 2024, _BMJ Open_](https://openaccess.city.ac.uk/id/eprint/33017/1/e071300.full.pdf).

- **Home-safety assessment & modifications (falls prevention).**  
  A systematic review of economic evaluations concluded that **home assessment programs** were the **most cost-effective** approach for community-dwelling older adults, commonly **< \$40,000 per QALY**; medication-adjustment programs in care facilities were often **< \$13,000 per QALY**.  
  Sources: [Olij et al., 2018, _J Am Geriatrics Soc_](https://shantysterke.nl/wp-content/uploads/2018/12/J-Am-Geriatr-Soc.pdf); supporting observational and claims-based evidence: [Niedermann et al., 2024](https://bmcgeriatr.biomedcentral.com/articles/10.1186/s12877-024-05586-x).

**How we arrive at the estimate.**  
Taking the **central** cost-per-QALY figures from these well-evidenced community programs—naloxone distribution (~\$5k–\$15k typical; wide range by context), smoking-cessation outreach (~\$1k–\$5k), home-safety/falls prevention (~\$20k–\$40k for community dwellers), and IRIS (often cost-saving)—and **averaging across them for a representative “top charity” portfolio** yields an order-of-magnitude estimate near **\$12,000 per QALY**. The **range (\$2k–\$60k)** reflects: (i) variation across local epidemiology and implementation (e.g., overdose prevalence, age in fall-prevention, population risk), (ii) program design (intensity, staffing, uptake), and (iii) currency/year assumptions in the source studies.

**Bottom line.**  
In wealthy countries, high-performing **local community charities** that target pressing problems (overdose, smoking, domestic violence, injurious falls) can routinely achieve **low- to mid-five-figure dollar costs per QALY**, with some models **cost-saving**. A prudent point estimate for donations aimed at the best-evidenced opportunities in this space is **about \$12,000 per QALY**.

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes

## Start time & duration (for modeling)

- **Start time:** **0.25 years** (range **0–0.5 years**).  
  _Why:_ Benefits from leading community programs generally begin quickly: naloxone distribution prevents overdose deaths immediately; fall-prevention home visits and modifications reduce injuries within months; domestic-violence advocacy and smoking-cessation outreach produce near-term gains as services start. (Examples: naloxone economic review and effectiveness summaries; a 12-month fall-prevention evaluation; smoking-cessation clinical and system-level strategies.)  
  Sources: [Cherrier et al., 2021](https://doi.org/10.1007/s41669-021-00309-z); [Niedermann et al., 2024](https://bmcgeriatr.biomedcentral.com/articles/10.1186/s12877-024-05586-x); [US Surgeon General, 2020](https://www.hhs.gov/sites/default/files/2020-cessation-sgr-full-report.pdf).

- **Duration of benefit:** **12 years** (range **5–20 years**).  
  _Why:_ Saved overdoses confer multi-year survival; quitting smoking yields large, persistent risk reductions over a decade or more; effects of home-safety modifications and trauma/abuse reduction can last for years but may attenuate.  
  Sources: [US Surgeon General, 2020](https://www.hhs.gov/sites/default/files/2020-cessation-sgr-full-report.pdf); [Cherrier et al., 2021](https://doi.org/10.1007/s41669-021-00309-z); [Olij et al., 2018](https://shantysterke.nl/wp-content/uploads/2018/12/J-Am-Geriatr-Soc.pdf).
