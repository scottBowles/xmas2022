<script lang="ts">
	import { slide } from 'svelte/transition';
	import MenuToggle from './MenuToggle.svelte';
	import { clickOutside } from '$lib/actions.js';
	import DropdownMenu from '@/components/DropdownMenu.svelte';
	import { menu } from '$lib/stores';
	import type { JwtUser } from '$lib/utils/types';

	interface Props {
		user: JwtUser | null;
	}

	let { user }: Props = $props();

	const menuIsOpen = menu();

	const handleOutsideClick = menuIsOpen.close;
	const handleKeydown = ({ key }: KeyboardEvent) => {
		if (key === 'Escape') menuIsOpen.close();
	};
</script>

<nav
	class:loggedOut={!user}
	use:clickOutside={handleOutsideClick}
	transition:slide={{ duration: 500 }}
	class="text-lg"
>
	Christmas Trivia 2024
	{#if user}
		<MenuToggle {handleKeydown} {menuIsOpen} />
	{/if}
</nav>

{#if $menuIsOpen}
	<DropdownMenu isAdmin={user?.isAdmin} />
{/if}

<style>
	nav {
		height: var(--nav-height);
		background: var(--red);
		color: var(--white);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 10px;
		padding-right: 10px;
	}

	nav.loggedOut {
		justify-content: center;
	}
</style>
