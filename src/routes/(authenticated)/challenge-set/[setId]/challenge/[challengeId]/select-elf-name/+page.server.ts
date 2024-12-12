import { fail, redirect } from '@sveltejs/kit';

import { challengeTypeAbbreviations } from '$lib/constants';
import prisma from '$lib/prisma';
import CR from '$lib/prisma/models/challengeResponse';
import CS from '$lib/prisma/models/challengeSet';
import CSR from '$lib/prisma/models/challengeSetResponse';
import { urls } from '$lib/utils';
import { ChallengeType } from '@prisma/client';
import { SUBMIT_INPUT_VALUE } from '../constants';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { challenge, challengeSet } = await parent();

	/** Handle error and redirects */
	if (challenge.type !== ChallengeType.SELECT_ELF_NAME) {
		const typeAbbr = challengeTypeAbbreviations[challenge.type];
		throw redirect(302, urls.challenge(challengeSet.id, challenge.id, typeAbbr));
	}

	/** Get taken names */
	const challengeResponses = await prisma.challengeResponse.findMany({
		where: { challengeId: challenge.id },
		select: { response: true },
	});
	const { takenFirstNames, takenLastNames } = CR.takenElfNames(challengeResponses) ?? {};

	return {
		challengeSet,
		challenge,
		takenElfFirstNames: takenFirstNames,
		takenElfLastNames: takenLastNames,
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
	  }
	| {
			type: 'INVALID_RESPONSE';
			message: string;
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

const saveSelectElfNameResponse = async ({
	response,
	challengeId,
	playerId,
}: {
	response: string | undefined;
	challengeId: number;
	playerId: number;
}): Promise<
	| {
			isError: true;
			status: number;
			formError: FormError;
	  }
	| {
			isError: false;
	  }
> => {
	// if SELECT_ELF_NAME, check if name is taken
	const parsed = CR.responseTakenElfNamesResponseSchema.safeParse(
		JSON.parse(response ?? '{}') as unknown
	).data;
	if (!parsed) {
		return {
			isError: true,
			status: 400,
			formError: createFormError({
				type: 'INVALID_RESPONSE',
				message: 'Something went wrong with the response',
			}),
		};
	}
	const { selectedFirstName, selectedLastName } = parsed;
	const challengeResponses = await prisma.challengeResponse.findMany({
		where: { challengeId },
		select: { response: true },
	});
	const { takenFirstNames, takenLastNames } = CR.takenElfNames(challengeResponses) ?? {};
	const firstNameIsTaken = takenFirstNames?.includes(selectedFirstName);
	const lastNameIsTaken = takenLastNames?.includes(selectedLastName);
	if (firstNameIsTaken || lastNameIsTaken) {
		return {
			isError: true,
			status: 400,
			formError: createFormError({
				type: 'NAME_TAKEN',
				message:
					firstNameIsTaken && lastNameIsTaken
						? 'Both of those names are taken'
						: firstNameIsTaken
							? `${selectedFirstName} is taken`
							: `${selectedLastName} is taken}`,
				takenFirstNames,
				takenLastNames,
			}),
		};
	}
	const responseSelectElfNameId = (
		await prisma.responseSelectElfName.create({ data: { selectedFirstName, selectedLastName } })
	).id;
	await prisma.challengeResponse.upsert({
		where: { playerId_challengeId: { challengeId, playerId } },
		update: { responseSelectElfNameId },
		create: { challengeId, playerId, responseSelectElfNameId },
	});
	return { isError: false };
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
			return fail(
				404,
				createFormError({ type: 'CHALLENGE_NOT_FOUND', message: 'Challenge not found' })
			);
		if (!challengeSetResponse || !CSR.isLive(challengeSetResponse))
			throw redirect(302, urls.challengeSetReview(setId));

		// we aren't currently but we could validate the response here

		/** Save response */
		const parsed = CR.responseTakenElfNamesResponseSchema.safeParse(
			JSON.parse(response ?? '{}') as unknown
		).data;
		if (!parsed) {
			return fail(
				400,
				createFormError({
					type: 'INVALID_RESPONSE',
					message: 'Something went wrong with the response',
				})
			);
		}

		const { selectedFirstName, selectedLastName } = parsed;
		const challengeResponses = await prisma.challengeResponse.findMany({
			where: { challengeId },
			select: { response: true },
		});
		const { takenFirstNames, takenLastNames } = CR.takenElfNames(challengeResponses) ?? {};
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
		const responseSelectElfNameId = (
			await prisma.responseSelectElfName.create({ data: { selectedFirstName, selectedLastName } })
		).id;
		await prisma.challengeResponse.upsert({
			where: { playerId_challengeId: { challengeId, playerId } },
			update: { responseSelectElfNameId },
			create: { challengeId, playerId, responseSelectElfNameId },
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
