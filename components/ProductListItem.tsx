'use client';
import React, { useEffect, useState, useTransition } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from './ui/button';
import { MinusIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { getCurrencyString, parseAmount } from '@/utils/money';
import { ProductState } from '@/types/optimisticTypes';
import { updateProduct } from '@/lib/functions/update';
import { deleteProduct } from '@/lib/functions/delete';

type Props = {
	product: Product;
	description?: string;
	mutate: (action: ProductState) => void;
	pending: boolean;
};

const ProductListItem = ({ product, description, mutate, pending }: Props) => {
	let [isPending, startTransition] = useTransition();
	const [quantity, setQuantity] = useState(product.quantity);
	const [price, setPrice] = useState(getCurrencyString(product.price ?? 0));

	useEffect(() => {
		const parsedPrice = parseAmount(price) ?? 0;
		const updatedProduct = { quantity, price: parseAmount(price) ?? 0, extended_price: parsedPrice * quantity };
		console.log(updatedProduct, product);
		startTransition(async () => {
			mutate({
				updatedProduct: {
					...product,
					...updatedProduct,
				},
				pending: true,
			});

			await updateProduct(product.id, updatedProduct);
		});
	}, [quantity, price]);

	const action = async (data: FormData) => {
		const quantity = data.get('quantity') as unknown as number;
		// @ts-ignore
		data.set('extended_price', parseFloat(data.get('extended_price').slice(1) ?? 0));
		// @ts-ignore
		data.set('price', parseFloat(data.get('price').slice(1) ?? 0));
		const price = data.get('price') as unknown as number;
		const extended_price = data.get('extended_price') as unknown as number;
		data.set('id', product.id);
		console.log(quantity, price, extended_price);

		startTransition(async () => {
			const updatedProduct = { quantity, price, extended_price };

			mutate({
				updatedProduct: {
					...product,
					...updatedProduct,
				},
				pending: true,
			});

			await updateProduct(product.id, updatedProduct);
		});
	};

	return (
		<HoverCard>
			<div className='items-top flex space-x-2 w-full'>
				<div className='space-y-2 w-full'>
					<div className='flex items-center justify-between gap-4 w-full'>
						<HoverCardTrigger aria-disabled={pending} asChild>
							<Button variant='ghost' size='sm' className='line-clamp-1'>
								<div className='text-sm font-semibold '>{description}</div>
							</Button>
						</HoverCardTrigger>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => {
								startTransition(async () => {
									mutate({
										deletedProduct: product.id,
										pending: true,
									});
									await deleteProduct(product.id);
								});
							}}
						>
							<TrashIcon className='w-4 h-4 text-red-500' />
						</Button>
					</div>
				</div>
			</div>
			<HoverCardContent className='w-80'>
				<div className='grid gap-4'>
					<div className='space-y-2'>
						<h4 className='font-medium leading-none'>{description}</h4>
						<p className='text-sm text-muted-foreground'>View all the totals of this proposal.</p>
					</div>
					<div className='grid gap-4'>
						<div className='grid grid-cols-3 items-center gap-4'>
							<Label htmlFor='price'>Price</Label>
							<Input
								name='price'
								defaultValue={getCurrencyString(product.price ?? 0)}
								onChange={(e) => setPrice(e.currentTarget.value)}
								className='col-span-2 h-8'
							/>
						</div>
						<div className='grid grid-cols-3 items-center gap-4'>
							<Label htmlFor='quantity'>Quantity</Label>
							<div className='col-span-2 flex items-center gap-2'>
								<Button variant='outline' size='sm' className='h-8' onClick={() => setQuantity(quantity - 1)}>
									<MinusIcon className='w-4 h-4' />
								</Button>
								<Input
									value={quantity}
									name='quantity'
									readOnly
									onChange={(e) => setQuantity(parseInt(e.currentTarget.value))}
									className='max-w-12 text-center h-8'
								/>
								<Button variant='outline' size='sm' className='h-8' onClick={() => setQuantity(quantity + 1)}>
									<PlusIcon className='w-4 h-4' />
								</Button>
							</div>
						</div>
						<div className='grid grid-cols-3 items-center gap-4'>
							<Label htmlFor='extended_price'>Extended Price</Label>
							{/* <Input
								name='extended_price'
								value={getCurrencyString((product.price ?? 0) * quantity)}
								onChange={(e) => setExtendedPrice(e.currentTarget.value)}
								className='col-span-2 h-8'
							/> */}
							<p>{getCurrencyString((product.price ?? 0) * quantity)}</p>
						</div>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
};

export default ProductListItem;
