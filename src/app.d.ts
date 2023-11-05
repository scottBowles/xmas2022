// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// and what to do when importing types
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: number;
				email: string;
				displayName: string;
				isAdmin: boolean;
			} | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
	interface JwtUser {
		id: number;
		email: string;
		displayName: string;
		isAdmin: boolean;
	}
}

export {};
