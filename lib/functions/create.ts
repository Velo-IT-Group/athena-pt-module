'use server';
import { ProjectPhase, ProjectTemplate, ProjectTemplateTask, ProjectTemplateTicket } from '@/types/manage';
import { PostgrestError } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTemplate } from './read';

export const newTemplate = async (proposal: string, template: ProjectTemplate, order: number) => {
	await Promise.all(
		template?.workplan?.phases.map((phase: ProjectPhase, index: number) =>
			createPhase(
				{
					order: order + index + 1,
					proposal,
					description: phase.description,
				},
				phase.tickets
			)
		) ?? []
	);

	revalidateTag('proposals');
};

export const createTask = async (task: TaskInsert) => {
	const supabase = createClient();
	const { error } = await supabase.from('tasks').insert(task);
	console.log('CREATE TASK FUNCTION', task);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
};

export const createTasks = async (tasks: Array<TaskInsert>): Promise<Array<Task> | PostgrestError> => {
	'use server';
	const supabase = createClient();
	const { data, error } = await supabase.from('tasks').insert(tasks).select();

	revalidateTag('proposals');

	return data ?? error;
};

export const createProposal = async (proposal: ProposalInsert) => {
	const supabase = createClient();
	const { data, error } = await supabase.from('proposals').insert(proposal).select('id, organization(slug)').single();

	if (!data || error) {
		console.error(error);
		return;
	}

	if (proposal.templates_used && proposal.templates_used.length) {
		const templates = await Promise.all(proposal.templates_used.map((template) => getTemplate(template)));
		console.log('TEMPLATES', templates);
		if (templates && templates.length) {
			await Promise.all(templates.map((template) => newTemplate(data.id, template!, 0)));
		}
	}

	revalidateTag('proposals');

	// @ts-ignore
	redirect(`/${data.organization.slug}/proposal/${data.id}`);
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

export const createProduct = async (product: ProductInsert) => {
	const supabase = createClient();

	const { error } = await supabase.from('products').insert(product);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('products');
	revalidateTag('proposals');
};

export const createProducts = async (product: ProductInsert[]) => {
	const supabase = createClient();

	const { error } = await supabase.from('products').insert(product);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('products');
	revalidateTag('proposals');
};

export const createOrganizationIntegration = async (organization: OrganizationIntegration) => {
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

export const signUp = async (formData: FormData) => {
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
		},
	});

	if (error) {
		return redirect('/login?message=Could not authenticate user');
	}

	return redirect('/login?message=Check email to continue sign in process');
};
