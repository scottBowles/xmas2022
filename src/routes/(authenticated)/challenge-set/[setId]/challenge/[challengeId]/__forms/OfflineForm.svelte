<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from '../$types';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from '../constants';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let { challenge, setHasAnotherChallenge } = $derived(data);
</script>

<form class="flex flex-col justify-between grow sm:justify-start" method="POST" use:enhance>
	<fieldset class="flex flex-col mt-4">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<legend class="mb-4 text-lg">{@html challenge.prompt}</legend>
	</fieldset>
	<button
		type="submit"
		name="submit_action"
		value={setHasAnotherChallenge ? NEXT_INPUT_VALUE : SUBMIT_INPUT_VALUE}
		class="bg-green-700 text-white font-bold py-3 px-6 rounded w-full text-lg my-8 block">Ok</button
	>
</form>
