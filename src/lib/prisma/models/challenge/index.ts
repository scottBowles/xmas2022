import type { Challenge } from '@prisma/client';
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
} from './challengeTypeFns';
import type { ScoreChallenge, ScoreChallenges } from './types';
import { response } from './utils';

type IsLastMinimalInput = { challenges: Pick<Challenge, 'id' | 'type'>[] };
type IsLast = <T extends IsLastMinimalInput>(
	challengeSet: T
) => (challenge: T['challenges'][number]) => boolean;

type OwnElfNameMinimalInput = { responses: { response: string }[]; type: Challenge['type'] };
type OwnElfName = <T extends OwnElfNameMinimalInput>(challenge: T) => string | null;

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
		return yourElfNameWorth.scoreChallenge(challenge, extra);
	if (challenge.type === 'OFFLINE') return offline.scoreChallenge(challenge, extra);
	if (challenge.type === 'MATCH') return match.scoreChallenge(challenge, extra);
	if (challenge.type === 'SANTAS_WORKSHOP') return santasWorkshop.scoreChallenge(challenge, extra);
	if (challenge.type === 'MULTIPLE_OPEN_RESPONSE')
		return multipleOpenResponse.scoreChallenge(challenge, extra);
	if (challenge.type === 'WIN_LOSE_OR_STOP') return winLoseOrStop.scoreChallenge(challenge, extra);
	if (challenge.type === 'FAMILY_FEUD') return familyFeud.scoreChallenge(challenge, extra);
	if (challenge.type === 'FRAMED') return framed.scoreChallenge(challenge, extra);
	return 0;
};

const scoreChallenges: ScoreChallenges = (challenges, extra) =>
	challenges.reduce((acc, challenge) => acc + scoreChallenge(challenge, extra), 0);

type OrderedChildren = <T extends Challenge>(challenge: { children: T[] }) => T[];

// Order children such that those with an order come first, then those without an order.
// If two children have the same order, sort by createdAt
const orderedChildren: OrderedChildren = (challenge) =>
	challenge.children.sort((a, b) => {
		if (a.order !== null && b.order !== null) {
			return a.order - b.order;
		}
		if (a.order !== null) return -1;
		if (b.order !== null) return 1;
		return a.createdAt.getTime() - b.createdAt.getTime();
	});

const CHLG = { isLast, ownElfName, response, scoreChallenges, orderedChildren };

export default CHLG;
