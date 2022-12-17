<script lang="ts">
	import PageMargin from '$lib/components/PageMargin.svelte';
	import { onMount } from 'svelte';
	import type { PageData, ActionData } from './$types';
	import InstructionsToggle from './InstructionsToggle.svelte';
	import NonWordleForm from './NonWordleForm.svelte';
	import WordleForm from './WordleForm.svelte';

	export let data: PageData;
	export let form: ActionData;

	$: ({ challenge, challengeSet } = data);
	$: ({ instructions } = challengeSet);

	let textInput: HTMLInputElement;

	onMount(() => textInput?.focus());
</script>

<PageMargin>
	<div class="challenge-container flex flex-col">
		<h1 class="text-4xl mt-4 mb-1">{challenge.title.split(': ')[1] || challenge.title}</h1>

		<InstructionsToggle {instructions} />

		{#if challenge.type === 'WORDLE'}
			<WordleForm {data} />
		{:else if ['MULTIPLE_CHOICE', 'OPEN_RESPONSE'].includes(challenge.type)}
			<NonWordleForm {data} />
		{:else}
			<p>Loading Challenge...</p>
		{/if}

		{#if form?.message}
			<p class="text-christmasRed">{@html form.message}</p>
		{/if}
	</div>
</PageMargin>

<style>
	.challenge-container {
		height: calc(100% - var(--nav-height));
	}
</style>
