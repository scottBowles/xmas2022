<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { NEXT_INPUT_VALUE, SUBMIT_INPUT_VALUE } from './constants';
	import controlRoom from '$lib/assets/santas_workshop_controlroom.png';
	import garage from '$lib/assets/santas_workshop_garage.png';
	import mailroom from '$lib/assets/santas_workshop_mailroom.png';
	import runway from '$lib/assets/santas_workshop_runway.png';

	export let data: PageData;

	$: ({ challenge, setHasAnotherChallenge } = data);
	$: response = challenge?.responses[0]?.response ?? '';

	$: ({ assistants, helpers, managers } = JSON.parse(challenge.prompt));
	$: console.log({ assistants, helpers, managers });

	let answer = ['', '', '', '', '', '', '', '', '', '', '', ''];
	$: console.log(answer);
</script>

<p class="mt-4 mb-4">
	With Christmas Day fast approaching, Santa has hired 24 elves to help him in his workshop. The
	elves work in pairs. Sadly, the job assignment list for each pair was lost! Use the clues to help
	Santa assign the elf pairs to the correct job.
</p>

<div class="mb-4">
	<div class="mb-2">
		<h2 class="font-bold">MANAGERS</h2>
		<ul>
			{#each managers as manager}
				<li>{manager.longName}</li>
			{/each}
		</ul>
	</div>
	<div class="mb-2">
		<h2 class="font-bold">ASSISTANTS</h2>
		<ul>
			{#each assistants as assistant}
				<li>{assistant.longName}</li>
			{/each}
		</ul>
	</div>
	<div>
		<h2 class="font-bold">HELPERS</h2>
		<ul>
			{#each helpers as helper}
				<li>{helper.longName}</li>
			{/each}
		</ul>
	</div>
</div>

<div class="mb-4">
	<h2 class="font-bold">Clues:</h2>
	<ol>
		<li>1. Each area has a manager pair, a helper pair and an assistant pair.</li>
		<li>
			2. <span class="text-christmasRed">{managers[1].shortName}</span> do not work in the control room
			or the mail room.
		</li>
		<li>
			3. <span class="text-green-700">{helpers[0].shortName}</span> work on the runway.
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

<div class="mb-32">
	<form>
		<legend>List the elves in each area:</legend>
		<input type="hidden" value={answer} name="answer" />
		<div class="grid grid-cols-2 gap-4">
			<div class="flex flex-col justify-between">
				<img src={controlRoom} alt="Control room" />
				<div>
					<label class="text-green-700">
						Manager
						<input
							name="controlRoom1"
							bind:value={answer[0]}
							class="text-green-700 border border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1"
						/>
					</label>
					<label class="text-green-700">
						Helper
						<input
							name="controlRoom2"
							bind:value={answer[1]}
							class="text-green-700 border border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1"
						/>
					</label>
					<label class="text-green-700">
						Assistant
						<input
							name="controlRoom3"
							bind:value={answer[2]}
							class="text-green-700 border border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1"
						/>
					</label>
				</div>
			</div>
			<div class="flex flex-col justify-between">
				<img src={garage} alt="Garage" />
				<div>
					<label class="text-green-700">
						Manager
						<input
							name="garage1"
							bind:value={answer[3]}
							class="text-green-700 border border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1"
						/>
					</label>
					<label class="text-green-700">
						Helper
						<input
							name="garage2"
							bind:value={answer[4]}
							class="text-green-700 border border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1"
						/>
					</label>
					<label class="text-green-700">
						Assistant
						<input
							name="garage3"
							bind:value={answer[5]}
							class="text-green-700 border border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1"
						/>
					</label>
				</div>
			</div>
			<div class="flex flex-col justify-between">
				<img src={mailroom} alt="Mailroom" />
				<div>
					<label class="text-green-700">
						Manager
						<input
							name="mailroom1"
							bind:value={answer[6]}
							class="text-green-700 border border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1"
						/>
					</label>
					<label class="text-green-700">
						Helper
						<input
							name="mailroom2"
							bind:value={answer[7]}
							class="text-green-700 border border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1"
						/>
					</label>
					<label class="text-green-700">
						Assistant
						<input
							name="mailroom3"
							bind:value={answer[8]}
							class="text-green-700 border border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1"
						/>
					</label>
				</div>
			</div>
			<div class="flex flex-col justify-between">
				<img src={runway} alt="Runway" />
				<div>
					<label class="text-green-700">
						Manager
						<input
							name="runway1"
							bind:value={answer[9]}
							class="text-green-700 border border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1"
						/>
					</label>
					<label class="text-green-700">
						Helper
						<input
							name="runway2"
							bind:value={answer[10]}
							class="text-green-700 border border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1"
						/>
					</label>
					<label class="text-green-700">
						Assistant
						<input
							name="runway3"
							bind:value={answer[11]}
							class="text-green-700 border border-green-700 rounded focus:border-green-700 focus:outline-none w-full px-2 py-1"
						/>
					</label>
				</div>
			</div>
		</div>
		<!-- NEED A SUBMIT BUTTON WITH THE RIGHT ACTION/NAME OR WHATEVER -->
		<!-- ALSO NEED TO PUT THE RIGHT STUFF ON THE FORM ELEMENT -->
	</form>
</div>
