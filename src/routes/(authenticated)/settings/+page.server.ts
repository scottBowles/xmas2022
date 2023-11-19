import bcrypt from 'bcryptjs';
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
	joinGroupGroupname: null,
	changePasswordSuccess: null,
	changePasswordError: null
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
	changePassword: async ({ request, locals }) => {
		const data = await request.formData();
		const oldPassword = data.get('oldPassword')?.toString();
		const newPassword = data.get('newPassword')?.toString();
		const newPasswordConfirm = data.get('newPasswordConfirm')?.toString();
		const userId = locals.user?.id;
		const missingInput = !oldPassword || !newPassword || !newPasswordConfirm;
		const passwordsMatch = newPassword === newPasswordConfirm;

		const errorData = (error: string) => ({ ...baseResponse, changePasswordError: error });

		if (!userId) throw redirect(302, urls.login());
		if (missingInput) return fail(400, errorData('All fields are required'));
		if (!passwordsMatch) return fail(400, errorData('Passwords do not match'));
		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) return fail(400, errorData('User not found'));
		if (!user.password) return fail(400, errorData('User does not have a password'));
		const passwordIsValid = await bcrypt.compare(oldPassword, user.password);
		if (!passwordIsValid) return fail(400, errorData('Incorrect old password'));

		// update the user's password
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });

		return { ...baseResponse, changePasswordSuccess: true };
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
