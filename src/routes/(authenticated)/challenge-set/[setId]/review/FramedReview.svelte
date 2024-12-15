<script lang="ts">
	import { capitalize } from '$lib/utils';
	import Img from '../challenge/[challengeId]/framed/Img.svelte';
	import type { PageData } from './$types';

	import * as Framed from '$lib/prisma/models/challenge/challengeTypeFns/framed';

	interface Props {
		challenge: PageData['challenges'][number];
	}

	let { challenge }: Props = $props();

	let givenResponses = $derived(
		Framed.parseResponse(challenge).map((response) => ({
			response,
			isCorrect: Framed.subResponseIsCorrect(response, challenge),
		}))
	);

	let pointsEarned = $derived(Framed.scoreChallenge(challenge, { elfNameChallengeResponse: null }));

	let displayedImageIndex = $state(5);
	let displayedImage = $derived(challenge.cldImages[displayedImageIndex]);
</script>

<form>
	<!-- PROMPT -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<legend class="mb-4 text-lg">
		{@html challenge.prompt}
	</legend>

	{#if challenge.cldImages.length === 0}
		<p class="my-2 text-christmasRed">Something went wrong fetching the images.</p>
	{:else}
		<!-- IMAGE -->
		{@const { publicId, alt } = displayedImage}
		<Img {publicId} alt={alt ?? `Image to guess the movie for ${challenge.title}`} />

		<!-- IMAGE NAV -->
		<div class="flex justify-center w-full mb-2 mt-1 text-white gap-1">
			{#each challenge.cldImages as _, i}
				<button
					class={`border-slate-700 py-[2px] sm:text-xl flex-grow ${displayedImageIndex === i ? 'bg-slate-900' : 'bg-slate-400 hover:bg-slate-500'}`}
					disabled={displayedImageIndex === i}
					onclick={() => (displayedImageIndex = i)}>{i + 1}</button
				>
			{/each}
		</div>
	{/if}

	<!-- RESPONSES LIST -->
	{#if typeof givenResponses === 'string' || !givenResponses}
		<p class="my-2 text-christmasRed">Something went wrong fetching your responses.</p>
	{:else}
		<div class="flex flex-col">
			<div class="overflow-y-auto text-sm max-h-32 sm:max-h-full sm:text-base">
				{#each givenResponses as { response, isCorrect }}
					<div class="p-2 border rounded h-7 sm:h-8 mb-2 flex items-center gap-2 border-slate-500">
						<div
							class="{isCorrect ? 'bg-green-700' : 'bg-red-700'} w-3 h-3 rounded-sm sm:w-4 sm:h-4"
						></div>
						<div>{response}</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<p class="my-2">
		Correct Answer: {capitalize(
			challenge.correctAnswer || 'No correct answer (something went wrong here better tell Scott)'
		)}
	</p>
	{#if challenge.scoreOnSubmit}
		<p class="my-2">
			{pointsEarned} / {challenge.points} points
		</p>
		{#if givenResponses.some((r) => r.isCorrect)}
			<p class="mb-4 text-lg text-green-700 italic">You got it!</p>
		{:else}
			<p class="incorrect mb-4 text-lg italic"></p>
		{/if}
	{/if}
</form>

<style>
	.incorrect {
		color: var(--red);
	}
</style>
