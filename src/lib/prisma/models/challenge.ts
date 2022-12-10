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

type ResponseIsCorrectMinimalInput = ResponseMinimalInput & CorrectAnswerMinimalInput;
type ResponseIsCorrect = <T extends ResponseIsCorrectMinimalInput>(challenge: T) => boolean;

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

const response: Response = (challenge) => challenge.responses[0]?.response;

const responseIsCorrect: ResponseIsCorrect = (challenge) =>
	response(challenge) === correctAnswer(challenge);

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
