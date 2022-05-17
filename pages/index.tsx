import { NextSeo } from "next-seo";
import { useState } from "react";
import Sorter from "../components/Sorter";
import Card from "../components/Card";
import { Billionaire, billionaires } from "../lib/data";
import * as Checkbox from "@radix-ui/react-checkbox";

export default function Home() {
	const [order, setOrder] = useState<"wealth:high" | "wealth:low" | "impact:high" | "impact:low">(
		"wealth:high"
	);
	const [compact, setCompact] = useState(false);

	let sortedBillionaires: Billionaire[] = [];
	switch (order) {
		case "wealth:high":
			sortedBillionaires = billionaires.sort((a, b) => b.wealth - a.wealth);
			break;
		case "wealth:low":
			sortedBillionaires = billionaires.sort((a, b) => a.wealth - b.wealth);
			break;
		case "impact:high":
			sortedBillionaires = billionaires.sort((a, b) =>
				a.grade > b.grade ? 1 : a.grade < b.grade ? -1 : 0
			);
			break;
		default: // impact:low
			sortedBillionaires = billionaires.sort((a, b) =>
				a.grade > b.grade ? -1 : a.grade < b.grade ? 1 : 0
			);
	}

	return (
		<div className="w-screen min-h-screen  bg-red-300 flex justify-center">
			<NextSeo
				title="$10^9 Tier List"
				description="CNR APP description"
				openGraph={{ title: "CNR APP", description: "CNR APP description" }}
			/>

			<main className="py-20 px-4 flex flex-col">
				<article className="prose mb-12">
					<h1 className="text-center ">Billionaire Impact Ranking</h1>
					<p className="text-center">
						Many billionaires give massive sums to charity. However, some charities can
						be 1,000X as effective as others. Donating $5,000 to an effective charity
						could save a life while donating that amount to most charities will have
						negligible impact.
					</p>

					<p className="text-center">
						This site grades billionaires by the positive impact of their giving. If you
						would like to learn more about making an impact with your money you might be
						an{" "}
						<a href="https://www.effectivealtruism.org/articles/introduction-to-effective-altruism">
							effective altruist
						</a>
						!
					</p>
				</article>
				<div className="flex justify-between w-3/4 items-center self-center">
					<div className="flex justify-center items-center">
						<Sorter
							selected={
								order === "wealth:high"
									? "down"
									: order === "wealth:low"
									? "up"
									: "naw"
							}
							onClick={() =>
								setOrder(order === "wealth:high" ? "wealth:low" : "wealth:high")
							}
						>
							Wealth
						</Sorter>
						<Sorter
							selected={
								order === "impact:high"
									? "down"
									: order === "impact:low"
									? "up"
									: "naw"
							}
							onClick={() =>
								setOrder(order === "impact:high" ? "impact:low" : "impact:high")
							}
						>
							Impact
						</Sorter>
					</div>
					<label className="font-bold cursor-pointer flex items-center group">
						Compact
						<Checkbox.Root
							checked={compact}
							onCheckedChange={() => setCompact((c) => !c)}
						>
							<div className="border-2 border-black rounded-md w-4 h-4 flex items-center justify-center ml-2">
								<span
									className={`${
										compact ? "opacity-100" : "opacity-0 group-hover:opacity-50"
									} transition-opacity text-3xl relative left-0.5 -top-0.5`}
								>
									✓
								</span>
							</div>
						</Checkbox.Root>
					</label>
				</div>
				<div className="flex flex-col items-center">
					{sortedBillionaires.map((b) => (
						<Card billi={b} key={b.name} compact={compact} />
					))}
				</div>
			</main>
		</div>
	);
}
