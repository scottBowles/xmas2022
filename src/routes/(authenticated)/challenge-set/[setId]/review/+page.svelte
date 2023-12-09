<script lang="ts">
	import PageMargin from '$lib/components/PageMargin.svelte';
	import { formatDuration } from '$lib/utils';
	import type { PageData } from './$types';
	import NonWordleReview from './NonWordleReview.svelte';
	import SelectElfNameReview from './SelectElfNameReview.svelte';
	import Wordle2022Review from './Wordle2022Review.svelte';
	import Wordle2023Review from './Wordle2023Review.svelte';
	import YourElfNameWorthReview from './YourElfNameWorthReview.svelte';

	export let data: PageData;

	$: ({ challengeSet, challenges, timeTaken, points } = data);
</script>

<PageMargin>
	<h1 class="text-4xl mt-4 mb-1">{challengeSet.title}</h1>
	<div class="flex justify-between gap-x-6 flex-wrap">
		<h2 class="text-xl mt-4 mb-1 text-green-700 whitespace-nowrap">
			{timeTaken ? formatDuration(timeTaken) : '–'}
		</h2>
		<h2 class="text-xl mt-4 mb-1 text-green-700 whitespace-nowrap">
			{points} points
		</h2>
	</div>

	{#if challenges}
		{#each challenges as challenge}
			{#if challenge.title}
				<h2 class="text-2xl mt-4 mb-1">{challenge.title}</h2>
			{/if}
			{#if challenge.type === 'WORDLE'}
				<Wordle2022Review {challenge} />
			{:else if challenge.type === 'WORDLE_2023'}
				<Wordle2023Review {challenge} storageKey={`${challengeSet.id}|${challenge.id}`} />
			{:else if ['MULTIPLE_CHOICE', 'OPEN_RESPONSE'].includes(challenge.type)}
				<NonWordleReview {challenge} />
			{:else if challenge.type === 'SELECT_ELF_NAME'}
				<SelectElfNameReview {challenge} />
			{:else if challenge.type === 'YOUR_ELF_NAME_WORTH'}
				<YourElfNameWorthReview {challenge} />
			{:else}
				<p>Loading Challenge...</p>
			{/if}
			<hr />
		{/each}
		<div class="my-4 flex justify-between">
			<a href="/" class="nav-links" data-sveltekit-preload-data="hover">
				&larr; Back to Challenges</a
			>
			<a href="/scoreboard" class="nav-links" data-sveltekit-preload-data="hover">
				Scoreboard &rarr;</a
			>
		</div>
	{/if}
</PageMargin>

<style>
	.nav-links {
		color: var(--red);
	}
</style>
