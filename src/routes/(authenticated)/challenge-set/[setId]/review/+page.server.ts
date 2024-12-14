import prisma from '$lib/prisma';
import CS from '$lib/prisma/models/challengeSet';
import CSR from '$lib/prisma/models/challengeSetResponse';
import { error } from '@sveltejs/kit';
import { pickAll } from 'ramda';
import type { PageServerLoad } from './$types';
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
					cldImages: true,
					options: true,
					responses: {
						where: { playerId: user.id },
					},
					children: {
						include: {
							cldImages: true,
							responses: {
								where: { playerId: user.id },
							},
						},
					},
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
	const challengeSetCanBeReviewed = !!(
		challengeSet &&
		(user.isAdmin || (CS.isAvailable(challengeSet) && CS.isThisYear(challengeSet))) &&
		challengeSetResponse?.completedAt &&
		challenges
	);

	if (!challengeSetCanBeReviewed) throw error(404, 'Challenge set not found');

	return {
		challengeSet: pickAll(['title', 'timeAvailableStart', 'id'], challengeSet),
		challenges,
		timeTaken: CSR.timeTaken(challengeSetResponse),
		points: challengeSetResponse.points,
	};
};
