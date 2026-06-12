---
donations:
  # ============================================================================
  # METHOD NOTE (Steve & Connie Ballmer)
  # The Ballmers give almost entirely through Ballmer Group (an LLC, founded
  # 2015) whose grants are paid via their donor-advised fund at the Goldman
  # Sachs Philanthropy Fund, plus (since Aug 2024) Rainier Climate Group.
  # Their DAF inflows are undisclosed (single known leak: $1.9B contributed to
  # the Goldman Sachs Philanthropy Fund in 2016, revealed by an IRS redaction
  # error — https://www.investmentnews.com/retirement-planning/billionaires-donating-to-a-goldman-charity-unmasked-by-irs-error/73796),
  # and the Chronicle of Philanthropy notes their giving can't be tracked
  # year-by-year for the Philanthropy 50. What IS attested is cumulative grants
  # out of their vehicles, so the vehicle era is recorded below as ONE sourced
  # cumulative row (dated 2020-07-01, the 2015-2026 midpoint; ballmer-group). To avoid double counting:
  #   - NO DAF-inflow rows are recorded (the 2016 $1.9B leak is deliberately
  #     omitted — those dollars exit via the grants the cumulative row counts);
  #   - NO individual Ballmer Group/Rainier grants are itemized (UO $425M 2022,
  #     ~$1B climate 2022–24, Blue Meridian $350M, FireAid $65M 2025,
  #     $110M LA youth mental health 2026, etc. all live inside the $7B row).
  # Excluded by policy: political giving (Everytown Victory Fund PAC, House
  # Majority PAC, ballot campaigns, etc.); the 2025 pledge of ~$1B over a
  # decade to expand Washington's ECEAP early-learning program (a pledge —
  # grants will be recorded as they occur, but only if itemizing ever replaces
  # the cumulative-row approach here).
  # ============================================================================

  # --- Personal gifts predating Ballmer Group ---
  # (Their joint 1996 $25M Harvard gift with Bill Gates for the Maxwell Dworkin
  # building is recorded in bill_gates.md with steve-ballmer credit 0.5.)

  - date: 2007-06-01
    recipient: partners-for-our-children
    amount: 10_000_000
    credit:
      steve-ballmer: 0.5
      connie-ballmer: 0.5
    source: 'https://magazine.washington.edu/10-million-gift-creates-partnership-for-needy-children/'
    notes: 'Founding gift creating Partners for Our Children, a public-private child-welfare partnership based at the University of Washington School of Social Work; Connie Ballmer co-founded it and chaired its board. Date approximated to the announcement (covered in UW Magazine''s June 2007 issue).'

  - date: 2014-11-12
    recipient: university-of-oregon
    amount: 50_000_000
    credit:
      steve-ballmer: 0.5
      connie-ballmer: 0.5
    source: 'https://news.uoregon.edu/content/uo-announces-50-million-gift-fundraising-campaign'
    notes: 'First major gift of the University of Oregon''s $2B campaign: $25M to endow scholarships, $20M for a center on health promotion and obesity prevention, $5M for a branding campaign. Connie Ballmer is a UO alumna and was a trustee.'

  - date: 2014-11-13
    recipient: harvard-university
    amount: 60_000_000
    credit:
      steve-ballmer: 1.0
    source: 'https://www.thecrimson.com/article/2014/11/13/ballmer-computer-science-gift/'
    notes: 'Funded a 50% expansion of Harvard''s computer science faculty (12 new professorships). Harvard and Ballmer did not disclose the amount; the Crimson''s ~$60M estimate (12 professorships at ~$5M each) was called "pretty good" by Ballmer, so this figure is an estimate.'

  # --- Ballmer Group era (2015 – early 2026), single cumulative row ---

  - date: 2020-07-01
    recipient: ballmer-group
    amount: 7_000_000_000
    credit:
      steve-ballmer: 0.5
      connie-ballmer: 0.5
    source: 'https://lifestylesmagazine.com/latest-news/110-million-new-gift-from-steve-and-connie-ballmer-strengthens-youth-mental-health-workforce-raising-their-philanthropic-giving-above-7-billion/'
    notes: 'Cumulative grants from 2015 through early 2026 via the Ballmers'' giving vehicles — Ballmer Group (an LLC granting through their Goldman Sachs Philanthropy Fund donor-advised fund) and, since 2024, Rainier Climate Group. Recorded once, dated at the 2015-2026 period midpoint per the dataset''s aggregate-dating convention (the attestation is from April 2026), as a conservative floor ("more than $7 billion", per April 2026 reporting and the Chronicle of Philanthropy''s ten-year retrospective at https://www.philanthropy.com/news/power-couple-giving-the-10-year-journey-of-steve-and-connie-ballmer/) because the Ballmers disclose no year-by-year totals. Subsumes all their individually announced vehicle grants, including the $425M Ballmer Institute for Children''s Behavioral Health gift to the University of Oregon (2022), just over $1B of climate giving (2022–2024), a $350M Blue Meridian Partners commitment (2024–2029), $65M of LA wildfire relief including the FireAid match (2025), and $110M for the Los Angeles youth mental-health workforce (2026).'

  # Connie Ballmer's personal gift (credit hers alone; kept in this file per the
  # one-file-per-event convention used for other couples).
  - date: 2026-04-16
    recipient: national-public-radio
    amount: 80_000_000
    credit:
      connie-ballmer: 1.0
    source: 'https://www.cbsnews.com/news/npr-113-million-connie-ballmer-donation/'
    notes: 'Largest gift to NPR from a living individual donor, supporting NPR''s digital transformation and audience growth; announced April 16, 2026, and publicly identified with Connie Ballmer alone (a former NPR Foundation board member). Treated as additive to the 2026-04-01 cumulative Ballmer Group row because it was announced after that attestation; the conservative "more than $7B" floor absorbs any overlap.'
---
