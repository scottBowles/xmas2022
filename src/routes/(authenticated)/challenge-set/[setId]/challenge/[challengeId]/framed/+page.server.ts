import { ChallengeType } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

import prisma from '$lib/prisma';
import { challengeTypeAbbreviations } from '$lib/constants';
import { jsonSafeParse, urls } from '$lib/utils';
import type { Actions, PageServerLoad } from './$types';
import CHLG from '$lib/prisma/models/challenge';
import { SUBMIT_INPUT_VALUE } from '../constants';
import CSR from '$lib/prisma/models/challengeSetResponse';
import CS from '$lib/prisma/models/challengeSet';
import { normalize } from '$lib/prisma/models/challenge/utils';
import * as Framed from '$lib/prisma/models/challenge/challengeTypeFns/framed';

const responsesSchema = z.array(z.string());

export const load: PageServerLoad = async ({ parent }) => {
	const { challenge, challengeSet } = await parent();

	const typeAbbr = challengeTypeAbbreviations[challenge.type];

	if (challenge.type !== ChallengeType.FRAMED) {
		throw redirect(302, urls.challenge(challengeSet.id, challenge.id, typeAbbr));
	}

	const responses = Framed.parseResponse(challenge).map((response) => ({
		response,
		isCorrect: Framed.subResponseIsCorrect(response, challenge),
	}));

	const challengeWithImagesHidden = {
		...challenge,
		cldImages: challenge.cldImages.slice(0, responses.length + 1),
	};

	return { challenge: challengeWithImagesHidden, challengeSet, responses };
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
		const givenAnswer = data.get('answer')?.toString() ?? '';
		const action = data.get('submit_action')?.toString();
		const isLastInChallengeSet = action === SUBMIT_INPUT_VALUE;
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
				challenges: {
					select: {
						id: true,
						type: true,
						acceptedResponsesIfOpen: true,
						cldImages: true,
						responses: { where: { playerId }, select: { response: true } },
					},
					orderBy: { id: 'asc' },
				},
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
		const response = CHLG.response(challenge);
		const parsedResponse = responsesSchema.safeParse(jsonSafeParse(response)).data ?? [];
		const newResponse = [...parsedResponse, givenAnswer];
		const jsonNewResponse = JSON.stringify(newResponse);

		await prisma.challengeResponse.upsert({
			where: { playerId_challengeId: { challengeId, playerId } },
			update: { response: jsonNewResponse },
			create: { challengeId, playerId, response: jsonNewResponse },
		});

		const isFramedFinished =
			newResponse.length === 6 ||
			newResponse.some((r) =>
				challenge.acceptedResponsesIfOpen.map(normalize).includes(normalize(r))
			);

		/** If finished and submitting the set, end and score ChallengeSetResponse */
		if (isLastInChallengeSet && isFramedFinished) {
			await CSR.endAndScore(challengeSet, playerId, challengeSetResponse.id);
		}

		if (isFramedFinished) {
			/** Redirect if we're finished */
			const redirectTo = isLastInChallengeSet
				? urls.challengeSetReview(setId)
				: CS.nextChallengeUrl(challengeSet, challengeId);

			throw redirect(302, redirectTo);
		}
	},
};
