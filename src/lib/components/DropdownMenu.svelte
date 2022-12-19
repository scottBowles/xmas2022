<script>
	import { slide } from 'svelte/transition';
	import { logout } from '$lib/utils/clientOnly/logout';

	export let isAdmin = false;
</script>

<div class="container" transition:slide>
	<ul>
		<a href="/"><li>Play!</li></a>
		<a href="/scoreboard"><li>Scoreboard</li></a>
		<a href="/settings"><li>Settings</li></a>
		{#if isAdmin}
			<a href="/admin"><li>Admin</li></a>
		{/if}
		<button on:click={logout}><li>Logout</li></button>
	</ul>
</div>

<style>
	.container {
		position: absolute;
		right: 0;
		top: 48px;
		width: 160px;
		background: var(--red);
		z-index: 9;
		border-radius: 0 0 0 6px;
		overflow: hidden;
	}

	button {
		width: 100%;
		text-align: start;
	}

	li {
		list-style: none;
		padding: 20px;
		border-top: 1px solid #f5f5f5;
	}

	a > li,
	button > li {
		color: #f5f5f5;
		text-decoration: none;
		cursor: pointer;
	}

	li:hover {
		background: var(--bright-red);
	}
</style>
