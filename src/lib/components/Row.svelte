<script lang="ts">
	import type { Billionaire } from "../billionaire";

	// props
	export let billi: Billionaire;

	// $: dNw = ((billi.donated / billi.wealth) * 100).toFixed(2);

	// state
	let row = true;
</script>

<div
	class={`bg-blue-100 text-xs lg:text-base relative w-full lg:w-[1000px] max-w-full lg:mx-3 ${
		row ? "h-12 hover:h-14" : " sm:h-[450px] "
	} my-2 overflow-hidden transition-all`}
>
	<button
		on:click={() => (row = !row)}
		class="flex bg-blue-200  pl-4 text-left items-center w-full h-12 "
	>
		<h1 class="text-left  w-1/3  leading-none font-bold">
			<!-- <span class="w-8 inline-block">{billi.impactRank}.{" "}</span> -->
			<span>{billi.name}</span>
		</h1>
		<p class=" w-1/6   italic leading-none">
			{billi.livesImpact.toLocaleString()}K
		</p>
		<p class=" w-1/6   italic leading-none">
			${billi.donated.toLocaleString()}B
		</p>
		<p class=" w-1/6   italic leading-none">
			${billi.donatedLivesSavedQuotient.toLocaleString()}
		</p>
		<p class=" w-1/6   italic leading-none">
			${billi.wealth.toLocaleString()}B
		</p>
	</button>
	{#if !row}
		<div class=" bg-blue-100 w-full h-full flex flex-col items-center  py-6">
			<div
				class={`  object-cover relative bg-blue-200 overflow-hidden w-48 h-48 rounded-full`}
			>
				<img
					src={billi.image}
					alt={`Picture of ${billi.name}`}
					loading="lazy"
					class="rounded-full object-cover  hidden"
				/>
			</div>
			<p class="mx-20 text-center mt-6">{billi.bio}</p>
			<div class="mt-6">
				<h6 class="text-xl">Donations / Net Worth</h6>
				<p class=" text-center   italic leading-none">
					{billi.donatedWealthQuotient.toLocaleString()}
				</p>
			</div>
			<!-- {#key gradeToUse}
				<p
					transition:fade|local={{ duration: 200 }}
					class={`font-mono transition-colors absolute text-center  leading-none font-bold  text-base sm:text-4xl  ${
						gradeToUse === "A"
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
					{gradeToUse}
				</p>
			{/key} -->
		</div>
	{/if}
</div>
