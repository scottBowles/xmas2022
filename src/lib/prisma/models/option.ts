import type { Option as DBOption } from '@prisma/client';
import prismaClient from '../prismaClient';

export const option = Object.assign(prismaClient.option, {
	// Add custom methods here
});

export class Option {
	id: number;
	text: string;
	challengeId: number;
	isCorrect: boolean;

	constructor(option: DBOption) {
		this.id = option.id;
		this.text = option.text;
		this.challengeId = option.challengeId;
		this.isCorrect = option.isCorrect;
	}
}
