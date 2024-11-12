<script lang="ts">
	import { applyAction } from '$app/forms';
	import type { PageData } from './$types';
	import Wordle from '$lib/wordle/Wordle.svelte';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from './constants';
	import type { ActionResult } from '@sveltejs/kit';
	import { urls } from '$lib/utils';
	import { goto } from '$app/navigation';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

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
		const response = await fetch(`/challenge-set/${challengeSet.id}/challenge/${challenge.id}`, {
			method: 'POST',
			body: formData
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
			>&larr; Back to Challenges</a
		>
		<a
			href="/scoreboard"
			class="text-christmasRed hover:underline"
			data-sveltekit-preload-data="hover">Scoreboard &rarr;</a
		>
	</div>
{/if}
