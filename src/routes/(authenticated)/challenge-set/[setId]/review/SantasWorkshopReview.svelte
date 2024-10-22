<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import controlRoom from '$lib/assets/santas_workshop_controlroom.png';
	import garage from '$lib/assets/santas_workshop_garage.png';
	import mailroom from '$lib/assets/santas_workshop_mailroom.png';
	import runway from '$lib/assets/santas_workshop_runway.png';
	import ShowHideToggle from '$lib/components/ShowHideToggle.svelte';
	import { normalize } from '$lib/prisma/models/challenge/utils';

	interface Props {
		challenge: PageData['challenges'][number];
	}

	let { challenge }: Props = $props();

	let { assistants, helpers, managers } = $derived(JSON.parse(challenge.prompt));
	let givenAnswer = $derived(JSON.parse(challenge.response || '[]'));
	let correctAnswer = $derived(JSON.parse(challenge.correctAnswer || '[]'));

	const workshopAreaImgData = [
		{ src: controlRoom, alt: 'Control room' },
		{ src: garage, alt: 'Garage' },
		{ src: mailroom, alt: 'Mailroom' },
		{ src: runway, alt: 'Runway' },
	];
</script>

<ShowHideToggle showContentLabel="Show puzzle" hideContentLabel="Hide puzzle">
	<div class="mt-4 mb-4">
		<p class="mb-2">
			With Christmas Day fast approaching, Santa has hired 24 elves to help him in his workshop. The
			elves work in pairs. Sadly, the job assignment list for each pair was lost!
		</p>
		<p>Use the clues to help Santa assign the elf pairs to the correct job.</p>
	</div>

	<div class="mb-4">
		<div class="mb-2">
			<h2 class="font-bold">MANAGERS</h2>
			<ul>
				{#each managers as manager, i}
					<li class={i % 2 === 0 ? 'text-green-700' : 'text-christmasRed'}>{manager.longName}</li>
				{/each}
			</ul>
		</div>
		<div class="mb-2">
			<h2 class="font-bold">ASSISTANTS</h2>
			<ul>
				{#each assistants as assistant, i}
					<li class={i % 2 === 0 ? 'text-green-700' : 'text-christmasRed'}>{assistant.longName}</li>
				{/each}
			</ul>
		</div>
		<div>
			<h2 class="font-bold">HELPERS</h2>
			<ul>
				{#each helpers as helper, i}
					<li class={i % 2 === 0 ? 'text-green-700' : 'text-christmasRed'}>{helper.longName}</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="mb-4">
		<h2 class="font-bold">Clues:</h2>
		<ol>
			<li>1. Each area has a manager pair, a helper pair and an assistant pair.</li>
			<li>
				2. <span class="text-christmasRed">{managers[1].shortName}</span> do not work in the control
				room or the mail room.
			</li>
			<li>
				3. <span class="text-green-700">{helpers[1].shortName}</span> work on the runway.
			</li>
			<li>
				4. <span class="text-christmasRed">{managers[0].shortName}</span> don’t work in the mail room.
			</li>
			<li>
				5. <span class="text-green-700">{managers[2].shortName}</span> work in the same area as
				<span class="text-christmasRed">{helpers[1].shortName}</span>.
			</li>
			<li>
				6. <span class="text-christmasRed">{assistants[2].shortName}</span> don’t work well with
				<span class="text-green-700">{helpers[1].shortName}</span>
				or <span class="text-christmasRed">{helpers[0].shortName}</span>.
			</li>
			<li>
				7. <span class="text-green-700">{helpers[3].shortName}</span> &
				<span class="text-christmasRed">{assistants[0].shortName}</span> work in the same area.
			</li>
			<li>
				8. <span class="text-christmasRed">{helpers[0].shortName}</span> don’t work in the control room
				or garage.
			</li>
			<li>
				9. <span class="text-green-700">{helpers[2].shortName}</span> don’t work in the control room.
			</li>
			<li>
				10. <span class="text-christmasRed">{assistants[3].shortName}</span> don’t work with
				<span class="text-green-700">{managers[3].shortName}</span>.
			</li>
		</ol>
	</div>
</ShowHideToggle>

<div class="mb-32">
	<form class="mt-6 mb-64" method="POST" use:enhance>
		<fieldset disabled>
			<legend
				>List the elves in each area using first names only, as they appear in the clues:</legend
			>
			<div class="grid grid-cols-2 gap-4">
				{#each workshopAreaImgData as { src, alt }, i}
					<div class="flex flex-col justify-between">
						<img {src} {alt} />
						<div>
							<label class={'text-green-700'}>
								{#if normalize(givenAnswer[i * 3]) === normalize(correctAnswer[i * 3])}
									<span class="text-green-700">Manager ✅</span>
								{:else}
									<span class="text-christmasRed">Manager ❌ ({correctAnswer[i * 3]})</span>
								{/if}
								<input
									name="controlRoom1"
									value={givenAnswer[i * 3]}
									class="text-green-700 border border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1 mb-4"
								/>
							</label>
							<label class={'text-christmasRed'}>
								{#if normalize(givenAnswer[i * 3 + 1]) === normalize(correctAnswer[i * 3 + 1])}
									<span class="text-green-700">Helper ✅</span>
								{:else}
									<span class="text-christmasRed">Helper ❌ ({correctAnswer[i * 3 + 1]})</span>
								{/if}
								<input
									name="controlRoom2"
									value={givenAnswer[i * 3 + 1]}
									class="text-green-700 border border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1 mb-4"
								/>
							</label>
							<label class={'text-green-700'}>
								{#if normalize(givenAnswer[i * 3 + 2]) === normalize(correctAnswer[i * 3 + 2])}
									<span class="text-green-700">Assistant ✅</span>
								{:else}
									<span class="text-christmasRed">Assistant ❌ ({correctAnswer[i * 3 + 2]})</span>
								{/if}
								<input
									name="controlRoom3"
									value={givenAnswer[i * 3 + 2]}
									class="text-green-700 border border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1 mb-4"
								/>
							</label>
						</div>
					</div>
				{/each}
			</div>
		</fieldset>
	</form>
</div>
