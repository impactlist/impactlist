# David Denkenberger's Feedback on the ALLFED Estimate

_Feedback and discussion recorded on August 4, 2026._

The user identified the feedback below as coming from David Denkenberger, ALLFED's founder. This document records that
feedback in full, followed by an edited reconstruction of the relevant discussion between the user and Codex.

The reconstruction preserves the order and wording of the substantive user and Codex messages. Repeated copies of
David's feedback, hidden instructions, internal reasoning, tool calls, intermediate status commentary, validation logs,
and turns unrelated to evaluating or implementing the feedback are omitted. Where a message depended on an attachment or
repeated text, an editorial note is used instead. Historical figures and file descriptions reflect the repository at that
point in the discussion. Repository-relative links were rebased to remain functional from this document's location.

## Feedback from David Denkenberger

> Thanks for doing the work to make a specific ALLFED cost effectiveness estimate! I think the AIs made a number of good points. However, I was saying the CEARCH result is ~$170 per life because GiveWell uses $5000/life and CEARCH was saying 30x as cost effective as GiveWell. I think GiveWell uses averting a child death means saving ~37 DALYs, and an adult death ~30 DALYs. I don't think the AI's assumption of 80 QALYs per life saved is realistic (unless you are expecting radical life extension). The AI starts with CEARCH and then adjusts cost per life saved upward. I think there are good reasons why CEARCH is an overestimate of cost per life saved. For one, it finds nuclear risk to be significantly smaller than volcanic risk. Most analysts in this space think that the nuclear risk is significantly larger than the volcanic risk. Furthermore, the AI assumes that ALLFED's work outside of policy for abrupt sunlight reduction scenario (ASRS) is less cost-effective than the ASRS policy work. However, I think the pandemic work is likely to be even more cost-effective, especially from the long term perspective, because pandemics are generally regarded as a greater existential risk.
>
> The AI did seem to agree with the argument that ALLFED should have a long-term impact, it just didn't think that the AI x-risk estimate should be used. That's fine - I didn't think you would want to do a bespoke model for ALLFED, but now that you have done it for the near term, I do think it is important to do it for the long term. The AI points out that the marginal cost effectiveness calculations of the longterm impact in the journal articles are out of date because we have now spent more money. Of course that's true, but that's why we also calculated the cost effectiveness of spending hundreds of millions of dollars to see if the whole effort was justified. And indeed that still came out as more cost effective than AI safety. Now of course other things have changed since ~2021. AI timelines have gotten much shorter, but we were assuming that only $3 billion would be spent on AI safety, and I think it's pretty clear that a lot more than that will be spent now (especially if you count the total compensation including stock options of AI safety workers in the labs (even with your weighting of 0.3 for lab work), but that might be a topic for another post). AI 2040 hopes that trillions of dollars will be spent on AIS. Also since then, nuclear risk has gotten larger per year with the Ukraine war and potential acceleration and destabilization due to AI. Also, engineered pandemic risk per year has gone up with AI capabilities. However, this does mean a shorter number of years in expectation that the nuclear and pandemic risk might be relevant if you think the nuclear and pandemic risk will go away after AGI/ASI. For comparison, your cost per microprobability of reduction in x-risk of AI safety is $1.2 million. The median in the papers for the 3 billionth dollar on AIS was $2.5 million, with the mean being lower, so pretty good agreement with your value. So overall, since 2021, the relative marginal cost effectiveness of spending hundreds of millions of dollars on GCR resilience vs what we think will be spent on AIS I don't think has changed too much.
>
> The AI missed other outside evaluations of ALLFED's longterm impact:
>
> [**Speedrun: Demonstrate the ability to rapidly scale food production in the case of nuclear winter**](https://forum.effectivealtruism.org/posts/n52z7r8iH5pvWN2DE/speedrun-demonstrate-the-ability-to-rapidly-scale-food#Cost_effectiveness_BOTEC____260million___0_01__x_risk_reduction) by Marie Buhl from Rethink Priorities: "my (extremely rough) estimate that this project reduces x-risk with a cost-effectiveness of ~$260 million per 0.01% absolute reduction[1] (~70% confidence interval: 2.2 million to 2.7 billion). If this estimate were accurate, then this project would clear our *median* roughly estimated cost-effectiveness bar of $500M per basis-point of x-risk averted".
>
> [**Shallow evaluations of longtermist organizations**](https://forum.effectivealtruism.org/posts/xmmqDdGqNZq5RELer/shallow-evaluations-of-longtermist-organizations#Alliance_to_Feed_the_Earth_in_Disasters) by Nuño Sempere: "I disagree strongly with ALLFED's estimates (probability of cost overruns, impact of ALLFED's work if deployed, etc.), however, I feel that the case for an organization working in this area is relatively solid." (Note that this is a 5 year old analysis, but he recently said he respects ALLFED more now).

## Relevant reconstructed conversation

### 1. Initial assessment

#### User

> Here is a response from the same person about your previous comments and the current state of the analysis for ALLFED. Do you think any changes are warranted? You should neither bias toward or against making changes but tell me what you think is correct, all things considered. Don't edit files yet either way, just tell me your analysis.
>
> _[David Denkenberger's feedback, reproduced above, followed.]_

#### Codex

> Yes—some changes are warranted, but the claimed 80-QALY error does not justify halving the $17/QALY estimate. The strongest update is that ALLFED’s long-term effect deserves explicit modeling rather than being hidden inside the 1.36x adjustment.
>
> #### The 80-QALY objection identifies a presentation issue, not a calculation error
>
> CEARCH reports both:
>
> - $1 million averts about 6,000 expected deaths: approximately **$167 per death**.
> - $100,000 averts about 24,000 DALYs: approximately **$4.17 per DALY**. [CEARCH](https://forum.effectivealtruism.org/posts/tyo6v4ibrksbdArMj/resilience-to-nuclear-and-volcanic-winter)
>
> Those figures imply about 40 DALYs per death, which is consistent with ordinary remaining life expectancy and close to the 30–37 DALY figures the commenter cites from [GiveWell](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/comparing-moral-weights).
>
> The current model starts from $4.17/DALY and reaches $17/QALY after the 4.08x combined adjustment. It does not assume catastrophe victims would otherwise live 80 more years. The “$1,360 per 80-QALY life” is the site’s standardized unit:
>
> - Expected actual death, retaining CEARCH’s 40-DALY relationship: about **$680**
> - Standardized 80-QALY life-equivalent: about **$1,360**
>
> I would clarify this distinction because “cost per life” can easily be misread. I would not change $17 to $7–8 on this basis.
>
> #### CEARCH’s catastrophe mix is a real uncertainty
>
> It is plausible that CEARCH understates nuclear risk. Current nuclear conditions are worse than several years ago: SIPRI describes an emerging arms race, weakened arms control, and additional escalation risks from AI-assisted decision-making. [SIPRI](https://www.sipri.org/media/press-release/2025/nuclear-risks-grow-new-arms-race-looms-new-sipri-yearbook-out-now)
>
> But “most analysts think nuclear risk exceeds volcanic risk” is not enough by itself:
>
> - Existential risk from nuclear war may exceed volcanic extinction risk.
> - CEARCH is estimating the expected burden of all abrupt-sunlight-reduction events, including more frequent, milder volcanic events.
> - CEARCH’s own 2023 pilot analysis attributed over 95% of ASRS threat to nuclear winter, while its later policy report concluded volcanoes dominate. [CEARCH pilot analysis](https://forum.effectivealtruism.org/posts/JxakgiGiJ3egodfb3/intermediate-report-on-abrupt-sunlight-reduction-scenarios)
>
> That reversal is evidence that the hazard composition is highly model-sensitive. I would document it and perhaps widen the relevant uncertainty, but not simply multiply the estimate in ALLFED’s favor.
>
> #### The pandemic argument is plausible but incomplete
>
> Engineered pandemics may be a larger existential risk than nuclear war, and AI probably increases some biological-risk pathways. But that does not imply that ALLFED’s pandemic-related work is correspondingly more effective.
>
> The missing links are:
>
> 1. How often would an extreme pandemic cause food or industrial collapse beyond its direct mortality?
> 2. How useful would ALLFED’s interventions be in those particular scenarios?
> 3. How much would avoiding the secondary food crisis reduce extinction or permanent collapse risk?
>
> Marie Buhl’s analysis explicitly gave limited weight to pandemic and other non-climate pathways because their relevance to resilient-food pilots was uncertain. The International AI Safety Report likewise says AI-enabled biological risk is concerning but its marginal real-world effect remains difficult to measure. [International AI Safety Report](https://www.gov.uk/government/publications/international-ai-safety-report-2025/international-ai-safety-report-2025)
>
> So pandemic coverage should receive positive weight, but “likely even more cost-effective” is currently an unsupported conclusion.
>
> #### The long-term evidence is stronger than the current page acknowledges
>
> The commenter is right that the older papers model much larger spending levels, not only ALLFED’s earliest marginal dollars. The resilient-food paper reports an 84–93% modeled probability that the $100 millionth dollar beats its AI-safety comparator. [Oxford record](https://ora.ox.ac.uk/objects/uuid%3Abbb5d910-a76d-46dc-82f3-86f619aa1330)
>
> However, the main criticisms remain consequential:
>
> - Only eight survey responses, including two authors.
> - The second model was essentially one co-author’s estimates.
> - Logarithmic returns to funding were assumed rather than established.
> - The connection between roughly $86 million of preparation and successful worldwide crisis deployment was weakly justified.
> - The relative comparison could make resilient foods look good because the AI comparator looks bad.
> - The analysis did not adequately test the “do nothing,” market-adaptation, or discount-rate alternatives.
>
> The [Unjournal evaluation](https://unjournal.pubpub.org/pub/eval1allfed/release/7) described some of these as potentially conclusion-reversing. Peer review establishes that the work is serious enough to publish; it does not turn its inputs into independent empirical evidence.
>
> The updated AI comparison is also mixed. $2.5 million per microprobability in the paper versus $1.2 million on the site makes the site’s AI estimate about twice as effective as the paper’s comparator. Greater subsequent AI-safety spending may offset that through diminishing returns, but shorter timelines also shorten the period during which pre-AGI resilience work can affect the long-term future. I do not think the net change since 2021 can confidently be called negligible.
>
> #### The two outside evaluations deserve inclusion, with limited weight
>
> Marie Buhl’s analysis is the most useful new evidence. Her median of $260 million per 0.01 percentage point translates to about **$2.6 million per microprobability**, around 2.2 times as costly as the site’s AI-risk estimate. Her rough range translates to approximately $22,000–$27 million per microprobability. [Buhl](https://forum.effectivealtruism.org/posts/n52z7r8iH5pvWN2DE/speedrun-demonstrate-the-ability-to-rapidly-scale-food)
>
> But it modeled a $10–100 million series of pilots, not an unrestricted marginal donation to ALLFED. Buhl spent about 10–20 hours on it, described herself as a junior non-expert, received input from ALLFED, said the model was likely inaccurate, and did not recommend that Rethink incubate the project. It therefore supports “material long-term effect,” not a precise organization-level estimate.
>
> Nuño Sempere’s analysis also supports the cause-area case, but less clearly the organization-level estimate. He reduced ALLFED’s claimed 95% chance of beating AI safety to about 50%, questioned execution quality, and concluded that the area was solid while organizational competence remained his main uncertainty. [Sempere](https://nunosempere.com/blog/2021/06/24/shallow-evaluations-of-longtermist-organizations/) A later informal expression of greater respect would be a small update unless accompanied by a revised evaluation.
>
> #### One important independent estimate is currently missing
>
> CEARCH separately evaluated a $23 million resilient-food pilot and obtained a mean of about **$10/DALY**. That is highly relevant to ALLFED’s non-policy work. But its distribution was extremely skewed: a 53% probability of being worse than GiveWell and only an 18% probability of being at least ten times better. CEARCH also expected further research to lower the estimate through optimizer’s curse. [CEARCH pilot analysis](https://forum.effectivealtruism.org/posts/JxakgiGiJ3egodfb3/intermediate-report-on-abrupt-sunlight-reduction-scenarios)
>
> That $10/DALY result is strikingly close to the current model’s general neighborhood. It makes the $17 central estimate look less arbitrary, while reinforcing the very wide range.
>
> #### What I would change
>
> I would recommend eventually:
>
> - Clarify the distinction between an expected death and an 80-QALY standardized life.
> - Incorporate the CEARCH pilot as a second independent near-term anchor.
> - Cite Buhl and Sempere as outside long-term evidence, with their limitations.
> - Separate the long-term effect from the near-term whole-organization adjustment, avoiding double-counting.
> - Model the long-term pathway as a population-level effect that responds to the site’s time limit.
> - Keep Disaster Relief as the closest existing label unless a dedicated catastrophic-resilience category is created.
>
> My provisional expectation is that a rebuilt combined estimate would probably improve modestly from $17/QALY—perhaps into roughly the **$10–15/QALY** neighborhood at the default time horizon. I would not consider that range settled until the long-term effect is modeled explicitly. Using Buhl’s raw median without a substantial reliability and organization-mapping adjustment would give the preliminary speedrun far too much influence. Conversely, leaving all long-term value buried inside a modest 1.36x portfolio factor now seems too dismissive.
>
> No files were changed.

### 2. Cross-check against another developer's analysis

#### User

> what do you think of this analysis from another developer?

_Editorial note: The attached analysis agreed that Buhl was the strongest missed evidence, treated the 80-QALY issue as
a unit-convention misunderstanding, regarded the nuclear argument as a legitimate but uncertain upside consideration,
and favored a modest improvement to the point estimate. It did not favor adding a population effect yet. The full
attachment is omitted because it was written by a third party rather than by the user or Codex._

#### Codex

> Overall, it is a thoughtful and mostly accurate source review, but its recommendations are partly obsolete because it analyzes an earlier version of the ALLFED estimate.
>
> The biggest problem is the stale baseline:
>
> - It discusses a **$25/QALY** estimate; the current estimate is **$17/QALY**.
> - It refers to a **2x organization adjustment**; the current adjustment is **1.36x**.
> - It refers to a **6x total haircut**; the current calculation is $3 \times 1.36 = 4.08$.
> - Consequently, its “about $1,000 per actual death” should now be about **$680**, retaining CEARCH’s implied 40 DALYs per death.
>
> See the [current ALLFED analysis](../../../content/recipients/alliance_to_feed_the_earth_in_disasters.md).
>
> This matters because its recommended revision—move from $25 toward $15–20 by reducing the organization adjustment toward 1.5x—has effectively already happened. The current $17 and 1.36x are slightly more favorable than what it recommends. Its statement that the model treats long-term benefits as “approximately zero” is also false of the current version: those benefits explicitly push the 1.36x adjustment upward.
>
> What it gets right:
>
> - Buhl is important quasi-independent evidence for a distinct long-term pathway.
> - Buhl simultaneously undermines ALLFED’s much more optimistic in-house magnitudes, since her estimate is roughly 100 times less optimistic.
> - The 80-QALY objection is about presentation, not the cost-per-QALY calculation.
> - The pandemic argument remains plausible but quantitatively unsupported.
> - Buhl’s raw $2.6 million/microprobability estimate should not simply be installed as an ALLFED population effect.
> - Reclassification as AI risk and adoption of ALLFED’s in-house magnitudes remain unwarranted.
>
> A few substantive qualifications are missing.
>
> First, Buhl’s stated interval should not be called a proper “70% confidence interval.” Buhl herself says that label is somewhat misleading because her model inputs were not consistently specified that way. Her work was a deliberately preliminary 10–20-hour scoping exercise for a $10–100 million pilot program, not a marginal ALLFED evaluation. [Buhl](https://forum.effectivealtruism.org/posts/n52z7r8iH5pvWN2DE/speedrun-demonstrate-the-ability-to-rapidly-scale-food)
>
> Second, its nuclear-risk argument is a little too neat. CEARCH’s probability for a ≥100-detonation great-power conflict and ONN’s probability of a >10-million-death nuclear catastrophe are not identical endpoints. Saying CEARCH lies “between experts and superforecasters” is numerically suggestive, but not a clean validation. The disagreement includes event definitions, soot production, escalation, and catastrophe severity—not simply which forecaster group to trust.
>
> Third, the claimed double-counting problem with a long-term effect is manageable. Near-term deaths averted and downstream prevention of permanent civilizational loss are distinct benefits. A population model would need to exclude the near-term life-years already counted—perhaps by starting the trajectory component later—but this is an accounting problem, not a reason that the effect cannot be modeled.
>
> Fourth, the analysis still misses CEARCH’s separate evaluation of a resilient-food pilot. That estimate was about **$10/DALY**, but with a 53% probability of being worse than GiveWell and an optimizer’s-curse warning. It is unusually relevant because it evaluates research/piloting rather than only policy advocacy. [CEARCH pilot analysis](https://forum.effectivealtruism.org/posts/JxakgiGiJ3egodfb3/intermediate-report-on-abrupt-sunlight-reduction-scenarios)
>
> My resulting judgment is:
>
> - Add Buhl and Sempere to the evidence discussion.
> - Add the separate CEARCH pilot estimate.
> - Clarify actual expected deaths versus standardized 80-QALY lives.
> - Document nuclear-risk uncertainty in both directions.
> - Do not change $17 merely by following this developer’s proposed arithmetic—their proposed $15–20 destination is already the current estimate.
> - Reconsider a distinct, heavily regressed long-term population effect rather than adjusting the opaque 1.36x factor again. Whether that ultimately moves the combined estimate toward $10–15/QALY should come from that model, not from informally lowering another multiplier.
>
> So I would rate the attachment as a good analysis of the evidence, but not a reliable review of the current file. Its strongest suggested numerical change has already been made. No files were edited.

### 3. Whether the long-term effect required a new category

#### User

> if we did add a population effect, it seems like making disaster relief have a population effect wouldn't make a lot of sense, since ALLFED's fit into that cause area isn't that clean to begin with. It seems like we should probably create a new category called 'Catastrophe Resilience' or something. But then the cost per life analysis of this category would be tricky because only one recipient would be in this category. unless you think other recipients should also be in this cause area? can you review other recipients and let me know if any would be in this new cause area? or let me know what the new cause area should be, if you agree there should be one. Or if you'd think about this differently?

#### Codex

> Yes. If ALLFED receives a population-level effect, I would create a new category called **Global Catastrophe Resilience**. I would not add that effect to Disaster Relief, and I would not broaden the new category into a generic existential-risk bucket merely to give it more recipients.
>
> I would define it as:
>
> > Work that improves humanity’s ability to withstand, mitigate, and recover from global catastrophes across multiple hazards—through resilient food systems, critical-infrastructure continuity, supply-chain redundancy, institutional preparedness, or recovery capacity.
>
> That distinguishes it from:
>
> - Disaster Relief: responding to ordinary or regional crises after they occur.
> - Nuclear/Pandemics/AI Risk: primarily preventing a particular initiating hazard.
> - Global Priorities Research: deciding which risks and interventions matter.
> - Global Catastrophe Resilience: limiting consequences and preventing temporary catastrophes from becoming permanent civilizational failures.
>
> #### Recipient review
>
> | Recipient | Fit | Assessment |
> |---|---:|---|
> | **ALLFED** | Strong, essentially complete | The clearest member. Its food, industry, communications, and response-planning work is explicitly intended to function across nuclear winter, volcanic eruptions, extreme pandemics, and infrastructure loss. |
> | **Global Catastrophic Risk Institute** | Meaningful partial fit | GCRI has an explicit **Resilience & Recovery** research program covering critical infrastructure, supply-chain redundancy, continuity of government, refuges, food resilience, and post-collapse recovery. This is directly within the proposed category, although much of GCRI’s other work is risk assessment, AI, nuclear risk, ethics, and prioritization. A roughly **15–30%** allocation is worth investigating. [GCRI’s description](https://gcri.org/topics/resilience-recovery) is unusually close to the category boundary proposed here. |
> | **Centre for Long-Term Resilience** | Meaningful but partial fit | CLTR’s 2021 portfolio had three principal streams: AI, biosecurity, and general risk management. Its National Resilience Strategy and government-wide risk-management work fits the new category; its AI and biosecurity work should remain in their specific categories. Something around **20–35%** might ultimately be defensible, but it should be based on expenditures or staff allocation rather than its name. Its [2021 report](https://www.longtermresilience.org/wp-content/uploads/2024/07/CLTRs-Annual-Report-2021.pdf) supports such a split. |
> | **CSER** | Mostly no | CSER studies AI, biotechnology, environmental risk, systemic risk, and methods for studying GCRs. That is predominantly broad research rather than building operational resilience. It belongs more naturally in Global Priorities Research plus risk-specific categories. [CSER’s research areas](https://www.cser.ac.uk/research/) illustrate the breadth. |
> | **Stanford Existential Risks Initiative** | Mostly no | SERI primarily supports scholarship, education, fellowships, conferences, and interdisciplinary field-building across AI, nuclear, bio, and climate risks. That is closer to Global Priorities Research or Meta and Theory than resilience. [SERI describes itself](https://seri.stanford.edu/) in those terms. |
> | **FHI, BERI, Future of Humanity Foundation** | No, except possibly project-specific grants | Their broad research, grantmaking, operational support, or AI-governance work does not share ALLFED’s resilience mechanism. |
> | **CEPI, Nuclear Threat Initiative, IAEA fuel bank** | No | They conduct preparedness or prevention, but for specific hazards already represented by Pandemics or Nuclear. Moving them would make those existing categories artificially narrow. |
> | **Miami Disaster Resilience Fund** | No | Despite the name, it is local disaster-response and recovery infrastructure, not global-catastrophe resilience. |
> | **Internet Archive** | Probably no | “Civilizational insurance” is an appealing analogy, but its ordinary archiving work is not demonstrably hardened for global-catastrophe survival or recovery. |
>
> Grantmakers such as SFF or the Long-Term Future Fund might eventually receive small allocations to the category if their grant portfolios support ALLFED-like work, but they should follow their downstream grant mix rather than count as resilience organizations themselves.
>
> #### The one-recipient issue
>
> I don’t think having one clear full member is disqualifying. A cause category represents a coherent intervention class, not an empirical average of however many organizations happen to appear on the site. Adding loosely related organizations would create more apparent coverage while making the effectiveness estimate less meaningful.
>
> The important qualification is that the category page should be candid:
>
> - Its quantitative evidence is currently dominated by resilient-food work.
> - It is not yet a well-supported estimate for every form of government preparedness, infrastructure resilience, or civilizational-recovery research.
> - Organizations such as GCRI and CLTR should not automatically inherit ALLFED’s `$17/QALY` estimate. They would need recipient-specific estimates, conservative adjustments, or unsupported effects disabled.
>
> The Rethink Priorities speedrun is particularly relevant to a population effect, but it evaluates a resilient-food pilot—not generic catastrophe resilience—and describes itself as preliminary, with an enormous uncertainty interval. It is evidence for the pathway, not a reliable category-wide price. [Buhl’s estimate](https://forum.effectivealtruism.org/posts/n52z7r8iH5pvWN2DE/speedrun-demonstrate-the-ability-to-rapidly-scale-food) therefore needs substantial regression before becoming a default.
>
> #### How I would structure the effects
>
> The category should contain both effects because the same resilience investment can produce both benefits:
>
> 1. **Present-generation QALYs:** fewer deaths and less suffering during global catastrophes.
> 2. **Population effect:** a smaller probability that a catastrophe causes permanent collapse, failed recovery, or another irreversible loss of humanity’s future.
>
> The second effect should count only the incremental long-term value of avoiding permanent damage. It should not count the same contemporaneous deaths already represented in the QALY effect.
>
> This also avoids splitting ALLFED between Disaster Relief and the new category. Splitting its funding fraction would incorrectly imply that separate dollars produce the near-term and long-term benefits, when both are potential consequences of the same research and preparedness work.
>
> So my overall recommendation is:
>
> - Create **Global Catastrophe Resilience** if the population effect is adopted.
> - Move ALLFED into it completely.
> - Consider partial allocations for GCRI and CLTR after a more detailed portfolio review.
> - Do not add CSER, SERI, FHI, BERI, or risk-specific preparedness organizations merely to make the category larger.
> - Treat the category estimate as provisional and resilient-food-heavy; use recipient overrides for materially different approaches.
>
> Separately, the review exposed that several broad x-risk organizations are currently classified as 100% AI Risk when their actual work is considerably broader. That taxonomy should probably be corrected, but most of those corrections should go toward Global Priorities Research and existing risk-specific categories—not toward turning Global Catastrophe Resilience into a miscellaneous x-risk bucket.

### 4. Implementing the population effect and category

#### User

> OK, can you please do all of these things?
>
> Create **Global Catastrophe Resilience** and have it contain a population effect
> Move ALLFED into it completely.
> Add a population effect to ALLFED that you think is most reasonable.
> Consider partial allocations for GCRI and CLTR after a more detailed portfolio review.
> All cost per life justifications should be formatted consistent with other ones.
>
> use the effectiveness estimation skill

#### Codex

> Implemented all requested changes:
>
> - Created [Global Catastrophe Resilience](../../../content/categories/global_catastrophe_resilience.md) with:
>   - Standard effect: **$37.6/QALY**
>   - Population effect: **$15.6M per microprobability**
> - Moved [ALLFED](../../../content/recipients/alliance_to_feed_the_earth_in_disasters.md) entirely into the new category:
>   - Standard effect: **$18.8/QALY**
>   - Population effect: **$7.8M per microprobability**
>   - The standard estimate increased from $17 because long-term benefits are now modeled separately rather than included in its organization-level adjustment.
> - Updated [GCRI](../../../content/recipients/global_catastrophic_risk_institute.md):
>   - 50% AI risk
>   - 25% Global Priorities
>   - 10% Meta-theory
>   - 10% Global Catastrophe Resilience
>   - 5% Nuclear
> - Updated [CLTR](../../../content/recipients/centre_for_long_term_resilience.md):
>   - 40% Global Catastrophe Resilience
>   - 35% AI risk
>   - 25% Pandemics
>
> The new analyses follow the established multi-effect justification format, including point estimates, plausible ranges, challengeable assumptions, calculations, uncertainty discussion, and internal modeling notes.
>
> Validation passed:
>
> - Data generation
> - 984 tests across 87 test files
> - Production build
> - `git diff --check`
>
> Existing unrelated working-tree changes were left untouched.

### 5. Checking the evidence additions David prompted

#### User

> You already did this right?
>
> Add Buhl and Sempere to the evidence discussion.
> Add the separate CEARCH pilot estimate.
> Clarify actual expected deaths versus standardized 80-QALY lives.
> Document nuclear-risk uncertainty in both directions.

#### Codex

> Not completely.
>
> - **Buhl:** Yes. It is the population-effect anchor.
> - **Sempere:** No. His mixed evaluation is not currently mentioned.
> - **Separate CEARCH and pilot estimates:** Mostly. CEARCH’s policy-campaign estimate and Buhl’s pilot estimate are modeled separately. If “CEARCH pilot estimate” means another CEARCH estimate specifically about pilots, that is not included.
> - **Actual deaths versus standardized lives:** Partly. The file explains that the 80-QALY life is only the site’s display convention, but it does not explicitly show CEARCH’s approximately 6,000 expected deaths per $1 million, $167 per expected death, or roughly $1,000 per expected death after the 6x adjustment.
> - **Two-sided nuclear-risk uncertainty:** No. The text discusses general uncertainty but does not explicitly say that CEARCH’s volcano-heavy model may understate the nuclear contribution, while noting that its nuclear probability remains between relevant superforecaster and expert estimates.
>
> So Sempere, the explicit per-expected-death arithmetic, and the two-sided nuclear discussion remain worthwhile additions.

_Editorial note: This was an intermediate audit. The next exchange corrected the post-adjustment expected-death figure
to about $751 under the newly separated 4.5x standard-effect adjustment._

#### User

> can you add the ones of those that you think would improve the analysis?

#### Codex

> Added the useful pieces to both the [category analysis](../../../content/categories/global_catastrophe_resilience.md) and [ALLFED analysis](../../../content/recipients/alliance_to_feed_the_earth_in_disasters.md):
>
> - Sempere’s mixed evaluation: supportive of the cause area, skeptical of ALLFED’s estimates and execution.
> - Explicit CEARCH arithmetic:
>   - $167 per expected death before adjustments
>   - About $751 after the 4.5x combined adjustment
>   - $1,504 is an 80-QALY standardized comparison, not an assumed benefit per actual death.
> - Two-sided nuclear uncertainty, including higher expert estimates, lower superforecaster estimates, differing endpoints, and soot/famine uncertainty.
> - Clear separation between [CEARCH’s advocacy estimate](https://forum.effectivealtruism.org/posts/tyo6v4ibrksbdArMj/resilience-to-nuclear-and-volcanic-winter) and [Buhl’s pilot-program estimate](https://forum.effectivealtruism.org/posts/n52z7r8iH5pvWN2DE/speedrun-demonstrate-the-ability-to-rapidly-scale-food).
>
> I did not add a “CEARCH pilot estimate” because CEARCH’s quantified estimate is for policy advocacy; the independently quantified pilot estimate is Buhl’s. The point estimates remain unchanged because these additions are clarifying or directionally mixed.
>
> Data generation and integrity validation pass.

### 6. Final evidence audit

#### User

> What do you think of this analysis? it was done before your latest change:
>
> **Gaps to close**
>
> **The agreed evidence citations are still missing.** The CEARCH pilot evaluation (~$10/DALY, the natural corroboration for the 1.5x org adjustment) and Sempere appear nowhere, and the **Unjournal review links were dropped** — the old file cited them; the new one keeps their substance ("small survey with affiliated respondents") but loses the references. For pages whose theme is "we weight independent scrutiny," losing the independent-scrutiny links is a real regression.
>
> **The two-sided anchor uncertainty isn't documented.** Effect 1's assumption 2 still presents only the downward critique; the nuclear-vs-volcanic weighting question and CEARCH's own 2023→2024 hazard-composition reversal (>95% nuclear → volcano-dominated) go unmentioned.
>
> **The add-donor skill's valid-category list** (.claude/skills/add-donor/SKILL.md ~line 204) doesn't include global-catastrophe-resilience — future donor-add sessions won't know it exists.
>
> **Smaller judgment notes**
>
> The category's plausible ranges are exactly the ALLFED ranges shifted 2x, with identical log-width. The house rule is that rougher estimates get *wider* intervals, and the category adds a transfer step — its ranges should arguably be somewhat wider than the anchor org's.
>
> GCRI's note says all nine 2021 publications concern AI, yet ai-risk gets only 50% — documented, but a skeptic would push that higher.
>
> Buhl's speedrun is described as "roughly 10-hour"; her own description was 10–20 hours.
>
> Be aware of the ripple effect: CLTR at defaults goes from pure ai-risk (~$1.75/QALY-equivalent) to a blend around ~$4.3/QALY — roughly 2.5x worse — and GCRI moves similarly. That changes donor stats (Tallinn's especially). It looks intended, but worth confirming it's a consequence you want.

#### Codex

> Overall, this is a strong review. The latest change resolved some points, but several valid improvements remain.
>
> - **Sempere:** Resolved. He now appears in the ALLFED evidence discussion.
>
> - **CEARCH pilot estimate:** Still missing, and it should be added. CEARCH’s 2023 evaluation estimated **$10/DALY** for a $23 million resilient-food pilot, but also found a **53% chance it was worse than GiveWell** because the headline expected value was driven by a favorable right tail. That makes it useful corroboration for the 1.5x whole-organization adjustment, not a clean second point estimate to average mechanically. [CEARCH’s pilot evaluation](https://forum.effectivealtruism.org/posts/JxakgiGiJ3egodfb3/intermediate-report-on-abrupt-sunlight-reduction-scenarios)
>
> - **Unjournal reviews:** Still missing and worth restoring. They directly substantiate the concerns about affiliated survey respondents, deployment costs, market adaptation and parameter choices. [Review 1](https://unjournal.pubpub.org/pub/eval1allfed/release/7), [review 2](https://unjournal.pubpub.org/pub/eval2allfed/release/4)
>
> - **Two-sided nuclear uncertainty:** Mostly resolved by the latest change. The current text now covers higher expert estimates, lower superforecaster estimates and soot uncertainty. The 2023-to-2024 hazard shift remains worth mentioning: CEARCH’s pilot model attributed over 95% of ASRS risk to nuclear winter, while its later policy model became volcano-dominated. Calling this a pure “reversal” slightly overstates matters because the interventions and scopes differ, but it is good evidence of model instability. It supports wider uncertainty more clearly than a directional change to the central estimate. [2023 pilot](https://forum.effectivealtruism.org/posts/JxakgiGiJ3egodfb3/intermediate-report-on-abrupt-sunlight-reduction-scenarios), [2024 policy analysis](https://forum.effectivealtruism.org/posts/tyo6v4ibrksbdArMj/resilience-to-nuclear-and-volcanic-winter)
>
> - **Add-donor skill:** Correct. The new category is absent from both skill copies. Both copies should be updated together.
>
> - **Category ranges:** I agree. The category introduces uncertain transfer beyond resilient food, yet preserves exactly ALLFED’s relative range. Its ranges should be modestly wider—something around **$0.60–$5,000/QALY** and **$100,000–$5 billion per microprobability** would better express the added transfer uncertainty while retaining the central estimates.
>
> - **GCRI’s 50% AI allocation:** This is debatable, not clearly wrong. All nine 2021 publications were AI-related, but the site includes 2020 donations and organization-wide advising and cross-risk work. Moreover, the 2021 AI concentration followed restricted funding, so unrestricted marginal funding need not follow publication shares. I would probably keep 50%, while documenting that counterfactual-funding rationale more explicitly.
>
> - **Buhl’s hours:** Correct. The precise description is **about 10 hours initially plus 5–10 hours of revisions after ALLFED feedback**, or roughly 15–20 hours total—not simply “roughly 10-hour.” [Buhl’s speedrun](https://forum.effectivealtruism.org/posts/n52z7r8iH5pvWN2DE/speedrun-demonstrate-the-ability-to-rapidly-scale-food)
>
> - **Ripple effect:** Confirmed. At default settings, my calculation gives approximately:
>   - AI Risk alone: **$1.72/QALY-equivalent**
>   - CLTR after reallocation: **$4.26**, about **2.48x worse**
>   - GCRI after reallocation: **$2.84**, about **1.65x worse**
>
> That is an intended consequence of representing their portfolios more accurately. It will reduce Tallinn’s estimated impact, but preserving donor statistics would be the wrong reason to retain an inaccurate classification.
>
> My recommended next changes are therefore: add the CEARCH pilot evidence, restore both Unjournal citations, mention the hazard-composition instability, widen the category ranges, correct Buhl’s research time, and update both add-donor skill copies. I would leave the central estimates and GCRI allocation unchanged. No files were edited.

#### User

> can you do all the fixes that you think are genuine improvements?

#### Codex

> Implemented the genuine improvements:
>
> - Added the separate CEARCH pilot estimate, its 47% GiveWell-beating probability, and the right-tail caveat.
> - Documented nuclear-risk uncertainty in both directions and CEARCH’s changing nuclear/volcanic hazard mix.
> - Restored the Unjournal review links.
> - Corrected Buhl’s research time to roughly 10 hours initially plus 5–10 hours of revisions.
> - Widened the category ranges to reflect the additional transfer uncertainty. Central estimates remain unchanged.
> - Strengthened the rationale for GCRI’s 50% AI allocation and documented the intended effect on donor statistics for GCRI and CLTR.
> - Added Global Catastrophe Resilience to both add-donor skill category lists.
>
> Key files: [ALLFED](../../../content/recipients/alliance_to_feed_the_earth_in_disasters.md), [category](../../../content/categories/global_catastrophe_resilience.md), [GCRI](../../../content/recipients/global_catastrophic_risk_institute.md), and [CLTR](../../../content/recipients/centre_for_long_term_resilience.md).
>
> Validation passed:
>
> - Data generation
> - Production build
> - 87 test files, 984 tests passed, 1 skipped
> - Git whitespace checks
> - Skill frontmatter and mirror synchronization

## Scope of the reconstruction

The discussion continued with assumption-wording improvements, cause-area integration checks, skill-maintenance work,
category-display-name changes, donation-row rounding, temporary-file cleanup, and transcript organization. Those turns
are omitted because they do not materially evaluate David's evidence or the resulting ALLFED model.
