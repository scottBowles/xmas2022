<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';

	export let data;
</script>

<Nav user={data.user} />

<main>
	<slot />
</main>

<style>
	main {
		width: 100vw;
	}
</style>
