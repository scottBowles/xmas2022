<script lang="ts">
	import { capitalize } from '$lib/utils';

	export let challenge: {
		title: string;
		type: string;
		prompt: string;
		options: { text: string }[];
		response: string;
		correctAnswer: string | false | undefined;
		responseIsCorrect: boolean;
		points: number;
	};
</script>

<form>
	<fieldset disabled>
		<p class="mb-3 text-lg">{@html challenge.prompt}</p>
		{#if challenge.options.length > 0}
			{#each challenge.options as option}
				<label class="flex-auto block">
					<input
						type="radio"
						name={challenge.title}
						value={option.text}
						checked={challenge.response === option.text}
						class="mr-1 md:mr-2"
					/>
					{option.text}
				</label>
			{/each}
		{:else}
			<input type="text" value={challenge.response ?? ''} class="border rounded px-2" />
		{/if}
	</fieldset>
	<p class="my-2">
		Correct Answer: {capitalize(
			challenge.correctAnswer || 'No correct answer (something went wrong here better tell Scott)'
		)}
	</p>
	<p class="my-2">
		{challenge.responseIsCorrect ? challenge.points : 0} / {challenge.points} points
	</p>
	{#if challenge.responseIsCorrect}
		<p class="mb-4 text-lg text-green-700 italic">Correct!</p>
	{:else}
		<p class="incorrect mb-4 text-lg italic">Incorrect!</p>
	{/if}
</form>

<style>
	.incorrect {
		color: var(--red);
	}
</style>
