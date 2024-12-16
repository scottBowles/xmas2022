<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<form method="POST" class="flex flex-col items-center mt-8" use:enhance>
	<fieldset class="flex flex-col items-center">
		<input
			class="w-64 m-1 p-2 text-green-700 border border-green-700 rounded"
			type="password"
			name="password"
			placeholder="New password"
			required
		/>
		<input
			class="w-64 m-1 p-2 text-green-700 border border-green-700 rounded"
			type="password"
			name="password_confirmation"
			placeholder="Confirm new password"
			required
		/>
	</fieldset>
	<button type="submit">Reset password</button>
</form>
