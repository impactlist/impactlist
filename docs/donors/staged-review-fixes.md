# Staged donor additions — review fixes (2026-06-12)

1. Schwarzman MIT/Oxford pledges: could not confirm foundation routing — ProPublica's parsed 990-PF pages show only ~$413M cumulative disbursements FY2018–24 (assets max ~$125M) vs ~$540M of pledges, and grantee lists/XML were not retrievable; documented in `content/donors/stephen_schwarzman.md` Internal Notes, no rows added.
2. Grantham inter-vehicle double-count: not determinable quickly (Foundation Schedule B unavailable for FY2019–21 rows; Trust Schedule I not exposed on parsed pages); added an "Open verification item" caveat to `content/donors/jeremy_grantham.md` Internal Notes, also flagging the deliberately unrecorded Foundation years 2016–18 and 2022–24.
3. Added "Excluded candidates" blocks to all three donor files: Schwarzman (political giving by policy; foundation outflows), Grantham (LSE/Imperial Grantham Institutes as presumed foundation-funded; the "~$1B commitment" pledge framing), Plattner (Museum Barberini/DAS MINSK as HPF projects; HPI funding as foundation-routed; Giving Pledge).
4. Plattner $10.9B floor row: added corroboration from his SEC Schedule 13G/A on SAP SE (June 2022 donation of the HPE general-partner stake to the foundation; HPE holds 37,961,031 SAP shares), noting transfers completed 2015–2022.
5. Plattner University of Mannheim row: Wikipedia supports the EUR 10M library gift "given in 2003" but the sentence has no inline citation — uncertainty annotated in the row's notes; row retained.
6. Validation: `npm run generate-data` and `npm run lint` both pass (65 donors, 1006 donations).
