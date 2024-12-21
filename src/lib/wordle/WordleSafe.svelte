<script lang="ts">
	import { run } from 'svelte/legacy';

	import { browser } from '$app/environment';
	import type { CharStatus, CharValue } from '$lib/wordle/status';
	import { isWordInWordList } from '$lib/wordle/words';
	import { saveGameToLocalStorage } from '$lib/wordle/localstorage';
	import {
		CELL_ANIMATION_DURATION,
		KEYBOARD_DELAY,
		MAX_CHALLENGES,
		MAX_WORD_LENGTH,
	} from '$lib/wordle/constants/settings';
	import Keyboard from '$lib/wordle/components/Keyboard/Keyboard.svelte';
	import Grid from '@/wordle/components/Grid/GridSafe.svelte';
	import { toastStore } from '$lib/wordle/components/Toast/store';
	import { statStore } from '$lib/wordle/stores/stats';
	import gameStores from '$lib/wordle/stores';
	import {
		aboutModalState,
		helpModalState,
		settingsModalState,
		statsModalState,
	} from '$lib/wordle/stores/modals';
	import {
		CORRECT_WORD_MSG,
		INVALID_WORD_MSG,
		NOT_ENOUGH_LETTERS_MSG,
		WIN_MESSAGES,
	} from '$lib/wordle/constants/strings';
	import Container from '$lib/wordle/components/Toast/Container.svelte';
	import { createGameStateStore } from './stores/gameState';
	import KeyboardSafe from './components/Keyboard/KeyboardSafe.svelte';
	import GridSafe from '@/wordle/components/Grid/GridSafe.svelte';

	interface Props {
		onSubmit: (guess: string) => void;
		allGuesses: { guess: CharValue[]; statuses: CharStatus[] }[];
		currentGuess: CharValue[];
	}

	let { onSubmit, allGuesses, currentGuess = $bindable() }: Props = $props();

	const RESPONSE_TIMEOUT = KEYBOARD_DELAY + CELL_ANIMATION_DURATION;

	const gameStateStore = createGameStateStore();

	const getKeyStatusesFromGuesses = (guesses: { guess: CharValue[]; statuses: CharStatus[] }[]) => {
		const keyStatusMap: Record<string, CharStatus> = {};
		guesses.forEach(({ guess, statuses }) => {
			guess.forEach((char, i) => {
				// put the status in the map, but don't overwrite to a lower status
				const status = statuses[i];
				if (keyStatusMap[char] === 'correct') return;
				if (keyStatusMap[char] === 'present' && status !== 'correct') return;
				keyStatusMap[char] = status;
			});
		});
		return keyStatusMap;
	};

	// should be able to derive this from server state
	let keyStatuses: Record<CharValue, CharStatus> = $derived(getKeyStatusesFromGuesses(allGuesses));

	// const getGuessesString = (store: typeof $guessStore) =>
	// 	store.map((g) => g.guess.join('')).join(',');

	// const guessStore = createGuessStore(solution);

	// consider moving into onMount function
	// GAME WON
	// run(() => {
	// 	if ($gameStateStore.gameWon) {
	// 		toastStore.show({
	// 			dismissible: false,
	// 			message: WIN_MESSAGES[$guessStore.length - 1],
	// 			id: 'wintoast',
	// 			timeout: 3000,
	// 		});
	// 		setTimeout(() => statsModalState.set(true), 3000);
	// 		onCompletion(getGuessesString($guessStore));
	// 	}
	// });
	// GAME LOST
	// run(() => {
	// 	if ($gameStateStore.gameLost) {
	// 		toastStore.show({
	// 			dismissible: false,
	// 			message: CORRECT_WORD_MSG(solution),
	// 			type: 'error',
	// 			id: 'losetoast',
	// 			timeout: 3000,
	// 		});
	// 		setTimeout(() => statsModalState.set(true), 3000);
	// 		onCompletion(getGuessesString($guessStore));
	// 	}
	// });
	// run(() => {
	// 	if (browser) {
	// 		saveGameToLocalStorage(storageKey, {
	// 			solution,
	// 			guesses: $guessStore.map((store) => store.guess.join('')),
	// 		});
	// 	}
	// });

	const onChar = (value: string) => {
		if (currentGuess.length < MAX_WORD_LENGTH) {
			currentGuess.push(value as CharValue);
			currentGuess = currentGuess;
		}
	};
	const onDelete = () => {
		if (currentGuess.length > 0) {
			currentGuess.pop();
			currentGuess = currentGuess;
		}
	};
	const onEnter = () => {
		//* if modals are open
		if ($statsModalState || $helpModalState || $settingsModalState || $aboutModalState) {
			return;
		}
		if (!(currentGuess.length === MAX_WORD_LENGTH)) {
			toastStore.show({
				timeout: 3000,
				dismissible: false,
				message: NOT_ENOUGH_LETTERS_MSG,
				type: 'warn',
			});
			return;
		}
		// if (!isWordInWordList(currentGuess.join(''))) {
		// 	toastStore.show({
		// 		timeout: 3000,
		// 		dismissible: false,
		// 		message: INVALID_WORD_MSG,
		// 		type: 'warn',
		// 	});
		// 	return;
		// }
		onSubmit(currentGuess.join(''));
		// if ($guessStore.length < MAX_CHALLENGES && !$gameStateStore.gameWon) {
		// 	guessStore.addGuess(currentGuess);
		// 	currentGuess = [];

		// 	if (winningWord) {
		// 		statStore.addStatsForCompletedGame($guessStore.length, true);
		// 		setTimeout(() => gameStateStore.setGameWon(true), RESPONSE_TIMEOUT);
		// 		return;
		// 	}

		// 	if ($guessStore.length === MAX_CHALLENGES) {
		// 		statStore.addStatsForCompletedGame($guessStore.length, false);
		// 		setTimeout(() => gameStateStore.setGameLost(true), RESPONSE_TIMEOUT);
		// 	}
		// }
	};
</script>

<!-- <Header /> -->

<div class="flex grow flex-col items-center justify-center">
	<GridSafe {currentGuess} {allGuesses} />
</div>

<!-- <div> -->
<KeyboardSafe {onChar} {onDelete} {onEnter} {keyStatuses} />
<!-- </div> -->

<!-- <Footer /> -->
