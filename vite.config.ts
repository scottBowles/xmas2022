import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			srcDir: './src',
			mode: 'development',
			// // you don't need to do this if you're using generateSW strategy in your app
			// strategies: generateSW ? 'generateSW' : 'injectManifest',
			// // you don't need to do this if you're using generateSW strategy in your app
			// filename: generateSW ? undefined : 'prompt-sw.ts',
			scope: '/',
			base: '/',
			selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
			manifest: {
				name: "Aunt Susan's Christmas",
				short_name: "Aunt Susan's Xmas",
				start_url: '/',
				scope: '/',
				display: 'standalone',
				theme_color: '#c30f16',
				background_color: '#ffffff',
				icons: [
					{
						src: '/android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/maskable_icon_x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'maskable'
					},
					{
						src: '/maskable_icon_x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			// injectManifest: {
			// 	globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			// },
			// workbox: {
			// 	globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			// },
			devOptions: {
				enabled: true,
				suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
				type: 'module',
				navigateFallback: '/'
			},
			// if you have shared info in svelte config file put in a separate module and use it also here
			kit: {}
		})
	],
	define: {
		// "If your custom service working is importing any workbox-* module (workbox-routing, workbox-strategies, etc), you will need to hack Vite build process in order to remove non ESM special replacements from the build process (if you don't include process.env.NODE_ENV, the service worker will not be registered)." --https://vite-pwa-org.netlify.app/frameworks/sveltekit.html
		'process.env.NODE_ENV': process.env.NODE_ENV === 'production' ? '"production"' : '"development"'
	}
});
