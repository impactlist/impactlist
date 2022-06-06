<script lang="ts">
	import fsm from "svelte-fsm";

	import { flip } from "svelte/animate";
	import Sorter from "../lib/components/Sorter.svelte";
	import Row from "../lib/components/Row.svelte";
	import { billionaires } from "../lib/billionaire";
	let sortedBillionaires = billionaires;

	let compar = "";
	$: filteredBillionaires = sortedBillionaires.filter((b) =>
		compar ? b.name.toLowerCase().includes(compar) : true
	);

	const sorting = fsm("impact_high", {
		name_high: {
			_enter() {
				sortedBillionaires = billionaires.sort((a, b) => {
					let AreverseName = a.lastName + " " + a.firstName;
					let BreverseName = b.lastName + " " + b.firstName;

					return AreverseName > BreverseName ? 1 : AreverseName < BreverseName ? -1 : 0;
				});
				sortedBillionaires = sortedBillionaires;
			},
			name: "name_low",
		},
		name_low: {
			_enter() {
				sortedBillionaires = billionaires.sort((a, b) => {
					let AreverseName = a.lastName + " " + a.firstName;
					let BreverseName = b.lastName + " " + b.firstName;

					return AreverseName < BreverseName ? 1 : AreverseName > BreverseName ? -1 : 0;
				});
				sortedBillionaires = sortedBillionaires;
			},
			name: "name_high",
		},
		impact_high: {
			_enter() {
				sortedBillionaires = billionaires.sort((a, b) =>
					a.livesImpact > b.livesImpact ? 1 : a.livesImpact < b.livesImpact ? -1 : 0
				);
				sortedBillionaires = sortedBillionaires;
			},
			impact: "impact_low",
		},
		impact_low: {
			_enter() {
				sortedBillionaires = billionaires.sort((a, b) =>
					a.livesImpact > b.livesImpact ? -1 : a.livesImpact < b.livesImpact ? 1 : 0
				);
				sortedBillionaires = sortedBillionaires;
			},
		},
		wealth_high: {
			_enter() {
				sortedBillionaires = billionaires.sort((a, b) => b.wealth - a.wealth);
				sortedBillionaires = sortedBillionaires;
			},
			wealth: "wealth_low",
		},
		wealth_low: {
			_enter() {
				sortedBillionaires = billionaires.sort((a, b) => a.wealth - b.wealth);
				sortedBillionaires = sortedBillionaires;
			},
		},
		donated_high: {
			_enter() {
				sortedBillionaires = billionaires.sort((a, b) => b.donated - a.donated);
				sortedBillionaires = sortedBillionaires;
			},
			donated: "donated_low",
		},
		donated_low: {
			_enter() {
				sortedBillionaires = billionaires.sort((a, b) => a.donated - b.donated);
				sortedBillionaires = sortedBillionaires;
			},
		},
		// pledged_high: {
		// 	_enter() {
		// 		sortedBillionaires = billionaires.sort((a, b) => b.pl - a.donated);
		// 		sortedBillionaires = sortedBillionaires;
		// 	},
		// 	pledged: "pledged_low",
		// },
		// pledged_low: {},
		generosity_ratio_high: {
			_enter() {
				sortedBillionaires = billionaires.sort(
					(a, b) => b.donatedWealthQuotient - a.donatedWealthQuotient
				);
				sortedBillionaires = sortedBillionaires;
			},
			generosityratio: "generosity_ratio_low",
		},
		generosity_ratio_low: {
			_enter() {
				sortedBillionaires = billionaires.sort(
					(a, b) => a.donatedWealthQuotient - b.donatedWealthQuotient
				);
				sortedBillionaires = sortedBillionaires;
			},
		},

		impact_ratio_high: {
			_enter() {
				sortedBillionaires = billionaires.sort(
					(a, b) => b.donatedLivesSavedQuotient - a.donatedLivesSavedQuotient
				);
				sortedBillionaires = sortedBillionaires;
			},
			impactratio: "impact_ratio_low",
		},
		impact_ratio_low: {
			_enter() {
				sortedBillionaires = billionaires.sort(
					(a, b) => a.donatedLivesSavedQuotient - b.donatedLivesSavedQuotient
				);
				sortedBillionaires = sortedBillionaires;
			},
		},
		"*": {
			name: "name_high",
			impact: "impact_high",
			wealth: "wealth_high",
			donated: "donated_high",
			pledged: "pledged_high",
			impactratio: "impact_ratio_high",
			generosityratio: "generosity_ratio_high",
		},
	});
</script>

<div class={`w-screen min-h-[200vh]  flex justify-center`}>
	<main class="pt-10 pb-20 max-w-full px-4 flex flex-col ">
		<article class="prose prose-sm self-center md:prose-base mx-4 md:mx-0 mb-12">
			<h1 class="text-center ">Billionaire Impact Ranking (in progress)</h1>
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
		<div class="self-center max-w-full w-[1000px]">
			<div class="flex h-16 self-center w-full mb-4   py-1">
				<input
					bind:value={compar}
					class="bg-transparent appearance-none rounded-none outline-none border-b-2 focus:border-b-4 focus:pt-2 transition-all w-full border-b-black text-xl placeholder-slate-500"
					placeholder="Filter"
				/>
			</div>
			<div class="flex justify-between w-full items-center self-center ">
				<div class="flex items-center justify-between w-full pl-4">
					<Sorter
						selected={$sorting === "name_high"
							? "down"
							: $sorting === "name_low"
							? "up"
							: "naw"}
						first
						on:message={sorting.name}
					>
						Name
					</Sorter>

					<Sorter
						selected={$sorting === "impact_high"
							? "down"
							: $sorting === "impact_low"
							? "up"
							: "naw"}
						on:message={sorting.impact}
					>
						Impact (Lives)
					</Sorter>
					<Sorter
						selected={$sorting === "donated_high"
							? "down"
							: $sorting === "donated_low"
							? "up"
							: "naw"}
						on:message={sorting.donated}
					>
						Donated
					</Sorter>
					<Sorter
						selected={$sorting === "impact_ratio_high"
							? "down"
							: $sorting === "impact_ratio_low"
							? "up"
							: "naw"}
						on:message={sorting.impactratio}
					>
						D / Lives
					</Sorter>

					<Sorter
						selected={$sorting === "wealth_high"
							? "down"
							: $sorting === "wealth_low"
							? "up"
							: "naw"}
						on:message={sorting.wealth}
					>
						Net Worth
					</Sorter>
					<Sorter
						selected={$sorting === "generosity_ratio_high"
							? "down"
							: $sorting === "generosity_ratio_low"
							? "up"
							: "naw"}
						on:message={sorting.generosityratio}
					>
						D / NW
					</Sorter>
				</div>
			</div>
		</div>

		<div class={`flex flex-col items-center justify-center m-8 `}>
			{#each filteredBillionaires as b (b.name)}
				<div class="origin-top" animate:flip={{ duration: 400 }}>
					<Row billi={b} />
				</div>
			{/each}
		</div>
	</main>
</div>
