<script>
	import { page } from '$app/stores';
	import PageMargin from '@/components/PageMargin.svelte';

	let { status } = $page;

	let text = $derived(
		(() => {
			if (status === 404) return 'Page not found';
			if (status === 500) return 'Server error';
			return 'Something went wrong';
		})()
	);
</script>

<PageMargin>
	<div class="flex flex-col items-center mt-12">
		<div>
			<h1 class="text-xl text-christmasRed mt-4">{status}: {text}</h1>

			<p class="mt-4">Sorry about that. If this was unexpected, let Scott know.</p>

			<p class="mt-4">
				<a href="/" class="text-green-700 hover:underline" data-sveltekit-preload-data="hover">
					Click here
				</a> to go to the home page.
			</p>
		</div>
	</div>
</PageMargin>
