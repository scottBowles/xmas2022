<script lang="ts">
	export let data;

	$: ({ challengesData } = data);
</script>

{#if challengesData}
	{#each challengesData as { prompt, response }}
		<div class="my-4">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<h3>{@html prompt}</h3>
			<p>{response}</p>
		</div>
	{/each}
{/if}
