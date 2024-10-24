import { pickAll } from 'ramda';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import { timeTaken } from '$lib/prisma/models/challengeSetResponse';
import { isAvailable } from '$lib/prisma/models/challengeSet';
import getChallengeData from './getChallengeData';

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
				select: { startedAt: true, completedAt: true, points: true },
			},
			challenges: {
				include: {
					options: true,
					responses: {
						where: { playerId: user.id },
					},
					cldImages: true,
				},
				orderBy: { id: 'asc' },
			},
			title: true,
			timeAvailableStart: true,
			id: true,
		},
	});

	/** Derived */
	const challengeSetResponse = challengeSet?.challengeSetResponses[0];
	const challenges =
		challengeSetResponse &&
		(await Promise.all(
			challengeSet?.challenges.map(async (challenge) => getChallengeData(challenge, user))
		));

	/** Ensure it's ok for the user to see this data */
	const challengeSetCanBeReviewed =
		challengeSet &&
		(user.isAdmin || isAvailable(challengeSet)) &&
		challengeSetResponse?.completedAt &&
		challenges;

	if (!challengeSetCanBeReviewed) throw error(404, 'Challenge set not found');

	return {
		challengeSet: pickAll(['title', 'timeAvailableStart', 'id'], challengeSet),
		challenges,
		timeTaken: timeTaken(challengeSetResponse),
		points: challengeSetResponse.points,
	};
};
