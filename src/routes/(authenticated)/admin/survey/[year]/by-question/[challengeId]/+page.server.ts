import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';

export const load = async ({ parent, params }) => {
	const { user } = await parent();

	if (!user.isAdmin) {
		throw error(403, 'Forbidden');
	}

	const challengeId = parseInt(params.challengeId);

	const challenge = await prisma.challenge.findFirst({
		where: {
			id: challengeId,
		},
		include: {
			responses: {
				include: {
					player: true,
				},
			},
		},
	});

	return { challenge };
};
