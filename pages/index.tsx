import { NextSeo } from "next-seo";
import Card from "../components/Card";
import { billionaires } from "../lib/data";

export default function Home() {
	return (
		<div className="w-screen h-screen  bg-red-300 flex justify-center items-center">
			<NextSeo
				title="$10^9 Tier List"
				description="CNR APP description"
				openGraph={{ title: "CNR APP", description: "CNR APP description" }}
			/>

			<main className="z-10">
				<p>How good is yr fav billionaire actually?</p>

				{billionaires.map((b) => (
					<Card billi={b} key={b.name} />
				))}
			</main>
		</div>
	);
}
