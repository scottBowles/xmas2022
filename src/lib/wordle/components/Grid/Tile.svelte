<script lang="ts">
	import { CELL_ANIMATION_DURATION } from '$lib/wordle/constants/settings';
	import type { CharStatus } from '$lib/wordle/status';
	import { rotateX } from '$lib/wordle/transition';
	import { backOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	interface Props {
		letter?: string | undefined;
		status?: CharStatus | undefined;
		heightClass?: string;
		widthClass?: string;
		delay?: number;
	}

	let {
		letter = undefined,
		status = undefined,
		heightClass = 'h-16',
		widthClass = 'w-16 max-w-[100%]',
		delay = 1
	}: Props = $props();

	const animate = (node: HTMLElement, args?: any): any => {
		if (status) {
			return rotateX(node, {
				delay,
				duration: CELL_ANIMATION_DURATION,
				degrees: args.degrees,
				changeBg: args.changeBg
			});
		}
		if (letter) return scale(node, { start: 0.9, opacity: 1, easing: backOut, duration: 200 });
	};
</script>

<div
	class="game-tile {heightClass} {widthClass}"
	class:dark:border-slate-600={!letter}
	class:dark:border-white={!!letter && !status}
	class:border-black={!!letter && !status}
	class:text-shadow={!!status}
	class:absent={status === 'absent'}
	class:correct={status === 'correct'}
	class:present={status === 'present'}
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
	<div in:animate={{ changeBg: false, degrees: -180 }} class="letter-wrapper">
		{letter ?? ''}
	</div>
</div>

<style lang="postcss" global>
	.game-tile {
		@apply flex select-none items-center justify-center rounded border-2 text-4xl font-bold;
	}
	.game-tile.absent {
		@apply border-slate-500 bg-slate-500 text-white dark:border-slate-700 dark:bg-slate-700;
	}
	.game-tile.present {
		@apply border-yellow-500 bg-yellow-500 text-white;
	}
	.game-tile.correct {
		@apply border-green-600 bg-green-600 text-white;
	}
	.game-tile.revealing {
		@apply !border-black text-black dark:!border-white dark:!text-white;
	}
</style>
