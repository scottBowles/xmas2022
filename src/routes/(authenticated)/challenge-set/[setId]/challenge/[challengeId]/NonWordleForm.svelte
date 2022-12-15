<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from './constants';

	export let data: PageData;

	$: ({ challenge } = data);
	$: response = challenge?.responses[0]?.response ?? '';

	let textInput: HTMLInputElement;

	onMount(() => textInput?.focus());
</script>

<form class="flex flex-col justify-between grow sm:justify-start" method="POST" use:enhance>
	<fieldset class="flex flex-col mt-4">
		<legend class="mb-4 text-lg">{@html challenge.prompt}</legend>
		{#if challenge.type === 'MULTIPLE_CHOICE'}
			{#each challenge.options as option}
				<label class="mb-4 text-lg">
					<input
						type="radio"
						name="answer"
						value={option.text}
						checked={response === option.text}
						required
					/>
					{option.text}
				</label>
			{/each}
		{:else}
			<input
				type="text"
				name="answer"
				value={response}
				bind:this={textInput}
				class="text-green-700 border-2 border-green-700 rounded focus:border-green-700 focus:outline-none w-full p-2"
			/>
		{/if}
	</fieldset>
	<input
		type="submit"
		value={challenge.isLast ? SUBMIT_INPUT_VALUE : NEXT_INPUT_VALUE}
		name="submit_action"
		class="bg-green-700 text-white font-bold py-3 px-6 rounded w-full text-lg my-8 block"
	/>
</form>
