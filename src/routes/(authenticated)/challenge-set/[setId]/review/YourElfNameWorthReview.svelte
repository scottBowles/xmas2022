<script lang="ts">
	import type { PageData } from './$types';

	export let challenge: PageData['challenges'][number];
</script>

<form>
	<fieldset disabled>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<p class="mb-3 text-lg">{@html challenge.prompt}</p>
		<p class="mb-3 text-lg">
			Your elf name is {challenge.ownElfName}
		</p>
		<p class="mb-3 text-lg">
			Your elf name is worth {challenge.correctAnswer} points
		</p>

		You entered:
		<input type="text" value={challenge.response ?? ''} class="border rounded px-2" />
	</fieldset>
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
