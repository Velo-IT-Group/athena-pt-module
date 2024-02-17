import React from 'react';
import { Input } from '@/components/ui/input';

let USDollar = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

const ProductSummaryListItem = () => {
	return (
		<div className='flex items-center gap-2'>
			<Input placeholder='Enter quantity...' className='max-w-12 text-center' defaultValue={1} />
			<p className='line-clamp-1'>Product Name</p>

			<p className='ml-auto text-right'>{USDollar.format(234)}</p>
		</div>
	);
};

export default ProductSummaryListItem;
