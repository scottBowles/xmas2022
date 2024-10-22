<script lang="ts">
	import { isEmpty } from 'ramda';

	interface Props {
		days: string[];
		dayShown: string;
		onDayChange: (e: Event) => void;
	}

	let { days, dayShown, onDayChange }: Props = $props();
</script>

{#if isEmpty(days)}
	<div class="flex justify-center items-center mt-1">
		<h3 class="text-green-700 italic">Nothing yet for this day!</h3>
	</div>
{:else}
	<div class="flex justify-evenly h-10 mt-1">
		<select class="text-lg text-green-800" onchange={onDayChange}>
			{#each days as dayOption}
				<option value={dayOption} selected={dayOption === dayShown}>
					{dayOption === 'total' ? 'Total' : `Day ${days.indexOf(dayOption) + 1}`}
				</option>
			{/each}
			<option value="total" selected={dayShown === 'total'}> Total </option>
		</select>
	</div>
{/if}
