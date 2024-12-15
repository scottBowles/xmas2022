<script lang="ts">
	import Grid from '$lib/wordle/components/Grid/Grid.svelte';
	import { createGameStateStore } from '$lib/wordle/stores/gameState';
	import { createGuessStore } from '$lib/wordle/stores/guess';
	import type { PageData } from './$types';

	interface Props {
		challenge: PageData['challenges'][number];
		storageKey: string;
	}

	let { challenge, storageKey }: Props = $props();

	let guesses = $derived(challenge.response?.split(','));
	let showCorrectAnswer = $derived(guesses && !guesses.includes(challenge.correctAnswer || ''));

	let gameStateStore = $derived(createGameStateStore());
	let guessStore = $derived(
		createGuessStore(gameStateStore, challenge.correctAnswer || '', storageKey, guesses)
	);
</script>

<div class="flex grow flex-col items-center justify-center">
	<Grid currentGuess={[]} allGuesses={$guessStore} />
	{#if showCorrectAnswer}
		<p class="text-2xl">The correct word was <span class="red">{challenge.correctAnswer}</span>.</p>
	{/if}
</div>

<style>
	.red {
		color: var(--red);
	}
</style>
