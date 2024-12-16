<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<form method="POST" class="flex flex-col items-center mt-8" use:enhance>
	<fieldset class="flex flex-col items-center">
		<legend class="text-4xl mb-1 text-green-700">Reset Password</legend>
		<input
			type="password"
			name="password"
			placeholder="New password"
			required
			class="w-64 m-1 p-2 text-green-700 border border-green-700 rounded"
		/>
		<input
			type="password"
			name="password_confirmation"
			placeholder="Confirm new password"
			required
			class="w-64 m-1 p-2 text-green-700 border border-green-700 rounded"
		/>
	</fieldset>
	<input
		type="submit"
		value="Reset password"
		class="w-64 m-1 p-2 border rounded bg-green-700 text-white text-lg cursor-pointer hover:bg-green-800"
	/>
</form>
