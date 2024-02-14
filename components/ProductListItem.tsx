import React from 'react';
import { Checkbox } from './ui/checkbox';
import { CatalogItem } from '@/types/manage';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import ProductHoverCard from './ProductHoverCard';

type Props = {
	product: CatalogItem;
	isChecked: boolean;
};

const ProductListItem = ({ product, isChecked }: Props) => {
	return (
		<HoverCard>
			<div className='items-top flex space-x-2'>
				<Checkbox id={String(product.id)} />
				<HoverCardTrigger asChild>
					<label
						htmlFor={String(product.id)}
						className='line-clamp-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
					>
						{product.identifier}
					</label>
				</HoverCardTrigger>
			</div>
			<HoverCardContent className='w-80'>
				<ProductHoverCard />
			</HoverCardContent>
		</HoverCard>
	);
};

export default ProductListItem;
