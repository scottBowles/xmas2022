import prisma from '$lib/prisma';
import { urls } from '$lib/utils';
import { Prisma } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { jwtUserFactory } from '$lib/prisma/models/user';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
import { AUTH_COOKIE_OPTIONS, JWT_SIGN_OPTIONS } from '$lib/constants';

export const load: PageServerLoad = async ({ locals }) => {
	// get user's current username
	const username = locals.user?.displayName;

	return {
		username
	};
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString();
		const userId = locals.user?.id;

		if (!userId) throw redirect(302, urls.login());
		if (!username) return fail(400, { message: 'Username is required' });

		// update the user's username
		try {
			const user = await prisma.user.update({
				where: { id: userId },
				data: { username }
			});
			// create a new JWT with the updated username
			const jwtUser = jwtUserFactory(user);
			const token = jwt.sign(jwtUser, env.JWT_ACCESS_SECRET, JWT_SIGN_OPTIONS);
			cookies.set('AuthorizationToken', token, AUTH_COOKIE_OPTIONS);
		} catch (e) {
			// handle a duplicate username
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					return fail(400, { error: 'Username already exists', username });
				}
			}
		}
		return { success: true, username };
	}
};
