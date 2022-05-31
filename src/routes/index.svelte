<script lang="ts">
	import { flip } from "svelte/animate";
	import Sorter from "../lib/components/Sorter.svelte";
	import Card from "../lib/components/Card.svelte";
	import { billionaires } from "../lib/data";
	import Checkbox from "$lib/Checkbox.svelte";
	let sortedBillionaires = billionaires;

	let longtermist = false;
	let compar = "";
	$: filteredBillionaires = sortedBillionaires.filter((b) =>
		compar ? b.name.toLowerCase().includes(compar) : true
	);

	type Orders = "wealth:high" | "wealth:low" | "impact:high" | "impact:low";
	let order: Orders = "impact:high";
	let width = 0;
	let compact = width > 676 ? false : true;
	$: if (width > 676) {
		compact = false;
	} else {
		compact = true;
	}

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
</script>

<svelte:window bind:innerWidth={width} />

<div class={`w-screen ${compact ? "min-h-[200vh]" : "min-h-[200vh]"}  flex justify-center`}>
	<main class="pt-10 pb-20 max-w-full px-4 flex flex-col ">
		<article class="prose prose-sm self-center md:prose-base mx-4 md:mx-0 mb-12">
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
		<div class="self-center max-w-full w-[392px]">
			<div class="flex h-16 self-center w-full mb-4   py-1">
				<input
					bind:value={compar}
					class="bg-transparent appearance-none rounded-none outline-none border-b-2 focus:border-b-4 focus:pt-2 transition-all w-full border-b-black text-xl placeholder-slate-500"
					placeholder="Filter"
				/>
			</div>
			<div class="flex justify-between w-full  items-center self-center ">
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
				<label
					class="font-bold hidden cursor-pointer select-none sm:flex items-center group group"
				>
					Compact
					<input type="checkbox" bind:checked={compact} class="peer w-0 h-0" />
					<Checkbox selected={compact && !!width} />
					<!-- hack to prevent flash of checkbox -->
				</label>
			</div>
			<div class="flex md:justify-end w-full self-center mt-3">
				<label class="font-bold cursor-pointer select-none flex items-center group">
					Consider Longtermism
					<input type="checkbox" bind:checked={longtermist} class="peer w-0 h-0" />
					<Checkbox selected={longtermist} />
				</label>
			</div>
		</div>

		<div class={`flex flex-col md:flex-row  md:flex-wrap items-center  justify-center m-8 `}>
			{#if width}
				{#each filteredBillionaires as b (b.name)}
					<div class="origin-top" animate:flip={{ duration: 100 }}>
						<!-- in:receive|local={{ key: b.name }}
				out:send|local={{ key: b.name }} -->

						<Card billi={b} {longtermist} {compact} />
					</div>
				{/each}
			{/if}
		</div>
	</main>
</div>
