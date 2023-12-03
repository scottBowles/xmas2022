import { error } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { user } = await parent();

	if (!user.isAdmin) throw error(403, 'Forbidden');

	return { user };
};
