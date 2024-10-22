<script lang="ts">
	import type { PageData } from './$types';
	import { offline } from '$lib/prisma/models/challenge/challengeTypeFns';

	interface Props {
		challenge: PageData['challenges'][number];
	}

	let { challenge }: Props = $props();
	let points = $derived(offline.scoreChallenge(challenge, { elfNameChallengeResponse: null }));
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<p class="mb-3 text-lg">{@html challenge.prompt}</p>
{#if points}
	<p class="mb-4 text-lg text-green-700 italic">
		You received {points} points!
	</p>
{:else}
	<p class="mb-4 text-lg italic">You haven't received points for this challenge</p>
{/if}
