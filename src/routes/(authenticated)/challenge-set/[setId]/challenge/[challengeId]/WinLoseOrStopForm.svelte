<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import ConfirmModal from './ConfirmModal.svelte';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from './constants';
	import { CldImage } from 'svelte-cloudinary';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;

	$: ({ challenge, setHasAnotherChallenge } = data);
	$: ({ mainPrompt, prompts } = JSON.parse(challenge.prompt));

	let currentIndex = 0;
	let confirmModalIsOpen = false;
	let responses: string[] = [];
	let form: HTMLFormElement;

	const toggleConfirmModal = () => (confirmModalIsOpen = !confirmModalIsOpen);

	const handleNext = () => {
		const numWrong = responses.filter((a, i) => {
			const acceptedAnswers = prompts[i].acceptedAnswers;
			if (acceptedAnswers) {
				return !acceptedAnswers.includes(a);
			}
		}).length;
		if (numWrong > 1) {
			responses = [...responses, 'RESPONSE_FAIL'];
			handleSubmit();
		}
		currentIndex++;
	};

	async function handleSubmit() {
		const data = new FormData();
		const submit_action = setHasAnotherChallenge ? NEXT_INPUT_VALUE : SUBMIT_INPUT_VALUE;
		data.append('submit_action', submit_action);
		if (responses.length < prompts.length) {
			responses[currentIndex] = 'RESPONSE_STOP';
		}
		data.append('answer', JSON.stringify(responses));

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
	bind:this={form}
	class="flex flex-col justify-between grow sm:justify-start"
	method="POST"
	use:enhance
>
	<input type="hidden" name="answer" value={JSON.stringify(responses)} />
	<div class="flex flex-col mt-4">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<legend class="mb-4 text-lg">{@html mainPrompt}</legend>
		{#each challenge.cldImages as { publicId, alt, width, height }}
			<CldImage src={publicId} {alt} {width} {height} class="w-full mb-4" />
		{/each}

		{#key data}
			{#each prompts.slice(0, currentIndex) as { prompt }, i}
				<fieldset disabled>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<span class="text-lg">{@html prompt}</span>
					<input
						type="text"
						name={`response-${i}`}
						bind:value={responses[i]}
						class="text-green-700 border focus:border-2 border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1"
					/>
				</fieldset>
			{/each}
			<label class="mb-4">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<span class="text-lg">{@html prompts[currentIndex].prompt}</span>
				<input
					type="text"
					name={`response-${currentIndex}`}
					bind:value={responses[currentIndex]}
					class="text-green-700 border focus:border-2 border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1"
				/>
			</label>
		{/key}
	</div>
	<ConfirmModal
		isOpen={confirmModalIsOpen}
		toggleIsOpen={toggleConfirmModal}
		onConfirm={handleSubmit}
	/>
	<button
		type="button"
		on:click={currentIndex !== prompts.length - 1 ? handleNext : handleSubmit}
		class="bg-green-700 text-white font-bold py-3 px-6 rounded w-full text-lg mt-8 block"
	>
		{#if currentIndex !== prompts.length - 1}
			Next
		{:else}
			Submit
		{/if}
	</button>
	<button
		type="submit"
		value={setHasAnotherChallenge ? NEXT_INPUT_VALUE : SUBMIT_INPUT_VALUE}
		name="submit_action"
		class="bg-green-700 text-white font-bold py-3 px-6 rounded w-full text-lg my-8 block"
		on:click|preventDefault={toggleConfirmModal}
	>
		Quit
	</button>
</form>
