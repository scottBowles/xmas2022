import { pick } from '$lib/utils';
import type { User as DBUser } from '@prisma/client';
import prismaClient from '../prismaClient';

export const user = Object.assign(prismaClient.user, {
	// Add custom methods heres
});

export class User {
	id: number;
	email: string;
	firstName: string | null;
	lastName: string | null;
	username: string | null;
	isGoogleAccountConnected: boolean;
	picture: string | null;

	constructor(user: DBUser | User) {
		this.id = user.id;
		this.email = user.email;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.username = user.username;
		this.isGoogleAccountConnected = user.isGoogleAccountConnected;
		this.picture = user.picture;
	}

	get displayName() {
		return this.username || this.firstName || this.email.split('@')[0];
	}

	get jwtUser() {
		return jwtUserFactory(this);
	}
}

/**
 * Returns the user saved in the auth jwt.
 * Must remain a pojo to be serialized for the jwt and passed to the client.
 */
export const jwtUserFactory = (user: DBUser | User | JwtUser): JwtUser => {
	if (!('displayName' in user)) {
		user = new User(user);
	}
	return pick(user, ['id', 'email', 'displayName']);
};
