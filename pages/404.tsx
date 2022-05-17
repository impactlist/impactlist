import Link from "next/link";

export default function ErrorPage() {
	return (
		<div className="w-screen h-screen bg-gradient-to-t from-blue-300 to-purple-200 flex justify-center items-center">
			<Link href="/">
				<a className="transition-colors hover:text-pink-700 text-xl font-bold">Take me back, Clarence. </a>
			</Link>
		</div>
	);
}
