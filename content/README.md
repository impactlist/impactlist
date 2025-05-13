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
id: global-health
name: "Global Health"
costPerLife: 5_000
---
```

### Donors

Each donor file (e.g., `bill_gates.md`) follows this format:

```yaml
---
id: "bill-gates"
name: "Bill Gates"
netWorth: 108_000_000_000
totalDonated: 59_000_000_000 # optional
---
```

### Recipients

Each recipient file (e.g., `against_malaria_foundation.md`) follows this format:

```yaml
---
id: against-malaria-foundation
name: "Against Malaria Foundation"
categories:
  - id: global-health 
    fraction: 1.0 
    costPerLife: 4_000  # Optional, overrides category default
    multiplier: 1.5    # Optional    
---
```

For recipients with multiple categories:

```yaml
---
id: gates-foundation
name: "Gates Foundation"
categories:
  - id: global-health
    fraction: 0.4
  - id: global-development
    fraction: 0.3
  # etc.
---
```

### Donations

Each file in the donations directory (typically named after a donor, like `bill_gates.md`) contains multiple donation events:

```yaml
---
donations:  
  - date: 1991-10-07
    recipient: university-of-washington-research
    amount: 12_000_000
    credit:
      bill-gates: 0.7
      melinda-gates: 0.3
    source: "https://www.washington.edu/news/1991/10/07/bill-gates-gives-uw-12-million-to-create-biotech-department/"
    notes: "Initial endowment"  # Optional

  - date: 1992-01-01
    recipient: stanford-university
    amount: 6_000_000
    credit:
      bill-gates: 1.0
    source: "https://www.cs.stanford.edu/about/gates-computer-science-building#:~:text=The%20Gates%20Building%20is%20named,month%20period"
---
```

A donation with multiple donors can appear in any relevant donor file - the script will deduplicate these entries when generating the final data.

For example, the same joint donation might appear in both `larry_page.md` and `mark_zuckerberg.md`:

```yaml
# In larry_page.md and mark_zuckerberg.md
---
donations:
  - date: 2014-11-10
    recipient: ebola-relief-efforts
    amount: 45_000_000
    credit:
      - larry_page: 0.33
      - mark_zuckerberg: 0.67
    source: "https://philanthropynewsdigest.org/news/google-larry-page-pledge-30-million-for-ebola-relief-efforts"
    notes: "Joint tech sector response to Ebola crisis"
---
```

## Data Generation

After updating these files, run the data generation script to create the JavaScript data file:

```bash
node scripts/generate-data.js
```

This will create/update `src/data/generatedData.js` with the compiled data from all markdown files. The script handles deduplication of donation events that appear in multiple files. 