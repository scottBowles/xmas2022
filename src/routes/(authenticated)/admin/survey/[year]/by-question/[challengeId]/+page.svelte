<script lang="ts">
	import { displayName } from '$lib/prisma/models/user.js';

	let { data } = $props();

	let { challenge } = $derived(data);
</script>

{#if challenge}
	<div class="my-2">
		<div>Prompt</div>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div>{@html challenge.prompt}</div>
	</div>
	{#if challenge?.responses}
		{#each challenge?.responses as response (response.id)}
			<div class="mb-4">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<h3 class="font-bold">{displayName(response.player)}</h3>
				<p>{response.response}</p>
			</div>
		{/each}
	{:else}
		<p class="text-lg mt-3 mb-1">No responses found.</p>
	{/if}
{:else}
	<p class="text-lg mt-3 mb-1">Challenge not found.</p>
{/if}
