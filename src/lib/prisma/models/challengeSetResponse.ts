import prisma from '$lib/prisma';
import { getNow } from '$lib/utils';
import CHLG from './challenge';

const isLive = (challengeSetResponse: { startedAt: Date | null; completedAt: Date | null }) =>
	challengeSetResponse.startedAt &&
	challengeSetResponse.startedAt <= getNow() &&
	!challengeSetResponse.completedAt;

const timeTaken = (challengeSetResponse: { startedAt: Date | null; completedAt: Date | null }) =>
	challengeSetResponse.completedAt &&
	challengeSetResponse.startedAt &&
	challengeSetResponse.completedAt.getTime() - challengeSetResponse.startedAt.getTime();

const endAndScore = async <CS extends { id: number; completionPoints: number }>(
	challengeSet: CS,
	playerId: number,
	challengeSetResponseId: number
) => {
	const completedAt = getNow();

	const [challenges, elfNameChallengeResponse] = await Promise.all([
		prisma.challenge.findMany({
			where: { challengeSetId: challengeSet.id },
			include: {
				options: true,
				responses: {
					where: { playerId },
				},
				challengeSet: {
					select: { timeAvailableStart: true, timeAvailableEnd: true },
				},
			},
		}),
		prisma.challengeResponse.findFirst({
			where: { playerId, challenge: { type: 'SELECT_ELF_NAME' } },
			orderBy: { createdAt: 'desc' },
		}),
	]);

	const challengePoints = CHLG.scoreChallenges(challenges, { elfNameChallengeResponse });
	const completionPoints = challengeSet.completionPoints;
	const points = challengePoints + completionPoints;

	return prisma.challengeSetResponse.update({
		where: { id: challengeSetResponseId },
		data: { completedAt, points },
	});
};

const CSR = { isLive, timeTaken, endAndScore };

export default CSR;
