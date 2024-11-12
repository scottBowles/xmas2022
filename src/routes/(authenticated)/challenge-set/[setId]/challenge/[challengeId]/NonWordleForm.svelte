<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from './constants';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let { challenge, setHasAnotherChallenge } = $derived(data);
	let response = $derived(challenge?.responses[0]?.response ?? '');

	let textInput: HTMLInputElement | undefined = $state();
</script>

<form class="flex flex-col justify-between grow sm:justify-start" method="POST" use:enhance>
	<fieldset class="flex flex-col mt-4">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<legend class="mb-4 text-lg">{@html challenge.prompt}</legend>
		{#if challenge.type === 'MULTIPLE_CHOICE'}
			{#key data}
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
			{/key}
		{:else}
			{#key data}
				<input
					type="text"
					name="answer"
					value={response}
					bind:this={textInput}
					autofocus
					class="text-green-700 border-2 border-green-700 rounded focus:border-green-700 focus:outline-none w-full p-2"
					required
				/>
			{/key}
		{/if}
	</fieldset>
	<input
		type="submit"
		value={setHasAnotherChallenge ? NEXT_INPUT_VALUE : SUBMIT_INPUT_VALUE}
		name="submit_action"
		class="bg-green-700 text-white font-bold py-3 px-6 rounded w-full text-lg my-8 block"
	/>
</form>
