import { error, json } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import { env } from '$env/dynamic/private';
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
import { AUTH_COOKIE_OPTIONS, JWT_SIGN_OPTIONS } from '$lib/constants';
import prisma from '$lib/prisma';
import type { RequestHandler } from './$types';

type GoogleUser = {
	firstName: string;
	lastName: string;
	email: string;
	// picture: string | undefined; // could use this to get a profile picture
};

// Verify JWT per https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
async function getGoogleUserFromJWT(token: string): Promise<GoogleUser> {
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
			email: payload['email']
			// picture: payload['picture']
		};
	} catch (err) {
		let message = '';
		if (err instanceof Error) message = err.message;
		throw error(500, `Google user could not be authenticated: ${message}`);
	}
}

// Get or create user
async function upsertGoogleUser(googleUser: GoogleUser) {
	try {
		const { firstName, lastName, email } = googleUser;
		const user = await prisma.user.upsert({
			where: { email },
			create: { name: firstName + ' ' + lastName, email },
			update: {}
		});
		return user;
	} catch (err) {
		let message = '';
		if (err instanceof Error) message = err.message;
		throw error(500, `Google user could not be upserted: ${message}`);
	}
}

// Takes the google token, verifies it, finds or creates the user, sets the cookie, and returns the user
export const POST: RequestHandler = async (event) => {
	try {
		const { googleToken } = await event.request.json();
		const googleUser = await getGoogleUserFromJWT(googleToken);
		const user = await upsertGoogleUser(googleUser);

		const jwtUser: JwtUser = {
			id: user.id,
			email: user.email
		};
		const token = jwt.sign(jwtUser, env.JWT_ACCESS_SECRET, JWT_SIGN_OPTIONS);
		event.cookies.set('AuthorizationToken', token, AUTH_COOKIE_OPTIONS);

		return json({ user });
	} catch (err) {
		let message = '';
		if (err instanceof Error) message = err.message;
		throw error(401, message);
	}
};
