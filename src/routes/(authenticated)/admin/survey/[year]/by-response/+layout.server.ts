import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';

export const load = async ({ parent, params }) => {
	const { user } = await parent();

	if (!user.isAdmin) {
		throw error(403, 'Forbidden');
	}

	const year = parseInt(params.year);
	// const surveyResponses = await prisma.challengeSetResponse.findMany({
	// 	where: {
	// 		// get challengeSetResponses where
	// 		challengeSet: {
	// 			// challengeSet.timeAvailableStart is in the year
	// 			timeAvailableStart: {
	// 				gte: new Date(year, 0, 1),
	// 				lt: new Date(year + 1, 0, 1),
	// 			},
	// 			// "survey" is in the title (case insensitive)
	// 			title: {
	// 				contains: 'survey',
	// 				mode: 'insensitive',
	// 			},
	// 		},
	// 	},
	// 	include: { player: true },
	// });

	// return { challengeSetResponses: surveyResponses };
	const playersWithSurveyResponseInYear = await prisma.user.findMany({
		where: {
			challengeSetResponses: {
				some: {
					challengeSet: {
						timeAvailableStart: {
							gte: new Date(year, 0, 1),
							lt: new Date(year + 1, 0, 1),
						},
						title: {
							contains: 'survey',
							mode: 'insensitive',
						},
					},
				},
			},
		},
	});

	return { playersWithSurveyResponseInYear };
};
