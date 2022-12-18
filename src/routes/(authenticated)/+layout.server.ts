import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		const { searchParams } = url;
		const group = searchParams.get('group');
		const queryString = group ? `?group=${group}` : '';
		const redirectUrl = `/login/${queryString}`;
		throw redirect(302, redirectUrl);
	}
	return { user: locals.user };
};
