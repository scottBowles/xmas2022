<script lang="ts">
	import { run } from 'svelte/legacy';

	import Settings from '$lib/wordle/components/Modal/Settings.svelte';
	import Help from '$lib/wordle/components/Modal/Help.svelte';
	// import StatsModal from '$lib/wordle/components/Modal/__Stats.svelte';
	import {
		// statsModalState,
		helpModalState,
		settingsModalState
	} from '$lib/wordle/stores/modals';
	import { GAME_TITLE } from '$lib/wordle/constants/strings';
	import {
		darkModeStore,
		// highContrastStore,
		watchDarkMode
		// watchHighContrast
	} from '$lib/wordle/stores/theme';

	run(() => {
		watchDarkMode($darkModeStore);
	});
	// $: watchHighContrast($highContrastStore);
</script>

<header class="flex grow-0 items-center justify-between border-b-2 pb-1 dark:border-slate-600">
	<div class="mr-10 flex items-center justify-center">
		<Help isOpen={$helpModalState} toggleIsOpen={helpModalState.set} />
	</div>
	<h1 class="text-2xl font-semibold md:text-4xl">{GAME_TITLE}</h1>
	<div class="flex items-center justify-center">
		<!-- <StatsModal isOpen={$statsModalState} toggleIsOpen={statsModalState.set} /> -->
		<Settings isOpen={$settingsModalState} toggleIsOpen={settingsModalState.set} />
	</div>
</header>
