<script lang="ts">
	import FaRegClock from 'svelte-icons/fa/FaRegClock.svelte';
	import FaHashtag from 'svelte-icons/fa/FaHashtag.svelte';
	import PageMargin from '@/components/PageMargin.svelte';
	import { formatDuration, urls } from '$lib/utils';
	import type { PageData } from './$types';
	import DayNavigation from '../../../DayNavigation.svelte';
	import GroupSelect from '../../../GroupSelect.svelte';
	import { goto } from '$app/navigation';
	import YearSelect from '../../../YearSelect.svelte';
	import DaySelect from '../../../DaySelect.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let { userTotals, group, groupNames, year, years, days } = $derived(data);

	const onGroupChange = (e: Event) => {
		const groupName = (e.target as HTMLSelectElement).value;
		goto(urls.scoreboard(groupName, year, 'total'));
	};

	const onYearChange = (e: Event) => {
		const year = (e.target as HTMLSelectElement).value;
		goto(urls.scoreboard(group, year, 'total'));
	};

	const onDayChange = (e: Event) => {
		const day = (e.target as HTMLSelectElement).value;
		const dayIdx = day === 'total' ? day : days.indexOf(day);
		goto(urls.scoreboard(group, year, dayIdx));
	};
</script>

<!-- GROUP SELECT -->
<GroupSelect {groupNames} {group} {onGroupChange} />

<!-- YEAR SELECT -->
<YearSelect {year} {years} {onYearChange} />

<!-- CHALLENGE DAY NAVIGATION -->
{#if days.length > 10}
	<DaySelect {days} dayShown="total" {onDayChange} />
{:else}
	<DayNavigation {group} {year} {days} dayShown="total" />
{/if}

<!-- SCORES TABLE -->
<PageMargin>
	<div class="flex flex-col items-center mt-4">
		<!-- <h1 class="text-christmasRed text-2xl">Merry Christmas!</h1>
		<h3 class="text-green-800 text-lg mb-4">Thanks for playing!</h3> -->
		<table class="w-full overflow-x-auto">
			<thead>
				<tr>
					<th colspan="3">
						<div class="text-xl uppercase mb-4">Total</div>
					</th>
				</tr>
				<tr class="row">
					<th></th>
					<th class="odd:text-green-700 even:text-christmasRed">
						<div class="flex justify-center items-center">
							<div class="h-5 w-5">
								<FaRegClock />
							</div>
						</div>
					</th>
					<th class="odd:text-green-700 even:text-christmasRed">
						<div class="flex justify-center items-center">
							<div class="h-5 w-5">
								<FaHashtag />
							</div>
						</div>
					</th>
				</tr>
			</thead>
			<tbody>
				{#if userTotals.length > 0}
					{#each userTotals as { display, score, time }, idx}
						<tr>
							<td class={`${idx % 2 ? 'text-christmasRed' : 'text-green-700'} text-nowrap`}>
								{display}
							</td>
							<td>
								{formatDuration(time)}
							</td>
							<td>
								{score}
							</td>
						</tr>
					{/each}
				{:else}
					<tr><td colspan="10"> Data isn't loading. Something might be wrong here! </td></tr>
				{/if}
			</tbody>
		</table>
	</div>
</PageMargin>

<style>
	th,
	td {
		height: 2rem;
		text-align: center;
		vertical-align: middle;
	}
</style>
