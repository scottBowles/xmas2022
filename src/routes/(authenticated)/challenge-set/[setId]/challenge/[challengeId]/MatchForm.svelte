<script lang="ts">
	import { run } from 'svelte/legacy';

	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from './constants';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let { challenge, setHasAnotherChallenge } = $derived(data);
	let response = $derived(JSON.parse(challenge?.responses[0]?.response ?? '[]'));

	let values: string[] = $state([]);
	run(() => {
		if (values.length === 0 && challenge?.matches?.length > 0) {
			values = challenge?.matches?.map((_, i) => response[i] ?? '') ?? [];
		}
	});
	let json = $derived(JSON.stringify(values));
</script>

<form class="flex flex-col justify-between grow sm:justify-start" method="POST" use:enhance>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<legend class="mb-4 text-lg">{@html challenge.prompt}</legend>

	<ol class="mb-6">
		{#each challenge.matches as match, i}
			<li class="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
				<p>{i + 1}. {match}</p>
			</li>{/each}
	</ol>

	<ol class="mb-6">
		{#each challenge.matchOptions as matchOption, i}
			<li class="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
				<!-- as above, but use lowercase letters instead of numbers for enumerating (a., b., c. instead of 1., 2., 3.) -->
				<p>{String.fromCharCode(97 + i)}. {matchOption}</p>
			</li>{/each}
	</ol>

	<input type="hidden" name="answer" value={json} />
	<p>In each box, put only the letter that matches with the number above.</p>
	<div class="flex flex-wrap gap-6">
		{#each values as _, i}
			<label class="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
				<span>{i + 1}</span>
				<!-- svelte-ignore a11y_autofocus -->
				<input
					type="text"
					name={`match_${i}`}
					class="border border-gray-300 rounded py-2 px-4 w-16"
					bind:value={values[i]}
					autofocus={i === 0}
					required
				/>
			</label>
		{/each}
	</div>

	<input
		type="submit"
		value={setHasAnotherChallenge ? NEXT_INPUT_VALUE : SUBMIT_INPUT_VALUE}
		name="submit_action"
		class="bg-green-700 text-white font-bold py-3 px-6 rounded w-full text-lg my-8 block"
	/>
</form>
