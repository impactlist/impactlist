---
id: institutions
name: 'Improving Institutions'
effects:
  - effectId: standard
    startTime: 5
    windowLength: 40
    costPerQALY: 4_000
---

# Justification of cost per life

_The following analysis was done on November 12th 2025. It was written by GPT 5 Thinking and edited by Impact List staff for brevity._

We arrive at the cost per life by estimating the cost per [QALY (quality adjusted life-year)](https://en.wikipedia.org/wiki/Quality-adjusted_life_year), and multiplying this by the our hardcoded value for how many years make up a life (80 at the time of this writing).

**Point estimate:** **\$4,000 per QALY**  
**Range (plausible):** **\$1,000–\$60,000 per QALY**

## Details

**What’s in scope.**  
This estimate covers _ambitious_ institutional upgrades in rich countries—reforms on the scale of charter-city-style special jurisdictions or sweeping land-use deregulation (statewide upzoning, streamlined approvals), as well as closely related “special governance zone” ideas. For background and analogs, see [Open Philanthropy’s housing policy reform focus](https://www.openphilanthropy.org/focus/housing-policy-reform/) and grants to pro-housing groups ([California YIMBY 2025](https://www.openphilanthropy.org/grants/california-yimby-general-support-2025/); [YIMBY Law 2024](https://www.openphilanthropy.org/grants/yimby-law-general-support-2024/)). Conceptually similar ideas include “charter cities” and SEZs ([Romer; overview by CCI](https://chartercitiesinstitute.org/wp-content/uploads/2022/03/Introduction-to-Charter-Cities.pdf); [World Bank SEZ reviews](https://documents.worldbank.org/en/publication/documents-reports/documentdetail/275691468204537118/special-economic-zones-what-have-we-learned)).

**Why this can be extremely cost-effective.**

- **Vast stakes from spatial/institutional misallocation.** Relaxing land-use constraints in top-productivity metros can yield very large national-level gains; a leading estimate finds U.S. GDP could be several percent higher if constraints matched earlier levels ([Hsieh & Moretti 2019](https://www.aeaweb.org/articles?id=10.1257%2Fmac.20170388)). (There is debate on magnitudes—see [Greaney 2023 comment](https://www.aeaweb.org/articles?from=f&id=10.1257%2Fmac.20230141)—but the sign and potential scale remain substantial.)
- **Observed tractability at city/state level.** Major zoning reforms have measurably increased permitting/supply within a few years (e.g., [Auckland](https://www.auckland.ac.nz/assets/business/our-research/docs/economic-policy-centre/Working%20paper%2017.pdf); [evidence on Minneapolis 2040](https://www.econstor.eu/bitstream/10419/320557/1/GLO-DP-1629.pdf)). Philanthropic actors have supported these pushes in multiple jurisdictions ([Open Phil focus & grants](https://www.openphilanthropy.org/focus/housing-policy-reform/)).
- **Converting large monetary welfare to QALYs.** We translate broad welfare (consumption, time savings, amenities) to QALYs using a conservative monetary anchor of \$100k per QALY, consistent with widely used health-sector thresholds ([ICER 2023 framework](https://icer.org/wp-content/uploads/2023/09/ICER_2023_VAF_For-Publication_092523.pdf)). This acknowledges that improved institutions enhance quality of life _beyond_ health (e.g., better housing, shorter commutes, higher real incomes).

### Assumptions & calculation (explicit)

We model a multi-year philanthropic effort that helps deliver one _large_ reform (e.g., statewide upzoning plus streamlined approvals for abundant housing; or a special-jurisdiction governance zone enabling high-productivity activity). Let:

- $R$: **Annual consumption-equivalent welfare gains** from the reform once mature (USD). **Base:** \$8 billion/year, grounded in the literature on sizable GDP effects from relaxing spatial constraints (scaled to a single large jurisdiction rather than national full reform).
- $h$: **Share of $R$ that is QALY-relevant** (excludes pure transfers; includes real income/amenity/time gains that raise life quality). **Base:** $0.5$.
- $v$: **Dollar anchor per QALY**. **Base:** \$100{,}000/QALY ([ICER 2023](https://icer.org/wp-content/uploads/2023/09/ICER_2023_VAF_For-Publication_092523.pdf)).
- $d$: **Years benefits persist** before major regime change. **Base:** $20$.
- $p_s$: **Probability the philanthropic coalition succeeds** within the window (legislation + durable implementation). **Base:** $0.12$.
- $\alpha$: **Attribution if successful**—share of realized benefit credibly caused by the philanthropy versus other actors. **Base:** $0.25$.
- $C$: **Philanthropic cost** (coalitions, analysis, litigation, mobilization, technical support). **Base:** \$75 million.

Expected QALYs created:

$$
\text{QALYs}_{\text{per yr}} \;=\; \frac{h \cdot R}{v}
\;=\; \frac{0.5 \cdot \$8{,}000{,}000{,}000}{\$100{,}000/\text{QALY}}
\;=\; 40{,}000\ \text{QALYs/yr}.
$$

$$
\text{QALYs}_{\text{total}} \;=\; d \cdot \text{QALYs}_{\text{per yr}} \cdot (p_s \cdot \alpha)
\;=\; 20 \cdot 40{,}000 \cdot 0.03
\;=\; 24{,}000\ \text{QALYs}.
$$

Cost per QALY:

$$
\textbf{Cost per QALY} \;=\; \frac{C}{\text{QALYs}_{\text{total}}}
\;=\; \frac{\$75{,}000{,}000}{24{,}000}
\;\approx\; \mathbf{\$3{,}125\ \text{per QALY}}.
$$

We round to **\$4,000 per QALY** to reflect model uncertainty and potential slippage.

**Range and uncertainty.**  
Sweeping parameters within conservative bounds:

- $R$: **\$2–\$20 billion/year**;
- $h$: **0.3–0.7**; $v$: **\$50k–\$150k/QALY**;
- $p_s$: **0.06–0.25**; $\alpha$: **0.15–0.3**;
- $d$: **10–30 years**; $C$: **\$50–\$150 million**.

yields roughly **\$1,000–\$60,000 per QALY**. The low end corresponds to unusually successful, durable reforms in very high-stakes jurisdictions; the high end reflects partial rollbacks, lower realized gains, or higher costs. Evidence that large spatial/institutional reforms can move very big aggregates (while being politically challenging) supports this wide but bounded corridor ([Hsieh & Moretti 2019](https://www.aeaweb.org/articles?id=10.1257%2Fmac.20170388); [Open Phil focus & grants](https://www.openphilanthropy.org/focus/housing-policy-reform/); [Auckland/Minneapolis case studies](https://www.auckland.ac.nz/assets/business/our-research/docs/economic-policy-centre/Working%20paper%2017.pdf), [link](https://www.econstor.eu/bitstream/10419/320557/1/GLO-DP-1629.pdf)).

**Bottom line.**  
Bold, charter-city-scale institutional upgrades in wealthy countries can plausibly deliver **low-to-mid four-figure \$ per QALY** on expectation. Despite real execution risk, the _stakes_ are so large that even modest philanthropic attribution and success probabilities can produce excellent value.

_Our current cost per life estimates are very approximate and we're looking for help improving them. Read about how you can contribute [here](https://github.com/impactlist/impactlist/blob/master/CONTRIBUTING.md)_

# Internal Notes
