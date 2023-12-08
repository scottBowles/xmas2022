import { pickAll } from 'ramda';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import { timeTaken } from '$lib/prisma/models/challengeSetResponse';
import * as C from '$lib/prisma/models/challenge';
import { isAvailable } from '$lib/prisma/models/challengeSet';
import { displayName } from '$lib/prisma/models/user';

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
				},
				orderBy: { id: 'asc' }
			},
			title: true,
			timeAvailableStart: true,
			id: true
		}
	});

	const getElfNameData = (challenge: NonNullable<typeof challengeSet>['challenges'][number]) => {
		if (challenge.type !== 'SELECT_ELF_NAME') return null;
		return prisma.challengeResponse
			.findMany({
				where: { challengeId: challenge.id },
				include: {
					player: {
						select: {
							email: true,
							firstName: true,
							lastName: true,
							username: true
						}
					}
				}
			})
			.then((responses) =>
				responses.map((response) => {
					const { selectedFirstName, selectedLastName } = JSON.parse(response.response || '{}');
					return {
						player: displayName(response.player),
						elfFirstName: selectedFirstName,
						elfLastName: selectedLastName
					} as { player: string; elfFirstName: string; elfLastName: string };
				})
			);
	};

	/** Derived */
	const challengeSetResponse = challengeSet?.challengeSetResponses[0];
	const challenges =
		challengeSetResponse &&
		(await Promise.all(
			challengeSet?.challenges.map(async (challenge) => {
				const elfNameData = await getElfNameData(challenge);
				return {
					correctAnswer: C.correctAnswer(challenge),
					response: C.response(challenge),
					responseIsCorrect: C.responseIsCorrect(challenge),
					ownElfName: C.ownElfName(challenge),
					allElfNames: elfNameData,
					...challenge
				};
			})
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
		points: challengeSetResponse.points
	};
};
