<script lang="ts">
	import GridSafe from '@/wordle/components/Grid/GridSafe.svelte';
	import type { PageData } from './$types';

	interface Props {
		challenge: PageData['challenges'][number];
	}

	let { challenge }: Props = $props();
</script>

<div class="flex grow flex-col items-center justify-center">
	<GridSafe currentGuess={[]} allGuesses={challenge.allGuesses ?? []} />

	{#if !challenge.responseIsCorrect}
		<p class="text-2xl">The correct word was <span class="red">{challenge.correctAnswer}</span>.</p>
	{/if}
</div>

<style>
	.red {
		color: var(--red);
	}
</style>
