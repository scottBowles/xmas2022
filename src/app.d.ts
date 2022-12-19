// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// and what to do when importing types
declare namespace App {
	interface Locals {
		user: JwtUser | null;
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

interface JwtUser {
	id: number;
	email: string;
	displayName: string;
	isAdmin: boolean;
}
