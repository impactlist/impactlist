---
name: effectiveness-estimation
description: |
  Use when the user is improving, adding, or updating the written justifications for the effectiveness estimations
  in the content directory — including files in content/assumptions/, content/categories/,
  or content/recipients/.
---

# Effectiveness Estimation

## Our goal with these estimates

We want these estimates to be the best all-things-considered attempt at estimating effectiveness of cause areas and recipients in the world. Do extremely deep research, reason very hard and very carefully, and try to procude the clearest and most well-justified estimates that you possibly can.

These estimates are based on the premise that we can in theory convert any benefit to some equivalent amount of QALYs. Similar to how any commodity has a conversion into money. There is SOME amount of QALYs that someone would be indifferent to recieving vs. some benefit under consideration.
Therefore we should not give caveats about how QALYs are a "narrow" metric, and we shouldn't feel compelled to focus on easily measurable health effects of interventions just because QALY is our unit of measurement. We want to captupe the main significant effects of interventions no matter what form they take, and express them in terms of QALYs even if this involves approximation and uncertainty.

## Core Principles

When working on effectiveness estimations, always:

1. **Make sure assumptions are factored out explicitly and listed in the assumptions section** — For any number that is introduced in a way where it affects the calculation of one of the point estimates, it should be listed in the assumptions. The goal is extreme transparency.
2. **Make reasoning clear and legible** — We want the reader to have a very clear picture of how the calculations were done and the structure of the reasoning. Make things as clear as possible.
3. **Be concise without sacrificing clarity or reasoning quality** - We don't want to flood the user with massive amounts of info that they can't process, unless it's really necessary. Make sure everything in these files actually adds important info or clarity.
4. **Don't make references to what previous version of the estimates claimed** - We can't expect readers to track the edit history of these documents. Only refer to reasoning that exists within the current documents. The goal is for these justifications to stand on their own.
5. **Don't be too anchored to the existing estimates** - If your research and reasoning leads you to think that some estimate should be different, change it. Don't simply try to create a plausible justification for the existing estimates. Operate as a bayesian reasoner.

## Other considerations

1. **Cite sources with links** — If you rely on some external source, cite it with a link, using the same link formatting that is used throughout these files.
2. **Every assumption should either be straightforward or have some justification** - If an assumption is not already supported by a high quality link (or several), there should be at least some effort in the details section to justify it. It can be brief and acknowledge lots of uncertainty.
3. **Follow the format of the other estimation files** - If you're adding a new file, look to other similar files and be consistent with their format.
4. **Make use of standalone assumption pages when justifications get too complex** - Sometimes an assumption will be extremely important and will require a lot of justification. In these cases we give the assumptions their own page in the contrent/assumptions directory. There can be a chain of arbitrary length of these assumptions files having their own assumptions and referring to other assumptions files.
5. **Don't use "I" in these estimates** - If you must, say "we" rather than "I". These estimates are being maintained by many people, not just you.
6. **Don't round numbers up/down unless you have a good reason to** - If you get some number from your calculations and it has too many significant digits, you can round to a reasonable number of significant digits, but don't round up or down unless you have a really strong justification.
7. **Use "# Internal Notes" if it seems helpful** - Each of these files has an "# Internal Notes" section that can be used by editors of the file to discuss relevant considerations which won't be rendered to the user. If there are things you want to put here that may be useful to future editors, do so.
8. **Typeset math as KaTeX, never in backtick code spans** - Calculations and equations go in `$...$` or `$$...$$` (full conventions in the "Math rendering" section of `content/CLAUDE.md`). Two hard rules: escape literal dollar signs as `\$` in prose, and any equation containing a literal `\$` must use `$$...$$` delimiters — inside single-`$` spans the escape is not processed, so the dollar closes the span early and the line renders as broken fragments (mid-line `$$...$$` still renders inline). Code spans are only for literal identifiers like YAML field names; backslash escapes don't work inside them either.
9. **Every published range is an 80% subjective credence interval** - Whenever you state an uncertainty range (a cost-per-QALY range, a parameter range, a p(doom) range, etc.), it means we are ~80% confident the true value lies inside it, with ~10% probability it is lower and ~10% higher. This is a subjective Bayesian credence, so rougher estimates simply get **wider** intervals — there is no separate "sensitivity range" or "confidence interval" concept. Call it a **"plausible range"** everywhere, and at the FIRST mention on a page write the `{{PLAUSIBLE_RANGE}}` token (or `{{PLAUSIBLE_RANGE_CAP}}` to open a sentence or bold label) so it renders the definition tooltip; one token per page, later mentions plain. On cost-per-life category pages the token goes in the section heading — `## Point estimates and {{PLAUSIBLE_RANGES}}` (plural variant) — so it labels the parenthetical ranges shown there. If you compute bounds via a parameter sweep that is narrower than your true 80% interval, widen the stated range to your best-judgment 80% interval rather than presenting the sweep as the range. (Full convention in `content/CLAUDE.md`.)
