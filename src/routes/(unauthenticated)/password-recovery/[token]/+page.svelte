<script lang="ts">
	let { form } = $props();
</script>

<form method="POST">
	<input type="password" name="password" placeholder="New password" required />
	<input type="password" name="password_confirmation" placeholder="Confirm new password" required />
	<button type="submit">Reset password</button>
	{#if form.error}
		<p>{form.error}</p>
	{/if}
</form>
