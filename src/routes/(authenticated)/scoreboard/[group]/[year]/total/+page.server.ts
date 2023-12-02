import { timeTaken } from '$lib/prisma/models/challengeSetResponse';
import { displayName } from '$lib/prisma/models/user';
import { HIDDEN_USER_EMAILS } from '../../../utils';

export const load = async ({ locals, parent }) => {
	const { users } = await parent();

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

	return { userTotals };
};
