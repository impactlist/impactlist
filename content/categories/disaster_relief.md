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

_The following analysis was done on November 12th 2025. It was written by GPT 5 Thinking, and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **\$6,000 per QALY**  
**Range (plausible):** **\$1,500–\$30,000 per QALY**

## Details

**Scope.** This estimate covers **high-visibility rapid response**: international search-and-rescue (USAR), emergency medical teams and trauma care, emergency water/sanitation/hygiene (WASH), and reactive outbreak control (esp. cholera vaccination) following **floods, fires, earthquakes**. It does **not** include long-term disaster risk reduction (DRR) or anticipatory action.

**Anchor 1: International search-and-rescue is very costly per life saved.**  
A comprehensive review of USAR deployments finds **~US\$1 million per life saved** on average across recent earthquakes. In Haiti (2010), U.S. teams made **47 live rescues at a cost of \$51 million**, ≈**\$1.1 million per life**. Even where some teams arrived within 12 hours, most rescues were already performed locally. Mapping **\$1M per death averted** to QALYs (20–40 healthy life-years for typical adult survivors) implies **~\$25,000–\$50,000 per QALY** for USAR components.  
Sources: BMJ Global Health review of ISAR deployments (costs, timing, limited rescues) [BMJ GH / NIH PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7745699/); U.S. Haiti figure (47 rescues; \$51m) [Disaster Medicine & Public Health Preparedness](https://www.cambridge.org/core/journals/disaster-medicine-and-public-health-preparedness/article/analysis-of-the-international-and-us-response-to-the-haiti-earthquake-recommendations-for-change/A771EF45577DBD4D2D3B73228B8C6E67).

**Anchor 2: Reactive cholera vaccination (OCV) in post-disaster settings can be much more cost-effective.**  
When floods and infrastructure failures raise waterborne-disease risk, **reactive OCV** can deliver **hundreds to low thousands of dollars per DALY averted**, depending heavily on incidence and vaccine price. Examples:

- **Zimbabwe (reactive OCV):** **\$370–\$2,770 per DALY** depending on vaccine price and herd effects. [S. Afr. Med. J.](https://www.scielo.org.za/scielo.php?pid=S0256-95742011000900024&script=sci_arttext).
- **"Hotspot" targeting:** **~\$592 per DALY** modeled for high-incidence areas. [Am. J. Trop. Med. Hyg.](https://www.ajtmh.org/view/journals/tpmd/91/6/article-p1181.xml).
- **Low-incidence contexts can be unfavorable:** A Thailand refugee-camp OCV campaign estimated **~\$69,900 per DALY** base-case (dropping to **~\$15,700** under higher incidence). [Vaccines (open-access)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11598253/).
  Program cost inputs from Haiti show **~\$2.90 per dose delivered** (2013), illustrating logistical costs. [CDC/Am. J. Trop. Med. Hyg.](https://pmc.ncbi.nlm.nih.gov/articles/PMC5676633/).

**Anchor 3: Emergency WASH and basic relief likely sit between these extremes but evidence is thin.**  
Systematic reviews in humanitarian settings show WASH reduces diarrheal disease risk, yet **economic evaluations ($/QALY or $/DALY)** are sparse and heterogeneous; WHO’s guidance flags this as a key evidence gap. Benchmarking from related (non-emergency) water treatment suggests very low $/DALY in stable programs, but emergency logistics likely raise costs materially.  
Sources: WASH effectiveness in crises (systematic review) [PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0124688); WHO Health EDRM methods chapter on **economic evaluation gaps** [WHO Guidance PDF](https://wkc.who.int/docs/librariesprovider24/hedrm-documents/research-methods/who-guidance-research-methods-health-edrm-2021-chapter-4-7.pdf?sfvrsn=800eab90_2).

**What we’re averaging over.**  
High-visibility disaster donations typically support a **mix** of costly life-saving deployments (USAR/EMTs) and more cost-effective public-health work (OCV/WASH), with some share to cash/shelter that improves short-run health and mental health but is rarely expressed in $/QALY terms. Using the anchors above:

- **USAR/EMTs:** **\$25k–\$50k per QALY** (derived from ~\$1m per life saved and adult remaining life-years).
- **Reactive OCV/WASH in high-incidence settings:** **~\$400–\$3,000 per QALY** (can be much higher if incidence is low or campaigns are poorly targeted).
  A reasonable blended expectation for large "disaster response funds" (with a minority to USAR/EMTs and a majority to WASH/OCV/basic relief) yields an overall **point estimate near \$6,000 per QALY**, with a wide **plausible range (\$1,500–\$30,000)** reflecting large variation in outbreak intensity, targeting, and the fraction of spending that goes to high-cost USAR/EMT deployments.

**Why not lower (like top global health)?**  
Disaster relief is **rarely neglected** and is **logistically constrained**; many donations arrive after the short window where they could most affect mortality. Classic analyses caution that headline-driven emergency relief is often **less cost-effective** than routine health programs or preparedness.  
Source: GiveWell summary of the Disease Control Priorities (2nd ed.) chapter critiquing emergency relief’s cost-effectiveness and timing [GiveWell blog](https://blog.givewell.org/2008/08/29/the-case-against-disaster-relief/).

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes

## Start time & duration (for modeling)

- **Start time:** **0.10 years** (≈5 weeks; range **0.01–0.25 years**).  
  _Why:_ International search-and-rescue (USAR) and emergency WASH start within days, while reactive public-health campaigns (e.g., oral cholera vaccine, OCV) typically organize within weeks. International USAR teams often arrive 36–72 hours or more after impact; reactive OCV campaigns in Haiti and elsewhere were mounted over the next 1–2 months.  
  Sources: USAR deployment and timing; most rescues occur locally and numbers saved by international teams are small. [BMJ Global Health review](https://pmc.ncbi.nlm.nih.gov/articles/PMC7745699/). OCV rollouts in Haiti (cost & logistics) [CDC/Am. J. Trop. Med. Hyg.](https://pmc.ncbi.nlm.nih.gov/articles/PMC5676633/); effectiveness window 4–24 months [Lancet Global Health](https://www.thelancet.com/journals/langlo/article/PIIS2214-109X%2814%2970368-7/fulltext).

- **Duration of benefit:** **15 years** (range **3–40 years**).  
  _Why:_ A share of benefits comes from **lives saved** (e.g., extrication, emergency care, outbreak control), which accrue over survivors’ remaining lifetimes (often adults and older adults in earthquakes), while morbidity reductions (injuries, diarrheal disease) are concentrated in months–years. We therefore use a blended duration substantially shorter than “child-survival” programs but much longer than the immediate response window.  
  Sources: earthquake mortality skews older; remaining life-years are limited relative to child survival [Population Health Metrics](https://pophealthmetrics.biomedcentral.com/articles/10.1186/1478-7954-11-5). OCV protection and reactive campaigns typically protect for 2–3 years [Lancet Global Health](https://www.thelancet.com/journals/langlo/article/PIIS2214-109X%2814%2970368-7/fulltext).
