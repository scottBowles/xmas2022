<script lang="ts">
	import FaPercentage from 'svelte-icons/fa/FaPercentage.svelte';
	import FaRegClock from 'svelte-icons/fa/FaRegClock.svelte';
	import PageMargin from '$lib/components/PageMargin.svelte';
	import { dateToYYYYMMDD, formatDuration } from '$lib/utils';
	import type { PageData } from './$types';
	import { groupBy, pipe, filter, prop } from 'ramda';
	import { displayName } from '$lib/prisma/models/user';

	export let data: PageData;

	const { challengeSets, players, playerScores } = data;

	const groupByDate = groupBy((set: typeof challengeSets[number]) => {
		if (!set.timeAvailableStart) return 'Invalid Date';
		const date = new Date(set.timeAvailableStart);
		if (isNaN(date.getTime())) return 'Invalid Date';
		return dateToYYYYMMDD(date);
	});

	const challengeSetsByDate = pipe(
		filter(pipe(prop('timeAvailableStart'), Boolean)),
		groupByDate
	)(challengeSets);
	const days = Object.keys(challengeSetsByDate).sort((a, b) => {
		if (a === 'Invalid Date') return 1;
		if (b === 'Invalid Date') return -1;
		return a > b ? 1 : -1;
	});
	let dayShown =
		dateToYYYYMMDD(new Date()) in challengeSetsByDate
			? days.indexOf(dateToYYYYMMDD(new Date()))
			: days.length - 1;
	$: dayChallengeSets = challengeSetsByDate[days[dayShown]] || [];
</script>

<div class="days flex justify-evenly w-full h-10">
	{#each days as day, idx}
		<div
			class={`flex justify-center items-end border-b border-solid text-lg ${
				dayShown === days.indexOf(day)
					? 'text-green-800 border-green-800'
					: 'text-green-400 border-green-400'
			} hover:text-green-800 hover:border-green-800 cursor-pointer`}
			on:click={() => (dayShown = days.indexOf(day))}
			on:keyup={() => (dayShown = days.indexOf(day))}
		>
			Day {idx + 1}
		</div>
	{/each}
</div>
<PageMargin>
	<div class="content-container flex flex-col items-center">
		<!-- <h1 class="text-christmas-red text-2xl">Merry Christmas!</h1>
		<h3 class="text-green-800 text-lg mb-4">Thanks for playing!</h3> -->
		{#if dayChallengeSets.length}
			<table class="w-full overflow-x-auto">
				<thead>
					<tr>
						<th />
						{#each dayChallengeSets as challengeSet}
							<th colspan="2">{challengeSet.title}</th>
						{/each}
					</tr>
					<tr>
						<th />
						{#each dayChallengeSets as _challengeSet}
							<th>
								<div class="flex justify-center items-center">
									<div class="h-5 w-5 text-christmas-red">
										<FaRegClock />
									</div>
								</div>
							</th>
							<th>
								<div class="flex justify-center items-center">
									<div class="h-5 w-5 text-green-700">
										<FaPercentage />
									</div>
								</div>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each players as player, idx}
						<tr>
							<td class={idx % 2 ? 'text-christmas-red' : 'text-green-700'}>
								{displayName(player)}
							</td>
							{#each dayChallengeSets as challenge}
								{@const { time, percent } = playerScores[player.id]?.[challenge.id] || {}}
								<td>{time ? formatDuration(time, false) : '–'}</td>
								<td>{percent || '–'}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<div class="no-challenges text-center">No challenges for this day yet!</div>
		{/if}
	</div>
</PageMargin>

<style>
	.days {
		top: var(--nav-height);
	}

	.content-container {
		margin-top: calc(var(--nav-height) * 1.25);
	}

	/* table,
    .no-challenges {
      margin-top: calc(var(--nav-height) * 1.5);
    } */

	th,
	td {
		height: 2rem;
		text-align: center;
		vertical-align: middle;
	}

	.text-christmas-red {
		color: var(--red);
	}

	.loader {
		top: calc(var(--nav-height));
		height: 2px;
	}
</style>
