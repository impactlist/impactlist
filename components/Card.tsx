import { Billionaire } from "../lib/data";

export default function Card({ billi }: { billi: Billionaire }) {
	return (
		<div className="bg-white border-black border-2 w-[400px] p-4 m-4">
			<div className="flex">
				<div className="flex-1">
					<h1 className="text-2xl">{billi.name}</h1>
					<p className="text-xs italic">${billi.wealth.toLocaleString()}</p>
				</div>
				<div className="w-10">
					<p className="text-5xl">{billi.grade}</p>
				</div>
			</div>
			<div className="mt-2">{billi.bio}</div>
		</div>
	);
}
