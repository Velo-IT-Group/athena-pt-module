import React from 'react';
import { getCatalogItems, getProducts } from '@/lib/functions/read';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
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
					<Dialog>
						<DialogTrigger asChild>
							<Button>
								<PlusCircledIcon className='h-4 w-4 mr-2' /> Add Product
							</Button>
						</DialogTrigger>
						<CatalogPicker catalogItems={catalogItems} />
					</Dialog>
				</div>
			</div>
			<div className='container py-10'>
				<DataTable columns={columns} data={products ?? []} />
			</div>
		</>
	);
};

export default ProposalProductPage;
