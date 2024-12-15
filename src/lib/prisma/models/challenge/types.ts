import type { Challenge, ChallengeResponse } from '@prisma/client';

export type ResponseMinimalInput = {
	responses: { response: string }[];
};
export type GetResponse = <T extends ResponseMinimalInput>(challenge: T) => string;
export type CorrectAnswerFromOptionsMinimalInput = {
	options: { isCorrect: boolean; text: string }[];
};
export type CorrectAnswerFromOptions = <T extends CorrectAnswerFromOptionsMinimalInput>(
	challenge: T
) => string | false | undefined;
export type CorrectAnswerFromAcceptedResponsesMinimalInput = { acceptedResponsesIfOpen: string[] };
export type CorrectAnswerFromAcceptedResponses = <
	T extends CorrectAnswerFromAcceptedResponsesMinimalInput,
>(
	challenge: T
) => string | false | undefined;
export type CorrectAnswerMinimalInput = CorrectAnswerFromOptionsMinimalInput &
	CorrectAnswerFromAcceptedResponsesMinimalInput & {
		type: Challenge['type'];
		prompt: Challenge['prompt'];
	};
export type CorrectAnswer = (challenge: CorrectAnswerMinimalInput) => string | false | undefined;
export type ResponseIsCorrect = <T extends CorrectAnswersMinimalInput>(challenge: T) => boolean;
export type CorrectAnswersMinimalInput = { options: { isCorrect: boolean; text: string }[] } & {
	acceptedResponsesIfOpen: string[];
	type: Challenge['type'];
	prompt: Challenge['prompt'];
} & ResponseMinimalInput;
export type CorrectAnswers = <T extends CorrectAnswersMinimalInput>(challenge: T) => string[];
export type PointsManuallyAwardedMinimalInput = {
	responses: { pointsManuallyAwarded: number | null }[];
};
export type PointsManuallyAwarded = <T extends PointsManuallyAwardedMinimalInput>(
	challenge: T
) => number;
export type ScoreChallengeMinimalInput = CorrectAnswersMinimalInput &
	PointsManuallyAwardedMinimalInput & {
		points: Challenge['points'];
		bonusPoints: Challenge['bonusPoints'];
		type: Challenge['type'];
		prompt: Challenge['prompt'];
		challengeSet: { timeAvailableStart: Date | null; timeAvailableEnd: Date | null } | null;
	};
export type ScoreChallenge = <T extends ScoreChallengeMinimalInput>(
	challenge: T,
	extra: { elfNameChallengeResponse: ChallengeResponse | null }
) => number;
export type ScoreChallenges = <T extends ScoreChallengeMinimalInput>(
	challenges: T[],
	extra: { elfNameChallengeResponse: ChallengeResponse | null }
) => number;
