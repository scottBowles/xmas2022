<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import PageMargin from '$lib/components/PageMargin.svelte';
	import { displayName } from '$lib/prisma/models/user';
	import { urls } from '$lib/utils';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let { users, surveyYears } = $derived(data);
	let { year } = $derived($page.params);

	const handleSurveyYearSelect = (e: Event) => {
		const surveyYear = parseInt((e.target as HTMLSelectElement).value);
		goto(urls.adminSurvey(surveyYear, 'response'));
	};
</script>

<PageMargin>
	<div class="h-12"></div>
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

	<div class="h-12"></div>
	<div>
		<select
			name="surveyId"
			class="w-full m-1 p-2 border rounded cursor-pointer"
			onchange={handleSurveyYearSelect}
		>
			<option value="">All Surveys</option>
			{#each surveyYears as surveyYear (surveyYear)}
				<option value={surveyYear} selected={surveyYear === parseInt(year)}>{surveyYear}</option>
			{/each}
		</select>
	</div>
</PageMargin>
