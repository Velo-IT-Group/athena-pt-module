import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ProjectPhase, ProjectTemplate, ProjectTemplateTask, ProjectTemplateTicket, ProjectWorkPlan } from '@/types/manage';
import { PostgrestError } from '@supabase/supabase-js';
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

export const newTemplate = async (id: number, proposal: string, startingIndex?: number): Promise<Array<Phase> | undefined> => {
	const result = await fetch(`http://localhost:3000/api/templates/${id}/workplan`);
	const workplan: ProjectWorkPlan = await result.json();

	if (!workplan) return;

	workplan.phases.forEach((phase, index) =>
		console.log(index, startingIndex, index + (startingIndex ?? 0), {
			order: index + (startingIndex ?? 0),
			proposal,
			description: phase.description,
		})
	);

	try {
		const phases = await Promise.all(
			workplan?.phases.map((phase: ProjectPhase, index: number) =>
				createPhase(
					{
						order: index + (startingIndex ?? 0),
						proposal,
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
	const { data, error } = await supabase.from('tickets').insert(ticket).select().single();

	if (!data || error) {
		console.error(error);
		return;
	}

	let mappedTasks: Array<TaskInsert> = tasks.map(({ summary, notes, priority }) => {
		let taskInsert = { summary: summary!, notes: notes!, priority: priority!, ticket: data.id };
		return taskInsert;
	});

	await createTasks(mappedTasks);

	return data;
};

// READ FUNCTIONS

export const getPhases = unstable_cache(
	async (id: string): Promise<Array<Phase & { tickets: Array<Ticket> }> | undefined> => {
		const supabase = createClient();
		const { data, error } = await supabase.from('phases').select('*, tickets(*)').eq('proposal', id).order('order');

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

export const getProposal = unstable_cache(
	async (id: string): Promise<(Proposal & { phases: Array<Phase & { tickets: Array<Ticket> }> }) | undefined> => {
		const supabase = createClient();

		const proposalWithPhasesQuery = supabase
			.from('proposals')
			.select('*, phases(*, tickets(*))')
			.eq('id', id)
			.order('order', { referencedTable: 'phases', ascending: true })
			.single();

		const { data: proposal, error } = await proposalWithPhasesQuery;

		if (!proposal || error) {
			console.error(error);
			return;
		}

		return proposal;
	},
	['proposals'],
	{
		tags: ['proposals'],
	}
);

export const getProposals = unstable_cache(
	async (): Promise<Array<Proposal>> => {
		const supabase = createClient();

		const { data: proposal, error } = await supabase
			.from('proposals')
			.select('*, phases(*, tickets(*))')
			.order('order', { referencedTable: 'phases', ascending: true });

		return proposal ?? [];
	},
	['proposals'],
	{
		tags: ['proposals'],
	}
);

export const getTemplates = unstable_cache(
	async (): Promise<Array<ProjectTemplate> | undefined> => {
		let config: AxiosRequestConfig = {
			...baseConfig,
			url: '/project/projectTemplates',
			params: {
				fields: 'id,name,description',
				pageSize: 1000,
				orderBy: 'name',
			},
		};

		try {
			const response: AxiosResponse<Array<ProjectTemplate>, Error> = await axios.request(config);
			return response.data;
		} catch (error) {
			console.log(error);
			// return error;
		}
	},
	['templates'],
	{
		tags: ['templates'],
	}
);

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
