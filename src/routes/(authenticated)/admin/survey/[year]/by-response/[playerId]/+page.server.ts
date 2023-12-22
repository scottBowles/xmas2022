import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';

export const load = async ({ parent, params }) => {
	const { user } = await parent();

	if (!user.isAdmin) {
		throw error(403, 'Forbidden');
	}

	const year = parseInt(params.year);
	const playerId = parseInt(params.playerId);

	const challengeSetResponse = await prisma.challengeSetResponse.findFirst({
		where: {
			// get challengeSetResponses where
			challengeSet: {
				// challengeSet.timeAvailableStart is in the year
				timeAvailableStart: {
					gte: new Date(year, 0, 1),
					lt: new Date(year + 1, 0, 1),
				},
				// "survey" is in the title (case insensitive)
				title: {
					contains: 'survey',
					mode: 'insensitive',
				},
			},
			playerId,
		},
		include: {
			player: true,
			challengeSet: {
				include: {
					challenges: {
						orderBy: {
							id: 'asc',
						},
						include: {
							responses: {
								where: {
									playerId,
								},
							},
						},
					},
				},
			},
		},
	});

	const challengesData = challengeSetResponse?.challengeSet.challenges.map((challenge) => ({
		prompt: challenge.prompt,
		response: challenge.responses[0]?.response,
	}));

	return { challengesData };
};
