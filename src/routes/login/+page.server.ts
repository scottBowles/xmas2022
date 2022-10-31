import bcrypt from 'bcryptjs';
import prisma from '$lib/prisma';
import jwt from 'jsonwebtoken';
import { invalid, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import LoginError from './LoginError';

import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/guarded');
	}
};

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
			const token = jwt.sign(jwtUser, env.JWT_ACCESS_SECRET, {
				expiresIn: '14d'
			});

			cookies.set('AuthorizationToken', token, { path: '/', maxAge: 60 * 60 * 24 * 14 });
		} catch (error) {
			console.error(error);
			return invalid(400, { email, error: LoginError.UNKNOWN });
		}
		throw redirect(302, '/guarded');
	}
};
