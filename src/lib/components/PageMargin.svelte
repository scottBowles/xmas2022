<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<div>
	{@render children?.()}
</div>

<style>
	div {
		max-width: 38rem;
		padding-left: 2rem;
		padding-right: 2rem;
		margin: auto;
	}
</style>
