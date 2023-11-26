<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import { onMount } from 'svelte';

	export let data;

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegistered(r) {
					// uncomment following code if you want check for updates
					// r && setInterval(() => {
					//    console.log('Checking for sw update')
					//    r.update()
					// }, 20000 /* 20s for testing purposes */)
					console.log(`SW Registered: ${r}`);
				},
				onRegisterError(error) {
					console.log('SW registration error', error);
				}
			});
		}
	});
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<Nav user={data.user} />

<main>
	<slot />
</main>

{#await import('$lib/components/ReloadPrompt.svelte') then { default: ReloadPrompt }}
	<ReloadPrompt />
{/await}

<style>
	main {
		width: 100vw;
	}
</style>
