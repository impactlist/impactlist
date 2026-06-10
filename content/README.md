# Impact List Data Structure

This directory contains all the data for the Impact List application in a maintainable format using markdown files with YAML frontmatter.

## Directory Structure

- `/categories/`: Contains one file per effectiveness cause area with its name and effects configuration
- `/donors/`: Contains one file per donor with their information
- `/recipients/`: Contains one file per recipient organization with their information and category allocations
- `/donations/`: Contains files that list donation events, typically organized by donor name, though any donation can appear in any file
- `/assumptions/`: Contains one file per global assumption with its written justification (rendered on /assumption/:id pages)
- `/assumptions/profiles/`: Curated assumption profiles (named bundles of overrides users can load; strictly validated at build time)
- `globalParameters.md`: Contains global simulation parameters

## File Formats

### Global Parameters

The `globalParameters.md` file contains system-wide simulation parameters:

```yaml
---
discountRate: 0.00
populationGrowthRate: 0.01
timeLimit: 100 # time after which we don't consider effects on the future
populationLimit: 10 # as a multiple of today's population
currentPopulation: 8_300_000_000
yearsPerLife: 80
---
```

### Categories

Each category file (e.g., `global_health.md`) defines how donations to that category affect lives saved. Categories use an effects-based system that models impact over time.

There are two types of effects:

#### Standard Effects (for health/development interventions):

```yaml
---
id: global-health
name: 'Global Health'
effects:
  - effectId: standard
    startTime: 1
    windowLength: 40
    costPerQALY: 62.5
---
```

Parameters for standard effects:

- `effectId`: Unique identifier for the effect
- `startTime`: Years from donation until effect begins
- `windowLength`: Duration of the effect in years
- `costPerQALY`: Cost per Quality-Adjusted Life Year
- `validTimeInterval`: [start_year, end_year] when this effect applies (optional -- omit for unbounded)

#### Population-level Effects (for existential/catastrophic risks):

```yaml
---
id: ai-risk
name: 'AI Existential Risk'
effects:
  - effectId: population-early
    startTime: 50
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 800_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: 1.0
    validTimeInterval: [null, 2012]
  - effectId: population-medium
    startTime: 30
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 400_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: 1.0
    validTimeInterval: [2013, 2021]
  - effectId: population-late
    startTime: 10
    windowLength: 1_000_000_000_000
    costPerMicroprobability: 200_000
    populationFractionAffected: 1.0
    qalyImprovementPerYear: 1.0
    validTimeInterval: [2022, null]
---
```

Parameters for population-level effects:

- `effectId`: Unique identifier for the effect
- `startTime`: Years from donation until effect begins
- `windowLength`: Duration of the effect in years
- `costPerMicroprobability`: Cost per one-in-a-million chance reduction
- `populationFractionAffected`: Fraction of population affected (0-1)
- `qalyImprovementPerYear`: Quality of life improvement/harm per year. 1 is the difference between a normal life and being dead.
- `validTimeInterval`: [start_year, end_year] when this effect applies (optional -- omit for unbounded)

### Donors

Each donor file (e.g., `bill_gates.md`) contains donor information:

```yaml
---
id: 'bill-gates'
name: 'Bill Gates'
birthDate: 1955-10-28 # optional
netWorth: 108_000_000_000
about: 'Short one-paragraph bio shown in the About section on the donor page.'
totalDonated: 59_000_000_000 # optional, you usually don't want to add this but instead rely on the system to add up all their donations
---
```

### Recipients

Each recipient file (e.g., `against_malaria_foundation.md`) maps the organization to categories:

```yaml
---
id: against-malaria-foundation
name: 'Against Malaria Foundation'
categories:
  - id: global-health
    fraction: 1.0
---
```

For recipients with multiple categories:

```yaml
---
id: gates-foundation
name: 'Gates Foundation'
categories:
  - id: global-health
    fraction: 0.4
  - id: global-development
    fraction: 0.3
  - id: climate-change
    fraction: 0.07
  - id: education
    fraction: 0.08
  - id: pandemics
    fraction: 0.07
  - id: science-tech
    fraction: 0.05
  - id: human-rights
    fraction: 0.03
---
```

Recipients can override category effect parameters:

```yaml
---
id: internet-archive
name: 'Internet Archive'
categories:
  - id: science-tech
    fraction: 1
    effects:
      - effectId: standard
        overrides:
          costPerQALY: 750
---
```

Recipients can also apply multipliers to category effects:

```yaml
---
id: khan-academy
name: 'Khan Academy'
categories:
  - id: education
    fraction: 1
    effects:
      - effectId: standard
        multipliers:
          costPerQALY: 0.1 # 10x more effective than category default
---
```

Note: Some recipients can have negative cost per life values (in `ai-capabilities` category), meaning donations to them may increase existential risk.

### Donations

Each file in the donations directory (typically named after a donor, like `bill_gates.md`) contains multiple donation events:

```yaml
---
donations:
  - date: 1991-10-07
    recipient: university-of-washington-research
    amount: 12_000_000
    credit:
      bill-gates: 1.0
    source: 'https://www.washington.edu/news/1991/10/07/bill-gates-gives-uw-12-million-to-create-biotech-department/'
    notes: 'Initial endowment' # Optional

  - date: 1995-01-01
    recipient: university-of-washington
    amount: 10_000_000
    credit:
      bill-gates: 0.5
      melinda-gates: 0.5
    source: 'https://www.washington.edu/news/1999/10/28/uw-awarded-10-million-from-bill-and-melinda-gates-foundation/'
---
```

We also support joint donations from multiple people. For instance:

```yaml
# In larry_page.md (a joint donation lives in exactly ONE file — see below)
---
donations:
  - date: 2014-11-10
    recipient: ebola-relief-efforts
    amount: 45_000_000
    credit:
      larry-page: 0.33
      mark-zuckerberg: 0.67
    source: 'https://philanthropynewsdigest.org/news/google-larry-page-pledge-30-million-for-ebola-relief-efforts'
    notes: 'Joint tech sector response to Ebola crisis'
---
```

Rules for donation entries (the data generation script enforces all of these and fails the build on violations):

- **Every donation event must be recorded exactly once across all files.** The `credit` map — not the file the donation lives in — determines who gets credit, so never copy a donation into a second donor's file. The build fails on exact duplicates (same recipient, date, amount, credit, and notes), and also when two entries match on recipient, date, and amount but disagree on credit — that usually means the same event was recorded once per donor and must be merged into a single entry whose `credit` map covers all donors. If two genuinely separate donations happen to look identical, give each a distinct `notes` field explaining the difference.
- For maintainability, put a donation from person X in person X's file. Put joint donations in the file of whichever donor is most associated with the gift (or in `multiple_donors.md`, the parking lot for joint donations that haven't been attributed yet) — but only in one place.
- `date` must be written as `YYYY-MM-DD` and be a real calendar date.
- `amount` must be a positive number.
- `credit` is required and its values must sum to 1 (how 100% of the donation is attributed across donors).
- The only allowed fields are `date`, `recipient`, `amount`, `credit`, `source`, and `notes`.

## Data Generation

After updating these files, run the data generation script to create the JavaScript data file:

```bash
npm run generate-data
```

This will create/update `src/data/generatedData.js` with the compiled data from all markdown files.
