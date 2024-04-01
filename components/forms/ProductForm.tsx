'use client';

import React, { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { updateProduct } from '@/lib/functions/update';
import { Switch } from '../ui/switch';
import { HoverCard, HoverCardTrigger } from '../ui/hover-card';
import { ArrowLeftIcon, CaretSortIcon, CubeIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import IntegrationPricingCard from '../IntegrationPricingCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { ReferenceType } from '@/types/manage';
import SubmitButton from '../SubmitButton';
import { useRouter } from 'next/navigation';
import CurrencyInput from '../CurrencyInput';

//@ts-ignore
const productFormSchema = z.object<ProductUpdate>({
	calculated_cost: z.nullable(z.number().optional()),
	calculated_cost_flag: z.nullable(z.boolean().optional()),
	calculated_price: z.nullable(z.number().optional()),
	calculated_price_flag: z.nullable(z.boolean().optional()),
	catalog_item: z.nullable(z.number().optional()),
	category: z.nullable(z.string().optional()),
	cost: z.nullable(z.number().optional()),
	customer_description: z.nullable(z.string().optional()),
	description: z.nullable(z.string().optional()),
	drop_ship_flag: z.nullable(z.boolean().optional()),
	hide_description_flag: z.nullable(z.boolean().optional()),
	hide_extended_price_flag: z.nullable(z.boolean().optional()),
	hide_item_identifier_flag: z.nullable(z.boolean().optional()),
	hide_price_flag: z.nullable(z.boolean().optional()),
	hide_quantity_flag: z.nullable(z.boolean().optional()),
	id: z.nullable(z.number().optional()),
	identifier: z.nullable(z.string().optional()),
	inactive_flag: z.nullable(z.boolean().optional()),
	manufacturer: z.nullable(z.string().optional()),
	manufacturer_part_number: z.nullable(z.string().optional()),
	parent: z.nullable(z.string().optional()),
	parent_catalog_item: z.nullable(z.number().optional()),
	phase_product_flag: z.nullable(z.boolean().optional()),
	price: z.nullable(z.number().optional()),
	product_class: z.nullable(z.string().optional()),
	proposal: z.nullable(z.string().optional()),
	quantity: z.nullable(z.number().optional()),
	recurring_bill_cycle: z.nullable(z.number().optional()),
	recurring_cost: z.nullable(z.number().optional().optional()),
	recurring_cycle_type: z.nullable(z.string().optional()),
	recurring_flag: z.nullable(z.boolean().optional()),
	recurring_one_time_flag: z.nullable(z.boolean().optional()),
	recurring_revenue: z.nullable(z.number().optional()),
	sequence_number: z.nullable(z.number().optional()),
	serialized_cost_flag: z.nullable(z.boolean().optional()),
	serialized_flag: z.nullable(z.boolean().optional()),
	special_order_flag: z.nullable(z.boolean().optional()),
	subcategory: z.nullable(z.string().optional()),
	taxable_flag: z.nullable(z.boolean().optional()),
	type: z.nullable(z.string().optional()),
	unique_id: z.string(),
	unit_of_measure: z.nullable(z.string().optional()),
	vendor: z.nullable(z.string().optional()),
	products: z.array(z.nullable(z.string().optional())),
});

function differenceInObj<T extends Record<keyof T, any>>(old: T, newObj: T): T {
	// @ts-ignore
	let differenceObj: Record<keyof T, any> = {};
	for (const key in old) {
		if (Object.prototype.hasOwnProperty.call(old, key)) {
			if (old[key] !== newObj[key]) {
				differenceObj[key as keyof T] = newObj[key];
			}
		}
	}

	return differenceObj;
}

type Props = {
	product: Product;
	billingCycles: ReferenceType[];
};

const ProductForm = ({ product, billingCycles }: Props) => {
	const router = useRouter();

	const form = useForm<z.infer<typeof productFormSchema>>({
		resolver: zodResolver(productFormSchema),
		defaultValues: product,
	});
	const isDirty = form.formState.isDirty;

	console.log(product);

	useEffect(() => {
		console.log(isDirty);
		if (!isDirty) return;

		function handleOnBeforeUnload(e: BeforeUnloadEvent) {
			e.preventDefault();
			return (e.returnValue = '');
		}

		window.addEventListener('beforeunload', handleOnBeforeUnload, { capture: true });

		return () => {
			window.removeEventListener('beforeunload', handleOnBeforeUnload);
		};
	}, [isDirty]);

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof productFormSchema>) {
		// @ts-ignore
		const difference = differenceInObj(product, values);
		// @ts-ignore
		delete difference['products'];
		// @ts-ignore
		delete difference['created_at'];
		// @ts-ignore
		console.log(difference);
		//@ts-ignore
		// delete values['extended_price'];
		console.log('hi', values);

		// @ts-ignore
		await updateProduct(product.unique_id, values);
	}

	return (
		<>
			<header className='flex items-center justify-between p-4'>
				<Button
					variant='ghost'
					onClick={() => {
						if (isDirty) {
							if (confirm('Are you sure?') === true) {
								router.back();
							}
						} else {
							router.back();
						}
					}}
				>
					<ArrowLeftIcon className='w-4 h-4 mr-2' /> Products
				</Button>
				<SubmitButton type='submit' loading={form.formState.isSubmitting} disabled={!!!isDirty} form='product-update'>
					Save changes
				</SubmitButton>
			</header>

			<section className='flex items-center space-x-4 px-8 py-4'>
				<div className='flex items-center justify-center bg-muted rounded-lg h-10 w-10'>
					<CubeIcon />
				</div>
				<h1 className='text-lg font-semibold'>{product.description}</h1>
			</section>

			<Separator />

			<Form {...form}>
				<form
					id='product-update'
					name='product-update'
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8 px-8 py-4 h-full flex flex-col flex-1 overflow-auto'
				>
					<Collapsible defaultOpen>
						<section>
							<div className='flex items-center justify-between space-x-4'>
								<h4 className='font-medium'>Content</h4>
								<CollapsibleTrigger asChild>
									<Button variant='ghost' size='sm'>
										<CaretSortIcon className='h-4 w-4' />
										<span className='sr-only'>Toggle</span>
									</Button>
								</CollapsibleTrigger>
							</div>
							<CollapsibleContent className='space-y-4 grid grid-cols-2 gap-4'>
								<FormField
									control={form.control}
									name='description'
									render={({ field }) => (
										<FormItem className='col-span-2 mt-4'>
											<FormLabel>Description</FormLabel>
											<FormControl>
												{/* @ts-ignore */}
												<Input placeholder='Product description' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='manufacturer_part_number'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Manufacturer Part Number</FormLabel>
											<FormControl>
												{/* @ts-ignore */}
												<Input placeholder='#12345' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='vendor_part_number'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Vendor Part Number</FormLabel>
											<FormControl>
												<Input placeholder='#12345' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CollapsibleContent>
						</section>
					</Collapsible>

					<Separator />

					<Collapsible defaultOpen>
						<section>
							<div className='flex items-center justify-between space-x-4'>
								<h4 className='font-medium'>Details</h4>
								<CollapsibleTrigger asChild>
									<Button variant='ghost' size='sm'>
										<CaretSortIcon className='h-4 w-4' />
										<span className='sr-only'>Toggle</span>
									</Button>
								</CollapsibleTrigger>
							</div>
							<CollapsibleContent>
								<div className='grid grid-cols-3 gap-4'>
									<FormField
										control={form.control}
										name='quantity'
										render={() => (
											<FormItem>
												<FormLabel>Quantity</FormLabel>
												<FormControl>
													<Input type='number' placeholder='1' {...form.register('quantity', { valueAsNumber: true })} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='price'
										render={({ field }) => (
											<FormItem className='relative'>
												<FormLabel>
													Price
													<HoverCard>
														<HoverCardTrigger>
															<InfoCircledIcon className='w-4 h-4 text-muted-foreground inline-block ml-2' />
															<IntegrationPricingCard description='Testing' id='' vendorSku='' setPrice={field.onChange} />
														</HoverCardTrigger>
													</HoverCard>
												</FormLabel>
												<FormControl>
													<CurrencyInput min='0.00' defaultValue={field.value as number} {...form.register('price', { valueAsNumber: true })} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='recurring_amount'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Recurring Amount</FormLabel>
												<FormControl>
													<CurrencyInput
														min='0.00'
														defaultValue={field.value as number}
														{...form.register('recurring_amount', { valueAsNumber: true })}
													/>
													{/* <div className='relative'>
														<p className='absolute flex items-center my-auto left-3 h-9 text-sm select-none'>$</p>
														<Input
															type='number'
															min='0.01'
															step='0.01'
															{...form.register('recurring_amount', { valueAsNumber: true })}
															className='pl-6'
															placeholder='0.00'
														/>
													</div> */}
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='recurring_cycle_type'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Recurring Type</FormLabel>
												{/* @ts-ignore */}
												<Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder='Select a recurring type' />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value='m@example.com'>m@example.com</SelectItem>
														<SelectItem value='m@google.com'>m@google.com</SelectItem>
														<SelectItem value='m@support.com'>m@support.com</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='cost'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Cost</FormLabel>
												<FormControl>
													<CurrencyInput min='0.00' defaultValue={field.value as number} {...form.register('cost', { valueAsNumber: true })} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='recurring_cost'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Recurring Cost</FormLabel>
												<FormControl>
													<CurrencyInput
														min='0.00'
														defaultValue={field.value as number}
														{...form.register('recurring_cost', { valueAsNumber: true })}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='recurring_bill_cycle'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Recurring Option</FormLabel>
												{/* @ts-ignore */}
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder='Select a recurring type' />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{billingCycles.map((cycle) => (
															<SelectItem key={cycle.id} value={cycle.id.toString()}>
																{cycle.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='suggested_price'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Suggested Price</FormLabel>
												<FormControl>
													<CurrencyInput
														min='0.01'
														step={0.01}
														defaultValue={field.value as number}
														{...form.register('suggested_price', { valueAsNumber: true })}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='recurring_suggested_price'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Recurring Suggested Price</FormLabel>
												<FormControl>
													<CurrencyInput
														min='0.01'
														step={0.01}
														defaultValue={field.value as number}
														{...form.register('recurring_suggested_price', { valueAsNumber: true })}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='phase_product_flag'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Is Phase Item?</FormLabel>
												<FormControl>
													<Switch checked={field.value === true} onCheckedChange={field.onChange} className='block' />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='taxable_flag'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Is Taxable?</FormLabel>
												<FormControl>
													<Switch checked={field.value === true} onCheckedChange={field.onChange} className='block' />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='recurring_flag'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Is Recurring?</FormLabel>
												<FormControl>
													<Switch checked={field.value === true} onCheckedChange={field.onChange} className='block' />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CollapsibleContent>
						</section>
					</Collapsible>

					<Separator />

					<Collapsible defaultOpen>
						<section>
							<div className='flex items-center justify-between space-x-4'>
								<h4 className='font-medium'>Notes</h4>
								<CollapsibleTrigger asChild>
									<Button variant='ghost' size='sm'>
										<CaretSortIcon className='h-4 w-4' />
										<span className='sr-only'>Toggle</span>
									</Button>
								</CollapsibleTrigger>
							</div>
							<CollapsibleContent>
								<Textarea className='mt-4' placeholder='Place any notes here...' />
							</CollapsibleContent>
						</section>
					</Collapsible>

					<Button type='submit'>Save</Button>
				</form>
			</Form>
		</>
		// <Sheet onOpenChange={() => console.log(product)}>
		// 	<SheetTrigger asChild>
		// 		<Button variant='ghost' className='h-8 w-8 p-0'>
		// 			<span className='sr-only'>Open menu</span>
		// 			<Pencil2Icon className='h-4 w-4' />
		// 		</Button>
		// 	</SheetTrigger>
		// 	<SheetContent className='max-w-none sm:max-w-none w-[700px] space-y-4 flex-1 flex flex-col overflow-hidden'>
		// 		<SheetHeader>
		// 			<SheetTitle>Edit Product</SheetTitle>
		// 			<SheetDescription>{getCurrencyString(product.calculated_price ?? product.price ?? 0)}</SheetDescription>
		// 		</SheetHeader>

		// 		<SheetFooter>
		// 			<SubmitButton type='submit' form={`product-update-${product.id}`}>
		// 				Save changes
		// 			</SubmitButton>
		// 			<SheetClose asChild></SheetClose>
		// 		</SheetFooter>
		// 	</SheetContent>
		// </Sheet>
	);
};

export default ProductForm;
