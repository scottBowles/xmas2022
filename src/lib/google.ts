/**
 * For future reference, much of the google auth code throughout the app is modified from:
 * https://github.com/nstuyvesant/sveltekit-auth-example
 */

import { goto } from '$app/navigation';
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
import { googleInitialized } from '$lib/stores';

export function renderGoogleButton() {
	const btn = document.getElementById('googleButton');
	if (btn) {
		google.accounts.id.renderButton(btn, {
			type: 'standard',
			theme: 'filled_blue',
			size: 'large',
			width: '367'
		});
		google.accounts.id.prompt(); // also display the One Tap dialog
	}
}

export function initializeGoogleAccounts() {
	let initialized = false;
	const unsubscribe = googleInitialized.subscribe((value) => {
		initialized = value;
	});

	if (!initialized) {
		google.accounts.id.initialize({
			client_id: PUBLIC_GOOGLE_CLIENT_ID,
			callback: googleCallback
		});

		googleInitialized.set(true);
	}
	unsubscribe();

	async function googleCallback(response: google.accounts.id.CredentialResponse) {
		const res = await fetch('/auth/google', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ googleToken: response.credential })
		});

		if (res.ok) {
			// Not currently using referrer, but leaving this in case we want to in the future.
			// let referrer;
			// const unsubscribe = page.subscribe((p) => {
			// 	referrer = p.url.searchParams.get('referrer');
			// });
			// unsubscribe();

			// if (referrer) return goto(referrer);

			goto('/');
		}
	}
}
