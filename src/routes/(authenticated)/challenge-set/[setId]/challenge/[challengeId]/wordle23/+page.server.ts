import { fail, redirect } from '@sveltejs/kit';

import { challengeTypeAbbreviations } from '$lib/constants';
import prisma from '$lib/prisma';
import CSR from '$lib/prisma/models/challengeSetResponse';
import { jsonSafeParse, urls } from '$lib/utils';
import { ChallengeType } from '@prisma/client';
import { SUBMIT_INPUT_VALUE } from '../constants';
import type { Actions, PageServerLoad } from './$types';
import CHLG from '@/prisma/models/challenge';
import { z } from 'zod';
import { normalize } from '@/prisma/models/challenge/utils';
import CS from '@/prisma/models/challengeSet';
import type { CharStatus, CharValue } from '@/wordle/status';
import { isWordInWordList } from '$lib/wordle/words';
import { error } from '@sveltejs/kit';

const responsesSchema = z.array(z.string());

/**
 *
 * We can move the wordlist to here and check whether the submitted word is in the wordlist.
 * There's a toast for if it's not.
 *
 * We'll need to move the won and lost messages and toasts to the review page.
 * If there are multiple challenges in the challenge set we can display it here but otherwise
 * we should just show it on the review page.
 * Either way we'll want to move that out of the Wordle.svelte code
 *
 * We may have to contend with animation timing with the response.
 *
 * There was a gameStateStore that had won or lost, and at the end it was updated after a timeout.
 * That then triggered toast and submission.
 *
 */

export const load: PageServerLoad = async ({ parent }) => {
	const { challenge, challengeSet } = await parent();

	if (challenge.type !== ChallengeType.WORDLE_2023) {
		const typeAbbr = challengeTypeAbbreviations[challenge.type];
		throw redirect(302, urls.challenge(challengeSet.id, challenge.id, typeAbbr));
	}

	const correctAnswer = (
		await prisma.challenge.findUnique({
			where: { id: challenge.id },
			select: { acceptedResponsesIfOpen: true },
		})
	)?.acceptedResponsesIfOpen;

	if (!correctAnswer) {
		throw error(404, 'Challenge not found');
	}

	const guesses = responsesSchema.safeParse(jsonSafeParse(CHLG.response(challenge))).data ?? [];

	const allGuesses = guesses.map((response) => {
		const guess = response
			.toUpperCase()
			.split('')
			.filter((char) => char.match(/[A-Z]/)) as CharValue[];
		const charCount = {} as Record<CharValue, number>;
		const statuses = guess.map((char) => {
			if (correctAnswer[0] === char) {
				charCount[char] = charCount[char] ? charCount[char] + 1 : 1;
				return 'correct';
			}
			const charIsPresent = correctAnswer.includes(char);
			const allOfCharAreAlreadyMarkedPresent =
				(charCount[char] ?? 0) < correctAnswer.filter((c) => c === char).length;
			if (charIsPresent && !allOfCharAreAlreadyMarkedPresent) {
				charCount[char] = charCount[char] ? charCount[char] + 1 : 1;
				return 'present';
			}
			return 'absent';
		});
		return { guess, statuses };
	});

	return { challengeSet, challenge, allGuesses };
};

type FormError =
	| { type: 'CHALLENGE_NOT_FOUND'; message: string }
	| { type: 'INVALID_RESPONSE'; message: string }
	| { type: 'INVALID_WORD'; message: string };

const createFormError = (type: FormError['type'], message: FormError['message']): FormError => ({
	type,
	message,
});

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		const data = await request.formData();
		const response = data.get('answer')?.toString();
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
						responses: {
							where: { playerId },
						},
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
		if (!response || response.length !== 5)
			return fail(400, createFormError('INVALID_RESPONSE', 'Response must be 5 characters'));
		if (!isWordInWordList(response.toLowerCase()))
			return fail(400, createFormError('INVALID_WORD', 'Response is not a valid word'));
		if (!challengeSet || !challenge)
			return fail(404, createFormError('CHALLENGE_NOT_FOUND', 'Challenge not found'));
		if (!challengeSetResponse || !CSR.isLive(challengeSetResponse))
			throw redirect(302, urls.challengeSetReview(setId));

		/** we aren't currently but we could validate the response here */

		/** Handle given answer */
		const preexistingResponse =
			responsesSchema.safeParse(jsonSafeParse(CHLG.response(challenge))).data ?? [];
		const newResponse = JSON.stringify([...preexistingResponse, response].slice(0, 5));

		/** Save response */
		await prisma.challengeResponse.upsert({
			where: { playerId_challengeId: { challengeId, playerId } },
			update: { response: newResponse },
			create: { challengeId, playerId, response: newResponse },
		});

		const isCorrect = challenge.acceptedResponsesIfOpen.some(
			(r) => normalize(r) === normalize(response)
		);

		/** If finished and submitting the set, end and score ChallengeSetResponse */
		if (isLastInChallengeSet && isCorrect) {
			await CSR.endAndScore(challengeSet, playerId, challengeSetResponse.id);
		}

		if (isCorrect) {
			/** Redirect if we're finished */
			const redirectTo = isLastInChallengeSet
				? urls.challengeSetReview(setId)
				: CS.nextChallengeUrl(challengeSet, challengeId);

			throw redirect(302, redirectTo);
		}
	},
};
