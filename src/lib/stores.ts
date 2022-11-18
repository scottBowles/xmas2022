import { writable } from 'svelte/store';

export const menu = () => {
	const { subscribe, update, set } = writable(false);
	const toggle = () => update((state) => !state);
	const open = () => set(true);
	const close = () => set(false);
	return { subscribe, toggle, open, close };
};
export type MenuStore = ReturnType<typeof menu>;
