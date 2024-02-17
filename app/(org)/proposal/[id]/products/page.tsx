import React from 'react';
import { getProducts } from '@/lib/data';
import { DataTable } from './data-table';
import { columns } from './columns';

const ProposalProductPage = async () => {
	const products = await getProducts();

	return (
		<div className='space-y-4'>
			<h1 className='text-xl font-semibold'>Products</h1>
			<DataTable columns={columns} data={products ?? []} />
		</div>
	);
};

export default ProposalProductPage;
