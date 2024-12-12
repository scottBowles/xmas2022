import { error, redirect } from '@sveltejs/kit';

import prisma from '$lib/prisma';
import CHLG from '$lib/prisma/models/challenge';
import CS from '$lib/prisma/models/challengeSet';
import CSR from '$lib/prisma/models/challengeSetResponse';
import { urls } from '$lib/utils';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, parent }) => {
	const { user } = await parent();
	const setId = parseInt(params.setId);
	const challengeId = parseInt(params.challengeId);

	/** Query challengeSet */
	const challengeSet = await prisma.challengeSet.findUnique({
		where: { id: setId },
		include: {
			challengeSetResponses: {
				where: { playerId: user.id },
				select: { startedAt: true, completedAt: true },
			},
			challenges: {
				include: {
					options: true,
					responses: {
						where: { playerId: user.id },
					},
					cldImages: true,
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
		},
	});
	const challenge = challengeSet?.challenges.find((challenge) => challenge.id === challengeId);
	const challengeSetResponse = challengeSet?.challengeSetResponses[0];

	/** Handle error and redirects */
	if (
		!challengeSet ||
		(!user.isAdmin && !CS.isAvailable(challengeSet)) ||
		!challengeSetResponse?.startedAt ||
		!challenge
	) {
		throw error(404, 'Challenge set not found');
	}

	if (!CSR.isLive(challengeSetResponse)) {
		throw redirect(302, urls.challengeSetReview(challengeSet.id));
	}

	return { challengeSet, challenge, setHasAnotherChallenge: !CHLG.isLast(challengeSet)(challenge) };
};
