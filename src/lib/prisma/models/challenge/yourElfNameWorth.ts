import { response } from './utils';
import type {
	CorrectAnswerMinimalInput,
	CorrectAnswersMinimalInput,
	ScoreChallengeMinimalInput
} from './types';
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

const correctAnswer: CorrectAnswerYourElfNameWorth = (challenge, elfNameChallengeResponse) => {
	if (!elfNameChallengeResponse?.response) return 'No elf name found!';
	const { selectedFirstName, selectedLastName } = JSON.parse(elfNameChallengeResponse.response);
	return String(getElfNameWorth(`${selectedFirstName}${selectedLastName}`));
};

const responseIsCorrect: ResponseIsCorrectYourElfNameWorth = (
	challenge,
	elfNameChallengeResponse
) => response(challenge) === correctAnswer(challenge, elfNameChallengeResponse);

const scoreChallenge: ScoreChallengeYourElfNameWorth = (challenge, elfNameChallengeResponse) => {
	if (!elfNameChallengeResponse?.response) return 0;
	return responseIsCorrect(challenge, elfNameChallengeResponse) ? challenge.points : 0;
};

export { correctAnswer, responseIsCorrect, scoreChallenge };

// our data pipe will be:
// common promise
// handed off to challenge type functions that can add to those promises and return data
// handed off to challenge type functions that turn that data into our response object
