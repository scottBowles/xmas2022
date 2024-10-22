<script lang="ts">
	import type { CharStatus, CharValue } from '$lib/wordle/status';
	import { CELL_ANIMATION_DELAY } from '$lib/wordle/constants/settings';
	import Tile from '../Tile.svelte';

	interface Props {
		guess: CharValue[];
		statuses: CharStatus[];
	}

	let { guess, statuses }: Props = $props();
</script>

<div class="grid grid-cols-5 gap-1">
	{#each guess as letter, i (`${letter}${statuses[i]}${i}`)}
		<Tile {letter} status={statuses[i]} delay={i * CELL_ANIMATION_DELAY} />
	{/each}
</div>
