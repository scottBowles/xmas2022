import { error, redirect, type Actions } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtUserFactory } from '@/prisma/models/user';
import { env } from '$env/dynamic/private';
import { JWT_SIGN_OPTIONS } from '$lib/constants';

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		const { token } = params;
		const data = await request.formData();

		if (!token) throw error(404, 'No token provided');

		const password = data.get('password')?.toString();
		if (!password) throw error(400, 'No password provided');
		const passwordConfirmation = data.get('password_confirmation')?.toString();
		if (!passwordConfirmation) throw error(400, 'No password confirmation provided');
		if (password !== passwordConfirmation) throw error(400, 'Passwords do not match');

		// find the user whose PasswordResetToken.token matches the token
		const user = await prisma.user.findFirst({
			where: { PasswordResetToken: { some: { token } } },
			include: { PasswordResetToken: true },
		});

		if (!user) throw error(404, 'Token not found');
		if (user.PasswordResetToken[0].expiresAt < new Date())
			throw error(400, 'Token expired. Please request a new one.');

		// update the user's password
		await prisma.user.update({
			where: { id: user.id },
			data: {
				password: await bcrypt.hash(password, 10),
			},
		});

		// delete the token
		await prisma.passwordResetToken.delete({
			where: { id: user.PasswordResetToken[0].id },
		});

		const jwtUser = jwtUserFactory(user);
		const jwtToken = jwt.sign(jwtUser, env.JWT_ACCESS_SECRET, JWT_SIGN_OPTIONS);
		throw redirect(302, '/');
	},
};
