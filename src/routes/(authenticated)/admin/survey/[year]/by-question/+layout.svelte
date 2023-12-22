<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import urls from '$lib/utils/urls.js';

	export let data;

	$: ({ surveyChallengeSet } = data);
	$: ({ year, challengeId } = $page.params);

	$: challenges = surveyChallengeSet?.challenges ?? [];

	const handleQuestionSelect = (e: Event) => {
		const selectedChallengeId = parseInt((e.target as HTMLSelectElement).value);
		goto(urls.adminSurveyForQuestion(parseInt(year), selectedChallengeId));
	};
</script>

{#if !challenges.length}
	<p class="text-lg mt-3 mb-1">No challenges found.</p>
{:else}
	<select class="w-full m-1 p-2 border rounded cursor-pointer" on:change={handleQuestionSelect}>
		<option value="" selected={challengeId === '' || challengeId === undefined} disabled
			>Choose a response</option
		>
		{#each challenges as challenge (challenge.id)}
			<option value={challenge.id} selected={challenge.id === parseInt(challengeId)}>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html challenge.prompt}
			</option>
		{/each}
	</select>
{/if}

<slot />
