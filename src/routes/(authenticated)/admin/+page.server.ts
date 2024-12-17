import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import prisma from '$lib/prisma';
import CHLG from '$lib/prisma/models/challenge';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	if (!user.isAdmin) {
		throw error(403, 'Forbidden');
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
				const [challengeSetResponses, elfNameChallengeResponse] = await Promise.all([
					prisma.challengeSetResponse.findMany({
						where: { playerId: user.id, completedAt: { not: null } },
						include: {
							challengeSet: {
								include: {
									challenges: {
										include: {
											options: true,
											responses: {
												where: { playerId: user.id },
											},
											challengeSet: true,
										},
									},
								},
							},
						},
					}),
					prisma.challengeResponse.findFirst({
						where: { playerId: user.id, challenge: { type: 'SELECT_ELF_NAME' } },
						orderBy: { createdAt: 'desc' },
					}),
				]);
				const updatePromises = challengeSetResponses.map(async (challengeSetResponse) => {
					const challengePoints = CHLG.scoreChallenges(
						challengeSetResponse.challengeSet.challenges,
						{
							elfNameChallengeResponse,
						}
					);
					const completionPoints = challengeSetResponse.completedAt
						? challengeSetResponse.challengeSet.completionPoints
						: 0;
					const points = challengePoints + completionPoints;
					await prisma.challengeSetResponse.update({
						where: { id: challengeSetResponse.id },
						data: { points },
					});
				});
				await Promise.all(updatePromises);
			});
			await Promise.all(promises);
		} catch (e) {
			return { recalculateSuccess: false, recalculateError: e };
		}

		return { recalculateSuccess: true, recalculateError: false };
	},
};
