'use client';
import React from 'react';
import { DataTableColumnHeader } from '@/components/ui/DataTableColumnHeader';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { CatalogItem } from '@/types/manage';
import { getCurrencyString } from '@/utils/money';
import { ChevronDownIcon, ChevronRightIcon, DotsHorizontalIcon, Pencil2Icon } from '@radix-ui/react-icons';
import { ColumnDef, RowData } from '@tanstack/react-table';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import ProductForm from '@/components/forms/ProductForm';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import IntegrationPricingCard from '@/components/IntegrationPricingCard';
import { updateProduct } from '@/lib/functions/update';
import { Badge } from '@/components/ui/badge';

declare module '@tanstack/react-table' {
	interface TableMeta<TData extends RowData> {
		updateProduct: typeof updateProduct;
	}
}

export const productColumns: ColumnDef<Product>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
				className='translate-y-[2px]'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label='Select row'
				className='translate-y-[2px]'
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'manufacturing_part_number',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Manufacturing Part Number' />,
		cell: ({ row, table }) => (
			<div className='w-48'>
				<Input
					onBlur={async (e) => {
						if (e.currentTarget.value !== row.getValue('manufacturing_part_number')) {
							table.options.meta?.updateProduct(row.original.id, { manufacturing_part_number: e.currentTarget.value });
						}
					}}
					className='border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none px-2 -mx-2 py-2 -my-2 '
					defaultValue={row.getValue('manufacturing_part_number')}
				/>
			</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
		cell: ({ row, table }) => {
			return (
				<div className='flex space-x-2'>
					{row.original.parent && <Badge variant='outline'>Bundle</Badge>}
					<div className='max-w-[500px] w-full truncate font-medium'>
						{/* {row.getValue('name')} */}
						<Input
							onBlur={async (e) => {
								if (e.currentTarget.value !== row.getValue('name')) {
									table.options.meta?.updateProduct(row.original.id, { name: e.currentTarget.value });
								}
							}}
							className='border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none px-2 -mx-2 py-2 -my-2 w-full max-w-none'
							defaultValue={row.getValue('name')}
						/>
					</div>
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'price',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Price' />,
		cell: ({ row }) => {
			return (
				<div className='flex w-[100px] items-center'>
					<span>{row.getValue('price')}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'quantity',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Quantity' />,
		cell: ({ row }) => {
			return (
				<div className='flex items-center'>
					{/* {priority.icon && <priority.icon className='mr-2 h-4 w-4 text-muted-foreground' />} */}
					<span>{row.getValue('quantity')}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'extended_price',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Extended Price' />,
		cell: ({ row }) => {
			return (
				<div className='flex items-center'>
					{/* {priority.icon && <priority.icon className='mr-2 h-4 w-4 text-muted-foreground' />} */}
					<span>{row.getValue('extended_price')}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		id: 'actions',
		cell: ({ row }) => (
			<Sheet>
				<SheetTrigger asChild>
					<Button variant='ghost' className='h-8 w-8 p-0'>
						<span className='sr-only'>Open menu</span>
						<Pencil2Icon className='h-4 w-4' />
					</Button>
				</SheetTrigger>
				<ProductForm product={row.original} />
			</Sheet>
		),
	},
];

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
		accessorKey: 'manufacturing_part_number',
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title='Manufacturing Part Number' />;
		},
		cell: ({ row, table }) => {
			const { id, manufacturing_part_number } = row.original;

			return (
				<Input
					onBlur={async (e) => {
						if (e.currentTarget.value !== manufacturing_part_number) {
							table.options.meta?.updateProduct(id, { manufacturing_part_number: e.currentTarget.value });
						}
					}}
					className='border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none px-2 -mx-2 py-2 -my-2 w-48'
					defaultValue={manufacturing_part_number ?? ''}
				/>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title='Name' />;
		},
		cell: ({ row, table }) => {
			const { id, name, parent } = row.original;

			return (
				<div className='flex space-x-2 flex-1 max-w-[500px] w-full'>
					{parent && <Badge variant='outline'>Bundle</Badge>}
					<Input
						onBlur={async (e) => {
							if (e.currentTarget.value !== name) {
								table.options.meta?.updateProduct(id, { name: e.currentTarget.value });
							}
						}}
						className='border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none px-2 -mx-2 py-2 -my-2 truncate font-medium flex-1'
						defaultValue={name}
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'price',
		header: () => <div className='pl-3'>Price</div>,
		cell: ({ row, table }) => {
			const { id, price } = row.original;

			return (
				<div className='relative'>
					<p className='absolute flex items-center my-auto left-3 h-9 text-sm select-none'>$</p>
					<Input
						min='0.01'
						step='0.01'
						type='number'
						onBlur={async (e) => {
							if (e.currentTarget.valueAsNumber !== price) {
								table.options.meta?.updateProduct(id, { price: e.currentTarget.valueAsNumber });
							}
						}}
						className='border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none p-2 pl-6 w-full max-w-32'
						defaultValue={price?.toFixed(2) ?? undefined}
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'quantity',
		header: () => <div>Quantity</div>,
		cell: ({ row, table }) => {
			const { id, quantity } = row.original;

			return (
				<Input
					onBlur={async (e) => {
						if (e.currentTarget.valueAsNumber !== quantity) {
							table.options.meta?.updateProduct(id, { quantity: e.currentTarget.valueAsNumber });
						}
					}}
					type='number'
					className='border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none p-2 max-w-32'
					defaultValue={quantity ?? undefined}
				/>
			);
		},
	},
	{
		accessorKey: 'extended_price',
		header: () => <div className='text-right'>Extended Price</div>,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('extended_price'));

			return <div className='text-right font-medium'>{getCurrencyString(amount)}</div>;
		},
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const product = row.original;

			return (
				<Sheet>
					<SheetTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<Pencil2Icon className='h-4 w-4' />
						</Button>
					</SheetTrigger>
					<ProductForm product={product} />
				</Sheet>
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
				{row.getCanExpand() ? (
					<>
						<Button
							variant='ghost'
							size='sm'
							{...{
								onClick: row.getToggleExpandedHandler(),
								style: { cursor: 'pointer' },
							}}
						>
							{row.getIsExpanded() ? <ChevronDownIcon className='w-4 h-4' /> : <ChevronRightIcon className='w-4 h-4' />}
						</Button>
					</>
				) : (
					<></>
				)}

				<HoverCardTrigger className='text-muted-foreground underline decoration-muted-foreground decoration-dashed'>
					<div className='flex space-x-2'>
						{row.original.productClass === 'Bundle' && <Badge variant='outline'>Bundle</Badge>}
						{/* @ts-ignore */}
						<span className='max-w-[500px] truncate font-medium'>{row.getValue('description') ?? row.original.catalogItem.description}</span>
					</div>
				</HoverCardTrigger>
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
