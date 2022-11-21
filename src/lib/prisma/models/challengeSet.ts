import type { ChallengeSet as DBChallengeSet } from '@prisma/client';
import prismaClient from '../prismaClient';
import { getNow, addKey } from '$lib/utils';

export const challengeSet = Object.assign(prismaClient.challengeSet, {
	// Add custom methods here
});

export class ChallengeSet {
	id: number;
	title: string;
	instructions: string;
	imageId: string;
	timeAvailableStart: Date | null;
	timeAvailableEnd: Date | null;

	constructor(challengeSet: DBChallengeSet) {
		this.id = challengeSet.id;
		this.title = challengeSet.title;
		this.instructions = challengeSet.instructions;
		this.imageId = challengeSet.imageId;
		this.timeAvailableStart = challengeSet.timeAvailableStart;
		this.timeAvailableEnd = challengeSet.timeAvailableEnd;
	}
}

type IsAvailableMinimalInput = { timeAvailableStart: Date | null };
const isAvailable = <T extends IsAvailableMinimalInput>(cs: T) =>
	!!cs.timeAvailableStart && cs.timeAvailableStart <= getNow();

type ChallengesExistMinimalInput = { challenges: unknown[] };
const challengesExist = <T extends ChallengesExistMinimalInput>(cs: T) =>
	Boolean(cs.challenges.length);

type UserHasCompletedMinimalInput = { challengeSetResponses: { completedAt: Date | null }[] };
const userHasCompleted = <T extends UserHasCompletedMinimalInput>(cs: T) =>
	Boolean(cs.challengeSetResponses[0]?.completedAt);

type ResultsUrlMinimalInput = { id: number };
const resultsUrl = <T extends ResultsUrlMinimalInput>(cs: T) => `/challenge-set/${cs.id}/results`;

type UserResponseExistsMinimalInput = { challengeSetResponses: unknown[] };
const userResponseExists = <T extends UserResponseExistsMinimalInput>(cs: T) =>
	Boolean(cs.challengeSetResponses.length);

type NextChallengeMinimalInput = { challenges: { responses: unknown[] }[] };
const nextChallenge = <T extends NextChallengeMinimalInput>(cs: T): T['challenges'][number] =>
	cs.challenges.find((challenge) => !challenge.responses.length) || cs.challenges[0];

type NextChallengeUrlMinimalInput = {
	id: number;
	challenges: { id: number; responses: unknown[] }[];
};
const nextChallengeUrl = <T extends NextChallengeUrlMinimalInput>(cs: T) =>
	`/challenge-set/${cs.id}/challenge/${
		nextChallenge<{
			challenges: T['challenges'];
		}>(cs).id
	}`;

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
