<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { onMount, tick } from 'svelte';
	import type { PageData } from './$types';
	import Wordle from '$lib/wordle/Wordle.svelte';
	import InstructionsToggle from './InstructionsToggle.svelte';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from './constants';
	import type { ActionResult } from '@sveltejs/kit';

	export let data: PageData;

	$: ({ challenge, challengeSet } = data);
	$: ({ instructions } = challengeSet);

	let textInput: HTMLInputElement;
	// let submitForm: HTMLFormElement;
	// let numGuesses: number | null;

	onMount(() => textInput?.focus());

	const onCompletion = async (numGuesses: number | null) => {
		const formData = new FormData();
		formData.append('answer', numGuesses?.toString() || '');
		formData.append('submit_action', challenge.isLast ? SUBMIT_INPUT_VALUE : NEXT_INPUT_VALUE);
		// numGuesses = numGuesses;
		// await tick();
		// submitForm.submit();
		const response = await fetch(`/challenge-set/${challengeSet.id}/challenge/${challenge.id}`, {
			method: 'POST',
			body: formData
		});
		const result: ActionResult = JSON.parse(await response.text());
		return applyAction(result);
	};
</script>

<div class="challenge-container flex flex-col">
	<h1 class="text-4xl mt-4 mb-1">{challenge.title.split(': ')[1] || challenge.title}</h1>
	<InstructionsToggle {instructions} />
	<Wordle
		solution={challenge.acceptedResponsesIfOpen[0]}
		storageKey={`${challengeSet.id}|${challenge.id}`}
		{onCompletion}
	/>

	<!-- <form method="POST" use:enhance bind:this={submitForm}>
		<input type="hidden" name="answer" value={numGuesses} />
		<input
			type="hidden"
			value={challenge.isLast ? SUBMIT_INPUT_VALUE : NEXT_INPUT_VALUE}
			name="submit_action"
		/>
	</form> -->
</div>

<style>
	.challenge-container {
		height: calc(100% - var(--nav-height));
	}
</style>
