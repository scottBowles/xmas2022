import { get, type Writable } from 'svelte/store';
import { invalidateAll } from '$app/navigation';
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';

/**
 * For future reference, much of the google auth code throughout the app is modified from:
 * https://github.com/nstuyvesant/sveltekit-auth-example
 */

export function renderGoogleButton() {
	const btn = document.getElementById('googleButton');
	if (btn) {
		google.accounts.id.renderButton(btn, {
			type: 'standard',
			theme: 'filled_blue',
			size: 'large',
			width: 256,
		});
		google.accounts.id.prompt(); // also display the One Tap dialog
	}
}

const createGoogleCallback =
	(onError: (message: string) => void) =>
	async (response: google.accounts.id.CredentialResponse) => {
		const res = await fetch('/googleCallback', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ googleToken: response.credential }),
		});

		if (res.ok) {
			invalidateAll();
			// Not currently using referrer, but leaving this in case we want to in the future.
			// let referrer;
			// const unsubscribe = page.subscribe((p) => {
			// 	referrer = p.url.searchParams.get('referrer');
			// });
			// unsubscribe();

			// if (referrer) return goto(referrer);
		} else {
			const json = await res.json();
			onError(json.message);
		}
	};

export function initializeGoogleAccounts(
	googleInitialized: Writable<boolean>,
	onError: (message: string) => void
) {
	const initialized = get(googleInitialized);

	if (initialized) return;

	const callback = createGoogleCallback(onError);

	google.accounts.id.initialize({
		client_id: PUBLIC_GOOGLE_CLIENT_ID,
		callback,
	});

	googleInitialized.set(true);
}
