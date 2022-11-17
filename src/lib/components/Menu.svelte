<script>
	import { slide } from 'svelte/transition';
	import { logout } from '$lib/clientOnly/logout';
</script>

<div class="container" transition:slide>
	<ul>
		<a href="/"><li>Play!</li></a>
		<a href="/pastchallenges"><li>Past Challenges</li></a>
		<a href="/scoreboard"><li>Scoreboard</li></a>
		<!-- <a href="/profile"><li>Profile</li></a> -->
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
