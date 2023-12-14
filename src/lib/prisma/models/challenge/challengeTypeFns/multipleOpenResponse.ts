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
	const res = JSON.parse(response(challenge) || '[]');
	const numQuestions = JSON.parse(correctAnswer(challenge) || '[]').length;
	const maxIndicesInCommonWithAnAcceptedResponse = Math.max(
		...challenge.acceptedResponsesIfOpen.map((acceptedResponse) => {
			const answer = JSON.parse(acceptedResponse || '[]');
			const numIndicesInCommon: number = answer.reduce(
				(acc: number, val: string, index: number) =>
					normalize(val) === normalize(res[index]) ? acc + 1 : acc,
				0
			);
			return numIndicesInCommon;
		})
	);
	const pointsForCorrect =
		numQuestions &&
		Math.round((maxIndicesInCommonWithAnAcceptedResponse / numQuestions) * challenge.points);
	return pointsForCorrect + pointsManuallyAwarded(challenge);
};

export { correctAnswer, responseIsCorrect, scoreChallenge };
