<script lang="ts">
	import { urls } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	const { pastChallengeSetExists, currentChallengeSets, user } = data;
	type TChallengeSet = typeof currentChallengeSets[0];

	function getStatus(challengeSet: TChallengeSet) {
		const { startedAt, completedAt } = challengeSet.challengeSetResponses?.[0] ?? {};
		if (completedAt) return { class: 'complete', text: '(Complete)' };
		if (startedAt) return { class: 'started', text: '(Started)' };
		return { class: '', text: '' };
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<h1 class="text-4xl mt-4 mb-1">Welcome, {user.displayName}!</h1>

<div class="challenge-sets">
	{#if currentChallengeSets?.length > 0}
		<h2 class="text-2xl mt-4 mb-1">Today's Challenges</h2>
		{#each currentChallengeSets as challengeSet (challengeSet.id)}
			{@const status = getStatus(challengeSet)}
			<span class="mt-3 mb-1">
				<a
					href={urls.challengeSet(challengeSet.id)}
					class={`${status.class} text-blue-500 text-lg`}
				>
					{challengeSet.title}
					{status.text}
				</a>
			</span>
		{/each}
	{:else if pastChallengeSetExists}
		<p class="text-lg mt-3 mb-1">No challenge sets are available at the moment.</p>
		<!-- <p class="text-lg mt-3 mb-1">
	Check out the <a href={"/scoreboard/"} class="text-lg text-blue-500">scoreboard</a>?
	</p> -->
	{:else}
		<p>No challenge sets yet. Coming soon!</p>
	{/if}
</div>

<style>
	.challenge-sets {
		display: flex;
		flex-direction: column;
	}

	.started {
		font-weight: bold;
	}

	.complete {
		font-style: italic;
	}
</style>
