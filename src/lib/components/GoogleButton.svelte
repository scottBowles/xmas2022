<script lang="ts">
	import { onMount } from 'svelte';
	import { initializeGoogleAccounts, renderGoogleButton } from '$lib/utils/clientOnly/google';
	import { writable } from 'svelte/store';

	export let onGoogleError: (message: string) => void;
	const googleInitialized = writable(false);

	onMount(() => {
		initializeGoogleAccounts(googleInitialized, onGoogleError);
		renderGoogleButton();
	});
</script>

<div id="googleButton" />
