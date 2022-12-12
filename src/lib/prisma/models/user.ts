import { pickAll } from 'ramda';
import { addKey } from '$lib/utils';
import type { WithMinimumInput } from '$lib/utils/types';

type DisplayName = WithMinimumInput<
	| { username: string; firstName?: string | null; email?: string; displayName?: string }
	| { username?: string | null; firstName: string; email?: string; displayName?: string }
	| { username?: string | null; firstName?: string | null; email: string; displayName?: string },
	string
>;
const displayName: DisplayName = (user) =>
	user.displayName || user.username || user.firstName || (user.email as string).split('@')[0];
const addDisplayName = addKey('displayName', displayName);

/**
 * Returns the user saved in the auth jwt.
 * Must remain a pojo to be serialized for the jwt and passed to the client.
 */
type JwtUserFactory = WithMinimumInput<
	{ id: number; email: string } & Parameters<DisplayName>[0],
	JwtUser
>;
const jwtUserFactory: JwtUserFactory = (user) =>
	pickAll(['id', 'email', 'displayName'], addDisplayName(user));

export { displayName, addDisplayName, jwtUserFactory };
