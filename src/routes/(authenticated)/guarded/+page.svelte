<script lang="ts">
	import { goto } from '$app/navigation';

	const logout = async () => {
		await fetch('/logout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		});
		goto('/login');
	};
</script>

Logged in!

<button type="button" on:click={logout}>Logout</button>
