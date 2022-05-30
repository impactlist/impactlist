<script>
	import "../app.css";
	import { page } from "$app/stores";
	$: pathname = $page.url.pathname;
</script>

<svelte:head>
	<title>$10^9 Tier List</title>
	<meta name="title" content="$10^9 Tier List" />
	<meta name="description" content="Billionaires ranked by effective giving" />

	<meta name="og:title" content="$10^9 Tier List" />
	<meta name="og:description" content="Billionaires ranked by effective giving" />
	<meta name="og:url" content="https://billionaires-alpha.vercel.app/" />
	<meta name="og:type" content="website" />

	<meta
		name="og:image"
		content="https://upload.wikimedia.org/wikipedia/commons/e/e6/Tom_Thomson_-_The_Jack_Pine_1916.jpg"
	/>
	<meta name="og:image:alt" content="Image description" />
	<meta name="og:image:width" content="2604" />
	<meta name="og:image:height" content="2380" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@ideopunk" />
</svelte:head>

<div class={`${pathname === "/" ? " bg-red-50 " : "bg-green-50"} transition-all min-h-screen`}>
	<div class="flex justify-center w-full">
		<div class="flex justify-between mt-8 w-[350px]">
			<a href="/" class="group w-[100px]">
				<div class="w-min">
					<span class={`${pathname === "/" ? "font-bold" : "font-normal"}`}>HOME</span>
					<div
						class="w-full bg-black h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500 group-hover:duration-300"
					/>
				</div>
			</a>
			<a href="/faq" class="group flex justify-center w-[100px]">
				<div class="w-min">
					<span class={`${pathname === "/faq" ? "font-bold" : "font-normal"}`}>
						FAQ
					</span>
					<div
						class="w-full bg-black h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500 group-hover:duration-300"
					/>
				</div>
			</a>
			<a
				class="group w-[100px] flex justify-end "
				href="https://github.com/ideopunk/billionaires"
			>
				<div class="w-min">
					<span>CODE</span>
					<div
						class="w-full bg-black h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500 group-hover:duration-300"
					/>
				</div>
			</a>
		</div>
	</div>
	<slot />
</div>
