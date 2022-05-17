import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	const { pathname } = useRouter();
	return (
		<div>
			{children}
			<div className="fixed bottom-0 w-full flex justify-center">
				<div className="bg-white  shadow-black shadow-md border-black border-b-0 px-4 pb-0.5 pt-2 flex justify-between">
					<Link href="/">
						<a className="mx-12 group">
							<span className={`${pathname === "/" ? "font-bold" : "font-normal"}`}>
								HOME
							</span>
							<div className="w-full bg-black h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500 group-hover:duration-300" />
						</a>
					</Link>
					<Link href="/faq">
						<a className="mx-12 group">
							<span
								className={`${pathname === "/faq" ? "font-bold" : "font-normal"}`}
							>
								FAQ
							</span>
							<div className="w-full bg-black h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500 group-hover:duration-300" />
						</a>
					</Link>
					<a className="mx-12 group" href="https://github.com/ideopunk/billionaires">
						<span>CODE</span>
						<div className="w-full bg-black h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500 group-hover:duration-300" />
					</a>
				</div>
			</div>
		</div>
	);
}
