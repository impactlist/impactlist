# Impact List Data Structure

This directory contains all the data for the Impact List application in a maintainable format using markdown files with YAML frontmatter.

## Directory Structure

- `/categories/`: Contains one file per effectiveness category with its name and cost per life
- `/donors/`: Contains one file per donor with their information
- `/recipients/`: Contains one file per recipient organization with their information and category allocations
- `/donations/`: Contains files that list donation events, typically organized by donor name, though any donation can appear in any file

## File Formats

### Categories

Each category file (e.g., `global_health.md`) follows this format:

```yaml
---
id: "global_health"
name: "Global Health"
costPerLife: 5000
---
```

### Donors

Each donor file (e.g., `bill_gates.md`) follows this format:

```yaml
---
id: "bill_gates"
name: "Bill Gates"
netWorth: 1.08e11
totalDonated: 5.9e10  # Optional
---
```

### Recipients

Each recipient file (e.g., `against_malaria_foundation.md`) follows this format:

```yaml
---
id: "against_malaria_foundation"
name: "Against Malaria Foundation"
categories:
  - id: "global_health"
    fraction: 1.0
    costPerLife: 4000  # Optional, overrides category default
    multiplier: 1.5    # Optional
---
```

For recipients with multiple categories:

```yaml
---
id: "bill_melinda_gates_foundation"
name: "Bill & Melinda Gates Foundation"
categories:
  - id: "global_health"
    fraction: 0.4
  - id: "global_development"
    fraction: 0.3
  - id: "climate_change"
    fraction: 0.07
  # etc.
---
```

### Donations

Each file in the donations directory (typically named after a donor, like `bill_gates.md`) contains multiple donation events:

```yaml
---
donations:
  - date: "1991-10-07"
    recipient: "university_of_washington_research"
    amount: 12000000
    splits:
      - donor: "bill_gates"
        credit: 1.0
    source: "https://www.washington.edu/news/1991/10/07/bill-gates-gives-uw-12-million-to-create-biotech-department/"
  
  - date: "1999-01-01"
    recipient: "bill_melinda_gates_foundation"
    amount: 15800000000
    splits:
      - donor: "bill_gates"
        credit: 0.8
      - donor: "melinda_gates" 
        credit: 0.2
    source: "https://www.gatesfoundation.org/-/media/gfo/1annual-reports/1999gates-foundation-annual-report.pdf"
    notes: "Initial endowment"  # Optional
---
```

A donation with multiple donors can appear in any relevant donor file - the script will deduplicate these entries when generating the final data.

For example, the same joint donation might appear in both `larry_page.md` and `mark_zuckerberg.md`:

```yaml
# In larry_page.md and mark_zuckerberg.md
---
donations:
  - date: "2014-11-10"
    recipient: "ebola_relief_efforts"
    amount: 45000000
    splits:
      - donor: "larry_page"
        credit: 0.33
      - donor: "google"
        credit: 0.33
      - donor: "mark_zuckerberg"
        credit: 0.34
    source: "https://philanthropynewsdigest.org/news/google-larry-page-pledge-30-million-for-ebola-relief-efforts"
    notes: "Joint tech sector response to Ebola crisis"
---
```

## Data Generation

After updating these files, run the data generation script to create the JavaScript data file:

```bash
node scripts/generate-data-updated.js
```

This will create/update `src/data/donationData.js` with the compiled data from all markdown files. The script handles deduplication of donation events that appear in multiple files. 