'use server';
import {
	createPhase,
	createProposal,
	createSection,
	createTask,
	createTicket,
	deletePhase,
	deleteProposal,
	deleteSection,
	deleteTicket,
	newTemplate,
	updatePhase,
	updateProposal,
	updateTicket,
} from '@/lib/data';
import { ProjectTemplate } from '@/types/manage';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export const handlePhaseUpdate = async (formData: FormData) => {
	const id = formData.get('id') as string;
	const description = formData.get('description') as string;

	await updatePhase(id, { description });

	revalidateTag('phases');
	revalidateTag('proposals');
};

export const handleTicketUpdate = async (formData: FormData) => {
	const id = formData.get('id') as string;
	const summary = formData.get('summary') as string;
	const budget_hours = formData.get('budget_hours') as unknown as number;

	// @ts-ignore
	await updateTicket(id, { summary, budget_hours });

	revalidateTag('phases');
	revalidateTag('proposals');
};

export const handleTicketInsert = async (formData: FormData) => {
	const summary = formData.get('summary') as string;
	const budget_hours = formData.get('budget_hours') as unknown as number;
	const order = formData.get('order') as unknown as number;
	const phase = formData.get('phase') as string;

	await createTicket({ summary, order: order ?? 0, budget_hours: budget_hours ?? 0, phase }, []);

	revalidateTag('tickets');
	revalidateTag('phases');
	revalidateTag('proposals');
};

export const handleTaskInsert = async (formData: FormData) => {
	const summary = formData.get('summary') as string;
	const notes = formData.get('notes') as string;
	const priority = formData.get('priority') as unknown as number;
	const ticket = formData.get('ticket') as string;

	await createTask({ summary, notes, priority, ticket });

	revalidateTag('tickets');
	revalidateTag('phases');
	revalidateTag('proposals');
};

export const handlePhaseInsert = async (formData: FormData) => {
	const description = formData.get('description') as string;
	const order = formData.get('order') as unknown as number;

	await createPhase({ description, order }, []);

	revalidateTag('proposals');
	revalidateTag('phases');
};

export const handleProposalDelete = async (id: string) => {
	'use server';
	await deleteProposal(id);

	revalidateTag('proposals');
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
};

export const handleProposalUpdate = async (formData: FormData) => {
	const id = formData.get('id') as string;
	const sales_hours = formData.get('sales_hours') as unknown as number;
	const management_hours = formData.get('management_hours') as unknown as number;
	const labor_rate = formData.get('labor_rate') as unknown as number;
	const service_ticket = formData.get('service_ticket') as unknown as number;
	console.log(id, sales_hours, management_hours, labor_rate, service_ticket);
	await updateProposal(id, { sales_hours, management_hours, labor_rate, service_ticket });

	revalidateTag('proposals');
};

export const handleProposalInsert = async (formData: FormData) => {
	const name = formData.get('name') as string;
	const templates_used = formData.getAll('templates_used') as unknown as number[];

	console.log(templates_used);

	const proposal = await createProposal({ name, templates_used: templates_used });

	if (!!!proposal) {
		return redirect(`/proposal/new?message=Couldnt create proposal`);
	}

	// if (templates_used) {
	// 	await Promise.all(templates_used.map((template) => newTemplate(template, proposal.id)));
	// }

	revalidateTag('proposals');

	redirect(`/proposal/${proposal.id}`);
};

export const handleSectionInsert = async (formData: FormData) => {
	const name = formData.get('name') as string;
	const proposal = formData.get('proposal') as string;
	const order = formData.get('order') as unknown as number;

	await createSection({ name, proposal, order });

	revalidateTag('proposals');
};

export const handleNewTemplateInsert = async (proposalId: string, template: ProjectTemplate) => {
	const section = await newTemplate(proposalId, template);

	if (!!!section) {
		return;
	}

	revalidateTag('proposals');
	revalidateTag('phases');
};
