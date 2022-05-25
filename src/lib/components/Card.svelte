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
	class={`bg-white border-black shadow-red-400 shadow-md my-3 sm:w-[500px] max-w-full p-4 mx-3 ${
		compact ? "h-24" : "h-80"
	} my-3 overflow-hidden transition-all`}
>
	<div class="flex">
		<div class="object-cover overflow-hidden w-16 h-16 rounded-full mr-2">
			<img src={billi.image} loading="lazy" alt={`Picture of ${billi.name}`} class="mt-0" />
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
		} transition-transform origin-top duration-[300ms] border-t-2 pt-4  text-sm`}
	>
		{bioToUse}
	</div>
</div>
