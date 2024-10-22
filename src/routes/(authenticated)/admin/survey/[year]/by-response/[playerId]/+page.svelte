<script lang="ts">
	let { data } = $props();

	let { challengesData } = $derived(data);
</script>

{#if challengesData}
	{#each challengesData as { prompt, response }}
		<div class="py-8">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<h3 class="text-sm italic">{@html prompt}</h3>
			<p>{response}</p>
		</div>
		<hr />
	{/each}
{/if}
