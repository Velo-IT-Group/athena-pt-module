import React from 'react';
import { ZodArray, ZodNullable, ZodObject, ZodOptional, ZodTypeAny, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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

function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const productFormSchema = z.object({
	catalog_item_id: z.nullable(z.number()),
	cost: z.nullable(z.coerce.number()),
	extended_price: z.coerce.number(),
	id: z.string(),
	is_phase_item: z.nullable(z.boolean().default(false).optional()),
	is_recurring: z.nullable(z.boolean().default(false).optional()),
	is_taxable: z.nullable(z.boolean().default(false).optional()),
	manufacturing_part_number: z.nullable(z.string()),
	name: z.string(),
	notes: z.nullable(z.string()),
	price: z.nullable(z.coerce.number()),
	proposal: z.string(),
	quantity: z.number(),
	suggested_price: z.nullable(z.number()),
	vendor_name: z.nullable(z.string()),
	vendor_part_number: z.nullable(z.string()),
});

const ProductForm = ({ product }: { product: Product }) => {
	const form = useForm<z.infer<typeof productFormSchema>>({
		resolver: zodResolver(productFormSchema),
		defaultValues: { ...product, extended_price: product.extended_price ?? undefined },
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof productFormSchema>) {
		// formData.set
		console.log(values);
		//@ts-ignore
		delete values['extended_price'];
		await updateProduct(product.id ?? '', { ...values, price: values.price ?? undefined });
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
	}

	const zodKeys = (schema: ZodTypeAny, parentKey: string = ''): string[] => {
		if (schema === null || schema === undefined) return [];

		if (schema instanceof ZodNullable || schema instanceof ZodOptional) {
			return zodKeys(schema.unwrap(), parentKey);
		}

		if (schema instanceof ZodArray) {
			return zodKeys(schema.element, parentKey);
		}

		if (schema instanceof ZodObject) {
			const shape = schema.shape;

			return Object.keys(shape).flatMap((key) => {
				const newKey = parentKey ? `${parentKey}.${key}` : key;

				return zodKeys(shape[key], newKey);
			});
		}

		return [parentKey].filter(Boolean);
	};

	return (
		<SheetContent className='max-w-none sm:max-w-none w-[700px] space-y-4 flex-1 flex flex-col overflow-hidden'>
			<SheetHeader>
				<SheetTitle>Edit Product</SheetTitle>
				<SheetDescription>{getCurrencyString(product.extended_price ?? 0)}</SheetDescription>
			</SheetHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 h-full flex flex-col flex-1 overflow-auto'>
					<Collapsible defaultOpen>
						<section>
							<div className='flex items-center justify-between space-x-4 pr-4'>
								<h4 className='font-medium'>Content</h4>
								<CollapsibleTrigger asChild>
									<Button variant='ghost' size='sm'>
										<CaretSortIcon className='h-4 w-4' />
										<span className='sr-only'>Toggle</span>
									</Button>
								</CollapsibleTrigger>
							</div>
							<CollapsibleContent className='space-y-4'>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												{/* @ts-ignore */}
												<Input placeholder='Product name' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='manufacturing_part_number'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Manufacturing Part Number</FormLabel>
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

					<Collapsible defaultOpen>
						<section>
							<div className='flex items-center justify-between space-x-4 pr-4'>
								<h4 className='font-medium'>Details</h4>
								<CollapsibleTrigger asChild>
									<Button variant='ghost' size='sm'>
										<CaretSortIcon className='h-4 w-4' />
										<span className='sr-only'>Toggle</span>
									</Button>
								</CollapsibleTrigger>
							</div>
							<CollapsibleContent className='grid grid-cols-4 gap-4'>
								<FormField
									control={form.control}
									name='quantity'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Quantity</FormLabel>
											<FormControl>
												<Input type='number' className='pl-6' placeholder='Product name' {...field} />
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
												Price{' '}
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
														// @ts-ignore
														value={field?.value ?? undefined}
														className='pl-6'
														placeholder='Product name'
														{...field}
													/>
												</div>
											</FormControl>
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
												<div className='relative'>
													<p className='absolute flex items-center my-auto left-3 h-9 text-sm select-none'>$</p>
													{/* @ts-ignore */}
													<Input type='number' className='pl-6' placeholder='Product name' {...field} />
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='is_phase_item'
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
									name='cost'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Cost</FormLabel>
											<FormControl>
												<div className='relative'>
													<p className='absolute flex items-center my-auto left-3 h-9 text-sm select-none'>$</p>
													{/* @ts-ignore */}
													<Input type='number' className='pl-6' placeholder='Product name' {...field} />
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='is_phase_item'
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
									name='is_recurring'
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

								<FormField
									control={form.control}
									name='is_taxable'
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
							</CollapsibleContent>
						</section>
					</Collapsible>
				</form>
			</Form>
			<SheetFooter>
				<SheetClose asChild>
					<Button type='submit'>Save changes</Button>
				</SheetClose>
			</SheetFooter>
		</SheetContent>
	);
};

export default ProductForm;
