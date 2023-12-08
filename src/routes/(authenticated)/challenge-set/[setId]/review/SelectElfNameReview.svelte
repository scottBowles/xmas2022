<script lang="ts">
	import type { PageData } from './$types';

	export let challenge: PageData['challenges'][number];

	$: ({ ownElfName, allElfNames } = challenge);
</script>

<div>
	Your elf name is <strong>{ownElfName}</strong>.
</div>

{#if allElfNames}
	<div class="mt-4">
		<h2 class="text-2xl">Here's Everyone So Far</h2>
		<p class="text-sm">Come back later to see everyone!</p>
		<table class="table-auto mt-4">
			<tbody>
				{#each allElfNames as { player, elfFirstName, elfLastName }, i (player)}
					<tr>
						<td class="pr-8">{player}</td>
						<td class:text-green-700={i % 2 === 0} class:text-christmasRed={i % 2 === 1}
							>{elfFirstName} {elfLastName}</td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
