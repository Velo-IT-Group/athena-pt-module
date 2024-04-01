import { getBillingCycles, getCatalogItem, getProduct } from '@/lib/functions/read';
import { notFound } from 'next/navigation';
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { CubeIcon } from '@radix-ui/react-icons';
import { Separator } from '@/components/ui/separator';
import CurrencyInput from '@/components/CurrencyInput';
import { Label } from '@/components/ui/label';
import { updateProduct } from '@/lib/functions/update';
import BlurInput from './blur-input';
import { CatalogItem } from '@/types/manage';
import BillingCycleSelector from './billing-cycle-selector';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SubmitButton from '@/components/SubmitButton';

type Props = {
	params: { org: string; id: string; product_id: string };
};

const ProductPage = async ({ params }: Props) => {
	const product = await getProduct(params.product_id);

	const billingCycles = await getBillingCycles();

	let catalogItem = await getCatalogItem(product.id ?? 0);

	const item: CatalogItem = {
		...catalogItem,
		...(product.overrides as Record<string, any>),
		// @ts-ignore
		...(product.overrides?.recurring as Record<string, any>),
		// @ts-ignore
		...(product.overrides?.billingCycle as Record<string, any>),
	};

	// console.log(item);
	if (!product) {
		notFound();
	}

	return (
		<main className='space-y-4'>
			<header className='flex items-center space-x-4 px-8 pt-4'>
				<div className='flex items-center justify-center bg-muted rounded-lg h-10 w-10'>
					<CubeIcon />
				</div>
				<h1 className='text-lg font-semibold'>{product.description}</h1>
			</header>

			<Separator />

			<section className='grid grid-cols-2 gap-4 px-4'>
				<Card className='flex flex-col h-full'>
					<CardHeader>
						<CardTitle>Content</CardTitle>
					</CardHeader>

					<CardContent>
						<div className='grid grid-cols-2 gap-4'>
							<Label className='space-y-1'>
								<span>Description</span>
								<BlurInput
									placeholder='Product description'
									defaultValue={product.description ?? item.description}
									objectId={product.unique_id}
									objectKey='description'
									// @ts-ignore
									overrides={product?.overrides}
								/>
							</Label>

							<Label className='space-y-1'>
								<span>Manufacturer Part Number</span>
								<BlurInput
									placeholder='#12345'
									defaultValue={product.manufacturer_part_number ?? undefined}
									objectId={product.unique_id}
									objectKey='manufacturer_part_number'
								/>
							</Label>

							<Label className='space-y-1'>
								<span>Vendor Part Number</span>
								<BlurInput
									placeholder='#12345'
									// @ts-ignore
									defaultValue={product.vendor_part_number ?? undefined}
									objectId={product.unique_id}
									objectKey='vendor_part_number'
									// @ts-ignore
									overrides={product.overrides}
								/>
							</Label>
						</div>
					</CardContent>

					<CardFooter className='bg-muted/50 py-3 mt-auto'>
						<SubmitButton className='ml-auto'>Save</SubmitButton>
					</CardFooter>
				</Card>

				<Card className='flex flex-col h-full'>
					<CardHeader>
						<CardTitle>Details</CardTitle>
					</CardHeader>

					<CardContent className='grid grid-cols-3 gap-4'>
						<Label className='space-y-1'>
							<span>Quantity</span>
							<BlurInput
								placeholder='1'
								disabled={product.parent !== null}
								type='number'
								// @ts-ignore
								defaultValue={product.parent ? product.parent.quantity : product.quantity}
								objectId={product.unique_id}
								objectKey='quantity'
							/>
						</Label>

						<Label className='space-y-1'>
							<span>Price</span>
							<CurrencyInput min='0.00' defaultValue={product.price as number} />
						</Label>

						<Label className='space-y-1'>
							<span>Recurring Amount</span>

							<CurrencyInput min='0.00' defaultValue={item.recurringCost} />
						</Label>

						<Label className='space-y-1'>
							<span>Recurring Billing Cycle</span>

							<BillingCycleSelector
								billingCycles={billingCycles}
								// @ts-ignore
								defaultValue={product.overrides?.recurring?.billCycleId?.toString() ?? item.recurringBillCycle?.id.toString()}
								// @ts-ignore
								overrides={product.overrides}
								unique_id={product.unique_id}
							/>
						</Label>

						<Label className='space-y-1'>
							<span>Cost</span>

							<CurrencyInput min='0.00' defaultValue={product.cost as number} />
						</Label>

						<Label className='space-y-1'>
							<span>Recurring Cost</span>

							<CurrencyInput min='0.00' defaultValue={product.recurring_cost as number} />
						</Label>

						<div className='grid grid-cols-2 gap-4 h-full'>
							<Label className='flex flex-col h-full'>
								<span>Is Taxable?</span>
								<Switch
									formAction={async (e) => {
										'use server';

										await updateProduct(product.unique_id, {
											taxable_flag: e.get('taxable_flag') ? true : false,
										});
									}}
									name='taxable_flag'
									type='submit'
									defaultChecked={product.taxable_flag as boolean}
									className='block my-auto'
								/>
							</Label>

							<Label className='flex flex-col h-full'>
								<span>Is Recurring?</span>
								<Switch
									formAction={async (e) => {
										'use server';

										await updateProduct(product.unique_id, {
											recurring_flag: e.get('recurring_flag') ? true : false,
										});
									}}
									name='recurring_flag'
									type='submit'
									defaultChecked={product.recurring_flag as boolean}
									className='block my-auto'
								/>
							</Label>
						</div>

						<Label className='space-y-1'>
							<span>Recurring Cost</span>
							<CurrencyInput min='0.01' defaultValue={product.recurring_cost as number} />
						</Label>

						<Label className='space-y-1'>
							<span>Recurring Suggested Price</span>
							{/* @ts-ignore */}
							<CurrencyInput min='0.01' step={0.01} defaultValue={product.recurring_suggested_price as number} />
						</Label>
					</CardContent>

					<CardFooter className='bg-muted/50 py-3 mt-auto'>
						<SubmitButton className='ml-auto'>Save</SubmitButton>
					</CardFooter>
				</Card>
			</section>
		</main>
	);
};

export default ProductPage;
