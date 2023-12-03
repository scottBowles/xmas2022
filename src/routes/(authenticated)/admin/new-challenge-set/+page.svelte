<script lang="ts">
	import { enhance } from '$app/forms';
	import PageMargin from '$lib/components/PageMargin.svelte';
	import type { cryptoUuid } from '$lib/utils/types';
	import ChallengeInput from './ChallengeInput.svelte';

	// export let form;

	let challengeFormIds: cryptoUuid[] = [];

	function addChallenge() {
		challengeFormIds = [...challengeFormIds, crypto.randomUUID()];
	}

	function removeChallenge(id: cryptoUuid) {
		challengeFormIds = challengeFormIds.filter((challengeId) => challengeId !== id);
	}
</script>

<PageMargin>
	<div class="h-12" />
	<form method="POST" use:enhance>
		<fieldset>
			<legend class="font-bold">Challenge Set Details</legend>
			<label for="csName">Name</label>
			<input
				id="csName"
				name="csName"
				class=" w-full m-1 p-2 border rounded cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60"
			/>

			<label for="csInstructions">Instructions</label>
			<textarea
				id="csInstructions"
				name="csInstructions"
				class=" w-full m-1 p-2 border rounded cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60"
			/>

			<label for="csTimeAvailableStart">Time Available Start</label>
			<input
				type="datetime-local"
				id="csTimeAvailableStart"
				name="csTimeAvailableStart"
				class="w-full m-1 p-2 border rounded cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60"
			/>

			<label for="csTimeAvailableEnd">Time Available End</label>
			<input
				type="datetime-local"
				id="csTimeAvailableEnd"
				name="csTimeAvailableEnd"
				class="w-full m-1 p-2 border rounded cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60"
			/>

			<input type="checkbox" id="csIsTimed" name="csIsTimed" />
			<label for="csIsTimed">Is Timed</label>

			<input type="checkbox" id="csIsScored" name="csIsScored" />
			<label for="csIsScored">Is Scored</label>
		</fieldset>

		{#each challengeFormIds as id (id)}
			<button type="button" on:click={() => removeChallenge(id)}>-</button>
			<ChallengeInput {id} />
		{/each}
		<button type="button" on:click={addChallenge}>+</button>
	</form>
</PageMargin>
