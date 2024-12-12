<!-- <script lang="ts">
	import PageMargin from '$lib/components/PageMargin.svelte';
	import { onMount } from 'svelte';
	import InstructionsToggle from './InstructionsToggle.svelte';
	import NonWordleForm from './__forms/NonWordleForm.svelte';
	import WordleForm from './__forms/WordleForm.svelte';
	import SelectElfNameForm from './__forms/SelectElfNameForm.svelte';
	import OfflineForm from './__forms/OfflineForm.svelte';
	import MatchForm from './__forms/MatchForm.svelte';
	import SantasWorkshopForm from './__forms/SantasWorkshopForm.svelte';
	import MultipleOpenResponse from './__forms/MultipleOpenResponseForm.svelte';
	import WinLoseOrStopForm from './__forms/WinLoseOrStop/WinLoseOrStopForm.svelte';

	let { data, form } = $props();

	let { challenge, challengeSet } = $derived(data);
	let { instructions } = $derived(challengeSet);

	let textInput: HTMLInputElement;

	onMount(() => textInput?.focus());
</script>

<PageMargin>
	<div class="challenge-container flex flex-col">
		<h1 class="text-4xl mt-4 mb-1">{challenge.title.split(': ')[1] || challenge.title}</h1>

		<InstructionsToggle {instructions} />

		{#if ['WORDLE', 'WORDLE_2023'].includes(challenge.type)}
			<WordleForm {data} />
		{:else if ['MULTIPLE_CHOICE', 'OPEN_RESPONSE', 'YOUR_ELF_NAME_WORTH', 'FAMILY_FEUD', 'FRAMED'].includes(challenge.type)}
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
		{:else if 'WIN_LOSE_OR_STOP' === challenge.type}
			<WinLoseOrStopForm {data} />
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
</style> -->
