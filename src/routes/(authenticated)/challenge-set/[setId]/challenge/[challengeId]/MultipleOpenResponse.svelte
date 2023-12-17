<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from './constants';
	import { CldImage } from 'svelte-cloudinary';

	export let data: PageData;

	$: ({ challenge, setHasAnotherChallenge } = data);
	$: ({ mainPrompt, inputPrompts } = JSON.parse(challenge.prompt));

	let answer: string[] = [];

	const clearInputs = () => {
		answer = [];
	};

	$: {
		if (challenge.id) {
			clearInputs();
		}
	}
</script>

<form class="flex flex-col justify-between grow sm:justify-start" method="POST" use:enhance>
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
	/>
</form>
