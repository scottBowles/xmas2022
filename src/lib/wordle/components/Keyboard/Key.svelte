<script lang="ts">
	import { onDestroy } from 'svelte';
	import { CELL_ANIMATION_DURATION, KEYBOARD_DELAY } from '$lib/wordle/constants/settings';
	import type { CharStatus } from '$lib/wordle/status';
	import { dummy } from '$lib/wordle/transition';
	import type { TStores } from '$lib/wordle/stores';

	interface Props {
		stores: TStores;
		kbKey: string;
		onClick: (value: string) => void;
		status?: CharStatus | undefined;
		heightClass?: string;
		widthClass?: string;
	}

	let {
		stores,
		kbKey,
		onClick,
		status = undefined,
		heightClass = 'h-14',
		widthClass = 'w-12'
	}: Props = $props();

	let { correctedKeyStore } = $derived(stores);

	// for when a status goes from 'present' to 'correct'
	onDestroy(() => {
		if (status && status === 'present') {
			status && correctedKeyStore.updateKeys(kbKey);
		}
	});

	const handleClick = (e: MouseEvent) => {
		onClick(kbKey);
		//@ts-ignore this will exist
		e.currentTarget.blur();
	};
	const animate = (node: HTMLElement, _args?: any): any => {
		if (status) {
			return dummy(node, { duration: CELL_ANIMATION_DURATION, delay: KEYBOARD_DELAY });
		}
	};
</script>

<button
	class="keyboard-key {heightClass} {widthClass}"
	class:absent={status === 'absent'}
	class:correct={status === 'correct'}
	class:present={status === 'present'}
	class:has-previous={$correctedKeyStore.has(kbKey)}
	onclick={handleClick}
	in:animate
	onintrostart={(e) => {
		if (status) {
			e.currentTarget.classList.add('revealing');
		}
	}}
	onintroend={(e) => {
		if (status) {
			e.currentTarget.classList.remove('revealing');
		}
	}}
>
	{kbKey}
</button>

<style lang="postcss" global>
	.keyboard-key {
		@apply m-0.5 flex touch-manipulation select-none items-center justify-center rounded bg-slate-200 text-xs font-bold uppercase text-black hover:bg-slate-300 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-700 md:text-base;
	}
	.keyboard-key.absent {
		@apply bg-slate-500 text-white hover:bg-slate-500 dark:bg-slate-800 dark:hover:bg-slate-800;
	}
	.keyboard-key.correct {
		@apply bg-green-600 text-white hover:bg-green-600;
	}
	.keyboard-key.present {
		@apply bg-yellow-500 text-white hover:bg-yellow-500;
	}
	.keyboard-key.revealing {
		@apply bg-slate-200 text-black hover:bg-slate-300 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-700 !important;
	}
	.keyboard-key.revealing.has-previous {
		@apply bg-yellow-500 text-white hover:bg-yellow-500 !important;
	}
</style>
