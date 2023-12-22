<script lang="ts">
	import { displayName } from '$lib/prisma/models/user.js';

	export let data;

	$: ({ surveyChallengeSet } = data);

	let selectedChallengeId = '';
	$: challenges = surveyChallengeSet?.challenges ?? [];
	$: selectedChallenge = challenges.find(
		(challenge) => challenge.id.toString() === selectedChallengeId.toString()
	);
</script>

{#if !challenges.length}
	<p class="text-lg mt-3 mb-1">No challenges found.</p>
{:else}
	<select
		name="challenge"
		class="w-full m-1 p-2 border rounded cursor-pointer"
		bind:value={selectedChallengeId}
	>
		<option value="" selected disabled>Choose a response</option>
		{#each challenges as challenge (challenge.id)}
			<option value={challenge.id}>{challenge.title}</option>
		{/each}
	</select>
{/if}

{#if selectedChallenge}
	<div class="my-2">
		<div>Prompt:</div>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div>{@html selectedChallenge.prompt}</div>
	</div>
	{#each selectedChallenge?.responses as response (response.id)}
		<div class="mb-4">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<h3>{displayName(response.player)}</h3>
			<p>{response.response}</p>
		</div>
	{/each}
{/if}
