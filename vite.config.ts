import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			/* pwa options */
		})
	]
	// define: { // "If your custom service working is importing any workbox-* module (workbox-routing, workbox-strategies, etc), you will need to hack Vite build process in order to remove non ESM special replacements from the build process (if you don't include process.env.NODE_ENV, the service worker will not be registered)." --https://vite-pwa-org.netlify.app/frameworks/sveltekit.html
	// 	'process.env.NODE_ENV': process.env.NODE_ENV === 'production'
	// 		? '"production"'
	// 		: '"development"'
	// }
});
