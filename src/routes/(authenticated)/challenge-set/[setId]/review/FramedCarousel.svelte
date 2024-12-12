<script lang="ts">
	import Img from '../challenge/[challengeId]/framed/Img.svelte';

	interface Props {
		images: { publicId: string; alt: string | null }[];
	}

	let { images }: Props = $props();

	let currentImageIndex = $state(0);
	let currentImage = $derived(images[currentImageIndex]);

	const toNextImage = () => {
		if (currentImageIndex < images.length - 1) {
			currentImageIndex += 1;
		}
	};

	const toPreviousImage = () => {
		if (currentImageIndex > 0) {
			currentImageIndex -= 1;
		}
	};
</script>

{#if images.length === 0}
	<p class="my-2 text-christmasRed">No images found.</p>
{:else}
	<div>
		<div class="flex justify-between items-center">
			<button
				type="button"
				onclick={toPreviousImage}
				disabled={currentImageIndex === 0}
				class="bg-green-700 text-white font-bold py-3 px-6 rounded text-lg"
			>
				Previous
			</button>

			<Img
				publicId={currentImage.publicId}
				alt={currentImage.alt ?? `Image ${currentImageIndex + 1} of ${images.length}`}
			/>

			<button
				type="button"
				onclick={toNextImage}
				disabled={currentImageIndex === images.length - 1}
				class="bg-green-700 text-white font-bold py-3 px-6 rounded text-lg"
			>
				Next
			</button>
		</div>
	</div>
{/if}
