import prisma from '$lib/prisma';
import CS from '$lib/prisma/models/challengeSet';
import { getNow } from '$lib/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { user } = await parent();
	const id = parseInt(params.setId);

	const challengeSet = await prisma.challengeSet.findUnique({
		where: { id },
		include: {
			challengeSetResponses: {
				where: { playerId: user.id },
				select: { startedAt: true, completedAt: true },
			},
			challenges: { select: { id: true }, orderBy: { id: 'asc' } },
		},
	});
	if (!challengeSet || (!user.isAdmin && !CS.isAvailable(challengeSet))) {
		throw error(404, 'Challenge set not found');
	}

	return { challengeSet };
};

export const actions: Actions = {
	/**
	 * This is called when the user clicks to start or continue a challenge set.
	 */
	default: async ({ locals, params }) => {
		const user = locals.user;
		const id = parseInt(params.setId);

		// if the user is not logged in, redirect to login (unlikely but possible)
		if (!user?.id) throw redirect(302, '/login');

		const challengeSet = await prisma.challengeSet.findUnique({
			where: { id },
			select: {
				id: true,
				timeAvailableStart: true,
				challengeSetResponses: {
					where: { playerId: user.id },
					select: { startedAt: true, completedAt: true },
				},
				challenges: {
					select: {
						id: true,
						responses: { select: { response: true }, where: { playerId: user.id } },
						type: true,
					},
					orderBy: { id: 'asc' },
				},
			},
		});

		if (!challengeSet || (!user.isAdmin && !CS.isAvailable(challengeSet)))
			return fail(404, { error: 'Challenge set not found' });
		if (!CS.challengesExist(challengeSet))
			return fail(404, { error: 'Challenge set has no challenges' });
		if (CS.userHasCompleted(challengeSet)) throw redirect(302, CS.resultsUrl(challengeSet));

		// if the user has not started the challenge set, create a new challenge set response
		// with the current time as the start time
		if (!CS.userResponseExists(challengeSet)) {
			await prisma.challengeSetResponse.create({
				data: { challengeSetId: id, playerId: user.id, startedAt: getNow() },
			});
		}

		// redirect to the first incomplete challenge in the challenge set, if it exists, or
		// the first challenge if it doesn't
		throw redirect(302, CS.nextChallengeUrl(challengeSet));
	},
};
