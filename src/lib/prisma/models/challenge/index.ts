import { addKey } from '$lib/utils';
import type { Challenge, ChallengeResponse } from '@prisma/client';
import { response } from './utils';
import * as multipleChoice from './multipleChoice';
import * as openResponse from './openResponse';
import * as selectElfName from './selectElfName';
import * as wordle2022 from './wordle2022';
import * as wordle2023 from './wordle2023';
import * as yourElfNameWorth from './yourElfNameWorth';
import * as offline from './offline';

type IsLastMinimalInput = { challenges: Pick<Challenge, 'id' | 'type'>[] };
type IsLast = <T extends IsLastMinimalInput>(
	challengeSet: T
) => (challenge: T['challenges'][number]) => boolean;

type ResponseMinimalInput = { responses: { response: string }[] };
type OwnElfNameMinimalInput = { responses: { response: string }[]; type: Challenge['type'] };
type OwnElfName = <T extends OwnElfNameMinimalInput>(challenge: T) => string | null;

type CorrectAnswersMinimalInput = { options: { isCorrect: boolean; text: string }[] } & {
	acceptedResponsesIfOpen: string[];
	type: Challenge['type'];
} & ResponseMinimalInput;

type ScoreChallengeMinimalInput = CorrectAnswersMinimalInput & {
	points: Challenge['points'];
	type: Challenge['type'];
};
type ScoreChallenge = <T extends ScoreChallengeMinimalInput>(
	challenge: T,
	extra: { elfNameChallengeResponse: ChallengeResponse | null }
) => number;
type ScoreChallenges = <T extends ScoreChallengeMinimalInput>(
	challenges: T[],
	extra: { elfNameChallengeResponse: ChallengeResponse | null }
) => number;

const isLast: IsLast = (challengeSet) => (challenge) => {
	const { challenges } = challengeSet;
	return challenges[challenges.length - 1].id === challenge.id;
};

const ownElfName: OwnElfName = (challenge) => {
	if (challenge.type !== 'SELECT_ELF_NAME') return null;
	const ownElfNameJson = response(challenge);
	const { selectedFirstName, selectedLastName } = JSON.parse(ownElfNameJson || '{}');
	return `${selectedFirstName} ${selectedLastName}`;
};

const scoreChallenge: ScoreChallenge = (challenge, extra) => {
	if (challenge.type === 'WORDLE') return wordle2022.scoreChallenge(challenge, extra);
	if (challenge.type === 'WORDLE_2023') return wordle2023.scoreChallenge(challenge, extra);
	if (challenge.type === 'MULTIPLE_CHOICE') return multipleChoice.scoreChallenge(challenge, extra);
	if (challenge.type === 'OPEN_RESPONSE') return openResponse.scoreChallenge(challenge, extra);
	if (challenge.type === 'SELECT_ELF_NAME') return selectElfName.scoreChallenge(challenge, extra);
	if (challenge.type === 'YOUR_ELF_NAME_WORTH')
		return yourElfNameWorth.scoreChallenge(challenge, extra.elfNameChallengeResponse);
	if (challenge.type === 'OFFLINE') return offline.scoreChallenge(challenge, extra);
	return 0;
};

const scoreChallenges: ScoreChallenges = (challenges, extra) =>
	challenges.reduce((acc, challenge) => acc + scoreChallenge(challenge, extra), 0);

const addIsLast = <T extends { challenges: { id: number; type: Challenge['type'] }[] }>(
	challengeSet: T
) => addKey('isLast', isLast(challengeSet));

export { isLast, ownElfName, response, scoreChallenge, scoreChallenges, addIsLast };