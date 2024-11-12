<script lang="ts">
	import FaCaretUp from 'svelte-icons/fa/FaCaretUp.svelte';
	import FaCaretDown from 'svelte-icons/fa/FaCaretDown.svelte';

	interface Props {
		instructions?: string;
	}

	let { instructions = '' }: Props = $props();

	let showInstructions = $state(false);
	function toggleInstructions() {
		showInstructions = !showInstructions;
	}
</script>

{#if showInstructions}
	<div
		onclick={toggleInstructions}
		onkeydown={toggleInstructions}
		class="italic text-blue-400 cursor-pointer flex items-center"
		role="button"
		tabindex="0"
	>
		<div class="h-4 w-4"><FaCaretUp /></div>
		Hide Instructions
	</div>

	<p class="italic text-green-700">{@html instructions}</p>
{:else}
	<div
		onclick={toggleInstructions}
		onkeydown={toggleInstructions}
		class="italic text-blue-400 cursor-pointer flex items-center"
		role="button"
		tabindex="0"
	>
		<div class="h-4 w-4"><FaCaretDown /></div>
		Review Instructions
	</div>
{/if}
