import prisma from '$lib/prisma';

type RetrievedChallengeSet = NonNullable<Awaited<ReturnType<typeof getDbChallengeSet>>>;

const getDbChallengeSet = async (id: number, userId: number) => {
	const challengeSet = await prisma.challengeSet.findUnique({
		where: { id },
		select: {
			id: true,
			timeAvailableStart: true,
			challengeSetResponses: {
				where: { playerId: userId },
				select: { startedAt: true, completedAt: true }
			},
			challenges: {
				select: {
					id: true,
					responses: { select: { response: true }, where: { playerId: userId } }
				},
				orderBy: { id: 'asc' }
			}
		}
	});
	return challengeSet;
};

class ActionChallengeSet {
	id: number;
	timeAvailableStart: Date | null;
	challengeSetResponses: {
		startedAt: Date | null;
		completedAt: Date | null;
	}[];
	challenges: {
		id: number;
		responses: {
			response: string;
		}[];
	}[];

	constructor(private challengeSet: RetrievedChallengeSet) {
		this.id = challengeSet.id;
		this.timeAvailableStart = challengeSet.timeAvailableStart;
		this.challengeSetResponses = challengeSet.challengeSetResponses;
		this.challenges = challengeSet.challenges;
	}

	/**
	 * Does the challenge set have a start time and has it past?
	 */
	get isAvailable() {
		return Boolean(this.timeAvailableStart && this.timeAvailableStart < new Date());
	}

	/**
	 * Does the challenge set have any challenges?
	 */
	get challengesExist() {
		return Boolean(this.challenges?.length);
	}

	get userHasCompleted() {
		return Boolean(this.challengeSetResponses[0]?.completedAt);
	}

	/**
	 * Url for the results page for this challenge set
	 */
	get resultsUrl() {
		return `/challenge-set/${this.id}/results`;
	}

	get userResponseExists() {
		return Boolean(this.challengeSetResponses.length);
	}

	/**
	 * The first challenge that the user has not completed, if one exists.
	 * The first challenge otherwise.
	 */
	get nextChallenge() {
		const firstIncompleteChallenge = this.challenges.find(
			(challenge) => !challenge.responses.length
		);
		const nextChallenge = firstIncompleteChallenge || this.challenges[0];
		return nextChallenge;
	}

	get nextChallengeUrl() {
		return `/challenge-set/${this.id}/challenge/${this.nextChallenge.id}`;
	}
}

const getActionChallengeSet = async (id: number, userId: number) => {
	const challengeSet = await getDbChallengeSet(id, userId);
	if (!challengeSet) return null;
	return new ActionChallengeSet(challengeSet);
};

export default getActionChallengeSet;
