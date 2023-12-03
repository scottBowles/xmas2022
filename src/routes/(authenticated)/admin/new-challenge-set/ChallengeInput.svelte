<script lang="ts">
	import type { cryptoUuid } from '$lib/utils/types';

	export let id: cryptoUuid;

	let type = '';
	let options: cryptoUuid[] = [];

	function addOption() {
		options = [...options, crypto.randomUUID()];
	}

	function removeOption(id: cryptoUuid) {
		options = options.filter((optionId) => optionId !== id);
	}
</script>

<fieldset>
	<legend class="font-bold">Challenge Details</legend>

	<label for={`challengeType-${id}`}>Type</label>
	<select name={`challengeType-${id}`} id={`challengeType-${id}`} bind:value={type}>
		<option disabled value=""> -- select an option -- </option>
		<option value="multipleChoice">Multiple Choice</option>
		<option value="openEnded">Open Ended</option>
	</select>

	{#if type}
		<label for={`challengeName-${id}`}>Name</label>
		<input
			id={`challengeName-${id}`}
			name={`challengeName-${id}`}
			class=" w-full m-1 p-2 border rounded cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60"
		/>

		<label for={`challengePrompt-${id}`}>Prompt</label>
		<textarea
			id={`challengePrompt-${id}`}
			name={`challengePrompt-${id}`}
			class=" w-full m-1 p-2 border rounded cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60"
		/>

		{#if type === 'multipleChoice'}
			{#each options as option (option)}
				<button type="button" on:click={() => removeOption(option)}>-</button>
				<label for={`challengeOptions-${id}-${option}`}>Option</label>
				<input
					id={`challengeOptions-${id}-${option}`}
					name={`challengeOptions-${id}-${option}`}
					class=" w-full m-1 p-2 border rounded cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60"
				/>
			{/each}
			<button type="button" on:click={addOption}>+</button>
		{:else}
			<label for={`challengeAcceptedAnswerIfOpen-${id}`}>Accepted Answer If Open</label>
			<input
				id={`challengeAcceptedAnswerIfOpen-${id}`}
				name={`challengeAcceptedAnswerIfOpen-${id}`}
				class=" w-full m-1 p-2 border rounded cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60"
			/>
		{/if}

		<input
			type="checkbox"
			id={`challengeScoreOnSubmit-${id}`}
			name={`challengeScoreOnSubmit-${id}`}
		/>
		<label for={`challengeScoreOnSubmit-${id}`}>Score On Submit</label>

		<label for={`challengePoints-${id}`}>Points</label>
		<input
			type="number"
			id={`challengePoints-${id}`}
			name={`challengePoints-${id}`}
			class=" w-full m-1 p-2 border rounded cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60"
		/>
	{/if}
</fieldset>
