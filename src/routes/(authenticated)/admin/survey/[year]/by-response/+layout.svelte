<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { displayName } from '$lib/prisma/models/user.js';
	import urls from '$lib/utils/urls.js';

	export let data;
	$: ({ playersWithSurveyResponseInYear } = data);

	$: ({ year, playerId } = $page.params);

	$: console.log({ playerId });

	const handleResponseSelect = (e: Event) => {
		const selectedPlayerId = parseInt((e.target as HTMLSelectElement).value);
		goto(urls.adminSurveyForPlayer(parseInt(year), selectedPlayerId));
	};
</script>

{#if !playersWithSurveyResponseInYear.length}
	<p class="text-lg mt-3 mb-1">No responses found.</p>
{:else}
	<select class="w-full m-1 p-2 border rounded cursor-pointer" on:change={handleResponseSelect}>
		<option value="" selected={playerId === ''} disabled>Choose a response</option>
		{#each playersWithSurveyResponseInYear as player (player.id)}
			<option value={player.id} selected={player.id === parseInt(playerId)}>
				{displayName(player)}
			</option>
		{/each}
	</select>
{/if}

<slot />
