import { getNow } from '$lib/utils';

const isLive = (challengeSetResponse: { startedAt: Date | null; completedAt: Date | null }) =>
	challengeSetResponse.startedAt &&
	challengeSetResponse.startedAt <= getNow() &&
	!challengeSetResponse.completedAt;

const timeTaken = (challengeSetResponse: { startedAt: Date | null; completedAt: Date | null }) =>
	challengeSetResponse.completedAt &&
	challengeSetResponse.startedAt &&
	challengeSetResponse.completedAt.getTime() - challengeSetResponse.startedAt.getTime();

export { isLive, timeTaken };
