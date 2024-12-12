<script lang="ts">
	import Base from '$lib/wordle/components/Modal/Base.svelte';

	interface Props {
		// Modal Visiblity
		isOpen?: boolean;
		// Toggle Modal visibility
		toggleIsOpen?: (value: boolean) => void;
		onConfirm?: () => void;
	}

	let {
		isOpen = $bindable(false),
		toggleIsOpen = (value: boolean) => {
			isOpen = value;
		},
		onConfirm = () => {},
	}: Props = $props();
</script>

<Base {isOpen} {toggleIsOpen}>
	{#snippet header()}
		<h3 class="text-center text-lg font-medium text-white leading-6">Confirm</h3>
	{/snippet}
	{#snippet content()}
		<div class="mt-3 text-white text-center">Are you sure you want to submit?</div>
	{/snippet}
	{#snippet footer()}
		<div class="mt-3 flex justify-around">
			<button
				type="button"
				onclick={() => toggleIsOpen(false)}
				class="bg-red-700 text-white font-bold py-3 px-6 rounded text-lg my-8 block w-1/4"
				>No</button
			>
			<button
				type="button"
				onclick={onConfirm}
				class="bg-green-700 text-white font-bold py-3 px-6 rounded text-lg my-8 block w-1/4"
				>Yes</button
			>
		</div>
	{/snippet}
</Base>
