---
id: internet-archive
name: 'Internet Archive'
categories:
  - id: science-tech
    fraction: 1
    effects:
      - effectId: standard
        multipliers:
          costPerQALY: 0.05
---

# Justification of cost per life

_The following analysis was done on December 16th 2025, written by GPT 5 Thinking and edited by Impact List staff for clarity._

We arrive at the cost per life by applying a multiplier to the baseline [Science and Tech](/category/science-tech) cost per [QALY](https://en.wikipedia.org/wiki/Quality-adjusted_life_year). This multiplier reflects the unique leverage of the Internet Archive (IA) as a digital public utility that prevents "knowledge decay" at a fraction of the cost of generating new knowledge.

## Description of effect

This effect captures the welfare gains from the universal preservation of digital knowledge (The Wayback Machine, Open Library). While the baseline "Science and Tech" category focuses on the expensive, high-risk process of _discovering new_ information (R&D), the Internet Archive focuses on the highly efficient process of _preventing the loss_ of existing information. We model this as "Civilizational Insurance": safeguarding the epistemic foundation upon which all other science, law, and culture rely.

## Point Estimates

- **Multiplier:** 0.05x (relative to baseline)

If you disagree with this estimate after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values.

## Assumptions

1.  **The Maintenance Arbitrage:** It is orders of magnitude cheaper to store a terabyte of existing data than to conduct the R&D required to generate a terabyte of new, high-value scientific insight.
2.  **The "Link Rot" Counterfactual:** Without the Internet Archive, the digital record is extremely fragile. Studies show that ~25% of deep links in major news outlets rot within a decade. The counterfactual is not "someone else saves it," but "the history is erased."
3.  **Universal Utility:** Unlike a specific R&D project (e.g., developing a new polymer), the Internet Archive is a "general-purpose input" for journalists, courts, historians, and scientists globally. Its utility scales with the size of the entire web.
4.  **Epistemic Security:** In an era of AI-generated misinformation and political revisionism, the "Wayback Machine" provides a verified "source of truth," generating significant (though hard to quantify) democracy and stability benefits.

## Details

### Derivation of the Multiplier (0.05x)

We calculate the cost-effectiveness multiplier ($M$) by comparing the value-preservation efficiency of the Internet Archive ($Eff_{IA}$) against the value-creation efficiency of Baseline R&D ($Eff_{Base}$).

$$M = \frac{Eff_{Base}}{Eff_{IA}}$$

We decompose Efficiency into two components: Cost ($C$) and Value Retention ($V$).

### 1. Cost Ratio

Baseline R&D is labor and capital intensive with high failure rates. The Internet Archive, by contrast, treats storage as a commodity—the cost to "save" a page is fractions of a cent. This makes preservation ~20x cheaper than discovery per unit of information:

$$C_{ratio} = \frac{C_{IA}}{C_{Base}} \approx 0.05$$

### 2. Value Ratio

New discoveries have high marginal value (new cures, new tech). Old data has lower marginal value per unit (an old webpage is usually less valuable than a new patent), but the volume is massive. We assume the average unit of preserved data is roughly **0.5x** as valuable as a unit of newly discovered data (discounting for "digital junk," but crediting for "critical historical record").

### 3. Uniqueness Adjustment

If one lab fails to invent a drug, another often will (concurrent invention). But if the Internet Archive misses a snapshot of a deleted government page, that record is likely gone forever. IA has higher counterfactual leverage. We assign a **2x** boost for this uniqueness.

### 4. Final Multiplier Calculation

Combining the factors:

$$\text{Relative Effectiveness} = \frac{V_{ratio} \times U}{C_{ratio}} = \frac{0.5 \times 2}{0.05} = 20$$

This implies the Internet Archive is roughly **20x** more cost-effective than general R&D funding because it secures the entire knowledge base for a trivial cost relative to the creation of that knowledge.

$$M = \frac{1}{20} = 0.05$$

---

{{CONTRIBUTION_NOTE}}

# Internal Notes

The 0.05x multiplier positions the Internet Archive as an exceptionally high-leverage "Meta-Science" intervention. If the baseline Science & Tech is \$60k/QALY, this implies IA achieves ~\$3k/QALY. This reflects the "commodity storage" thesis: that preserving the entire corpus of human knowledge is a low-cost, high-yield prerequisite for all other intellectual progress.
