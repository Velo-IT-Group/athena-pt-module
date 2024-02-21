import React, { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { getCurrencyString } from '@/utils/money';
import { Button } from './ui/button';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';

const ProductHoverCard = ({ product, description }: { product: Product; description: string }) => {
	const [quantity, setQuantity] = useState(product.quantity ?? 0);
	return (
		<form className='grid gap-4'>
			<div className='space-y-2'>
				<h4 className='font-medium leading-none'>{description}</h4>
				<p className='text-sm text-muted-foreground'>View all the totals of this proposal.</p>
			</div>
			<div className='grid gap-4'>
				<div className='grid grid-cols-3 items-center gap-4'>
					<Label htmlFor='price'>Price</Label>
					<Input id='price' defaultValue={getCurrencyString(product.price ?? 0)} className='col-span-2 h-8' />
				</div>
				<div className='grid grid-cols-3 items-center gap-4'>
					<Label htmlFor='quantity'>Quantity</Label>
					<div className='col-span-2 flex items-center gap-2'>
						<Button variant='outline' size='sm' type='button' className='h-8' onClick={() => setQuantity(quantity - 1)}>
							<MinusIcon className='w-4 h-4' />
						</Button>
						<Input value={quantity} onChange={(e) => setQuantity(parseInt(e.currentTarget.value))} className='max-w-12 text-center h-8' />
						<Button variant='outline' size='sm' type='button' className='h-8' onClick={() => setQuantity(quantity + 1)}>
							<PlusIcon className='w-4 h-4' />
						</Button>
						{/* <Input id='quantity' defaultValue={product.quantity} className='' /> */}
					</div>
				</div>
				<div className='grid grid-cols-3 items-center gap-4'>
					<Label htmlFor='extended_price'>Extended Price</Label>
					<Input id='extended_price' value={getCurrencyString((product.price ?? 0) * quantity)} className='col-span-2 h-8' />
				</div>
			</div>
		</form>
	);
};

export default ProductHoverCard;
