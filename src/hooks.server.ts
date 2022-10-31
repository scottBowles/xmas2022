import jwt from 'jsonwebtoken';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { env } from '$env/dynamic/private';

const getSessionCookie: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('AuthorizationToken');
	if (token) {
		try {
			const jwtPayload = (await jwt.verify(token, env.JWT_ACCESS_SECRET)) as JwtUser | string;
			const isBadPayload = typeof jwtPayload === 'string';
			event.locals.user = isBadPayload ? null : jwtPayload;
			return await resolve(event);
		} catch (error) {
			console.error(error);
		}
	}
	event.locals.user = null;
	return await resolve(event);
};

export const handle: Handle = sequence(getSessionCookie);
