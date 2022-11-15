import type { Challenge as DBChallenge } from '@prisma/client';
import prismaClient from '../prismaClient';

export const challenge = Object.assign(prismaClient.challenge, {
	// Add custom methods here
});

export class Challenge {
	id: number;
	title: string;
	prompt: string;
	acceptedResponsesIfOpen: string[];
	scoreOnSubmit: boolean;
	challengeSetId: number;

	constructor(challenge: DBChallenge) {
		this.id = challenge.id;
		this.title = challenge.title;
		this.prompt = challenge.prompt;
		this.acceptedResponsesIfOpen = challenge.acceptedResponsesIfOpen;
		this.scoreOnSubmit = challenge.scoreOnSubmit;
		this.challengeSetId = challenge.challengeSetId;
	}
}
