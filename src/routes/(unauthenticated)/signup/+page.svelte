<script lang="ts">
	import type { ActionData } from './$types';
	import SignupError from './SignupError';
	import GoogleButton from '$lib/components/GoogleButton.svelte';

	export let form: ActionData;

	let googleError: string = '';

	const onGoogleError = (message: string) => {
		googleError = message;
	};
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<section>
	<h1>Sign Up</h1>
	<div>
		<GoogleButton {onGoogleError} />
	</div>
	<form method="POST">
		<label for="email">Email</label>
		<input type="email" name="email" id="email" value={form?.email ?? ''} required />
		<label for="password">Password</label>
		<input type="password" name="password" id="password" required />
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
		<a href="/login" data-sveltekit-prefetch>Log in</a>
	</div>
</section>
