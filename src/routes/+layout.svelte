<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<Nav user={data.user} />
<slot />
