<script lang="ts">
	import FaCaretUp from 'svelte-icons/fa/FaCaretUp.svelte';
	import FaCaretDown from 'svelte-icons/fa/FaCaretDown.svelte';

	export let instructions = '';

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
		Hide Instructions
	</div>

	<p class="italic text-green-700">{@html instructions}</p>
{:else}
	<div
		on:click={toggleInstructions}
		on:keydown={toggleInstructions}
		class="italic text-blue-400 cursor-pointer flex items-center"
	>
		<div class="h-4 w-4"><FaCaretDown /></div>
		Review Instructions
	</div>
{/if}
