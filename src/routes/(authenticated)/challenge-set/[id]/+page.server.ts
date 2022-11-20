import prisma from '$lib/prisma';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import getActionChallengeSet from './getActionChallengeSet';

export const load: PageServerLoad = async ({ params, parent }) => {
	const now = new Date();
	const { user } = await parent();
	const id = parseInt(params.id);

	const challengeSet = await prisma.challengeSet.findUnique({
		where: { id },
		include: {
			challengeSetResponses: {
				where: { playerId: user.id },
				select: { startedAt: true, completedAt: true }
			},
			challenges: {
				select: { id: true }
			}
		}
	});
	if (!challengeSet || !challengeSet.timeAvailableStart || challengeSet.timeAvailableStart > now) {
		throw error(404, 'Challenge set not found');
	}
	return { challengeSet };
};

export const actions: Actions = {
	/**
	 * This is called when the user clicks to start or continue a challenge set.
	 */
	default: async ({ locals, params }) => {
		const userId = locals.user?.id;
		const id = parseInt(params.id);

		// if the user is not logged in, redirect to login (unlikely but possible)
		if (!userId) throw redirect(403, '/login');

		// get the challenge set from the database and add getters used below
		const challengeSet = await getActionChallengeSet(id, userId);

		// if the challenge set doesn't exist or is not available, throw a 404
		if (!challengeSet || !challengeSet.isAvailable)
			return invalid(404, { error: 'Challenge set not found' });

		// if the challenge set has no challenges, throw a 404
		if (!challengeSet.challengesExist)
			return invalid(404, { error: 'Challenge set has no challenges' });

		// if the user has already completed the challenge set, redirect to the results page
		if (challengeSet.userHasCompleted) throw redirect(302, challengeSet.resultsUrl);

		// if the user has not started the challenge set, create a new challenge set response
		// with the current time as the start time
		if (!challengeSet.userResponseExists) {
			const now = new Date();
			await prisma.challengeSetResponse.create({
				data: { challengeSetId: id, playerId: userId, startedAt: now }
			});
		}

		// redirect to the first incomplete challenge in the challenge set, if it exists, or
		// the first challenge if it doesn't
		throw redirect(302, `/challenge-set/${id}/challenge/${challengeSet.nextChallenge.id}`);
	}
};
