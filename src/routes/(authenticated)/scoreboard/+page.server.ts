import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';
import { timeTaken } from '$lib/prisma/models/challengeSetResponse';

export const load: PageServerLoad = async () => {
	const now = new Date();

	const [challengeSets, players] = await Promise.all([
		prisma.challengeSet.findMany({
			where: { timeAvailableStart: { lte: now } },
			select: {
				id: true,
				title: true,
				timeAvailableStart: true,
				isTimed: true,
				isScored: true,
				challenges: { select: { id: true }, orderBy: { id: 'asc' } }
			}
		}),
		prisma.user.findMany({
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				challengeSetResponses: {
					where: {
						startedAt: { not: null },
						completedAt: { not: null }
					}
				}
			}
		})
	]);

	type PlayerStats = { time: number | null; points: number | undefined };
	const playerScores = players.reduce(
		(acc, player) => ({
			...acc,
			[player.id]: player.challengeSetResponses.reduce(
				(acc, csr) => ({
					...acc,
					[csr.challengeSetId]: { time: timeTaken(csr), points: csr.points }
				}),
				{} as { [challengeSetId: number]: PlayerStats }
			)
		}),
		{} as { [playerId: number]: { [challengeSetId: number]: PlayerStats } }
	);

	return {
		challengeSets,
		players,
		playerScores
	};
};
