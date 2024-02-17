import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ProductSummaryListItem from './ProductSummaryListItem';
import { Separator } from '@/components/ui/separator';

const ProductTotalCard = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Products Total</CardTitle>
			</CardHeader>
			<CardContent className='space-y-2'>
				<ProductSummaryListItem />
				<ProductSummaryListItem />
				<ProductSummaryListItem />
				<ProductSummaryListItem />
				<ProductSummaryListItem />
				<ProductSummaryListItem />
			</CardContent>
			<CardFooter className='flex flex-col items-start w-full gap-6'>
				<Separator />
				<div>
					<p className='text-sm text-muted-foreground'>Total</p>
					<p className='text-xl font-semibold'>$123.45</p>
				</div>
			</CardFooter>
		</Card>
	);
};

export default ProductTotalCard;
