<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { spring } from 'svelte/motion';
	import { fly } from 'svelte/transition';

	interface Props {
		dismissible?: boolean;
		type?: string;
		children?: import('svelte').Snippet;
	}

	let { dismissible = true, type = 'success', children }: Props = $props();

	const dispatch = createEventDispatcher();
	const scale = spring(1);
</script>

<div
	class="toast min-w-[12rem] {type}"
	class:justify-center={!dismissible}
	role="alert"
	transition:fly={{ x: -100, duration: 300 }}
>
	<div class:mr-4={dismissible} class:grow={dismissible}>{@render children?.()}</div>
	{#if dismissible}
		<button
			class="font-bold"
			onclick={() => dispatch('dismiss')}
			onmousedown={() => scale.set(0.8)}
			ontouchstart={() => scale.set(0.8)}
			onmouseup={() => scale.set(1)}
			ontouchend={() => scale.set(1)}
			onmouseenter={() => scale.set(1.3)}
			onmouseleave={() => scale.set(1)}
			aria-label="Close"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="inline-block h-[1em] w-[1em] stroke-white hover:stroke-gray-300"
				style="vertical-align: -0.125em; transform: scale({$scale});"
				viewBox="0 0 16 16"
			>
				<path
					fill-rule="evenodd"
					d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
				/>
				<path
					fill-rule="evenodd"
					d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
				/>
			</svg>
		</button>
	{/if}
</div>

<style lang="postcss">
	.toast {
		@apply mt-0 mr-auto mb-2 ml-auto flex items-center rounded-md py-3 px-6 text-lg shadow-xl;
	}
	.toast.success {
		@apply bg-emerald-600 text-white;
	}
	.toast.error {
		@apply bg-rose-600 text-white;
	}
	.toast.warn {
		@apply bg-amber-500 text-white;
	}
	.toast.info {
		@apply bg-sky-600 text-white;
	}
</style>
