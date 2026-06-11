---
# Li Ka-shing Personal Charitable Donations
#
# GIVING STRUCTURE - CRITICAL NOTE:
# Like Azim Premji, virtually ALL of Li Ka-shing's giving flows through a single vehicle:
# the Li Ka Shing Foundation (LKSF, established 1980), which he calls his "third son" and
# which states publicly that it never accepts external funds - Li is its sole funder
# (e.g. https://hk.news.yahoo.com/%E5%AE%8F%E7%A6%8F%E8%8B%91%E4%BA%94%E7%B4%9A%E7%81%AB%EF%B8%B1%E4%B8%80%E6%96%87%E6%95%B4%E5%90%88%E6%89%80%E6%9C%89%E6%8D%90%E6%AC%BE%E6%B8%A0%E9%81%93-%E6%94%BF%E5%BA%9C%E6%8D%90%E6%AC%BE%E6%88%B6%E5%8F%A3%E3%80%81%E4%BB%81%E6%BF%9F%E9%86%AB%E9%99%A2payme%E7%AD%89-%E6%9D%8E%E5%98%89%E8%AA%A0%E5%9F%BA%E9%87%91%E8%AC%9D%E7%B5%95%E5%B8%82%E6%B0%91%E5%80%8B%E5%88%A5%E5%85%AC%E7%9B%8A%EF%B8%B1yahoo-161430403.html).
# The foundation group includes the Hong Kong foundation, the Li Ka Shing (Canada)
# Foundation (Toronto, created 2005 to receive part of the CIBC sale proceeds) and the
# investment-holding Li Ka Shing (Global) Foundation; all are represented here by the
# single recipient id li-ka-shing-foundation.
#
# Per the cardinal rule, rows below record money INTO the foundation. LKSF's grants out -
# Shantou University (HK$12B+ cumulative), HKU Faculty of Medicine (HK$1B, 2005),
# UC Berkeley (US$40M, 2005), Stanford medicine (US$37M), Technion/GTIIT (US$130M, 2013),
# Oxford Big Data Institute (GBP 20M, 2013), Tsz Shan Monastery (HK$3.1B+), HKUST
# (HK$500M, 2019), the HK$1B "Crunch Time" SME fund (2019), Tai Po fire relief (HK$80M,
# 2025), the 2026 histotripsy liver-cancer program, etc. - are deliberately NOT rows;
# they inform the recipient file's category fractions instead.
#
# HK has no 990-PF equivalent for LKSF and the foundation publishes no donor-level
# accounts, so inflows are only partially observable:
#   - The one cleanly documented discrete inflow is the January 2005 sale of his entire
#     4.9% CIBC stake, with all C$1.2B of proceeds donated to the foundations.
#   - For everything else this file uses the skill's documented-cumulative-grantmaking
#     floor: LKSF states Li has put over HK$30 billion into projects since 1980
#     (https://www.lksf.org/timeline/, corroborated May 2026 by Caixin/press as
#     "more than HK$30 billion over 46 years"). Since the foundation spends only Li's
#     money (plus returns on it) and he has said he replenishes it with amounts equal to
#     or exceeding distributions (https://www.lksf.org/20050206_01/), cumulative grants
#     out are a conservative floor on his contributions in. The floor is split into two
#     dated rows reconciled against the itemized CIBC row so nothing is counted twice:
#     HK$6.5B distributed 1980-early 2005 + HK$7.8B CIBC + HK$15.7B remainder = HK$30B.
#   - The true total is likely far higher: he pledged at least one third of his fortune
#     to the foundation in 2006 (then ~US$6-10B, now ~US$15B of a US$45.1B fortune) and
#     has repeatedly affirmed the commitment; the foundation also retains large assets
#     (e.g. ~350M CK Asset shares per 2025 HKEX disclosures). No public record itemizes
#     those share transfers into the foundation, so they are not recorded beyond the floor.
#
# EXCLUDED (policy reasons):
#   - The 2006 "one third of my fortune" pledge itself - pledges are never rows.
#   - All LKSF grants out (see above) - double-count.
#   - LKSF investment activity (US$750M Bank of China stake 2005, CK Asset share
#     purchases 2019-2021, Postal Savings Bank of China shares, Cenovus/NexGen stakes) -
#     foundation-internal, not inflows.
#   - Horizons Ventures tech investments (Facebook, DeepMind, Siri, Waze, Zoom) -
#     for-profit investments; gains that accrue to LKSF (e.g. Waze proceeds funding the
#     2013 Technion gift) are investment returns inside the foundation, not new donations.
#   - No political giving found; LKSF declines outside donations, and no personal gifts
#     bypassing the foundation could be verified.

donations:
  # --- Documented discrete inflow: CIBC stake sale, January 2005 ---
  - date: 2005-01-13
    recipient: li-ka-shing-foundation
    amount: 1_000_000_000
    credit:
      li-ka-shing: 1.0
    source: 'https://www.lksf.org/sale-of-cibc-shares-for-proceeds-of-c1-2-billionhk7-8-billion/'
    notes: 'Sold his entire 17,008,928-share (~4.9%) stake in Canadian Imperial Bank of Commerce at C$70/share and donated all C$1.2 billion (HK$7.8 billion) of proceeds to his charitable foundations - the Li Ka Shing Foundation and the newly created Li Ka Shing (Canada) Foundation, with no split disclosed (both are represented by this recipient). Dated at the announcement; the sale settled within weeks. Converted at the announced HK$7.8B equivalence (~US$1.00B at the pegged HKD rate; C$1.2B was ~US$0.98B at January 2005 rates).'

  # --- Floor for 1980 - early 2005 contributions ---
  - date: 2005-02-06
    recipient: li-ka-shing-foundation
    amount: 835_000_000
    credit:
      li-ka-shing: 1.0
    source: 'https://www.lksf.org/20050206_01/'
    notes: 'Conservative floor for Li''s cumulative contributions into the foundation from its 1980 founding through early 2005, set equal to the over HK$6.5 billion (~US$835M at 7.78 HKD/USD) the foundation had distributed by then per a February 2005 Yazhou Zhoukan profile republished by LKSF. Li is the foundation''s sole funder and stated he replenishes it with amounts equal to or exceeding distributions, so money granted out by early 2005 had to have been contributed by him beforehand (the January 2005 CIBC proceeds, recorded separately, had not yet been deployed). Dated at the end of the period covered; actual transfers occurred throughout 1980-2005.'

  # --- Floor remainder for mid-2005 - 2025 contributions ---
  - date: 2025-12-31
    recipient: li-ka-shing-foundation
    amount: 2_010_000_000
    credit:
      li-ka-shing: 1.0
    source: 'https://www.lksf.org/timeline/'
    notes: 'Balance of the foundation''s documented cumulative grantmaking beyond the two rows above, used as a conservative floor for Li''s mid-2005 through 2025 contributions: LKSF states he has put over HK$30 billion into projects across 27 countries since 1980 (figure on its site through 2025 and cited in May 2026 press as "more than HK$30 billion over 46 years"). HK$30B minus HK$6.5B (pre-2005 floor row) minus HK$7.8B (CIBC row) = HK$15.7B, ~US$2.01B at 7.8 HKD/USD. Dated at the end of the period covered; actual top-ups occurred continuously over two decades. Likely a substantial undercount: he pledged at least one third of his assets to the foundation in 2006 (~US$15B at his 2026 net worth) and the foundation separately retains billions in assets, but no public filing itemizes those transfers.'
---
