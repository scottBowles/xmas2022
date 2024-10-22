<script lang="ts">
	import type { PageData } from './$types';
	import { CldImage } from 'svelte-cloudinary';
	import * as R from 'ramda';
	import { normalize } from '$lib/prisma/models/challenge/utils';

	interface Props {
		challenge: PageData['challenges'][number];
	}

	let { challenge }: Props = $props();

	let { mainPrompt, prompts } = $derived(JSON.parse(challenge.prompt));
	let response = $derived(JSON.parse(challenge.response || '[]'));
</script>

<form class="flex flex-col justify-between grow sm:justify-start">
	<div class="flex flex-col mt-4">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<legend class="mb-4 text-lg">{@html mainPrompt}</legend>
		{#each challenge.cldImages as { publicId, alt, width, height }}
			<CldImage src={publicId} {alt} {width} {height} class="w-full mb-4" />
		{/each}

		{#key challenge}
			{#each prompts as { prompt, acceptedAnswers }, i}
				{@const resp = response?.[i]}
				<fieldset disabled>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<span class="text-lg">{@html prompt}</span>
					<input
						type="text"
						name={`response-${i}`}
						value={R.isNotNil(resp) && resp !== 'RESPONSE_FAIL' ? resp : '—'}
						class="text-green-700 border focus:border-2 border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1"
					/>
					{#if acceptedAnswers?.map(normalize).includes(normalize(resp || ''))}
						<span class="text-green-700">✅</span>
					{:else}
						<span class="text-christmasRed">
							{#if R.isNotNil(resp) && resp !== 'RESPONSE_STOP' && resp !== 'RESPONSE_FAIL'}
								❌
							{:else}
								—
							{/if}
							({acceptedAnswers?.[0]})</span
						>
					{/if}
				</fieldset>
			{/each}
		{/key}
	</div>
</form>
