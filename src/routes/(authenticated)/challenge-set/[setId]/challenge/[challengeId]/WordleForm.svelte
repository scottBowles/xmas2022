<script lang="ts">
	import { applyAction } from '$app/forms';
	import type { PageData } from './$types';
	import Wordle from '$lib/wordle/Wordle.svelte';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from './constants';
	import type { ActionResult } from '@sveltejs/kit';

	export let data: PageData;

	$: ({ challenge, challengeSet } = data);

	const onCompletion = async (numGuesses: number | null) => {
		const formData = new FormData();
		formData.append('answer', numGuesses?.toString() || '');
		formData.append('submit_action', challenge.isLast ? SUBMIT_INPUT_VALUE : NEXT_INPUT_VALUE);
		const response = await fetch(`/challenge-set/${challengeSet.id}/challenge/${challenge.id}`, {
			method: 'POST',
			body: formData
		});
		const result: ActionResult = JSON.parse(await response.text());
		return applyAction(result);
	};
</script>

<Wordle
	solution={challenge.acceptedResponsesIfOpen[0].toUpperCase()}
	storageKey={`${challengeSet.id}|${challenge.id}`}
	{onCompletion}
/>
