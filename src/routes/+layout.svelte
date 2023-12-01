<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';

	export let data;
</script>

<svelte:head>
	<title>Aunt Susan's Christmas</title>
</svelte:head>

<Nav user={data.user} />

<main>
	<slot />
</main>

<style>
	main {
		width: 100vw;
	}
</style>
