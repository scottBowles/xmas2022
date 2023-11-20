<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="whole-shebang">
	<Nav user={data.user} />
	<slot />
</div>

<style>
	.whole-shebang {
		height: 100vh;
		position: relative;
	}
</style>
