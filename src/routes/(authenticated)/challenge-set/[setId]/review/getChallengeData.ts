import prisma from '$lib/prisma';
import { displayName } from '$lib/prisma/models/user';
import {
	yourElfNameWorth,
	selectElfName,
	wordle2022,
	wordle2023,
	multipleChoice,
	openResponse,
	offline,
	match,
} from '$lib/prisma/models/challenge/challengeTypeFns';
import { response } from '$lib/prisma/models/challenge/utils';
import { ownElfName } from '$lib/prisma/models/challenge';
import type { Challenge } from '@prisma/client';

type ChallengeQuery = {
	options: {
		id: number;
		text: string;
		challengeId: number;
		isCorrect: boolean;
	}[];
	responses: {
		id: number;
		playerId: number;
		challengeId: number;
		response: string;
		pointsEarned: number | null;
		submittedAfterSetEnd: boolean;
	}[];
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
};

const getChallengeData = async (challenge: ChallengeQuery, user: JwtUser) => {
	const { type } = challenge;
	if (type === 'OFFLINE')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: null,
			allElfNames: null,
			...challenge,
		};
	if (type === 'WORDLE')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: null,
			allElfNames: null,
			...challenge,
		};
	if (type === 'WORDLE_2023')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: null,
			allElfNames: null,
			...challenge,
		};
	if (type === 'MULTIPLE_CHOICE')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: null,
			allElfNames: null,
			...challenge,
		};
	if (type === 'OPEN_RESPONSE')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: null,
			allElfNames: null,
			...challenge,
		};
	if (type === 'MATCH')
		return {
			correctAnswer: challengeTypeFns[type].correctAnswer(challenge),
			response: response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
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
			response: response(challenge),
			responseIsCorrect: challengeTypeFns[type].responseIsCorrect(challenge),
			ownElfName: ownElfName(challenge),
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
			response: response(challenge),
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
