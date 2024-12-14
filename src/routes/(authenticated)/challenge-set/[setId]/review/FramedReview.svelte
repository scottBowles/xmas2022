<script lang="ts">
	import CHLG from '$lib/prisma/models/challenge';
	import { capitalize, jsonSafeParse } from '$lib/utils';
	import { z } from 'zod';
	import Img from '../challenge/[challengeId]/framed/Img.svelte';
	import type { PageData } from './$types';
	import { normalize } from '$lib/prisma/models/challenge/utils';

	const responsesSchema = z.array(z.string());

	interface Props {
		challenge: PageData['challenges'][number];
	}

	let { challenge }: Props = $props();

	let givenResponses = $derived(
		(responsesSchema.safeParse(jsonSafeParse(CHLG.response(challenge))).data ?? []).map(
			(response) => ({
				response,
				isCorrect: challenge.acceptedResponsesIfOpen.map(normalize).includes(normalize(response)),
			})
		)
	);

	const calculatePoints = (responses: { response: string; isCorrect: boolean }[]) => {
		const pointsPerRemaining = challenge.points / 6;
		const correctIndex = responses.findIndex((r) => r.isCorrect);
		if (correctIndex === -1) return 0;
		return pointsPerRemaining * (6 - correctIndex);
	};

	let pointsEarned = $derived(calculatePoints(givenResponses));

	let images = $derived(challenge.children.map((child) => child.cldImages[0]));

	let displayedImageIndex = $state(5);
	let displayedImage = $derived(images[displayedImageIndex]);
</script>

<form>
	<!-- PROMPT -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<legend class="mb-4 text-lg">
		{@html challenge.prompt}
	</legend>

	{#if images.length === 0}
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
