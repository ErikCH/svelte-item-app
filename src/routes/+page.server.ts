import type { ServerLoadEvent } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { Amplify, withSSRContext, APIClass } from 'aws-amplify';
import awsExports from '../aws-exports';
import { listTodos } from '../graphql/queries';
import type {
	CreateTodoInput,
	CreateTodoMutation,
	DeleteTodoInput,
	DeleteTodoMutation,
	ListTodosQuery
} from '../API';
import type { GraphQLQuery } from '@aws-amplify/api';

import { createTodo, deleteTodo } from '../graphql/mutations';

Amplify.configure({ ...awsExports, ssr: true });

export async function load(event: ServerLoadEvent) {
	const { API }: { API: APIClass } = withSSRContext({ req: event.request });
	const { data } = await API.graphql<GraphQLQuery<ListTodosQuery>>({ query: listTodos });
	if (!data?.listTodos?.items) return { bob: { info: [] } };

	return {
		bob: {
			info: data.listTodos.items
		}
	};
}

export const actions = {
	create: async ({ request }: ServerLoadEvent) => {
		const { API }: { API: APIClass } = withSSRContext({ req: request });
		const data = await request.formData();
		const description = data.get('description')?.toString();
		const name = data.get('name')?.toString();
		if (!name) return fail(400, { name, missing: true });
		if (!description) return fail(400, { description, missing: true });
		const todoDetails: CreateTodoInput = {
			name,
			description
		};
		await API.graphql<GraphQLQuery<CreateTodoMutation>>({
			query: createTodo,
			variables: { input: todoDetails }
		});

		return { success: true };
	},
	delete: async ({ request }: ServerLoadEvent) => {
		const { API }: { API: APIClass } = withSSRContext({ req: request });
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { name, missing: true });
		const deleteDetails: DeleteTodoInput = {
			id
		};
		await API.graphql<GraphQLQuery<DeleteTodoMutation>>({
			query: deleteTodo,
			variables: { input: deleteDetails }
		});
		return { success: true };
	}
};
