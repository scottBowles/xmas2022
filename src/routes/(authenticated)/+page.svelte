<script lang="ts">
	import PageMargin from '$lib/components/PageMargin.svelte';
	import { urls } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	const { pastChallengeSets, currentChallengeSets, futureChallengeSets, user } = data;
	type TChallengeSet = typeof currentChallengeSets[0];

	function getStatus(challengeSet: TChallengeSet) {
		const { startedAt, completedAt } = challengeSet.challengeSetResponses?.[0] ?? {};
		if (completedAt) return { class: 'italic', text: '(Complete)' };
		if (startedAt) return { class: 'font-bold', text: '(Started)' };
		return { class: '', text: '' };
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<PageMargin>
	<h1 class="text-4xl mt-4 mb-1">Welcome, {user.displayName}!</h1>

	<h2 class="text-2xl mt-4 mb-1 text-green-700">Good luck on the final day!</h2>

	<div class="flex flex-col">
		{#if currentChallengeSets?.length > 0 || pastChallengeSets?.length > 0}
			<h2 class="text-2xl mt-4 mb-1">Today's Challenges</h2>
			{#if currentChallengeSets.length === 0}
				<p class="text-lg mt-3 mb-1">No challenges currently available. Check back later!</p>
			{:else}
				{#each currentChallengeSets as challengeSet (challengeSet.id)}
					{@const status = getStatus(challengeSet)}
					<span class="mt-3 mb-1">
						<a
							href={urls.challengeSet(challengeSet.id)}
							class={`${status.class} text-blue-500 text-lg`}
							data-sveltekit-preload-data="hover"
						>
							{challengeSet.title}
							{status.text}
						</a>
					</span>
				{/each}
			{/if}
			{#if pastChallengeSets.length > 0}
				<h2 class="text-2xl mt-16 mb-1">Past Challenges</h2>
				{#each pastChallengeSets as challengeSet (challengeSet.id)}
					{@const status = getStatus(challengeSet)}
					<span class="mt-3 mb-1">
						<a
							href={urls.challengeSet(challengeSet.id)}
							class={`${status.class} text-blue-500 text-lg`}
							data-sveltekit-preload-data="hover"
						>
							{challengeSet.title}
							{status.text}
						</a>
					</span>
				{/each}
			{/if}
			<!-- <p class="text-lg mt-3 mb-1">
	Check out the <a href={"/scoreboard/"} class="text-lg text-blue-500">scoreboard</a>?
	</p> -->
		{:else}
			<p>No challenge sets yet. Coming soon!</p>
		{/if}
	</div>
	{#if futureChallengeSets && futureChallengeSets.length > 0}
		<div class="flex flex-col mt-16">
			<h2 class="text-2xl mb-1">Future Challenges</h2>
			{#each futureChallengeSets as challengeSet (challengeSet.id)}
				{@const status = getStatus(challengeSet)}
				<span class="mt-3 mb-1">
					<a
						href={urls.challengeSet(challengeSet.id)}
						class={`${status.class} text-blue-500 text-lg`}
						data-sveltekit-preload-data="hover"
					>
						{challengeSet.title}
						{status.text}
					</a>
				</span>
			{/each}
		</div>
	{/if}
</PageMargin>
