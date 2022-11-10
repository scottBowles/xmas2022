import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyAndGetGoogleUserFromJWT, getOrCreateGoogleUser, setJwtCookie } from './utils';

// Takes the google token, verifies it, finds or creates the user, sets the cookie, and returns the user
export const POST: RequestHandler = async (event) => {
	const { googleToken } = await event.request.json();
	const googleUser = await verifyAndGetGoogleUserFromJWT(googleToken);
	const user = await getOrCreateGoogleUser(googleUser);
	setJwtCookie(user, event.cookies);

	return json({ user });
};
