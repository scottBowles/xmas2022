<script lang="ts">
	import type { PageData } from './$types';

	export let challenge: PageData['challenges'][number];
	$: ({ pointsEarned } = challenge.responses[0] || {});
</script>

<p class="mb-3 text-lg">{@html challenge.prompt}</p>
{#if pointsEarned}
	<p class="mb-4 text-lg text-green-700 italic">
		You received {pointsEarned} points!
	</p>
{:else}
	<p class="mb-4 text-lg italic">You haven't received points for this challenge</p>
{/if}
