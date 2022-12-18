import prisma from '$lib/prisma';
import { jwtUserFactory } from '$lib/prisma/models/user';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
import { LoginError, SignupError } from './Errors';
import { Prisma } from '@prisma/client';
import { AUTH_COOKIE_OPTIONS, JWT_SIGN_OPTIONS } from '$lib/constants';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { searchParams } = url;
	const group = searchParams.get('group');

	if (locals.user) {
		throw redirect(302, '/');
	}

	return { group };
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString() || '';
		const password = data.get('password')?.toString() || '';

		if (!email) {
			return fail(400, { email, error: LoginError.EMAIL_MISSING });
		}

		try {
			const user = await prisma.user.findUnique({ where: { email } });
			if (!user) {
				return fail(400, { email, error: LoginError.INVALID });
			}

			const passwordIsValid = user.password && (await bcrypt.compare(password, user.password));
			if (!passwordIsValid) {
				return fail(400, { email, error: LoginError.INVALID });
			}

			const jwtUser: JwtUser = jwtUserFactory(user);
			const token = jwt.sign(jwtUser, env.JWT_ACCESS_SECRET, JWT_SIGN_OPTIONS);
			cookies.set('AuthorizationToken', token, AUTH_COOKIE_OPTIONS);
		} catch (error) {
			console.error(error);
			return fail(400, { email, error: LoginError.UNKNOWN });
		}
		throw redirect(302, '/');
	},
	signup: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();
		const group = data.get('group')?.toString();

		if (!email || !password) {
			return fail(400, { email, error: SignupError.VALIDATION });
		}

		try {
			const user = await prisma.user.create({
				data: {
					email,
					password: await bcrypt.hash(password, 10),
					...(group && {
						groups: { create: [{ isAdmin: false, group: { connect: { name: group } } }] }
					})
				}
			});
			const jwtUser = jwtUserFactory(user);
			const token = jwt.sign(jwtUser, env.JWT_ACCESS_SECRET, JWT_SIGN_OPTIONS);
			cookies.set('AuthorizationToken', token, AUTH_COOKIE_OPTIONS);
		} catch (error) {
			console.error(error);
			switch (true) {
				case error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002':
					return fail(400, { email, error: SignupError.EMAIL_TAKEN });
				case error instanceof Prisma.PrismaClientValidationError:
					return fail(400, { email, error: SignupError.VALIDATION });
				default:
					return fail(400, { email, error: SignupError.UNKNOWN });
			}
		}
		throw redirect(302, '/');
	}
};
