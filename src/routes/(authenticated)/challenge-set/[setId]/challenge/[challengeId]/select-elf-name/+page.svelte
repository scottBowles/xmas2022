<script lang="ts">
	import { enhance } from '$app/forms';
	import { toastStore } from '$lib/wordle/components/Toast/store';
	import { ELF_FIRST_NAMES, ELF_LAST_NAMES, SUBMIT_INPUT_VALUE } from '../constants';

	let { data, form } = $props();

	let availableFirstNames = $derived(
		ELF_FIRST_NAMES.filter((name) => {
			const takenFirstNames =
				form?.type === 'NAME_TAKEN' && form.takenFirstNames
					? form.takenFirstNames
					: (data.takenElfFirstNames ?? []);
			return !takenFirstNames.includes(name);
		})
	);
	let availableLastNames = $derived(
		ELF_LAST_NAMES.filter((name) => {
			const takenLastNames =
				form?.type === 'NAME_TAKEN' && form.takenLastNames
					? form.takenLastNames
					: (data.takenElfLastNames ?? []);
			return !takenLastNames.includes(name);
		})
	);

	let selectedFirstName: string = $state('');
	let selectedLastName: string = $state('');

	$effect(() => {
		if (form?.message) {
			toastStore.show({
				dismissible: false,
				message: form.message,
				id: 'elfnametoast',
			});
		}
	});
</script>

<!-- create a ui where a user can select a first name and a last name
from the ELF_FIRST_NAMES and ELF_LAST_NAMES arrays. the markup should use
radio inputs, but the user should just see names that get highlighted when selected -->
<form class="mt-6 mb-64" method="POST" use:enhance>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<legend class="mb-4 text-lg">{@html data.challenge.prompt}</legend>
	<input
		type="hidden"
		name="answer"
		value={JSON.stringify({ selectedFirstName, selectedLastName })}
	/>
	<div class="flex justify-around">
		<div class="flex flex-col">
			<div class="font-bold">Pick a first name</div>
			{#each availableFirstNames as firstName}
				{@const isSelected = selectedFirstName === firstName}
				<label>
					<input type="radio" bind:group={selectedFirstName} value={firstName} class="hidden" />
					<div
						class="py-1 px-4 rounded"
						class:bg-green-600={isSelected}
						class:text-white={isSelected}
					>
						{firstName}
					</div>
				</label>
			{/each}
		</div>
		<div class="flex flex-col">
			<div class="font-bold">Pick a last name</div>
			{#each availableLastNames as lastName}
				{@const isSelected = selectedLastName === lastName}
				<label>
					<input type="radio" bind:group={selectedLastName} value={lastName} class="hidden" />
					<div class="py-1 px-4 rounded" class:bg-red={isSelected} class:text-white={isSelected}>
						{lastName}
					</div>
				</label>
			{/each}
		</div>
	</div>

	<div class="mt-12"></div>

	<input
		type="submit"
		value={SUBMIT_INPUT_VALUE}
		name="submit_action"
		class="bg-green-700 text-white py-2 px-6 rounded w-full my-8 disabled:opacity-50 disabled:cursor-not-allowed"
		disabled={!selectedFirstName || !selectedLastName}
	/>
</form>

{#if form?.message}
	<p class="text-christmasRed">{@html form.message}</p>
{/if}
