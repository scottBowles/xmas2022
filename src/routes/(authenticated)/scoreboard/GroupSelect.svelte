<script lang="ts">
	import { urls } from '$lib/utils';
	import { isEmpty } from 'ramda';

	export let onGroupChange: (e: Event) => void;
	export let groupNames: string[];
	export let group: string;
</script>

{#if isEmpty(groupNames)}
	<div class="flex justify-center items-center mt-2">
		<h3 class="text-green-700 italic">
			Join or create a group <a
				href={urls.settings()}
				class="text-christmasRed hover:underline"
				data-sveltekit-preload-data="hover">here</a
			> to share a scoreboard with your friends!
		</h3>
	</div>
{:else}
	<div class="flex justify-evenly h-10 mt-2">
		<select class="text-lg text-green-800" on:change={onGroupChange}>
			{#each groupNames as groupName}
				<option value={groupName} selected={groupName === group}>
					{groupName}
				</option>
			{/each}
		</select>
	</div>
{/if}
