<script lang="ts">
	import type { PageData } from './$types';
	import * as offline from '$lib/prisma/models/challenge/offline';

	export let challenge: PageData['challenges'][number];
	$: points = offline.scoreChallenge(challenge, { elfNameChallengeResponse: null });
</script>

<p class="mb-3 text-lg">{@html challenge.prompt}</p>
{#if points}
	<p class="mb-4 text-lg text-green-700 italic">
		You received {points} points!
	</p>
{:else}
	<p class="mb-4 text-lg italic">You haven't received points for this challenge</p>
{/if}
