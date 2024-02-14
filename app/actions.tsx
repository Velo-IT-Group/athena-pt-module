'use server';
import {
	createPhase,
	createProposal,
	createTask,
	createTicket,
	deletePhase,
	deleteProposal,
	deleteTicket,
	newTemplate,
	updatePhase,
	updateProposal,
	updateTicket,
} from '@/lib/data';
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
	const order = formData.get('order') as unknown as number;
	const phase = formData.get('phase') as string;

	await updateTicket(id, { summary, order, budget_hours, phase });

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
	const proposal = formData.get('proposal') as string;

	await createPhase({ description, order, proposal }, []);

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

export const handleProposalUpdate = async (formData: FormData) => {
	const id = formData.get('id') as string;
	const salesLabor = formData.get('sales-labor') as unknown as number;
	const projectManagement = formData.get('project-management') as unknown as number;
	await updateProposal(id, { sales_hours: salesLabor, management_hours: projectManagement });

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

	if (templates_used) {
		await Promise.all(templates_used.map((template) => newTemplate(template, proposal.id)));
	}

	revalidateTag('proposals');

	redirect(`/proposal/${proposal.id}`);
};

export const handleNewTemplateInsert = async (draggableId: string, proposalId: string, startingIndex?: number) => {
	const phases = await newTemplate(parseInt(draggableId), proposalId, startingIndex ?? 0);

	if (!!!phases) {
		return;
	}

	revalidateTag('proposals');
	revalidateTag('phases');
};
