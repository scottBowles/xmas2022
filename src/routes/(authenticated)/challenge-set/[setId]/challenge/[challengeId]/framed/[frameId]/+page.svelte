<script lang="ts">
	import { enhance } from '$app/forms';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from '../../constants';
	import Img from './Img.svelte';

	let { data, form } = $props();

	let { challenge, setHasAnotherChallenge, challengeHasAnotherFrame, responses } = $derived(data);
	let response = $derived(challenge?.responses[0]?.response ?? '');
	let isComplete = $derived(responses.length === 6 || responses.some((r) => r.isCorrect));

	let textInput: HTMLInputElement | undefined = $state();
</script>

{#key data}
	<form class="flex flex-col justify-between grow sm:justify-start" method="POST" use:enhance>
		<fieldset class="flex flex-col mt-4">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<legend class="mb-4 text-lg">
				{@html challenge.prompt}
			</legend>

			{#if challenge.cldImages?.length === 0}
				<p class="text-center text-lg">Image not found</p>
			{:else}
				{@const { publicId, alt } = challenge.cldImages[0]}
				<Img {publicId} alt={alt ?? `Image to guess the movie for ${challenge.title}`} />
			{/if}

			<!-- svelte-ignore a11y_autofocus -->
			<input
				type="text"
				name="answer"
				value={response}
				bind:this={textInput}
				autofocus
				class="text-green-700 border-2 border-green-700 rounded focus:border-green-700 focus:outline-none w-full p-2"
				required
			/>
		</fieldset>

		<input
			type="submit"
			value={setHasAnotherChallenge ? NEXT_INPUT_VALUE : SUBMIT_INPUT_VALUE}
			name="submit_action"
			class="bg-green-700 text-white font-bold py-3 px-6 rounded w-full text-lg my-8 block"
			disabled={!!response}
		/>

		<div class="flex flex-col">
			<div class="overflow-y-auto text-sm text-white max-h-32 sm:max-h-full sm:text-base">
				{#each responses as { response, isCorrect }}
					<div class="p-2 border rounded h-7 sm:h-8 mb-2 flex items-center gap-2 border-slate-500">
						<div
							class="{isCorrect ? 'bg-green-700' : 'bg-red-700'} w-3 h-3 rounded-sm sm:w-4 sm:h-4"
						></div>
						<div>{response}</div>
					</div>
				{/each}
				{#if !isComplete}
					<div class="p-2 border rounded h-7 sm:h-8 mb-2 flex items-center gap-2 border-slate-200">
						<div></div>
					</div>
				{/if}
			</div>
		</div>
	</form>
{/key}

{#if form?.message}
	<p class="text-christmasRed">{@html form.message}</p>
{/if}
