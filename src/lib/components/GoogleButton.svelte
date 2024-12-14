<script lang="ts">
	import { initializeGoogleAccounts, renderGoogleButton } from '$lib/utils/clientOnly/google';
	import { writable } from 'svelte/store';

	interface Props {
		onGoogleError: (message: string) => void;
	}

	let { onGoogleError }: Props = $props();
	let googleScriptReady = $state(false);
	const googleInitialized = writable(false);

	$effect(() => {
		if (googleScriptReady) {
			initializeGoogleAccounts(googleInitialized, onGoogleError);
			renderGoogleButton();
		}
	});
</script>

<svelte:head>
	<script
		nonce="%sveltekit.nonce%"
		src="https://accounts.google.com/gsi/client"
		async
		defer
		onload={() => {
			googleScriptReady = true;
		}}
	></script>
</svelte:head>

<div id="googleButton"></div>
