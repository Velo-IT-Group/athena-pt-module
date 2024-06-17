'use server';

import {
	createManageProduct,
	createOpportunity,
	createPhase,
	createPhasesWithTicketsAndTasks,
	createProject,
	createProjectPhase,
} from '@/lib/functions/create';
import { getOpportunityProducts } from '@/lib/functions/read';
import { ManageProductUpdate } from '@/lib/functions/update';
import { updateManageProduct, updateManageProject } from '@/utils/manage/update';
import { ProductClass, ProjectPhase, ServiceTicket } from '@/types/manage';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

const defaultServiceProduct: NestedProduct = {
	id: 15,
	product_class: 'Service',
	price: 0,
	cost: 0,
	additional_overrides: {},
	version: '',
	calculated_cost: null,
	calculated_price: null,
	catalog_item: 15,
	category: null,
	created_at: null,
	description: null,
	extended_cost: null,
	extended_price: null,
	identifier: null,
	manufacturer_part_number: null,
	order: 0,
	parent: null,
	parent_catalog_item: null,
	quantity: 0,
	recurring_bill_cycle: null,
	recurring_cost: null,
	recurring_cycle_type: null,
	recurring_flag: null,
	section: null,
	sequence_number: null,
	taxable_flag: null,
	type: null,
	unique_id: 'null',
	unit_of_measure: null,
	vendor: null,
};

/**
 * Multi Step Process of creating a project inside of Manage
 * @param {string} id - The id of the product.
 * @param {ProductUpdate} product - The product you're wanting to update.
 */
export const convertToManageProject = async (
	proposal: NestedProposal,
	ticket: ServiceTicket,
	phases: NestedPhase[]
) => {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

	const products = proposal.working_version.products?.sort((a, b) => {
		// First, compare by created_at in descending order
		if (Number(a!.created_at) > Number(b!.created_at)) return -1;
		if (Number(a!.created_at) < Number(b!.created_at)) return 1;
		return 0;
	});

	if (!products || products.length === 0) throw new Error('No products provided...');

	// Create opportunity
	const opportunity = await createOpportunity(proposal, ticket);

	if (!opportunity) throw new Error(`Couldn't create opportunity: ${opportunity}`);

	await createManageProduct(
		opportunity.id,
		{ id: 15, productClass: 'Service' },
		{
			...defaultServiceProduct,
			price: proposal.labor_rate,
			quantity: phases.reduce((acc, current) => acc + current.hours, 0),
		}
	);

	await Promise.all(
		products.map(async (p) => {
			try {
				await createManageProduct(opportunity.id, { id: p.id!, productClass: p.product_class! as ProductClass }, p);
			} catch (error) {
				console.error('Error creating manage product:', error);
				throw error; // Rethrow the error to propagate it upwards
			}
		})
	);

	const { error } = await supabase.from('proposals').update({ opportunity_id: opportunity.id }).eq('id', proposal.id);

	if (error) throw new Error(`Error updating proposal: ${error.message}`);

	// Get all products from opportunity
	const opportunityProducts = await getOpportunityProducts(opportunity.id);
	if (!opportunityProducts) throw new Error('No products returned...');

	const flattendProducts = products.flatMap((product: NestedProduct) => product.products ?? []);

	// Filter bundled products to update the sub items prices
	const bundledProducts = opportunityProducts.filter((product) =>
		flattendProducts.some((p) => p && p.id === product.catalogItem.id)
	);

	const bundledChanges = bundledProducts
		.map((b) => {
			const product = flattendProducts.find((p) => p!.id === b.catalogItem.id);
			if (!product) return null;

			return {
				id: b!.id,
				values: [
					{ op: 'replace', path: '/price', value: product!.price },
					{ op: 'replace', path: '/cost', value: product!.cost },
				],
			} as ManageProductUpdate;
		})
		.filter(Boolean); // Filter out any null values

	await Promise.all(
		bundledChanges.map(async (product) => {
			try {
				await updateManageProduct(product!);
			} catch (error) {
				console.error('Error updating manage product:', error);
				throw error; // Rethrow the error to propagate it upwards
			}
		})
	);

	const project = await createProject(
		{
			board: { id: 51 },
			estimatedStart: new Date().toISOString().split('.')[0] + 'Z',
			estimatedEnd: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('.')[0] + 'Z',
		},
		proposal.id,
		opportunity.id
	);

	if (!project) throw new Error('Error creating project...');

	await updateManageProject(
		project.id,
		phases.reduce((acc, current) => acc + current.hours, 0)
	);

	try {
		const results = await Promise.allSettled(phases.map((phase) => createProjectPhase(project.id, phase)));

		const errors = results.filter((r) => r.status === 'rejected');
		console.log('Create phase unfullfilled', errors);
		const successes = results
			.filter((r): r is PromiseFulfilledResult<ProjectPhase> => r.status === 'fulfilled')
			.map((p) => p.value);
	} catch (error) {
		// Handle errors from the Promise.all operation itself
		console.error('Error in Promise.all:', error);
		// You can choose to rethrow the error or handle it accordingly
	}
	await createPhasesWithTicketsAndTasks(project.id, phases);

	return opportunity.id;
};
