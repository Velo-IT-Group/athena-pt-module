'use server';
import { ProjectPhase, ProjectTemplate, ProjectTemplateTask, ProjectTemplateTicket } from '@/types/manage';
import { PostgrestError } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { revalidateTag } from 'next/cache';

export const newTemplate = async (proposal: string, template: ProjectTemplate, order?: number): Promise<Array<Phase> | undefined> => {
	const section = await createSection({ name: template.name, proposal });

	if (!section) return;

	const phases = await Promise.all(
		template?.workplan?.phases.map((phase: ProjectPhase, index: number) =>
			createPhase(
				{
					order: index,
					section: section.id,
					description: phase.description,
				},
				phase.tickets
			)
		) ?? []
	);

	revalidateTag('proposals');

	return phases as Array<Phase>;
};

export const createTask = async (task: TaskInsert): Promise<Array<Task> | PostgrestError> => {
	const supabase = createClient();
	const { data, error } = await supabase.from('tasks').insert(task).select();

	revalidateTag('proposals');

	return data ?? error;
};

export const createSection = async (section: SectionInsert): Promise<Section | undefined> => {
	const supabase = createClient();
	const { data, error } = await supabase.from('sections').insert(section).select().single();

	if (!data || error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');

	return data;
};

export const createTasks = async (tasks: Array<TaskInsert>): Promise<Array<Task> | PostgrestError> => {
	const supabase = createClient();
	const { data, error } = await supabase.from('tasks').insert(tasks).select();

	revalidateTag('proposals');

	return data ?? error;
};

export const createProposal = async (proposal: ProposalInsert): Promise<Proposal | undefined> => {
	const supabase = createClient();
	const { data, error } = await supabase.from('proposals').insert(proposal).select('*').single();

	if (!data || error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');

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

	revalidateTag('proposals');

	return data;
};

export const createTicket = async (ticket: TicketInset, tasks: Array<ProjectTemplateTask>): Promise<Ticket | undefined> => {
	const supabase = createClient();

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

	revalidateTag('sections');
	revalidateTag('proposals');

	return data;
};
