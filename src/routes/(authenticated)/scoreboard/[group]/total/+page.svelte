<script lang="ts">
	import FaRegClock from 'svelte-icons/fa/FaRegClock.svelte';
	import FaHashtag from 'svelte-icons/fa/FaHashtag.svelte';
	import PageMargin from '$lib/components/PageMargin.svelte';
	import { formatDuration, urls } from '$lib/utils';
	import type { PageData } from './$types';
	import DayNavigation from '../../DayNavigation.svelte';
	import GroupSelect from '../../GroupSelect.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	$: ({ userTotals, group, groupNames, days } = data);

	const onGroupChange = (e: any) => {
		const groupName = e.target.value;
		goto(urls.scoreboard(groupName, 'total'));
	};
</script>

<!-- CHALLENGE DAY NAVIGATION -->
<DayNavigation {group} {days} dayShown="total" />

<div class="flex flex-col items-center mt-8">
	<h1 class="text-4xl text-green-700">Merry Christmas!</h1>
	<h3 class="text-2xl text-christmasRed">Thanks for playing!</h3>
</div>

<!-- GROUP SELECT -->
<GroupSelect {groupNames} {onGroupChange} />

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
					<th />
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
							<td class={idx % 2 ? 'text-christmasRed' : 'text-green-700'}>
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
					Data isn't loading. Something might be wrong here!
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
