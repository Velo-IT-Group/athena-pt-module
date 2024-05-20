'use client';
import React from 'react';
import { DataTableColumnHeader } from '@/components/ui/DataTableColumnHeader';
import { Button } from '@/components/ui/button';
import { CatalogItem } from '@/types/manage';
import { getCurrencyString } from '@/utils/money';
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, DragHandleDots2Icon, Pencil2Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { ColumnDef, RowData } from '@tanstack/react-table';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import IntegrationPricingCard from '@/components/IntegrationPricingCard';
import { updateProduct } from '@/lib/functions/update';
import { Badge } from '@/components/ui/badge';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteProduct } from '@/lib/functions/delete';
import { convertToProduct, convertToSnakeCase } from '@/utils/helpers';
import { createProduct } from '@/lib/functions/create';
import Link from 'next/link';
import CurrencyInput from '@/components/CurrencyInput';
import { Input } from '@/components/ui/input';

declare module '@tanstack/react-table' {
	interface TableMeta<TData extends RowData> {
		updateProduct?: typeof updateProduct;
		createProduct?: typeof createProduct;
		productInsert?: (product: ProductInsert, bundledItems?: ProductInsert[]) => Promise<void>;
	}
}

export const columns: ColumnDef<Product>[] = [
	{
		id: 'drag',
		enableHiding: false,
		cell: () => <DragHandleDots2Icon className='w-4 h-4' />,
	},
	{
		accessorKey: 'manufacturer_part_number',
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title='Manufacturer Part Number' />;
		},
		cell: ({ row }) => {
			return (
				<div className='flex items-center'>
					{row.getCanExpand() && (
						<>
							<Button
								variant='ghost'
								size='sm'
								{...{
									onClick: row.getToggleExpandedHandler(),
									style: { cursor: 'pointer' },
								}}
								className='inline-block'
							>
								{row.getIsExpanded() ? <ChevronDownIcon className='w-4 h-4' /> : <ChevronRightIcon className='w-4 h-4' />}
							</Button>
						</>
					)}

					<span className=''>{row.getValue('manufacturer_part_number') ?? row.original.identifier}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'description',
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title='Product Description' className='w-[500px]' />;
		},
		size: 500,
		cell: ({ row, table }) => {
			return (
				<span>
					<Input
						// className='max-w-[500px] truncate font-medium decoration-muted-foreground'
						className='w-[500px] border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none px-2 -mx-2 py-2 -my-2 truncate font-medium flex-1'
						defaultValue={row.getValue('description')}
						onBlur={(e) => {
							if (e.currentTarget.value !== row.getValue('description')) {
								table.options.meta?.updateProduct &&
									table.options.meta?.updateProduct(row.original.unique_id, { description: e.currentTarget.value });
							}
						}}
					/>
				</span>
				// <div className='flex space-x-2 flex-1 max-w-[500px] w-full'>
				// {/* <span className='max-w-[500px] truncate font-medium decoration-muted-foreground '>{row.getValue('description')}</span> */}
				// </div>
			);
		},
	},
	{
		accessorKey: 'cost',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Quote Item Cost' className='text-right w-[100px]' />,
		cell: ({ row, table }) => {
			const handleUpdate = async (amount: number | null | undefined) => {
				table.options.meta?.updateProduct && table.options.meta?.updateProduct(row.original.unique_id, { cost: amount });
			};

			const amount =
				row.subRows.length > 0
					? row.subRows.reduce((accumulator, currentValue) => {
							return (accumulator ?? 0) + (currentValue.original.cost ?? 0);
					  }, 0)
					: (row.getValue('cost') as number);

			return (
				<span className='text-right'>
					{row.subRows.length > 0 ? (
						<>{getCurrencyString(amount)}</>
					) : (
						<CurrencyInput
							handleBlurChange={handleUpdate}
							defaultValue={amount}
							className='w-[100px] border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none px-2 -mx-2 py-2 -my-2 truncate font-medium flex-1'
						/>
					)}
				</span>
			);
		},
	},
	{
		accessorKey: 'price',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Quote Item Price' className='text-right w-[100px]' />,
		cell: ({ row, table }) => {
			const handleUpdate = async (amount: number | null | undefined) => {
				table.options.meta?.updateProduct && table.options.meta?.updateProduct(row.original.unique_id, { price: amount });
			};

			const amount =
				row.subRows.length > 0
					? row.subRows.reduce((accumulator, currentValue) => {
							return (accumulator ?? 0) + (currentValue.original.price ?? 0);
					  }, 0)
					: (row.getValue('price') as number);

			return (
				<span className='text-right'>
					{row.subRows.length > 0 ? (
						<>{getCurrencyString(amount)}</>
					) : (
						<CurrencyInput
							handleBlurChange={handleUpdate}
							defaultValue={amount}
							className='w-[100px] border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none px-2 -mx-2 py-2 -my-2 truncate font-medium flex-1'
						/>
					)}
				</span>
			);
		},
	},
	{
		accessorKey: 'quantity',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Quantity' className='w-[100px]' />,
		cell: ({ row, table }) => {
			return (
				<span className='text-right justify-self-end'>
					{row.depth > 0 ? (
						table.getRowModel().rows.find((c) => c.original?.unique_id == row.parentId)?.original.quantity
					) : (
						<Input
							type='number'
							defaultValue={row.getValue('quantity')}
							onBlur={async (e) => {
								if (e.currentTarget.valueAsNumber !== row.original.quantity) {
									table.options.meta?.updateProduct &&
										table.options.meta?.updateProduct(row.original.unique_id, {
											quantity: e.currentTarget.valueAsNumber,
										});
								}
							}}
							className='w-[100px] border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none px-2 -mx-2 py-2 -my-2 truncate font-medium flex-1'
						/>
					)}
				</span>
			);
		},
	},
	{
		accessorKey: 'calculated_price',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Extended Price' className='w-[100px]' />,
		cell: ({ row }) => {
			const calculatedPrice = row.subRows.reduce((accumulator, currentValue) => {
				return (accumulator ?? 0) + (currentValue.original.price ?? 0);
			}, 0);

			const amount =
				row.subRows.length > 0 ? calculatedPrice * (row.original.quantity ?? 1) : (row.original.price ?? 0) * (row.original.quantity ?? 1);

			return <span className='w-[100px] text-right font-medium'>{getCurrencyString(amount)}</span>;
		},
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const product = row.original;

			return (
				<>
					<Button variant='ghost' className='h-8 w-8 p-0' asChild>
						<Link href={`products/${product.unique_id}`}>
							<span className='sr-only'>Open menu</span>
							<Pencil2Icon className='h-4 w-4' />
						</Link>
					</Button>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant='ghost' className='h-8 w-8 p-0'>
								<span className='sr-only'>Delete iem</span>
								<TrashIcon className='h-4 w-4' />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete the product from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<form action={async () => await deleteProduct(product.unique_id)}>
									<AlertDialogAction type='submit'>Continue</AlertDialogAction>
								</form>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</>
			);
		},
	},
];

export const catalogColumns: ColumnDef<CatalogItem>[] = [
	{
		id: 'select',
		cell: ({ row, table }) => (
			<div className='w-2'>
				<Button
					variant='ghost'
					size='sm'
					className='relative flex cursor-default select-none items-center'
					onClick={() => {
						row.toggleSelected(!!!row.getIsSelected());
						if (!!!row.getIsSelected()) {
							// @ts-ignore
							const snakedObj: ProductInsert = { ...convertToSnakeCase(row.original) };
							const newProduct = convertToProduct(snakedObj);

							const bundledItems = row.original.bundledItems?.map((b) => {
								// @ts-ignore
								const snakedObj = convertToSnakeCase(b);
								// @ts-ignore
								const snakedFixed = { ...snakedObj, id: b.catalogItem.id, version: '' };

								const newObj = convertToProduct(snakedFixed);
								console.log(snakedFixed);
								// @ts-ignore
								return newObj;
							});

							// @ts-ignore
							delete newProduct['bundled_items'];
							// @ts-ignore
							table.options?.meta?.productInsert(newProduct, bundledItems);
						}
					}}
				>
					<span className='flex h-3.5 w-3.5'>{row.getIsSelected() ? <CheckIcon className='h-4 w-4' /> : <PlusIcon className='h-4 w-4' />}</span>
				</Button>
			</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'identifier',
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title='ID' />;
		},
		cell: ({ row }) => <span>{row.getValue('identifier')}</span>,
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'description',
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title='Name' />;
		},
		cell: ({ row }) => (
			<HoverCard>
				<div className='flex items-center'>
					{row.getCanExpand() ? (
						<>
							<Button
								variant='ghost'
								size='sm'
								{...{
									onClick: row.getToggleExpandedHandler(),
									style: { cursor: 'pointer' },
								}}
								className='inline-block'
							>
								{row.getIsExpanded() ? <ChevronDownIcon className='w-4 h-4' /> : <ChevronRightIcon className='w-4 h-4' />}
							</Button>
						</>
					) : (
						<></>
					)}

					<HoverCardTrigger className='text-muted-foreground '>
						<div className='flex space-x-2' style={{ paddingLeft: `${row.depth * 2}rem` }}>
							{row.original.productClass === 'Bundle' && <Badge variant='outline'>Bundle</Badge>}
							<span className='max-w-[500px] truncate font-medium decoration-dashed underline decoration-muted-foreground '>
								{row.getValue('description')}
							</span>
						</div>
					</HoverCardTrigger>
				</div>

				<IntegrationPricingCard description={row.original.description ?? ''} id={String(row.original.id)} vendorSku='' />
			</HoverCard>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'cost',
		header: () => <div className='text-right'>Cost</div>,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('cost'));

			// Format the amount as a dollar amount
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(amount);

			return <div className='text-right font-medium'>{formatted}</div>;
		},
	},
	{
		accessorKey: 'price',
		header: () => <div className='text-right'>Price</div>,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('price'));

			return <div className='text-right font-medium'>{getCurrencyString(amount)}</div>;
		},
	},
];
