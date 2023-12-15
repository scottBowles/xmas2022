<script lang="ts">
	import Base from '$lib/wordle/components/Modal/Base.svelte';

	/** Modal Visiblity */
	export let isOpen = false;
	/** Toggle Modal visibility */
	export let toggleIsOpen = (value: boolean) => {
		isOpen = value;
	};
	export let onConfirm = () => {};
</script>

<Base {isOpen} {toggleIsOpen}>
	<h3 slot="header" class="text-center text-lg font-medium text-white leading-6">Confirm</h3>
	<div slot="content" class="mt-3 text-white text-center">Are you sure you want to submit?</div>
	<div slot="footer" class="mt-3 flex justify-around">
		<button
			type="button"
			on:click={() => toggleIsOpen(false)}
			class="bg-red-700 text-white font-bold py-3 px-6 rounded text-lg my-8 block w-1/4">No</button
		>
		<button
			type="button"
			on:click={onConfirm}
			class="bg-green-700 text-white font-bold py-3 px-6 rounded text-lg my-8 block w-1/4"
			>Yes</button
		>
	</div>
</Base>
