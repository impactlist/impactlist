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

<div class={`${pathname === "/" ? "bg-red-300" : "bg-green-300"} w-full flex justify-center`}>
	<div class="w-min flex mt-8">
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
<slot />
