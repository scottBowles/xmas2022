import { pipe, pickAll } from 'ramda';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import { timeTaken } from '$lib/prisma/models/challengeSetResponse';
import { addCorrectAnswer, addResponse, addResponseIsCorrect } from '$lib/prisma/models/challenge';
import { getNow } from '$lib/utils';

export const load: PageServerLoad = async ({ params, parent }) => {
	/** Request data */
	const { user } = await parent();
	const setId = parseInt(params.setId);

	/** Database hit */
	const challengeSet = await prisma.challengeSet.findUnique({
		where: { id: setId },
		select: {
			challengeSetResponses: {
				where: { playerId: user.id },
				select: { startedAt: true, completedAt: true, points: true }
			},
			challenges: {
				include: {
					options: true,
					responses: {
						where: { playerId: user.id }
					}
				}
			},
			title: true,
			timeAvailableStart: true
		}
	});

	/** Derived */
	const challengeSetResponse = challengeSet?.challengeSetResponses[0];
	const challenges =
		challengeSetResponse &&
		challengeSet?.challenges.map(pipe(addCorrectAnswer, addResponse, addResponseIsCorrect));

	/** Ensure it's ok for the user to see this data */
	const challengeSetCanBeReviewed =
		challengeSet &&
		challengeSet.timeAvailableStart &&
		challengeSet.timeAvailableStart < getNow() &&
		challengeSetResponse?.completedAt &&
		challenges;

	if (!challengeSetCanBeReviewed) throw error(404, 'Challenge set not found');

	return {
		challengeSet: pickAll(['title', 'timeAvailableStart'], challengeSet),
		challenges,
		timeTaken: timeTaken(challengeSetResponse),
		points: challengeSetResponse.points
	};
};
