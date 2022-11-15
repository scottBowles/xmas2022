import type { ChallengeSet as DBChallengeSet } from '@prisma/client';
import prismaClient from '../prismaClient';

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
