<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import Wordle from '$lib/wordle/Wordle.svelte';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from '../constants';
	import type { ActionResult } from '@sveltejs/kit';
	import { urls } from '$lib/utils';
	import { goto, invalidateAll } from '$app/navigation';
	import { challengeTypeAbbreviations } from '@/constants';
	import WordleSafe from '@/wordle/WordleSafe.svelte';
	import type { CharStatus, CharValue } from '@/wordle/status';

	let { data, form } = $props();
	$inspect(data);
	$inspect('form', form);

	let { challenge, challengeSet, setHasAnotherChallenge, allGuesses } = $derived(data);

	let currentGuess: CharValue[] = $state([]);

	let formEl: HTMLFormElement;

	// really should handle complete state in case there are ever wordle
	// challenges that aren't the only challenge in their set
	// let isComplete = $state(false);

	// $effect(() => {
	// 	if (isComplete) {
	// 		setTimeout(() => {
	// 			goto(urls.challengeSetReview(challengeSet.id), { replaceState: true });
	// 		}, 3000);
	// 	}
	// });

	const onSubmit = () => {
		formEl?.submit();
	};
</script>

<form method="POST" use:enhance bind:this={formEl}>
	<input type="hidden" name="answer" value={currentGuess.join('')} />
</form>

<WordleSafe {allGuesses} {onSubmit} bind:currentGuess />

<!-- {#if isComplete}
	<hr />
	<div class="my-4 flex justify-between">
		<a href="/" class="text-christmasRed hover:underline" data-sveltekit-preload-data="hover"
			>&larr; Back to Games</a
		>
		<a
			href="/scoreboard"
			class="text-christmasRed hover:underline"
			data-sveltekit-preload-data="hover">Scoreboard &rarr;</a
		>
	</div>
{/if} -->

{#if form?.message}
	<p class="text-christmasRed">{@html form.message}</p>
{/if}
