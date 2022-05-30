<script lang="ts">
	import { scale } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import { crossfade } from "svelte/transition";

	import type { Billionaire } from "../data";

	export let compact: boolean;
	export let billi: Billionaire;
	export let longtermist: boolean;
	let grade = billi.grade;
	$: gradeToUse = longtermist ? billi.esotericGrade : billi.grade;
	$: bioToUse = longtermist ? billi.esotericBio : billi.bio;

	const [send, receive] = crossfade({
		duration: 100,
		easing: quintOut,
	});
</script>

<div
	class={`bg-white border-red-300 relative sm:w-[500px] max-w-full mx-3 ${
		compact ? "h-12" : " h-[600px] "
	} my-2 overflow-hidden transition-all`}
>
	<div
		class={`object-cover relative overflow-hidden w-full ${
			compact ? "opacity-0" : "opacity-100"
		} transition-opacity`}
	>
		<img src={billi.fullImage} loading="lazy" alt={`Picture of ${billi.name}`} />
	</div>
	{#if !compact}
		<!-- <div class="object-cover relative overflow-hidden w-full">
			<img
				src={billi.fullImage}
				loading="lazy"
				alt={`Picture of ${billi.name}`}
			/>
		</div> -->
		<div
			in:send={{ key: "content" }}
			out:receive={{ key: "content" }}
			class="absolute top-0 w-full h-full  z-10 flex flex-col justify-end"
			style="background-image: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0) 65%, rgba(0,0,0,0.8) 80%);"
		>
			<div class="m-2">
				<div class="border-b-white border-b mb-2 flex items-center">
					<div class="">
						<p class="text-white text-4xl">
							{billi.name}
						</p>
						<p class="text-white">${billi.billions}B</p>
					</div>
					<div
						class="absolute right-0 top-0 flex items-center justify-center rounded-full w-[100px] h-[100px] m-4 bg-slate-700 bg-opacity-40 pt-2"
					>
						<p
							class={`text-7xl font-mono font-bold
					${
						gradeToUse === "A"
							? "text-green-400"
							: grade === "B"
							? "text-blue-400"
							: grade === "C"
							? "text-yellow-400"
							: grade === "D"
							? "text-orange-400"
							: "text-red-400"
					}`}
						>
							{gradeToUse}
						</p>
					</div>
				</div>
				<p class="text-white text-xs">
					{bioToUse}
				</p>
			</div>
		</div>
	{:else}
		<div
			class="flex items-center absolute top-0 w-full  z-10  h-full justify-between px-4"
			in:send={{ key: "content" }}
			out:receive={{ key: "content" }}
		>
			<h1 class="text-2xl w-1/2">{billi.name}</h1>
			<p class="text-2xl font-bold italic">${billi.billions.toLocaleString()}B</p>
			<p
				class={`font-mono font-bold text-4xl relative top-0.5 ${
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
		</div>
	{/if}
</div>
