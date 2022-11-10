<script lang="ts">
	import { onMount } from 'svelte';
	import { initializeGoogleAccounts, renderGoogleButton } from '$lib/google';

	export let onGoogleError: (message: string) => void;

	onMount(() => {
		initializeGoogleAccounts(onGoogleError);
		renderGoogleButton();
	});
</script>

<div id="googleButton" />
