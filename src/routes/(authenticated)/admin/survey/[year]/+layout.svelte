<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import PageMargin from '@/components/PageMargin.svelte';
	import urls from '$lib/utils/urls.js';

	let { data, children } = $props();

	let { surveyYears } = $derived(data);
	let year = $derived(parseInt(page.params.year));
	let path = $derived(page.url.pathname);
	let byQuestionOrResponse = $derived(
		(path.includes('by-question') ? 'question' : 'response') as 'question' | 'response'
	);

	const handleSurveyYearSelect = (e: Event) => {
		const selectedYear = parseInt((e.target as HTMLSelectElement).value);
		goto(urls.adminSurvey(selectedYear, byQuestionOrResponse));
	};

	const handleDisplaySelect = (e: Event) => {
		const selectedByQuestionOrResponse = (e.target as HTMLSelectElement).value as
			| 'question'
			| 'response';
		goto(urls.adminSurvey(year, selectedByQuestionOrResponse));
	};
</script>

<PageMargin>
	<div>
		<select
			name="surveyId"
			class="w-full m-1 p-2 border rounded cursor-pointer"
			onchange={handleSurveyYearSelect}
		>
			<option value="">All Surveys</option>
			{#each surveyYears as surveyYear (surveyYear)}
				<option value={surveyYear} selected={surveyYear === year}>{surveyYear}</option>
			{/each}
		</select>
	</div>
	<div>
		<select
			name="byQuestionOrResponse"
			class="w-full m-1 p-2 border rounded cursor-pointer"
			onchange={handleDisplaySelect}
		>
			<option value="response" selected={byQuestionOrResponse === 'response'}>By Response</option>
			<option value="question" selected={byQuestionOrResponse === 'question'}>By Question</option>
		</select>
	</div>
	{@render children?.()}
</PageMargin>
