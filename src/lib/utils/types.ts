export type WithMinimumInput<MinimumInput, Return> = <T extends MinimumInput>(
	challengeSet: T
) => Return;
export type JwtUser = {
	id: number;
	email: string;
	displayName: string;
	isAdmin: boolean;
};
