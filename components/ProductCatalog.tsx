'use client';
import { CaretSortIcon, CubeIcon } from '@radix-ui/react-icons';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ProductsList from './ProductsList';
import { getProducts } from '@/lib/data';
import { CatalogItem } from '@/types/manage';

const ProductCatalog = ({ products }: { products: CatalogItem[] }) => {
	// const products = await getProducts();

	// if (!products) return <div></div>;

	return (
		<Collapsible>
			<div className='flex items-center gap-2 w-full'>
				<CubeIcon className='h-4 w-4' />
				<h2 className='font-semibold text-base'>Product Catalog</h2>
				<CollapsibleTrigger asChild>
					<Button variant='ghost' size='sm' className='ml-auto'>
						<CaretSortIcon className='h-4 w-4' />
						<span className='sr-only'>Toggle</span>
					</Button>
				</CollapsibleTrigger>
			</div>

			<CollapsibleContent className='h-full'>
				<ProductsList products={products} />
			</CollapsibleContent>
		</Collapsible>
	);
};

export default ProductCatalog;
