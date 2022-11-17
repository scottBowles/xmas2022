import { invalidateAll } from '$app/navigation';

export const logout = async () => {
	await fetch('/logout', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' }
	});
	invalidateAll();
};
