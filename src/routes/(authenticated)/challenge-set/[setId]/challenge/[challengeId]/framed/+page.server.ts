import { ChallengeType } from '@prisma/client';
import { redirect } from '@sveltejs/kit';

import { challengeTypeAbbreviations } from '$lib/constants';
import { urls } from '$lib/utils';
import type { PageServerLoad } from './$types';
import CHLG from '$lib/prisma/models/challenge';

export const load: PageServerLoad = async ({ parent }) => {
	const { challenge, challengeSet } = await parent();

	const typeAbbr = challengeTypeAbbreviations[challenge.type];

	if (challenge.type !== ChallengeType.FRAMED) {
		throw redirect(302, urls.challenge(challengeSet.id, challenge.id, typeAbbr));
	}

	const firstChild = CHLG.orderedChildren(challenge)[0];

	throw redirect(302, urls.challengeChild(challengeSet.id, challenge.id, typeAbbr, firstChild.id));
};
