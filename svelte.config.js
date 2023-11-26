import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		serviceWorker: {
			// "You will need to exclude the service worker registration from the SvelteKit configuration if you're using any pwa virtual module (virtual:pwa-register or virtual:pwa-register/svelte)" --https://vite-pwa-org.netlify.app/frameworks/sveltekit.html
			register: false
		}
	},

	vitePlugin: {
		inspector: true
	}
};

export default config;
