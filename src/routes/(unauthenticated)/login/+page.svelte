<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { LoginError, SignupError } from './Errors';
	import GoogleButton from '$lib/components/GoogleButton.svelte';
	import PageMargin from '$lib/components/PageMargin.svelte';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	let mode: 'login' | 'signup' = 'login';
	let googleError: string = '';

	const toggleMode = () => (mode = mode === 'login' ? 'signup' : 'login');
	const onGoogleError = (message: string) => (googleError = message);

	$: ({ title, heading, action, toggleMessage } = {
		login: {
			title: 'Login',
			action: '?/login',
			heading: 'Login',
			toggleMessage: 'Need an account? Sign up here.'
		},
		signup: {
			title: 'Create an Account',
			action: '?/signup',
			heading: 'Create Account',
			toggleMessage: 'Have an account? Login here.'
		}
	}[mode]);
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<PageMargin>
	<section>
		<form method="POST" {action} class="flex flex-col items-center mt-8" use:enhance>
			<fieldset class="flex flex-col items-center">
				<legend class="text-4xl mb-1 text-green-700">{heading}</legend>
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={form?.email ?? ''}
					required
					class="w-64 m-1 p-2 text-green-700 border border-green-700 rounded"
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					required
					class="w-64 m-1 p-2 text-green-700 border border-green-700 rounded"
				/>
				<input type="hidden" name="group" value={data.group} />
			</fieldset>
			<input
				type="submit"
				class="w-64 m-1 p-2 border rounded bg-green-700 text-white text-lg cursor-pointer hover:bg-green-800"
			/>

			{#if form?.error && [LoginError.INVALID, SignupError.VALIDATION].includes(form.error)}
				<p class="pt-4 text-christmasRed">Invalid email or password</p>
			{:else if form?.error === SignupError.EMAIL_TAKEN}
				<p class="pt-4 text-christmasRed">Email already in use.</p>
			{:else if form?.error === LoginError.EMAIL_MISSING}
				<p class="pt-4 text-christmasRed">Email and password required.</p>
			{:else if form?.error && [LoginError.UNKNOWN, SignupError.UNKNOWN].includes(form.error)}
				<p class="pt-4 text-christmasRed">Unknown error</p>
			{/if}

			<div class="pt-4">
				<GoogleButton {onGoogleError} />
			</div>

			<p
				on:click={toggleMode}
				on:keyup={toggleMode}
				class="text-green-700 pt-4 cursor-pointer hover:underline"
			>
				{toggleMessage}
			</p>
		</form>
		<div>{googleError}</div>
	</section>
</PageMargin>
