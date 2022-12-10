import { addKey } from '$lib/utils';

type IsLast = <T extends { challenges: { id: number }[] }>(
	challengeSet: T
) => (challenge: T['challenges'][number]) => boolean;

const isLast: IsLast = (challengeSet) => (challenge) =>
	challengeSet.challenges[challengeSet.challenges.length - 1].id === challenge.id;

const addIsLast = <T extends { challenges: { id: number }[] }>(challengeSet: T) =>
	addKey('isLast', isLast(challengeSet));

export { isLast, addIsLast };
