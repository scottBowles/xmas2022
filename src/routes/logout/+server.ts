import { AUTH_COOKIE_OPTIONS } from '$lib/constants';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (request) => {
	request.cookies.delete('AuthorizationToken', AUTH_COOKIE_OPTIONS);

	return new Response(null, { status: 200 });
};
