import React from 'react';
import { getCatalogItems, getProducts } from '@/lib/functions/read';
import ProductsList from './products-list';

type Props = {
	params: { org: string; id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

const ProposalProductPage = async ({ params, searchParams }: Props) => {
	const searchText = typeof searchParams.search === 'string' ? String(searchParams.search) : undefined;
	const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
	// await layoutTester(searchParams.loading);
	const products = await getProducts(params.id);
	const { catalogItems, count } = await getCatalogItems(searchText, page);

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
