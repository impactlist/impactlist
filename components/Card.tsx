import { Billionaire } from "../lib/data";
import { motion } from "framer-motion";
export default function Card({ billi }: { billi: Billionaire }) {
	const { grade } = billi;

	return (
		<motion.div
			layout
			className="bg-white border-black shadow-red-800 shadow-md w-[500px] max-w-full p-4 m-3"
		>
			<div className="flex">
				<div className="flex-1">
					<h1 className="text-2xl">{billi.name}</h1>
					<p className="text-xs italic">${billi.wealth.toLocaleString()}</p>
				</div>
				<div className="w-16">
					<p
						className={`font-mono font-bold text-7xl ${
							grade === "A"
								? "text-green-400"
								: grade === "B"
								? "text-blue-500"
								: grade === "C"
								? "text-yellow-400"
								: grade === "D"
								? "text-orange-500"
								: "text-red-500"
						}`}
					>
						{billi.grade}
					</p>
				</div>
			</div>
			<div className="mt-2">{billi.bio}</div>
		</motion.div>
	);
}
