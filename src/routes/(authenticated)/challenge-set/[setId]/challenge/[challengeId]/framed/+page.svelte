<script lang="ts">
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from '../constants';
	import Img from './Img.svelte';

	let { data, form } = $props();

	let { challenge, setHasAnotherChallenge, responses } = $derived(data);
	let isComplete = $derived(responses.length === 6 || responses.some((r) => r.isCorrect));

	// if the user selects an image through the image nav, this holds that state
	let selectedImageIndex = $state<number | null>(null);

	// this is the image the user selected, or the last image if they haven't selected one
	let displayedImageIndex = $derived(selectedImageIndex ?? challenge.cldImages.length - 1);
	let displayedImage = $derived(challenge.cldImages[displayedImageIndex]);

	let textInput: HTMLInputElement | undefined = $state();

	let response = $state('');
</script>

<div class="mb-32">
	<form
		class="flex flex-col justify-between grow sm:justify-start"
		method="POST"
		use:enhance={() =>
			async ({ update }) => {
				await update();
				await tick();
				response = '';
				selectedImageIndex = challenge.cldImages.length - 1;
			}}
	>
		<fieldset class="flex flex-col mt-4">
			<!-- PROMPT -->
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<legend class="mb-4 text-lg">
				{@html challenge.prompt}
			</legend>

			{#if challenge.cldImages?.length === 0}
				<p class="text-center text-lg">Image not found</p>
			{:else}
				<!-- IMAGE -->
				{@const { publicId, alt } = displayedImage}
				<Img {publicId} alt={alt ?? `Image to guess the movie for ${challenge.title}`} />

				<!-- IMAGE NAV -->
				<div class="flex justify-center w-full mb-2 mt-1 text-white gap-1">
					{#each challenge.cldImages as _, i}
						<button
							class={`border-slate-700 py-[2px] sm:text-xl flex-grow ${displayedImageIndex === i ? 'bg-slate-900' : 'bg-slate-400 hover:bg-slate-500'}`}
							disabled={displayedImageIndex === i}
							onclick={() => (selectedImageIndex = i)}>{i + 1}</button
						>
					{/each}
				</div>
			{/if}

			<!-- RESPONSE INPUT -->
			<!-- svelte-ignore a11y_autofocus -->
			<input
				type="text"
				name="answer"
				bind:value={response}
				bind:this={textInput}
				class="text-green-700 border-2 border-green-700 rounded focus:border-green-700 focus:outline-none w-full p-2"
				autofocus
				required
			/>
		</fieldset>

		<!-- SUBMIT BUTTON -->
		<input
			type="submit"
			value={setHasAnotherChallenge ? NEXT_INPUT_VALUE : SUBMIT_INPUT_VALUE}
			name="submit_action"
			class="bg-green-700 text-white font-bold py-3 px-6 rounded w-full text-lg my-8 block"
			disabled={!response || isComplete}
		/>

		<!-- RESPONSES LIST -->
		<div class="flex flex-col">
			<div class="overflow-y-auto text-sm max-h-32 sm:max-h-full sm:text-base">
				{#each responses as { response, isCorrect }}
					<div class="p-2 border rounded h-7 sm:h-8 mb-2 flex items-center gap-2 border-slate-500">
						<div
							class="{isCorrect ? 'bg-green-700' : 'bg-red-700'} w-3 h-3 rounded-sm sm:w-4 sm:h-4"
						></div>
						<div>{response}</div>
					</div>
				{/each}
				{#if !isComplete && responses.length > 0}
					<div class="p-2 border rounded h-7 sm:h-8 mb-2 flex items-center gap-2 border-slate-200">
						<div></div>
					</div>
				{/if}
			</div>
		</div>
	</form>

	<!-- FORM ERROR MESSAGE -->
	{#if form?.message}
		<p class="text-christmasRed">{@html form.message}</p>
	{/if}
</div>
