<script lang="ts">
	import { urls } from '$lib/utils';

	interface Props {
		group: string;
		year: string;
		days: string[];
		dayShown: string;
	}

	let {
		group,
		year,
		days,
		dayShown
	}: Props = $props();
</script>

<div class="days flex justify-evenly w-full h-10">
	{#each days as day, idx}
		<a
			class={`flex justify-center items-end border-b border-solid text-lg ${
				day === dayShown ? 'text-green-800 border-green-800' : 'text-green-400 border-green-400'
			} hover:text-green-800 hover:border-green-800 cursor-pointer`}
			href={urls.scoreboard(group, year, days.indexOf(day))}
			data-sveltekit-preload-data="hover"
		>
			Day {idx + 1}
		</a>
	{/each}
	<a
		class={`flex justify-center items-end border-b border-solid text-lg ${
			dayShown === 'total' ? 'text-green-800 border-green-800' : 'text-green-400 border-green-400'
		} hover:text-green-800 hover:border-green-800 cursor-pointer`}
		href={urls.scoreboard(group, year, 'total')}
		data-sveltekit-preload-data="hover"
	>
		Total
	</a>
</div>
