<script lang="ts">
	export let challenge: {
		response: string;
		correctAnswer: string | false | undefined;
	};
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
