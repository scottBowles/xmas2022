import bcrypt from 'bcryptjs';
import prisma from '$lib/prisma';
import jwt from 'jsonwebtoken';
import { invalid, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import LoginError from './LoginError';
import { AUTH_COOKIE_OPTIONS, JWT_SIGN_OPTIONS } from '$lib/constants';

import { env } from '$env/dynamic/private';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString() || '';
		const password = data.get('password')?.toString() || '';

		if (!email) {
			return invalid(400, { email, error: LoginError.EMAIL_MISSING });
		}

		try {
			const user = await prisma.user.findUnique({ where: { email } });
			if (!user) {
				return invalid(400, { email, error: LoginError.INVALID });
			}

			const passwordIsValid = user.password && (await bcrypt.compare(password, user.password));
			if (!passwordIsValid) {
				return invalid(400, { email, error: LoginError.INVALID });
			}

			const jwtUser: JwtUser = {
				id: user.id,
				email: user.email
			};
			const token = jwt.sign(jwtUser, env.JWT_ACCESS_SECRET, JWT_SIGN_OPTIONS);
			cookies.set('AuthorizationToken', token, AUTH_COOKIE_OPTIONS);
		} catch (error) {
			console.error(error);
			return invalid(400, { email, error: LoginError.UNKNOWN });
		}
		throw redirect(302, '/');
	}
};
