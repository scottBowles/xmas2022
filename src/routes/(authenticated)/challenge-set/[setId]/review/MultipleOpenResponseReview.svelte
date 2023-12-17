<script lang="ts">
	import type { PageData } from './$types';
	import { multipleOpenResponse } from '$lib/prisma/models/challenge/challengeTypeFns';
	import { CldImage } from 'svelte-cloudinary';

	export let challenge: PageData['challenges'][number];

	$: ({ mainPrompt, inputPrompts } = JSON.parse(challenge.prompt));
	$: correctValues = challenge.correctAnswer;
	$: givenValues = JSON.parse(challenge.responses[0]?.response || '[]');
	$: points = multipleOpenResponse.scoreChallenge(challenge, { elfNameChallengeResponse: null });
</script>

<form class="flex flex-col justify-between grow sm:justify-start">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<legend class="mb-4 text-lg">{@html mainPrompt}</legend>
	{#each challenge.cldImages as { publicId, alt, width, height }}
		<CldImage src={publicId} {alt} {width} {height} class="w-full mb-4" />
	{/each}

	<div class="mb-2">
		{#each givenValues as value, i}
			<div class="mb-3">
				<label>
					<div>{inputPrompts[i]}</div>
					<input
						type="text"
						name={`q_${i}`}
						class="border border-gray-300 rounded py-2 px-4 w-full"
						{value}
						disabled
					/>
				</label>
				{#if multipleOpenResponse.answerIsCorrect(challenge, value, i)}
					<p class="text-green-700">✅ Correct!</p>
				{:else}
					<p class="text-red-700">
						❌ {correctValues && correctValues[i] ? correctValues[i] : 'No answer found'}
					</p>
				{/if}
			</div>
		{/each}
	</div>
</form>

<p class="my-2 text-green-700">
	{points} / {challenge.points} points
</p>
