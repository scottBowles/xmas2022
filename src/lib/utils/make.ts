import prisma from '$lib/prisma';
import type { ChallengeType } from '@prisma/client';
import { z } from 'zod';

const makeChallengeWithOwnChallengeSet = async (
	day: string,
	setData: {
		title: string;
		instructions: string;
		isTimed: boolean;
	},
	challengeData: {
		title: string;
		prompt: string;
		acceptedResponsesIfOpen?: string[];
		scoreOnSubmit: boolean;
		options?: {
			createMany: {
				data: { text: string; isCorrect: boolean }[];
			};
		};
		type: ChallengeType;
		points: number;
		bonusPoints?: number;
		matches?: string[];
		matchOptions?: string[];
		order?: number;
		cldImages?: {
			publicId: string;
			height: number;
			width: number;
			order?: number;
		}[];
	}
) => {
	const date = new Date(day);
	const { cldImages, ...chlgData } = challengeData;
	// the time to start should be the day given at 2am
	// the time to end should be 24 hours after the start
	// because of time zones,
	// `new Date(date.getFullYear(), date.getMonth(), date.getDate(), 2)`
	// will be 2am the day before the given day
	// const timeAvailableEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 2);
	// const oneDay = 24 * 60 * 60 * 1000;
	// const timeAvailableStart = new Date(timeAvailableEnd.getTime() - oneDay);
	const dayBefore = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 2);
	const oneDay = 24 * 60 * 60 * 1000;
	const timeAvailableStart = new Date(dayBefore.getTime() + oneDay);
	const timeAvailableEnd = new Date(timeAvailableStart.getTime() + oneDay);
	const challengeSet = await prisma.challengeSet.create({
		data: {
			timeAvailableStart,
			timeAvailableEnd,
			isScored: true,
			...setData,
		},
	});
	const savedImages =
		cldImages &&
		(await prisma.cldImage.createManyAndReturn({
			data: cldImages,
			skipDuplicates: true,
		}));
	const challenge = await prisma.challenge.create({
		data: {
			challengeSetId: challengeSet.id,
			...chlgData,
			cldImages: savedImages && { connect: savedImages.map((img) => ({ id: img.id })) },
		},
	});
	return challenge;
};

const WORDLE_2024_INSTRUCTIONS = `<p>This will be a wordle. If you don't know what a wordle is, let me know and I will add a full explanation.</p><br /><p class="mt-2">The points for this are:</p><br />1 guess - 50 points<br />2 guesses - 40 points<br />3 guesses - 30 points<br />4 guesses - 25 points<br />5 guesses - 20 points<br />6 guesses - 15 points<br />Just for playing — 10 points<br />`;

export const makeWordleSchema = z.object({
	day: z.string(),
	word: z.string(),
	title: z.string(),
});

export type MakeWordleSchemaArgs = z.infer<typeof makeWordleSchema>;

export const makeWordle = ({ day, word, title }: MakeWordleSchemaArgs) => {
	return makeChallengeWithOwnChallengeSet(
		day,
		{
			title,
			instructions: WORDLE_2024_INSTRUCTIONS,
			isTimed: false,
		},
		{
			title: 'Wordle',
			prompt: 'Wordle',
			acceptedResponsesIfOpen: [word.toUpperCase()],
			scoreOnSubmit: true,
			type: 'WORDLE_2023',
			points: 50,
		}
	);
};

export const makeFramedSchema = z.object({
	day: z.string(),
	setTitle: z.string(),
	acceptedResponses: z.array(z.string()),
	images: z.array(z.string()),
});

export type MakeFramedSchemaArgs = z.infer<typeof makeFramedSchema>;

export const makeFramed = ({ day, setTitle, acceptedResponses, images }: MakeFramedSchemaArgs) =>
	makeChallengeWithOwnChallengeSet(
		day,
		{
			title: setTitle,
			instructions: `<p>Use the images provided to guess the name of the movie.</p><br /><p>Each incorrect guess unveils a new frame from the movie.</p><br /><p>There are 6 frames in total.</p><br /><p class="mt-2">The points for this are:</p><br />1 guess - 50 points<br />2 guesses - 40 points<br />3 guesses - 30 points<br />4 guesses - 25 points<br />5 guesses - 20 points<br />6 guesses - 15 points<br />Just for playing — 10 points<br />`,
			isTimed: false,
		},
		{
			title: 'Framed',
			prompt: 'Guess the movie',
			acceptedResponsesIfOpen: acceptedResponses,
			scoreOnSubmit: true,
			type: 'FRAMED',
			points: 50,
			cldImages: images.map((publicId, i) => ({
				publicId,
				height: 350,
				width: 0,
				order: i + 1,
			})),
		}
	);

export const makeMultipleOpenResponseSchema = z.object({
	day: z.string(),
	setTitle: z.string(),
	setInstructions: z.string(),
	challengeTitle: z.string(),
	prompt: z.object({
		mainPrompt: z.string(),
		inputPrompts: z.array(z.string()).optional(),
	}),
	acceptedResponses: z.array(z.array(z.string())),
	points: z.number(),
	bonusPoints: z.number(),
	isTimed: z.boolean(),
});

export type MakeMultipleChoiceOpenResponseArgs = z.infer<typeof makeMultipleOpenResponseSchema>;

export const makeMultipleOpenResponse = ({
	day,
	setTitle,
	setInstructions,
	challengeTitle,
	prompt,
	acceptedResponses, // an array of accepted for each prompt
	points,
	bonusPoints,
	isTimed,
}: MakeMultipleChoiceOpenResponseArgs) =>
	makeChallengeWithOwnChallengeSet(
		day,
		{
			title: setTitle,
			instructions: setInstructions,
			isTimed,
		},
		{
			title: challengeTitle,
			prompt: JSON.stringify(prompt),
			acceptedResponsesIfOpen: [JSON.stringify(acceptedResponses)],
			scoreOnSubmit: true,
			type: 'MULTIPLE_OPEN_RESPONSE',
			points,
			bonusPoints,
		}
	);

export const makeMatchSchema = z.object({
	day: z.string(),
	setTitle: z.string(),
	setInstructions: z.string(),
	challengeTitle: z.string(),
	prompt: z.string(),
	acceptedResponses: z.array(z.array(z.string())),
	matches: z.array(z.string()),
	matchOptions: z.array(z.string()),
	points: z.number(),
	bonusPoints: z.number(),
	isTimed: z.boolean(),
});

export type MakeMatchArgs = z.infer<typeof makeMatchSchema>;

export const makeMatch = ({
	day,
	setTitle,
	setInstructions,
	challengeTitle,
	prompt,
	acceptedResponses,
	matches,
	matchOptions,
	points,
	bonusPoints,
	isTimed,
}: MakeMatchArgs) =>
	makeChallengeWithOwnChallengeSet(
		day,
		{
			title: setTitle,
			instructions: setInstructions,
			isTimed,
		},
		{
			title: challengeTitle,
			prompt,
			acceptedResponsesIfOpen: acceptedResponses.map((ar) => JSON.stringify(ar)),
			scoreOnSubmit: true,
			type: 'MATCH',
			points,
			bonusPoints,
			matches,
			matchOptions,
		}
	);
