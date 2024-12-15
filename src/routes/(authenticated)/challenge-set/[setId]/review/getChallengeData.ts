import prisma from '$lib/prisma';
import CHLG from '$lib/prisma/models/challenge';
import {
	familyFeud,
	framed,
	match,
	multipleChoice,
	multipleOpenResponse,
	offline,
	openResponse,
	santasWorkshop,
	selectElfName,
	winLoseOrStop,
	wordle2022,
	wordle2023,
	yourElfNameWorth,
} from '$lib/prisma/models/challenge/challengeTypeFns';
import { displayName } from '$lib/prisma/models/user';
import type { Challenge } from '@prisma/client';

type QOption = {
	id: number;
	text: string;
	challengeId: number;
	isCorrect: boolean;
};

type QCldImage = {
	id: number;
	publicId: string;
	createdAt: Date;
	updatedAt: Date;
	height: number;
	width: number;
	alt: string | null;
};

type QResponse = {
	id: number;
	playerId: number;
	challengeId: number;
	response: string;
	pointsEarned: number | null;
	submittedAfterSetEnd: boolean;
	pointsManuallyAwarded: number | null;
};

type ChallengeQuery = {
	options: QOption[];
	responses: QResponse[];
	cldImages: QCldImage[];
	children: ({
		cldImages: QCldImage[];
		responses: QResponse[];
	} & Challenge)[];
	challengeSet: {
		timeAvailableStart: Date | null;
		timeAvailableEnd: Date | null;
	} | null;
} & Challenge;

const challengeTypeFns = {
	OFFLINE: offline,
	WORDLE: wordle2022,
	WORDLE_2023: wordle2023,
	MULTIPLE_CHOICE: multipleChoice,
	OPEN_RESPONSE: openResponse,
	SELECT_ELF_NAME: selectElfName,
	YOUR_ELF_NAME_WORTH: yourElfNameWorth,
	MATCH: match,
	SANTAS_WORKSHOP: santasWorkshop,
	MULTIPLE_OPEN_RESPONSE: multipleOpenResponse,
	WIN_LOSE_OR_STOP: winLoseOrStop,
	FAMILY_FEUD: familyFeud,
	FRAMED: framed,
};

const getChallengeData = async (challenge: ChallengeQuery, user: JwtUser) => {
	const { type } = challenge;
	if (type === 'OFFLINE')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: CHLG.response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: null,
			allElfNames: null,
			...challenge,
		};
	if (type === 'WORDLE')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: CHLG.response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: null,
			allElfNames: null,
			...challenge,
		};
	if (type === 'WORDLE_2023')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: CHLG.response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: null,
			allElfNames: null,
			...challenge,
		};
	if (type === 'MULTIPLE_CHOICE')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: CHLG.response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: null,
			allElfNames: null,
			...challenge,
		};
	if (type === 'OPEN_RESPONSE')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: CHLG.response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: null,
			allElfNames: null,
			...challenge,
		};
	if (type === 'MATCH')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: CHLG.response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: null,
			allElfNames: null,
			...challenge,
		};
	if (type === 'MULTIPLE_OPEN_RESPONSE')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: CHLG.response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: null,
			allElfNames: null,
			...challenge,
		};
	if (type === 'SANTAS_WORKSHOP')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: CHLG.response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: null,
			allElfNames: null,
			...challenge,
		};
	if (type === 'WIN_LOSE_OR_STOP')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: CHLG.response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: null,
			allElfNames: null,
			...challenge,
		};
	if (type === 'FAMILY_FEUD')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: CHLG.response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: null,
			allElfNames: null,
			...challenge,
		};
	if (type === 'FRAMED')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: CHLG.response(challenge),
			responseIsCorrect: null,
			ownElfName: null,
			allElfNames: null,
			...challenge,
		};
	if (type === 'SELECT_ELF_NAME') {
		const elfNameQuery = await prisma.challengeResponse.findMany({
			where: { challengeId: challenge.id },
			include: {
				player: {
					select: {
						email: true,
						firstName: true,
						lastName: true,
						username: true,
					},
				},
			},
		});
		const allElfNames = elfNameQuery.map((response) => {
			const { selectedFirstName, selectedLastName } = JSON.parse(response.response || '{}');
			return {
				player: displayName(response.player),
				elfFirstName: selectedFirstName,
				elfLastName: selectedLastName,
			} as { player: string; elfFirstName: string; elfLastName: string };
		});
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: CHLG.response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: CHLG.ownElfName(challenge),
			allElfNames,
			...challenge,
		};
	}
	if (type === 'YOUR_ELF_NAME_WORTH') {
		const elfNameResponse = await prisma.challengeResponse.findFirst({
			where: { playerId: user.id, challenge: { type: 'SELECT_ELF_NAME' } },
			orderBy: { createdAt: 'desc' },
		});
		const { selectedFirstName, selectedLastName } = JSON.parse(elfNameResponse?.response || '{}');
		const elfName = `${selectedFirstName} ${selectedLastName}`;
		return {
			correctAnswer: yourElfNameWorth.correctAnswer(challenge, elfNameResponse),
			response: CHLG.response(challenge),
			responseIsCorrect: yourElfNameWorth.responseIsCorrect(challenge, elfNameResponse),
			ownElfName: elfName,
			allElfNames: null,
			...challenge,
		};
	}
	return {
		correctAnswer: null,
		response: null,
		responseIsCorrect: null,
		ownElfName: null,
		allElfNames: null,
		...challenge,
	};
};

export default getChallengeData;
