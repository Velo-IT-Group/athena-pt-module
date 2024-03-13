'use client';
import { DataTableColumnHeader } from '@/components/ui/DataTableColumnHeader';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { getCurrencyString } from '@/utils/money';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import React from 'react';

const ProductList = ({ products }: { products: Product[] }) => {
	const columns: ColumnDef<Product>[] = [
		{
			accessorKey: 'description',
			header: ({ column }) => {
				return <DataTableColumnHeader column={column} title='Product' className='max-w-96' />;
			},
			cell: ({ row }) => {
				const price = row.original.price ?? 0;
				return (
					<div className='max-w-96'>
						<div className='font-medium text-sm truncate'>{row.getValue('description')}</div>
						<div className='text-muted-foreground text-sm'>{getCurrencyString(price)}</div>
					</div>
				);
			},
			enableSorting: false,
		},
		{
			accessorKey: 'quantity',
			header: ({ column }) => {
				return <DataTableColumnHeader column={column} title='Qty' className='text-center' />;
			},
			cell: ({ row }) => <span className='text-center'>{row.getValue('quantity')}</span>,
			enableSorting: false,
		},
		{
			accessorKey: 'calculated_price',
			header: ({ column }) => {
				return <DataTableColumnHeader column={column} title='Total' className='text-right justify-end' />;
			},
			cell: ({ row }) => <div className='text-right font-medium'>{getCurrencyString(row.getValue('calculated_price'))}</div>,
			enableSorting: false,
		},
		{
			id: 'actions',
			enableHiding: false,
			cell: ({ row }) => {
				const product = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' className='h-8 w-8 p-0'>
								<span className='sr-only'>Open menu</span>
								<DotsHorizontalIcon className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem className='text-red-500'>Remove product</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const table = useReactTable({
		data: products,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	return (
		<div className='w-full'>
			<div className=''>
				<Table>
					<TableBody>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header, index) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className='h-24 text-center'>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default ProductList;
