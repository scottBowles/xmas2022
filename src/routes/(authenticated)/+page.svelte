<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const {
		// currentChallengeSets,
		user
	} = data;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<h1 class="text-4xl mt-4 mb-1">Welcome, {user.displayName}!</h1>
