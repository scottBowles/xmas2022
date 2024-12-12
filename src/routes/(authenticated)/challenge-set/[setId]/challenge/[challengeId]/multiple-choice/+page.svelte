<script lang="ts">
	import { enhance } from '$app/forms';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from '../constants';

	let { data, form } = $props();

	let { challenge, setHasAnotherChallenge } = $derived(data);
	let response = $derived(challenge?.responses[0]?.response ?? '');
</script>

<form class="flex flex-col justify-between grow sm:justify-start" method="POST" use:enhance>
	<fieldset class="flex flex-col mt-4">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<legend class="mb-4 text-lg">{@html challenge.prompt}</legend>

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
	</fieldset>

	<input
		type="submit"
		value={setHasAnotherChallenge ? NEXT_INPUT_VALUE : SUBMIT_INPUT_VALUE}
		name="submit_action"
		class="bg-green-700 text-white font-bold py-3 px-6 rounded w-full text-lg my-8 block"
	/>
</form>

{#if form?.message}
	<p class="text-christmasRed">{@html form.message}</p>
{/if}
