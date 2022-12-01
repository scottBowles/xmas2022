export type WithMinimumInput<MinimumInput, Return> = <T extends MinimumInput>(
	challengeSet: T
) => Return;
