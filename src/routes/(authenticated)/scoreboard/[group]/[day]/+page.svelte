<script lang="ts">
	import FaPercentage from 'svelte-icons/fa/FaPercentage.svelte';
	import FaRegClock from 'svelte-icons/fa/FaRegClock.svelte';
	import FaHashtag from 'svelte-icons/fa/FaHashtag.svelte';
	import PageMargin from '$lib/components/PageMargin.svelte';
	import { formatDuration, urls } from '$lib/utils';
	import type { PageData } from './$types';
	import { displayName } from '$lib/prisma/models/user';
	import { numScoreboardStats } from '$lib/prisma/models/challengeSet';
	import { goto } from '$app/navigation';
	import DayNavigation from '../../DayNavigation.svelte';
	import GroupSelect from '../../GroupSelect.svelte';

	export let data: PageData;

	$: ({ challengeSets, playerScores, players, groupNames, group, days, dayShown } = data);

	const onGroupChange = (e: any) => {
		const groupName = e.target.value;
		goto(urls.scoreboard(groupName, days.indexOf(dayShown)));
	};

	const getDayShownScore = (player: typeof players[number]) =>
		challengeSets.reduce((acc, cur) => acc + (playerScores[player.id]?.[cur.id]?.points ?? 0), 0);
</script>

<!-- CHALLENGE DAY NAVIGATION -->
<DayNavigation {group} {days} {dayShown} />

<!-- GROUP SELECT -->
<GroupSelect {groupNames} {onGroupChange} />

<!-- SCORES TABLE -->
<PageMargin>
	<div class="flex flex-col items-center mt-4">
		<!-- <h1 class="text-christmasRed text-2xl">Merry Christmas!</h1>
		<h3 class="text-green-800 text-lg mb-4">Thanks for playing!</h3> -->
		{#if challengeSets.length}
			<table class="w-full overflow-x-auto">
				<thead>
					<tr>
						<th />
						{#each challengeSets as challengeSet}
							<th colspan={numScoreboardStats(challengeSet)}>
								{challengeSet.title}
							</th>
						{/each}

						<th>
							<div>Today</div>
						</th>
					</tr>
					<tr class="row">
						<th />
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
					{#if players.length > 0}
						{#each players as player, idx}
							<tr>
								<td class={idx % 2 ? 'text-christmasRed' : 'text-green-700'}>
									{displayName(player)}
								</td>
								{#each challengeSets as challenge}
									{@const { time, points } = playerScores[player.id]?.[challenge.id] || {}}
									{#if challenge.isTimed}
										<td>{time ? formatDuration(time, false) : '???'}</td>
									{/if}
									{#if challenge.isScored}
										<td>{points ?? '???'}</td>
									{/if}
								{/each}
								<td>
									{getDayShownScore(player)}
								</td>
							</tr>
						{/each}
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
