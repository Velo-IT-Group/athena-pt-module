import React from 'react';
import { getProducts } from '@/lib/functions/read';
import ProductsList from './products-list';
import { Button } from '@/components/ui/button';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { layoutTester } from '@/lib/layoutTester';

type Props = {
	params: { org: string; id: string };
	searchParams: any;
};

const ProposalProductPage = async ({ params, searchParams }: Props) => {
	await layoutTester(searchParams);
	const products = await getProducts(params.id);

	if (!products) {
		return <div></div>;
	}

	return (
		<>
			<div className='bg-background py-10 border-b'>
				<div className='flex items-center justify-between container'>
					<h1 className='text-3xl font-medium'>Products</h1>
					<Button asChild>
						<Link href={`/${params.org}/proposal/${params.id}/products/select`}>
							<PlusCircledIcon className='h-4 w-4 mr-2' /> Add Product
						</Link>
					</Button>
				</div>
			</div>
			<div className='container py-10'>
				<ProductsList data={products} />
			</div>
		</>
	);
};

export default ProposalProductPage;
