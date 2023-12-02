import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';
import { timeTaken } from '$lib/prisma/models/challengeSetResponse';
import { dateToYYYYMMDD, urls } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import { displayName } from '$lib/prisma/models/user';
import { filter, groupBy, pipe, prop } from 'ramda';
import { HIDDEN_USER_EMAILS } from '../../../utils';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { group: _group } = params;
	const group = decodeURIComponent(_group);
	const userId = locals.user?.id;
	const now = new Date();

	if (!userId) throw redirect(302, urls.login());

	const [users, groups, allChallengeSets] = await Promise.all([
		prisma.user.findMany({
			where: { groups: { some: { group: { name: group } } } },
			select: {
				id: true,
				firstName: true,
				lastName: true,
				username: true,
				email: true,
				challengeSetResponses: {
					where: {
						startedAt: { not: null },
						// select ones that are completed and were completed before 02/01/2023
						// this is temporary until we have separate scoreboards for each year
						// completedAt: { not: null }
						completedAt: { not: null, lt: new Date('2023-02-01') }
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
						}
					}
				}
			}
		}),
		prisma.group.findMany({
			where: { users: { some: { user: { id: userId } } } },
			select: { name: true }
		}),
		prisma.challengeSet.findMany({
			...(!locals.user?.isAdmin && { where: { timeAvailableStart: { lte: now } } }),
			select: { timeAvailableStart: true }
		})
	]);

	const playerFilter = (player: (typeof users)[number]) => {
		if (locals?.user?.isAdmin) return true;
		return !HIDDEN_USER_EMAILS.includes(player.email) || player.id === locals?.user?.id;
	};

	const userTotals = users
		.filter(playerFilter)
		.map((user) => {
			const display = displayName(user);
			const totalScore = user.challengeSetResponses
				.filter((csr) => csr.challengeSet.isScored)
				.reduce((acc, cur) => acc + cur.points, 0);
			const totalTime = user.challengeSetResponses
				.filter((csr) => csr.challengeSet.isTimed)
				.reduce((acc, cur) => acc + (timeTaken(cur) ?? 0), 0);
			return {
				display,
				score: totalScore,
				time: totalTime
			};
		})
		.sort((a, b) => {
			const { score: aScore, time: aTime } = a;
			const { score: bScore, time: bTime } = b;
			return aScore === bScore ? aTime - bTime : bScore - aScore;
		});

	const groupNames = groups.map((g) => g.name);

	const groupByDate = groupBy((set: (typeof allChallengeSets)[number]) => {
		if (!set.timeAvailableStart) return 'Invalid Date';
		const date = new Date(set.timeAvailableStart);
		if (isNaN(date.getTime())) return 'Invalid Date';
		return dateToYYYYMMDD(date);
	});

	const challengeSetsByDate = pipe(
		filter(pipe(prop('timeAvailableStart'), Boolean)),
		groupByDate
	)(allChallengeSets);

	const days = Object.keys(challengeSetsByDate)
		.sort((a, b) => {
			if (a === 'Invalid Date') return 1;
			if (b === 'Invalid Date') return -1;
			return a > b ? 1 : -1;
		})
		// filter out dates that are invalid or before 02/01/2023 just for now
		.filter((d) => d === 'Invalid Date' || new Date(d) < new Date('2023-02-01'));

	return { userTotals, group, groupNames, days };
};
