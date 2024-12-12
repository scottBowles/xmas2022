<script lang="ts">
	import { capitalize } from '$lib/utils';
	import Img from '../challenge/[challengeId]/framed/Img.svelte';
	import type { PageData } from './$types';
	import FramedCarousel from './FramedCarousel.svelte';

	interface Props {
		challenge: PageData['challenges'][number];
	}

	let { challenge }: Props = $props();
	let givenResponses = $derived(challenge.response);
	let images = $derived(challenge.children.map((child) => child.cldImages[0]));
</script>

<form>
	{#if images.length === 0}
		<p class="my-2 text-christmasRed">Something went wrong fetching the images.</p>
	{:else}
		<FramedCarousel {images} />
	{/if}

	<fieldset disabled>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<p class="mb-3 text-lg">{@html challenge.prompt}</p>
		{#if typeof givenResponses === 'string' || !givenResponses}
			<p class="my-2 text-christmasRed">Something went wrong fetching your responses.</p>
		{:else}
			{#each givenResponses as response}
				<input type="text" value={response} class="block border rounded px-2" />
			{/each}
		{/if}
	</fieldset>
	<p class="my-2">
		Correct Answer: {capitalize(
			challenge.correctAnswer || 'No correct answer (something went wrong here better tell Scott)'
		)}
	</p>
	{#if challenge.scoreOnSubmit}
		<p class="my-2">
			{challenge.responseIsCorrect ? challenge.points : 0} / {challenge.points} points
		</p>
		{#if challenge.responseIsCorrect}
			<p class="mb-4 text-lg text-green-700 italic">Correct!</p>
		{:else}
			<p class="incorrect mb-4 text-lg italic">Incorrect!</p>
		{/if}
	{/if}
</form>

<style>
	.incorrect {
		color: var(--red);
	}
</style>
