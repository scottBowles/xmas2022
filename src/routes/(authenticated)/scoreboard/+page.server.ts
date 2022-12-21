import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';
import { timeTaken } from '$lib/prisma/models/challengeSetResponse';
import { dateToYYYYMMDD, urls } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import { filter, groupBy, pipe, prop } from 'ramda';

const HIDDEN_USER_EMAILS = ['shbowles@gmail.com', 'susansbowles@gmail.com'];

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user?.id;
	const now = new Date();

	if (!userId) throw redirect(302, urls.login());

	const [challengeSets, groups] = await Promise.all([
		prisma.challengeSet.findMany({
			...(!locals.user?.isAdmin && { where: { timeAvailableStart: { lte: now } } }),
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
				users: {
					select: {
						user: {
							select: {
								id: true,
								firstName: true,
								lastName: true,
								username: true,
								email: true,
								challengeSetResponses: {
									where: {
										startedAt: { not: null },
										completedAt: { not: null }
									}
								}
							}
						}
					}
				}
			}
		})
	]);

	// If the user is not in a group, we need to get their data separately
	const user =
		groups.length === 0
			? await prisma.user.findUnique({
					where: { id: userId },
					select: {
						id: true,
						firstName: true,
						lastName: true,
						username: true,
						email: true,
						challengeSetResponses: {
							where: {
								startedAt: { not: null },
								completedAt: { not: null }
							}
						}
					}
			  })
			: null;

	type PlayerStats = { time: number | null; points: number | undefined };
	const playerScoresByGroup = groups.reduce(
		(acc, cur) => ({
			...acc,
			[cur.name]: cur.users.reduce(
				(acc, { user }) => ({
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
			)
		}),
		{} as { [groupName: string]: { [playerId: number]: { [challengeSetId: number]: PlayerStats } } }
	);

	const playersByGroup = groups.reduce(
		(acc, cur) => {
			// Show all users excluding hidden users if the user isn't an admin but include the current user
			const users = cur.users
				.map((u) => u.user)
				.filter((u) => {
					if (locals?.user?.isAdmin) return true;
					return !HIDDEN_USER_EMAILS.includes(u.email) || u.id === locals?.user?.id;
				});
			return { ...acc, [cur.name]: users };
		},
		{} as {
			[groupName: string]: {
				id: number;
				firstName: string | null;
				lastName: string | null;
				username: string | null;
				email: string;
			}[];
		}
	);

	const userScores = user?.challengeSetResponses.reduce(
		(acc, csr) => ({
			...acc,
			[csr.challengeSetId]: { time: timeTaken(csr), points: csr.points }
		}),
		{} as { [challengeSetId: number]: PlayerStats }
	);

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

	const groupNames = groups.map((g) => g.name);

	return {
		challengeSetsByDate,
		playerScoresByGroup,
		playersByGroup,
		groupNames,
		user,
		userScores
	};
};
