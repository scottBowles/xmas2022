<script lang="ts">
	import Grid from '$lib/wordle/components/Grid/Grid.svelte';
	import { createGameStateStore } from '$lib/wordle/stores/gameState';
	import { createGuessStore } from '$lib/wordle/stores/guess';

	export let challenge: {
		response: string;
		correctAnswer: string | false | undefined;
	};
	export let storageKey: string;

	$: guesses = challenge.response.split(',');
	$: showCorrectAnswer = !guesses.includes(challenge.correctAnswer || '');

	$: gameStateStore = createGameStateStore();
	$: guessStore = createGuessStore(
		gameStateStore,
		challenge.correctAnswer || '',
		storageKey,
		guesses
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
