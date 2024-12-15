<script lang="ts">
	import { run } from 'svelte/legacy';

	import { applyAction, deserialize, enhance } from '$app/forms';
	import { CldImage } from 'svelte-cloudinary';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from '../constants';
	import ConfirmModal from '../ConfirmModal.svelte';
	import { invalidateAll } from '$app/navigation';

	let { data, form } = $props();

	let { challenge, setHasAnotherChallenge } = $derived(data);
	let { mainPrompt, inputPrompts } = $derived(
		JSON.parse(challenge.prompt) as { mainPrompt: string; inputPrompts: string[] }
	);

	let confirmModalIsOpen = $state(false);
	const toggleConfirmModal = () => (confirmModalIsOpen = !confirmModalIsOpen);

	let formEl: HTMLFormElement | undefined = $state();
	let answer: string[] = $state([]);

	const clearInputs = () => {
		answer = [];
	};

	run(() => {
		if (challenge.id) {
			clearInputs();
		}
	});
	$inspect(answer);

	async function handleSubmit() {
		const data = new FormData();
		const submit_action = setHasAnotherChallenge ? NEXT_INPUT_VALUE : SUBMIT_INPUT_VALUE;
		const submitAnswer = inputPrompts.map((_, i) => answer[i] || ''); // Ensure we have a value for each prompt
		data.append('submit_action', submit_action);
		data.append('answer', JSON.stringify(submitAnswer));

		const response = await fetch('', {
			method: 'POST',
			body: data,
		});

		/** @type {import('@sveltejs/kit').ActionResult} */
		const result = deserialize(await response.text());

		if (result.type === 'success') {
			// rerun all `load` functions, following the successful update
			await invalidateAll();
		}

		applyAction(result);
	}
</script>

<form
	bind:this={formEl}
	class="flex flex-col justify-between grow sm:justify-start"
	method="POST"
	use:enhance
>
	<fieldset class="flex flex-col mt-4">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<legend class="mb-4 text-lg">{@html mainPrompt}</legend>
		{#each challenge.cldImages as { publicId, alt, width, height }}
			<CldImage src={publicId} {alt} {width} {height} class="w-full mb-4" />
		{/each}
		{#key challenge.id}
			{#each inputPrompts as prompt, i}
				<label class="mb-4">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<span class="text-lg">{@html prompt}</span>
					<input
						type="text"
						name={`response-${i}`}
						bind:value={answer[i]}
						class="text-green-700 border focus:border-2 border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1"
						required
					/>
				</label>
			{/each}
		{/key}
	</fieldset>
	<input type="hidden" name="answer" value={JSON.stringify(answer)} />
	<input
		type="submit"
		value={setHasAnotherChallenge ? NEXT_INPUT_VALUE : SUBMIT_INPUT_VALUE}
		name="submit_action"
		class="bg-green-700 text-white font-bold py-3 px-6 rounded w-full text-lg my-8 block"
		onclick={() => (confirmModalIsOpen = true)}
	/>
</form>

{#if form?.message}
	<p class="text-christmasRed">{@html form.message}</p>
{/if}

<ConfirmModal
	isOpen={confirmModalIsOpen}
	toggleIsOpen={toggleConfirmModal}
	onConfirm={handleSubmit}
/>
