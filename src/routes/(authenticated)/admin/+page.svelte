<script lang="ts">
	import { enhance } from '$app/forms';
	import PageMargin from '$lib/components/PageMargin.svelte';
	import { displayName } from '$lib/prisma/models/user';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	$: ({ users } = data);
</script>

<PageMargin>
	<div class="h-12" />
	<form
		class="flex flex-col justify-between grow sm:justify-start"
		method="POST"
		action="?/recalculate"
		use:enhance
	>
		{#if !users}
			<p class="text-lg mt-3 mb-1">No users found.</p>
		{:else}
			<select name="userId" class="w-full m-1 p-2 border rounded cursor-pointer">
				<option value="">All Users</option>
				{#each users as user (user.id)}
					<option value={user.id}>{displayName(user)}</option>
				{/each}
			</select>
		{/if}

		<input
			type="submit"
			value="Recalculate Scores"
			class="w-full m-1 p-2 border rounded bg-green-700 text-white text-lg cursor-pointer hover:bg-green-800"
		/>
	</form>
	{#if form?.recalculateSuccess}
		<p class="text-lg mt-3 mb-1">Recalculation successful.</p>
	{/if}
	{#if form?.recalculateError}
		<p class="text-lg mt-3 mb-1">Recalculation failed.</p>
		<p>Error: {form.recalculateError}</p>
	{/if}
</PageMargin>
