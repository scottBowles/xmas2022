import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async (event) => {
	const { user } = await event.parent();
	const now = new Date();

	const startedChallengeSetsPromise = prisma.challengeSet.findMany({
		where: { timeAvailableStart: { lte: now } },
		include: {
			challengeSetResponses: {
				where: { playerId: user.id },
				select: { startedAt: true, completedAt: true }
			}
		}
	});
	const futureChallengeSetsPromise =
		user.isAdmin &&
		prisma.challengeSet.findMany({
			where: { timeAvailableStart: { gt: now } },
			include: {
				challengeSetResponses: {
					where: { playerId: user.id },
					select: { startedAt: true, completedAt: true }
				}
			}
		});

	const [startedChallengeSets, futureChallengeSets] = await Promise.all([
		startedChallengeSetsPromise,
		futureChallengeSetsPromise
	]);

	const currentChallengeSets = startedChallengeSets.filter(
		(set) => !set.timeAvailableEnd || set.timeAvailableEnd > now
	);
	const pastChallengeSetExists = startedChallengeSets.length > currentChallengeSets.length;

	return { currentChallengeSets, pastChallengeSetExists, futureChallengeSets };
};
