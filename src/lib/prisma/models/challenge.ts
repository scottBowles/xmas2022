import { addKey } from '$lib/utils';

type IsLast = <T extends { challenges: { id: number }[] }>(
	challengeSet: T
) => (challenge: T['challenges'][number]) => boolean;

type CorrectAnswerFromOptionsMinimalInput = { options: { isCorrect: boolean; text: string }[] };
type CorrectAnswerFromOptions = <T extends CorrectAnswerFromOptionsMinimalInput>(
	challenge: T
) => string | false | undefined;

type CorrectAnswerFromAcceptedResponsesMinimalInput = {
	acceptedResponsesIfOpen: string[];
};
type CorrectAnswerFromAcceptedResponses = <
	T extends CorrectAnswerFromAcceptedResponsesMinimalInput
>(
	challenge: T
) => string | false | undefined;

type CorrectAnswerMinimalInput = CorrectAnswerFromOptionsMinimalInput &
	CorrectAnswerFromAcceptedResponsesMinimalInput;
type CorrectAnswer = <T extends CorrectAnswerMinimalInput>(
	challenge: T
) => string | false | undefined;

type ResponseMinimalInput = { responses: { response: string }[] };
type Response = <T extends ResponseMinimalInput>(challenge: T) => string;

type CorrectAnswersMinimalInput = { options: { isCorrect: boolean; text: string }[] } & {
	acceptedResponsesIfOpen: string[];
} & ResponseMinimalInput;
type CorrectAnswers = <T extends CorrectAnswersMinimalInput>(challenge: T) => string[];

// remove all characters that are not letters or numbers and convert to lowercase
const normalize = (str: string) => str.replace(/[^a-z0-9]/gi, '').toLowerCase();

const isLast: IsLast = (challengeSet) => (challenge) =>
	challengeSet.challenges[challengeSet.challenges.length - 1].id === challenge.id;

const correctAnswerFromOptions: CorrectAnswerFromOptions = (challenge) =>
	challenge.options.find((option) => option.isCorrect)?.text;

const correctAnswerFromAcceptedResponses: CorrectAnswerFromAcceptedResponses = (challenge) =>
	challenge.acceptedResponsesIfOpen[0];

const correctAnswer: CorrectAnswer = (challenge) =>
	'options' in challenge && challenge.options.length > 0
		? correctAnswerFromOptions(challenge)
		: correctAnswerFromAcceptedResponses(challenge);

const allowableAnswers: CorrectAnswers = (challenge) => {
	if ('options' in challenge && challenge.options.length > 0) {
		const answer = challenge.options.find((option) => option.isCorrect)?.text;
		return answer === undefined ? [] : [answer];
	}
	return challenge.acceptedResponsesIfOpen;
};

const response: Response = (challenge) => challenge.responses[0]?.response;

const responseIsCorrect = (challenge: CorrectAnswersMinimalInput) =>
	allowableAnswers(challenge).some(
		(answer) => normalize(answer) === normalize(response(challenge))
	);

const addIsLast = <T extends { challenges: { id: number }[] }>(challengeSet: T) =>
	addKey('isLast', isLast(challengeSet));
const addCorrectAnswer = addKey('correctAnswer', correctAnswer);
const addResponse = addKey('response', response);
const addResponseIsCorrect = addKey('responseIsCorrect', responseIsCorrect);

export {
	isLast,
	correctAnswerFromOptions,
	correctAnswerFromAcceptedResponses,
	correctAnswer,
	response,
	responseIsCorrect,
	addIsLast,
	addCorrectAnswer,
	addResponse,
	addResponseIsCorrect
};
