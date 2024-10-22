<script lang="ts">
	import { urls } from '$lib/utils';

	interface Props {
		year: string;
		challengeSets: any[];
	}

	let { year, challengeSets }: Props = $props();

	function getStatus(challengeSet: any) {
		const { startedAt, completedAt } = challengeSet.challengeSetResponses?.[0] ?? {};
		if (completedAt) return { class: 'italic', text: '(Complete)' };
		if (startedAt) return { class: 'font-bold', text: '(Started)' };
		return { class: '', text: '' };
	}

	let show = $state(false);
</script>

<h3 class="text-xl mt-4 mb-1">
	<button
		class="text-blue-500 text-lg"
		class:font-bold={show}
		onclick={() => {
			show = !show;
		}}
	>
		{year}
	</button>
</h3>
{#if show}
	<ul class="ml-4">
		{#each challengeSets as challengeSet (challengeSet.id)}
			{@const status = getStatus(challengeSet)}
			<li class="mt-3 mb-1">
				<a
					href={urls.challengeSet(challengeSet.id)}
					class={`${status.class} text-blue-500 text-lg`}
					data-sveltekit-preload-data="hover"
				>
					{challengeSet.title}
					{status.text}
				</a>
			</li>
		{/each}
	</ul>
{/if}
