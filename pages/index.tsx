import { NextSeo } from "next-seo";
import { useState } from "react";
import Sorter from "../components/Sorter";
import Card from "../components/Card";
import { Billionaire, billionaires } from "../lib/data";

export default function Home() {
	const [order, setOrder] = useState<"wealth:high" | "wealth:low" | "impact:high" | "impact:low">(
		"wealth:high"
	);

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

			<main className="py-20">
				<article className="prose">
					<h2 className="mb-20 text-center ">How good is yr fav billionaire actually?</h2>
				</article>
				<div className="flex">
					<Sorter
						selected={
							order === "wealth:high" ? "down" : order === "wealth:low" ? "up" : "naw"
						}
						onClick={() =>
							setOrder(order === "wealth:high" ? "wealth:low" : "wealth:high")
						}
					>
						Wealth
					</Sorter>
					<Sorter
						selected={
							order === "impact:high" ? "down" : order === "impact:low" ? "up" : "naw"
						}
						onClick={() =>
							setOrder(order === "impact:high" ? "impact:low" : "impact:high")
						}
					>
						Impact
					</Sorter>
				</div>
				{sortedBillionaires.map((b) => (
					<Card billi={b} key={b.name} />
				))}
			</main>
		</div>
	);
}
