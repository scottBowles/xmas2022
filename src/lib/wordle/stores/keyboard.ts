import { derived, writable } from 'svelte/store';
import type { CharStatus } from '$lib/wordle/status';
import { solution } from '$lib/wordle/words';
import { guessStore } from './guess';

export const keyStatusStore = derived(guessStore, ($values) => {
	const base: { [key: string]: CharStatus } = {};
	$values.forEach(({ guess }) =>
		guess.forEach((letter, i) => {
			if (!solution.includes(letter)) {
				base[letter] = 'absent';
				return;
			}
			if (letter === solution[i]) {
				base[letter] = 'correct';
				return;
			}
			if (base[letter] !== 'correct') {
				base[letter] = 'present';
				return;
			}
		})
	);
	return base;
});

function createCorrectedKeyStore() {
	const { update, subscribe } = writable<Set<string>>(new Set());

	return {
		subscribe,
		updateKeys: (key: string) =>
			update((state) => {
				state.add(key);
				return state;
			})
	};
}
export const correctedKeyStore = createCorrectedKeyStore();
