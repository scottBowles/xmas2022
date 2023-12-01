import { browser } from '$app/environment';
import type { CharStatus, CharValue } from '$lib/wordle/status';
// import { solution } from '$lib/wordle/words';
import { writable } from 'svelte/store';
import { loadGameFromLocalStorage } from '$lib/wordle/localstorage';
import { MAX_CHALLENGES } from '$lib/wordle/constants/settings';
import type { createGameStateStore } from './gameState';

export type Guess = {
	guess: CharValue[];
	statuses: CharStatus[];
};

const helper = (guess: CharValue[], solution: string) => {
	const splitSolution = solution.split('');
	//* used to make sure we don't perform the same present check more than once
	const usedSolutionCharacters = splitSolution.map(() => false);

	const statuses: CharStatus[] = Array.from(Array(guess.length));

	//* Start with correct cases
	guess.forEach((letter, index) => {
		if (letter === splitSolution[index]) {
			statuses[index] = 'correct';
			usedSolutionCharacters[index] = true;
			return;
		}
	});

	guess.forEach((letter, index) => {
		if (statuses[index]) return;

		//* letter is absent
		if (!splitSolution.includes(letter)) {
			statuses[index] = 'absent';
			return;
		}
		//* present status test
		const indexOfPresentChar = splitSolution.findIndex(
			(char, i) => char === letter && !usedSolutionCharacters[i]
		);

		if (indexOfPresentChar > -1) {
			statuses[index] = 'present';
			usedSolutionCharacters[indexOfPresentChar] = true;
			return;
		} else {
			statuses[index] = 'absent';
			return;
		}
	});
	return { guess, statuses };
};
export function createGuessStore(
	gameStateStore: ReturnType<typeof createGameStateStore>,
	solution: string,
	key: string,
	guesses?: string[]
) {
	//* initialize
	let init: Guess[] = [];
	if (browser || guesses) {
		const loaded = guesses ? { solution, guesses } : loadGameFromLocalStorage(key);
		if (loaded?.solution === solution) {
			const isGameWon = loaded.guesses.includes(solution);
			if (isGameWon) {
				gameStateStore.setGameWon(true);
			}
			if (loaded.guesses.length === MAX_CHALLENGES && !isGameWon) {
				gameStateStore.setGameLost(true);
			}
			init = loaded.guesses.map((g) => {
				return helper(g.split('') as CharValue[], solution);
			});
		}
	}
	//* main logic
	const { subscribe, update, set } = writable<Guess[]>(init);
	return {
		subscribe,
		addGuess: (guess: CharValue[]) =>
			update((state) => {
				const newGuess = helper(guess, solution);
				state.push(newGuess);
				return state;
			}),
		reset: () => set([])
	};
}
// NEED TO CREATE STORE IN COMPONENT, PASSING IN SOLUTION
// export const guessStore = createGuessStore();
