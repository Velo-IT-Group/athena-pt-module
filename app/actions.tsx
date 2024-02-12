'use server';
import { createPhase, createTicket, updatePhase, updateProposal, updateTicket } from '@/lib/data';
import { revalidateTag } from 'next/cache';

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

export const handlePhaseInsert = async (formData: FormData) => {
	const description = formData.get('description') as string;
	const order = formData.get('order') as unknown as number;
	const proposal = formData.get('proposal') as string;

	await createPhase({ description, order, proposal }, []);

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
