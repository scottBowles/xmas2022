<script lang="ts">
	import { enhance } from '$app/forms';
	import PageMargin from '$lib/components/PageMargin.svelte';

	let { data, form } = $props();
</script>

<PageMargin>
	<div class="flex flex-col items-center mx-2">
		<form
			method="POST"
			action="?/changeUsername"
			class="flex flex-col items-center mt-8 w-96 mb-8 max-w-full"
			use:enhance
		>
			<fieldset class="flex flex-col items-center w-full">
				<legend class="text-4xl mb-3 text-green-700">Change Username</legend>
				<input
					name="username"
					type="text"
					placeholder="New Username"
					value={form?.changeUsernameUsername ?? data.username}
					required
					class="w-full m-1 p-2 text-green-700 border border-green-700 rounded"
				/>
				<input
					type="submit"
					class="w-full m-1 p-2 border rounded bg-green-700 text-white text-lg cursor-pointer hover:bg-green-800"
				/>
			</fieldset>
			{#if form?.changeUsernameError}
				<p class="text-red-700">{form.changeUsernameError}</p>
			{/if}
			{#if form?.changeUsernameSuccess}
				<p class="text-green-700">Username updated</p>
			{/if}
		</form>

		<form
			method="POST"
			action="?/changePassword"
			class="flex flex-col items-center w-96 mb-8 max-w-full"
			use:enhance
		>
			<fieldset class="flex flex-col items-center w-full">
				<legend class="text-4xl mb-3 text-green-700">Change Password</legend>
				<input
					name="oldPassword"
					type="password"
					placeholder="Old Password"
					required
					class="w-full m-1 p-2 text-green-700 border border-green-700 rounded"
				/>
				<input
					name="newPassword"
					type="password"
					placeholder="New Password"
					required
					class="w-full m-1 p-2 text-green-700 border border-green-700 rounded"
				/>
				<input
					name="newPasswordConfirm"
					type="password"
					placeholder="Confirm New Password"
					required
					class="w-full m-1 p-2 text-green-700 border border-green-700 rounded"
				/>
				<input
					type="submit"
					class="w-full m-1 p-2 border rounded bg-green-700 text-white text-lg cursor-pointer hover:bg-green-800"
				/>
			</fieldset>
			{#if form?.changePasswordError}
				<p class="text-red-700">{form.changePasswordError}</p>
			{/if}
			{#if form?.changePasswordSuccess}
				<p class="text-green-700">Password updated</p>
			{/if}
		</form>

		<form
			method="POST"
			action="?/createGroup"
			class="flex flex-col items-center w-96 mb-8 max-w-full"
			use:enhance
		>
			<fieldset class="flex flex-col items-center">
				<legend class="mb-1">
					<p class="text-4xl text-green-700 mb-3">Create a Group</p>
					<p class="text-sm text-green-700 mb-3">
						This creates a group other players can join so you can see each other's scores on your
						group scoreboard. Create a group with a name of your choice and share that name with
						others so they can join.
					</p>
				</legend>
				<input
					name="groupname"
					type="text"
					placeholder="Group Name"
					value={form?.createGroupGroupname ?? ''}
					required
					class="w-full m-1 p-2 text-green-700 border border-green-700 rounded"
				/>
				<input
					type="submit"
					value="Create Group"
					class="w-full m-1 p-2 border rounded bg-green-700 text-white text-lg cursor-pointer hover:bg-green-800"
				/>
			</fieldset>
			{#if form?.createGroupError}
				<p class="text-red-700">{form.createGroupError}</p>
			{/if}
			{#if form?.createGroupSuccess}
				<p class="text-green-700">Group created</p>
			{/if}
		</form>

		<form
			method="POST"
			action="?/joinGroup"
			class="flex flex-col items-center w-96 max-w-full"
			use:enhance
		>
			<fieldset class="flex flex-col items-center">
				<legend class="mb-1">
					<p class="text-4xl text-green-700 mb-3">Join a Group</p>
					<p class="text-sm text-green-700 mb-3">
						If someone has shared a group name with you, enter it here to join their group.
					</p>
				</legend>
				<input
					name="groupname"
					type="text"
					placeholder="Group Name"
					value={form?.joinGroupGroupname ?? ''}
					required
					class="w-full m-1 p-2 text-green-700 border border-green-700 rounded"
				/>
				<input
					type="submit"
					value="Join Group"
					class="w-full m-1 p-2 border rounded bg-green-700 text-white text-lg cursor-pointer hover:bg-green-800"
				/>
			</fieldset>
			{#if form?.joinGroupError}
				<p class="text-red-700">{form.joinGroupError}</p>
			{/if}
			{#if form?.joinGroupSuccess}
				<p class="text-green-700">Group joined</p>
			{/if}
		</form>
		<div class="h-40"></div>
	</div>
</PageMargin>
