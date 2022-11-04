import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (request) => {
	request.cookies.delete('AuthorizationToken', { path: '/' });

	return new Response(null, { status: 200 });
};
