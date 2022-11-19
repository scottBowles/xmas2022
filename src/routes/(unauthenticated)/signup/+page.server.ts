import prisma, { jwtUserFactory } from '$lib/prisma';
import { invalid, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
import SignupError from './SignupError';
import { Prisma } from '@prisma/client';
import { AUTH_COOKIE_OPTIONS, JWT_SIGN_OPTIONS } from '$lib/constants';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		if (!email || !password) {
			return invalid(400, { email, error: SignupError.VALIDATION });
		}

		try {
			const user = await prisma.user.create({
				data: { email, password: await bcrypt.hash(password, 10) }
			});
			const jwtUser = jwtUserFactory(user);
			const token = jwt.sign(jwtUser, env.JWT_ACCESS_SECRET, JWT_SIGN_OPTIONS);
			cookies.set('AuthorizationToken', token, AUTH_COOKIE_OPTIONS);
		} catch (error) {
			console.error(error);
			switch (true) {
				case error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002':
					return invalid(400, { email, error: SignupError.EMAIL_TAKEN });
				case error instanceof Prisma.PrismaClientValidationError:
					return invalid(400, { email, error: SignupError.VALIDATION });
				default:
					return invalid(400, { email, error: SignupError.UNKNOWN });
			}
		}
		throw redirect(302, '/');
	}
};
