<script>
	export let selected = false;
</script>

<div
	class="border-2 peer-focus:scale-110  peer-target:scale-110 transition-all outline-none border-black rounded-md w-4 h-4 flex items-center justify-center ml-2"
>
	<span
		class={`${
			selected ? "opacity-100 group-hover:opacity-75" : "opacity-0 group-hover:opacity-30"
		} transition-opacity text-xl sm:text-3xl relative left-0.5 -top-0.5`}
	>
		✓
	</span>
</div>
