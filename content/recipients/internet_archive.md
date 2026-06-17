---
id: internet-archive
name: 'Internet Archive'
categories:
  - id: science-tech
    fraction: 1
    effects:
      - effectId: standard
        overrides:
          costPerQALY: 3000
---

# Justification of cost per life

_The following analysis was done on December 16th 2025, written by GPT-5 and edited by Impact List staff for clarity._

We assign the Internet Archive a **cost per QALY of \$3,000**. The core idea is that preserving valuable knowledge can be much cheaper than creating it from scratch, which makes it look substantially better than the baseline [Science and Tech](/cause/science-tech) estimate.

## Description of effect

This effect captures the welfare gains from the universal preservation of digital knowledge (The Wayback Machine, Open Library). While the baseline "Science and Tech" cause focuses on the expensive, high-risk process of _discovering new_ information (R&D), the Internet Archive focuses on the highly efficient process of _preventing the loss_ of existing information. We model this as "Civilizational Insurance": safeguarding the epistemic foundation upon which all other science, law, and culture rely.

## Point estimates and {{PLAUSIBLE_RANGES}}

- **Cost per QALY:** \$3,000 (\$1,000-\$30,000)

_If you disagree with this estimate after reading this page, click 'Edit' near the cost per life field at the top of this page and enter your own values._

## Assumptions

1.  **The Maintenance Arbitrage:** It is orders of magnitude cheaper to store a terabyte of existing data than to conduct the R&D required to generate a terabyte of new, high-value scientific insight. We model preservation as about 20x cheaper than discovery per unit of useful information.
2.  **The "Link Rot" Counterfactual:** Without the Internet Archive, the digital record is extremely fragile. Pew Research Center found that 38% of webpages that existed in 2013 were inaccessible a decade later, 23% of news webpages sampled in 2023 contained at least one broken link, and 54% of Wikipedia pages contained at least one broken reference link. ([Pew Research Center 2024](https://www.pewresearch.org/data-labs/2024/05/17/when-online-content-disappears/))
3.  **Universal Utility:** Unlike a specific R&D project (e.g., developing a new polymer), the Internet Archive is a "general-purpose input" for journalists, courts, historians, and scientists globally. Its utility scales with the size of the entire web.
4.  **Epistemic Security:** In an era of AI-generated misinformation and political revisionism, the "Wayback Machine" provides a verified "source of truth," generating significant (though hard to quantify) democracy and stability benefits. We model the Internet Archive's uniqueness and counterfactual leverage as a 2x boost.

## Details

### Deriving the \$3,000/QALY estimate

We benchmark the Internet Archive against the baseline science-and-tech estimate of **\$60,000/QALY**. The comparison is between the value-preservation efficiency of the Internet Archive ($Eff_{IA}$) and the value-creation efficiency of baseline R&D ($Eff_{Base}$).

$$\text{Relative effectiveness} = \frac{Eff_{IA}}{Eff_{Base}}$$

We decompose Efficiency into two components: Cost ($C$) and Value Retention ($V$).

### 1. Cost ratio

Baseline R&D is labor and capital intensive with high failure rates. The Internet Archive, by contrast, treats storage as a commodity—the cost to "save" a page is fractions of a cent. This makes preservation ~20x cheaper than discovery per unit of information:

$$C_{ratio} = \frac{C_{IA}}{C_{Base}} \approx 0.05$$

### 2. Value ratio

New discoveries have high marginal value (new cures, new tech). Old data has lower marginal value per unit (an old webpage is usually less valuable than a new patent), but the volume is massive. We assume the average unit of preserved data is roughly **0.5x** as valuable as a unit of newly discovered data (discounting for "digital junk," but crediting for "critical historical record").

### 3. Uniqueness adjustment

If one lab fails to invent a drug, another often will (concurrent invention). But if the Internet Archive misses a snapshot of a deleted government page, that record is likely gone forever. IA has higher counterfactual leverage. We assign a **2x** boost for this uniqueness.

### 4. Final cost-per-QALY calculation

Combining the factors:

$$\text{Relative Effectiveness} = \frac{V_{ratio} \times U}{C_{ratio}} = \frac{0.5 \times 2}{0.05} = 20$$

This implies the Internet Archive could be substantially more effective than general R&D funding because it secures the existing knowledge base for a small cost relative to the creation of that knowledge.

Applying that comparison to the baseline:

$$\text{Cost per QALY}_{IA} = \frac{\$60{,}000}{20} = \$3{,}000$$

The plausible range is **\$1,000-\$30,000/QALY**. The low end corresponds to the Internet Archive preserving unusually important records that would otherwise disappear and be costly or impossible to reconstruct. The high end corresponds to a world where much of the archive's marginal crawl is low-value, duplicated elsewhere, or useful mostly to a small set of users. The estimate remains below the science-and-tech baseline because preservation is unusually cheap, but the range is wide because "value per preserved page" is hard to measure.

{{CONTRIBUTION_NOTE}}

# Internal Notes

The \$3,000/QALY estimate positions the Internet Archive as an exceptionally high-leverage "Meta-Science" intervention. It reflects the "commodity storage" thesis: that preserving the entire corpus of human knowledge is a low-cost, high-yield prerequisite for all other intellectual progress.
