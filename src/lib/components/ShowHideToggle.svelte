<script lang="ts">
	import FaCaretUp from 'svelte-icons/fa/FaCaretUp.svelte';
	import FaCaretDown from 'svelte-icons/fa/FaCaretDown.svelte';

	export let contentHtml = '';
	export let hideContentLabel = 'Hide Instructions';
	export let showContentLabel = 'Review Instructions';

	let showInstructions = false;
	function toggleInstructions() {
		showInstructions = !showInstructions;
	}
</script>

{#if showInstructions}
	<div
		on:click={toggleInstructions}
		on:keydown={toggleInstructions}
		class="italic text-blue-400 cursor-pointer flex items-center"
	>
		<div class="h-4 w-4"><FaCaretUp /></div>
		{hideContentLabel}
	</div>

	<p class="italic text-green-700">{@html contentHtml}</p>
	<slot />
{:else}
	<div
		on:click={toggleInstructions}
		on:keydown={toggleInstructions}
		class="italic text-blue-400 cursor-pointer flex items-center"
	>
		<div class="h-4 w-4"><FaCaretDown /></div>
		{showContentLabel}
	</div>
{/if}
