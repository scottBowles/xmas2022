<script lang="ts">
	import { logout } from '$lib/clientOnly/logout';
</script>

Logged in!

<button type="button" on:click={logout}>Logout</button>
