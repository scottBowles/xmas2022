import {
	correctAnswerFromAcceptedResponses,
	normalize,
	pointsManuallyAwarded,
	response,
} from '../utils';
import type { CorrectAnswer, ResponseIsCorrect, ScoreChallenge } from '../types';

const correctAnswer: CorrectAnswer = correctAnswerFromAcceptedResponses;

const responseIsCorrect: ResponseIsCorrect = (challenge) =>
	challenge.acceptedResponsesIfOpen.some(
		(answer) => normalize(answer) === normalize(response(challenge))
	);

const scoreChallenge: ScoreChallenge = (challenge) => {
	const answer = JSON.parse(correctAnswer(challenge) || '[]');
	const res = JSON.parse(response(challenge) || '[]');
	const pointsForCorrect = answer.reduce(
		(acc: number, val: string, index: number) =>
			normalize(val) === normalize(res[index]) ? acc + 1 : acc,
		0
	);
	return pointsForCorrect + pointsManuallyAwarded(challenge);
};

export { correctAnswer, responseIsCorrect, scoreChallenge };
