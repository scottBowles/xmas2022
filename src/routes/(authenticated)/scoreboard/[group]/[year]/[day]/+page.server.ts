import { descend, pick, sort } from 'ramda';
import { numScoreboardStats } from '$lib/prisma/models/challengeSet';
import { HIDDEN_USER_EMAILS } from '../../../utils';

export const load = async ({ locals, params, parent }) => {
	const { day } = params;
	const { playerScores, days, users, challengeSetsByDate } = await parent();

	const playerFilter = (player: (typeof users)[number]) => {
		if (locals?.user?.isAdmin) return true;
		return !HIDDEN_USER_EMAILS.includes(player.email) || player.id === locals?.user?.id;
	};

	const dayShown = days[day ? parseInt(day, 10) : 0];

	const challengeSets = sort(descend(numScoreboardStats), challengeSetsByDate[dayShown] ?? []);

	const getDayShownScore = (player: (typeof users)[number]) =>
		challengeSets.reduce((acc, cur) => {
			const mainPoints = playerScores[player.id]?.[cur.id]?.points ?? 0;
			const bonusPoints = playerScores[player.id]?.[cur.id]?.bonusPoints ?? 0;
			const timeBonusPoints = playerScores[player.id]?.[cur.id]?.timeBonusPoints ?? 0;
			return acc + mainPoints + bonusPoints + timeBonusPoints;
		}, 0);

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

	return { challengeSets, players, dayShown };
};
