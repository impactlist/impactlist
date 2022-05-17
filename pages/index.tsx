import { NextSeo } from "next-seo";

export default function Home() {
	return (
		<div className="w-screen h-screen bg-gradient-to-t from-red-300 to-pink-200 flex justify-center items-center">
			<NextSeo
				title="CNR APP"
				description="CNR APP description"
				openGraph={{ title: "CNR APP", description: "CNR APP description" }}
			/>
			
			<main className="z-10">
				<h1 className="text-2xl font-bold mb-4">
					Welcome to{" "}
					<a
						className="text-blue-700 hover:text-green-600 transition-colors"
						href="https://nextjs.org"
					>
						Next.js
					</a>
					, using{" "}
					<a
						className="text-blue-700 hover:text-green-600 transition-colors"
						href="https://github.com/ideopunk/next-cnr-template"
					>
						next-cnr-template!
					</a>
				</h1>

				<p className="text-xl mb-4 font-medium">
					Get started by editing <code>pages/index.js</code>
				</p>
				<p className="text-xl font-medium">
					Add content to the og:url and canonical link tags.
				</p>
			</main>
		</div>
	);
}
