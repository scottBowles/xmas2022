<script lang="ts">
	import { browser } from '$app/environment';
	import { DELETE_TEXT, ENTER_TEXT } from '$lib/wordle/constants/strings';
	import { onDestroy, onMount } from 'svelte';
	import KeySafe from './KeySafe.svelte';
	import type { CharStatus, CharValue } from '@/wordle/status';

	interface Props {
		onChar: (value: string) => void;
		onEnter: () => void;
		onDelete: () => void;
		keyStatuses: Record<CharValue, CharStatus>;
	}

	let { onChar, onEnter, onDelete, keyStatuses }: Props = $props();

	const onKeyDown = (e: KeyboardEvent) => {
		const value = e.key.toUpperCase();
		if (e.ctrlKey || e.shiftKey || e.metaKey) return;
		if (value === 'ENTER' || value === 'RETURN') {
			onEnter();
		} else if (value === 'BACKSPACE' || value === 'DELETE') {
			onDelete();
		} else if (value.length === 1 && value >= 'A' && value <= 'Z') {
			onChar(value);
		}
	};

	onMount(() => {
		if (browser) {
			window.addEventListener('keydown', onKeyDown);
		}
	});
	onDestroy(() => {
		if (browser) {
			window.removeEventListener('keydown', onKeyDown);
		}
	});

	const rowOne = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'] as const;
	const rowTwo = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'] as const;
	const rowThree = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'] as const;
</script>

<div id="keyboard" class="mb-2">
	<section class="flex justify-center">
		{#each rowOne as kbKey (`${kbKey}${keyStatuses[kbKey]}`)}
			<KeySafe {kbKey} onClick={onChar} status={keyStatuses[kbKey]} />
		{/each}
	</section>
	<section class="flex justify-center">
		{#each rowTwo as kbKey (`${kbKey}${keyStatuses[kbKey]}`)}
			<KeySafe {kbKey} onClick={onChar} status={keyStatuses[kbKey]} />
		{/each}
	</section>
	<section class="flex justify-center">
		<KeySafe kbKey={ENTER_TEXT} onClick={onEnter} widthClass="w-[4.5rem]" />
		{#each rowThree as kbKey (`${kbKey}${keyStatuses[kbKey]}`)}
			<KeySafe {kbKey} onClick={onChar} status={keyStatuses[kbKey]} />
		{/each}
		<KeySafe kbKey={DELETE_TEXT} onClick={onDelete} widthClass="w-[4.5rem]" />
	</section>
</div>
