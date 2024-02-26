'use server';
import { deletePhase, deleteProposal, deleteSection, deleteTicket } from '@/lib/functions/delete';
import { updateProposal, updateSection } from '@/lib/functions/update';
import { getTemplate } from '@/lib/functions/read';
import { newTemplate } from '@/lib/functions/create';
import { createPhase, createSection, createTask, createTicket } from '@/lib/functions/create';
import { ProjectTemplate } from '@/types/manage';
import { createClient } from '@/utils/supabase/server';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export const handleTicketInsert = async (formData: FormData) => {
	'use server';
	const summary = formData.get('summary') as string;
	const budget_hours = formData.get('budget_hours') as unknown as number;
	const order = formData.get('order') as unknown as number;
	const phase = formData.get('phase') as string;

	console.log(summary, budget_hours, order, phase);

	await createTicket({ summary: summary ?? 'New Ticket', order: order ?? 0, budget_hours: budget_hours ?? 0, phase }, []);

	revalidateTag('tickets');
	revalidateTag('phases');
	revalidateTag('proposals');
};

export const handleTaskInsert = async (formData: FormData) => {
	'use server';
	const summary = formData.get('summary') as string;
	const notes = formData.get('notes') as string;
	const priority = formData.get('priority') as unknown as number;
	const ticket = formData.get('ticket') as string;

	await createTask({ summary, notes, priority, ticket });

	revalidateTag('tickets');
	revalidateTag('phases');
	revalidateTag('proposals');
};

export async function deliverSection(section: Section) {
	'use server';
	await new Promise((res) => setTimeout(res, 1000));

	return section;
}

export const handlePhaseInsert = async (formData: FormData) => {
	'use server';
	// const supabase = createClient();

	const description = formData.get('description') as string;
	const order = formData.get('order') as unknown as number;
	const section = formData.get('section') as string;

	console.log(description, order, section);

	await createPhase({ description: description ?? 'New Phase', order: order ?? 0, section }, []);

	revalidateTag('sections');
	revalidateTag('proposals');
	revalidateTag('phases');
	// return phase;
};

export const handleProposalDelete = async (id: string) => {
	'use server';
	await deleteProposal(id);

	revalidateTag('proposals');
};

export const handleProductDelete = async (id: string) => {
	'use server';
	const supabase = createClient();
	const { error } = await supabase.from('products').delete().eq('id', id);
	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('products');
	revalidateTag('proposals');
	redirect('/velo-it-group');
};

export const handleTicketDelete = async (id: string) => {
	'use server';
	await deleteTicket(id);

	revalidateTag('proposals');
	revalidateTag('phases');
};

export const handlePhaseDelete = async (id: string) => {
	'use server';
	await deletePhase(id);

	revalidateTag('proposals');
	revalidateTag('phases');
};

export const handleSectionDelete = async (id: string) => {
	'use server';
	await deleteSection(id);

	revalidateTag('proposals');
	revalidateTag('sections');
};

export const handleProposalUpdate = async (formData: FormData) => {
	const id = formData.get('id') as string;
	const name = formData.get('name') as string;
	const sales_hours = formData.get('sales_hours') as unknown as number;
	const management_hours = formData.get('management_hours') as unknown as number;
	const labor_rate = formData.get('labor_rate') as unknown as number;
	const service_ticket = formData.get('service_ticket') as unknown as number;
	console.log(id, name, sales_hours, management_hours, labor_rate, service_ticket);
	await updateProposal(id, { name, sales_hours, management_hours, labor_rate, service_ticket });

	revalidateTag('proposals');
};

export const handleSectionNameUpdate = async (id: string, name: string) => {
	await updateSection(id, { name });

	revalidateTag('sections');
	revalidateTag('proposals');
};

export const handleProposalInsert = async (formData: FormData) => {
	'use server';
	const supabase = createClient();
	const name = formData.get('name') as string;
	const templates_used = formData.getAll('templates_used') as unknown as number[];
	const service_ticket = formData.get('service_ticket') as unknown as number;

	console.log(name, templates_used, service_ticket);

	const { data: proposal, error } = await supabase.from('proposals').insert({ name, templates_used, service_ticket }).select().single();

	if (!proposal || error) {
		console.error(error);
		return;
	}

	// const proposal = await createProposal({ name, templates_used: templates_used });

	if (!!!proposal) {
		return redirect(`/proposal/new?message=Couldnt create proposal`);
	}

	console.log(proposal);

	if (templates_used && templates_used.length) {
		const templates = await Promise.all(templates_used.map((template) => getTemplate(template)));
		console.log('TEMPLATES', templates);
		if (templates && templates.length) {
			await Promise.all(templates.map((template) => newTemplate(proposal.id, template!)));
		}
	}

	revalidateTag('proposals');

	redirect(`/proposal/${proposal.id}`);
};

export const handleSectionInsert = async (formData: FormData) => {
	const name = formData.get('name') as string;
	const proposal = formData.get('proposal') as string;
	const order = formData.get('order') as unknown as number;

	console.log(name, proposal, order);

	await createSection({ name: name ?? 'New Section', proposal, order: order ?? 0 });

	revalidateTag('sections');
	revalidateTag('proposals');
};

export const handleNewTemplateInsert = async (proposalId: string, template: ProjectTemplate, order: number) => {
	const section = await newTemplate(proposalId, template, order);

	if (!!!section) {
		return;
	}

	revalidateTag('proposals');
	revalidateTag('phases');
};

export const handleSignOut = async () => {
	'use server';
	const supabase = createClient();
	console.log('handling signout');
	await supabase.auth.signOut();
	redirect('/login');
};
