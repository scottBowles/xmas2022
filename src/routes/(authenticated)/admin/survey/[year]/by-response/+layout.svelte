<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { displayName } from '$lib/prisma/models/user.js';
	import urls from '$lib/utils/urls.js';

	let { data, children } = $props();
	let { playersWithSurveyResponseInYear } = $derived(data);

	let { year, playerId } = $derived($page.params);

	const handleResponseSelect = (e: Event) => {
		const selectedPlayerId = parseInt((e.target as HTMLSelectElement).value);
		goto(urls.adminSurveyForPlayer(parseInt(year), selectedPlayerId));
	};
</script>

{#if !playersWithSurveyResponseInYear.length}
	<p class="text-lg mt-3 mb-1">No responses found.</p>
{:else}
	<select class="w-full m-1 p-2 border rounded cursor-pointer" onchange={handleResponseSelect}>
		<option value="" selected={playerId === undefined} disabled>Choose a response</option>
		{#each playersWithSurveyResponseInYear as player (player.id)}
			<option value={player.id} selected={player.id === parseInt(playerId)}>
				{displayName(player)}
			</option>
		{/each}
	</select>
{/if}

{@render children?.()}
