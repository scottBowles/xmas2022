import type { ChallengeSetResponse as DBChallengeSetResponse } from '@prisma/client';
import prismaClient from '../prismaClient';

export const challengeSetResponse = Object.assign(prismaClient.challengeSetResponse, {
	// Add custom methods here
});

export class ChallengeSetResponse {
	id: number;
	playerId: number;
	challengeSetId: number;
	startedAt: Date | null;
	completedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
	clientRecordedTime: number | null;

	constructor(challengeSetResponse: DBChallengeSetResponse) {
		this.id = challengeSetResponse.id;
		this.playerId = challengeSetResponse.playerId;
		this.challengeSetId = challengeSetResponse.challengeSetId;
		this.startedAt = challengeSetResponse.startedAt;
		this.completedAt = challengeSetResponse.completedAt;
		this.createdAt = challengeSetResponse.createdAt;
		this.updatedAt = challengeSetResponse.updatedAt;
		this.clientRecordedTime = challengeSetResponse.clientRecordedTime;
	}
}
