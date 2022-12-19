import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import prisma from '$lib/prisma';
import { scoreChallenges } from '$lib/prisma/models/challenge';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	if (!user.isAdmin) {
		return error(403, 'Forbidden');
	}

	const users = await prisma.user.findMany();

	return { users };
};

export const actions: Actions = {
	recalculate: async ({ request }) => {
		const data = await request.formData();
		const userId = data.get('userId')?.toString();

		try {
			const users = userId
				? await prisma.user.findMany({ where: { id: parseInt(userId) } })
				: await prisma.user.findMany();

			const promises = users.map(async (user) => {
				const challengeSetResponses = await prisma.challengeSetResponse.findMany({
					where: { playerId: user.id, completedAt: { not: null } },
					include: {
						challengeSet: {
							include: {
								challenges: {
									include: {
										options: true,
										responses: {
											where: { playerId: user.id }
										}
									}
								}
							}
						}
					}
				});
				const updatePromises = challengeSetResponses.map(async (challengeSetResponse) => {
					const points = scoreChallenges(challengeSetResponse.challengeSet.challenges);
					await prisma.challengeSetResponse.update({
						where: { id: challengeSetResponse.id },
						data: { points }
					});
				});
				await Promise.all(updatePromises);
			});
			await Promise.all(promises);
		} catch (e) {
			return { recalculateSuccess: false, recalculateError: e };
		}

		return { recalculateSuccess: true, recalculateError: false };
	}
};
