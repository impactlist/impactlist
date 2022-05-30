<script lang="ts">
	import { fly, fade } from "svelte/transition";
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
	class={`bg-white border-red-300 relative sm:w-[400px] max-w-full mx-3 ${
		compact ? "h-12" : " h-[520px] "
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
			style="background-image: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0) 55%, rgba(0,0,0,0.8) 70%);"
		>
			<div class="m-2">
				<div class="border-b-white border-b mb-2 flex items-center">
					<div class="">
						<p class="text-white text-4xl relative -left-0.5">{billi.name}</p>
						<p class="text-white">${billi.billions}B</p>
					</div>
					<div
						class="absolute right-0 top-0 flex items-center justify-center rounded-full w-[90px] h-[90px] m-4 bg-slate-700 bg-opacity-40 pt-2"
					>
						{#key gradeToUse}
							<p
								transition:fade|local={{ duration: 200 }}
								class={`text-7xl absolute font-mono font-bold transition-colors
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
						{/key}
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
			<h1 class="text-2xl w-3/5 ">{billi.name}</h1>
			<p class="text-2xl font-bold italic">${billi.billions.toLocaleString()}B</p>
			<div class="relative top-0.5 w-10 h-full justify-center items-center text-center flex">
				{#key gradeToUse}
					<p
						transition:fade|local={{ duration: 200 }}
						class={`font-mono transition-colors absolute text-center font-bold  text-4xl  ${
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
				{/key}
			</div>
		</div>
	{/if}
</div>
