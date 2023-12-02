import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';
import { timeTaken } from '$lib/prisma/models/challengeSetResponse';
import { dateToYYYYMMDD, truthy, urls } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import { descend, filter, groupBy, pick, pipe, prop, sort, uniq } from 'ramda';
import { numScoreboardStats } from '$lib/prisma/models/challengeSet';
import { HIDDEN_USER_EMAILS } from '../../../utils';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { group: _group, year, day } = params;
	const group = decodeURIComponent(_group);
	const userId = locals.user?.id;
	const now = new Date();

	if (!userId) throw redirect(302, urls.login());

	/** QUERY SNIPPETS **/

	// if this isn't a group but is just the page for a single user, the players should include just that user
	// otherwise, we need to get all the users in the group
	const userIsInGroup =
		group === 'user' ? { id: userId } : { groups: { some: { group: { name: group } } } };
	const isTimeWithinYear = {
		not: null,
		gte: new Date(`${year}-01-01`),
		lte: locals.user?.isAdmin
			? new Date(`${year}-12-31`)
			: now.getTime() < new Date(`${year}-12-31`).getTime()
			? now
			: new Date(`${year}-12-31`)
	};
	const userHasCompletedChallengeSetThisYear = {
		challengeSetResponses: { some: { completedAt: isTimeWithinYear } }
	};

	/** QUERY **/
	const [challengeSetsInYear, groups, users, allChallengeSetResponses] = await Promise.all([
		prisma.challengeSet.findMany({
			where: { timeAvailableStart: isTimeWithinYear },
			select: {
				id: true,
				title: true,
				timeAvailableStart: true,
				isTimed: true,
				isScored: true,
				challenges: { select: { id: true }, orderBy: { id: 'asc' } }
			}
		}),
		prisma.group.findMany({
			where: { users: { some: { user: { id: userId } } } },
			select: {
				name: true,
				id: true
			}
		}),
		prisma.user.findMany({
			where: {
				...userIsInGroup,
				...userHasCompletedChallengeSetThisYear
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				username: true,
				email: true,
				challengeSetResponses: {
					where: {
						startedAt: isTimeWithinYear,
						completedAt: { not: null }
					}
				}
			}
		}),
		prisma.challengeSetResponse.findMany({
			where: { player: userIsInGroup, completedAt: { not: null } },
			select: { startedAt: true }
		})
	]);

	// if the user is not in this group, we need to deny entry
	if (group !== 'user' && !groups.map((g) => g.name).includes(group)) {
		throw redirect(302, urls.scoreboard());
	}

	type PlayerStats = { time: number | null; points: number | undefined };
	const playerScores = users.reduce(
		(acc, user) => ({
			...acc,
			[user.id]: user.challengeSetResponses.reduce(
				(acc, csr) => ({
					...acc,
					[csr.challengeSetId]: { time: timeTaken(csr), points: csr.points }
				}),
				{} as { [challengeSetId: number]: PlayerStats }
			)
		}),
		{} as { [playerId: number]: { [challengeSetId: number]: PlayerStats } }
	);

	const playerFilter = (player: (typeof users)[number]) => {
		if (locals?.user?.isAdmin) return true;
		return !HIDDEN_USER_EMAILS.includes(player.email) || player.id === locals?.user?.id;
	};

	const groupByDate = groupBy((set: (typeof challengeSetsInYear)[number]) => {
		if (!set.timeAvailableStart) return 'Invalid Date';
		const date = new Date(set.timeAvailableStart);
		if (isNaN(date.getTime())) return 'Invalid Date';
		return dateToYYYYMMDD(date);
	});

	const challengeSetsByDate = pipe(
		filter(pipe(prop('timeAvailableStart'), Boolean)),
		groupByDate
	)(challengeSetsInYear);

	const groupNames = groups.map((g) => g.name);

	const days = Object.keys(challengeSetsByDate)
		.sort((a, b) => {
			if (a === 'Invalid Date') return 1;
			if (b === 'Invalid Date') return -1;
			return a > b ? 1 : -1;
		})
		// filter out dates that are invalid or before 02/01/2023 just for now
		.filter((d) => d === 'Invalid Date' || new Date(d) < new Date('2023-02-01'));

	const dayShown = days[day ? parseInt(day, 10) : 0];

	const challengeSets = sort(descend(numScoreboardStats), challengeSetsByDate[dayShown] ?? []);

	const getDayShownScore = (player: (typeof users)[number]) =>
		challengeSets.reduce((acc, cur) => acc + (playerScores[player.id]?.[cur.id]?.points ?? 0), 0);

	const players: {
		id: number;
		firstName: string | null;
		lastName: string | null;
		username: string | null;
		email: string;
	}[] = users
		.filter(playerFilter)
		.sort((a, b) => {
			const aScore = getDayShownScore(a);
			const bScore = getDayShownScore(b);
			if (aScore === bScore) {
				const aTime = challengeSets
					.filter((cs) => cs.isTimed)
					.reduce((acc, cur) => acc + (playerScores[a.id]?.[cur.id]?.time ?? 0), 0);
				const bTime = challengeSets
					.filter((cs) => cs.isTimed)
					.reduce((acc, cur) => acc + (playerScores[b.id]?.[cur.id]?.time ?? 0), 0);
				return aTime - bTime;
			}
			return bScore - aScore;
		})
		.map(pick(['id', 'firstName', 'lastName', 'username', 'email']));

	const years = uniq(
		allChallengeSetResponses
			.map((cs) => cs.startedAt?.getFullYear())
			.filter(truthy)
			.sort((a, b) => b - a)
	);

	return {
		challengeSets,
		playerScores,
		players,
		groupNames,
		group,
		years,
		year,
		days,
		dayShown
	};
};
