import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';
import { timeTaken } from '$lib/prisma/models/challengeSetResponse';
import { urls } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

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
			const users = cur.users.map((u) => u.user);
			// If the user is me, show all users, otherwise hide me
			const usersFiltered =
				locals?.user?.email === 'shbowles@gmail.com'
					? users
					: users.filter((u) => u.email !== 'shbowles@gmail.com');
			return {
				...acc,
				[cur.name]: usersFiltered
			};
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

	const groupNames = groups.map((g) => g.name);

	return {
		challengeSets,
		playerScoresByGroup,
		playersByGroup,
		groupNames,
		user,
		userScores
	};
};
