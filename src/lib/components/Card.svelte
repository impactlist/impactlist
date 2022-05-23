<script lang="ts">
	import type { Billionaire } from "../data";
	export let compact: boolean;
	export let billi: Billionaire;
	let grade = billi.grade;
</script>

<div
	
	class={`bg-white border-black shadow-red-800 shadow-md w-[500px] max-w-full p-4 m-3 overflow-none h-80`}
>
<!-- animate={{ height: compact ? 80 : 320 }}
	transition={{ type: "tween" }} -->
	<div class="h-80">
		<!-- animate={{ height: compact ? 80 : 320 }} 	transition={{ type: "tween" }}  -->

		<div class="flex">
			<div class="flex-1 h-[72px]">
				<h1 class="text-2xl">{billi.name}</h1>
				<p class="text-xs italic">${billi.wealth.toLocaleString()}</p>
			</div>
			<p
				class={`font-mono font-bold text-7xl h-0 transition-transform duration-[400ms] ${
					compact ? "scale-50 translate-y-2" : "scale-100 -translate-x-4"
				} ${
					grade === "A"
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
				{billi.grade}
			</p>
		</div>
		<div
			class={`mt-2 ${
				compact && "scale-y-0 duration-200"
			} transition-transform origin-top duration-[400ms] border-t-2 pt-4`}
		>
			{billi.bio}
		</div>
	</div>
</div>
