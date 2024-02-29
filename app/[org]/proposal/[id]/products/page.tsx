import React from 'react';
import { getCatalogItems, getProducts } from '@/lib/functions/read';
import { DataTable } from './data-table';
import { columns } from './columns';
import CatalogPicker from './catalog-picker';

const ProposalProductPage = async ({ params }: { params: { id: string } }) => {
	const products = await getProducts(params.id);
	const catalogItems = await getCatalogItems();

	if (!products || !catalogItems) {
		return <div></div>;
	}

	return (
		<>
			<div className='bg-background py-10 border-b'>
				<div className='flex items-center justify-between container'>
					<h1 className='text-3xl font-medium'>Products</h1>
					<CatalogPicker proposal={params.id} catalogItems={catalogItems} />
				</div>
			</div>
			<div className='container py-10'>
				<DataTable columns={columns} data={products ?? []} />
			</div>
		</>
	);
};

export default ProposalProductPage;
