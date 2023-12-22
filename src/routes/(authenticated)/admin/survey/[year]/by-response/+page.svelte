<script lang="ts">
	import { displayName } from '$lib/prisma/models/user.js';

	export let data;
	$: ({ challengeSetResponses } = data);

	let selectedSetResponseId = '';

	$: selectedSetResponse = challengeSetResponses.find(
		(csr) => csr.id.toString() === selectedSetResponseId
	);
	$: responsesData = selectedSetResponse?.challengeSet.challenges.map((challenge) => {
		const prompt = challenge.prompt;
		const response = challenge.responses[0].response;
		return { prompt, response };
	});
</script>

{#if !challengeSetResponses.length}
	<p class="text-lg mt-3 mb-1">No responses found.</p>
{:else}
	<select
		name="challenge-set-response"
		class="w-full m-1 p-2 border rounded cursor-pointer"
		bind:value={selectedSetResponseId}
	>
		<option value="" selected disabled>Choose a response</option>
		{#each challengeSetResponses as challengeSetResponse (challengeSetResponse.id)}
			<option value={challengeSetResponse.id}>{displayName(challengeSetResponse.player)}</option>
		{/each}
	</select>
{/if}

{#if responsesData}
	{#each responsesData as { prompt, response }}
		<div>
			<h3>{prompt}</h3>
			<p>{response}</p>
		</div>
	{/each}
{/if}
