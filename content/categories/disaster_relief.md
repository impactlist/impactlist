---
id: disaster-relief
name: 'Disaster Relief'
effects:
  - effectId: standard
    startTime: 0
    windowLength: 20
    costPerQALY: 6_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year) and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing -- check the global assumptions for this and other relevant parameters).

## Description of effect

This effect captures health benefits from high-visibility rapid disaster response: international search-and-rescue (USAR), emergency medical teams, emergency water/sanitation/hygiene (WASH), and reactive outbreak control (especially cholera vaccination) following floods, fires, and earthquakes. This does not include long-term disaster risk reduction or anticipatory action.

## Point Estimates

- **Cost per QALY:** \$6,000 (\$1,500–\$30,000)
- **Start time:** 0 years
- **Duration:** 20 years

If you disagree with these estimates after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1. International search-and-rescue costs approximately \$1 million per life saved on average; Haiti (2010) U.S. teams made 47 live rescues at \$51 million (~\$1.1M per life). ([BMJ Global Health](https://pmc.ncbi.nlm.nih.gov/articles/PMC7745699/), [Disaster Medicine](https://www.cambridge.org/core/journals/disaster-medicine-and-public-health-preparedness/article/analysis-of-the-international-and-us-response-to-the-haiti-earthquake-recommendations-for-change/A771EF45577DBD4D2D3B73228B8C6E67))
2. Typical adult disaster survivors have 20–40 remaining healthy life-years.
3. Reactive cholera vaccination (OCV) in high-incidence post-disaster settings costs \$370–\$2,770 per DALY depending on vaccine price and herd effects. ([S. Afr. Med. J.](https://www.scielo.org.za/scielo.php?pid=S0256-95742011000900024&script=sci_arttext))
4. Hotspot-targeted OCV can achieve approximately \$592 per DALY in high-incidence areas. ([Am. J. Trop. Med. Hyg.](https://www.ajtmh.org/view/journals/tpmd/91/6/article-p1181.xml))
5. Low-incidence OCV campaigns can be much less cost-effective (~\$15,700–\$69,900 per DALY). ([Vaccines](https://pmc.ncbi.nlm.nih.gov/articles/PMC11598253/))
6. Emergency WASH reduces diarrheal disease risk, but economic evaluations in humanitarian settings are sparse; emergency logistics likely raise costs above stable-program benchmarks. ([PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0124688), [WHO](https://wkc.who.int/docs/librariesprovider24/hedrm-documents/research-methods/who-guidance-research-methods-health-edrm-2021-chapter-4-7.pdf?sfvrsn=800eab90_2))
7. Disaster relief is rarely neglected and is logistically constrained; many donations arrive after the short window where they could most affect mortality. ([GiveWell](https://blog.givewell.org/2008/08/29/the-case-against-disaster-relief/))

## Details

### Cost per QALY

The point estimate (\$6,000/QALY) and range (\$1,500–\$30,000/QALY) represent a blended average across disaster response interventions with widely varying cost-effectiveness.

**USAR/Emergency Medical Teams:**

At approximately \$1 million per life saved (Assumption 1) and 20–40 remaining life-years for adult survivors (Assumption 2):
$$\text{Cost per QALY} \approx \dfrac{\$1{,}000{,}000}{20\text{–}40} \approx \$25{,}000\text{–}\$50{,}000$$

**Reactive OCV/WASH in high-incidence settings:**

Well-targeted cholera vaccination achieves approximately \$400–\$3,000 per QALY (Assumptions 3–4), though poorly targeted campaigns in low-incidence contexts can exceed \$15,000/QALY (Assumption 5).

**Blended estimate:**

Large disaster response funds typically allocate a minority to costly USAR/EMT deployments and a majority to WASH/OCV/basic relief. This mix yields a point estimate near \$6,000/QALY. The wide range reflects variation in outbreak intensity, targeting quality, and the fraction spent on high-cost rescue operations.

**Why not lower?**

Disaster relief is rarely neglected, is logistically constrained, and often receives donations after the critical window for mortality impact (Assumption 7).

### Start Time

The 0-year start time reflects that disaster response delivers immediate benefits during and shortly after acute emergencies.

### Duration

The 20-year duration reflects the remaining healthy life-years for survivors whose deaths are averted, primarily working-age adults.

---

{{CONTRIBUTION_NOTE}}

# Internal Notes
