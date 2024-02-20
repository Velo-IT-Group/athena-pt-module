import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CatalogItem, ProjectPhase, ProjectTemplate, ProjectTemplateTask, ProjectTemplateTicket, ProjectWorkPlan } from '@/types/manage';
import { PostgrestError, QueryData } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { unstable_cache } from 'next/cache';

export const baseConfig: AxiosRequestConfig = {
	method: 'get',
	baseURL: process.env.NEXT_PUBLIC_CW_URL!,
	headers: {
		clientId: process.env.NEXT_PUBLIC_CW_CLIENT_ID!,
	},
	auth: {
		username: process.env.NEXT_PUBLIC_CW_USERNAME!,
		password: process.env.NEXT_PUBLIC_CW_PASSWORD!,
	},
};

// CREATE FUNCTIONS

export const newTemplate = async (proposal: string, template: ProjectTemplate, templateID?: string): Promise<Array<Phase> | undefined> => {
	const section = await createSection({ name: template.name, proposal });

	if (!section) return;

	try {
		const phases = await Promise.all(
			template.workplan?.phases.map((phase: ProjectPhase, index: number) =>
				createPhase(
					{
						order: index,
						section: section.id,
						description: phase.description,
					},
					phase.tickets
				)
			)
		);
		return phases as Array<Phase>;
	} catch (error) {
		console.log(error);
	}
};

export const createTask = async (task: TaskInsert): Promise<Array<Task> | PostgrestError> => {
	const supabase = createClient();
	const { data, error } = await supabase.from('tasks').insert(task).select();

	return data ?? error;
};

export const createSection = async (section: SectionInsert): Promise<Section | undefined> => {
	const supabase = createClient();
	const { data, error } = await supabase.from('sections').insert(section).select().single();

	if (!data || error) {
		console.error(error);
		return;
	}

	return data;
};

export const createTasks = async (tasks: Array<TaskInsert>): Promise<Array<Task> | PostgrestError> => {
	const supabase = createClient();
	const { data, error } = await supabase.from('tasks').insert(tasks).select();

	return data ?? error;
};

export const createProposal = async (proposal: ProposalInsert): Promise<Proposal | undefined> => {
	const supabase = createClient();
	const { data, error } = await supabase.from('proposals').insert(proposal).select('*').single();

	if (!data || error) return;

	return data;
};

export const createPhase = async (phase: PhaseInsert, tickets: Array<ProjectTemplateTicket>): Promise<Phase | undefined> => {
	const supabase = createClient();
	const { data, error } = await supabase.from('phases').insert(phase).select().single();

	if (!data || error) {
		console.error(error);
		return;
	}

	await Promise.all(
		tickets.map((ticket: ProjectTemplateTicket) =>
			createTicket(
				{ phase: data.id, summary: ticket.summary, budget_hours: ticket.budgetHours, order: parseInt(ticket.wbsCode!) },
				ticket.tasks ?? []
			)
		)
	);

	console.log(data);

	return data;
};

export const createTicket = async (ticket: TicketInset, tasks: Array<ProjectTemplateTask>): Promise<Ticket | undefined> => {
	const supabase = createClient();

	try {
		const { data, error } = await supabase.from('tickets').insert(ticket).select().single();

		if (!data || error) {
			console.error('ticket creation error', error);
			return;
		}

		let mappedTasks: Array<TaskInsert> = tasks.map(({ summary, notes, priority }) => {
			let taskInsert = { summary: summary!, notes: notes!, priority: priority!, ticket: data.id };
			return taskInsert;
		});

		await createTasks(mappedTasks);

		return data;
	} catch (error) {
		console.error(error);
	}
};

// READ FUNCTIONS

export const getPhases = unstable_cache(
	async (id: string): Promise<Array<Phase & { tickets: Array<Ticket & { tasks: Task[] }> }> | undefined> => {
		const supabase = createClient();
		const { data, error } = await supabase.from('phases').select('*, tickets(*, tasks(*))').eq('section', id).order('order');

		if (!data || error) {
			console.error(error);
			return;
		}

		return data;
	},
	['phases'],
	{ tags: ['phases'] }
);

export const getWorkplan = async (id: number): Promise<ProjectWorkPlan | undefined> => {
	const url = `/project/projectTemplates/${id}/workplan`;
	let config: AxiosRequestConfig = {
		...baseConfig,
		url,
		params: {
			fields: 'phases/tickets/id,phases/tickets/summary',
		},
	};

	const response: AxiosResponse<ProjectWorkPlan, Error> = await axios.request(config);
	return response.data;
};

export const getTicket = async (id: number): Promise<ProjectTemplateTicket | undefined> => {
	var myHeaders = new Headers();
	myHeaders.append('clientId', '9762e3fa-abbd-4179-895e-ca7b0e015ab2');
	myHeaders.append('Authorization', 'Basic dmVsbytYMzJMQjRYeDVHVzVNRk56Olhjd3Jmd0dwQ09EaFNwdkQ=');

	var requestOptions: RequestInit = {
		method: 'GET',
		headers: myHeaders,
		next: {
			tags: ['tickets'],
		},
	};

	const response = await fetch(`https://manage.velomethod.com/v4_6_release/apis/3.0/service/tickets/${id}`, requestOptions);

	return await response.json();
};

export const getTickets = async (): Promise<ProjectTemplateTicket[] | undefined> => {
	var myHeaders = new Headers();
	myHeaders.append('clientId', '9762e3fa-abbd-4179-895e-ca7b0e015ab2');
	myHeaders.append('Authorization', 'Basic dmVsbytYMzJMQjRYeDVHVzVNRk56Olhjd3Jmd0dwQ09EaFNwdkQ=');
	var requestOptions: RequestInit = {
		method: 'GET',
		headers: myHeaders,
		next: {
			tags: ['tickets'],
			revalidate: 60,
		},
	};

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/api/tickets`, requestOptions);
		return await response.json();
	} catch (error) {
		console.error(error);
	}
};

export const getProducts = async (): Promise<Array<CatalogItem> | undefined> => {
	var myHeaders = new Headers();
	myHeaders.append('clientId', '9762e3fa-abbd-4179-895e-ca7b0e015ab2');
	myHeaders.append('Authorization', 'Basic dmVsbytYMzJMQjRYeDVHVzVNRk56Olhjd3Jmd0dwQ09EaFNwdkQ=');

	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
	};

	const response = await fetch(
		'https://manage.velomethod.com/v4_6_release/apis/3.0/procurement/catalog?conditions=inactiveFlag = false&fields=id,identifier,description,price,cost',
		requestOptions
	);

	return await response.json();

	// let config: AxiosRequestConfig = {
	// 	...baseConfig,
	// 	url: '/procurement/catalog',
	// 	params: {
	// 		conditions: 'inactiveFlag = false',
	// 		pageSize: 1000,
	// 		orderBy: 'description',
	// 		fields: 'id,identifier,description,price,cost',
	// 	},
	// };

	// try {
	// 	const response: AxiosResponse<Array<CatalogItem>, Error> = await axios.request(config);
	// 	return response.data;
	// } catch (error) {
	// 	console.error(error);
	// 	return;
	// }
};

export const getProposal = unstable_cache(
	async (id: string) => {
		const supabase = createClient();

		const proposalWithSectionsQuery = supabase
			.from('proposals')
			.select('*, sections(*, phases(*, tickets(*, tasks(*))))')
			.eq('id', id)
			.order('order', { referencedTable: 'sections', ascending: true })
			.single();

		type ProposalWithSections = QueryData<typeof proposalWithSectionsQuery>;

		const { data: proposal, error } = await proposalWithSectionsQuery;

		if (!proposal || error) {
			console.error('ERROR IN GET PROPOSAL QUERY', error);
			return;
		}

		// console.log(proposal);

		return proposal as ProposalWithSections;
	},
	['proposals'],
	{
		tags: ['proposals'],
	}
);

export const getProposals = unstable_cache(
	async () => {
		const supabase = createClient();

		const proposalsQuery = supabase
			.from('proposals')
			.select('*, sections(*, phases(*, tickets(*, tasks(*))))')
			.order('updated_at', { ascending: false });

		type Proposals = QueryData<typeof proposalsQuery>;

		const { data: proposals, error } = await proposalsQuery;

		if (!proposals || error) {
			console.error(error);
			return;
		}

		console.log(proposals);

		return proposals as Proposals;
	},
	['proposals'],
	{
		tags: ['proposals'],
	}
);

export const getTemplates = async (): Promise<Array<ProjectTemplate> | undefined> => {
	var requestOptions: RequestInit = {
		method: 'GET',
		next: {
			tags: ['templates'],
		},
	};

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/api/templates`, requestOptions);
		return await response.json();
	} catch (error) {
		console.error(error);
	}
};

export const getTemplate = async (id: number): Promise<ProjectTemplate | undefined> => {
	var requestOptions: RequestInit = {
		method: 'GET',
		next: {
			tags: ['templates'],
		},
	};

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/api/templates/${id}`, requestOptions);
		return await response.json();
	} catch (error) {
		console.error(error);
	}
};

// UPDATE FUNCTIONS

export const updateProposal = async (id: string, proposal: ProposalUpdate) => {
	const supabase = createClient();
	const { error } = await supabase.from('proposals').update(proposal).eq('id', id);

	if (error) {
		console.error(error);
		return;
	}
};

export const updateTicket = async (id: string, ticket: TicketUpdate) => {
	const supabase = createClient();
	const { error } = await supabase.from('tickets').update(ticket).eq('id', id);

	if (error) {
		console.error(error);
		return;
	}
};

export const updatePhase = async (id: string, phase: PhaseUpdate) => {
	const supabase = createClient();
	const { error } = await supabase.from('phases').update(phase).eq('id', id);

	if (error) {
		console.error(error);
		return;
	}
};

export const updateTask = async (id: string, task: TaskUpdate) => {
	const supabase = createClient();
	const { error } = await supabase.from('tasks').update(task).eq('id', id);

	if (error) {
		console.error(error);
		return;
	}
};

// DELETE FUNCTIONS

export const deleteProposal = async (id: string) => {
	const supabase = createClient();
	const { error } = await supabase.from('proposals').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}
};

export const deleteTicket = async (id: string) => {
	const supabase = createClient();
	const { error } = await supabase.from('tickets').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}
};

export const deletePhase = async (id: string) => {
	const supabase = createClient();
	const { error } = await supabase.from('phases').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}
};

export const deleteTask = async (id: string) => {
	const supabase = createClient();
	const { error } = await supabase.from('tasks').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}
};

export const deleteSection = async (id: string) => {
	const supabase = createClient();
	const { error } = await supabase.from('sections').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}
};
