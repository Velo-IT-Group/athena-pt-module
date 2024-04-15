'use server';

import { createManageProduct, createOpportunity } from '@/lib/functions/create';
import { getOpportunityProducts } from '@/lib/functions/read';
import { ManageProductUpdate, updateManageProduct } from '@/lib/functions/update';
import { ProductClass, ServiceTicket } from '@/types/manage';
import { createClient } from '@/utils/supabase/server';

/**
 * Multi Step Process of creating a project inside of Manage
 * @param {string} id - The id of the product.
 * @param {ProductUpdate} product - The product you're wanting to update.
 */
export const convertToManageProject = async (proposal: NestedProposal, ticket: ServiceTicket) => {
	const supabase = createClient();
	// const { products } = proposal;

	const products = proposal.products?.sort((a, b) => {
		// First, compare by score in descending order
		if (Number(a!.created_at) > Number(b!.created_at)) return 1;
		if (Number(a!.created_at) < Number(b!.created_at)) return -1;

		return -1;
	});

	// Create opportunity
	const opportunity = await createOpportunity(proposal, ticket);

	if (!opportunity) throw Error("Couldn't create opportunity...");

	const { error } = await supabase.from('proposals').update({ opportunity_id: opportunity.id }).eq('id', proposal.id);

	if (error) throw Error('Error updating proposal', { cause: error.message });

	if (!products) throw Error('No products provided...');

	// Get all products from opportunity
	const opportunityProducts = await getOpportunityProducts(opportunity.id);

	if (!opportunityProducts) throw Error('No products returned...');

	const flattendProducts = products?.map((product) => product.products).flat();

	// Filter bundled products to update the sub items prices
	const bundledProducts = opportunityProducts.filter((product) => product && flattendProducts?.some((p) => p && p.id === product.catalogItem.id));

	console.log('bundledProducts', bundledProducts);

	const bundledChanges = bundledProducts?.map((b) => {
		const product = flattendProducts.find((product) => product!.id === b.catalogItem.id);
		return {
			id: b!.id,
			values: [
				{
					op: 'replace',
					path: '/price',
					value: product!.price,
				},
				{
					op: 'replace',
					path: '/cost',
					value: product!.cost,
				},
			],
		} as ManageProductUpdate;
	});

	console.log('bundledChanges', bundledChanges);

	await Promise.all(bundledChanges.map((product) => updateManageProduct(product)));

	return opportunity;
};
