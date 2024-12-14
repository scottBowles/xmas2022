<script>
	import { slide } from 'svelte/transition';
	import { logout } from '$lib/utils/clientOnly/logout';

	/**
	 * @typedef {Object} Props
	 * @property {boolean} [isAdmin]
	 */

	/** @type {Props} */
	let { isAdmin = false } = $props();
</script>

<div class="menu-container" transition:slide>
	<ul>
		<a href="/" data-sveltekit-preload-data="hover"><li>Play!</li></a>
		<a href="/scoreboard" data-sveltekit-preload-data="hover"><li>Scoreboard</li></a>
		<a href="/settings" data-sveltekit-preload-data="hover"><li>Settings</li></a>
		{#if isAdmin}
			<a href="/admin" data-sveltekit-preload-data="hover"><li>Admin</li></a>
		{/if}
		<button onclick={logout}><li>Logout</li></button>
	</ul>
</div>

<style>
	.menu-container {
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
