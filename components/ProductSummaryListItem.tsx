import React from 'react';
import { Input } from '@/components/ui/input';
import { getCurrencyString } from '@/utils/money';

const ProductSummaryListItem = () => {
	return (
		<div className='flex items-center gap-2'>
			<Input placeholder='Enter quantity...' className='max-w-12 text-center' defaultValue={1} />
			<p className='line-clamp-1'>Product Name</p>

			<p className='ml-auto text-right'>{getCurrencyString(234)}</p>
		</div>
	);
};

export default ProductSummaryListItem;
