import { getNow, addKey, urls } from '$lib/utils';
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
type NextChallenge = <T extends { challenges: { id: number; responses?: unknown[] }[] }>(
	challengeSet: T,
	lastChallengeId?: number
) => T['challenges'][number];
type NextChallengeUrl = <
	T extends {
		id: number;
		challenges: { id: number; responses?: unknown[] }[];
	}
>(
	challengeSet: T,
	lastChallengeId?: number
) => string;

/**
 * CHALLENGE SET COMPUTED PROPERTIES
 * Functions to help work with ChallengeSet objects.
 * These all take a partial ChallengeSet object as their sole argument.
 */
const isAvailable: IsAvailable = (challengeSet) =>
	!!challengeSet.timeAvailableStart && challengeSet.timeAvailableStart <= getNow();

const challengesExist: ChallengesExist = (challengeSet) => Boolean(challengeSet.challenges.length);

const userHasCompleted: UserHasCompleted = (challengeSet) =>
	Boolean(challengeSet.challengeSetResponses[0]?.completedAt);

const resultsUrl: ResultsUrl = (challengeSet) => urls.challengeSetResults(challengeSet.id);

const userResponseExists: UserResponseExists = (challengeSet) =>
	Boolean(challengeSet.challengeSetResponses.length);

const nextChallenge: NextChallenge = (challengeSet, lastChallengeId) => {
	if (lastChallengeId) {
		const lastChallengeIndex = challengeSet.challenges.findIndex(
			(challenge) => challenge.id === lastChallengeId
		);
		if (lastChallengeIndex === -1) throw new Error('Challenge not found');
		if (lastChallengeIndex === challengeSet.challenges.length - 1)
			return challengeSet.challenges[0];
		return challengeSet.challenges[lastChallengeIndex + 1];
	}
	return (
		challengeSet.challenges.find(
			(challenge) => challenge.responses && !challenge.responses.length
		) || challengeSet.challenges[0]
	);
};

const nextChallengeUrl: NextChallengeUrl = (challengeSet, lastChallengeId) =>
	urls.challenge(challengeSet.id, nextChallenge(challengeSet, lastChallengeId).id);

/**
 * ADD FUNCTIONS
 * Functions to add computed properties to ChallengeSet objects.
 * These all take a partial ChallengeSet object as their sole argument and
 * return a like object with the computed property added.
 */
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
