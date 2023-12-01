// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// and what to do when importing types
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: JwtUser | null;
		}
		// interface PageData {}
		// interface Platform {}
	}

	// keep JwtUser in sync with src/lib/utils/types.ts so it can be used
	// in svelte components
	interface JwtUser {
		id: number;
		email: string;
		displayName: string;
		isAdmin: boolean;
	}
}

export {};
