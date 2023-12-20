<script lang="ts">
	import { familyFeud } from '$lib/prisma/models/challenge/challengeTypeFns';
	import { capitalize } from '$lib/utils';
	import type { PageData } from './$types';

	export let challenge: PageData['challenges'][number];
</script>

<form>
	<fieldset disabled>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
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
			challenge.correctAnswer || 'No correct answer (something went wrong here better tell Scott)'
		)}
	</p>
	<p class="my-2">
		{familyFeud.pointsForCorrect(challenge)} / {challenge.points} points
	</p>
	{#if challenge.responseIsCorrect}
		<p class="mb-4 text-lg text-green-700 italic">Correct!</p>
	{:else}
		<p class="incorrect mb-4 text-lg italic">Incorrect!</p>
	{/if}
</form>

<style>
	.incorrect {
		color: var(--red);
	}
</style>
