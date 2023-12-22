import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';

export const load = async ({ parent, params }) => {
	const { user } = await parent();

	if (!user.isAdmin) {
		throw error(403, 'Forbidden');
	}

	const year = parseInt(params.year);

	const surveyChallengeSet = await prisma.challengeSet.findFirst({
		where: {
			timeAvailableStart: {
				gte: new Date(year, 0, 1),
				lt: new Date(year + 1, 0, 1),
			},
			title: {
				contains: 'survey',
				mode: 'insensitive',
			},
		},
		include: {
			challenges: true,
		},
	});

	return { surveyChallengeSet };
};
