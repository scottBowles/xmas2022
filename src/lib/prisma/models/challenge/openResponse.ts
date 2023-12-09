import { correctAnswerFromAcceptedResponses, normalize, response } from './utils';
import type { CorrectAnswer, ResponseIsCorrect, ScoreChallenge } from './types';

const correctAnswer: CorrectAnswer = correctAnswerFromAcceptedResponses;

const responseIsCorrect: ResponseIsCorrect = (challenge) =>
	challenge.acceptedResponsesIfOpen.some(
		(answer) => normalize(answer) === normalize(response(challenge))
	);

const scoreChallenge: ScoreChallenge = (challenge) =>
	responseIsCorrect(challenge) ? challenge.points : 0;

export { correctAnswer, responseIsCorrect, scoreChallenge };
