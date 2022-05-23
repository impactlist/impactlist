import "../public/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import Layout from "../components/Layout";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider attribute="class">
			<DefaultSeo
				openGraph={{
					type: "website",
					locale: "en_US",
					url: "https://billionaires-alpha.vercel.app/",
					site_name: "Billionaire Tier List",
					images: [
						{
							url: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Tom_Thomson_-_The_Jack_Pine_1916.jpg",
							alt: "Image description",
							width: 2604,
							height: 2380,
						},
					],
				}}
				twitter={{
					handle: "@ideopunk",
					site: "@ideopunk",
					cardType: "summary_large_image",
				}}
			/>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ThemeProvider>
	);
}
