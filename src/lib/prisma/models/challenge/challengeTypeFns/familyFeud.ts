import { normalize, pointsManuallyAwarded, response } from '../utils';
import type {
	CorrectAnswer,
	ResponseIsCorrect,
	ScoreChallenge,
	ScoreChallengeMinimalInput,
} from '../types';

const correctAnswer: CorrectAnswer = (challenge) => {
	const acceptedResponses = JSON.parse(challenge.acceptedResponsesIfOpen[0] || '[]');
	const topAnswer = acceptedResponses[0][0];
	const secondAnswer = acceptedResponses[1][0];
	const thirdAnswer = acceptedResponses[2][0];
	return `1. ${topAnswer}, 2. ${secondAnswer}, 3. ${thirdAnswer}`;
};

const responseIsCorrect: ResponseIsCorrect = (challenge) => {
	const acceptedResponses = JSON.parse(challenge.acceptedResponsesIfOpen[0] || '[]');
	const allAccepted = acceptedResponses.flat();
	const givenResponse = response(challenge);
	return allAccepted.map(normalize).includes(normalize(givenResponse || ''));
};

const pointsForCorrect = <T extends ScoreChallengeMinimalInput>(challenge: T) => {
	const acceptedResponses = JSON.parse(challenge.acceptedResponsesIfOpen[0] || '[]');
	const acceptedTopAnswers = acceptedResponses[0].map(normalize);
	const acceptedSecondAnswers = acceptedResponses[1].map(normalize);
	const acceptedThirdAnswers = acceptedResponses[2].map(normalize);
	const givenResponse = normalize(response(challenge));
	const pointsForCorrect = acceptedTopAnswers.includes(givenResponse)
		? 3
		: acceptedSecondAnswers.includes(givenResponse)
		? 2
		: acceptedThirdAnswers.includes(givenResponse)
		? 1
		: 0;

	return pointsForCorrect;
};

const scoreChallenge: ScoreChallenge = (challenge) =>
	pointsForCorrect(challenge) + pointsManuallyAwarded(challenge);

export { correctAnswer, responseIsCorrect, scoreChallenge, pointsForCorrect };
