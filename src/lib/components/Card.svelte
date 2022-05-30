<script lang="ts">
	import type { Billionaire } from "../data";
	export let compact: boolean;
	export let billi: Billionaire;
	export let longtermist: boolean;
	let grade = billi.grade;
	$: gradeToUse = longtermist ? billi.esotericGrade : billi.grade;
	$: bioToUse = longtermist ? billi.esotericBio : billi.bio;
</script>

<div
	class={`bg-white border-red-300 my-3 relative sm:w-[500px] max-w-full mx-3 ${
		compact ? "h-24 p-4" : "p-0  h-[600px] "
	} my-3 overflow-hidden transition-all`}
>
	{#if !compact}
		<div class="object-cover relative overflow-hidden w-full">
			<img
				src={billi.fullImage}
				loading="lazy"
				alt={`Picture of ${billi.name}`}
				class="mt-0"
			/>
		</div>
		<div
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
						<span
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
					}`}>{gradeToUse}</span
						>
					</div>
				</div>
				<p class="text-white text-xs">
					{bioToUse}
				</p>
			</div>
		</div>
	{:else}
		<div class="flex">
			<div class="object-cover overflow-hidden w-16 h-16 rounded-full mr-2">
				<img
					src={billi.image}
					loading="lazy"
					alt={`Picture of ${billi.name}`}
					class="mt-0"
				/>
			</div>
			<div class="flex-1 h-[72px]">
				<h1 class="text-2xl">{billi.name}</h1>
				<p class="text-base font-bold italic">${billi.billions.toLocaleString()}B</p>
			</div>
			<div class="flex mr-2">
				<p
					class={`font-mono font-bold text-7xl h-0 transition-transform duration-[320ms] ${
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
		</div>
		<div
			class={`mt-2 ${
				compact && "scale-y-0 duration-200"
			} transition-transform origin-top duration-[300ms] border-t-2 border-t-red-100 pt-4  text-sm`}
		>
			{bioToUse}
		</div>
	{/if}
</div>
