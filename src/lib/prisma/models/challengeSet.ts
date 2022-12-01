import { getNow, addKey } from '$lib/utils';
import type { WithMinimumInput } from '$lib/utils/types';

/**
 * TYPES for what follows
 */
type IsAvailable = WithMinimumInput<{ timeAvailableStart: Date | null }, boolean>;
type ChallengesExist = WithMinimumInput<{ challenges: unknown[] }, boolean>;
type UserHasCompleted = WithMinimumInput<
	{ challengeSetResponses: { completedAt: Date | null }[] },
	boolean
>;
type ResultsUrl = WithMinimumInput<{ id: number }, string>;
type UserResponseExists = WithMinimumInput<{ challengeSetResponses: unknown[] }, boolean>;
type NextChallenge = <T extends { challenges: { responses: unknown[] }[] }>(
	challengeSet: T
) => T['challenges'][number];
type NextChallengeUrl = WithMinimumInput<
	{
		id: number;
		challenges: { id: number; responses: unknown[] }[];
	},
	string
>;

/**
 * HELPERS
 * Functions to help work with ChallengeSet objects
 */
const isAvailable: IsAvailable = (challengeSet) =>
	!!challengeSet.timeAvailableStart && challengeSet.timeAvailableStart <= getNow();

const challengesExist: ChallengesExist = (challengeSet) => Boolean(challengeSet.challenges.length);

const userHasCompleted: UserHasCompleted = (challengeSet) =>
	Boolean(challengeSet.challengeSetResponses[0]?.completedAt);

const resultsUrl: ResultsUrl = (challengeSet) => `/challenge-set/${challengeSet.id}/results`;

const userResponseExists: UserResponseExists = (challengeSet) =>
	Boolean(challengeSet.challengeSetResponses.length);

const nextChallenge: NextChallenge = (challengeSet) =>
	challengeSet.challenges.find((challenge) => !challenge.responses.length) ||
	challengeSet.challenges[0];

const nextChallengeUrl: NextChallengeUrl = (challengeSet) =>
	`/challenge-set/${challengeSet.id}/challenge/${nextChallenge(challengeSet).id}`;

const addIsAvailable = addKey('isAvailable', isAvailable);
const addChallengesExist = addKey('challengesExist', challengesExist);
const addUserHasCompleted = addKey('userHasCompleted', userHasCompleted);
const addResultsUrl = addKey('resultsUrl', resultsUrl);
const addUserResponseExists = addKey('userResponseExists', userResponseExists);
const addNextChallenge = addKey('nextChallenge', nextChallenge);
const addNextChallengeUrl = addKey('nextChallengeUrl', nextChallengeUrl);

export {
	isAvailable,
	addIsAvailable,
	challengesExist,
	addChallengesExist,
	userHasCompleted,
	addUserHasCompleted,
	resultsUrl,
	addResultsUrl,
	userResponseExists,
	addUserResponseExists,
	nextChallenge,
	addNextChallenge,
	nextChallengeUrl,
	addNextChallengeUrl
};
