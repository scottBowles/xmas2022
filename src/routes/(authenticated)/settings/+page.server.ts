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

const baseResponse = {
	changeUsernameSuccess: null,
	changeUsernameError: null,
	changeUsernameUsername: null,
	createGroupSuccess: null,
	createGroupError: null,
	createGroupGroupname: null,
	joinGroupSuccess: null,
	joinGroupError: null,
	joinGroupGroupname: null
};

export const actions: Actions = {
	changeUsername: async ({ request, locals, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString();
		const userId = locals.user?.id;

		if (!userId) throw redirect(302, urls.login());
		if (!username)
			return fail(400, { ...baseResponse, changeUsernameError: 'Username is required' });

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
					return fail(400, {
						changeUsernameError: 'Username already exists',
						changeUsernameUsername: username
					});
				}
			}
		}
		return { ...baseResponse, changeUsernameSuccess: true, changeUsernameUsername: username };
	},
	createGroup: async ({ request, locals }) => {
		const data = await request.formData();
		const groupName = data.get('groupname')?.toString();
		const userId = locals.user?.id;

		if (!userId) throw redirect(302, urls.login());
		if (!groupName)
			return fail(400, { ...baseResponse, createGroupError: 'Group name is required' });

		try {
			// create a new group
			await prisma.group.create({
				data: {
					name: groupName,
					users: {
						create: [
							{
								isAdmin: true,
								user: {
									connect: { id: userId }
								}
							}
						]
					}
				}
			});
			return { ...baseResponse, createGroupSuccess: true };
		} catch (e) {
			// handle a duplicate groupname
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					return fail(400, {
						...baseResponse,
						createGroupError: 'Group name already exists',
						createGroupGroupname: groupName
					});
				}
			}
		}
	},
	joinGroup: async ({ request, locals }) => {
		const data = await request.formData();
		const groupName = data.get('groupname')?.toString();
		const userId = locals.user?.id;

		if (!userId) throw redirect(302, urls.login());
		if (!groupName) return fail(400, { ...baseResponse, joinGroupError: 'Group name is required' });

		try {
			// add the user to the group
			await prisma.group.update({
				where: { name: groupName },
				data: {
					users: {
						create: [
							{
								isAdmin: false,
								user: {
									connect: { id: userId }
								}
							}
						]
					}
				}
			});
			return { ...baseResponse, joinGroupSuccess: true };
		} catch (e) {
			// handle a group that doesn't exist
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2025') {
					return fail(400, {
						...baseResponse,
						joinGroupError: 'Group does not exist',
						joinGroupGroupNname: groupName
					});
				}
			}
			// if the user is already in the group we'll just ignore the error
		}
	}
};
