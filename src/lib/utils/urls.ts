import { isNil } from 'ramda';

function scoreboard(): string;
function scoreboard(group: string, year: number | string, day: string | number): string;
function scoreboard(group?: string, year?: number | string, day?: string | number) {
	const dayIsTotalOrNumber = day !== 'total' && Number.isNaN(Number(day));
	if (dayIsTotalOrNumber || isNil(group) || isNil(year) || isNil(day)) return '/scoreboard';
	const encodedGroup = encodeURIComponent(group);
	return `/scoreboard/${encodedGroup}/${year}/${day}`;
}

export default {
	login: () => '/login',
	challenge: (challengeSetId: number, challengeId: number) =>
		`/challenge-set/${challengeSetId}/challenge/${challengeId}`,
	challengeSet: (id: number) => `/challenge-set/${id}`,
	challengeSetResults: (id: number) => `/challenge-set/${id}/results`,
	challengeSetReview: (id: number) => `/challenge-set/${id}/review`,
	settings: () => '/settings',
	scoreboard,
	adminSurvey: (year: number, by: 'question' | 'response') => `/admin/survey/${year}/by-${by}`,
};
