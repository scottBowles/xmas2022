import { error, redirect } from '@sveltejs/kit';

export const load = async ({ parent, params }) => {
	const { user } = await parent();

	if (!user.isAdmin) {
		throw error(403, 'Forbidden');
	}

	const year = parseInt(params.year);
	// redirect to by-question view
	throw redirect(302, `/admin/survey/${year}/by-question`);
};
