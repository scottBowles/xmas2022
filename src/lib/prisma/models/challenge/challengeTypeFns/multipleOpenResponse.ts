import { normalize, pointsManuallyAwarded, response } from '../utils';
import type { CorrectAnswer, ResponseIsCorrect, ScoreChallenge } from '../types';

// challenge.prompt expects a stringified object of form:
// { mainPrompt: string, inputPrompts: string[] }

// challenge.acceptedResponsesIfOpen expects a stringified array of arrays of strings,
// where each inner array is a set of responses that are considered correct for the
// corresponding input prompt in challenge.prompt.inputPrompts

const correctAnswer: CorrectAnswer = (challenge) =>
	JSON.parse(challenge.acceptedResponsesIfOpen[0]).map(
		(acceptableAnswers: string[]) => acceptableAnswers[0]
	);

const responseIsCorrect: ResponseIsCorrect = (challenge) => {
	const resp = JSON.parse(response(challenge) || '[]');
	return challenge.acceptedResponsesIfOpen.some((arrayOfAcceptedResponsesJson) => {
		const arrayOfAcceptedResponses: string[][] = JSON.parse(arrayOfAcceptedResponsesJson || '[]');
		return arrayOfAcceptedResponses.every((acceptableAnswers, i) =>
			acceptableAnswers.map(normalize).includes(normalize(resp[i]))
		);
	});
};

const answerIsCorrect = <T extends { acceptedResponsesIfOpen: string[] }>(
	challenge: T,
	answer: string,
	index: number
) => {
	return challenge.acceptedResponsesIfOpen.some((arrayOfAcceptedResponsesJson) => {
		const arrayOfAcceptedResponses: string[][] = JSON.parse(arrayOfAcceptedResponsesJson || '[]');
		return arrayOfAcceptedResponses[index].map(normalize).includes(normalize(answer));
	});
};

const scoreChallenge: ScoreChallenge = (challenge) => {
	const res = JSON.parse(response(challenge) || '[]');
	const answer = correctAnswer(challenge);
	const numQuestions: number = answer ? answer.length : 0;
	const maxIndicesInCommonWithAnAcceptedResponse = Math.max(
		...challenge.acceptedResponsesIfOpen.map((arrayOfAcceptedResponsesJson) => {
			const arrayOfAcceptedResponses: string[][] = JSON.parse(arrayOfAcceptedResponsesJson || '[]');
			const numCorrectAnswers: number = arrayOfAcceptedResponses.reduce(
				(acc: number, val: string[], index: number) =>
					acc + (val.map(normalize).includes(normalize(res[index])) ? 1 : 0),
				0
			);
			return numCorrectAnswers;
		})
	);
	const pointsForCorrect =
		numQuestions &&
		Math.round((maxIndicesInCommonWithAnAcceptedResponse / numQuestions) * challenge.points);
	const bonusPoints =
		maxIndicesInCommonWithAnAcceptedResponse === numQuestions ? challenge.bonusPoints : 0;
	return pointsForCorrect + bonusPoints + pointsManuallyAwarded(challenge);
};

export { correctAnswer, responseIsCorrect, scoreChallenge, answerIsCorrect };
