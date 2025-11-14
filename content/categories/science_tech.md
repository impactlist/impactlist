---
id: science-tech
name: 'Science and Tech'
effects:
  - effectId: standard
    startTime: 5
    windowLength: 25
    costPerQALY: 60_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **\$60,000 per QALY**  
**Range (plausible):** **\$20,000–\$250,000 per QALY**

## Details

**Scope.**  
This category covers philanthropic funding in wealthy nations for scientific and engineering progress—e.g., university labs, research institutes, metascience infrastructure, and translational R&D—_excluding_ cause areas treated separately (AI-specific, climate, pandemics, etc.). Many of the benefits are not purely medical: they include convenience, time-saving, access to information, connection, entertainment, and capability expansion—i.e., **“above-normal”** quality-of-life gains. Digital goods illustrate this: consumer surplus from free platforms is sizable yet partly missed by GDP, implying substantial non-health wellbeing improvements ([Brynjolfsson, Collis & Eggers, “GDP-B”](https://www.nber.org/system/files/working_papers/w25695/w25695.pdf)).

**Step 1 — How much welfare does marginal R&D create?**  
Macroeconomic and microeconomic studies find very high **social returns** to R&D:

- Top-down calibration suggests **\$1** of R&D yields roughly **\$5–\$13** in present-value economy-wide benefits after accounting for diffusion lags ([Jones & Summers, NBER 2020](https://www.nber.org/system/files/working_papers/w27863/w27863.pdf), esp. pp. 11–14).
- Causal, bottom-up estimates find large **spillovers**: e.g., private returns ≈ **21%** and social returns ≈ **55%** annually in firm-level data ([Bloom, Schankerman & Van Reenen, 2013](https://eprints.lse.ac.uk/46852/1/__lse.ac.uk_storage_LIBRARY_Secondary_libfile_shared_repository_Content_Schankerman%2C%20M_Identifying%20technology%20Econ_Schankerman_Identifying%20technology%20_Econ_2014.pdf)).
- Open Philanthropy’s independent modeling concludes that **directly funding R&D** produces large social returns but, on average, is worse than the very best global-health/poverty options—consistent with our estimate being far above \$90/QALY yet still competitive by rich-country standards ([Open Philanthropy, 2022](https://www.openphilanthropy.org/research/social-returns-to-productivity-growth/)).

**Step 2 — Converting innovation benefits into QALYs (beyond health).**  
To map broad quality-of-life gains into QALYs, we use the **WELLBY** framework (a +1 change on a 0–10 life-satisfaction scale for one person for one year). UK policy guidance and the wellbeing literature provide two anchors:

- **Monetary value per WELLBY:** HM Treasury’s Wellbeing Supplement to the Green Book and What Works Centre’s synthesis suggest a central value around **£13,000 per WELLBY** (≈ **\$16,000**), with methods triangulated from income-to-wellbeing elasticities and QALY benchmarks ([HMT 2021 guidance](https://www.gov.uk/government/publications/green-book-supplementary-guidance-wellbeing); [What Works Centre, 2023](https://whatworkswellbeing.org/blog/converting-the-wellby/)).
- **Bridge between WELLBYs and QALYs:** Multiple sources suggest **~6 WELLBYs ≈ 1 QALY** in wellbeing terms (a year in good health raises life satisfaction ≈6 points) ([Frijters & Krekel, 2021](https://eprints.lse.ac.uk/114605/1/Frijters_PR3.pdf); see also [NZ Treasury slides, 2022](https://www.treasury.govt.nz/sites/default/files/2022-08/tgls-wellbeing-paul-frijters-christian-krekel-2022-06-09-slides.pdf)). This implies a money-metric value of roughly **\$90k–\$100k per QALY** in high-income settings, consistent with health-technology thresholds ([NICE £20k–£30k/QALY](https://www.nice.org.uk/process/pmg36/chapter/economic-evaluation-2); [ICER \$100k–\$150k/QALY](https://icer.org/wp-content/uploads/2020/10/ICER_2020_2023_VAF_102220.pdf)).

**Step 3 — A stylized BOTEC.**

- Take a **central social return** of **\$8** in consumption-equivalent welfare per **\$1** donated to S&T R&D (midpoint of Jones-Summers’ \$5–\$13).
- Using **\$100,000 per QALY** as a high-income money-metric benchmark (via WELLBY→QALY above), the **raw** conversion is **\$100,000 / \$8 ≈ \$12,500 per QALY**.
- Adjust for realism: partial **additionality** (philanthropy only gets credit for a share of marginal R&D, say **25%** after crowd-out and project failure) and modest **downside risks** (tech externalities, field choice), multiply by **≈5×**.
- **Result:** **≈ \$60,000 per QALY**.  
  Sensitivity: with returns **\$5–\$13** and attribution **10–60%**, implied costs span roughly **\$20k–\$250k per QALY**.

**Why this isn’t “just health.”**  
The WELLBY→QALY bridge lets us count **above-baseline** quality-of-life improvements (time saved, connection, entertainment, creative tools) as QALYs, not only disease relief. Evidence that digital innovations generate sizable **consumer surplus** beyond GDP supports including these gains in wellbeing-based effectiveness ([Brynjolfsson, Collis & Eggers, 2019](https://www.nber.org/system/files/working_papers/w25695/w25695.pdf)). Classic product-innovation studies (e.g., **CT scanners**) also show very large **consumer surplus** from quality improvements—benefits that standard price indices undercount ([Trajtenberg, 1989](https://www.jstor.org/stable/1831321)).

**Bottom line.**  
Well-chosen science & technology grants in wealthy countries plausibly deliver QALYs at **\$20k–\$250k**, with a **central estimate near \$60k/QALY** once we (i) start from mainstream social-return estimates to R&D, (ii) convert broad quality-of-life gains into QALYs via WELLBYs, and (iii) apply conservative adjustments for additionality and risk. This sits well above the best global-health opportunities, but remains competitive with many rich-country health and social programs.

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes

## Start time & duration (for modeling)

- **Start time:** **10 years** (range **5–20 years**).  
  _Why:_ From basic/applied research to widespread use typically takes a decade-plus; medical/tech translation is often cited at **~14–17 years** on average, with general-purpose technologies diffusing faster in rich countries but still with multi-year lags.  
  Sources: [Morris et al., 2011](https://pmc.ncbi.nlm.nih.gov/articles/PMC3241518/) ; [Hanney et al., 2015](https://health-policy-systems.biomedcentral.com/articles/10.1186/1478-4505-13-1) ; global diffusion overview [Comin & Hobijn, 2010](https://www.aeaweb.org/articles?id=10.1257%2Faer.100.5.2031).

- **Duration of benefit:** **25 years** (range **15–40 years**).  
  _Why:_ Once a research-enabled product or practice takes hold, benefits usually persist over product cycles and follow-on improvements for decades (e.g., imaging, semiconductors, digital platforms); diffusion literature shows long tails of impact.  
  Sources: diffusion reviews ([Comin et al., 2013](https://www.nber.org/system/files/working_papers/w19010/w19010.pdf); [Comin & Hobijn, 2010](https://www.aeaweb.org/articles?id=10.1257%2Faer.100.5.2031)).
