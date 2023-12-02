import prisma from '$lib/prisma';
import { timeTaken } from '$lib/prisma/models/challengeSetResponse';
import { dateToYYYYMMDD, truthy, urls } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import { filter, groupBy, pipe, prop, uniq } from 'ramda';

export const load = async ({ locals, params }) => {
	const { group: _group, year } = params;
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
					},
					select: {
						points: true,
						startedAt: true,
						completedAt: true,
						challengeSet: {
							select: {
								isScored: true,
								isTimed: true
							}
						},
						challengeSetId: true
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

	const years = uniq(
		allChallengeSetResponses
			.map((cs) => cs.startedAt?.getFullYear())
			.filter(truthy)
			.sort((a, b) => b - a)
	);

	return {
		playerScores,
		groupNames,
		group,
		years,
		year,
		days,
		users,
		challengeSetsByDate
	};
};
