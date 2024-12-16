<script lang="ts">
	let { form } = $props();
</script>

<p class="text-christmasRed">Please don't do anything here if you aren't supposed to be here.</p>

<form method="POST">
	<label for="json" class="text-lg mt-3 mb-1">JSON</label>
	<textarea name="json" id="json" class="w-full m-1 p-2 border rounded cursor-pointer"></textarea>

	<input
		type="submit"
		class="w-full m-1
    p-2 border rounded bg-green-700 text-white text-lg cursor-pointer hover:bg-green-800"
	/>
</form>

{#if form?.error}
	<p class="text-lg mt-3 mb-1">Error</p>
	<p>{form.error}</p>
{/if}
{#if form?.success}
	<p class="text-lg mt-3 mb-1">Success</p>
	<p>{form.success}</p>
	<p>{JSON.stringify(form.challenge)}</p>
{/if}
