<script lang="ts">
	import { onMount } from 'svelte';
	import { initializeGoogleAccounts, renderGoogleButton } from '$lib/utils/clientOnly/google';
	import { writable } from 'svelte/store';

	interface Props {
		onGoogleError: (message: string) => void;
	}

	let { onGoogleError }: Props = $props();
	const googleInitialized = writable(false);

	onMount(() => {
		initializeGoogleAccounts(googleInitialized, onGoogleError);
		renderGoogleButton();
	});
</script>

<div id="googleButton"></div>
