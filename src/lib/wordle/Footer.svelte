<script>
	import About from '$lib/wordle/components/Modal/About.svelte';
	import { aboutModalState } from '$lib/wordle/stores/modals';
	//@ts-ignore this does exist because we set it in the kit config
	// const clientVersion = __version__;
</script>

<footer class="flex grow-0 justify-around py-1 text-center text-sm sm:py-2">
	<!-- <section>Version <strong>{clientVersion}</strong></section> -->

	<section><About isOpen={$aboutModalState} toggleIsOpen={aboutModalState.set} /></section>
</footer>
