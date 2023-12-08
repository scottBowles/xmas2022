import { addKey } from '$lib/utils';
import type { Challenge } from '@prisma/client';

type IsLastOnlineMinimalInput = { challenges: Pick<Challenge, 'id' | 'type'>[] };
type IsLastOnline = <T extends IsLastOnlineMinimalInput>(
	challengeSet: T
) => (challenge: T['challenges'][number]) => boolean;

type CorrectAnswerFromOptionsMinimalInput = { options: { isCorrect: boolean; text: string }[] };
type CorrectAnswerFromOptions = <T extends CorrectAnswerFromOptionsMinimalInput>(
	challenge: T
) => string | false | undefined;

type CorrectAnswerFromAcceptedResponsesMinimalInput = { acceptedResponsesIfOpen: string[] };
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
type OwnElfNameMinimalInput = { responses: { response: string }[]; type: Challenge['type'] };
type OwnElfName = <T extends OwnElfNameMinimalInput>(challenge: T) => string;

type CorrectAnswersMinimalInput = { options: { isCorrect: boolean; text: string }[] } & {
	acceptedResponsesIfOpen: string[];
} & ResponseMinimalInput;
type CorrectAnswers = <T extends CorrectAnswersMinimalInput>(challenge: T) => string[];

type ResponseIsCorrect = <T extends CorrectAnswersMinimalInput>(challenge: T) => boolean;

type ScoreChallengeMinimalInput = CorrectAnswersMinimalInput & Pick<Challenge, 'points' | 'type'>;
type ScoreChallenge = <T extends ScoreChallengeMinimalInput>(challenge: T) => number;
type ScoreChallenges = <T extends ScoreChallengeMinimalInput>(challenges: T[]) => number;

// remove all characters that are not letters or numbers and convert to lowercase
const normalize = (str: string) => str.replace(/[^a-z0-9]/gi, '').toLowerCase();

const isLastOnline: IsLastOnline = (challengeSet) => (challenge) => {
	const onlineChallenges = challengeSet.challenges.filter((c) => c.type !== 'OFFLINE');
	return onlineChallenges[challengeSet.challenges.length - 1].id === challenge.id;
};

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

const responseIsCorrect: ResponseIsCorrect = (challenge) =>
	allowableAnswers(challenge).some(
		(answer) => normalize(answer) === normalize(response(challenge))
	);

const ownElfName: OwnElfName = (challenge) => {
	if (challenge.type !== 'SELECT_ELF_NAME') return null;
	const ownElfNameJson = response(challenge);
	const { selectedFirstName, selectedLastName } = JSON.parse(ownElfNameJson || '{}');
	return `${selectedFirstName} ${selectedLastName}`;
};

const score2022Wordle: ScoreChallenge = (challenge) => {
	const numberOfGuesses = response(challenge);
	const pointsForNumberOfGuesses = {
		'1': 15,
		'2': 10,
		'3': 8,
		'4': 6,
		'5': 4,
		'6': 2
	} as Record<string, number>;
	const points = pointsForNumberOfGuesses[numberOfGuesses] || 0;
	return points;
};

const score2023Wordle: ScoreChallenge = (challenge) => {
	const givenResponse = response(challenge);
	const answer = correctAnswerFromAcceptedResponses(challenge);
	if (!givenResponse || !answer) return 0;

	const guesses = givenResponse.split(',');
	const numberOfGuesses = (guesses.indexOf(answer) + 1).toString();
	const pointsForNumberOfGuesses = {
		'1': 10,
		'2': 8,
		'3': 6,
		'4': 4,
		'5': 2,
		'6': 1
	} as Record<string, number>;
	const points = pointsForNumberOfGuesses[numberOfGuesses] || 0;
	return points;
};

const scoreNonWordle: ScoreChallenge = (challenge) =>
	responseIsCorrect(challenge) ? challenge.points : 0;

const scoreChallenge: ScoreChallenge = (challenge) => {
	switch (challenge.type) {
		case 'WORDLE':
			return score2022Wordle(challenge);
		case 'WORDLE_2023':
			return score2023Wordle(challenge);
		case 'MULTIPLE_CHOICE':
		case 'OPEN_RESPONSE':
		case 'SELECT_ELF_NAME':
			return scoreNonWordle(challenge);
		default:
			return 0;
	}
};

const scoreChallenges: ScoreChallenges = (challenges) =>
	challenges.reduce((acc, challenge) => acc + scoreChallenge(challenge), 0);

const addIsLastOnline = <T extends { challenges: { id: number; type: Challenge['type'] }[] }>(
	challengeSet: T
) => addKey('isLastOnline', isLastOnline(challengeSet));
const addCorrectAnswer = addKey('correctAnswer', correctAnswer);
const addResponse = addKey('response', response);
const addResponseIsCorrect = addKey('responseIsCorrect', responseIsCorrect);

export {
	isLastOnline,
	correctAnswerFromOptions,
	correctAnswerFromAcceptedResponses,
	correctAnswer,
	ownElfName,
	response,
	responseIsCorrect,
	score2022Wordle,
	scoreNonWordle,
	scoreChallenge,
	scoreChallenges,
	addIsLastOnline,
	addCorrectAnswer,
	addResponse,
	addResponseIsCorrect
};
