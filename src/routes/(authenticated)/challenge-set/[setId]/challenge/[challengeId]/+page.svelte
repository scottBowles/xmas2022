<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { PageData, ActionData } from './$types';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from './constants';

	export let data: PageData;
	export let form: ActionData;

	$: ({ challenge, challengeSet } = data);
	$: response = challenge?.responses[0]?.response ?? '';

	let textInput: HTMLInputElement;
	let showInstructions = false;
	let confirmSubmit = challenge?.isLast; // Didn't do this for most last time. Could remove it.
	let confirming = false;

	onMount(() => textInput?.focus());

	function toggleInstructions() {
		showInstructions = !showInstructions;
	}
</script>

<div class="challenge-container flex flex-col">
	<h1 class="text-4xl mt-4 mb-1">{challenge.title.split(': ')[1] || challenge.title}</h1>
	{#if showInstructions}
		<p
			on:click={toggleInstructions}
			on:keydown={toggleInstructions}
			class="italic text-blue-400 cursor-pointer"
		>
			<i class="fas fa-caret-up" /> Hide Instructions
		</p>

		<p class="italic text-green-700">{@html challengeSet.instructions}</p>
	{:else}
		<p
			on:click={toggleInstructions}
			on:keydown={toggleInstructions}
			class="italic text-blue-400 cursor-pointer"
		>
			<i class="fas fa-caret-down" /> Review Instructions
		</p>
	{/if}
	<form class="flex flex-col justify-between sm:justify-start" method="POST" use:enhance>
		<fieldset class="flex flex-col mt-4">
			<legend class="mb-4 text-lg">{@html challenge.prompt}</legend>
			{#if challenge.options.length > 0}
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
		{#if confirmSubmit}
			{#if confirming}
				<p>Are you sure?</p>
				<div class="flex justify-between">
					<input
						type="button"
						on:click={() => (confirming = false)}
						value="No"
						disabled={!response}
						class="bg-green-700 text-white font-bold py-3 px-6 rounded w-5/12 text-lg my-8 block"
					/>
					<input
						type="submit"
						value="Submit"
						disabled={!response}
						class="bg-green-700 text-white font-bold py-3 px-6 rounded w-5/12 text-lg my-8 block"
					/>
				</div>
			{:else}
				<input
					type="button"
					name="submit_action"
					on:click={() => (confirming = true)}
					value={challenge.isLast ? SUBMIT_INPUT_VALUE : NEXT_INPUT_VALUE}
					disabled={!response}
					class="bg-green-700 text-white font-bold py-3 px-6 rounded w-full text-lg my-8 block"
				/>
			{/if}
		{:else}
			<input
				type="submit"
				value={challenge.isLast ? SUBMIT_INPUT_VALUE : NEXT_INPUT_VALUE}
				name="submit_action"
				class="bg-green-700 text-white font-bold py-3 px-6 rounded w-full text-lg my-8 block"
			/>
		{/if}
		{#if form?.message}
			<p class="text-christmas-red">{@html form.message}</p>
		{/if}
	</form>
</div>

<style>
	.challenge-container {
		height: calc(100% - var(--nav-height));
	}

	input[disabled] {
		background-color: #ccc;
		border-color: #ccc;
	}

	form {
		flex-grow: 1;
	}
</style>
