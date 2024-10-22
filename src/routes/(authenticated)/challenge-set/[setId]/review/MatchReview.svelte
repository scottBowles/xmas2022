<script lang="ts">
	import type { PageData } from './$types';
	import { match } from '$lib/prisma/models/challenge/challengeTypeFns';

	interface Props {
		challenge: PageData['challenges'][number];
	}

	let { challenge }: Props = $props();
	let correctValues = $derived(JSON.parse(challenge.correctAnswer || '[]'));
	let givenValues = $derived(JSON.parse(challenge.responses[0]?.response || '[]'));
	let points = $derived(match.scoreChallenge(challenge, { elfNameChallengeResponse: null }));
</script>

<form class="flex flex-col justify-between grow sm:justify-start">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<legend class="mb-4 text-lg">{@html challenge.prompt}</legend>

	<ol class="mb-6">
		{#each challenge.matches as match, i}
			<li class="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
				<p>{i + 1}. {match}</p>
			</li>{/each}
	</ol>

	<ol class="mb-6">
		{#each challenge.matchOptions as matchOption, i}
			<li class="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
				<!-- as above, but use lowercase letters instead of numbers for enumerating (a., b., c. instead of 1., 2., 3.) -->
				<p>{String.fromCharCode(97 + i)}. {matchOption}</p>
			</li>{/each}
	</ol>

	<p class="mb-2">Your answers were:</p>
	<div class="flex flex-wrap gap-6 mb-2">
		{#each givenValues as value, i}
			<label class="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
				<span>{i + 1}</span>
				<input
					type="text"
					name={`match_${i}`}
					class="border border-gray-300 rounded py-2 px-4 w-16"
					{value}
					disabled
				/>
			</label>
		{/each}
	</div>

	{#if !challenge.responseIsCorrect}
		<p class="mb-2">The correct answers were:</p>
		<div class="flex flex-wrap gap-6 mb-2">
			{#each correctValues as value, i}
				<label class="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
					<span>{i + 1}</span>
					<input
						type="text"
						name={`match_${i}`}
						class="border border-gray-300 rounded py-2 px-4 w-16"
						{value}
						disabled
					/>
				</label>
			{/each}
		</div>
	{/if}
</form>

<p class="my-2 text-green-700">
	{points} / {challenge.points} points
</p>
