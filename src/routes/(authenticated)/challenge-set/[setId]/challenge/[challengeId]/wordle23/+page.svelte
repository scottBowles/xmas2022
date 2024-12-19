<script lang="ts">
	import { applyAction } from '$app/forms';
	import Wordle from '$lib/wordle/Wordle.svelte';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from '../constants';
	import type { ActionResult } from '@sveltejs/kit';
	import { urls } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { challengeTypeAbbreviations } from '@/constants';

	let { data, form } = $props();

	let { challenge, challengeSet, setHasAnotherChallenge } = $derived(data);

	let isComplete = $state(false);

	$effect(() => {
		if (isComplete) {
			setTimeout(() => {
				goto(urls.challengeSetReview(challengeSet.id), { replaceState: true });
			}, 3000);
		}
	});

	const onCompletion = async (guessesString: string) => {
		const formData = new FormData();
		formData.append('answer', guessesString);
		formData.append(
			'submit_action',
			setHasAnotherChallenge ? NEXT_INPUT_VALUE : SUBMIT_INPUT_VALUE
		);
		const typeAbbr = challengeTypeAbbreviations[challenge.type];
		const response = await fetch(urls.challenge(challengeSet.id, challenge.id, typeAbbr), {
			method: 'POST',
			body: formData,
		});
		const result: ActionResult = JSON.parse(await response.text());
		isComplete = true;
		return applyAction(result);
	};
</script>

<Wordle
	solution={challenge.acceptedResponsesIfOpen[0].toUpperCase()}
	storageKey={`${challengeSet.id}|${challenge.id}`}
	{onCompletion}
/>

{#if isComplete}
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
{/if}

{#if form?.message}
	<p class="text-christmasRed">{@html form.message}</p>
{/if}
