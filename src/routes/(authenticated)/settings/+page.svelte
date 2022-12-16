<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<form method="POST" class="flex flex-col items-center mt-8" use:enhance>
	<fieldset class="flex flex-col items-center">
		<legend class="text-4xl mb-1 text-green-700">Change Username</legend>
		<input
			name="username"
			type="text"
			placeholder="New Username"
			value={form?.username ?? data.username}
			required
			class="w-full m-1 p-2 text-green-700 border border-green-700 rounded"
		/>
		<input
			type="submit"
			class="w-full m-1 p-2 border rounded bg-green-700 text-white text-lg cursor-pointer hover:bg-green-800"
		/>
	</fieldset>
	{#if form?.error}
		<p class="text-red-700">{form.error}</p>
	{/if}
	{#if form?.success}
		<p class="text-green-700">Username updated</p>
	{/if}
</form>
