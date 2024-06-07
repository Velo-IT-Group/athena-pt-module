'use server';
import { createClient } from '@/utils/supabase/server';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import axios, { AxiosResponse } from 'axios';
import { baseConfig } from '../utils';
import { ProductsItem } from '@/types/manage';
import { UserMetadata } from '@supabase/supabase-js';

/**
 * Updates Product In Supabase.
 * @param {string} id - The id of the product.
 * @param {ProductUpdate} product - The product you're wanting to update.
 */
export const updateProduct = async (id: string, product: ProductUpdate) => {
	const supabase = createClient();
	const { error } = await supabase.from('products').update(product).eq('unique_id', id);

	console.log(id, product, error);
	console.log('running func');

	if (error) {
		console.error(error);
		throw Error('Error updating product...', { cause: error });
	}

	revalidateTag('proposals');
	revalidateTag('products');
	revalidateTag('sections');
};

/**
 * Updates Proposal In Supabase.
 * @param {string} id - The id of the proposal you're wanting to update.
 * @param {ProposalUpdate} proposal - The proposal you're wanting to update.
 */
export const updateProposal = async (id: string, proposal: ProposalUpdate) => {
	const supabase = createClient();
	const { error } = await supabase.from('proposals').update(proposal).eq('id', id);

	if (error) {
		console.error(error);
		throw Error(error.message);
	}

	revalidateTag('proposals');
};

/**
 * Updates Ticket In Supabase.
 * @param {string} id - The id of the ticket you're wanting to update.
 * @param {TicketUpdate} ticket - The ticket you're wanting to update.
 */
export const updateTicket = async (id: string, ticket: TicketUpdate) => {
	const supabase = createClient();
	const { error } = await supabase.from('tickets').update(ticket).eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
};

/**
 * Updates Phase In Supabase.
 * @param {string} id - The id of the phase you're wanting to update.
 * @param {PhaseUpdate} phase - The phase you're wanting to update.
 */
export const updatePhase = async (id: string, phase: PhaseUpdate) => {
	const supabase = createClient();
	const { error } = await supabase.from('phases').update(phase).eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
};

/**
 * Updates Task In Supabase.
 * @param {string} id - The id of the task you're wanting to update.
 * @param {TaskUpdate} task - The task you're wanting to update.
 */
export const updateTask = async (id: string, task: TaskUpdate) => {
	const supabase = createClient();
	const { error } = await supabase.from('tasks').update(task).eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
};

/**
 * Updates Organization In Supabase.
 * @param {string} id - The id of the organization you're wanting to update.
 * @param {OrganizationUpdate} organization - The organization you're wanting to update.
 */
export const updateOrganization = async (id: string, organization: OrganizationUpdate) => {
	const supabase = createClient();
	const { error } = await supabase.from('organizations').update(organization).eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('organizations');
	revalidateTag('proposals');
};

/**
 * Updates Organization's Integration In Supabase.
 * @param {string} id - The id of the organization's integration you're wanting to update.
 * @param {OrganizationIntegrationUpdate} orgIntegration - The organization's integration you're wanting to update.
 */
export const updateOrganizationIntegration = async (id: string, orgIntegration: OrganizationIntegrationUpdate) => {
	const supabase = createClient();
	const { error } = await supabase.from('organization_integrations').update(orgIntegration).eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('organizations');
	revalidateTag('proposals');
};

export const updateHomeSortCookie = (sort: keyof Proposal) => {
	const cookieStore = cookies();
	cookieStore.set('homeSort', sort);
	revalidateTag('proposals');
};

export const updateMyProposalsCookie = (ids: string[]) => {
	const cookieStore = cookies();

	if (ids.length) {
		cookieStore.set('myProposals', JSON.stringify(ids));
	} else {
		cookieStore.delete('myProposals');
	}
	revalidateTag('proposals');
};

type Operation = 'replace';

export type ManageProductUpdate = {
	id: number;
	values: PatchOperation[];
};

type PatchOperation = {
	op: Operation;
	path: string;
	value: string | number;
};

export const updateManageProduct = async (product: ManageProductUpdate): Promise<ProductsItem | undefined> => {
	let data = JSON.stringify(product.values);

	let config = {
		...baseConfig,
		method: 'PATCH',
		url: `/procurement/products/${product.id}`,
		headers: {
			...baseConfig.headers,
			'Content-Type': 'application/json',
		},
		data: data,
	};

	console.log(config);

	try {
		const product: AxiosResponse<ProductsItem, Error> = await axios.request(config);

		console.log('SUCCESFULLY UPDATED MANAGE PRODUCT', product.data);

		return product.data;
	} catch (error) {
		console.error(error);
	}
};

export const updateSection = async (section: SectionUpdate) => {
	const supabase = createClient();
	const { error } = await supabase.from('sections').update(section).eq('id', section.id!);

	console.log('SECTION ID', section.id);

	if (error) {
		throw Error('Error updating section...', { cause: error });
	}

	revalidateTag('sections');
	revalidateTag('proposals');
};

export const updateVersion = async (version: VersionUpdate) => {
	const supabase = createClient();
	const { error } = await supabase.from('versions').update(version).eq('id', version.id!);

	console.log('SECTION ID', version.id);

	if (error) {
		throw Error('Error updating version...', { cause: error });
	}

	revalidateTag('versions');
};

export const updateUserMetadata = async (data: FormData, user_metadata: UserMetadata) => {
	const supabase = createClient();

	const { error } = await supabase.auth.updateUser({
		data: {
			...user_metadata,
			first_name: data.get('first_name') as string,
			last_name: data.get('last_name') as string,
		},
	});

	if (error) throw Error('Error updating profile', { cause: error.message });
};
