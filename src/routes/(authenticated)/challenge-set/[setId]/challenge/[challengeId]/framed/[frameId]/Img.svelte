<script lang="ts">
	import { CldImage } from 'svelte-cloudinary';

	interface Props {
		publicId: string;
		alt: string;
	}

	let { publicId, alt }: Props = $props();

	let isImageLoaded = $state(false);

	const handleImageLoaded = () => {
		isImageLoaded = true;
	};
</script>

<div class="h-[350px] mb-3 relative">
	<CldImage
		class="absolute inset-0 w-full h-full object-cover filter transition-opacity duration-500"
		src={publicId}
		objectFit="none"
		blur="500"
		quality="auto:low"
		{alt}
		width="0"
		height="350"
	/>
	<CldImage
		class={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
			isImageLoaded ? 'opacity-100' : 'opacity-0'
		}`}
		src={publicId}
		objectFit="none"
		{alt}
		width="0"
		height="350"
		onload={handleImageLoaded}
	/>
</div>
