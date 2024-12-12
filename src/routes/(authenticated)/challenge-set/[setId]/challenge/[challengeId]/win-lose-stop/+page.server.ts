import { fail, redirect } from '@sveltejs/kit';

import { challengeTypeAbbreviations } from '$lib/constants';
import prisma from '$lib/prisma';
import CS from '$lib/prisma/models/challengeSet';
import CSR from '$lib/prisma/models/challengeSetResponse';
import { urls } from '$lib/utils';
import { ChallengeType } from '@prisma/client';
import { SUBMIT_INPUT_VALUE } from '../constants';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { challenge, challengeSet } = await parent();

	if (challenge.type !== ChallengeType.WIN_LOSE_OR_STOP) {
		const typeAbbr = challengeTypeAbbreviations[challenge.type];
		throw redirect(302, urls.challenge(challengeSet.id, challenge.id, typeAbbr));
	}

	return { challengeSet, challenge };
};

type FormError =
	| { type: 'CHALLENGE_NOT_FOUND'; message: string }
	| { type: 'INVALID_RESPONSE'; message: string };

const createFormError = (type: FormError['type'], message: FormError['message']): FormError => ({
	type,
	message,
});

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

		/** Query data */
		const challengeSet = await prisma.challengeSet.findUnique({
			where: { id: setId },
			select: {
				id: true,
				completionPoints: true,
				challenges: { select: { id: true, type: true }, orderBy: { id: 'asc' } },
				challengeSetResponses: {
					where: { playerId },
					select: { id: true, startedAt: true, completedAt: true },
				},
			},
		});
		const challengeSetResponse = challengeSet?.challengeSetResponses[0];
		const challenge = challengeSet?.challenges.find((challenge) => challenge.id === challengeId);

		/** Handle error and redirects */
		if (!challengeSet || !challenge)
			return fail(404, createFormError('CHALLENGE_NOT_FOUND', 'Challenge not found'));
		if (!challengeSetResponse || !CSR.isLive(challengeSetResponse))
			throw redirect(302, urls.challengeSetReview(setId));

		/** we aren't currently but we could validate the response here */

		/** Save response */
		await prisma.challengeResponse.upsert({
			where: { playerId_challengeId: { challengeId, playerId } },
			update: { response },
			create: { challengeId, playerId, response },
		});

		/** If submitting, end and score ChallengeSetResponse */
		if (submitting) {
			await CSR.endAndScore(challengeSet, playerId, challengeSetResponse.id);
		}

		/** Redirect */
		const redirectTo = submitting
			? urls.challengeSetReview(setId)
			: CS.nextChallengeUrl(challengeSet, challengeId);

		throw redirect(302, redirectTo);
	},
};
