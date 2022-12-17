<script lang="ts">
	import PageMargin from '$lib/components/PageMargin.svelte';
	import { capitalize, formatDuration } from '$lib/utils';
	import type { PageData } from './$types';

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
			<form>
				<fieldset disabled>
					<p class="mb-3 text-lg">{@html challenge.prompt}</p>
					{#if challenge.options.length > 0}
						{#each challenge.options as option}
							<label class="flex-auto block">
								<input
									type="radio"
									name={challenge.title}
									value={option.text}
									checked={challenge.response === option.text}
									class="mr-1 md:mr-2"
								/>
								{option.text}
							</label>
						{/each}
					{:else}
						<input type="text" value={challenge.response ?? ''} class="border rounded px-2" />
					{/if}
				</fieldset>
				<p class="my-2">
					Correct Answer: {capitalize(
						challenge.correctAnswer ||
							'No correct answer (something went wrong here better tell Scott)'
					)}
				</p>
				<p class="my-2">
					{challenge.responseIsCorrect ? challenge.points : 0} / {challenge.points} points
				</p>
				{#if challenge.responseIsCorrect}
					<p class="mb-4 text-lg text-green-700 italic">Correct!</p>
				{:else}
					<p class="incorrect mb-4 text-lg italic">Incorrect!</p>
				{/if}
			</form>
			<hr />
		{/each}
		<div class="my-4 flex justify-between">
			<a href="/" class="nav-links">&larr; Back to Challenges</a>
			<a href="/scoreboard" class="nav-links">Scoreboard &rarr;</a>
		</div>
	{/if}
</PageMargin>

<style>
	.incorrect {
		color: var(--red);
	}

	.nav-links {
		color: var(--red);
	}
</style>
