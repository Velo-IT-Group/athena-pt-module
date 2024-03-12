import React from 'react';
import { getCatalogItems, getCategories, getProducts, getSubCategories } from '@/lib/functions/read';
import ProductsList from './products-list';
import { Button } from '@/components/ui/button';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { layoutTester } from '@/lib/layoutTester';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import CatalogPicker from './catalog-picker';

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
			<div className='w-full space-y-4'>
				<div className='flex items-center justify-between'>
					<div className='flex gap-4 items-center'>
						<h1 className='text-2xl font-medium leading-none'>Products</h1>
						<p className='text-muted-foreground text-xs'>1 of 1 packages</p>
					</div>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant='secondary' size='sm'>
								<PlusCircledIcon className='h-4 w-4 mr-2' /> Add Product
								{/* <Link href={`/${params.org}/proposal/${params.id}/products/select`}>
								</Link> */}
							</Button>
						</DialogTrigger>
						<CatalogPicker proposal={params.id} catalogItems={catalogItems} count={count} page={page} params={params} />
					</Dialog>
				</div>
			</div>
			<ProductsList data={products} />
		</div>
	);
};

export default ProposalProductPage;
