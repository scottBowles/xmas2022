<script lang="ts">
	import PageMargin from '@/components/PageMargin.svelte';
	import InstructionsToggle from './InstructionsToggle.svelte';

	let { data, children } = $props();

	let { challengeSet, challenge } = $derived(data);
</script>

<PageMargin>
	<div class="challenge-container flex flex-col">
		<h1 class="text-4xl mt-4 mb-1">
			{challenge.title.split(': ')[1] || challenge.title}
		</h1>

		<InstructionsToggle instructions={challengeSet.instructions} />

		{@render children?.()}
	</div>
</PageMargin>

<style>
	.challenge-container {
		height: calc(100% - var(--nav-height));
	}
</style>
