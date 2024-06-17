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
import { cookies } from 'next/headers';

/**
 * Creates Phases, Tickets and Tasks In Supabase.
 * @param {string} proposal - The id of the proposal to add the template to.
 * @param {ProjectTemplate} template - The CW Manage object that will be used to create the phases, tickets and tasks.
 * @param {number} order - The index of the item the first template phase will be added after.
 */
export const newTemplate = async (template: ProjectTemplate, order: number, version: string) => {
	try {
		if (!template || !template.workplan || !template.workplan.phases) {
			throw new Error('Invalid template structure.');
		}

		const createPhasePromises = template.workplan.phases.map((phase: ProjectPhase, index: number) =>
			createPhase(
				{
					order: order + index + 1,
					description: phase.description,
					version,
				},
				phase.tickets
			).catch((error) => {
				console.error(`Error creating phase ${index + 1}:`, error);
				// Optionally, handle individual errors, e.g., log them, store them, etc.
				return null; // Ensure the Promise.all does not reject due to this failure
			})
		);

		// Await all phase creation promises
		await Promise.all(createPhasePromises);

		// Revalidate proposals tag
		revalidateTag('proposals');
	} catch (error) {
		console.error('Error in newTemplate function:', error);
		throw new Error(`Failed to create new template: ${error}`);
	}
};

/**
 * Creates Ticket in Supabase.
 * @param {TaskInsert} task - The object that will be used to create the task.
 */
export const createTask = async (task: TaskInsert) => {
	try {
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);
		const { error } = await supabase.from('tasks').insert(task);
		console.log('CREATE TASK FUNCTION', task);

		if (error) {
			throw new Error('Error creating task.', { cause: error });
		}

		revalidateTag('proposals');
	} catch (error) {
		console.error('createTask Error:', error);
		throw error; // Rethrow the error after logging it
	}
};

/**
 * Creates Tasks in Supabase.
 * @param {TaskInsert[]} tasks - The object that will be used to create the task.
 */
export const createTasks = async (tasks: TaskInsert[]) => {
	'use server';
	try {
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);
		const { error } = await supabase.from('tasks').insert(tasks);

		if (error) {
			throw new Error('Error creating tasks.', { cause: error });
		}

		revalidateTag('proposals');
	} catch (error) {
		console.error('createTasks Error:', error);
		throw error; // Rethrow the error
	}
};

/**
 * Creates Proposal in Supabase.
 * @param {ProposalInsert} proposal - The object that will be used to create the task.
 */
export const createProposal = async (proposal: ProposalInsert) => {
	try {
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);

		const { data, error } = await supabase
			.from('proposals')
			.insert(proposal)
			.select('id, organization(slug)')
			.returns<{ id: string; organization: { slug: string } }[]>()
			.single();

		if (error || !data) {
			throw new Error('Error creating proposal.', { cause: error });
		}

		const version = await createVersion(data.id);
		await createSection({ name: 'Hardware', version, order: 0 });

		if (proposal.templates_used && proposal.templates_used.length) {
			const templates = await Promise.all(proposal.templates_used.map(getTemplate));

			if (templates && templates.length) {
				await Promise.all(templates.map((template) => newTemplate(template!, 0, version)));
			}
		}

		revalidateTag('proposals');
		redirect(`/${data.organization.slug}/proposal/${data.id}/${version}`);
	} catch (error) {
		console.error('createProposal Error:', error);
		throw error; // Rethrow the error after logging it
	}
};

export const duplicateProposal = async (proposal: ProposalInsert) => {
	try {
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);
		delete proposal['updated_at'];

		const { data: returnedProposal, error } = await supabase
			.from('proposals')
			.insert({ ...proposal, name: `${proposal.name} - Copy`, working_version: null, id: undefined })
			.select('id')
			.returns<Array<{ id: string }>>()
			.single();

		if (error || !returnedProposal) {
			throw new Error('Error duplicating proposal.', { cause: error });
		}

		const version = await createVersion(returnedProposal.id);

		console.log(version, proposal?.working_version);

		await supabase.rpc('copy_version_data', {
			old_version: proposal.id ?? '',
			new_version: version,
		});

		revalidateTag('proposals');
		redirect(`/velo-it-group/proposal/${returnedProposal.id}/${version}`);
	} catch (error) {
		console.error('duplicateProposal Error:', error);
		throw error; // Rethrow the error after logging it
	}
};

export const createPhase = async (phase: PhaseInsert, tickets: Array<ProjectTemplateTicket>) => {
	try {
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);
		const { data, error } = await supabase.from('phases').insert(phase).select().single();

		if (error || !data) {
			throw new Error('Error creating phase.', { cause: error });
		}

		if (tickets.length) {
			await Promise.all(
				tickets.map((ticket: ProjectTemplateTicket) => {
					console.log(ticket);
					return createTicket(
						{
							phase: data.id,
							summary: ticket.summary,
							budget_hours: ticket.budgetHours,
							order: parseInt(ticket.wbsCode!),
						},
						ticket.tasks ?? []
					).catch((err) => {
						console.error(`Error creating ticket for phase ${data.id}:`, err);
					});
				})
			);
		}

		revalidateTag('proposals');
		revalidateTag('phases');
	} catch (error) {
		console.error('createPhase Error:', error);
		throw error; // Rethrow the error after logging it
	}
};

export const createTicket = async (
	ticket: TicketInsert,
	tasks: Array<ProjectTemplateTask>
): Promise<Ticket | undefined> => {
	try {
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);

		console.log(ticket);
		const { data, error } = await supabase.from('tickets').insert(ticket).select().single();

		if (error || !data) {
			throw new Error('Error creating ticket.', { cause: error });
		}

		let mappedTasks: Array<TaskInsert> = tasks.map(({ summary, notes, priority }) => ({
			summary: summary!,
			notes: notes!,
			priority: priority!,
			ticket: data.id,
		}));

		if (mappedTasks.length) {
			await createTasks(mappedTasks);
		}

		revalidateTag('proposals');
		return data;
	} catch (error) {
		console.error('createTicket Error:', error);
		throw error; // Rethrow the error after logging it
	}
};

export const createProduct = async (product: ProductInsert, bundledItems?: ProductInsert[]) => {
	try {
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);

		const { data, error } = await supabase.from('products').insert(product).select('unique_id').single();

		if (error || !data) {
			throw new Error('Error creating product.', { cause: error });
		}

		if (bundledItems && bundledItems.length) {
			await createProducts(
				bundledItems.map((item) => ({
					...item,
					parent: data.unique_id,
				}))
			);
		}

		revalidateTag('products');
		revalidateTag('proposals');
		revalidateTag('sections');
		return data;
	} catch (error) {
		console.error('createProduct Error:', error);
		throw error; // Rethrow the error after logging it
	}
};

export const createProducts = async (products: ProductInsert[], bundledItems?: CatalogComponent[]) => {
	try {
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);

		const { error } = await supabase.from('products').insert(products);

		if (error) {
			throw new Error('Error creating products.', { cause: error });
		}

		revalidateTag('products');
		revalidateTag('proposals');
		revalidateTag('sections');
	} catch (error) {
		console.error('createProducts Error:', error);
		throw error; // Rethrow the error after logging it
	}
};

export const createOrganizationIntegration = async (organization: OrganizationIntegrationInsert) => {
	try {
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);
		const { error } = await supabase.from('organization_integrations').insert(organization);

		if (error) {
			throw new Error('Error creating organization integration.', { cause: error });
		}

		revalidateTag('organizations');
		revalidateTag('proposals');
	} catch (error) {
		console.error('createOrganizationIntegration Error:', error);
		throw error; // Rethrow the error after logging it
	}
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
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

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

export const createOpportunity = async (
	proposal: NestedProposal,
	ticket: ServiceTicket
): Promise<Opportunity | undefined> => {
	try {
		const data = JSON.stringify({
			name: `NICK'S TESTING - ${proposal.name}`,
			type: {
				id: 5,
			},
			site: { id: 1002 },
			primarySalesRep: {
				// @ts-ignore
				id: proposal.created_by?.manage_reference_id,
			},
			company: {
				// id: ticket.company?.id,
				id: 19297,
			},
			contact: {
				id: 17804,
				// id: ticket.contact?.id,
			},
			stage: {
				id: 6,
			},
			// status: {
			// 	id: 2,
			// },
		});

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

		const response: AxiosResponse<Opportunity, Error> = await axios.request(config);

		console.log(response.statusText);

		// await updateProposal(proposal.id, { opportunity_id: response.data.id });

		// if (proposal.products) {
		// 	await Promise.all(
		// 		proposal.products.map((p) => createManageProduct(response.data.id, { id: p.catalog_item!, productClass: p.product_class! as ProductClass }, p))
		// 	);
		// }

		return response.data;
	} catch (error) {
		console.error('Error creating opportunity:', error);
		throw new Error('Failed to create opportunity.'); // Rethrow the error with a clear message
	}
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

		console.log('CREATING PRODUCT', 'created successfully');

		return response.data;
	} catch (error) {
		console.error('Error creating product:', error);
		throw new Error('Failed to create product.'); // Rethrow the error with a clear message
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
	try {
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);
		const { error } = await supabase.from('sections').insert(section);

		if (error) {
			throw new Error('Error creating section', { cause: error.message });
		}

		revalidateTag('sections');
		revalidateTag('proposals');
	} catch (error) {
		console.error('createSection Error:', error);
		throw error; // Rethrow the error after logging it
	}
};

export const createProject = async (
	project: ProjectCreate,
	proposalId: string,
	opportunityId: number
): Promise<Project | undefined> => {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
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

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_CW_URL}/sales/opportunities/${opportunityId}/convertToProject`,
			config
		);

		if (response.status !== 201) {
			throw new Error(`Error creating project: ${response.statusText}`, { cause: await response.json() });
		}

		const data = await response.json();

		// await supabase.from('proposals').update({ project_id: data.id }).eq('id', proposalId);

		return data;
	} catch (error) {
		console.error('createProject Error:', error);
		await wait(5000);

		try {
			await createProject(project, proposalId, opportunityId);
		} catch (error) {
			throw error; // Rethrow the error after logging it
		}
	}
};

export const createProjectPhase = async (projectId: number, phase: NestedPhase): Promise<ProjectPhase | undefined> => {
	let config: RequestInit = {
		method: 'POST',
		headers: baseHeaders,
		body: JSON.stringify({
			projectId,
			description: phase.description,
			wbsCode: String(phase.order),
		} as ProjectPhase),
	};

	console.log('NON ERROR PHASE BODY', config.body);

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/project/projects/${projectId}/phases`, config);

		if (!response.ok) throw new Error(`Error creating phase: ${response.statusText}`);

		const data = await response.json();

		if (phase.tickets) {
			const results = await Promise.allSettled(
				phase.tickets?.sort((a, b) => a.order - b.order)?.map((ticket) => createProjectTicket(data.id, ticket))
			);

			const errors = results.filter((r) => r.status === 'rejected');
			console.error(`Failed Creation Of Tickets: ${errors}`);
		}

		return data;
	} catch (error) {
		console.error('createProjectPhase Error:', error);
	}
};

interface ProjectTicketInsert {
	summary: string;
	budgetHours: number;
	phase: {
		id: number;
	};
}

export const createProjectTicket = async (
	phaseId: number,
	ticket: NestedTicket
): Promise<ProjectTemplateTicket | undefined> => {
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

	try {
		let response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/project/tickets`, config);

		if (!response.ok) throw new Error(`Error creating project ticket: ${response.statusText}`);

		const data = await response.json();

		if (ticket.tasks && ticket.tasks.length) {
			const results = await Promise.allSettled(
				ticket.tasks?.sort((a, b) => a.priority - b.priority)?.map((task) => createProjectTask(data.id, task))
			);

			const errors = results.filter((r) => r.status === 'rejected');
			console.error(`Failed Creation Of Tasks: ${errors}`);
		}

		return data;
	} catch (error) {
		console.error('createProjectTicket Error:', error);
	}
};

interface ProjectTaskInsert {
	// ticketId: number;
	notes?: string;
	// summary: string;
	priority: number;
}

export const createProjectTask = async (ticketId: number, task: Task): Promise<ProjectTemplateTask | undefined> => {
	const { summary, notes, priority } = task;
	const body = JSON.stringify({
		notes,
		priority,
	} as ProjectTaskInsert);

	let config: RequestInit = {
		method: 'POST',
		headers: baseHeaders,
		body,
	};

	console.log('NON ERROR TASK BODY', config.body);

	try {
		let response = await fetch(`${process.env.NEXT_PUBLIC_CW_URL}/project/tickets/${ticketId}/tasks`, config);

		if (!response.ok) throw new Error(`Error creating task: ${response.statusText}`);

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		// throw new Error('Error creating project task', { cause: error });
	}
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

	try {
		// Assuming you're using axios for requests
		await axios.request(config);
	} catch (error) {
		console.error('convertOpportunityToProject Error:', error);
		throw new Error('Error converting opportunity to project', { cause: error });
	}
};

export const createVersion = async (proposal: string): Promise<string> => {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

	try {
		const { data, error } = await supabase.from('versions').insert({ proposal }).select('id').single();

		if (error || !data) {
			throw new Error("Can't create version");
		}

		await updateProposal(proposal, { working_version: data.id });

		revalidateTag('versions');

		return data.id;
	} catch (error) {
		console.error('createVersion Error:', error);
		throw new Error('Error creating version', { cause: error });
	}
};

async function createPhaseWithTicketsAndTasks(projectId: number, phase: NestedPhase): Promise<void> {
	try {
		// Create phase
		const createdPhase = await createProjectPhase(projectId, phase);

		if (!createdPhase) return;

		// Create tickets and tasks for the phase
		if (!phase.tickets) return;

		await Promise.all(
			phase.tickets.map(async (ticket) => {
				try {
					const createdTicket = await createProjectTicket(createdPhase.id, ticket);

					if (!createdTicket) return;

					if (!ticket.tasks) return;
					// Create tasks for the ticket
					await Promise.all(
						ticket.tasks.map(async (task) => {
							try {
								await createProjectTask(createdTicket.id, task);
							} catch (error) {
								console.error(`Error creating task for ticket ${createdTicket.id}:`, error);
								// Handle task creation error
							}
						})
					);
				} catch (error) {
					console.error(`Error creating ticket for phase ${createdPhase.id}:`, error);
					// Handle ticket creation error
				}
			})
		);
	} catch (error) {
		console.error(`Error creating phase:`, error);
		// Handle phase creation error
	}
}

// Call the function for each phase
export async function createPhasesWithTicketsAndTasks(projectId: number, phases: NestedPhase[]): Promise<void> {
	try {
		await Promise.all(
			phases.map(async (phase) => {
				try {
					await createPhaseWithTicketsAndTasks(projectId, phase);
				} catch (error) {
					console.error(`Error processing phase ${phase.id}:`, error);
					// Handle phase processing error
				}
			})
		);
	} catch (error) {
		console.error('Error creating phases:', error);
		// Handle overall phases creation error
	}
}
