<script lang="ts">
	import { fly, fade } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import { crossfade } from "svelte/transition";
	import type { Billionaire } from "../data";

	// props
	export let billi: Billionaire;
	export let longtermist: boolean;
	let grade = billi.grade;

	$: gradeToUse = longtermist ? billi.esotericGrade : billi.grade;
	$: bioToUse = longtermist ? billi.esotericBio : billi.bio;

	const [send, receive] = crossfade({
		duration: 100,
		easing: quintOut,
	});

	$: dNw = ((billi.donated / billi.wealth) * 100).toFixed(2);

	// state
	let row = false;

	function onClick() {
		row = !row;
	}
</script>

<div
	class={`bg-blue-100 relative w-[1000px] max-w-full mx-3 ${
		row ? "h-12 hover:h-14" : " sm:h-[450px] "
	} my-2 overflow-hidden transition-all`}
>
	<button
		on:click={() => (row = !row)}
		class="flex bg-blue-200  pl-3 text-left items-center w-full h-12 "
	>
		<h1 class=" text-left sm:text-xl w-1/5  leading-none font-bold">
			{billi.impactRank}. {billi.name}
		</h1>
		<p class="sm:text-xl w-1/5  italic leading-none">
			${billi.impact.toLocaleString()}B
		</p>
		<p class="sm:text-xl w-1/5  italic leading-none">
			${billi.donated.toLocaleString()}B
		</p>
		<p class="sm:text-xl w-1/5  italic leading-none">
			${billi.wealth.toLocaleString()}B
		</p>
		<p class="sm:text-xl w-1/5  italic leading-none">
			{dNw}
		</p>
	</button>
	{#if !row}
		<div class=" bg-blue-100 w-full h-full flex flex-col items-center  pt-6">
			<div class={`  object-cover relative overflow-hidden w-48 h-48 rounded-full`}>
				<img
					src={billi.image}
					alt={`Picture of ${billi.name}`}
					loading="lazy"
					class="rounded-full object-cover  "
				/>
			</div>
			<p class="mx-20 text-center mt-6">{billi.bio}</p>
			<!-- {#key gradeToUse}
				<p
					transition:fade|local={{ duration: 200 }}
					class={`font-mono transition-colors absolute text-center  leading-none font-bold  text-xl sm:text-4xl  ${
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
