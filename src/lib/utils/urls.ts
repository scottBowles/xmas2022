export default {
	login: () => '/login',
	challenge: (challengeSetId: number, challengeId: number) =>
		`/challenge-set/${challengeSetId}/challenge/${challengeId}`,
	challengeSet: (id: number) => `/challenge-set/${id}`,
	challengeSetResults: (id: number) => `/challenge-set/${id}/results`,
	challengeSetReview: (id: number) => `/challenge-set/${id}/review`,
	settings: () => '/settings',
	scoreboard: (groupName?: string, year?: number, dayIdx?: number | 'total') => {
		const groupParam = groupName ? encodeURIComponent(groupName) : '';
		const yearParam = year ? `/${year}` : '';
		const dayIdxParam = dayIdx ? `/${dayIdx}` : '';
		return `/scoreboard/${groupParam}${yearParam}${dayIdxParam}`;
	}
};
