<script lang="ts">
	import { onMount } from 'svelte';
	import type { ActionData } from './$types';
	import SignupError from './SignupError';
	import { initializeGoogleAccounts, renderGoogleButton, createGoogleCallback } from '$lib/google';

	export let form: ActionData;
	let googleError: string = '';

	const onGoogleError = ({ message }: { message: string }) => {
		googleError = message;
	};
	const googleCallback = createGoogleCallback('/signup/googleCallback', onGoogleError);

	onMount(() => {
		initializeGoogleAccounts(googleCallback);
		renderGoogleButton();
	});
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>Sign Up</h1>
	<div>
		<div id="googleButton" />
	</div>
	<form method="POST">
		<label for="email">Email</label>
		<input type="email" name="email" id="email" value={form?.email ?? ''} required />
		<label for="password">Password</label>
		<input type="password" name="password" id="password" />
		<button type="submit">Submit</button>

		{#if form?.error === SignupError.VALIDATION}
			<p>Invalid email or password</p>
		{:else if form?.error === SignupError.EMAIL_TAKEN}
			<p>Email already in use. <a href="/login">Login here.</a></p>
		{:else if form?.error === SignupError.UNKNOWN}
			<p>Unknown error</p>
		{/if}
	</form>
	<div>{googleError}</div>
	<div>
		<a href="/login" sveltekit:prefetch>Log in</a>
	</div>
</section>
