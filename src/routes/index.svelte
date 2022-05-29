<script lang="ts">
	import Sorter from "../lib/components/Sorter.svelte";
	import Card from "../lib/components/Card.svelte";
	import { billionaires } from "../lib/data";
	let sortedBillionaires = billionaires;

	let longtermist = false;
	let compar = "";
	$: filteredBillionaires = sortedBillionaires.filter((b) =>
		compar ? b.name.toLowerCase().includes(compar) : true
	);

	type Orders = "wealth:high" | "wealth:low" | "impact:high" | "impact:low";
	let order: Orders = "impact:high";
	let compact = false;
	$: {
		switch (order) {
			case "wealth:high":
				sortedBillionaires = billionaires.sort((a, b) => b.billions - a.billions);
				break;
			case "wealth:low":
				sortedBillionaires = billionaires.sort((a, b) => a.billions - b.billions);
				break;
			case "impact:high":
				sortedBillionaires = billionaires.sort((a, b) =>
					a.grade > b.grade ? 1 : a.grade < b.grade ? -1 : 0
				);
				break;
			default: // impact:low
				sortedBillionaires = billionaires.sort((a, b) =>
					a.grade > b.grade ? -1 : a.grade < b.grade ? 1 : 0
				);
		}

		sortedBillionaires = sortedBillionaires;
	}

	function handleClick(o: Orders) {
		order = o;
	}

	// import { quintOut } from "svelte/easing";
	import { crossfade, fly } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { tick } from "svelte";

	// const [send, receive] = crossfade({
	// 	duration: (d) => Math.sqrt(d * 200),

	// 	fallback(node, params) {
	// 		const style = getComputedStyle(node);
	// 		const transform = style.transform === "none" ? "" : style.transform;

	// 		return {
	// 			duration: 600,
	// 			easing: quintOut,
	// 			css: (t) => `
	// 				transform: ${transform} scaleY(${t});
	// 				opacity: ${t}
	// 			`,
	// 		};
	// 	},
	// });
</script>

<div class="w-screen min-h-[200vh]  flex justify-center">
	<main class="pt-10 pb-20 px-4 flex flex-col ">
		<article class="prose prose-sm md:prose-base mx-4 md:mx-0 mb-12">
			<h1 class="text-center ">Billionaire Impact Ranking</h1>
			<p class="text-center">
				Many billionaires give massive sums to charity. However, some charities can be
				1,000X as effective as others. Donating $5,000 to an effective charity could save a
				life while donating that amount to most charities will have negligible impact.
			</p>

			<p class="text-center">
				This site grades billionaires by the positive impact of their giving. If you would
				like to learn more about making an impact with your money you might be an{" "}
				<a
					class="hover:text-red-700 transition-colors"
					href="https://www.effectivealtruism.org/articles/introduction-to-effective-altruism"
				>
					effective altruist</a
				>!
			</p>
		</article>
		<input
			bind:value={compar}
			class="bg-transparent  py-1 outline-none border-b-2 w-3/4 self-center mb-4 border-b-black text-xl placeholder-slate-500"
			placeholder="Filter"
		/>

		<div class="flex justify-between w-3/4  items-center self-center ">
			<div class="flex items-center">
				<Sorter
					selected={order === "impact:high"
						? "down"
						: order === "impact:low"
						? "up"
						: "naw"}
					on:message={() =>
						handleClick(order === "impact:high" ? "impact:low" : "impact:high")}
				>
					Impact
				</Sorter>
				<Sorter
					selected={order === "wealth:high"
						? "down"
						: order === "wealth:low"
						? "up"
						: "naw"}
					on:message={() =>
						handleClick(order === "wealth:high" ? "wealth:low" : "wealth:high")}
				>
					Wealth
				</Sorter>
			</div>
			<label class="font-bold cursor-pointer flex items-center group">
				Compact
				<input type="checkbox" bind:checked={compact} class="hidden" />
				<div
					class="border-2 border-black rounded-md w-4 h-4 flex items-center justify-center ml-2"
				>
					<span
						class={`${
							compact ? "opacity-100" : "opacity-0 group-hover:opacity-50"
						} transition-opacity text-3xl relative left-0.5 -top-0.5`}
					>
						✓
					</span>
				</div>
			</label>
		</div>
		<div class="flex justify-end w-3/4 self-center mt-3">
			<label class="font-bold cursor-pointer flex items-center group">
				Consider Longtermism
				<input type="checkbox" bind:checked={longtermist} class="hidden" />
				<div
					class="border-2 border-black rounded-md w-4 h-4 flex items-center justify-center ml-2"
				>
					<span
						class={`${
							longtermist ? "opacity-100" : "opacity-0 group-hover:opacity-50"
						} transition-opacity text-3xl relative left-0.5 -top-0.5`}
					>
						✓
					</span>
				</div>
			</label>
		</div>
		<div class="flex flex-col items-center ">
			{#each filteredBillionaires as b (b.name)}
				<div class="origin-top" animate:flip={{ duration: 100 }}>
					<!-- in:receive|local={{ key: b.name }}
				out:send|local={{ key: b.name }} -->

					<Card billi={b} {longtermist} {compact} />
				</div>
			{/each}
		</div>
	</main>
</div>
