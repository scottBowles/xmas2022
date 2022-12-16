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
				challenges: { select: { id: true } }
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

	type PlayerStats = { time: number | null; percent: number | undefined };
	const playerScores = players.reduce((acc, player) => {
		const statsByChallengeSetId = player.challengeSetResponses.reduce((acc, csr) => {
			const numChallenges = challengeSets.find((cs) => cs.id === csr.challengeSetId)?.challenges
				.length;
			const percent = numChallenges && (csr.numCorrect / numChallenges) * 100;
			return {
				...acc,
				[csr.challengeSetId]: { time: timeTaken(csr), percent }
			};
		}, {} as { [challengeSetId: number]: PlayerStats });

		return {
			...acc,
			[player.id]: statsByChallengeSetId
		};
	}, {} as { [playerId: number]: { [challengeSetId: number]: PlayerStats } });

	return {
		challengeSets,
		players,
		playerScores
	};
};
