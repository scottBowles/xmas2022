import { OAuth2Client } from 'google-auth-library';
import { error } from '@sveltejs/kit';
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';

export type GoogleUser = {
	firstName: string;
	lastName: string;
	email: string;
	picture?: string;
};

// Verify JWT per https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
export async function getGoogleUserFromJWT(token: string): Promise<GoogleUser> {
	try {
		const client = new OAuth2Client(PUBLIC_GOOGLE_CLIENT_ID);
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: PUBLIC_GOOGLE_CLIENT_ID
		});
		const payload = ticket.getPayload();
		if (!payload?.email) throw error(500, 'Google authentication did not get the expected payload');

		return {
			firstName: payload['given_name'] || 'UnknownFirstName',
			lastName: payload['family_name'] || 'UnknownLastName',
			email: payload['email'],
			picture: payload['picture']
		};
	} catch (err) {
		let message = '';
		if (err instanceof Error) message = err.message;
		throw error(500, `Google user could not be authenticated: ${message}`);
	}
}
