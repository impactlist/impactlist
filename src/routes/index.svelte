<script lang="ts">
	import Sorter from "../lib/components/Sorter.svelte";
	import Card from "../lib/components/Card.svelte";
	import { billionaires } from "../lib/data";
	import type { Billionaire } from "../lib/data";
	let sortedBillionaires = billionaires;

	type Orders = "wealth:high" | "wealth:low" | "impact:high" | "impact:low";
	let order: Orders = "wealth:high";
	let compact = false;
	$: {
		switch (order) {
			case "wealth:high":
				sortedBillionaires = billionaires.sort((a, b) => b.wealth - a.wealth);
				break;
			case "wealth:low":
				// 	billionaires.sort((a, b) =>
				// 	a.grade > b.grade ? 1 : a.grade < b.grade ? -1 : 0
				// ).reverse()
				sortedBillionaires = billionaires.sort((a, b) => a.wealth - b.wealth);
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

	import { quintOut } from "svelte/easing";
	import { crossfade } from "svelte/transition";
	import { flip } from "svelte/animate";

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === "none" ? "" : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
			};
		},
	});
</script>

<div class="w-screen min-h-screen  bg-red-300 flex justify-center">
	<!-- {/* <p class="absolute top-0 left-0">
				order: {order}, compact: {String(compact)}
			</p> */} -->
	<main class="py-20 px-4 flex flex-col">
		<article class="prose mb-12">
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
					href="https://www.effectivealtruism.org/articles/introduction-to-effective-altruism"
				>
					effective altruist
				</a>
				!
			</p>
		</article>
		<div class="flex justify-center w-3/4 items-center self-center">
			<!-- {/* <div class="flex justify-between w-3/4 items-center self-center"> */} -->
			<div class="flex justify-center items-center">
				<Sorter
					selected={order === "wealth:high"
						? "down"
						: order === "wealth:low"
						? "up"
						: "naw"}
					on:message={() =>
						handleClick(order === "wealth:high" ? "wealth:low" : "wealth:high")}
				>
					Cost
				</Sorter>
				<!-- handleClick(order === "wealth:high" ? "wealth:low" : "wealth:high")} -->

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
			</div>
			<!-- {/* <label class="font-bold cursor-pointer flex items-center group">
						Compact
						<Checkbox.Root
							checked={compact}
							onCheckedChange={() => setCompact((c) => !c)}
						>
							<div class="border-2 border-black rounded-md w-4 h-4 flex items-center justify-center ml-2">
								<span
									class={`${
										compact ? "opacity-100" : "opacity-0 group-hover:opacity-50"
									} transition-opacity text-3xl relative left-0.5 -top-0.5`}
								>
									✓
								</span>
							</div>
						</Checkbox.Root>
					</label> */} -->
		</div>
		<div class="flex flex-col items-center">
			{#each sortedBillionaires as b (b.name)}
				<div
					animate:flip={{ duration: 300 }}
					in:receive|local={{ key: b.name }}
					out:send|local={{ key: b.name }}
				>
					<Card billi={b} compact={false} />
				</div>
			{/each}
		</div>
	</main>
</div>
