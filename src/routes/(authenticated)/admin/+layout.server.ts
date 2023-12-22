import { error } from '@sveltejs/kit';

import prisma from '$lib/prisma';

export const load = async ({ parent }) => {
	const { user } = await parent();

	if (!user.isAdmin) {
		throw error(403, 'Forbidden');
	}

	const surveyChallengeSets = await prisma.challengeSet.findMany({
		where: { title: { contains: 'survey', mode: 'insensitive' } },
	});

	const surveyYears = surveyChallengeSets
		.map((cs) => cs.timeAvailableStart?.getFullYear())
		.filter((year) => year !== undefined) as number[];

	return { surveyYears };
};
