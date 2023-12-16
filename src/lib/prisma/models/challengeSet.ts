import { getNow, addKey, urls } from '$lib/utils';
import type { WithMinimumInput } from '$lib/utils/types';
import type { Challenge } from '.prisma/client';
import { sum } from 'ramda';

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
type NextChallenge = <
	T extends { challenges: (Pick<Challenge, 'id' | 'type'> & { responses?: unknown[] })[] }
>(
	challengeSet: T,
	lastChallengeId?: number
) => T['challenges'][number];
type NextChallengeUrl = <
	T extends {
		id: number;
		challenges: (Pick<Challenge, 'id' | 'type'> & { responses?: unknown[] })[];
	}
>(
	challengeSet: T,
	lastChallengeId?: number
) => string;
type NumScoreboardStats = <
	T extends {
		isTimed: boolean;
		isScored: boolean;
		hasBonusPoints?: boolean;
		hasTimeBonusPoints?: boolean;
	}
>(
	challenge: T
) => number;
type YearFn = WithMinimumInput<{ timeAvailableStart: Date | null }, string>;

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

const nextChallenge: NextChallenge = (challengeSet, thisChallengeId) => {
	const challenges = challengeSet.challenges;
	if (thisChallengeId) {
		const thisChallengeIndex = challenges.findIndex(
			(challenge) => challenge.id === thisChallengeId
		);
		if (thisChallengeIndex === -1) throw new Error('Challenge not found');
		if (thisChallengeIndex === challenges.length - 1) return challenges[0];
		return challenges[thisChallengeIndex + 1];
	}
	// This is from when we were redirecting to the first incomplete challenge rather than
	// the first challenge. If we add navigation between challenges, this might make sense.
	// return (
	// 	challengeSet.challenges.find(
	// 		(challenge) => challenge.responses && !challenge.responses.length
	// 	) || challengeSet.challenges[0]
	// );
	return challenges[0];
};

const nextChallengeUrl: NextChallengeUrl = (challengeSet, lastChallengeId) =>
	urls.challenge(challengeSet.id, nextChallenge(challengeSet, lastChallengeId).id);

const numScoreboardStats: NumScoreboardStats = ({
	isTimed,
	isScored,
	hasBonusPoints,
	hasTimeBonusPoints,
}) => sum([isTimed, isScored, hasBonusPoints, hasTimeBonusPoints].map((a) => (a ? 1 : 0)));

const year: YearFn = (challengeSet) => {
	if (!challengeSet.timeAvailableStart) return 'Unknown';
	return new Date(challengeSet.timeAvailableStart).getFullYear().toString();
};

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
const addYear = addKey('year', year);

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
	addNextChallengeUrl,
	numScoreboardStats,
	year,
	addYear,
};
