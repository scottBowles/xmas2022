<script lang="ts">
	import { logout } from '$lib/utils/clientOnly/logout';
</script>

Logged in!

<button type="button" on:click={logout}>Logout</button>
