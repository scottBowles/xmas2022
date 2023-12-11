import { pointsManuallyAwarded, response } from '../utils';
import type { CorrectAnswer, ResponseIsCorrect, ScoreChallenge } from '../types';

const correctAnswer: CorrectAnswer = (challenge) => challenge.acceptedResponsesIfOpen[0];

const responseIsCorrect: ResponseIsCorrect = (challenge) =>
	['1', '2', '3', '4', '5', '6'].includes(response(challenge));

const scoreChallenge: ScoreChallenge = (challenge) => {
	const numberOfGuesses = response(challenge);
	const pointsForNumberOfGuesses = {
		'1': 15,
		'2': 10,
		'3': 8,
		'4': 6,
		'5': 4,
		'6': 2,
	} as Record<string, number>;
	const pointsForCorrect = pointsForNumberOfGuesses[numberOfGuesses] || 0;
	return pointsForCorrect + pointsManuallyAwarded(challenge);
};

export { correctAnswer, responseIsCorrect, scoreChallenge };
