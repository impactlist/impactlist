---
id: 'sam-bankman-fried'
name: 'Sam Bankman-Fried'
birthDate: 1992-03-05
netWorth: 0
about: "Sam Bankman-Fried founded the cryptocurrency exchange FTX and trading firm Alameda Research, and for a time was one of the world's youngest billionaires and a high-profile champion of the effective altruism movement, directing large sums toward pandemic prevention, AI safety, and other long-term causes. After FTX collapsed in 2022 he was convicted of fraud and conspiracy and sentenced to 25 years in prison, losing essentially his entire fortune. Much of his giving was later found to have been funded with misappropriated FTX customer money, and a large share was either never paid out or clawed back by the bankruptcy estate — so the figures shown here are rough estimates of what charities actually received and kept. Born in 1992 in Stanford, California. [Wikipedia](https://en.wikipedia.org/wiki/Sam_Bankman-Fried)"
---

# Internal Notes

Net worth is recorded as $0. Bankman-Fried lost essentially all of his wealth in FTX's November 2022 collapse, and a March 2024 federal forfeiture order of $11.02 billion left him with no positive net worth (his Forbes peak was roughly $26.5 billion in early 2022). Net worth is display-only on this site (it feeds no lives-saved or cost-per-life math), and the `netWorth` validator now accepts any finite number (`assertNumber` in `src/utils/startupValidation.js`) — including zero and negatives — so a donor who is genuinely underwater can be represented honestly. For Bankman-Fried we use $0, which is what Forbes and Bloomberg report: he has essentially no assets. The $11.02 billion is a criminal forfeiture money judgment, not ordinary balance-sheet debt he is servicing — it is a standing claim on any wealth he might later acquire, not a figure conventionally reported as a negative net worth, so we do not record him at -$11B.

**Questionable inclusion / may be removed.** Bankman-Fried's recorded giving was funded almost entirely by FTX/Alameda customer funds that were later found to have been misappropriated — the same finding that let the FTX bankruptcy estate claw the grants back. It is genuinely debatable whether someone who gave away misappropriated customer money belongs on a philanthropy leaderboard at all, and he may be removed in a later revision. Every donation amount in his file is a rough estimate of money actually delivered to and retained by charities (net of non-payment and clawbacks), not the much larger sums he publicly committed.
