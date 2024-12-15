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

const scoring2023 = (numberOfGuesses: number) =>
	({
		1: 10,
		2: 8,
		3: 6,
		4: 4,
		5: 2,
		6: 1,
	})[numberOfGuesses] || 0;

const scoring2024 = (numberOfGuesses: number) => {
	const consolationPoints = 10;
	return (
		{
			1: 50,
			2: 40,
			3: 30,
			4: 25,
			5: 20,
			6: 15,
		}[numberOfGuesses] || consolationPoints
	);
};

const scoreChallenge: ScoreChallenge = (challenge) => {
	const givenResponse = response(challenge);
	const answer = correctAnswerFromAcceptedResponses(challenge);
	if (!givenResponse || !answer) return 0;

	const year = challenge.challengeSet?.timeAvailableStart?.getFullYear();

	const guesses = givenResponse.split(',');
	const numberOfGuesses = guesses.indexOf(answer) + 1;
	const pointsForCorrect = year
		? year >= 2024
			? scoring2024(numberOfGuesses)
			: scoring2023(numberOfGuesses)
		: 0;

	return pointsForCorrect + pointsManuallyAwarded(challenge);
};

export { correctAnswer, responseIsCorrect, scoreChallenge };
