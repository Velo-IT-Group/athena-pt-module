'use client';
import React from 'react';
import { DataTableColumnHeader } from '@/components/ui/DataTableColumnHeader';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CatalogItem } from '@/types/manage';
import { getCurrencyString } from '@/utils/money';
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, Pencil2Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { ColumnDef, RowData } from '@tanstack/react-table';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import ProductForm from '@/components/forms/ProductForm';
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
import { convertToSnakeCase } from '@/utils/helpers';
import { ProductState } from '@/types/optimisticTypes';
import { createProduct } from '@/lib/functions/create';

declare module '@tanstack/react-table' {
	interface TableMeta<TData extends RowData> {
		updateProduct?: typeof updateProduct;
		createProduct?: typeof createProduct;
		productInsert?: (product: ProductInsert, bundledItems?: ProductInsert[]) => Promise<void>;
		mutate?: (action: ProductState) => void;
	}
}

export const columns: ColumnDef<Product>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
			/>
		),
		cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />,
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

					<span>{row.getValue('manufacturer_part_number') ?? row.original.identifier}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'description',
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title='Description' />;
		},
		cell: ({ row }) => {
			return (
				<div className='flex space-x-2 flex-1 max-w-[500px] w-full'>
					<span className='max-w-[500px] truncate font-medium decoration-muted-foreground '>{row.getValue('description')}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'category',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
		cell: ({ row, table }) => {
			return <span>{row.getValue('category')}</span>;
		},
	},
	{
		accessorKey: 'cost',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Cost' />,
		cell: ({ row, table }) => {
			return <span>{getCurrencyString(row.getValue('cost'))}</span>;
		},
	},
	{
		accessorKey: 'price',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Price' className='text-right' />,
		cell: ({ row, table }) => {
			return <span className='text-right'>{getCurrencyString(row.getValue('price'))}</span>;
		},
	},
	{
		accessorKey: 'quantity',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Quantity' />,
		cell: ({ row }) => {
			return <span className='text-right justify-self-end'>{row.getValue('quantity')}</span>;
		},
	},
	{
		accessorKey: 'calculated_price',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Calculated Price' />,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('calculated_price') ?? (row.original?.price ?? 0) * (row.original.quantity ?? 1));

			return <span className='text-right font-medium'>{getCurrencyString(amount)}</span>;
		},
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const product = row.original;

			return (
				<>
					<Sheet>
						<SheetTrigger asChild>
							<Button variant='ghost' className='h-8 w-8 p-0'>
								<span className='sr-only'>Open menu</span>
								<Pencil2Icon className='h-4 w-4' />
							</Button>
						</SheetTrigger>
						<ProductForm product={product} />
					</Sheet>
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
							const newProduct: ProductInsert = { ...convertToSnakeCase(row.original) };
							// @ts-ignore
							const bundledItems = row.original.bundledItems?.map((b) => convertToSnakeCase(b));
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

				<IntegrationPricingCard description={row.original.description} id={String(row.original.id)} vendorSku='' />
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

			// Format the amount as a dollar amount
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(amount);

			return <div className='text-right font-medium'>{formatted}</div>;
		},
	},
];
