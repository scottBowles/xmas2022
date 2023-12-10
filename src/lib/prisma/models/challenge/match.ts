import { correctAnswerFromAcceptedResponses, response } from './utils';
import type { CorrectAnswer, ResponseIsCorrect, ScoreChallenge } from './types';

const correctAnswer: CorrectAnswer = correctAnswerFromAcceptedResponses;

const responseIsCorrect: ResponseIsCorrect = (challenge) =>
	challenge.acceptedResponsesIfOpen.some(
		(answer) => answer.toLowerCase() === response(challenge)?.toLowerCase()
	);

const scoreChallenge: ScoreChallenge = (challenge) => {
	const answer = JSON.parse(correctAnswer(challenge) || '[]');
	const res = JSON.parse(response(challenge) || '[]');
	const numIndicesInCommon = answer.reduce(
		(acc: number, val: string, index: number) => (val === res[index] ? acc + 1 : acc),
		0
	);
	return Math.round((numIndicesInCommon / answer.length) * challenge.points);
};

export { correctAnswer, responseIsCorrect, scoreChallenge };
