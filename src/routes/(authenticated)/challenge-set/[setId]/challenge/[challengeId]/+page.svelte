<script lang="ts">
	import PageMargin from '$lib/components/PageMargin.svelte';
	import { onMount } from 'svelte';
	import InstructionsToggle from './InstructionsToggle.svelte';
	import NonWordleForm from './NonWordleForm.svelte';
	import WordleForm from './WordleForm.svelte';
	import SelectElfNameForm from './SelectElfNameForm.svelte';
	import OfflineForm from './OfflineForm.svelte';
	import MatchForm from './MatchForm.svelte';
	import SantasWorkshopForm from './SantasWorkshopForm.svelte';
	import MultipleOpenResponse from './MultipleOpenResponse.svelte';

	export let data;
	export let form;

	$: ({ challenge, challengeSet } = data);
	$: ({ instructions } = challengeSet);

	let textInput: HTMLInputElement;

	onMount(() => textInput?.focus());
</script>

<PageMargin>
	<div class="challenge-container flex flex-col">
		<h1 class="text-4xl mt-4 mb-1">{challenge.title.split(': ')[1] || challenge.title}</h1>

		<InstructionsToggle {instructions} />

		{#if ['WORDLE', 'WORDLE_2023'].includes(challenge.type)}
			<WordleForm {data} />
		{:else if ['MULTIPLE_CHOICE', 'OPEN_RESPONSE', 'YOUR_ELF_NAME_WORTH'].includes(challenge.type)}
			<NonWordleForm {data} />
		{:else if 'MATCH' === challenge.type}
			<MatchForm {data} />
		{:else if 'SELECT_ELF_NAME' === challenge.type}
			<SelectElfNameForm {data} {form} />
		{:else if 'OFFLINE' === challenge.type}
			<OfflineForm {data} />
		{:else if 'SANTAS_WORKSHOP' === challenge.type}
			<SantasWorkshopForm {data} />
		{:else if 'MULTIPLE_OPEN_RESPONSE' === challenge.type}
			<MultipleOpenResponse {data} />
		{:else}
			<p>Loading Challenge...</p>
		{/if}

		{#if form?.message}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<p class="text-christmasRed">{@html form.message}</p>
		{/if}
	</div>
</PageMargin>

<style>
	.challenge-container {
		height: calc(100% - var(--nav-height));
	}
</style>
