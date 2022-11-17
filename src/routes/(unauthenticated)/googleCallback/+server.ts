import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyAndGetGoogleUserFromJWT, getOrCreateGoogleUser, setJwtCookie } from './utils';

// Takes the google token, verifies it, finds or creates the jwtUser, sets the cookie, and returns the jwtUser
export const POST: RequestHandler = async (event) => {
	const { googleToken } = await event.request.json();
	const googleUser = await verifyAndGetGoogleUserFromJWT(googleToken);
	const jwtUser = await getOrCreateGoogleUser(googleUser);
	setJwtCookie(jwtUser, event.cookies);

	return json({ jwtUser });
};
