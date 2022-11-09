<script lang="ts">
	import { onMount } from 'svelte';
	import LoginError from './LoginError';
	import type { ActionData } from './$types';
	import { initializeGoogleAccounts, renderGoogleButton, createGoogleCallback } from '$lib/google';

	export let form: ActionData;

	let googleError: string = '';

	const onGoogleError = ({ message }: { message: string }) => {
		googleError = message;
	};
	const googleCallback = createGoogleCallback('/login/googleCallback', onGoogleError);

	onMount(() => {
		initializeGoogleAccounts(googleCallback);
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
	<div>{googleError}</div>
	<div>
		<a href="/signup" sveltekit:prefetch>Sign up</a>
	</div>
</section>
