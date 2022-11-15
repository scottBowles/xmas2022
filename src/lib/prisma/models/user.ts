import type { User as DBUser } from '@prisma/client';
import prismaClient from '../prismaClient';

export const user = Object.assign(prismaClient.user, {
	// Add custom methods heres
});

export class User {
	id: number;
	email: string;
	password: string | null;
	firstName: string | null;
	lastName: string | null;
	username: string | null;
	createdAt: Date;
	updatedAt: Date;
	isGoogleAccountConnected: boolean;
	picture: string | null;

	constructor(user: DBUser) {
		this.id = user.id;
		this.email = user.email;
		this.password = user.password;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.username = user.username;
		this.createdAt = user.createdAt;
		this.updatedAt = user.updatedAt;
		this.isGoogleAccountConnected = user.isGoogleAccountConnected;
		this.picture = user.picture;
	}
}
