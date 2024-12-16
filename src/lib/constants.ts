import { ChallengeType } from '@prisma/client';
import type { ValueOf } from './utils/types';

export const JWT_EXPIRATION_DAYS = 15;
export const JWT_SIGN_OPTIONS = { expiresIn: `${JWT_EXPIRATION_DAYS}d` };
export const AUTH_COOKIE_OPTIONS = { path: '/', maxAge: 60 * 60 * 24 * 16 };

export const challengeTypeAbbreviations = {
	OPEN_RESPONSE: 'open',
	MULTIPLE_CHOICE: 'multiple-choice',
	WORDLE: 'wordle',
	WORDLE_2023: 'wordle23',
	SELECT_ELF_NAME: 'select-elf-name',
	OFFLINE: 'offline',
	YOUR_ELF_NAME_WORTH: 'elf-name-worth',
	MATCH: 'match',
	SANTAS_WORKSHOP: 'santas-workshop',
	MULTIPLE_OPEN_RESPONSE: 'multiple-open',
	WIN_LOSE_OR_STOP: 'win-lose-stop',
	FAMILY_FEUD: 'family-feud',
	FRAMED: 'framed',
} as const;
export type ChallengeTypeAbbreviation = ValueOf<typeof challengeTypeAbbreviations>;
