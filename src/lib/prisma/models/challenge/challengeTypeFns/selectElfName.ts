import { pointsManuallyAwarded, response } from '../utils';
import type { CorrectAnswer, ResponseIsCorrect, ScoreChallenge } from '../types';

const correctAnswer: CorrectAnswer = () => undefined;

const responseIsCorrect: ResponseIsCorrect = (challenge) => !!response(challenge);

const scoreChallenge: ScoreChallenge = (challenge) => {
	const pointsForCorrect = responseIsCorrect(challenge) ? challenge.points : 0;
	return pointsForCorrect + pointsManuallyAwarded(challenge);
};

export { correctAnswer, responseIsCorrect, scoreChallenge };
