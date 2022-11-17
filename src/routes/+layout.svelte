<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import Menu from '$lib/components/Menu.svelte';
	import type { LayoutData } from './$types';
	import { menu } from '$lib/stores';

	const menuIsOpen = menu();

	export let data: LayoutData;
</script>

<Nav user={data.user} {menuIsOpen} />
{#if $menuIsOpen}
	<Menu />
{/if}
<slot />
