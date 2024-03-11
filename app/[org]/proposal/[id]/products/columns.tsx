'use client';
import React from 'react';
import { DataTableColumnHeader } from '@/components/ui/DataTableColumnHeader';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { CatalogItem } from '@/types/manage';
import { getCurrencyString } from '@/utils/money';
import { ChevronDownIcon, ChevronRightIcon, DotsHorizontalIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
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

declare module '@tanstack/react-table' {
	interface TableMeta<TData extends RowData> {
		updateProduct: typeof updateProduct;
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
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'manufacturer_part_number',
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title='Manufacturer Part Number' />;
		},
		cell: ({ row, table }) => {
			return (
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
						<div className='w-10 h-8'></div>
					)}

					<span>{row.getValue('manufacturer_part_number')}</span>

					{/* <div className='flex space-x-2' style={{ paddingLeft: `${row.depth * 2}rem` }}> */}
					{/* <Input
							onBlur={async (e) => {
								if (e.currentTarget.value !== manufacturer_part_number) {
									table.options.meta?.updateProduct(unique_id, { manufacturer_part_number: e.currentTarget.value });
								}
							}}
							className='border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none px-2 -mx-2 py-2 -my-2 w-48'
							defaultValue={row.getValue('manufacturer_part_number') ?? ''}
						/> */}
					{/* {row.original.product_class === 'Bundle' && <Badge variant='outline'>Bundle</Badge>} */}
					{/* @ts-ignore */}
					{/* <span className='max-w-[500px] truncate font-medium decoration-dashed underline decoration-muted-foreground '>
							{row.getValue('description')}
						</span> */}
					{/* </div> */}
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'description',
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title='Name' />;
		},
		cell: ({ row }) => {
			return (
				<div className='flex space-x-2 flex-1 max-w-[500px] w-full'>
					<span className='max-w-[500px] truncate font-medium decoration-dashed underline decoration-muted-foreground '>
						{row.getValue('description')}
					</span>
					{/* <Input
						onBlur={async (e) => {
							if (e.currentTarget.value !== row.getValue('description')) {
								table.options.meta?.updateProduct(unique_id, { description: e.currentTarget.value });
							}
						}}
						className='border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none px-2 -mx-2 py-2 -my-2 truncate font-medium flex-1'
						defaultValue={row.getValue('description')}
					/> */}
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
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
			return (
				<span className='text-right'>{getCurrencyString(row.getValue('price'))}</span>
				// <div className='relative'>
				// 	<p className='absolute flex items-center my-auto left-3 h-9 text-sm select-none'>$</p>
				// 	<Input
				// 		min='0.01'
				// 		step='0.01'
				// 		type='number'
				// 		onBlur={async (e) => {
				// 			if (e.currentTarget.valueAsNumber !== price) {
				// 				table.options.meta?.updateProduct(id, { price: e.currentTarget.valueAsNumber });
				// 			}
				// 		}}
				// 		className='border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none p-2 pl-6 w-full max-w-32'
				// 		defaultValue={price?.toFixed(2) ?? undefined}
				// 	/>
				// </div>
			);
		},
	},
	{
		accessorKey: 'quantity',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Quantity' />,
		cell: ({ row }) => {
			return (
				<span className='text-right justify-self-end'>{row.getValue('quantity')}</span>
				// <Input
				// 	onBlur={async (e) => {
				// 		if (e.currentTarget.valueAsNumber !== quantity) {
				// 			table.options.meta?.updateProduct(id, { quantity: e.currentTarget.valueAsNumber });
				// 		}
				// 	}}
				// 	type='number'
				// 	className='border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none p-2 max-w-32'
				// 	defaultValue={quantity ?? undefined}
				// />
			);
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
								<form action={async () => await deleteProduct(product.id)}>
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
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
			/>
		),
		cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />,
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
								{/* @ts-ignore */}
								{row.getValue('description') ?? row.original.catalogItem?.description ?? row.original.catalogItem?.identifier}
							</span>
						</div>
					</HoverCardTrigger>
				</div>

				<IntegrationPricingCard description={row.original.description} id={String(row.original.id)} vendorSku='' />
			</HoverCard>
		),
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
