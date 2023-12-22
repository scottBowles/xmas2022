import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import prisma from '$lib/prisma';
import { isLast, scoreChallenges } from '$lib/prisma/models/challenge';
import { isAvailable, nextChallengeUrl } from '$lib/prisma/models/challengeSet';
import { isLive } from '$lib/prisma/models/challengeSetResponse';
import { getNow, urls } from '$lib/utils';
import { SUBMIT_INPUT_VALUE } from './constants';
import { takenElfNames } from '$lib/prisma/models/challengeResponse';

const TYPES_THAT_HANDLE_THEIR_OWN_REDIRECTS = ['WORDLE', 'WORDLE_2023'];

export const load: PageServerLoad = async ({ params, parent }) => {
	const { user } = await parent();
	const setId = parseInt(params.setId);
	const challengeId = parseInt(params.challengeId);

	/** Kick off promises that may not be needed */
	const challengeResponsesPromise = prisma.challengeResponse.findMany({
		where: { challengeId },
		select: { response: true },
	});

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
		(!user.isAdmin && !isAvailable(challengeSet)) ||
		!challengeSetResponse?.startedAt ||
		!challenge
	) {
		throw error(404, 'Challenge set not found');
	}

	if (!isLive(challengeSetResponse)) {
		throw redirect(302, urls.challengeSetReview(challengeSet.id));
	}

	/** If SELECT_ELF_NAME, get taken names */
	let takenElfFirstNames;
	let takenElfLastNames;
	if (challenge.type === 'SELECT_ELF_NAME') {
		const challengeResponses = await challengeResponsesPromise;
		const { takenFirstNames, takenLastNames } = takenElfNames(challengeResponses) ?? {};
		takenElfFirstNames = takenFirstNames;
		takenElfLastNames = takenLastNames;
	}

	return {
		challengeSet,
		challenge,
		takenElfFirstNames,
		takenElfLastNames,
		setHasAnotherChallenge: !isLast(challengeSet)(challenge),
	};
};

type FormError =
	| {
			type: 'CHALLENGE_NOT_FOUND';
			message: string;
	  }
	| {
			type: 'NAME_TAKEN';
			message: string;
			takenFirstNames: string[] | undefined;
			takenLastNames: string[] | undefined;
	  };

const createFormError = (obj: {
	type: FormError['type'];
	message: FormError['message'];
	takenFirstNames?: string[];
	takenLastNames?: string[];
}): FormError => ({
	type: obj.type,
	message: obj.message,
	takenFirstNames: obj.takenFirstNames,
	takenLastNames: obj.takenLastNames,
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

		if (!challengeSet || !challenge)
			return fail(
				404,
				createFormError({ type: 'CHALLENGE_NOT_FOUND', message: 'Challenge not found' })
			);
		if (!challengeSetResponse || !isLive(challengeSetResponse))
			throw redirect(302, urls.challengeSetReview(setId));

		// we aren't currently but we could validate the response here

		// if SELECT_ELF_NAME, check if name is taken
		if (challenge.type === 'SELECT_ELF_NAME') {
			const { selectedFirstName, selectedLastName } = JSON.parse(response ?? '[]');
			const challengeResponses = await prisma.challengeResponse.findMany({
				where: { challengeId },
				select: { response: true },
			});
			const { takenFirstNames, takenLastNames } = takenElfNames(challengeResponses) ?? {};
			const firstNameIsTaken = takenFirstNames?.includes(selectedFirstName);
			const lastNameIsTaken = takenLastNames?.includes(selectedLastName);
			if (firstNameIsTaken || lastNameIsTaken) {
				return fail(
					400,
					createFormError({
						type: 'NAME_TAKEN',
						message:
							firstNameIsTaken && lastNameIsTaken
								? 'Both of those names are taken'
								: firstNameIsTaken
								? `${selectedFirstName} is taken`
								: `${selectedLastName} is taken}`,
						takenFirstNames,
						takenLastNames,
					})
				);
			}
		}

		// create or update challengeResponse
		await prisma.challengeResponse.upsert({
			where: { playerId_challengeId: { challengeId, playerId } },
			update: { response },
			create: { challengeId, playerId, response },
		});

		if (submitting) {
			// end and score the challengeSetResponse
			const completedAt = getNow();

			const [challenges, elfNameChallengeResponse] = await Promise.all([
				prisma.challenge.findMany({
					where: { challengeSetId: setId },
					include: {
						options: true,
						responses: {
							where: { playerId },
						},
					},
				}),
				prisma.challengeResponse.findFirst({
					where: { playerId, challenge: { type: 'SELECT_ELF_NAME' } },
					orderBy: { createdAt: 'desc' },
				}),
			]);

			const challengePoints = scoreChallenges(challenges, { elfNameChallengeResponse });
			const completionPoints = challengeSetResponse.completedAt ? challengeSet.completionPoints : 0;
			const points = challengePoints + completionPoints;

			await prisma.challengeSetResponse.update({
				where: { id: challengeSetResponse.id },
				data: { completedAt, points },
			});

			const redirectHere = !TYPES_THAT_HANDLE_THEIR_OWN_REDIRECTS.includes(challenge.type);
			if (redirectHere) {
				throw redirect(302, urls.challengeSetReview(setId));
			}
		}

		if (!TYPES_THAT_HANDLE_THEIR_OWN_REDIRECTS.includes(challenge.type)) {
			throw redirect(302, nextChallengeUrl(challengeSet, challengeId));
		}
	},
};

// const text = {
// 	mainPrompt: 'Answer the questions without getting two wrong!',
// 	prompts: [
// 		{
// 			prompt: 'What is 1 + 1?',
// 			acceptedAnswers: ['2'],
// 		},
// 		{
// 			prompt: 'What is 2 + 2?',
// 			acceptedAnswers: ['4'],
// 		},
// 		{
// 			prompt: 'What is the square root of 16?',
// 			acceptedAnswers: ['4', '-4'],
// 		},
// 		{
// 			prompt: 'What is the square root of 25?',
// 			acceptedAnswers: ['5', '-5'],
// 		},
// 	],
// };
