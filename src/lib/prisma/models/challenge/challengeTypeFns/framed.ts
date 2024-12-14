import {
	correctAnswerFromAcceptedResponses,
	normalize,
	pointsManuallyAwarded,
	response,
} from '../utils';
import type {
	CorrectAnswer,
	CorrectAnswersMinimalInput,
	ResponseIsCorrect,
	ScoreChallenge,
} from '../types';
import { jsonSafeParse } from '$lib/utils';
import { z } from 'zod';
import CHLG from '..';

const responsesSchema = z.array(z.string());

const correctAnswer: CorrectAnswer = correctAnswerFromAcceptedResponses;

const parseResponse = <T extends CorrectAnswersMinimalInput>(challenge: T) =>
	responsesSchema.safeParse(jsonSafeParse(CHLG.response(challenge))).data ?? [];

const responseIsCorrect: ResponseIsCorrect = (challenge) =>
	parseResponse(challenge).some((response) =>
		challenge.acceptedResponsesIfOpen.map(normalize).includes(normalize(response))
	);

const scoreChallenge: ScoreChallenge = (challenge) => {
	const responses = (
		responsesSchema.safeParse(jsonSafeParse(CHLG.response(challenge))).data ?? []
	).map((response) => ({
		response,
		isCorrect: challenge.acceptedResponsesIfOpen.map(normalize).includes(normalize(response)),
	}));

	const pointsPerRemaining = challenge.points / 6;
	const correctIndex = responses.findIndex((r) => r.isCorrect);
	if (correctIndex === -1) return 0;
	return pointsPerRemaining * (6 - correctIndex);
};

export { correctAnswer, responseIsCorrect, scoreChallenge };
