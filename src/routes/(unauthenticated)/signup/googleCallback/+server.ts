import { error, json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

import { env } from '$env/dynamic/private';
import { AUTH_COOKIE_OPTIONS, JWT_SIGN_OPTIONS } from '$lib/constants';
import prisma from '$lib/prisma';
import type { RequestHandler } from './$types';
import { getGoogleUserFromJWT, type GoogleUser } from '$lib/serverOnly/google';

// Create user
async function createUser(googleUser: GoogleUser) {
	try {
		const { firstName, lastName, email, picture } = googleUser;
		const username = firstName + lastName[0];
		return prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				username,
				picture,
				isGoogleAccountConnected: true
			}
		});
	} catch (err) {
		let message = '';
		if (err instanceof Error) message = err.message;
		throw error(500, `Google user could not be created: ${message}`);
	}
}

// Takes the google token, verifies it, creates the user, sets the cookie, and returns the user
export const POST: RequestHandler = async (event) => {
	const { googleToken } = await event.request.json();
	const googleUser = await getGoogleUserFromJWT(googleToken);
	const user = await createUser(googleUser);

	const jwtUser: JwtUser = {
		id: user.id,
		email: user.email
	};
	const token = jwt.sign(jwtUser, env.JWT_ACCESS_SECRET, JWT_SIGN_OPTIONS);
	event.cookies.set('AuthorizationToken', token, AUTH_COOKIE_OPTIONS);

	return json({ user });
};
