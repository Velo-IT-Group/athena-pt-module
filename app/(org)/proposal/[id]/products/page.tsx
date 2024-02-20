import React from 'react';
import { getProducts } from '@/lib/data';
import { DataTable } from './data-table';
import { columns } from './columns';

const ProposalProductPage = async () => {
	const products = await getProducts();

	return (
		<div className='bg-muted/50 h-full'>
			<div className='container space-y-4 '>
				<h1 className='text-xl font-semibold'>Products</h1>
				<DataTable columns={columns} data={products ?? []} />
			</div>
		</div>
	);
};

export default ProposalProductPage;
