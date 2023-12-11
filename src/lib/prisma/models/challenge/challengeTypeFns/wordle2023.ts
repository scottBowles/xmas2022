import { correctAnswerFromAcceptedResponses, pointsManuallyAwarded, response } from '../utils';
import type { CorrectAnswer, ResponseIsCorrect, ScoreChallenge } from '../types';

const correctAnswer: CorrectAnswer = correctAnswerFromAcceptedResponses;

const responseIsCorrect: ResponseIsCorrect = (challenge) => {
	const givenResponse = response(challenge);
	const answer = correctAnswer(challenge);
	if (!givenResponse || !answer) return false;
	const guesses = givenResponse.split(',');
	return guesses.includes(answer);
};

const scoreChallenge: ScoreChallenge = (challenge) => {
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
		'6': 1,
	} as Record<string, number>;
	const pointsForCorrect = pointsForNumberOfGuesses[numberOfGuesses] || 0;
	return pointsForCorrect + pointsManuallyAwarded(challenge);
};

export { correctAnswer, responseIsCorrect, scoreChallenge };
