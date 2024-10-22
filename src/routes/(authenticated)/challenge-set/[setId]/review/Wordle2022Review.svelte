<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		challenge: PageData['challenges'][number];
	}

	let { challenge }: Props = $props();
</script>

<div class="flex grow flex-col items-center justify-center">
	<p class="text-2xl">
		You got the correct answer in <span class="text-green-700">{challenge.response}</span> guesses.
	</p>
	<p class="text-2xl">The correct word was <span class="red">{challenge.correctAnswer}</span>.</p>
</div>

<style>
	.red {
		color: var(--red);
	}
</style>
