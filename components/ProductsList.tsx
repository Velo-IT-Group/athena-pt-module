import React, { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { CatalogItem } from '@/types/manage';
import ProductListItem from './ProductListItem';

const ProductsList = ({ products }: { products: Array<CatalogItem> }) => {
	const [text, setText] = useState<string>('');

	return (
		<div className='grid w-full items-start py-6 gap-4 text-sm dark:border-gray-800'>
			<div className='grid gap-2'>
				<Label className='sr-only' htmlFor='search'>
					Search
				</Label>
				<Input
					className='bg-white shadow-none dark:bg-gray-950'
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder='Search products...'
				/>
			</div>
			<ScrollArea className='h-96'>
				<div className='space-y-2'>
					{products
						?.filter((product) => product.description.toLowerCase().includes(text))
						.map((product) => (
							<ProductListItem key={product.id} product={product} isChecked={false} />
						))}
				</div>
			</ScrollArea>
		</div>
	);
};

export default ProductsList;
