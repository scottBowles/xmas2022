<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { LoginError, SignupError } from './Errors';
	import GoogleButton from '$lib/components/GoogleButton.svelte';
	import PageMargin from '$lib/components/PageMargin.svelte';
	import { enhance } from '$app/forms';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let mode: 'login' | 'signup' = $state('login');
	let googleError: string = $state('');

	const toggleMode = () => (mode = mode === 'login' ? 'signup' : 'login');
	const onGoogleError = (message: string) => (googleError = message);

	let { title, heading, action, toggleMessage } = $derived({
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

	let errorMessage =
		$derived(form?.error &&
		{
			[LoginError.INVALID]: 'Invalid email or password',
			[SignupError.VALIDATION]: 'Invalid email or password',
			[SignupError.EMAIL_TAKEN]: 'Email already in use.',
			[LoginError.EMAIL_MISSING]: 'Email and password required.',
			[LoginError.UNKNOWN]: 'Unknown error',
			[SignupError.UNKNOWN]: 'Unknown error'
		}[form.error]);
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

			{#if errorMessage}
				<p class="pt-4 text-christmasRed">{errorMessage}</p>
			{/if}

			<div class="pt-4"><GoogleButton {onGoogleError} /></div>

			<button
				onclick={toggleMode}
				onkeyup={toggleMode}
				class="text-green-700 pt-4 cursor-pointer hover:underline"
				type="button"
			>
				{toggleMessage}
			</button>
		</form>
		<div>{googleError}</div>
	</section>
</PageMargin>
