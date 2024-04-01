import React from 'react';
import { getCatalogItems, getIngramPricing, getOpportunityProducts, getProducts, getSynnexPricing } from '@/lib/functions/read';
import ProductsList from './products-list';

type Props = {
	params: { org: string; id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

const ProposalProductPage = async ({ params, searchParams }: Props) => {
	const search = typeof searchParams.search === 'string' ? String(searchParams.search) : undefined;
	const identifier = typeof searchParams.identifier === 'string' ? String(searchParams.identifier) : undefined;
	const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
	const products = await getProducts(params.id);
	const { catalogItems, count } = await getCatalogItems(search, identifier, page);

	if (!products) {
		return <div></div>;
	}

	return (
		<div className='grow px-6 py-4 w-full space-y-4 flex flex-col'>
			<ProductsList products={products} proposal={params.id} catalogItems={catalogItems} count={count} page={page} params={params} />
		</div>
	);
};

export default ProposalProductPage;
