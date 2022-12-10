import prisma from '$lib/prisma';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getNow, urls } from '$lib/utils';
import { isLast } from '$lib/prisma/models/challenge';
import { isLive } from '$lib/prisma/models/challengeSetResponse';
import { nextChallengeUrl } from '$lib/prisma/models/challengeSet';
import { SUBMIT_INPUT_VALUE } from './constants';

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
					options: true,
					responses: {
						where: { playerId: user.id }
					}
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

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		const data = await request.formData();
		const response = data.get('answer')?.toString();
		const action = data.get('submit_action')?.toString();
		const submitting = action === SUBMIT_INPUT_VALUE;
		const setId = parseInt(params.setId);
		const challengeId = parseInt(params.challengeId);
		const playerId = locals.user?.id;

		if (!playerId) throw redirect(302, urls.login());

		// currently we aren't validating the response, but we could do that here

		const challengeSet = await prisma.challengeSet.findUnique({
			where: { id: setId },
			select: {
				id: true,
				challenges: { select: { id: true } },
				challengeSetResponses: {
					where: { playerId },
					select: { id: true, startedAt: true, completedAt: true }
				}
			}
		});
		const challengeSetResponse = challengeSet?.challengeSetResponses[0];

		if (!challengeSet) return invalid(404, { message: 'Challenge set not found' });
		if (!challengeSetResponse || !isLive(challengeSetResponse))
			throw redirect(302, urls.challengeSetReview(setId));

		// create or update challengeResponse
		await prisma.challengeResponse.upsert({
			where: { playerId_challengeId: { challengeId, playerId } },
			update: { response },
			create: { challengeId, playerId, response }
		});

		if (submitting) {
			// end the challengeSetResponse by giving it a completedAt date
			await prisma.challengeSetResponse.update({
				where: { id: challengeSetResponse.id },
				data: { completedAt: getNow() }
			});
			// redirect to the review page
			throw redirect(302, urls.challengeSetReview(setId));
		}

		throw redirect(302, nextChallengeUrl(challengeSet, challengeId));
	}
};