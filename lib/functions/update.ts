'use server';
import { createClient } from '@/utils/supabase/server';
import { revalidateTag } from 'next/cache';

export const updateProduct = async (id: string, product: ProductUpdate) => {
	'use server';
	const supabase = createClient();
	const { error } = await supabase.from('products').update(product).eq('id', id);
	console.log('running func');
	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
	revalidateTag('products');
};

export const updateProposal = async (id: string, proposal: ProposalUpdate) => {
	'use server';
	const supabase = createClient();
	const { error } = await supabase.from('proposals').update(proposal).eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
};

export const updateTicket = async (id: string, ticket: TicketUpdate) => {
	'use server';
	const supabase = createClient();
	const { error } = await supabase.from('tickets').update(ticket).eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
};

export const updatePhase = async (id: string, phase: PhaseUpdate) => {
	'use server';
	const supabase = createClient();
	const { error } = await supabase.from('phases').update(phase).eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
};

export const updateTask = async (id: string, task: TaskUpdate) => {
	'use server';
	const supabase = createClient();
	const { error } = await supabase.from('tasks').update(task).eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
};

export const updateOrganization = async (id: string, organization: OrganizationUpdate) => {
	'use server';
	const supabase = createClient();
	const { error } = await supabase.from('organizations').update(organization).eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('organizations');
	revalidateTag('proposals');
};

export const updateOrganizationIntegration = async (id: string, organization: OrganizationIntegration) => {
	'use server';
	const supabase = createClient();
	const { error } = await supabase.from('organization_integrations').update(organization).eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('organizations');
	revalidateTag('proposals');
};
