'use server';
import {
	CatalogComponent,
	CatalogItem,
	Opportunity,
	ProductClass,
	ProductsItem,
	Project,
	ProjectPhase,
	ProjectTemplate,
	ProjectTemplateTask,
	ProjectTemplateTicket,
	ServiceTicket,
} from '@/types/manage';
import { createClient } from '@/utils/supabase/server';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { baseConfig, baseHeaders } from '@/lib/utils';
import { getTemplate } from './read';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { updateProposal } from './update';
import { wait } from '@/utils/helpers';

/**
 * Creates Phases, Tickets and Tasks In Supabase.
 * @param {string} proposal - The id of the proposal to add the template to.
 * @param {ProjectTemplate} template - The CW Manage object that will be used to create the phases, tickets and tasks.
 * @param {number} order - The index of the item the first template phase will be added after.
 */
export const newTemplate = async (template: ProjectTemplate, order: number, version: string) => {
	await Promise.all(
		template?.workplan?.phases.map((phase: ProjectPhase, index: number) =>
			createPhase(
				{
					order: order + index + 1,
					description: phase.description,
					version,
				},
				phase.tickets
			)
		) ?? []
	);

	revalidateTag('proposals');
};

/**
 * Creates Ticket in Supabase.
 * @param {TaskInsert} task - The object that will be used to create the task.
 */
export const createTask = async (task: TaskInsert) => {
	const supabase = createClient();
	const { error } = await supabase.from('tasks').insert(task);
	console.log('CREATE TASK FUNCTION', task);

	if (error) {
		throw Error('Error creating task.', { cause: error });
	}

	revalidateTag('proposals');
};

/**
 * Creates Tasks in Supabase.
 * @param {TaskInsert[]} tasks - The object that will be used to create the task.
 */
export const createTasks = async (tasks: TaskInsert[]) => {
	'use server';
	const supabase = createClient();
	const { error } = await supabase.from('tasks').insert(tasks);

	if (error) {
		throw Error('Error creating tasks.', { cause: error });
	}

	revalidateTag('proposals');
};

/**
 * Creates Tasks in Supabase.
 * @param {ProposalInsert} proposal - The object that will be used to create the task.
 */
export const createProposal = async (proposal: ProposalInsert) => {
	const supabase = createClient();

	const { data, error } = await supabase
		.from('proposals')
		.insert(proposal)
		.select('id, organization(slug)')
		.returns<{ id: string; organization: { slug: string } }[]>()
		.single();

	if (!data || error) {
		console.error(error);
		return;
	}

	const version = await createVersion(data.id);
	await createSection({ name: 'Hardware', version });
	await createSection({ name: 'Services', version });

	if (proposal.templates_used && proposal.templates_used.length) {
		const templates = await Promise.all(proposal.templates_used.map((template) => getTemplate(template)));

		if (templates && templates.length) {
			await Promise.all(templates.map((template) => newTemplate(template!, 0, version)));
		}
	}

	revalidateTag('proposals');

	redirect(`/${data.organization.slug}/proposal/${data.id}/${version}`);
};

export const createPhase = async (phase: PhaseInsert, tickets: Array<ProjectTemplateTicket>) => {
	'use server';
	const supabase = createClient();
	const { data, error } = await supabase.from('phases').insert(phase).select().single();

	if (!data || error) {
		console.error(error);
		return;
	}

	if (tickets.length) {
		await Promise.all(
			tickets.map((ticket: ProjectTemplateTicket) => {
				console.log(ticket);
				return createTicket(
					{ phase: data.id, summary: ticket.summary, budget_hours: ticket.budgetHours, order: parseInt(ticket.wbsCode!) },
					ticket.tasks ?? []
				);
			})
		);
	}

	revalidateTag('proposals');
	revalidateTag('phases');
};

export const createComment = async (comment: CommentInsert) => {
	const supabase = createClient();
	const { error } = await supabase.from('comments').insert(comment);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
};

export const createTicket = async (ticket: TicketInset, tasks: Array<ProjectTemplateTask>): Promise<Ticket | undefined> => {
	'use server';
	const supabase = createClient();

	console.log(ticket);
	const { data, error } = await supabase.from('tickets').insert(ticket).select().single();

	if (!data || error) {
		console.error('ticket creation error', error);
		return;
	}

	let mappedTasks: Array<TaskInsert> = tasks.map(({ summary, notes, priority }) => {
		let taskInsert = { summary: summary!, notes: notes!, priority: priority!, ticket: data.id };
		return taskInsert;
	});

	if (mappedTasks.length) {
		await createTasks(mappedTasks);
	}

	revalidateTag('proposals');

	return data;
};

export const createProduct = async (product: ProductInsert, bundledItems?: ProductInsert[]) => {
	const supabase = createClient();

	const { data, error } = await supabase.from('products').insert(product).select('unique_id').single();

	if (error) {
		console.error(error);
		return;
	}

	if (bundledItems && bundledItems.length) {
		await createProducts(
			bundledItems.map((item) => {
				return { ...item, parent: data.unique_id };
			})
		);
	}

	revalidateTag('products');
	revalidateTag('proposals');
	revalidateTag('sections');

	return data;
};

export const createProducts = async (product: ProductInsert[], bundledItems?: CatalogComponent[]) => {
	const supabase = createClient();

	const { error } = await supabase.from('products').insert(product);

	if (error) {
		console.error(error);
		throw Error(`Error creating products`, { cause: error });
	}

	revalidateTag('products');
	revalidateTag('proposals');
	revalidateTag('sections');
};

export const createOrganizationIntegration = async (organization: OrganizationIntegrationInsert) => {
	'use server';
	const supabase = createClient();
	const { error } = await supabase.from('organization_integrations').insert(organization);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('organizations');
	revalidateTag('proposals');
};

interface MetaData {
	first_name: string;
	last_name: string;
	manage_reference_id: number;
}

export const signUp = async (formData: FormData, data?: MetaData) => {
	'use server';

	const origin = headers().get('origin');
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const supabase = createClient();

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${origin}/auth/callback`,
			data,
		},
	});

	if (error) {
		throw Error(error.message, { cause: error.cause });
	}

	// return redirect('/login?message=Check email to continue sign in process');
};

export const createOpportunity = async (proposal: NestedProposal, ticket: ServiceTicket): Promise<Opportunity | undefined> => {
	// if (proposal.opportunity_id && proposal.products) {
	// 	await Promise.all(proposal?.products?.map((p) => createManageProduct(proposal.opportunity_id!, { id: p.id, productClass: p.product_class! }, p)));
	// }

	const data = JSON.stringify({
		name: proposal.name,
		type: {
			id: 5,
		},
		primarySalesRep: {
			// @ts-ignore
			id: proposal.created_by?.manage_reference_id,
		},
		company: {
			// id: ticket.company?.id,
			id: 19297,
		},
		contact: {
			id: ticket.contact?.id,
		},
		stage: {
			id: 6,
		},
		// status: {
		// 	id: 2,
		// },
	});

	console.log(data);

	const config: AxiosRequestConfig = {
		...baseConfig,
		url: '/sales/opportunities',
		method: 'post',
		headers: {
			...baseConfig.headers,
			'Content-Type': 'application/json',
		},
		data,
	};
	//
	// console.log(config.headers);
	// console.log(proposal, proposal.created_by, proposal.products);

	const response: AxiosResponse<Opportunity, Error> = await axios.request(config);

	await updateProposal(proposal.id, { opportunity_id: response.data.id });

	// if (proposal.products) {
	// 	await Promise.all(
	// 		proposal.products.map((p) => createManageProduct(response.data.id, { id: p.catalog_item!, productClass: p.product_class! as ProductClass }, p))
	// 	);
	// }

	return response.data;
};

export const createManageProduct = async (
	opportunityId: number,
	catalogItem: CatalogItem,
	product: NestedProduct
): Promise<ProductsItem | undefined> => {
	const isBundle = catalogItem.productClass === 'Bundle';

	const data = JSON.stringify({
		catalogItem: {
			id: product.id,
		},
		price: isBundle ? null : product.price,
		cost: isBundle ? null : product.cost,
		quantity: product.quantity,
		billableOption: 'Billable',
		// ...product.overrides,
		opportunity: {
			id: opportunityId,
		},
	});

	console.log(data);

	const config: AxiosRequestConfig = {
		...baseConfig,
		url: '/procurement/products',
		method: 'post',
		headers: {
			...baseConfig.headers,
			'Content-Type': 'application/json',
		},
		data,
	};

	try {
		const response: AxiosResponse<ProductsItem, Error> = await axios.request(config);

		console.log('CREATING PRODUCT', 'created succesfully');

		return response.data;
	} catch (error) {
		console.error('ERROR CREATING PRODUCT', error);
		return;
	}
};

interface ProjectCreate {
	// name: string;
	board: { id: number };
	// status: { id: number };
	// company: { id: number };
	estimatedStart: string;
	estimatedEnd: string;
}

export const createSection = async (section: SectionInsert) => {
	const supabase = createClient();
	const { error } = await supabase.from('sections').insert(section);

	if (error) {
		console.error(error);
		throw Error('Error creating section...', { cause: error.message });
	}

	revalidateTag('sections');
	revalidateTag('proposals');
};

export const createProject = async (project: ProjectCreate, proposalId: string, opportunityId: number): Promise<Project | undefined> => {
	const supabase = createClient();
	let config: RequestInit = {
		method: 'POST',
		headers: baseHeaders,
		body: JSON.stringify({
			...project,
			includeAllNotesFlag: true,
			includeAllDocumentsFlag: true,
			includeAllProductsFlag: true,
		}),
	};

	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/sales/opportunities/${opportunityId}/convertToProject`, config);

	if (response.status !== 201) throw Error('Error creating project', { cause: JSON.stringify(response, null, 2) });

	const data = await response.json();

	console.log(data);

	await supabase.from('proposals').update({ project_id: data.id }).eq('id', proposalId);

	return data;
};

export const createProjectPhase = async (projectId: number, phase: NestedPhase): Promise<ProjectPhase | undefined> => {
	const supabase = createClient();
	let config: RequestInit = {
		method: 'POST',
		headers: baseHeaders,
		body: JSON.stringify({
			projectId,
			description: phase.description,
			wbsCode: String(phase.order),
		} as ProjectPhase),
	};

	console.log('TASK BODY', config.body);

	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/project/projects/${projectId}/phases`, config);

	if (response.status !== 201) {
		try {
			console.log('waiting');
			await wait(1000);
			console.log('done waiting');

			setTimeout(async () => {
				const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/project/projects/${projectId}/phases`, config);

				console.log('PHASE BODY', config.body);

				if (response.status !== 201) throw Error(response.statusText);

				const data = await response.json();

				await supabase.from('phases').update({ reference_id: data.id }).eq('id', phase.id);

				if (phase.tickets) {
					await Promise.all(phase.tickets?.sort((a, b) => a.order - b.order)?.map((ticket) => createProjectTicket(data.id, ticket)));
				}

				console.log('Phase', phase.description, data.id);

				return data;
			});
		} catch (error) {
			console.error(error);
			throw Error('Error', { cause: error });
		}
	}

	const data = await response.json();

	await supabase.from('phases').update({ reference_id: data.id }).eq('id', phase.id);

	if (phase.tickets) {
		await Promise.all(phase.tickets?.sort((a, b) => a.order - b.order)?.map((ticket) => createProjectTicket(data.id, ticket)));
	}

	console.log('Phase', phase.description, data.id);

	return data;
};

interface ProjectTicketInsert {
	summary: string;
	budgetHours: number;
	phase: {
		id: number;
	};
}

export const createProjectTicket = async (phaseId: number, ticket: NestedTicket): Promise<ProjectTemplateTicket | undefined> => {
	const supabase = createClient();
	const { summary, budget_hours: budgetHours } = ticket;

	let config: RequestInit = {
		method: 'POST',
		headers: baseHeaders,
		body: JSON.stringify({
			summary,
			budgetHours,
			phase: {
				id: phaseId,
			},
		} as ProjectTicketInsert),
	};

	console.log('TICKET BODY', config.body);

	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/project/tickets`, config);

	if (response.status !== 201) {
		try {
			setTimeout(async () => {
				const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/project/tickets`, config);

				console.log('TICKET BODY', config.body);

				if (response.status !== 201) throw Error(response.statusText);

				const data = await response.json();

				await supabase.from('tickets').update({ reference_id: data.id }).eq('id', ticket.id);

				if (ticket.tasks && ticket.tasks.length) {
					await Promise.all(ticket.tasks?.sort((a, b) => a.priority - b.priority)?.map((task) => createProjectTask(data.id, task)));
				}

				console.log('Ticket', summary, data.id);

				return data;
			}, 1000);
		} catch (error) {
			console.error(error);
			throw Error('Error', { cause: error });
		}
	}

	const data = await response.json();

	await supabase.from('tickets').update({ reference_id: data.id }).eq('id', ticket.id);

	if (ticket.tasks && ticket.tasks.length) {
		await Promise.all(ticket.tasks?.sort((a, b) => a.priority - b.priority)?.map((task) => createProjectTask(data.id, task)));
	}

	console.log('Ticket', summary, data.id);

	return data;
};

interface ProjectTaskInsert {
	// ticketId: number;
	notes?: string;
	// summary: string;
	priority: number;
}

export const createProjectTask = async (ticketId: number, task: Task): Promise<ProjectTemplateTask | undefined> => {
	const supabase = createClient();
	const { summary, notes, priority } = task;
	const body = JSON.stringify({
		notes: summary,
		priority,
	} as ProjectTaskInsert);

	let config: RequestInit = {
		method: 'POST',
		headers: baseHeaders,
		body,
	};

	console.log('NON ERROR TASK BODY', config.body);

	const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/project/tickets/${ticketId}/tasks`, config);

	if (response.status !== 201) {
		try {
			setTimeout(async () => {
				const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/project/tickets/${ticketId}/tasks`, config);

				console.log('TASK BODY', config.body);

				if (response.status !== 201) throw Error(response.statusText);

				const data = await response.json();

				await supabase.from('tasks').update({ reference_id: data.id }).eq('id', task.id);

				console.log('TASK', summary, data.id);

				return data;
			}, 2000);
		} catch (error) {
			console.error(error);
			throw Error('Error', { cause: error });
		}
	}

	const data = await response.json();

	await supabase.from('tasks').update({ reference_id: data.id }).eq('id', task.id);

	console.log('TASK', summary, data.id);

	return data;
};

export const convertOpportunityToProject = async (opportunity: Opportunity, projectId: number) => {
	let data = JSON.stringify({ projectId, includeAllProductsFlag: true });

	let config = {
		...baseConfig,
		method: 'patch',
		url: `/sales/opportunities/${opportunity.id}/convertToProject`,
		headers: {
			...baseConfig.headers,
			'Content-Type': 'application/json',
		},
		data,
	};
};

export const createVersion = async (proposal: string) => {
	const supabase = createClient();

	const { data, error } = await supabase.from('versions').insert({ proposal }).select('id').single();

	if (error || !data) throw Error("Can't create version...", { cause: error });

	await updateProposal(proposal, { working_version: data.id });

	revalidateTag('versions');

	return data.id;
};
