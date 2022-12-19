<script lang="ts">
	import FaPercentage from 'svelte-icons/fa/FaPercentage.svelte';
	import FaRegClock from 'svelte-icons/fa/FaRegClock.svelte';
	import FaHashtag from 'svelte-icons/fa/FaHashtag.svelte';
	import PageMargin from '$lib/components/PageMargin.svelte';
	import { dateToYYYYMMDD, formatDuration, urls } from '$lib/utils';
	import type { PageData } from './$types';
	import { groupBy, pipe, filter, prop, sort, descend, isEmpty } from 'ramda';
	import { displayName } from '$lib/prisma/models/user';
	import { numScoreboardStats } from '$lib/prisma/models/challengeSet';

	export let data: PageData;

	const { challengeSets, playersByGroup, playerScoresByGroup, groupNames, user, userScores } = data;

	let groupShown = groupNames[0];

	$: players = playersByGroup[groupShown];
	$: playerScores = playerScoresByGroup[groupShown];

	const emptyPlayerStats = { time: null, points: null };

	const getDayScore = (
		cSets: typeof challengeSets,
		pScores: typeof playerScoresByGroup[string],
		p: typeof playersByGroup[string][number]
	) => cSets.reduce((acc, cur) => acc + (pScores[p.id]?.[cur.id]?.points ?? 0), 0);

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
	$: dayChallengeSets = sort(
		descend(numScoreboardStats),
		challengeSetsByDate[days[dayShown]] ?? []
	);
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

<!-- add a select to allow a user to select among their groupNames -->
{#if isEmpty(groupNames)}
	<div class="flex justify-center items-center mt-4">
		<h3 class="text-green-700 italic">
			Join or create a group <a href={urls.settings()} class="text-christmasRed hover:underline"
				>here</a
			> to share a scoreboard with your friends!
		</h3>
	</div>
{:else}
	<div class="flex justify-evenly w-full h-10 mt-4">
		<select class="text-lg text-green-800" bind:value={groupShown}>
			{#each groupNames as groupName}
				<option value={groupName}>{groupName}</option>
			{/each}
		</select>
	</div>
{/if}

<PageMargin>
	<div class="flex flex-col items-center mt-4">
		<!-- <h1 class="text-christmasRed text-2xl">Merry Christmas!</h1>
		<h3 class="text-green-800 text-lg mb-4">Thanks for playing!</h3> -->
		{#if dayChallengeSets.length}
			<table class="w-full overflow-x-auto">
				<thead>
					<tr>
						<th />
						{#each dayChallengeSets as challengeSet}
							<th colspan={numScoreboardStats(challengeSet)}>
								{challengeSet.title}
							</th>
						{/each}

						<th>
							<div>Total</div>
						</th>
					</tr>
					<tr class="row">
						<th />
						{#each dayChallengeSets as challengeSet}
							{#if challengeSet.isTimed}
								<th class="odd:text-green-700 even:text-christmasRed">
									<div class="flex justify-center items-center">
										<div class="h-5 w-5">
											<FaRegClock />
										</div>
									</div>
								</th>
							{/if}
							{#if challengeSet.isScored}
								<th class="odd:text-green-700 even:text-christmasRed">
									<div class="flex justify-center items-center">
										<div class="h-5 w-5">
											<FaHashtag />
										</div>
									</div>
								</th>
							{/if}
						{/each}
						<th class="odd:text-green-700 even:text-christmasRed">
							<div class="flex justify-center items-center">
								<div class="h-5 w-5">
									<FaPercentage />
								</div>
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					{#if groupNames.length}
						{#each players as player, idx}
							<tr>
								<td class={idx % 2 ? 'text-christmasRed' : 'text-green-700'}>
									{displayName(player)}
								</td>
								{#each dayChallengeSets as challenge}
									{@const { time, points } = playerScores[player.id]?.[challenge.id] || {}}
									{#if challenge.isTimed}
										<td>{time ? formatDuration(time, false) : '–'}</td>
									{/if}
									{#if challenge.isScored}
										<td>{points ?? '–'}</td>
									{/if}
								{/each}
								<td>
									{getDayScore(dayChallengeSets, playerScores, player)}
								</td>
							</tr>
						{/each}
					{:else if user}
						<tr>
							<td class={'text-green-700'}>
								{displayName(user)}
							</td>
							{#each dayChallengeSets as challenge}
								{@const { time, points } =
									(!isEmpty(userScores) && userScores && userScores[challenge.id]) ||
									emptyPlayerStats}
								{#if challenge.isTimed}
									<td>{time ? formatDuration(time, false) : '–'}</td>
								{/if}
								{#if challenge.isScored}
									<td>{points ?? '–'}</td>
								{/if}
							{/each}
							<td>
								{dayChallengeSets.reduce(
									(acc, cur) => acc + (userScores?.[cur.id]?.points ?? 0),
									0
								)}
							</td>
						</tr>
					{:else}
						Data isn't loading. Something might be wrong here!
					{/if}
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

	.loader {
		top: calc(var(--nav-height));
		height: 2px;
	}
</style>
