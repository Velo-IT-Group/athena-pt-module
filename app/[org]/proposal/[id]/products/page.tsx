import React from 'react';
import { getCatalogItems, getProducts } from '@/lib/functions/read';
import { DataTable } from './data-table';
import { columns } from './columns';

const ProposalProductPage = async ({ params }: { params: { id: string } }) => {
	const products = await getProducts(params.id);
	const catalogItems = await getCatalogItems();

	if (!products || !catalogItems) {
		return <div></div>;
	}

	return (
		<div className='bg-muted/50 h-full'>
			<div className='container space-y-4 '>
				<h1 className='text-xl font-semibold'>Products</h1>
				<DataTable columns={columns} data={catalogItems ?? []} products={products ?? []} id={params.id} />
			</div>
		</div>
	);
};

export default ProposalProductPage;
