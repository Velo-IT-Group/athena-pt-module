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
	const { products } = proposal;

	// Create opportunity
	const opportunity = await createOpportunity(proposal, ticket);

	if (!opportunity) throw Error("Couldn't create opportunity...");

	const { error } = await supabase.from('proposals').update({ opportunity_id: opportunity.id }).eq('id', proposal.id);

	if (error) throw Error('Error updating proposal', { cause: error.message });

	if (!products) throw Error('No products provided...');

	// Create generic products
	const createdOpportunityProducts = await Promise.all(
		products.map((product) =>
			createManageProduct(opportunity.id, { id: product.catalog_item!, productClass: product.product_class! as ProductClass }, product)
		)
	);

	if (!createdOpportunityProducts) throw Error('Error creating opportunity products...');

	// Get all products from opportunity
	const opportunityProducts = await getOpportunityProducts(opportunity.id);

	if (!opportunityProducts) throw Error('No products returned...');

	// Filter bundled products to update the sub items prices
	const bundledProducts = opportunityProducts.filter((product) => product && products?.some((p) => p.id === product.catalogItem.id));

	const bundledChanges = bundledProducts?.map((b) => {
		return {
			id: b.id,
			values: [
				{
					op: 'replace',
					path: '/price',
					value: b.price,
				},
				{
					op: 'replace',
					path: '/cost',
					value: b.cost,
				},
			],
		} as ManageProductUpdate;
	});

	await Promise.all(bundledChanges.map((product) => updateManageProduct(product)));
};
