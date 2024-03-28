import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { reduce, isEqual, isArray, isObject, transform } from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { updateProduct } from '@/lib/functions/update';
import { Switch } from '../ui/switch';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { CaretSortIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import IntegrationPricingCard from '../IntegrationPricingCard';
import { getCurrencyString } from '@/utils/money';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Category, ReferenceType, Subcategory } from '@/types/manage';
import { getBillingCycles, getCategories, getSubCategories } from '@/lib/functions/read';
import SubmitButton from '../SubmitButton';

function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

//@ts-ignore
const productFormSchema = z.object<ProductUpdate>({
	calculated_cost: z.nullable(z.undefined(z.number())),
	calculated_cost_flag: z.nullable(z.boolean()),
	calculated_price: z.nullable(z.number()),
	calculated_price_flag: z.nullable(z.boolean()),
	catalog_item: z.nullable(z.number()),
	category: z.nullable(z.string()),
	cost: z.nullable(z.number()),
	customer_description: z.nullable(z.string()),
	description: z.nullable(z.string()),
	drop_ship_flag: z.nullable(z.boolean()),
	hide_description_flag: z.nullable(z.boolean()),
	hide_extended_price_flag: z.nullable(z.boolean()),
	hide_item_identifier_flag: z.nullable(z.boolean()),
	hide_price_flag: z.nullable(z.boolean()),
	hide_quantity_flag: z.nullable(z.boolean()),
	id: z.nullable(z.number()),
	identifier: z.nullable(z.string()),
	inactive_flag: z.nullable(z.boolean()),
	manufacturer: z.nullable(z.string()),
	manufacturer_part_number: z.nullable(z.string()),
	parent: z.nullable(z.string()),
	parent_catalog_item: z.nullable(z.number()),
	phase_product_flag: z.nullable(z.boolean()),
	price: z.nullable(z.number()),
	product_class: z.nullable(z.string()),
	proposal: z.nullable(z.string()),
	quantity: z.nullable(z.number()),
	recurring_bill_cycle: z.nullable(z.number()),
	recurring_cost: z.nullable(z.number()),
	recurring_cycle_type: z.nullable(z.string()),
	recurring_flag: z.nullable(z.boolean()),
	recurring_one_time_flag: z.nullable(z.boolean()),
	recurring_revenue: z.nullable(z.number()),
	sequence_number: z.nullable(z.number()),
	serialized_cost_flag: z.nullable(z.boolean()),
	serialized_flag: z.nullable(z.boolean()),
	special_order_flag: z.nullable(z.boolean()),
	subcategory: z.nullable(z.string()),
	taxable_flag: z.nullable(z.boolean()),
	type: z.nullable(z.string()),
	unique_id: z.string(),
	unit_of_measure: z.nullable(z.string()),
	vendor: z.nullable(z.string()),
	products: z.array(z.nullable(z.string())),
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

const ProductForm = ({ product }: { product: Product }) => {
	const [billingCycles, setBillingCycles] = useState<ReferenceType[]>([]);
	const form = useForm<z.infer<typeof productFormSchema>>({
		resolver: zodResolver(productFormSchema),
		defaultValues: product,
	});

	useEffect(() => {
		getBillingCycles().then((data) => setBillingCycles(data));
	}, []);

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

		await updateProduct(product.unique_id, difference);
	}

	return (
		<SheetContent className='max-w-none sm:max-w-none w-[700px] space-y-4 flex-1 flex flex-col overflow-hidden'>
			<SheetHeader>
				<SheetTitle>Edit Product</SheetTitle>
				<SheetDescription>{getCurrencyString(product.calculated_price ?? product.price ?? 0)}</SheetDescription>
			</SheetHeader>
			<Form {...form}>
				<form
					id='product-update'
					name='product-update'
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8 h-full flex flex-col flex-1 overflow-auto px-[1px]'
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
												{/* @ts-ignore */}
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
															<InfoCircledIcon className='w-4 h-4 text-muted-foreground inline-block' />
															<IntegrationPricingCard description='Testing' id='' vendorSku='' setPrice={field.onChange} />
														</HoverCardTrigger>
													</HoverCard>
												</FormLabel>
												<FormControl className='relative'>
													<div className='relative'>
														<p className='absolute flex items-center my-auto left-3 h-9 text-sm select-none'>$</p>

														<Input
															type='number'
															min='0.01'
															step='0.01'
															{...form.register('price', { valueAsNumber: true })}
															className='pl-6'
															placeholder='0.00'
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='recurring_amount'
										render={() => (
											<FormItem>
												<FormLabel>Recurring Amount</FormLabel>
												<FormControl>
													<div className='relative'>
														<p className='absolute flex items-center my-auto left-3 h-9 text-sm select-none'>$</p>
														<Input
															type='number'
															min='0.01'
															step='0.01'
															{...form.register('recurring_amount', { valueAsNumber: true })}
															className='pl-6'
															placeholder='0.00'
														/>
													</div>
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
										render={() => (
											<FormItem>
												<FormLabel>Cost</FormLabel>
												<FormControl>
													<div className='relative'>
														<p className='absolute flex items-center my-auto left-3 h-9 text-sm select-none'>$</p>
														<Input
															type='number'
															min='0.01'
															step='0.01'
															className='pl-6'
															placeholder='Product name'
															{...form.register('cost', { valueAsNumber: true })}
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='recurring_cost'
										render={() => (
											<FormItem>
												<FormLabel>Recurring Cost</FormLabel>
												<FormControl>
													<div className='relative'>
														<p className='absolute flex items-center my-auto left-3 h-9 text-sm select-none'>$</p>
														<Input
															type='number'
															min='0.01'
															step='0.01'
															placeholder='0.00'
															{...form.register('recurring_cost', { valueAsNumber: true })}
															className='pl-6'
														/>
													</div>
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
												<Select onValueChange={field.onChange} defaultValue={String(field.value)}>
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
										render={() => (
											<FormItem>
												<FormLabel>Suggested Price</FormLabel>
												<FormControl>
													<div className='relative'>
														<p className='absolute flex items-center my-auto left-3 h-9 text-sm select-none'>$</p>
														<Input
															type='number'
															min='0.01'
															step='0.01'
															placeholder='0.00'
															{...form.register('suggested_price', { valueAsNumber: true })}
															className='pl-6'
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='recurring_suggested_price'
										render={() => (
											<FormItem>
												<FormLabel>Recurring Suggested Price</FormLabel>
												<FormControl>
													<div className='relative'>
														<p className='absolute flex items-center my-auto left-3 h-9 text-sm select-none'>$</p>
														<Input
															type='number'
															min='0.01'
															step='0.01'
															placeholder='0.00'
															{...form.register('recurring_suggested_price', { valueAsNumber: true })}
															className='pl-6'
														/>
													</div>
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
			<SheetFooter>
				<SubmitButton type='submit' form='product-update'>
					Save changes
				</SubmitButton>
				<SheetClose asChild></SheetClose>
			</SheetFooter>
		</SheetContent>
	);
};

export default ProductForm;
