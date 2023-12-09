import { correctAnswerFromAcceptedResponses, response } from './utils';
import type { CorrectAnswer, ResponseIsCorrect, ScoreChallenge } from './types';

const correctAnswer: CorrectAnswer = correctAnswerFromAcceptedResponses;

const responseIsCorrect: ResponseIsCorrect = (challenge) => {
	const givenResponse = response(challenge);
	const answer = correctAnswer(challenge);
	if (!givenResponse || !answer) return false;
	return givenResponse.toLowerCase() === answer.toLowerCase();
};

const scoreChallenge: ScoreChallenge = (challenge) =>
	responseIsCorrect(challenge) ? challenge.points : 0;

export { correctAnswer, responseIsCorrect, scoreChallenge };
