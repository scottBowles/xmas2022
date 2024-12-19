<script lang="ts">
	import type { PageData } from './$types';
	import { match } from '$lib/prisma/models/challenge/challengeTypeFns';
	import { normalize } from '@/prisma/models/challenge/utils';

	interface Props {
		challenge: PageData['challenges'][number];
	}

	let { challenge }: Props = $props();
	let correctValues = $derived(JSON.parse(challenge.correctAnswer || '[]'));
	let givenValues = $derived(JSON.parse(challenge.responses[0]?.response || '[]'));
	let points = $derived(match.scoreChallenge(challenge, { elfNameChallengeResponse: null }));
	let correctIndeces = $derived(
		correctValues.map(normalize).map((v: string, i: number) => normalize(givenValues[i]) === v)
	);
</script>

<form class="flex flex-col justify-between grow sm:justify-start">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<legend class="mb-4 text-lg">{@html challenge.prompt}</legend>

	<ol class="mb-6">
		{#each challenge.matches as match, i}
			<li class={`flex flex-col sm:flex-row sm:items-center sm:space-x-4`}>
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

	<div class="mb-6">
		<p class="mb-2">Your answers were:</p>
		<div class="flex flex-wrap gap-6 mb-2">
			{#each givenValues as value, i}
				<label class="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
					<span>{i + 1}</span>
					<input
						type="text"
						name={`match_${i}`}
						class={`border border-gray-300 rounded py-2 px-4 w-16 ${
							correctIndeces[i] ? 'border-green-700 bg-green-100' : 'border-christmasRed bg-red-100'
						}`}
						{value}
						disabled
					/>
				</label>
			{/each}
		</div>
	</div>

	{#if !challenge.responseIsCorrect}
		<div>
			<p class="mb-2">The correct answers were:</p>
			<div class="flex flex-wrap gap-6 mb-2">
				{#each correctValues as value, i}
					<label class="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
						<span>{i + 1}</span>
						<input
							type="text"
							name={`match_${i}`}
							class={`border border-gray-300 rounded py-2 px-4 w-16 ${
								correctIndeces[i]
									? 'border-green-700 bg-green-100'
									: 'border-christmasRed bg-red-100'
							}`}
							value={value.toLowerCase()}
							disabled
						/>
					</label>
				{/each}
			</div>
		</div>
	{/if}
</form>

<p class="my-2 text-green-700">
	{points} / {challenge.points} points
</p>
