import { get, writable } from 'svelte/store';
import { createGameStateStore } from './gameState';
import { createGuessStore } from './guess';
import { createCorrectedKeyStore, createKeyStatusStore } from './keyboard';

// these are all singletons used to control modal state
export { statsModalState, helpModalState, settingsModalState, aboutModalState } from './modals';
// this is a singleton that holds state across puzzles and loads it from local storage
export { statStore } from './stats';
// these are singletons for ui state
export { darkModeStore, watchDarkMode } from './theme';

const initStore = (key: string, solution: string) => {
	const gameStateStore = createGameStateStore();
	const guessStore = createGuessStore(gameStateStore, solution, key);
	const keyStatusStore = createKeyStatusStore(guessStore, solution);
	const correctedKeyStore = createCorrectedKeyStore();
	return { gameStateStore, guessStore, keyStatusStore, correctedKeyStore };
};

const hashedStores = writable<Record<string, ReturnType<typeof initStore>>>({});

const getForKey = (key: string) => get(hashedStores)[key];
const initForKey = (key: string, solution: string) => {
	const store = initStore(key, solution);
	hashedStores.update((state) => ({ ...state, [key]: store }));
	return store;
};
const getOrInit = (key: string, solution: string) => getForKey(key) || initForKey(key, solution);

export type TStores = ReturnType<typeof initStore>;

export default {
	getForKey,
	initForKey,
	getOrInit,
	...hashedStores
};
