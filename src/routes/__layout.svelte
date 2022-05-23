<script>
	import "../app.css";
	import { getStores, navigating, page, session, updated } from "$app/stores";
	let pathname = $page.url.pathname;
</script>

<!-- export default function Layout({ children }: { children: ReactNode }) {
	const { pathname } = useRouter(); -->
<div>
	<slot />

	<div class="fixed bottom-0 w-full flex justify-center">
		<div
			class="bg-white  shadow-black shadow-md border-black border-b-0 px-4 pb-0.5 pt-2 flex justify-between"
		>
			<a href="/" class="mx-12 group">
				<span class={`${pathname === "/" ? "font-bold" : "font-normal"}`}> HOME </span>
				<div
					class="w-full bg-black h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500 group-hover:duration-300"
				/>
			</a>
			<a href="/faq" class="mx-12 group">
				<span class={`${pathname === "/faq" ? "font-bold" : "font-normal"}`}> FAQ </span>
				<div
					class="w-full bg-black h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500 group-hover:duration-300"
				/>
			</a>
			<a class="mx-12 group" href="https://github.com/ideopunk/billionaires">
				<span>CODE</span>
				<div
					class="w-full bg-black h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500 group-hover:duration-300"
				/>
			</a>
		</div>
	</div>
</div>
