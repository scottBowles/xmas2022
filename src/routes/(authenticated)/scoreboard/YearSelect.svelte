<script lang="ts">
	import { isEmpty } from 'ramda';

	interface Props {
		onYearChange: (e: Event) => void;
		years: number[];
		year: string;
	}

	let { onYearChange, years, year }: Props = $props();
</script>

{#if isEmpty(years)}
	<div class="flex justify-center items-center mt-1">
		<h3 class="text-green-700 italic">No scoreboard data available for this group</h3>
	</div>
{:else}
	<div class="flex justify-evenly h-10 mt-1">
		<select class="text-lg text-green-800" onchange={onYearChange}>
			{#each years as yearOption}
				<option value={yearOption} selected={yearOption === Number(year)}>
					{yearOption}
				</option>
			{/each}
		</select>
	</div>
{/if}
