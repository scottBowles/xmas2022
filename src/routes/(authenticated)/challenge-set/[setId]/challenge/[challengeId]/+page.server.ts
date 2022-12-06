import prisma from '$lib/prisma';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getNow, urls } from '$lib/utils';
import { isLast } from '$lib/prisma/models/challenge';
import { isLive } from '$lib/prisma/models/challengeSetResponse';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { user } = await parent();
	const setId = parseInt(params.setId);
	const challengeId = parseInt(params.challengeId);

	const challengeSet = await prisma.challengeSet.findUnique({
		where: { id: setId },
		include: {
			challengeSetResponses: {
				where: { playerId: user.id },
				select: { startedAt: true, completedAt: true }
			},
			challenges: {
				include: {
					options: true
				}
			}
		}
	});
	const challenge = challengeSet?.challenges.find((challenge) => challenge.id === challengeId);
	const challengeSetResponse = challengeSet?.challengeSetResponses[0];

	if (
		!challengeSet ||
		!challengeSet.timeAvailableStart ||
		challengeSet.timeAvailableStart > getNow() ||
		!challengeSetResponse?.startedAt ||
		!challenge
	) {
		throw error(404, 'Challenge set not found');
	}

	if (!isLive(challengeSetResponse)) {
		throw redirect(302, urls.challengeSetReview(challengeSet.id));
	}

	return {
		challengeSet,
		challenge: {
			...challenge,
			isLast: isLast(challengeSet)(challenge)
		}
	};
};
