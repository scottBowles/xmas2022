import { correctAnswerFromOptions, normalize, pointsManuallyAwarded, response } from '../utils';
import type { CorrectAnswer, ResponseIsCorrect, ScoreChallenge } from '../types';

const correctAnswer: CorrectAnswer = correctAnswerFromOptions;

const responseIsCorrect: ResponseIsCorrect = (challenge) =>
	normalize(correctAnswer(challenge) || '') === normalize(response(challenge) || '');

const scoreChallenge: ScoreChallenge = (challenge) => {
	const pointsForCorrect = responseIsCorrect(challenge) ? challenge.points : 0;
	return pointsForCorrect + pointsManuallyAwarded(challenge);
};

export { correctAnswer, responseIsCorrect, scoreChallenge };
