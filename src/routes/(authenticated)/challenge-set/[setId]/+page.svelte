<script lang="ts">
	import PageMargin from '$lib/components/PageMargin.svelte';
	import { urls } from '$lib/utils';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const { id, title, instructions, challengeSetResponses } = data.challengeSet;
	const { startedAt, completedAt } = challengeSetResponses[0] ?? {};
	const userHasStartedChallengeSet = !!startedAt;
	const userHasCompletedChallengeSet = !!completedAt;
	const reviewUrl = urls.challengeSetReview(id);
</script>

<PageMargin>
	{#if userHasCompletedChallengeSet}
		<h1 class="text-4xl mt-4 mb-1">Instructions</h1>
		<p>Challenge complete! Click below to review your answers.</p>
		<h2 class="text-2xl mt-4 mb-1">{title}</h2>
		<p>{@html instructions}</p>
		<a href={reviewUrl}>Review</a>
	{:else}
		<h1 class="text-4xl mt-4 mb-1">Instructions</h1>
		<p>Read the instructions with care and hit start when you are ready.</p>
		<h2 class="text-2xl mt-4 mb-1">{title}</h2>
		<p>{@html instructions}</p>
		<form method="POST">
			<button type="submit" class="bg-green-700 text-white font-bold my-8 py-3 px-6 rounded">
				{userHasStartedChallengeSet ? 'CONTINUE' : 'START'}
			</button>
		</form>
	{/if}
	{#if form?.error}
		<div
			class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
			role="alert"
		>
			<span class="block sm:inline">{form.error}</span>
		</div>
	{/if}
</PageMargin>
