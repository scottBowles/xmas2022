<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import ToastContainer from '$lib/wordle/components/Toast/Container.svelte';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	injectSpeedInsights();

	let { data, children } = $props();
</script>

<svelte:head>
	<title>Aunt Susan's Christmas</title>
</svelte:head>

<Nav user={data.user} />

<ToastContainer />

<main>
	{@render children?.()}
</main>

<style>
	main {
		width: 100vw;
	}
</style>
