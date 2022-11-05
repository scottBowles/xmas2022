<script lang="ts">
	import type { ActionData } from './$types';
	import LoginError from './LoginError';
	import { onMount } from 'svelte';
	import { initializeGoogleAccounts, renderGoogleButton } from '$lib/google';

	export let form: ActionData;

	onMount(() => {
		initializeGoogleAccounts();
		renderGoogleButton();
	});
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<section>
	<h1>Login</h1>
	<div>
		<div id="googleButton" />
	</div>
	<form method="POST">
		<label for="email">Email</label>
		<input type="email" name="email" id="email" value={form?.email ?? ''} required />
		<label for="password">Password</label>
		<input type="password" name="password" id="password" required />
		<button type="submit">Login</button>
		{#if form?.error === LoginError.INVALID}
			<p>Invalid email or password</p>
		{:else if form?.error === LoginError.UNKNOWN}
			<p>Unknown error</p>
		{/if}
	</form>
</section>
