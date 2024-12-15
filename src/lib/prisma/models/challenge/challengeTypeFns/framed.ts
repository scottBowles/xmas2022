import { jsonSafeParse } from '$lib/utils';
import { z } from 'zod';
import CHLG from '..';
import type {
	CorrectAnswer,
	CorrectAnswersMinimalInput,
	ResponseIsCorrect,
	ScoreChallenge,
} from '../types';
import { correctAnswerFromAcceptedResponses, normalize } from '../utils';

const responsesSchema = z.array(z.string());

const correctAnswer: CorrectAnswer = correctAnswerFromAcceptedResponses;

const parseResponse = <T extends CorrectAnswersMinimalInput>(challenge: T) =>
	responsesSchema.safeParse(jsonSafeParse(CHLG.response(challenge))).data ?? [];

const subResponseIsCorrect = <T extends CorrectAnswersMinimalInput>(
	response: string,
	challenge: T
) => challenge.acceptedResponsesIfOpen.map(normalize).includes(normalize(response));

const responseIsCorrect: ResponseIsCorrect = (challenge) =>
	parseResponse(challenge).some((response) => subResponseIsCorrect(response, challenge));

const scoreChallenge: ScoreChallenge = (challenge) => {
	const responses = parseResponse(challenge).map((response) => ({
		response,
		isCorrect: subResponseIsCorrect(response, challenge),
	}));

	const correctIndex = responses.findIndex((r) => r.isCorrect);
	if (correctIndex === -1) return 10;

	const gotItIn = correctIndex + 1;
	if (gotItIn === 1) return 50;
	if (gotItIn === 2) return 40;
	if (gotItIn === 3) return 30;
	if (gotItIn === 4) return 25;
	if (gotItIn === 5) return 20;
	if (gotItIn === 6) return 15;
	return 0; // shouldn't happen
};

export { correctAnswer, parseResponse, responseIsCorrect, scoreChallenge, subResponseIsCorrect };
