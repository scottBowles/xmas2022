<script lang="ts">
	import { goto } from '$app/navigation';
	import PageMargin from '$lib/components/PageMargin.svelte';
	import CS from '$lib/prisma/models/challengeSet';
	import { displayName } from '$lib/prisma/models/user';
	import { formatDuration, urls } from '$lib/utils';
	import FaEquals from 'svelte-icons/fa/FaEquals.svelte';
	import FaHashtag from 'svelte-icons/fa/FaHashtag.svelte';
	import FaPlus from 'svelte-icons/fa/FaPlus.svelte';
	import FaRegClock from 'svelte-icons/fa/FaRegClock.svelte';
	import DayNavigation from '../../../DayNavigation.svelte';
	import DaySelect from '../../../DaySelect.svelte';
	import GroupSelect from '../../../GroupSelect.svelte';
	import YearSelect from '../../../YearSelect.svelte';

	let { data } = $props();

	let { challengeSets, playerScores, players, groupNames, group, years, year, days, dayShown } =
		$derived(data);

	const onGroupChange = (e: Event) => {
		const groupName = (e.target as HTMLSelectElement).value;
		const dayIdx = days.indexOf(dayShown);
		goto(urls.scoreboard(groupName, year, dayIdx === -1 ? 'total' : dayIdx));
	};

	const onYearChange = (e: Event) => {
		const year = (e.target as HTMLSelectElement).value;
		goto(urls.scoreboard(group, year, days.indexOf(dayShown)));
	};

	const onDayChange = (e: Event) => {
		const day = (e.target as HTMLSelectElement).value;
		const dayIdx = day === 'total' ? day : days.indexOf(day);
		goto(urls.scoreboard(group, year, dayIdx));
	};

	const getDayShownScore = (player: (typeof players)[number]) =>
		challengeSets.reduce((acc, cur) => {
			const mainPoints = playerScores[player.id]?.[cur.id]?.points ?? 0;
			const bonusPoints = playerScores[player.id]?.[cur.id]?.bonusPoints ?? 0;
			const timeBonusPoints = playerScores[player.id]?.[cur.id]?.timeBonusPoints ?? 0;
			return acc + mainPoints + bonusPoints + timeBonusPoints;
		}, 0);
</script>

<!-- GROUP SELECT -->
<GroupSelect {group} {groupNames} {onGroupChange} />

<!-- YEAR SELECT -->
<YearSelect {year} {years} {onYearChange} />

<!-- CHALLENGE DAY NAVIGATION -->
{#if days.length > 10}
	<DaySelect {days} {dayShown} {onDayChange} />
{:else}
	<DayNavigation {group} {year} {days} {dayShown} />
{/if}

<!-- SCORES TABLE -->
<PageMargin>
	<div class="flex flex-col items-center mt-4">
		<!-- <h1 class="text-christmasRed text-2xl">Merry Christmas!</h1>
		<h3 class="text-green-800 text-lg mb-4">Thanks for playing!</h3> -->
		{#if challengeSets.length}
			<table class="w-full overflow-x-auto">
				<thead>
					<tr>
						<th></th>

						{#each challengeSets.filter(CS.hasScoreboardStats) as challengeSet}
							<th
								colspan={CS.numScoreboardStats(challengeSet)}
								class="border-x border-solid border-x-green-700"
							>
								{challengeSet.title}
							</th>
						{/each}

						<th>
							<div>Today</div>
						</th>
					</tr>
					<tr class="row">
						<th></th>
						{#each challengeSets as challengeSet}
							{#if challengeSet.isTimed}
								<th class="odd:text-green-700 even:text-christmasRed">
									<div class="flex justify-center items-center">
										<div class="h-5 w-5">
											<FaRegClock />
										</div>
									</div>
								</th>
							{/if}
							{#if challengeSet.hasTimeBonusPoints}
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
							{#if challengeSet.hasBonusPoints}
								<th class="odd:text-green-700 even:text-christmasRed">
									<div class="flex justify-center items-center">
										<div class="h-5 w-5">
											<FaPlus />
										</div>
									</div>
								</th>
							{/if}
						{/each}
						<th class="odd:text-green-700 even:text-christmasRed">
							<div class="flex justify-center items-center">
								<div class="h-5 w-5">
									<FaEquals />
								</div>
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					{#if players.length > 0}
						{#each players as player, idx}
							<tr>
								<td class={idx % 2 ? 'text-christmasRed' : 'text-green-700'}>
									{displayName(player)}
								</td>
								{#each challengeSets as challengeSet}
									{@const { time, points, bonusPoints, timeBonusPoints } =
										playerScores[player.id]?.[challengeSet.id] || {}}
									{#if challengeSet.isTimed}
										<td>{time ? formatDuration(time, false) : '–'}</td>
									{/if}
									{#if challengeSet.hasTimeBonusPoints}
										<td>{timeBonusPoints ?? '–'}</td>
									{/if}
									{#if challengeSet.isScored}
										<td>{points ?? '–'}</td>
									{/if}
									{#if challengeSet.hasBonusPoints}
										<td>{bonusPoints || ''}</td>
									{/if}
								{/each}
								<td>
									{getDayShownScore(player)}
								</td>
							</tr>
						{/each}
					{:else}
						<tr><td colspan="10"> Data isn't loading. Something might be wrong here! </td></tr>
					{/if}
				</tbody>
			</table>
		{:else}
			<div class="no-challenges text-center">No challenges for this day yet!</div>
		{/if}
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
