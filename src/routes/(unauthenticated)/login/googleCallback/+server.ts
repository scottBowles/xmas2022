import { error, json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

import { env } from '$env/dynamic/private';
import { AUTH_COOKIE_OPTIONS, JWT_SIGN_OPTIONS } from '$lib/constants';
import prisma from '$lib/prisma';
import type { RequestHandler } from './$types';
import { getGoogleUserFromJWT, type GoogleUser } from '$lib/serverOnly/google';

// Get user
async function retrieveUser(googleUser: GoogleUser) {
	try {
		return prisma.user.findUnique({ where: { email: googleUser.email } });
	} catch (err) {
		const message = err instanceof Error ? err.message : '';
		throw error(500, `Server error: ${message}`);
	}
}

// Takes the google token, verifies it, finds the user, sets the cookie, and returns the user
export const POST: RequestHandler = async (event) => {
	const { googleToken } = await event.request.json();
	const googleUser = await getGoogleUserFromJWT(googleToken);
	const user = await retrieveUser(googleUser);

	if (!user || !user.isGoogleAccountConnected) throw error(404, 'Google account not found.');

	const jwtUser: JwtUser = {
		id: user.id,
		email: user.email
	};
	const token = jwt.sign(jwtUser, env.JWT_ACCESS_SECRET, JWT_SIGN_OPTIONS);
	event.cookies.set('AuthorizationToken', token, AUTH_COOKIE_OPTIONS);

	return json({ user });
};