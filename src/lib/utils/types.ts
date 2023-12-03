export type WithMinimumInput<MinimumInput, Return> = <T extends MinimumInput>(input: T) => Return;
export type JwtUser = {
	id: number;
	email: string;
	displayName: string;
	isAdmin: boolean;
};
export type cryptoUuid = `${string}-${string}-${string}-${string}-${string}`;
