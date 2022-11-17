import jwt from 'jsonwebtoken';
import type { Handle } from '@sveltejs/kit';
import type { JwtPayload } from 'jsonwebtoken';
import { sequence } from '@sveltejs/kit/hooks';
import { isJwtExpiringWithinDays, pick } from '$lib/utils';

import { env } from '$env/dynamic/private';
import { AUTH_COOKIE_OPTIONS, JWT_EXPIRATION_DAYS, JWT_SIGN_OPTIONS } from '$lib/constants';

const getSessionCookie: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('AuthorizationToken');
	if (token) {
		try {
			const jwtPayload = jwt.verify(token, env.JWT_ACCESS_SECRET) as
				| (JwtPayload & JwtUser)
				| string;
			const isBadPayload = typeof jwtPayload === 'string';
			if (isBadPayload) {
				event.locals.user = null;
				event.cookies.delete('AuthorizationToken');
			} else {
				const jwtUser: JwtUser = pick(jwtPayload, ['id', 'email']);
				event.locals.user = jwtUser;
				if (isJwtExpiringWithinDays(jwtPayload, JWT_EXPIRATION_DAYS - 8)) {
					const newToken = jwt.sign(jwtUser, env.JWT_ACCESS_SECRET, JWT_SIGN_OPTIONS);
					event.cookies.set('AuthorizationToken', newToken, AUTH_COOKIE_OPTIONS);
				}
			}
			return await resolve(event);
		} catch (error) {
			console.error(error);
		}
	}
	event.locals.user = null;
	return await resolve(event);
};

export const handle: Handle = sequence(getSessionCookie);
