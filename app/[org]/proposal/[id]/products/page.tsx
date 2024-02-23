'use server';
import React from 'react';
import { getCatalogItems, getProducts } from '@/lib/data';
import { DataTable } from './data-table';
import { columns } from './columns';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

const ProposalProductPage = async ({ params }: { params: { id: string } }) => {
	const cookieStore = cookies();
	// const products = await getProducts(params.id);
	// console.log(products, params.id);
	const catalogItems = await getCatalogItems();
	const supabase = createClient(cookieStore);
	const { data: products, error } = await supabase.from('products').select().eq('proposal', params.id);

	if (error) {
		return <div>{JSON.stringify(error, null, 2)}</div>;
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
