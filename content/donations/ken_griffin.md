---
donations:
  # ---------------------------------------------------------------------------
  # Methodology: record money once when it leaves Griffin's control.
  #
  # The Kenneth C. Griffin Charitable Fund / Griffin Catalyst grant stream is
  # opaque: inflows into the donor-advised fund or equivalent vehicle are not
  # publicly observable. Its public downstream grants are therefore collapsed
  # into one aggregate floor row dated to the latest documented grant in the
  # converted set. Those downstream grants are used only to classify the vehicle
  # recipient's category split.
  #
  # The older Kenneth and Anne Griffin Foundation is handled as a vehicle, too:
  # known 2013 contributions received are recorded as a foundation inflow, and
  # the pre-2013 public grants with unobservable inflows are represented by one
  # aggregate floor row to the foundation recipient.
  # ---------------------------------------------------------------------------

  # --- Direct personal gifts outside the DAF/foundation vehicle rows ---
  - date: 2006-10-12
    recipient: art-institute-of-chicago
    amount: 19_000_000
    credit:
      ken-griffin: 1.0
    source: 'https://www.chicagobusiness.com/article/20061012/NEWS06/200022419/art-institute-gets-19-million-donation'
    notes: 'Gift from Kenneth and then-wife Anne Dias Griffin toward construction of the Renzo Piano Modern Wing; the central court is named Kenneth and Anne Griffin Court. Kept as a direct personal gift because the source identifies the Griffins, not the Kenneth C. Griffin Charitable Fund or the Kenneth and Anne Griffin Foundation, as donor. Credited fully to Ken under the donor-file joint-era policy.'

  - date: 2010-01-01
    recipient: harvard-university
    amount: 50_000_000
    credit:
      ken-griffin: 1.0
    source: 'https://news.harvard.edu/gazette/story/2023/04/kenneth-c-griffin-makes-gift-of-300-million-to-fas/'
    notes: 'Aggregate remainder, not a single gift: Harvard stated in April 2023 that Griffin''s lifetime giving "spans four decades and totals more than $500 million." After the direct $150M (2014) and $300M (2023) Harvard gifts below, roughly $50M of smaller Harvard gifts since 1989 remain unitemized in public sources. Kept outside the DAF aggregate because Harvard describes Griffin himself as the donor and does not identify the Kenneth C. Griffin Charitable Fund or Griffin Catalyst as grantor. Date and amount are rough estimates.'

  - date: 2011-01-01
    recipient: fourth-presbyterian-church-chicago
    amount: 11_500_000
    credit:
      ken-griffin: 1.0
    source: 'https://www.fourthchurch.org/gratz/'
    notes: 'Ken and Anne Griffin gave $11.5M of the $38.2M cost of the Gratz Center (named for Ken''s grandparents Genevieve and Wayne Gratz) via the Project Light and Project Second Century capital campaigns. Kept as a direct personal gift because Fourth Presbyterian identifies Ken and Anne as donors, not a charitable vehicle. The church does not date the gift precisely; the building was constructed 2011-2012, so the date is approximated to 2011.'

  - date: 2014-02-19
    recipient: harvard-university
    amount: 150_000_000
    credit:
      ken-griffin: 1.0
    source: 'https://news.harvard.edu/gazette/story/2014/02/kenneth-griffin-makes-largest-gift-in-harvard-college-history/'
    notes: 'Largest gift in Harvard College history at the time; principally for undergraduate financial aid (Griffin Financial Aid Office), including $10M for a Harvard Business School professorship. Kept as a direct personal gift because Harvard says alumnus Kenneth Griffin made the gift and does not identify a DAF, foundation, or Griffin Catalyst as grantor.'

  - date: 2023-04-11
    recipient: harvard-university
    amount: 300_000_000
    credit:
      ken-griffin: 1.0
    source: 'https://news.harvard.edu/gazette/story/2023/04/kenneth-c-griffin-makes-gift-of-300-million-to-fas/'
    notes: 'Unrestricted gift to the Faculty of Arts and Sciences; the Graduate School of Arts and Sciences was renamed the Harvard Kenneth C. Griffin Graduate School of Arts and Sciences. Kept as a direct personal gift because Harvard says Kenneth C. Griffin made the gift and does not identify a DAF, foundation, or Griffin Catalyst as grantor. In January 2024 Griffin said he was pausing further Harvard giving.'

  - date: 2023-12-12
    recipient: memorial-sloan-kettering-cancer-center
    amount: 400_000_000
    credit:
      ken-griffin: 0.5
      david-geffen: 0.5
    source: 'https://www.mskcc.org/news-releases/mskcc-announces-landmark-400-million-gift-from-kenneth-griffin-and-david-geffen'
    notes: 'Joint gift from Kenneth C. Griffin and David Geffen, founder of the David Geffen Foundation, for clinical expansion, prevention/early-detection programs, and care technology. Preserved as a standalone joint gift because MSK identifies the two individual donors, not the Kenneth C. Griffin Charitable Fund or Griffin Catalyst, as the gift source. Individual shares were not disclosed; credited 50/50 as the natural default for a two-party joint gift.'

  # --- Kenneth and Anne Griffin Foundation vehicle rows ---
  - date: 2010-12-31
    recipient: kenneth-and-anne-griffin-foundation
    amount: 26_000_000
    credit:
      ken-griffin: 1.0
    source: 'https://news.uchicago.edu/story/anne-and-kenneth-griffin-provide-10-million-multi-year-study-school-improvement'
    notes: 'Aggregate floor for documented 2009-2010 grants out of the Kenneth and Anne Griffin Foundation whose corresponding inflows are not publicly observable. Replaces two downstream donor rows to avoid foundation double-counting: $10M for the University of Chicago/Harvard early-childhood education study, and $16M to Children''s Memorial Hospital/Lurie Children''s Hospital for the Kenneth and Anne Griffin Emergency Care Center (source: https://philanthropynewsdigest.org/news/children-s-memorial-hospital-receives-16-million-gift). Date set to period end.'

  - date: 2013-12-31
    recipient: kenneth-and-anne-griffin-foundation
    amount: 6_915_000
    credit:
      ken-griffin: 1.0
    source: 'https://projects.propublica.org/nonprofits/organizations/364747915'
    notes: 'FY2013 contributions received per Form 990-PF / ProPublica Nonprofit Explorer. Kenneth C. Griffin and Anne D. Griffin are listed as co-presidents; credited fully to Ken under the donor-file joint-era policy because Anne Dias Griffin does not have a donor file here. Downstream 2013 foundation grants are not itemized.'

  # --- Opaque Kenneth C. Griffin Charitable Fund / Griffin Catalyst aggregate ---
  - date: 2026-02-19
    recipient: kenneth-c-griffin-charitable-fund
    amount: 1_002_250_000
    credit:
      ken-griffin: 1.0
    source: 'https://www.businessinsider.com/ken-griffin-catalyst-citadel-philantrophy-politics-2025-8'
    notes: 'Aggregate record-money-once row for opaque Kenneth C. Griffin Charitable Fund / Griffin Catalyst grantmaking through the latest documented converted grant. Inflows into the DAF or equivalent vehicle are unobservable, so the amount is a conservative floor constructed by summing 55 source-backed public downstream grants that were previously itemized here. Those downstream grants are no longer donor rows. This aggregate excludes the direct Harvard, Art Institute, Fourth Presbyterian, and MSK rows above; excludes the separate Kenneth and Anne Griffin Foundation vehicle rows; and drops the prior speculative $50M Northwestern Lake Forest estimate because the amount is undisclosed. The converted portfolio included major public grants such as UChicago Economics $125M, Museum of Science and Industry $125M, the June 2022 Chicago departure slate $130M, Baptist Health $50M, Sylvester Comprehensive Cancer Center $50M, and Success Academy Florida $50M; see the recipient file for the category split.'
---
