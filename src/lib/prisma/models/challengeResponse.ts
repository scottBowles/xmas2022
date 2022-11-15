import type { ChallengeResponse as DBChallengeResponse } from '@prisma/client';
import prismaClient from '../prismaClient';

export const challengeResponse = Object.assign(prismaClient.challengeResponse, {
	// Add custom methods here
});

export class ChallengeResponse {
	id: number;
	playerId: number;
	challengeId: number;
	response: string;
	pointsEarned: number | null;
	pointsManuallyAwarded: number | null;
	createdAt: Date;
	updatedAt: Date;
	submittedBeforeSetStart: boolean;
	submittedAfterSetEnd: boolean;

	constructor(challengeResponse: DBChallengeResponse) {
		this.id = challengeResponse.id;
		this.playerId = challengeResponse.playerId;
		this.challengeId = challengeResponse.challengeId;
		this.response = challengeResponse.response;
		this.pointsEarned = challengeResponse.pointsEarned;
		this.pointsManuallyAwarded = challengeResponse.pointsManuallyAwarded;
		this.createdAt = challengeResponse.createdAt;
		this.updatedAt = challengeResponse.updatedAt;
		this.submittedBeforeSetStart = challengeResponse.submittedBeforeSetStart;
		this.submittedAfterSetEnd = challengeResponse.submittedAfterSetEnd;
	}
}
