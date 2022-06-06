<script lang="ts">
	import Caret from "./Caret.svelte";

	export let first = false;
	export let selected: "naw" | "up" | "down" | undefined = undefined;

	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	function onClick() {
		dispatch("message");
	}
</script>

<button class={`flex items-center ${first ? "w-1/4" : "flex-1"} group`} on:click={onClick}>
	<span class="font-bold text-sm"><slot /></span>
	<div
		class={`relative top-[1px] transition-all sm:group-hover:rotate-45 ml-1 ${
			selected === "naw" ? "opacity-0 group-hover:opacity-25 group-hover:rotate-0" : ""
		}`}
	>
		<div class={`${selected === "up" ? "rotate-180" : "rotate-0"} transition-transform`}>
			<Caret />
		</div>
	</div>
</button>
