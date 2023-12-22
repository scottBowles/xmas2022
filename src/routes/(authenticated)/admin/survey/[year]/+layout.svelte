<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import PageMargin from '$lib/components/PageMargin.svelte';
	import urls from '$lib/utils/urls.js';

	export let data;

	$: ({ surveyYears } = data);
	$: year = parseInt($page.params.year);
	$: path = $page.url.pathname;
	$: byQuestionOrResponse = (path.includes('by-question') ? 'question' : 'response') as
		| 'question'
		| 'response';

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
			on:change={handleSurveyYearSelect}
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
			on:change={handleDisplaySelect}
		>
			<option value="response" selected={byQuestionOrResponse === 'response'}>By Response</option>
			<option value="question" selected={byQuestionOrResponse === 'question'}>By Question</option>
		</select>
	</div>
	<slot />
</PageMargin>
