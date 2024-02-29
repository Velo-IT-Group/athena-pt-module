'use client';
import React from 'react';
import { DataTableColumnHeader } from '@/components/ui/DataTableColumnHeader';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { updateProduct } from '@/lib/functions/update';
import { CatalogItem } from '@/types/manage';
import { getCurrencyString } from '@/utils/money';
import { DotsHorizontalIcon, Pencil2Icon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import ProductForm from '@/components/forms/ProductForm';

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
		cell: ({ row }) => {
			const { id, manufacturing_part_number } = row.original;

			return (
				<Input
					onBlur={async (e) => {
						if (e.currentTarget.value !== manufacturing_part_number) {
							await updateProduct(id, { manufacturing_part_number: e.currentTarget.value });
						}
					}}
					className='border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none px-2 -mx-2 py-2 -my-2 min-w-60'
					defaultValue={manufacturing_part_number ?? ''}
				/>
			);
		},
	},
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ getValue, row, table }) => {
			const initialValue = getValue();
			const { id, name } = row.original;

			// const id = row.getValue('id') as string;
			// const name = row.getValue('name') as string;

			return (
				<Input
					onBlur={async (e) => {
						if (e.currentTarget.value !== name) {
							//  table.options.meta?.updateData(index, id, value);
							await updateProduct(id, { name });
						}
					}}
					className='border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none px-2 -mx-2 py-2 -my-2 min-w-60'
					defaultValue={name}
				/>
			);
		},
	},
	{
		accessorKey: 'price',
		header: () => <div className='text-right'>Price</div>,
		cell: ({ row }) => {
			const { id, price } = row.original;
			// const onBlur = () => {
			// 	table.options.meta?.updateData(index, id, value);
			// };

			// const amount = parseFloat(row.getValue('price'));

			return (
				<Input
					onBlur={async (e) => {
						if (e.currentTarget.valueAsNumber !== price) {
							await updateProduct(id, { price });
						}
					}}
					className='border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none p-2 text-right'
					defaultValue={price ?? undefined}
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
		cell: ({ row }) => <div>{row.getValue('description')}</div>,
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
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const payment = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<DotsHorizontalIcon className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(payment.id))}>Copy payment ID</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View customer</DropdownMenuItem>
						<DropdownMenuItem>View payment details</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
