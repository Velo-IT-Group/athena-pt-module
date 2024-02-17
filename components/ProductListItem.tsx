'use client';
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { CatalogItem } from '@/types/manage';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import ProductHoverCard from './ProductHoverCard';
import { Button } from './ui/button';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { Input } from './ui/input';

type Props = {
	product?: CatalogItem;
	isChecked?: boolean;
	description?: string;
};

const ProductListItem = ({ product, isChecked, description }: Props) => {
	const [value, setValue] = useState(1);
	return (
		// <HoverCard>
		// 	<div className='items-top flex space-x-2'>
		// 		<Checkbox id={String(product.id)} />
		// 		<HoverCardTrigger asChild>
		// 			<label
		// 				htmlFor={String(product.id)}
		// 				className='line-clamp-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
		// 			>
		// 				{product.identifier}
		// 			</label>
		// 		</HoverCardTrigger>
		// 	</div>
		// 	<HoverCardContent className='w-80'>
		// 		<ProductHoverCard />
		// 	</HoverCardContent>
		// </HoverCard>
		<div className='space-y-2'>
			<div className='text-sm font-semibold line-clamp-1'>{description}</div>
			<div className='flex items-center space-x-2'>
				<Button variant='outline' size='sm' onClick={() => setValue(value - 1)}>
					<MinusIcon className='w-4 h-4' />
				</Button>
				<Input value={value} onChange={(e) => setValue(parseInt(e.currentTarget.value))} className='max-w-12 text-center' />
				<Button variant='outline' size='sm' onClick={() => setValue(value + 1)}>
					<PlusIcon className='w-4 h-4' />
				</Button>
			</div>
		</div>
	);
};

export default ProductListItem;
