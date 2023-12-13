<script lang="ts">
	import { isEmpty } from 'ramda';

	export let days: string[];
	export let dayShown: string;
	export let onDayChange: (e: Event) => void;
</script>

{#if isEmpty(days)}
	<div class="flex justify-center items-center mt-1">
		<h3 class="text-green-700 italic">Nothing yet for this day!</h3>
	</div>
{:else}
	<div class="flex justify-evenly h-10 mt-1">
		<select class="text-lg text-green-800" on:change={onDayChange}>
			{#each days as dayOption}
				<option value={dayOption} selected={dayOption === dayShown}>
					{dayOption === 'total' ? 'Total' : `Day ${days.indexOf(dayOption) + 1}`}
				</option>
			{/each}
			<option value="total" selected={dayShown === 'total'}> Total </option>
		</select>
	</div>
{/if}
