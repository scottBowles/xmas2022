import { pointsManuallyAwarded, response } from '../utils';
import type {
	CorrectAnswerMinimalInput,
	CorrectAnswersMinimalInput,
	ScoreChallengeMinimalInput,
} from '../types';
import { getElfNameWorth } from '$lib/utils';
import type { ChallengeResponse } from '@prisma/client';

type CorrectAnswerYourElfNameWorth = <T extends CorrectAnswerMinimalInput>(
	challenge: T,
	elfNameChallengeResponse: ChallengeResponse | undefined | null
) => string | false | undefined;
type ScoreChallengeYourElfNameWorth = <T extends ScoreChallengeMinimalInput>(
	challenge: T,
	elfNameChallengeResponse: ChallengeResponse | undefined | null
) => number;
type ResponseIsCorrectYourElfNameWorth = <T extends CorrectAnswersMinimalInput>(
	challenge: T,
	elfNameChallengeResponse: ChallengeResponse | undefined | null
) => boolean;

const clean = (str: string) => str.replace(/\D/g, '');

const correctAnswer: CorrectAnswerYourElfNameWorth = (challenge, elfNameChallengeResponse) => {
	if (!elfNameChallengeResponse?.response) return 'No elf name found!';
	const { selectedFirstName, selectedLastName } = JSON.parse(elfNameChallengeResponse.response);
	return String(getElfNameWorth(`${selectedFirstName}${selectedLastName}`));
};

const responseIsCorrect: ResponseIsCorrectYourElfNameWorth = (
	challenge,
	elfNameChallengeResponse
) =>
	parseInt(clean(response(challenge))) ===
	parseInt(clean(correctAnswer(challenge, elfNameChallengeResponse) || '-9999'));

const scoreChallenge: ScoreChallengeYourElfNameWorth = (challenge, elfNameChallengeResponse) => {
	if (!elfNameChallengeResponse?.response) return 0;
	const pointsForCorrect = responseIsCorrect(challenge, elfNameChallengeResponse)
		? challenge.points
		: 0;
	return pointsForCorrect + pointsManuallyAwarded(challenge);
};

export { correctAnswer, responseIsCorrect, scoreChallenge };
