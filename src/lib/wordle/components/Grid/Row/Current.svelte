<script lang="ts">
	import type { CharValue } from '$lib/wordle/status';
	import { MAX_WORD_LENGTH } from '$lib/wordle/constants/settings';
	import Tile from '../Tile.svelte';

	interface Props {
		guess: CharValue[];
	}

	let { guess }: Props = $props();

	let emptyCells = $derived(Array.from(Array(MAX_WORD_LENGTH - guess.length)));
</script>

<div class="grid grid-cols-5 gap-1">
	{#each guess as letter}
		<Tile {letter} />
	{/each}
	{#each emptyCells as _}
		<Tile />
	{/each}
</div>
