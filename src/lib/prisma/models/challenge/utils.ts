import type {
	CorrectAnswerFromAcceptedResponses,
	CorrectAnswerFromOptions,
	CorrectAnswers,
	GetResponse
} from './types';

// remove all characters that are not letters or numbers and convert to lowercase
export const normalize = (str: string) => str.replace(/[^a-z0-9]/gi, '').toLowerCase();
export const response: GetResponse = (challenge) => challenge.responses[0]?.response;
export const correctAnswerFromAcceptedResponses: CorrectAnswerFromAcceptedResponses = (challenge) =>
	challenge.acceptedResponsesIfOpen[0];
export const correctAnswerFromOptions: CorrectAnswerFromOptions = (challenge) =>
	challenge.options.find((option) => option.isCorrect)?.text;
export const allowableAnswers: CorrectAnswers = (challenge) => {
	if ('options' in challenge && challenge.options.length > 0) {
		const answer = challenge.options.find((option) => option.isCorrect)?.text;
		return answer === undefined ? [] : [answer];
	}
	return challenge.acceptedResponsesIfOpen;
};
