import type { User } from '@prisma/client';
import { error, type Cookies } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
import { AUTH_COOKIE_OPTIONS, JWT_SIGN_OPTIONS } from '$lib/constants';
import prisma from '$lib/prisma';

/** User data we use from Google */
type GoogleUser = {
	firstName: string;
	lastName: string;
	email: string;
	picture?: string;
};

// Verifies JWT per https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
/** Verify the Google user's id token and, if valid, return the GoogleUser */
export async function verifyAndGetGoogleUserFromJWT(token: string): Promise<GoogleUser> {
	try {
		const client = new OAuth2Client(PUBLIC_GOOGLE_CLIENT_ID);
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: PUBLIC_GOOGLE_CLIENT_ID
		});
		const payload = ticket.getPayload();
		if (!payload?.email) throw error(500, 'Google authentication did not get the expected payload');

		return {
			firstName: payload['given_name'] || 'UnknownFirstName',
			lastName: payload['family_name'] || 'UnknownLastName',
			email: payload['email'],
			picture: payload['picture']
		};
	} catch (err) {
		let message = '';
		if (err instanceof Error) message = err.message;
		throw error(500, `Google user could not be authenticated: ${message}`);
	}
}

/** Create a user given a GoogleUser */
function createUserFromGoogleUser(googleUser: GoogleUser) {
	const { firstName, lastName, email, picture } = googleUser;
	const username = firstName + lastName[0];
	return prisma.user.create({
		data: {
			firstName,
			lastName,
			email,
			picture,
			username,
			isGoogleAccountConnected: true
		}
	});
}

/** Get or create a user given the GoogleUser */
export async function getOrCreateGoogleUser(googleUser: GoogleUser) {
	const existingUser = await prisma.user.findUnique({ where: { email: googleUser.email } });
	if (existingUser && !existingUser.isGoogleAccountConnected)
		throw error(400, 'This email is already associated with a non-Google account');
	return existingUser || createUserFromGoogleUser(googleUser);
}

/** Sets the Authorization JWT cookie given the user and the cookies object  */
export function setJwtCookie(user: User, cookies: Cookies) {
	const jwtUser: JwtUser = {
		id: user.id,
		email: user.email
	};
	const token = jwt.sign(jwtUser, env.JWT_ACCESS_SECRET, JWT_SIGN_OPTIONS);
	cookies.set('AuthorizationToken', token, AUTH_COOKIE_OPTIONS);
}
