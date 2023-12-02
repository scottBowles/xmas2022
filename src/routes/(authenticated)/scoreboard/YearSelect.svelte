<script lang="ts">
	import { isEmpty } from 'ramda';

	export let onYearChange: (e: Event) => void;
	export let years: number[];
	export let year: string;
	$: console.log({ years, year });
</script>

{#if isEmpty(years)}
	<div class="flex justify-center items-center mt-1">
		<h3 class="text-green-700 italic">No scoreboard data available for this group</h3>
	</div>
{:else}
	<div class="flex justify-evenly h-10 mt-1">
		<select class="text-lg text-green-800" on:change={onYearChange}>
			{#each [...years, 2222] as yearOption}
				<option value={yearOption} selected={yearOption === Number(year)}>
					{yearOption}
				</option>
			{/each}
		</select>
	</div>
{/if}
