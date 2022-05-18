import { ReactNode } from "react";
import CaretDown from "./CaretDown";

export default function Sorter({
	children,
	selected,
	onClick,
}: {
	children: ReactNode;
	selected?: "naw" | "up" | "down";
	onClick: () => void;
}) {
	return (
		<button className="flex items-center group mx-4" onClick={onClick}>
			<span className="font-bold mr-1">{children}</span>
			<div
				className={`relative top-[1px] transition-all group-hover:rotate-45 ${
					selected === "naw"
						? "opacity-0 group-hover:opacity-25 group-hover:rotate-0"
						: ""
				}`}
			>
				<div
					className={`${
						selected === "up" ? "rotate-180" : "rotate-0"
					} transition-transform`}
				>
					<CaretDown />
				</div>
			</div>
		</button>
	);
}
