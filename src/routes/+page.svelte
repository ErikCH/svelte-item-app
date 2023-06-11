<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
	export let form;
	let name: string = '';
	let description: string = '';

	$: filter = data.bob.info.sort((a, b) => (a?.createdAt! < b?.createdAt! ? -1 : 0));
</script>

<h1 class="text-6xl text-orange-700 m-auto w-full text-center my-10">Todo App</h1>
<div class="flex flex-col gap-4 w-1/3 m-auto">
	<form method="POST" action="?/create" class="flex flex-col gap-4 shadow border p-4" use:enhance>
		<div class="flex flex-col">
			<label for="name">Task</label>
			<input
				class="border border-gray rounded bg-gray-50 p-2"
				name="name"
				type="text"
				value={name}
				id="name"
			/>
		</div>
		<div class="flex flex-col">
			<label for="description">Description:</label>
			<input
				class="border border-gray rounded bg-gray-50 p-2"
				type="text"
				name="description"
				value={description}
				id="description"
			/>
		</div>
		<button class="bg-blue-800 rounded p-4 text-white border border-black w-32 m-auto"
			>Submit it</button
		>
		{#if form?.missing}<p class="error">All fields are required!</p>{/if}
	</form>
	<div class="flex flex-col w-full items-center">
		<div class="text-4xl my-4">Todos</div>
		{#each filter as post}
			<form method="POST" action="?/delete" class="w-full flex flex-col items-center" use:enhance>
				<ul
					class="flex flex-col items-center max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 mb-4 w-full"
				>
					<li class="flex flex-col items-center mb-4">
						<div class="font-bold">Task:</div>
						{post?.name}
					</li>
					<li class="flex flex-col items-center mb-4">
						<div class="font-bold">Description:</div>
						{post?.description}
					</li>
					<input type="hidden" value={post?.id} name="id" />
					<button
						class="bg-blue-400 w-32 text-white p-4 border border-black rounded hover:bg-blue-100"
						>Delete</button
					>
				</ul>
			</form>
		{/each}
	</div>
</div>
