import prisma from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	isAvailable,
	challengesExist,
	userHasCompleted,
	resultsUrl,
	userResponseExists,
	nextChallengeUrl
} from '$lib/prisma/models/challengeSet';
import { getNow } from '$lib/utils';

export const load: PageServerLoad = async ({ params, parent }) => {
	const now = new Date();
	const { user } = await parent();
	const id = parseInt(params.setId);

	const challengeSet = await prisma.challengeSet.findUnique({
		where: { id },
		include: {
			challengeSetResponses: {
				where: { playerId: user.id },
				select: { startedAt: true, completedAt: true }
			},
			challenges: { select: { id: true }, orderBy: { id: 'asc' } }
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
		const id = parseInt(params.setId);

		// if the user is not logged in, redirect to login (unlikely but possible)
		if (!userId) throw redirect(302, '/login');

		const challengeSet = await prisma.challengeSet.findUnique({
			where: { id },
			select: {
				id: true,
				timeAvailableStart: true,
				challengeSetResponses: {
					where: { playerId: userId },
					select: { startedAt: true, completedAt: true }
				},
				challenges: {
					select: {
						id: true,
						responses: { select: { response: true }, where: { playerId: userId } }
					},
					orderBy: { id: 'asc' }
				}
			}
		});

		console.log({ userId, id });
		console.log({ challengeSet });

		if (!challengeSet || !isAvailable(challengeSet))
			return fail(404, { error: 'Challenge set not found' });
		if (!challengesExist(challengeSet))
			return fail(404, { error: 'Challenge set has no challenges' });
		if (userHasCompleted(challengeSet)) throw redirect(302, resultsUrl(challengeSet));

		// if the user has not started the challenge set, create a new challenge set response
		// with the current time as the start time
		if (!userResponseExists(challengeSet)) {
			await prisma.challengeSetResponse.create({
				data: { challengeSetId: id, playerId: userId, startedAt: getNow() }
			});
		}

		// redirect to the first incomplete challenge in the challenge set, if it exists, or
		// the first challenge if it doesn't
		throw redirect(302, nextChallengeUrl(challengeSet));
	}
};
