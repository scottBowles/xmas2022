import { getNow } from '$lib/utils';

const isLive = (challengeSetResponse: { startedAt: Date | null; completedAt: Date | null }) =>
	challengeSetResponse.startedAt &&
	challengeSetResponse.startedAt <= getNow() &&
	!challengeSetResponse.completedAt;

export { isLive };
